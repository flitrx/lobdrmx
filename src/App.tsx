import { useEffect, useMemo, useState } from "react";

type IconName =
  | "dashboard"
  | "gear"
  | "pulse"
  | "list"
  | "settings"
  | "bluetooth"
  | "pause"
  | "play"
  | "truck"
  | "alert"
  | "check"
  | "search"
  | "trash"
  | "x"
  | "chevron";

type Metric = {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  warning?: number;
  decimals?: number;
};

type Page = "dashboard" | "transmission" | "diagnostics" | "data";

const navItems: { id: Page; label: string; icon: IconName }[] = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "transmission", label: "Transmission", icon: "gear" },
  { id: "diagnostics", label: "Diagnostics", icon: "pulse" },
  { id: "data", label: "All data", icon: "list" },
];

const allData = [
  ["Engine RPM", "1,842", "rpm", "01 0C", "ECM"],
  ["Vehicle speed", "47", "mph", "01 0D", "ECM"],
  ["Engine load", "38", "%", "01 04", "ECM"],
  ["Coolant temperature", "187", "°F", "01 05", "ECM"],
  ["Fuel rail pressure", "8,412", "psi", "22 21", "ECM"],
  ["Boost pressure", "12.6", "psi", "01 5E", "ECM"],
  ["Engine oil temperature", "194", "°F", "01 5C", "ECM"],
  ["Intake air temperature", "86", "°F", "01 0F", "ECM"],
  ["EGT bank 1", "684", "°F", "22 19", "ECM"],
  ["DPF soot load", "34", "%", "01 2F", "ECM"],
  ["DPF differential pressure", "0.8", "psi", "22 34", "ECM"],
  ["Transmission fluid", "173", "°F", "22 01", "TCM"],
  ["Actual gear", "5", "", "22 02", "TCM"],
  ["Requested gear", "5", "", "22 03", "TCM"],
  ["TCC slip speed", "14", "rpm", "22 04", "TCM"],
  ["Input shaft speed", "1,806", "rpm", "22 40", "TCM"],
  ["Output shaft speed", "1,101", "rpm", "22 50", "TCM"],
  ["Line pressure", "168", "psi", "22 51", "TCM"],
];

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    gear: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.09A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.14.37.35.7.6 1 .3.3.68.45 1.1.4h.1v4h-.1a1.7 1.7 0 0 0-1.7.6Z" /></>,
    pulse: <path d="M3 12h4l2.2-6 4.1 12 2.3-6H21" />,
    list: <><path d="M9 6h12M9 12h12M9 18h12" /><circle cx="4" cy="6" r=".7" fill="currentColor" /><circle cx="4" cy="12" r=".7" fill="currentColor" /><circle cx="4" cy="18" r=".7" fill="currentColor" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" /></>,
    bluetooth: <path d="m7 7 10 10-5 4V3l5 4L7 17" />,
    pause: <><path d="M9 5v14M15 5v14" /></>,
    play: <path d="m8 5 11 7-11 7Z" />,
    truck: <><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    alert: <><path d="M12 3 2.7 20h18.6Z" /><path d="M12 9v5M12 17.5v.1" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    trash: <><path d="M4 7h16M9 3h6l1 4H8zM7 7l1 14h8l1-14M10 11v6M14 11v6" /></>,
    x: <path d="M6 6l12 12M18 6 6 18" />,
    chevron: <path d="m9 18 6-6-6-6" />,
  };
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Gauge({ label, value, unit, max, accent = "cyan" }: { label: string; value: number; unit: string; max: number; accent?: "cyan" | "amber" }) {
  const pct = Math.min(1, Math.max(0, value / max));
  const circumference = 251.2;
  return (
    <div className={`gauge gauge--${accent}`}>
      <svg viewBox="0 0 120 82" aria-hidden="true">
        <path className="gauge-track" d="M18 70a44 44 0 1 1 84 0" pathLength="100" />
        <path className="gauge-value" d="M18 70a44 44 0 1 1 84 0" pathLength="100" strokeDasharray={`${pct * 78} 100`} />
        {Array.from({ length: 9 }).map((_, index) => {
          const angle = (-150 + index * 37.5) * Math.PI / 180;
          const x1 = 60 + Math.cos(angle) * 49;
          const y1 = 61 + Math.sin(angle) * 49;
          const x2 = 60 + Math.cos(angle) * 44;
          const y2 = 61 + Math.sin(angle) * 44;
          return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} className="gauge-tick" />;
        })}
      </svg>
      <div className="gauge-readout">
        <strong>{Math.round(value).toLocaleString()}</strong>
        <span>{unit}</span>
      </div>
      <div className="gauge-label">{label}</div>
    </div>
  );
}

