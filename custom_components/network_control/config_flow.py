"""Set up Network Control from Devices & services."""
import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import callback

from . import DOMAIN
from .const import DEFAULT_SPEED_TEST_INTERVAL, SPEED_TEST_INTERVAL


class NetworkControlConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Create a single local entry."""

    VERSION = 1

    async def async_step_user(self, user_input=None):
        """Confirm installation."""
        self._async_abort_entries_match()
        if user_input is not None:
            return self.async_create_entry(title="Network Control", data={})
        return self.async_show_form(step_id="user")

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        """Provide the speed-test scheduling options."""
        return NetworkControlOptionsFlow()


class NetworkControlOptionsFlow(config_entries.OptionsFlow):
    """Configure the built-in speed-test interval."""

    async def async_step_init(self, user_input=None):
        """Save the interval in minutes."""
        if user_input is not None:
            return self.async_create_entry(
                title="", data={**self.config_entry.options, **user_input}
            )
        interval = self.config_entry.options.get(
            SPEED_TEST_INTERVAL, DEFAULT_SPEED_TEST_INTERVAL
        )
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema({
                vol.Required(SPEED_TEST_INTERVAL, default=interval):
                    vol.All(int, vol.Range(min=0, max=10080)),
            }),
        )
