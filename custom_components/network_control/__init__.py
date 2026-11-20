"""Serve the Network Control dashboard card."""
from pathlib import Path

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.const import Platform
from homeassistant.helpers import config_validation as cv

from .const import DEFAULT_SPEED_TEST_INTERVAL, SPEED_TEST_INTERVAL
from .speed_test import SpeedTest

DOMAIN = "network_control"
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)
PLATFORMS = [Platform.SENSOR, Platform.BUTTON, Platform.EVENT]
CARD_PATH = "/network_control/network-control.js"
CARD_URL = f"{CARD_PATH}?v=1.20.2"


async def async_setup(hass, config):
    """Register the card and its stylesheet once per process."""
    assets = Path(__file__).parent / "www"
    await hass.http.async_register_static_paths([
        StaticPathConfig(CARD_PATH, str(assets / "network-control.js"), False),
        StaticPathConfig("/network_control/network-control.css",
                         str(assets / "network-control.css"), False),
    ])
    return True


async def async_setup_entry(hass, entry):
    """Load the card in the frontend."""
    entry.runtime_data = SpeedTest(hass)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    await _update_schedule(hass, entry)
    entry.async_on_unload(entry.runtime_data.cancel_schedule)
    entry.async_on_unload(entry.add_update_listener(_update_schedule))
    frontend.add_extra_js_url(hass, CARD_URL)
    return True


async def _update_schedule(_hass, entry):
    """Apply the configured interval without restarting the integration."""
    entry.runtime_data.schedule(
        entry.options.get(SPEED_TEST_INTERVAL, DEFAULT_SPEED_TEST_INTERVAL)
    )


async def async_unload_entry(hass, entry):
    """Remove the frontend module registration."""
    if not await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        return False
    frontend.remove_extra_js_url(hass, CARD_URL)
    return True
