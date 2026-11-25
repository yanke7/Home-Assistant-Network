"""Discover IPv4 neighbors visible to the Home Assistant host."""

from datetime import UTC, datetime, timedelta
from ipaddress import IPv4Address
from pathlib import Path
import re

from homeassistant.core import callback
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.helpers.device_registry import CONNECTION_NETWORK_MAC, DeviceInfo
from homeassistant.helpers.event import async_track_time_interval

try:
    from homeassistant.components.device_tracker import ScannerEntity
except ImportError:  # Older supported Home Assistant releases.
    from homeassistant.components.device_tracker.config_entry import ScannerEntity

POLL_INTERVAL = timedelta(seconds=30)
ABSENCE_GRACE = timedelta(minutes=5)
MAC_ADDRESS = re.compile(r"(?:[0-9a-f]{2}:){5}[0-9a-f]{2}")


def read_neighbors(path=Path("/proc/net/arp")):
    """Read completed ARP entries, or return None when the table is unavailable."""
    try:
        rows = path.read_text(encoding="ascii").splitlines()[1:]
    except (OSError, UnicodeError):
        return None

    neighbors = {}
    for row in rows:
        fields = row.split()
        if len(fields) != 6:
            continue
        address, _, flags, mac, _, _ = fields
        mac = mac.lower()
        try:
            ip = IPv4Address(address)
            complete = int(flags, 16) & 2
        except ValueError:
            continue
        if (
            complete and MAC_ADDRESS.fullmatch(mac)
            and mac != "00:00:00:00:00:00" and not int(mac[:2], 16) & 1
            and not (ip.is_multicast or ip.is_loopback or ip.is_unspecified)
        ):
            neighbors[mac] = str(ip)
    return neighbors


async def async_setup_entry(hass, entry, async_add_entities):
    """Restore the tracked inventory and periodically sample the local cache."""
    registry = er.async_get(hass)
    device_registry = dr.async_get(hass)
    devices = {}
    for entity in er.async_entries_for_config_entry(registry, entry.entry_id):
        if entity.domain != "device_tracker" or entity.platform != "network_control":
            continue
        mac = entity.unique_id
        device = device_registry.async_get(entity.device_id) if entity.device_id else None
        owner = getattr(device, "config_entry_id", None)
        needs_name = (
            device is not None
            and (owner == entry.entry_id if owner is not None
                 else device.config_entries == {entry.entry_id})
            and not device.name_by_user
            and device.name in (None, "", "Network Control")
            and (CONNECTION_NETWORK_MAC, mac) in device.connections
        )
        if needs_name:
            device_registry.async_update_device(device.id, name=local_device_name(mac))
        devices[mac] = LocalDevice(
            mac, registered_device=device is not None and not needs_name
        )

    def legacy_tracker(mac):
        entity_id = registry.async_get_entity_id("device_tracker", "nmap_tracker", mac)
        return registry.async_get(entity_id) if entity_id else None

    def has_enabled_legacy_source(mac):
        legacy = legacy_tracker(mac)
        if legacy is None or not legacy.config_entry_id:
            return False
        legacy_entry = hass.config_entries.async_get_entry(legacy.config_entry_id)
        return legacy_entry is not None and legacy_entry.disabled_by is None

    def create_device(mac):
        legacy = legacy_tracker(mac)
        previously_tracked = legacy is not None and legacy.disabled_by == "config_entry"
        known_device = device_registry.async_get_device(
            connections={(CONNECTION_NETWORK_MAC, mac)}
        )
        return LocalDevice(
            mac,
            previously_tracked=previously_tracked,
            registered_device=known_device is not None,
        )

    for mac in devices:
        legacy = legacy_tracker(mac)
        if legacy is None or legacy.disabled_by != "config_entry":
            continue
        native_id = registry.async_get_entity_id("device_tracker", "network_control", mac)
        native = registry.async_get(native_id) if native_id else None
        if native is not None and native.disabled_by == "integration":
            registry.async_update_entity(native.entity_id, disabled_by=None)

    initial = await hass.async_add_executor_job(read_neighbors)
    now = datetime.now(UTC)
    for mac, ip in (initial or {}).items():
        if mac in devices or not has_enabled_legacy_source(mac):
            if mac not in devices:
                devices[mac] = create_device(mac)
            devices[mac].observe(ip, now)
    async_add_entities(list(devices.values()))

    stopped = False

    async def discover(now):
        neighbors = await hass.async_add_executor_job(read_neighbors)
        if stopped or neighbors is None:
            return
        added = []
        for mac, ip in neighbors.items():
            if mac not in devices:
                if has_enabled_legacy_source(mac):
                    continue
                devices[mac] = create_device(mac)
                added.append(devices[mac])
            devices[mac].observe(ip, now)
        if added:
            async_add_entities(added)
        for device in devices.values():
            device.refresh(now)

    unsubscribe = async_track_time_interval(hass, discover, POLL_INTERVAL)

    def stop():
        nonlocal stopped
        stopped = True
        unsubscribe()

    entry.async_on_unload(stop)


def local_device_name(mac):
    """Return a unique, stable display label even if the IP changes."""
    return f"Network device ({mac})"


class LocalDevice(ScannerEntity):
    """Maintain one Home Assistant tracker per local MAC address."""

    _attr_should_poll = False
    _attr_entity_registry_enabled_default = False

    def __init__(self, mac, *, previously_tracked=False, registered_device=False):
        self._attr_entity_registry_enabled_default = previously_tracked
        self._attr_unique_id = mac
        self._attr_mac_address = mac
        self._attr_name = f"Network device {mac.replace(':', '')[-6:].upper()}"
        self._attr_device_info = DeviceInfo(connections={(CONNECTION_NETWORK_MAC, mac)})
        if not registered_device:
            self._attr_device_info["name"] = local_device_name(mac)
        self._ip = None
        self._seen = None
        self._connected = False

    @property
    def ip_address(self):
        """Return the most recently observed IPv4 address."""
        return self._ip

    @property
    def is_connected(self):
        """Report whether the device has a recent neighbor entry."""
        return self._connected

    @property
    def extra_state_attributes(self):
        """Expose the last observation for the dashboard."""
        return {"last_time_reachable": self._seen.isoformat()} if self._seen else {}

    @callback
    def observe(self, ip, now):
        """Remember a completed neighbor entry."""
        self._ip = ip
        self._seen = now
        self._connected = True

    @callback
    def refresh(self, now):
        """Expire observations after a grace period."""
        self._connected = self._seen is not None and now - self._seen < ABSENCE_GRACE
        if self.hass is not None:
            self.async_write_ha_state()
