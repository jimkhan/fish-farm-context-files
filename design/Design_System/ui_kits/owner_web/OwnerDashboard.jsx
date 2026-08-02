const { useState } = React;
const NS = window.FMSAquacultureDesignSystem_dbe44a;
const { Button, IconButton, Card, CardHeader, Badge, StatusBadge, Money, DualDate,
  AlertBanner, StateView, StatCard, Icon } = NS;
const D = window.OwnerData;

function Sidebar({ view, setView }) {
  const nav = [
    { id: "portfolio", label: "Portfolio", icon: "layout-dashboard" },
  ];
  return (
    <aside style={{ width: 248, background: "var(--brand-primary-dark)", color: "#fff", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ padding: "20px 20px 16px", display: "flex", alignItems: "baseline", gap: 8, borderBottom: "1px solid rgba(255,255,255,.12)" }}>
        <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: -1 }}>FMS</span>
        <span style={{ fontSize: 12, opacity: .7 }}>Owner</span>
      </div>
      <nav style={{ padding: 12, display: "flex", flexDirection: "column", gap: 2 }}>
        <NavItem active={view === "portfolio"} onClick={() => setView("portfolio")} icon="layout-dashboard" label="Portfolio" />
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: .6, opacity: .55, padding: "14px 12px 6px" }}>Projects</div>
        {D.projects.map((p) => (
          <NavItem key={p.id} active={view === p.id} onClick={() => setView(p.id)} icon="map-pin" label={p.name} badge={p.alerts} />
        ))}
      </nav>
      <div style={{ marginTop: "auto", padding: 12, borderTop: "1px solid rgba(255,255,255,.12)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 999, background: "var(--brand-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{D.owner.initials}</div>
        <div style={{ lineHeight: 1.3 }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{D.owner.name}</div>
          <div style={{ fontSize: 11, opacity: .7 }}>Owner · 3 projects</div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ active, onClick, icon, label, badge }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
      padding: "9px 12px", borderRadius: 10, border: "none", cursor: "pointer",
      background: active ? "rgba(255,255,255,.16)" : "transparent",
      color: "#fff", fontFamily: "var(--font-base)", fontSize: 14, fontWeight: active ? 600 : 400,
    }}>
      <Icon name={icon} size={18} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge ? <span style={{ minWidth: 18, height: 18, padding: "0 5px", borderRadius: 999, background: "var(--sev-critical)", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{badge}</span> : null}
    </button>
  );
}

function TopBar({ title, subtitle, right }) {
  return (
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 28px", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>{title}</h1>
        {subtitle ? <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>{subtitle}</div> : null}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          <DualDate gregorian={D.today.gregorian} bangla={D.today.bangla} />
        </div>
        {right}
        <IconButton icon="bell" label="Alerts" />
        <IconButton icon="settings" label="Settings" />
      </div>
    </header>
  );
}

