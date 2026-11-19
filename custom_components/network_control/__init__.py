"""Serve the Network Control dashboard card."""
from pathlib import Path

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig

DOMAIN = "network_control"
CARD_PATH = "/network_control/network-control.js"
CARD_URL = f"{CARD_PATH}?v=1.8.3"


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
    frontend.add_extra_js_url(hass, CARD_URL)
    return True


async def async_unload_entry(hass, entry):
    """Remove the frontend module registration."""
    frontend.remove_extra_js_url(hass, CARD_URL)
    return True
