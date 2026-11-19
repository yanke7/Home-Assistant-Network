"""Run an on-demand internet speed test from the Home Assistant host."""
import asyncio
from math import isfinite

import speedtest

from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.dispatcher import async_dispatcher_send

RESULT_SIGNAL = "network_control_speed_test_result"


def measure():
    """Measure bandwidth in Mbps and round-trip latency in milliseconds."""
    client = speedtest.Speedtest(timeout=10, secure=True)
    client.get_best_server()
    results = {
        "download": client.download() / 1_000_000,
        "upload": client.upload() / 1_000_000,
        "ping": client.results.ping,
    }
    if not all(isfinite(value) and value >= 0 for value in results.values()):
        raise ValueError("Invalid speed test results")
    return {key: round(value, 2) for key, value in results.items()}


class SpeedTest:
    """Allow only one bandwidth test at a time for this entry."""

    def __init__(self, hass):
        self.hass = hass
        self.lock = asyncio.Lock()

    async def async_run(self):
        """Run the test off the event loop and publish successful readings."""
        if self.lock.locked():
            raise HomeAssistantError("A Network Control speed test is already running")
        async with self.lock:
            try:
                results = await self.hass.async_add_executor_job(measure)
            except (speedtest.SpeedtestException, OSError, ValueError) as err:
                raise HomeAssistantError(f"Network Control speed test failed: {err}") from err
            async_dispatcher_send(self.hass, RESULT_SIGNAL, results)
