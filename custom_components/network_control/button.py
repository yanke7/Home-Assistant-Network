"""Network Control speed test button."""
from homeassistant.components.button import ButtonEntity


async def async_setup_entry(hass, entry, async_add_entities):
    """Expose the test button."""
    async_add_entities([RunSpeedTest(entry)])


class RunSpeedTest(ButtonEntity):
    """Run a speed test from Home Assistant."""

    _attr_name = "Network Control Run Speed Test"
    _attr_suggested_object_id = "network_control_run_speed_test"
    _attr_icon = "mdi:speedometer"

    def __init__(self, entry):
        self._attr_unique_id = f"{entry.entry_id}_run_speed_test"
        self._test = entry.runtime_data

    async def async_press(self):
        """Wait for the test to finish or report an error."""
        await self._test.async_run()
