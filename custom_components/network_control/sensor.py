"""Record successful Network Control speed test measurements."""
from homeassistant.components.sensor import (
    RestoreSensor,
    SensorDeviceClass,
    SensorEntity,
    SensorStateClass,
)
from homeassistant.const import EntityCategory
from homeassistant.helpers.update_coordinator import CoordinatorEntity
from homeassistant.core import callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect

from .host_monitor import HostMonitor
from .speed_test import RESULT_SIGNAL


async def async_setup_entry(hass, entry, async_add_entities):
    """Expose download, upload and ping history as Home Assistant sensors."""
    host = HostMonitor(hass, entry)
    await host.async_config_entry_first_refresh()
    async_add_entities([
        HostMeasurement(host, entry.entry_id, "host_cpu", "Host CPU", "%"),
        HostMeasurement(host, entry.entry_id, "host_ram", "Host Memory", "%"),
        HostMeasurement(host, entry.entry_id, "host_disk_free", "Host Disk Free", "GiB", SensorDeviceClass.DATA_SIZE),
        HostMeasurement(host, entry.entry_id, "host_temperature", "Host CPU Temperature", "°C", SensorDeviceClass.TEMPERATURE),
        HostMeasurement(host, entry.entry_id, "host_boot", "Host Boot Time", None, SensorDeviceClass.TIMESTAMP),
        SpeedMeasurement(entry.entry_id, "download", "Download", "Mbit/s"),
        SpeedMeasurement(entry.entry_id, "upload", "Upload", "Mbit/s"),
        SpeedMeasurement(entry.entry_id, "ping", "Ping", "ms"),
    ])


class SpeedMeasurement(RestoreSensor):
    """Hold the last successful measurement across restarts."""

    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(self, entry_id, key, label, unit):
        self._key = key
        self._attr_unique_id = f"{entry_id}_{key}"
        self._attr_name = f"Network Control {label}"
        self._attr_suggested_object_id = f"network_control_{key}"
        self._attr_native_unit_of_measurement = unit
        self._attr_native_value = None

    async def async_added_to_hass(self):
        """Restore the last measurement and subscribe to completed tests."""
        await super().async_added_to_hass()
        if (last := await self.async_get_last_sensor_data()) is not None:
            self._attr_native_value = last.native_value
        self.async_on_remove(async_dispatcher_connect(
            self.hass, RESULT_SIGNAL, self._receive_result
        ))

    @callback
    def _receive_result(self, results):
        self._attr_native_value = results[self._key]
        self.async_write_ha_state()


class HostMeasurement(CoordinatorEntity, SensorEntity):
    """Expose a sampled host resource to the dashboard and Recorder."""

    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, coordinator, entry_id, key, label, unit, device_class=None):
        super().__init__(coordinator)
        self._key = key
        self._attr_name = f"Network Control {label}"
        self._attr_unique_id = f"{entry_id}_{key}"
        self._attr_suggested_object_id = f"network_control_{key}"
        self._attr_native_unit_of_measurement = unit
        self._attr_device_class = device_class
        if unit:
            self._attr_state_class = SensorStateClass.MEASUREMENT

    @property
    def native_value(self):
        return self.coordinator.data[self._key]

    @property
    def available(self):
        return super().available and self.native_value is not None

    @property
    def extra_state_attributes(self):
        if self._key == "host_disk_free":
            return {"free_percent": self.coordinator.data["disk_free_percent"]}
        return None