function MetricCard({ metric }: { metric: Metric }) {
  const pct = Math.min(100, Math.max(0, ((metric.value - metric.min) / (metric.max - metric.min)) * 100));
  const warn = metric.warning !== undefined && metric.value >= metric.warning;
  return (
    <div className={`metric-card ${warn ? "metric-card--warn" : ""}`}>
      <div className="metric-heading">
        <span>{metric.label}</span>
        <span className="metric-live"><i /> LIVE</span>
      </div>
      <div className="metric-value">
        <strong>{metric.value.toFixed(metric.decimals ?? 0)}</strong>
        <span>{metric.unit}</span>
      </div>
      <div className="metric-bar"><span style={{ width: `${pct}%` }} /></div>
      <div className="metric-range"><span>{metric.min}</span><span>{metric.max}</span></div>
    </div>
  );
}

function Dashboard({ tick }: { tick: number }) {
  const speed = 47 + Math.sin(tick / 4) * 2;
  const rpm = 1842 + Math.sin(tick / 3) * 85;
  const metrics: Metric[] = [
    { label: "COOLANT", value: 187 + Math.sin(tick / 8), unit: "°F", min: 100, max: 250, warning: 225 },
    { label: "TRANS FLUID", value: 173 + Math.sin(tick / 10) * 2, unit: "°F", min: 100, max: 250, warning: 220 },
    { label: "BOOST", value: 12.6 + Math.sin(tick / 2) * 1.1, unit: "PSI", min: 0, max: 35, warning: 32, decimals: 1 },
    { label: "EGT BANK 1", value: 684 + Math.sin(tick / 3) * 24, unit: "°F", min: 200, max: 1400, warning: 1250 },
  ];
  return (
    <>
      <section className="hero-panel">
        <Gauge label="VEHICLE SPEED" value={speed} unit="MPH" max={120} />
        <div className="drive-status">
          <div className="gear-badge"><small>GEAR</small><strong>5</strong></div>
          <div className="lock-status"><span><Icon name="check" size={14} /></span><div><strong>TCC LOCKED</strong><small>Slip 14 RPM</small></div></div>
          <div className="engine-load">
            <div><span>ENGINE LOAD</span><strong>38%</strong></div>
            <div className="engine-load-bar"><span /></div>
          </div>
        </div>
        <Gauge label="ENGINE SPEED" value={rpm} unit="RPM" max={4000} accent="amber" />
      </section>

      <section className="metric-grid">
        {metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
      </section>

      <section className="lower-grid">
        <div className="panel health-panel">
          <div className="panel-title"><div><span className="eyebrow">POWERTRAIN</span><h2>System health</h2></div><span className="status-pill status-pill--good"><Icon name="check" size={13} /> All systems normal</span></div>
          <div className="health-list">
            <div><span>ECM · Engine control</span><strong>ONLINE <i /></strong></div>
            <div><span>TCM · Allison 1000</span><strong>ONLINE <i /></strong></div>
            <div><span>DPF soot load</span><strong>34%</strong></div>
          </div>
        </div>
        <div className="panel trend-panel">
          <div className="panel-title"><div><span className="eyebrow">LAST 60 SECONDS</span><h2>Temperature trend</h2></div><span className="legend"><i /> Coolant <i /> Trans</span></div>
          <svg className="chart" viewBox="0 0 500 110" preserveAspectRatio="none" aria-label="Coolant and transmission temperature trend">
            <path className="chart-grid" d="M0 15H500M0 55H500M0 95H500" />
            <path className="chart-line chart-line--cyan" d="M0 42 C50 40,70 46,105 40 S170 38,210 43 S280 36,325 39 S410 35,500 38" />
            <path className="chart-line chart-line--amber" d="M0 72 C60 70,80 74,130 69 S200 72,250 66 S340 68,390 63 S455 66,500 61" />
          </svg>
        </div>
      </section>
    </>
  );
}

function Transmission({ tick }: { tick: number }) {
  const slip = Math.max(5, Math.round(14 + Math.sin(tick / 2) * 7));
  return (
    <div className="page-stack">
      <section className="trans-hero panel">
        <div>
          <span className="eyebrow">ALLISON 1000 · TCM 7E2</span>
          <h2>Transmission live status</h2>
          <p>6-speed automatic · Normal operating range</p>
        </div>
        <div className="gear-selector" aria-label="Current gear">
          {["P", "R", "N", "D"].map((gear) => <span key={gear} className={gear === "D" ? "active" : ""}>{gear}</span>)}
          <strong>5</strong>
        </div>
      </section>
      <section className="metric-grid metric-grid--three">
        <MetricCard metric={{ label: "TCM TEMPERATURE", value: 176 + Math.sin(tick / 6), unit: "°F", min: 80, max: 250, warning: 220 }} />
        <MetricCard metric={{ label: "TCC SLIP SPEED", value: slip, unit: "RPM", min: 0, max: 400, warning: 150 }} />
        <MetricCard metric={{ label: "LINE PRESSURE", value: 168 + Math.sin(tick / 3) * 4, unit: "PSI", min: 0, max: 300 }} />
      </section>
      <section className="trans-grid">
        <div className="panel shaft-panel">
          <div className="panel-title"><div><span className="eyebrow">ROTATIONAL SPEED</span><h2>Driveline</h2></div><span className="status-pill status-pill--good">TCC locked</span></div>
          <div className="shaft-readings">
            <div><span>INPUT SHAFT</span><strong>{Math.round(1806 + Math.sin(tick / 3) * 30).toLocaleString()}</strong><small>RPM</small></div>
            <div className="shaft-line"><i /><i /><i /></div>
            <div><span>OUTPUT SHAFT</span><strong>{Math.round(1101 + Math.sin(tick / 3) * 20).toLocaleString()}</strong><small>RPM</small></div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-title"><div><span className="eyebrow">HYDRAULIC CONTROL</span><h2>Shift solenoids</h2></div></div>
          <div className="solenoids">
            {[["A", true], ["B", false], ["C", true], ["TCC", true]].map(([name, on]) => <div key={String(name)}><span className={on ? "solenoid-on" : ""}><i /></span><strong>{name}</strong><small>{on ? "ENERGIZED" : "OFF"}</small></div>)}
          </div>
        </div>
      </section>
      <section className="panel clutch-panel">
        <div className="panel-title"><div><span className="eyebrow">GEAR COMMAND</span><h2>Shift state</h2></div></div>
        <div className="shift-state">
          <div><span>Requested gear</span><strong>5th</strong></div>
          <Icon name="chevron" />
          <div><span>Actual gear</span><strong>5th</strong></div>
          <Icon name="chevron" />
          <div><span>Torque converter</span><strong className="text-good">Locked</strong></div>
          <Icon name="chevron" />
          <div><span>Pressure regulator</span><strong>62%</strong></div>
        </div>
      </section>
    </div>
  );
}

function Diagnostics() {
  const [scanning, setScanning] = useState(false);
  const [cleared, setCleared] = useState(false);
  const runScan = () => {
    setScanning(true);
    setCleared(false);
    window.setTimeout(() => setScanning(false), 1400);
  };
  return (
    <div className="page-stack">
      <section className="diagnostic-head">
        <div><span className="eyebrow">OBD-II DIAGNOSTICS</span><h2>Diagnostic trouble codes</h2><p>Scan the ECM and Allison TCM for stored, pending, and permanent faults.</p></div>
        <button className="primary-button" onClick={runScan} disabled={scanning}><Icon name="search" />{scanning ? "Scanning modules…" : "Scan all modules"}</button>
      </section>
      <div className="module-grid">
        <div className="panel module-card">
          <div className="module-icon"><Icon name="truck" size={24} /></div>
          <div><span className="eyebrow">ECM · 7E0</span><h3>Engine control module</h3><p>{scanning ? "Reading stored and pending DTCs…" : cleared ? "Codes cleared · Rescan recommended" : "No stored or pending codes"}</p></div>
          <span className={`module-result ${scanning ? "module-result--scan" : ""}`}>{scanning ? "READING" : "0 CODES"}</span>
        </div>
        <div className="panel module-card">
          <div className="module-icon"><Icon name="gear" size={24} /></div>
          <div><span className="eyebrow">TCM · 7E2</span><h3>Allison transmission</h3><p>{scanning ? "Reading manufacturer DTCs…" : cleared ? "Codes cleared · Rescan recommended" : "No stored or pending codes"}</p></div>
          <span className={`module-result ${scanning ? "module-result--scan" : ""}`}>{scanning ? "READING" : "0 CODES"}</span>
        </div>
      </div>
      <section className="panel readiness">
        <div className="panel-title"><div><span className="eyebrow">EMISSIONS</span><h2>I/M readiness monitors</h2></div><span className="status-pill status-pill--good"><Icon name="check" size={13} /> Ready for inspection</span></div>
        <div className="readiness-grid">
          {["Misfire", "Fuel system", "Components", "EGR system", "DPF", "Boost pressure"].map((item) => <div key={item}><span><Icon name="check" size={14} /></span><strong>{item}</strong><small>COMPLETE</small></div>)}
        </div>
      </section>
      <section className="danger-panel">
        <div><Icon name="alert" /><span><strong>Clear diagnostic codes</strong><small>This also resets emissions readiness monitors.</small></span></div>
        <button className="danger-button" onClick={() => setCleared(true)}><Icon name="trash" /> Clear codes</button>
      </section>
    </div>
  );
}

function AllData() {
  const [query, setQuery] = useState("");
  const [module, setModule] = useState<"ALL" | "ECM" | "TCM">("ALL");
  const rows = allData.filter((row) => (module === "ALL" || row[4] === module) && row[0].toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="page-stack">
      <section className="data-head">
        <div><span className="eyebrow">LIVE PARAMETER STREAM</span><h2>All data</h2><p>{rows.length} active parameters · Polling at 4 Hz</p></div>
        <div className="data-controls">
          <label className="search-box"><Icon name="search" size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a parameter" /></label>
          <div className="segmented">{(["ALL", "ECM", "TCM"] as const).map((item) => <button key={item} className={module === item ? "active" : ""} onClick={() => setModule(item)}>{item}</button>)}</div>
        </div>
      </section>
      <section className="panel data-table">
        <div className="data-row data-row--head"><span>PARAMETER</span><span>MODULE</span><span>PID / DID</span><span>VALUE</span></div>
        {rows.map((row) => <div className="data-row" key={row[0]}><span><i />{row[0]}</span><span>{row[4]}</span><span>{row[3]}</span><strong>{row[1]} <small>{row[2]}</small></strong></div>)}
      </section>
    </div>
  );
}

function ConnectionDialog({ onClose, onConnect }: { onClose: () => void; onConnect: (name: string) => void }) {
  const [selected, setSelected] = useState<"demo" | "bluetooth" | "wifi">("demo");
  const [connecting, setConnecting] = useState(false);
  const connect = async () => {
    setConnecting(true);
    if (selected === "bluetooth" && "bluetooth" in navigator) {
      try {
        // Browser support is limited to BLE; classic ELM327 adapters require the native Android build.
        await (navigator as Navigator & { bluetooth: { requestDevice: (options: object) => Promise<{ name?: string }> } }).bluetooth.requestDevice({ acceptAllDevices: true });
      } catch {
        setConnecting(false);
        return;
      }
    }
    window.setTimeout(() => onConnect(selected === "demo" ? "DEMO STREAM" : selected === "bluetooth" ? "ELM327 BLE" : "ELM327 WIFI"), 800);
  };
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="connect-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="icon-button dialog-close" onClick={onClose} aria-label="Close"><Icon name="x" /></button>
        <span className="eyebrow">ADAPTER SETUP</span>
        <h2 id="connect-title">Connect to your truck</h2>
        <p>Ignition should be on and the adapter plugged into the OBD-II port.</p>
        <div className="connection-options">
          <button className={selected === "demo" ? "selected" : ""} onClick={() => setSelected("demo")}><span className="option-icon"><Icon name="play" /></span><span><strong>Demo stream</strong><small>Explore with realistic LMM data</small></span><i /></button>
          <button className={selected === "bluetooth" ? "selected" : ""} onClick={() => setSelected("bluetooth")}><span className="option-icon"><Icon name="bluetooth" /></span><span><strong>Bluetooth adapter</strong><small>BLE ELM327 adapters</small></span><i /></button>
          <button className={selected === "wifi" ? "selected" : ""} onClick={() => setSelected("wifi")}><span className="option-icon wifi-mark">⌁</span><span><strong>Wi-Fi adapter</strong><small>192.168.0.10 · Port 35000</small></span><i /></button>
        </div>
        <div className="adapter-note"><Icon name="alert" size={16} /><span>Classic Bluetooth and direct Wi-Fi sockets require the packaged Android version. This preview supports demo mode and browser-compatible BLE.</span></div>
        <button className="connect-action" onClick={connect} disabled={connecting}>{connecting ? <span className="spinner" /> : <Icon name={selected === "demo" ? "play" : "bluetooth"} />}{connecting ? "Initializing adapter…" : selected === "demo" ? "Start demo stream" : "Connect adapter"}</button>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [connected, setConnected] = useState(true);
  const [adapter, setAdapter] = useState("DEMO STREAM");
  const [paused, setPaused] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!connected || paused) return;
    const timer = window.setInterval(() => setTick((value) => value + 1), 900);
    return () => window.clearInterval(timer);
  }, [connected, paused]);

  const pageLabel = useMemo(() => navItems.find((item) => item.id === page)?.label ?? "Dashboard", [page]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><span>D</span><i /></div>
          <div><strong>DURAMAX</strong><small>COMMAND</small></div>
        </div>
        <div className="vehicle-card">
          <div className="vehicle-icon"><Icon name="truck" /></div>
          <div><strong>2008 LMM</strong><span>6.6L Duramax</span><span>Allison 1000</span></div>
        </div>
        <nav aria-label="Main navigation">
          <span className="nav-label">MONITOR</span>
          {navItems.map((item) => <button key={item.id} className={page === item.id ? "active" : ""} onClick={() => setPage(item.id)}><Icon name={item.icon} /><span>{item.label}</span>{item.id === "diagnostics" && <i className="nav-ok" />}</button>)}
        </nav>
        <div className="sidebar-bottom">
          <button className="settings-button"><Icon name="settings" /><span>Settings</span></button>
          <div className={`connection-card ${connected ? "is-connected" : ""}`}>
            <div><i /><span><strong>{connected ? "CONNECTED" : "DISCONNECTED"}</strong><small>{connected ? adapter : "No adapter"}</small></span></div>
            <button onClick={() => connected ? setConnected(false) : setShowConnect(true)}>{connected ? "DISCONNECT" : "CONNECT"}</button>
          </div>
          <div className="version">LMM PROFILE <span>v0.8 BETA</span></div>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <div><span className="eyebrow">LIVE VEHICLE MONITOR</span><h1>{pageLabel}</h1></div>
          <div className="top-actions">
            <div className="sample-rate"><i /><span><strong>{paused ? "PAUSED" : connected ? "4.0 Hz" : "OFFLINE"}</strong><small>SAMPLE RATE</small></span></div>
            <button className="pause-button" onClick={() => setPaused((value) => !value)} disabled={!connected}><Icon name={paused ? "play" : "pause"} />{paused ? "Resume" : "Pause"}</button>
          </div>
        </header>
        <div className="content">
          {!connected && <div className="offline-banner"><Icon name="alert" /><span><strong>Adapter disconnected</strong> Live values are frozen.</span><button onClick={() => setShowConnect(true)}>Reconnect</button></div>}
          {page === "dashboard" && <Dashboard tick={tick} />}
          {page === "transmission" && <Transmission tick={tick} />}
          {page === "diagnostics" && <Diagnostics />}
          {page === "data" && <AllData />}
        </div>
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map((item) => <button key={item.id} className={page === item.id ? "active" : ""} onClick={() => setPage(item.id)}><Icon name={item.icon} /><span>{item.label}</span></button>)}
        </nav>
      </main>
      {showConnect && <ConnectionDialog onClose={() => setShowConnect(false)} onConnect={(name) => { setAdapter(name); setConnected(true); setPaused(false); setShowConnect(false); }} />}
    </div>
  );
}
