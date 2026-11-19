"""Set up Network Control from Devices & services."""
from homeassistant import config_entries

from . import DOMAIN


class NetworkControlConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Create a single local entry."""

    VERSION = 1

    async def async_step_user(self, user_input=None):
        """Confirm installation."""
        self._async_abort_entries_match()
        if user_input is not None:
            return self.async_create_entry(title="Network Control", data={})
        return self.async_show_form(step_id="user")
