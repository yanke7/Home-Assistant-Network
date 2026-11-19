"""Record successful Network Control speed test measurements."""
from homeassistant.components.sensor import RestoreSensor, SensorStateClass
from homeassistant.core import callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect

from .speed_test import RESULT_SIGNAL


async def async_setup_entry(hass, entry, async_add_entities):
    """Expose download, upload and ping history as Home Assistant sensors."""
    async_add_entities([
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