function PortfolioView({ setView }) {
  const totalRev = D.projects.reduce((s, p) => s + p.revenue, 0);
  const totalProfit = D.projects.reduce((s, p) => s + (p.revenue - p.cost), 0);
  const totalAlerts = D.projects.reduce((s, p) => s + p.alerts, 0);
  const avgSurvival = Math.round(D.projects.reduce((s, p) => s + p.survival, 0) / D.projects.length);
  return (
    <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        <StatCard label="Portfolio revenue" icon="dollar-sign" value={<Money amount={totalRev} />} trend={{ dir: "up", text: "৳ this cycle" }} />
        <StatCard label="Net profit" icon="trending-up" value={<Money amount={totalProfit} />} tone="ok" trend={{ dir: "up", text: "38% margin" }} />
        <StatCard label="Open alerts" icon="bell" tone={totalAlerts ? "critical" : "ok"} value={String(totalAlerts)} trend={{ dir: "down", text: "1 critical" }} />
        <StatCard label="Avg survival" icon="fish" value={avgSurvival + "%"} trend={{ dir: "flat", text: "across 12 ponds" }} />
      </div>

      <div>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: "var(--text-primary)" }}>Projects</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {D.projects.map((p) => {
            const profit = p.revenue - p.cost;
            return (
              <Card key={p.id} interactive onClick={() => setView(p.id)} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{p.name}</div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                      <Icon name="map-pin" size={13} />{p.place}
                    </div>
                  </div>
                  <StatusBadge kind="batch" status={p.status} />
                </div>
                <div style={{ display: "flex", gap: 20 }}>
                  <Meta label="Ponds" value={p.ponds} />
                  <Meta label="Batches" value={p.batches} />
                  <Meta label="Survival" value={p.survival + "%"} />
                </div>
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Net profit</div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}><Money amount={profit} /></div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {p.alerts ? <Badge tone="critical" dot>{p.alerts} alert{p.alerts > 1 ? "s" : ""}</Badge> : <Badge tone="ok" icon="check">Clear</Badge>}
                    <Icon name="chevron-right" size={18} color="var(--text-secondary)" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{value}</div>
    </div>
  );
}

function ProjectView({ project }) {
  const p = project;
  const batches = D.batchesByProject[p.id] || [];
  const alerts = D.alertsByProject[p.id] || [];
  const tasks = D.tasksByProject[p.id] || [];
  const profit = p.revenue - p.cost;
  const closed = p.status === "CLOSED";
  return (
    <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
      {closed ? (
        <AlertBanner severity="warning" title="Project closed" action={<Button size="sm" variant="secondary">View archive</Button>}>
          This project is archived and read-only. Write controls are hidden.
        </AlertBanner>
      ) : null}

      {alerts.some((a) => a.severity === "CRITICAL" && a.state === "RAISED") ? (
        <AlertBanner severity="critical" title="Emergency raised — immediate attention"
          action={<Button size="sm" variant="danger">Acknowledge</Button>}>
          {alerts.find((a) => a.severity === "CRITICAL").note}
        </AlertBanner>
      ) : null}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        <StatCard label="Revenue" icon="dollar-sign" value={<Money amount={p.revenue} />} />
        <StatCard label="Net profit" icon="trending-up" tone="ok" value={<Money amount={profit} />} />
        <StatCard label="Survival" icon="fish" value={p.survival + "%"} />
        <StatCard label="Active batches" icon="clipboard-list" value={String(p.batches)} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, alignItems: "start" }}>
        <Card>
          <CardHeader title="Batches" subtitle={p.ponds + " ponds · polyculture"}
            action={!closed ? <Button size="sm" icon="plus">New batch</Button> : null} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            {batches.map((b, i) => (
              <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderTop: i ? "1px solid var(--border)" : "none" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--tint-brand)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="fish" size={20} color="var(--brand-primary)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{b.pond} · {b.species}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    Stocked <DualDate gregorian={b.stocked} bangla={b.bangla} /> · Day {b.doc}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{b.pcs.toLocaleString()} pcs</div>
                  <StatusBadge kind="batch" status={b.status} style={{ marginTop: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <WeatherWidget />
          <Card>
            <CardHeader title="Today's tasks" subtitle={"Worker: " + p.worker} />
            {tasks.length === 0 ? (
              <StateView variant="empty" compact title="No tasks today" message="Scheduled tasks will appear here." />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {tasks.map((t) => (
                  <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{t.title}</div>
                      <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{t.who} · {t.time}</div>
                    </div>
                    <StatusBadge kind="task" status={t.status} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader title="Alerts" subtitle="This project only" />
        {alerts.length === 0 ? (
          <StateView variant="empty" compact title="No active alerts" message="Water, feed and mortality are within normal range." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {alerts.map((a, i) => (
              <div key={a.id} style={{ display: "flex", gap: 14, padding: "14px 0", borderTop: i ? "1px solid var(--border)" : "none" }}>
                <div style={{ flexShrink: 0 }}><StatusBadge kind="severity" status={a.severity} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{a.title} <span style={{ fontWeight: 400, color: "var(--text-secondary)" }}>· {a.pond}</span></div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>{a.note}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}><DualDate gregorian={a.time.slice(0,10)} bangla={a.bangla} /></div>
                </div>
                <div style={{ flexShrink: 0 }}><StatusBadge kind="alert" status={a.state} /></div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

/* Weather widget — external service; demonstrates stale + unavailable states. */
function WeatherWidget() {
  const [mode, setMode] = useState("ok"); // ok | stale | down
  return (
    <Card>
      <CardHeader title="Weather" subtitle="Cumilla district"
        action={<div style={{ display: "flex", gap: 4 }}>
          {["ok", "stale", "down"].map((m) => (
            <button key={m} onClick={() => setMode(m)} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 999, cursor: "pointer",
              border: "1px solid " + (mode === m ? "var(--brand-primary)" : "var(--border)"),
              background: mode === m ? "var(--tint-brand)" : "var(--surface)", color: mode === m ? "var(--brand-primary-dark)" : "var(--text-secondary)" }}>{m}</button>
          ))}
        </div>} />
      {mode === "down" ? (
        <StateView variant="unavailable" compact title="Weather unavailable"
          message="Temporarily unavailable — the rest of the page is unaffected." />
      ) : (
        <div>
          {mode === "stale" ? (
            <div style={{ marginBottom: 10 }}>
              <AlertBanner severity="warning" title="Showing cached data">Last updated 6h ago — network unreachable.</AlertBanner>
            </div>
          ) : null}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Icon name="cloud" size={40} color="var(--brand-accent)" />
            <div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>31°C</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>Monsoon · high humidity · rain likely</div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function OwnerApp() {
  const [view, setView] = useState("portfolio");
  const project = D.projects.find((p) => p.id === view);
  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", fontFamily: "var(--font-base)", color: "var(--text-primary)" }}>
      <Sidebar view={view} setView={setView} />
      <main style={{ flex: 1, overflow: "auto" }}>
        {view === "portfolio" ? (
          <>
            <TopBar title="Portfolio" subtitle="All owned projects" />
            <PortfolioView setView={setView} />
          </>
        ) : (
          <>
            <TopBar title={project.name} subtitle={project.place + " · Worker: " + project.worker + (project.partner ? " · Partner: " + project.partner : "")}
              right={<Button size="sm" variant="ghost" icon="arrow-left" onClick={() => setView("portfolio")}>Portfolio</Button>} />
            <ProjectView project={project} />
          </>
        )}
      </main>
    </div>
  );
}

window.OwnerApp = OwnerApp;
