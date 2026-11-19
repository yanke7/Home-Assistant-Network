"""Sample resources visible to the Home Assistant process."""
from datetime import UTC, datetime, timedelta
import logging
from math import isfinite

import psutil

from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

_LOGGER = logging.getLogger(__name__)
_CPU_PROBES = ("coretemp", "k10temp", "zenpower", "cpu_thermal", "cpu-thermal",
               "soc_thermal", "bcm2835_thermal", "x86_pkg_temp", "fam15h_power")


def cpu_temperature():
    """Return the hottest CPU probe in Celsius when the OS exposes one."""
    read_temperatures = getattr(psutil, "sensors_temperatures", None)
    if read_temperatures is None:
        return None
    readings = [
        probe.current
        for group, probes in read_temperatures().items()
        for probe in probes
        if (group.lower() in _CPU_PROBES or "cpu" in probe.label.lower())
        and isfinite(probe.current)
    ]
    return round(max(readings), 1) if readings else None


def _read(label, read):
    """An inaccessible metric does not prevent the other readings."""
    try:
        return read()
    except (OSError, psutil.Error, NotImplementedError) as err:
        _LOGGER.debug("Could not read %s: %s", label, err)
        return None


def sample_host(config_dir):
    """Read host metrics off Home Assistant's event loop."""
    disk = _read("disk space", lambda: psutil.disk_usage(config_dir))
    return {
        "host_cpu": _read("CPU use", lambda: psutil.cpu_percent(interval=0.25)),
        "host_ram": _read("memory use", lambda: psutil.virtual_memory().percent),
        "host_disk_free": round(disk.free / 1024**3, 2) if disk else None,
        "disk_free_percent": round(100 * disk.free / disk.total, 1) if disk and disk.total else None,
        "host_temperature": _read("CPU temperature", cpu_temperature),
        "host_boot": _read("boot time", lambda: datetime.fromtimestamp(psutil.boot_time(), UTC)),
    }


class HostMonitor(DataUpdateCoordinator):
    """Share one host sample across the diagnostic sensors."""

    def __init__(self, hass, entry):
        super().__init__(
            hass,
            _LOGGER,
            config_entry=entry,
            name="Network Control host health",
            update_interval=timedelta(minutes=1),
        )

    async def _async_update_data(self):
        return await self.hass.async_add_executor_job(sample_host, self.hass.config.config_dir)
