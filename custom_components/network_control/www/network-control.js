(() => {
  const esc = (v) =>
    String(v ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const stylesheet = new URL("./network-control.css", import.meta.url).href;
  const speedDefaults = [
    "sensor.speedtest_download",
    "sensor.speedtest_upload",
    "sensor.speedtest_ping",
  ];
  const missing = "Entity not configured";
  const available = (state) =>
    state && !["unknown", "unavailable", ""].includes(state.state);
  const colors = [
    "var(--yanke-accent)",
    "var(--yanke-success)",
    "var(--yanke-warning)",
  ];
  const field = (name, label, selector, helper) => ({
    name,
    label,
    selector,
    helper,
  });
  const entity = (name, label, domains, multiple = false, helper) =>
    field(name, label, { entity: { domain: domains, multiple } }, helper);
  const toggle = (name, label, helper) =>
    field(name, label, { boolean: {} }, helper);
  const group = (name, title, schema) => ({
    type: "expandable",
    name,
    title,
    flatten: true,
    schema,
  });

  const form = [
    group("layout", "Layout and privacy", [
      field(
        "title",
        "Dashboard heading",
        { text: {} },
        "Leave blank for Network / control.",
      ),
      toggle("hide_connection", "Hide connection speed and history"),
      toggle("hide_personal", "Hide personal devices"),
      toggle(
        "hide_printer",
        "Hide printer supplies",
        "Already hidden when no ink or toner sensors are found.",
      ),
      toggle("hide_scanner", "Hide network scanner"),
      toggle("hide_host", "Hide host health"),
      toggle("hide_dns", "Hide DNS and ad blocking"),
      toggle("hide_remote", "Hide remote access and SSL"),
      toggle("hide_controls", "Hide network controls"),
      toggle("show_wan_ip", "Show public WAN address"),
      toggle("show_mac", "Show device MAC addresses"),
    ]),
    group("internet", "Internet connection and router", [
      field("router_name", "Router display name", { text: {} }),
      entity("router_entity", "Router entity", [
        "sensor",
        "binary_sensor",
        "device_tracker",
      ]),
      entity("wan_sensor", "WAN address sensor", "sensor"),
      entity(
        "download_sensor",
        "Download speed sensor",
        "sensor",
        false,
        "Leave blank to use the default Speedtest.net download sensor.",
      ),
      entity("upload_sensor", "Upload speed sensor", "sensor"),
      entity("latency_sensor", "Latency sensor", "sensor"),
      field(
        "latency_max_ms",
        "Latency chart limit",
        {
          number: { min: 10, step: 1, mode: "box", unit_of_measurement: "ms" },
        },
        "Defaults to 500 ms.",
      ),
      entity("speedtest_action_entity", "Run speed test button or script", [
        "button",
        "script",
      ]),
    ]),
    group("devices", "Personal devices, printers and scanner", [
      entity(
        "personal_entities",
        "Personal devices and readings",
        ["person", "device_tracker", "sensor", "binary_sensor"],
        true,
        "Leave blank for automatic discovery.",
      ),
      entity(
        "printer_entities",
        "Ink and toner sensors",
        "sensor",
        true,
        "Leave blank for automatic discovery.",
      ),
      field(
        "scan_subnet",
        "Scanner label",
        { text: {} },
        "Changes the label shown on the dashboard. Configure scanning in Nmap Tracker.",
      ),
    ]),
    group("system", "Host health", [
      entity("cpu_sensor", "CPU usage", "sensor"),
      entity("memory_sensor", "RAM usage", "sensor"),
      entity("disk_sensor", "Disk free space", "sensor"),
      entity("temperature_sensor", "CPU temperature", "sensor"),
      entity("uptime_sensor", "System uptime", "sensor"),
    ]),
    group("access", "DNS and remote access", [
      entity("dns_queries_sensor", "DNS query count", "sensor"),
      entity("dns_blocked_sensor", "Ads blocked percentage", "sensor"),
      entity("remote_access_entity", "Remote access or VPN status", [
        "sensor",
        "binary_sensor",
      ]),
      entity("ssl_entity", "SSL certificate expiry", [
        "sensor",
        "binary_sensor",
      ]),
    ]),
    group("control", "Network controls", [
      entity("pihole_switch", "Pi-hole blocking switch", "switch"),
      entity("dns_pause_script", "DNS pause script", "script"),
      entity("router_reboot_entity", "Router reboot button or script", [
        "button",
        "script",
      ]),
      entity("guest_wifi_entity", "Guest Wi-Fi switch", "switch"),
      entity(
        "wake_entities",
        "Wake-on-LAN buttons, switches or scripts",
        ["button", "switch", "script"],
        true,
      ),
      toggle("enable_restart", "Enable Home Assistant restart"),
      entity("host_reboot_entity", "Host reboot button or script", [
        "button",
        "script",
      ]),
    ]),
  ];
  class NetworkConsole extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.reg = {};
      this.scan = {
        tab: "devices",
        filter: "all",
        q: "",
        editing: null,
        events: [],
        lastIp: {},
        sig: "",
      };
      this.shadowRoot.addEventListener("click", (e) => {
        const action = e.target.closest("[data-action]");
        if (action) {
          if (this.preview) return;
          this.runAction(action);
          return;
        }
        if (this.scanClick(e)) return;
        const b = e.target.closest("[data-entity]");
        if (b)
          this.dispatchEvent(
            new CustomEvent("hass-more-info", {
              detail: { entityId: b.dataset.entity },
              bubbles: true,
              composed: true,
            }),
          );
      });
    }
    setConfig(config) {
      const scannerWasHidden = this.config?.hide_scanner;
      const before = JSON.stringify([
        this.speed,
        this.latencyCap,
        this.config?.hide_connection,
      ]);
      this.config = config;
      this.speed = ["download_sensor", "upload_sensor", "latency_sensor"].map(
        (key, index) => config[key] || speedDefaults[index],
      );
      const cap = Number(config.latency_max_ms ?? 500);
      this.latencyCap = Number.isFinite(cap) && cap >= 10 ? cap : 500;
      if (this.root) {
        if (scannerWasHidden && !config.hide_scanner && !this.regOk) {
          this.loadRegistry().then(() => this.loadActivity());
        }
        this.update();
        this.renderScan(true);
        if (
          before !==
          JSON.stringify([this.speed, this.latencyCap, config.hide_connection])
        ) {
          this.loadHistory();
        }
      }
    }
    static getConfigForm() {
      return {
        schema: form,
        computeLabel: (field) => field.label,
        computeHelper: (field) => field.helper,
      };
    }
    static getStubConfig() {
      return { latency_max_ms: 500 };
    }
    getCardSize() {
      return 12;
    }
    set hass(hass) {
      this._hass = hass;
      if (!this.root) {
        this.build();
        this.loadHistory();
        this.loadRegistry().then(() => this.loadActivity());
      }
      this.update();
      this.renderScan();
    }
    connectedCallback() {
      this.timer = setInterval(() => {
        if (this._hass) {
          this.loadHistory();
          this.update();
        }
      }, 300000);
      this.scanTimer = setInterval(() => {
        if (this._hass && this.root) {
          this.loadRegistry().then(() => this.loadActivity());
        }
      }, 60000);
    }
    disconnectedCallback() {
      clearInterval(this.timer);
      clearInterval(this.scanTimer);
    }
    state(id) {
      return this._hass.states[id];
    }
    value(id, d = 0) {
      const s = this.state(id);
      return s &&
        !["unknown", "unavailable", ""].includes(s.state) &&
        Number.isFinite(Number(s.state))
        ? Number(s.state).toFixed(d)
        : "—";
    }
    build() {
      this.shadowRoot.innerHTML = `<link rel="stylesheet" href="${stylesheet}"><div class="shell"><div class="wrap"><header><h1 id="dashboard-title">Network<span> / </span>control</h1><div class="head-right"><div class="topline"><span id="router"></span><span class="ip" id="ip"></span></div></div></header><div class="grid"><div class="metrics" id="speed-metrics">${["Download", "Upload", "Latency"].map((n, i) => `<button class="metric" data-entity="${esc(this.speed[i])}"><div class="label">${n}<span style="color:${colors[i]}">${["↓", "↑", "↔"][i]}</span></div><div class="value" style="color:${colors[i]}"><span id="v${i}">—</span><span class="unit">${i === 2 ? "ms" : "Mbps"}</span></div><div class="sub" id="s${i}"></div></button>`).join("")}</div><div class="main" id="main"><section class="panel hist" id="history"><div class="heading"><h2>Connection history</h2><span class="tag">LAST 24 HOURS</span></div><div class="chart"><div class="legend">${["Download", "Upload", "Latency"].map((n, i) => `<span><i style="background:${colors[i]}"></i>${n}</span>`).join("")}</div><div class="plotwrap"><div class="plot" id="plot"><div class="empty">Loading history…</div></div><span class="yl tl" id="yl0"></span><span class="yl bl" id="yl1"></span><span class="yl tr" id="yl2"></span><span class="yl br" id="yl3"></span></div><div class="axis"><span>24h ago</span><span>12h ago</span><span>Now</span></div><div class="chartnote" id="chartnote">Recorded speed tests · Mbps left / ms right</div></div></section><div class="side" id="side"><section class="panel" id="personal-panel"><div class="heading"><h2>Personal devices</h2></div><div id="personal" class="readings"></div></section><section class="panel" id="printers" hidden><div class="heading"><h2>Printer supplies</h2></div><div id="supplies" class="readings"></div></section></div></div><section class="panel scan" id="scanner"><div class="heading"><h2>Network scanner</h2><span class="tag" id="scantag">${esc(this.config.scan_subnet || "Local network")}</span></div><div class="scanstats">${[
        ["online", "Online", "ok"],
        ["offline", "Dropped off", "warn"],
        ["unnamed", "Unnamed", ""],
      ]
        .map(
          (f) =>
            `<button class="stat" data-filter="${f[0]}"><b class="${f[2]}" id="n_${f[0]}">—</b><small>${f[1]}</small></button>`,
        )
        .join(
          "",
        )}</div><div class="scanbar"><div class="tabs"><button data-tab="devices" class="on">Devices</button><button data-tab="activity">Activity</button></div><input class="search" id="scansearch" type="search" placeholder="Filter devices" aria-label="Filter devices"></div><div id="pending"></div><div class="scanlist" id="scanlist"><div class="none">Loading devices…</div></div><div class="scanfoot"><span id="scanfoot"></span><span id="scanerr"></span></div></section><div class="support" id="support">
 <section class="panel" id="host-panel"><div class="heading"><h2>Host health</h2></div><div id="host" class="readings"></div></section>
 <section class="panel" id="dns-panel"><div class="heading"><h2>DNS &amp; ad blocking</h2></div><div id="dns" class="readings"></div></section>
 <section class="panel" id="remote-panel"><div class="heading"><h2>Remote access &amp; SSL</h2></div><div id="remote" class="readings"></div></section>
 <section class="panel" id="actions-panel"><div class="heading"><h2>Network controls</h2></div><div id="actions" class="actions"></div><div class="feedback" id="feedback" role="status"></div></section>
 </div></div></div></div>`;
      this.root = this.shadowRoot;
      this.root.getElementById("scansearch").addEventListener("input", (e) => {
        this.scan.q = e.target.value.trim().toLowerCase();
        this.renderScan(true);
      });
      this.root.getElementById("scanlist").addEventListener("keydown", (e) => {
        if (!e.target.classList.contains("rename")) return;
        if (e.key === "Enter") {
          e.preventDefault();
          this.saveName(e.target.dataset.id, e.target.value);
        } else if (e.key === "Escape") {
          this.scan.editing = null;
          this.renderScan(true);
        }
      });
    }
    discovered(platform, pattern) {
      return Object.keys(this._hass.states).find(
        (id) =>
          this._hass.entities?.[id]?.platform === platform && pattern.test(id),
      );
    }
    reading(label, id) {
      const entity = this.state(id);
      const unit = entity?.attributes?.unit_of_measurement;
      const date =
        entity?.attributes.device_class === "timestamp"
          ? Date.parse(entity.state)
          : NaN;
      const age = Math.floor((Date.now() - date) / 3600000);
      const value =
        label === "System uptime" && Number.isFinite(age) && age >= 0
          ? Math.floor(age / 24) + "d " + (age % 24) + "h"
          : label === "SSL certificate" && Number.isFinite(age)
            ? date > Date.now()
              ? "Valid until " + new Date(date).toLocaleDateString()
              : "Expired"
            : label === "Remote access" &&
                entity?.entity_id?.startsWith("binary_sensor.") &&
                available(entity)
              ? entity.state === "on"
                ? "Connected"
                : "Disconnected"
              : available(entity)
                ? [entity.state, unit].filter(Boolean).join(" ")
                : entity
                  ? "No reading"
                  : missing;
      const content = `<span>${esc(label || entity?.attributes.friendly_name || id)}</span><span>${esc(value)}</span>`;
      return entity
        ? `<button class="reading" data-entity="${esc(id)}">${content}</button>`
        : `<div class="reading">${content}</div>`;
    }
    rows(element, rows) {
      const html =
        rows.map(([label, id]) => this.reading(label, id)).join("") ||
        `<div class="hint">${missing}</div>`;
      this.renderMarkup(element, html);
    }
    renderMarkup(id, html) {
      this.markup ??= {};
      if (this.markup[id] === html) return;
      this.markup[id] = html;
      this.root.getElementById(id).innerHTML = html;
    }
    update() {
      const config = this.config;
      const hide = (id, hidden) => {
        this.root.getElementById(id).hidden = Boolean(hidden);
      };
      this.renderMarkup(
        "dashboard-title",
        config.title?.trim()
          ? esc(config.title.trim())
          : "Network<span> / </span>control",
      );
      hide("speed-metrics", config.hide_connection);
      hide("history", config.hide_connection);
      hide("personal-panel", config.hide_personal);
      hide("scanner", config.hide_scanner);
      hide("host-panel", config.hide_host);
      hide("dns-panel", config.hide_dns);
      hide("remote-panel", config.hide_remote);
      hide("actions-panel", config.hide_controls);
      hide(
        "support",
        config.hide_host &&
          config.hide_dns &&
          config.hide_remote &&
          config.hide_controls,
      );
      const ids = Object.keys(this._hass.states);
      const routerId =
        config.wan_sensor ||
        ids.find((id) =>
          /^sensor\..*(?:external_ip|wan_ip)(?:_address)?$/.test(id),
        );
      const router = this.state(config.router_entity || routerId);
      const device =
        this._hass.devices?.[
          this._hass.entities?.[router?.entity_id]?.device_id
        ];
      this.root.getElementById("router").textContent =
        config.router_name ||
        device?.name_by_user ||
        device?.name ||
        (config.router_entity && router?.attributes.friendly_name) ||
        (router ? "Internet gateway" : "");
      const wan = this.state(routerId);
      this.root.getElementById("ip").textContent =
        config.show_wan_ip && available(wan) ? "WAN / " + wan.state : "";
      this.speed.forEach((id, index) => {
        this.root.getElementById("v" + index).closest("button").dataset.entity =
          id;
        this.root.getElementById("v" + index).textContent = this.value(
          id,
          index === 2 ? 0 : 1,
        );
        this.root.getElementById("s" + index).textContent = !this.state(id)
          ? missing
          : this.value(id) === "—"
            ? "No reading"
            : "Last speed test";
      });

      const personal =
        config.personal_entities ??
        ids.filter(
          (id) =>
            id.startsWith("person.") ||
            (this._hass.entities?.[id]?.platform === "mobile_app" &&
              /_(battery_level|storage)$/.test(id)),
        );
      this.rows(
        "personal",
        personal.map((id) => [null, id]),
      );
      const supplies =
        config.printer_entities ??
        ids.filter((id) =>
          /^sensor\..*_(ink|toner)(?:_(remaining|level))?$/.test(id),
        );
      const printerHidden =
        config.hide_printer || !supplies.some((id) => this.state(id));
      const sideHidden = config.hide_personal && printerHidden;
      hide("printers", printerHidden);
      hide("side", sideHidden);
      hide("main", config.hide_connection && sideHidden);
      this.root
        .getElementById("main")
        .classList.toggle(
          "single-column",
          Boolean(sideHidden || config.hide_connection),
        );
      this.rows(
        "supplies",
        supplies.map((id) => [null, id]),
      );

      this.rows("host", [
        [
          "CPU usage",
          config.cpu_sensor ||
            this.discovered("systemmonitor", /_processor_use$/),
        ],
        [
          "RAM usage",
          config.memory_sensor ||
            this.discovered("systemmonitor", /_memory_usage$/),
        ],
        [
          "Disk free",
          config.disk_sensor || this.discovered("systemmonitor", /_disk_free/),
        ],
        [
          "CPU temperature",
          config.temperature_sensor ||
            this.discovered("systemmonitor", /_processor_temperature$/),
        ],
        [
          "System uptime",
          config.uptime_sensor ||
            this.discovered("systemmonitor", /_last_boot$/) ||
            this.discovered("uptime", /^sensor\./),
        ],
      ]);
      const dnsPlatform = ["adguard", "pi_hole"].find((platform) =>
        this.discovered(platform, /_(dns_)?queries(?:_today)?$/),
      );
      this.rows("dns", [
        [
          dnsPlatform === "adguard"
            ? "DNS queries (statistics window)"
            : "DNS queries",
          config.dns_queries_sensor ||
            this.discovered(
              dnsPlatform || "adguard",
              /_(dns_)?queries(?:_today)?$/,
            ),
        ],
        [
          "Ads blocked",
          config.dns_blocked_sensor ||
            this.discovered(
              dnsPlatform || "adguard",
              /_(ratio|percentage|percent|ads_percentage_blocked_today|ads_percentage_today|percent_ads_blocked)$/,
            ),
        ],
      ]);
      this.rows("remote", [
        ["Remote access", config.remote_access_entity],
        [
          "SSL certificate",
          config.ssl_entity || this.discovered("cert_expiry", /^sensor\./),
        ],
      ]);
      this.renderActions();
    }
    actions() {
      const config = this.config;
      const services = this._hass.services || {};
      const actions = [];
      const add = (label, domain, service, target, data, confirm = false) => {
        if (
          services[domain]?.[service] &&
          (!target ||
            (this.state(target) && this.state(target).state !== "unavailable"))
        ) {
          actions.push({ label, domain, service, target, data, confirm });
        }
      };
      const entityAction = (label, id, confirm = false) => {
        const domain = id?.split(".")[0];
        const service = {
          button: "press",
          script: "turn_on",
          switch: "toggle",
        }[domain];
        if (service) add(label, domain, service, id, undefined, confirm);
      };
      if (config.speedtest_action_entity)
        entityAction("Run speed test", config.speedtest_action_entity);
      else if (
        this._hass.entities?.[this.speed[0]]?.platform === "speedtestdotnet" ||
        this.speed[0] === speedDefaults[0]
      )
        add("Run speed test", "homeassistant", "update_entity", this.speed[0]);
      if (config.dns_pause_script)
        entityAction(
          "Pause blocking for 5 minutes",
          config.dns_pause_script,
          true,
        );
      else if (config.pihole_switch)
        add(
          "Pause blocking for 5 minutes",
          "pi_hole",
          "disable",
          config.pihole_switch,
          { duration: "00:05:00" },
          true,
        );
      entityAction("Reboot router", config.router_reboot_entity, true);
      entityAction("Toggle guest Wi-Fi", config.guest_wifi_entity, true);
      for (const id of config.wake_entities ?? [])
        entityAction(
          this.state(id)?.attributes.friendly_name || "Wake device",
          id,
        );
      if (config.enable_restart && this._hass.user?.is_admin)
        add(
          "Restart Home Assistant",
          "homeassistant",
          "restart",
          undefined,
          undefined,
          true,
        );
      if (this._hass.user?.is_admin)
        entityAction("Reboot host", config.host_reboot_entity, true);
      return actions;
    }
    renderActions() {
      this.availableActions = this.actions();
      const html =
        this.availableActions
          .map((action, index) => {
            const active = this.activeAction === action.label;
            return `<button data-action="${index}" ${this.activeAction ? "disabled" : ""}>${active ? '<span class="spinner" aria-hidden="true"></span>' : ""}${esc(active ? action.label + "…" : action.label)}</button>`;
          })
          .join("") || '<div class="hint">No network controls configured</div>';
      this.renderMarkup("actions", html);
    }
    async runAction(button) {
      const action = this.availableActions[Number(button.dataset.action)];
      if (
        !action ||
        this.activeAction ||
        (action.confirm && !window.confirm(action.label + "?"))
      )
        return;
      this.activeAction = action.label;
      this.renderActions();
      const feedback = this.root.getElementById("feedback");
      feedback.textContent = "";
      try {
        await this._hass.callService(
          action.domain,
          action.service,
          action.data,
          action.target ? { entity_id: action.target } : undefined,
        );
        feedback.textContent = action.label + " requested";
        if (action.label === "Run speed test") this.loadHistory();
      } catch {
        feedback.textContent =
          action.label + " failed. Check the entity and your permissions.";
      } finally {
        this.activeAction = null;
        this.renderActions();
      }
    }
    async loadHistory() {
      if (this.config.hide_connection) {
        this.historyRequest = null;
        return;
      }
      const key = JSON.stringify([this.speed, this.latencyCap]);
      if (this.historyRequest?.key === key) return;
      this.historyRequest = null;
      const note = this.root.getElementById("chartnote");
      const axis = [0, 1, 2, 3].map((i) => this.root.getElementById("yl" + i));
      const active = this.speed.filter((id) => this.state(id));
      if (!active.length) {
        this.root.getElementById("plot").innerHTML =
          '<div class="empty">Entity not configured</div>';
        axis.forEach((label) => {
          label.textContent = "";
        });
        note.textContent = "";
        return;
      }
      const request = { key };
      this.historyRequest = request;
      let end = Date.now(),
        start = end - 86400000;
      try {
        const rows = await this._hass.callApi(
          "GET",
          `history/period/${new Date(start).toISOString()}?filter_entity_id=${encodeURIComponent(active.join(","))}&end_time=${new Date(end).toISOString()}&minimal_response&no_attributes`,
        );
        if (this.historyRequest !== request) return;
        const series = this.speed.map((id, i) =>
          (rows.find((r) => r[0]?.entity_id === id) || [])
            .map((r) => ({
              t: new Date(r.last_changed || r.last_updated).getTime(),
              v: ["unknown", "unavailable", ""].includes(r.state)
                ? null
                : Number(r.state),
            }))
            .map((p) => ({
              ...p,
              v:
                p.v !== null &&
                Number.isFinite(p.v) &&
                p.v >= 0 &&
                (i !== 2 || p.v <= this.latencyCap)
                  ? p.v
                  : null,
            })),
        );
        if (!series.some((s) => s.some((p) => Number.isFinite(p.v))))
          throw Error("No recorded samples");
        let ymax = Math.max(
            10,
            ...series
              .slice(0, 2)
              .flat()
              .map((p) => p.v || 0),
          ),
          pmax = Math.max(10, ...series[2].map((p) => p.v || 0));
        ymax = Math.ceil(ymax / 10) * 10;
        pmax = Math.min(this.latencyCap, Math.ceil(pmax / 10) * 10);
        const paths = series.map((s, i) => {
          let d = "",
            pen = false;
          s.forEach((p) => {
            if (!Number.isFinite(p.v)) {
              pen = false;
              return;
            }
            let x =
                30 + Math.max(0, Math.min(1, (p.t - start) / 86400000)) * 540,
              y = 150 - (p.v / (i === 2 ? pmax : ymax)) * 138;
            d += (pen ? "L" : "M") + x.toFixed(1) + "," + y.toFixed(1);
            pen = true;
          });
          return `<path d="${d}" fill="none" stroke="${colors[i]}" stroke-width="2" vector-effect="non-scaling-stroke"/>`;
        });
        this.root.getElementById("plot").innerHTML =
          `<svg viewBox="0 0 600 160" preserveAspectRatio="none" role="img" aria-label="Recorded download, upload and latency over 24 hours">${[12, 81, 150].map((y) => `<line x1="30" x2="570" y1="${y}" y2="${y}" stroke="var(--yanke-line)" stroke-dasharray="3 5"/>`).join("")}${paths.join("")}</svg>`;
        [ymax, 0, pmax, 0].forEach(
          (v, i) => (this.root.getElementById("yl" + i).textContent = v),
        );
        this.root.getElementById("chartnote").textContent =
          "Recorded speed tests · Mbps left / ms right · Latency above " +
          this.latencyCap +
          " ms omitted";
      } catch (e) {
        if (this.historyRequest !== request) return;
        axis.forEach((label) => {
          label.textContent = "";
        });
        this.root.getElementById("plot").innerHTML =
          '<div class="empty">History unavailable</div>';
        this.root.getElementById("chartnote").textContent =
          "Latest readings remain above. History retries every 5 minutes.";
      } finally {
        if (this.historyRequest === request) this.historyRequest = null;
      }
    }
    /* ---------- Network scanner (Nmap Tracker entities) ---------- */
    async loadRegistry() {
      if (this.config.hide_scanner) return;
      try {
        const all = await this._hass.callWS({
          type: "config/entity_registry/list",
        });
        const reg = {};
        all.forEach((e) => {
          if (e.platform === "nmap_tracker") reg[e.entity_id] = e;
        });
        this.reg = reg;
        this.regOk = true;
      } catch (e) {
        this.regOk = false;
      }
      this.renderScan(true);
    }
    scanModel() {
      const h = this._hass,
        ids = new Set(Object.keys(this.reg));
      for (const id in h.states)
        if (
          id.startsWith("device_tracker.") &&
          h.entities?.[id]?.platform === "nmap_tracker"
        )
          ids.add(id);
      const macOwner = Object.create(null);
      for (const d of Object.values(h.devices || {}))
        for (const c of d.connections || [])
          if (c[0] === "mac")
            (macOwner[c[1].toLowerCase()] =
              macOwner[c[1].toLowerCase()] || []).push(d);
      return [...ids]
        .map((id) => {
          const r = this.reg[id] || {},
            s = h.states[id],
            a = s?.attributes || {},
            mac = String(a.mac || r.unique_id || "").toLowerCase();
          const base =
            a.friendly_name && !r.name
              ? a.friendly_name
              : r.original_name ||
                h.devices?.[r.device_id]?.name ||
                id.split(".")[1].replace(/_/g, " ");
          let vendor = String(base)
            .replace(/\s*([0-9A-F]{2}[:_ ]){2,5}[0-9A-F]{2}$/i, "")
            .trim();
          const priv = /^.[26ae]/i.test(mac);
          if (!vendor || /^nmap tracker$/i.test(vendor))
            vendor = priv ? "Private Wi-Fi address" : "Unknown maker";
          const other = (macOwner[mac] || []).find(
            (d) => d.id !== r.device_id && (d.name_by_user || d.name),
          );
          const suggested = other ? other.name_by_user || other.name : null;
          const custom =
            r.name ||
            (h.entities?.[id]?.platform === "nmap_tracker" &&
            !this.regOk &&
            a.friendly_name !== base
              ? a.friendly_name
              : null);
          if (a.ip) this.scan.lastIp[id] = a.ip;
          const ip = a.ip || this.scan.lastIp[id] || "";
          const status =
            r.disabled_by === "integration"
              ? "pending"
              : r.disabled_by
                ? "disabled"
                : s?.state === "home"
                  ? "online"
                  : s?.state === "not_home"
                    ? "offline"
                    : "unknown";
          return {
            id,
            mac,
            ip,
            vendor,
            name:
              custom ||
              suggested ||
              vendor +
                (this.config.show_mac && mac
                  ? " · " + mac.slice(-5).toUpperCase()
                  : ""),
            custom: !!custom,
            suggested: !custom && !!suggested,
            named: !!(custom || suggested),
            status,
            changed: s ? new Date(s.last_changed).getTime() : 0,
            seen: a.last_time_reachable
              ? new Date(a.last_time_reachable).getTime()
              : 0,
          };
        })
        .sort(
          (a, b) =>
            this.ipNum(a.ip) - this.ipNum(b.ip) || a.name.localeCompare(b.name),
        );
    }
    ipNum(ip) {
      const p = String(ip).split(".").map(Number);
      return p.length === 4 && p.every(Number.isFinite)
        ? ((p[0] * 256 + p[1]) * 256 + p[2]) * 256 + p[3]
        : Infinity;
    }
    ago(t) {
      if (!t) return "";
      const m = Math.max(0, Math.round((Date.now() - t) / 60000));
      return m < 1
        ? "just now"
        : m < 60
          ? m + "m"
          : m < 1440
            ? Math.floor(m / 60) + "h" + (m % 60 ? " " + (m % 60) + "m" : "")
            : Math.floor(m / 1440) + "d " + Math.floor((m % 1440) / 60) + "h";
    }
    clock(t) {
      const d = new Date(t),
        today = new Date().toDateString() === d.toDateString();
      return d.toLocaleString(
        undefined,
        today
          ? { hour: "numeric", minute: "2-digit" }
          : {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            },
      );
    }
    renderScan(force) {
      if (!this.root || !this._hass || this.config.hide_scanner) return;
      const list = this.root.getElementById("scanlist");
      if (!list) return;
      if (this.scan.editing && !force) return;
      const model = this.scanModel(),
        minute = Math.floor(Date.now() / 60000);
      const sig = JSON.stringify([
        model.map((d) => [d.id, d.status, d.ip, d.name, d.changed]),
        this.scan.tab,
        this.scan.filter,
        this.scan.q,
        this.scan.editing,
        this.scan.events.length,
        minute,
        this.regOk,
      ]);
      if (sig === this.scan.sig && !force) return;
      this.scan.sig = sig;
      this.scan.model = model;
      const tracked = model.filter(
          (d) => d.status !== "pending" && d.status !== "disabled",
        ),
        pend = model.filter((d) => d.status === "pending"),
        count = {
          online: tracked.filter((d) => d.status === "online").length,
          offline: tracked.filter((d) => d.status === "offline").length,
          unnamed: model.filter((d) => !d.custom).length,
        };
      for (const k in count)
        this.root.getElementById("n_" + k).textContent = count[k];
      this.root
        .querySelectorAll(".stat")
        .forEach((b) =>
          b.classList.toggle("on", b.dataset.filter === this.scan.filter),
        );
      this.root
        .querySelectorAll(".tabs button")
        .forEach((b) =>
          b.classList.toggle("on", b.dataset.tab === this.scan.tab),
        );
      this.root.getElementById("pending").innerHTML = pend.length
        ? `<div class="pending"><span><b>${pend.length}</b> new device${pend.length > 1 ? "s" : ""} found, not tracked yet</span><button data-track="all">Track all</button></div>`
        : "";
      const latest = Math.max(0, ...tracked.map((d) => d.seen));
      this.root.getElementById("scanfoot").textContent = model.length
        ? `${tracked.length} tracked · last sweep ${latest ? this.clock(latest) : "pending"}`
        : "";
      this.root.getElementById("scantag").textContent =
        (this.config.scan_subnet || "Local network") + " · LIVE";
      if (this.scan.tab === "activity") {
        list.innerHTML = this.activityMarkup(tracked);
        return;
      }
      const q = this.scan.q,
        f = this.scan.filter;
      const rows = model.filter(
        (d) =>
          (f === "all" || (f === "unnamed" ? !d.custom : d.status === f)) &&
          (!q ||
            (d.name + " " + d.ip + " " + d.mac + " " + d.vendor)
              .toLowerCase()
              .includes(q)),
      );
      rows.sort(
        (a, b) =>
          (a.status === "pending") - (b.status === "pending") ||
          (a.status !== "online") - (b.status !== "online") ||
          0,
      );
      if (!model.length) {
        list.innerHTML = `<div class="none">${this.regOk === false ? "Device list could not be read." : "No Nmap Tracker devices yet. Add Nmap Tracker to populate this panel."}</div>`;
        return;
      }
      list.innerHTML = rows.length
        ? rows
            .map((d) => {
              const cls = d.status === "pending" ? "pendingrow" : d.status;
              const when =
                d.status === "online"
                  ? `Online ${this.ago(d.changed)}`
                  : d.status === "offline"
                    ? `Dropped ${this.ago(d.changed)} ago`
                    : d.status === "pending"
                      ? "Not tracked"
                      : d.status === "disabled"
                        ? "Disabled in Home Assistant"
                        : "No reading";
              const sub = `${esc(d.vendor)}${this.config.show_mac ? " · " + esc(d.mac.toUpperCase()) : ""}${d.status === "offline" && d.seen ? " · last seen " + esc(this.clock(d.seen)) : ""}`;
              if (this.scan.editing === d.id)
                return `<div class="row ${cls}"><span class="sd"></span><input class="rename" data-id="${esc(d.id)}" value="${esc(d.custom || d.suggested ? d.name : "")}" placeholder="Name this device (${esc(d.ip || d.vendor)})" maxlength="60" aria-label="Device name"><button class="rowbtn" data-save="${esc(d.id)}">Save</button><button class="rowbtn" data-cancel="1">Cancel</button></div>`;
              return `<div class="row ${cls}"><span class="sd" title="${esc(d.status)}"></span><button class="who" ${["pending", "disabled"].includes(d.status) ? "" : `data-entity="${esc(d.id)}"`}><span class="nm">${esc(d.name)}${d.custom ? "" : d.suggested ? "<em>suggested</em>" : "<em>unnamed</em>"}</span><span class="sub2">${sub}</span></button><div class="addr">${esc(d.ip || "—")}<small>${esc(when)}</small></div>${d.status === "disabled" ? "" : d.status === "pending" ? `<button class="rowbtn" data-track="${esc(d.id)}">Track</button>` : `<button class="edit" data-edit="${esc(d.id)}" title="Assign a name" aria-label="Assign a name to ${esc(d.name)}"><ha-icon icon="mdi:pencil-outline"></ha-icon></button>`}</div>`;
            })
            .join("")
        : `<div class="none">No devices match this filter.</div>`;
      if (this.scan.editing) {
        const inp = list.querySelector(".rename");
        if (inp && this.root.activeElement !== inp) {
          inp.focus();
          inp.select();
        }
      }
    }
    scanClick(e) {
      const t = e.target.closest(
        "[data-tab],[data-filter],[data-edit],[data-save],[data-cancel],[data-track]",
      );
      if (!t) return e.target.classList?.contains("rename");
      const d = t.dataset;
      if (d.tab) {
        this.scan.tab = d.tab;
        if (d.tab === "activity") this.loadActivity();
      } else if (d.filter) {
        this.scan.filter = this.scan.filter === d.filter ? "all" : d.filter;
        this.scan.tab = "devices";
      } else if (d.edit) {
        this.scan.editing = d.edit;
      } else if (d.cancel) {
        this.scan.editing = null;
      } else if (d.save) {
        this.saveName(d.save, this.root.querySelector(".rename")?.value ?? "");
        return true;
      } else if (d.track) {
        this.track(d.track);
        return true;
      }
      this.renderScan(true);
      return true;
    }
    note(msg) {
      const el = this.root.getElementById("scanerr");
      el.textContent = msg;
      clearTimeout(this._note);
      if (msg)
        this._note = setTimeout(() => {
          el.textContent = "";
        }, 8000);
    }
    async saveName(id, value) {
      if (this.preview) return;
      const name = String(value).trim() || null;
      try {
        const res = await this._hass.callWS({
          type: "config/entity_registry/update",
          entity_id: id,
          name,
        });
        this.reg[id] = {
          ...(this.reg[id] || {}),
          ...(res.entity_entry || {}),
          name,
        };
        this.note(name ? "Name saved" : "Name cleared");
      } catch (err) {
        this.note(
          "Could not save name: " + (err?.message || "admin access needed"),
        );
      }
      this.scan.editing = null;
      this.renderScan(true);
    }
    async track(which) {
      if (this.preview) return;
      await this.loadRegistry();
      if (!this.regOk) {
        this.note("Could not verify which devices are eligible for tracking.");
        return;
      }
      const ids = Object.keys(this.reg).filter(
        (id) =>
          this.reg[id].disabled_by === "integration" &&
          (which === "all" || which === id),
      );
      if (!ids.length) {
        this.note("No new devices to track");
        return;
      }
      try {
        for (const id of ids) {
          const res = await this._hass.callWS({
            type: "config/entity_registry/update",
            entity_id: id,
            disabled_by: null,
          });
          this.reg[id] = {
            ...this.reg[id],
            ...res.entity_entry,
            disabled_by: null,
          };
        }
        this.note("Tracking starts in about 30 seconds");
      } catch (err) {
        this.note(
          "Could not start tracking: " +
            (err?.message || "admin access needed"),
        );
      }
      this.renderScan(true);
    }
    activityMarkup(tracked) {
      const names = new Map(tracked.map((device) => [device.id, device.name]));
      const cutoff = Date.now() - 86400000;
      this.scan.events = this.scan.events.filter(
        (event) => event.t > cutoff && names.has(event.id),
      );
      const rows = this.scan.events
        .map(
          (e) =>
            `<div class="ev ${e.type}"><i>${e.type === "drop" ? "Dropped" : "Joined"}</i><b>${esc(names.get(e.id))}</b><span class="t">${esc(this.clock(e.t))} · ${esc(this.ago(e.t))} ago</span></div>`,
        )
        .join("");
      if (this.activityFailed || this.regOk === false) {
        const last = this.activityUpdated
          ? ` Last successful refresh: ${esc(this.clock(this.activityUpdated))}.`
          : "";
        return (
          `<div class="none">Activity history unavailable.${last}</div>` + rows
        );
      }
      if (!this.activityUpdated)
        return '<div class="none">Loading activity history…</div>';
      return (
        rows ||
        '<div class="none">No devices joined or dropped off in the last 24 hours.</div>'
      );
    }
    async loadActivity() {
      if (this.config.hide_scanner) return;
      if (!this._hass || !this.regOk) return;
      const ids = Object.keys(this.reg).filter(
        (id) => !this.reg[id].disabled_by,
      );
      if (!ids.length) {
        this.activityRequest = null;
        this.scan.events = [];
        this.activityFailed = false;
        this.activityUpdated = Date.now();
        this.renderScan(true);
        return;
      }
      const key = JSON.stringify(ids.sort());
      if (this.activityRequest?.key === key) return;
      const request = (this.activityRequest = { key });
      const end = Date.now(),
        start = end - 86400000;
      try {
        const rows = await this._hass.callApi(
          "GET",
          `history/period/${new Date(start).toISOString()}?filter_entity_id=${ids.join(",")}&end_time=${new Date(end).toISOString()}&minimal_response&no_attributes`,
        );
        if (this.activityRequest !== request) return;
        const events = [];
        for (const series of rows) {
          const id = series[0]?.entity_id;
          if (!this.reg[id] || this.reg[id].disabled_by) continue;
          let previous = null;
          series.forEach((point, index) => {
            if (point.state !== "home" && point.state !== "not_home") return;
            const time = new Date(
              point.last_changed || point.last_updated,
            ).getTime();
            const changed = previous
              ? previous !== point.state
              : index > 0 && point.state === "home" && time > start + 60000;
            if (changed && time > start && time <= end)
              events.push({
                id,
                t: time,
                type: point.state === "home" ? "join" : "drop",
              });
            previous = point.state;
          });
        }
        this.scan.events = events.sort((a, b) => b.t - a.t).slice(0, 60);
        this.activityUpdated = Date.now();
        this.activityFailed = false;
      } catch (err) {
        if (this.activityRequest === request) this.activityFailed = true;
      } finally {
        if (this.activityRequest === request) {
          this.activityRequest = null;
          this.renderScan(this.scan.tab === "activity" && !this.scan.editing);
        }
      }
    }
  }
  if (!customElements.get("yanke-network-control")) {
    customElements.define("yanke-network-control", NetworkConsole);
    window.customCards ??= [];
    window.customCards.push({
      type: "yanke-network-control",
      name: "Network Control",
      description: "Network history, presence and infrastructure controls",
      preview: true,
      documentationURL:
        "https://github.com/yanke7/Home-Assistant-Network#customize-in-home-assistant",
    });
  }
})();
