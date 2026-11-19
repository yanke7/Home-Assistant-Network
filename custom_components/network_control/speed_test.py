"""Run an on-demand internet speed test from the Home Assistant host."""
import asyncio
from datetime import timedelta
import logging
from math import isfinite

import speedtest

from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.event import async_track_time_interval

_LOGGER = logging.getLogger(__name__)
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
        self._cancel_timer = None

    def schedule(self, minutes):
        """Replace the current schedule. Zero disables automatic tests."""
        self.cancel_schedule()
        if minutes:
            self._cancel_timer = async_track_time_interval(
                self.hass, self._scheduled_run, timedelta(minutes=minutes)
            )

    def cancel_schedule(self):
        """Remove the interval listener."""
        if self._cancel_timer is not None:
            self._cancel_timer()
            self._cancel_timer = None

    async def _scheduled_run(self, _now):
        """Skip overlapping runs and keep the scheduler alive after failures."""
        if self.lock.locked():
            return
        try:
            await self.async_run()
        except HomeAssistantError as err:
            _LOGGER.warning("Scheduled speed test failed: %s", err)

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
