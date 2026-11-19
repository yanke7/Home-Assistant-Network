"""Serve the Network Control dashboard card."""
from pathlib import Path

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.const import Platform
from homeassistant.helpers import config_validation as cv

DOMAIN = "network_control"
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)
PLATFORMS = [Platform.SENSOR, Platform.BUTTON]
CARD_PATH = "/network_control/network-control.js"
CARD_URL = f"{CARD_PATH}?v=1.12.0"


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
    from .speed_test import SpeedTest

    entry.runtime_data = SpeedTest(hass)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    frontend.add_extra_js_url(hass, CARD_URL)
    return True


async def async_unload_entry(hass, entry):
    """Remove the frontend module registration."""
    if not await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        return False
    frontend.remove_extra_js_url(hass, CARD_URL)
    return True
