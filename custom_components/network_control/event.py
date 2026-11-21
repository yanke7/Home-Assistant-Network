"""Expose new network discoveries to Home Assistant automations."""
from homeassistant.components.event import EventEntity
from homeassistant.core import callback
from homeassistant.helpers import device_registry as dr, entity_registry as er


async def async_setup_entry(hass, entry, async_add_entities):
    """Expose an event entity for new network devices."""
    async_add_entities([NewNetworkDevice(entry.entry_id)])


class NewNetworkDevice(EventEntity):
    """Emit one event when discovery registers a device tracker."""

    _attr_name = "Network Control New Device"
    _attr_suggested_object_id = "network_control_new_device"
    _attr_event_types = ["device_discovered"]
    _attr_icon = "mdi:lan-connect"

    def __init__(self, entry_id):
        self._attr_unique_id = f"{entry_id}_new_device"

    async def async_added_to_hass(self):
        await super().async_added_to_hass()
        self.async_on_remove(self.hass.bus.async_listen(
            er.EVENT_ENTITY_REGISTRY_UPDATED, self._registry_updated
        ))

    @callback
    def _registry_updated(self, event):
        if event.data["action"] != "create":
            return
        entity_id = event.data["entity_id"]
        if not entity_id.startswith("device_tracker."):
            return
        registry = er.async_get(self.hass)
        entry = registry.async_get(entity_id)
        if entry is None or entry.platform not in {"network_control", "nmap_tracker"}:
            return
        other = "nmap_tracker" if entry.platform == "network_control" else "network_control"
        if registry.async_get_entity_id("device_tracker", other, entry.unique_id.lower()):
            return
        name = entry.name
        if name is None and entry.platform == "network_control":
            devices = dr.async_get(self.hass).async_get_devices(
                connections={(dr.CONNECTION_NETWORK_MAC, entry.unique_id.lower())}
            )
            name = next((device.name_by_user for device in devices if device.name_by_user), None)
            if name is None:
                name = next((device.name for device in devices if device.name), None)
        self._trigger_event(
            "device_discovered",
            {
                "discovered_entity_id": entity_id,
                "device_name": name or entry.original_name or entity_id,
            },
        )
        self.async_write_ha_state()
