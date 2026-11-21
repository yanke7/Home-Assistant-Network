# Network Control automation examples

Create an automation in Home Assistant, open **Edit in YAML**, and paste an example. Replace `notify.mobile_app_your_phone` with your notification action. If you renamed an entity, update its ID in the example.

## Alert when a new device is discovered

Network Control reports the first registration of a device detected by built-in discovery or optional Nmap Tracker.

```yaml
alias: Alert on a new network device
triggers:
  - trigger: state
    entity_id: event.network_control_new_device
    not_to:
      - unknown
      - unavailable
conditions:
  - condition: template
    value_template: >
      {% set seen = as_datetime(trigger.to_state.state, none) %}
      {{ trigger.to_state.attributes.event_type == 'device_discovered'
         and seen is not none
         and 0 <= (now() - seen).total_seconds() < 30 }}
actions:
  - action: notify.mobile_app_your_phone
    data:
      title: New network device
      message: >
        {{ trigger.to_state.attributes.device_name }}
        ({{ trigger.to_state.attributes.discovered_entity_id }})
mode: queued
```

## Alert when download speed drops

Choose a threshold that makes sense for your connection. This example alerts when a built-in test moves below 25 Mbps.

```yaml
alias: Alert on slow download speed
triggers:
  - trigger: numeric_state
    entity_id: sensor.network_control_download
    below: 25
actions:
  - action: notify.mobile_app_your_phone
    data:
      title: Slow download speed
      message: "The latest speed test measured {{ trigger.to_state.state }} Mbps down."
mode: single
```

## Run a speed test at a fixed time

If you only want this daily test, set the automatic interval to **0** in Network Control’s **Settings**.

```yaml
alias: Run a daily internet speed test
triggers:
  - trigger: time
    at: "06:00:00"
actions:
  - action: button.press
    target:
      entity_id: button.network_control_run_speed_test
mode: single
```

## Alert when host CPU stays high

The built-in CPU sensor reports an average over each minute. This example sends a notification after CPU usage stays above 80% for five minutes. Adjust the threshold and duration for your host.

```yaml
alias: Alert on sustained Home Assistant CPU usage
triggers:
  - trigger: numeric_state
    entity_id: sensor.network_control_host_cpu
    above: 80
    for:
      minutes: 5
actions:
  - action: notify.mobile_app_your_phone
    data:
      title: High Home Assistant CPU usage
      message: "CPU usage is {{ trigger.to_state.state }}% after five minutes above 80%."
mode: single
```
