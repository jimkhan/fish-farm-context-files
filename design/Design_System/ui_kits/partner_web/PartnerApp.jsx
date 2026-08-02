const { useState } = React;
const NS = window.FMSAquacultureDesignSystem_dbe44a;
const { Button, IconButton, Card, CardHeader, Badge, StatusBadge, Money, DualDate,
  AlertBanner, StateView, StatCard, Icon } = NS;

/* Partner (investor) — READ-ONLY on co-owned project(s) only. Sees finances.
   No portfolio, no write controls, no settings, no member admin. */
const P = {
  partner: { name: "Nasrin Trading", initials: "NT" },
  today: { gregorian: "2026-07-21", bangla: "5 শ্রাবণ 1433" },
  project: {
    name: "Jamuna Gher", place: "Sariakandi, Bogura", status: "HARVESTING",
    revenue: 1120000, cost: 690000, invested: 400000, sharePct: 35,
  },
  batches: [
    { id: "J1", pond: "Pond J1", species: "SPF Golda", status: "HARVESTING", grade: "EXPORT", stocked: "2025-12-15", bangla: "1 পৌষ 1432", pcs: 51000 },
    { id: "J4", pond: "Pond J4", species: "Parse (mullet)", status: "ACTIVE", grade: "LOCAL", stocked: "2026-05-20", bangla: "6 জ্যৈষ্ঠ 1433", pcs: 22000 },
  ],
  ledger: [
    { id: 1, label: "Harvest sale — J1 (export grade)", date: "2026-07-18", bangla: "3 শ্রাবণ 1433", amount: 620000 },
    { id: 2, label: "Feed purchase — grower", date: "2026-07-10", bangla: "26 আষাঢ় 1433", amount: -184000 },
    { id: 3, label: "Harvest sale — J1 (local)", date: "2026-07-04", bangla: "20 আষাঢ় 1433", amount: 500000 },
    { id: 4, label: "Aeration / diesel", date: "2026-06-28", bangla: "14 আষাঢ় 1433", amount: -46000 },
  ],
};

function PartnerApp() {
  const pr = P.project;
  const profit = pr.revenue - pr.cost;
  const share = Math.round(profit * pr.sharePct / 100);
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "var(--font-base)", color: "var(--text-primary)" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px", background: "var(--brand-primary-dark)", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: -1 }}>FMS</span>
          <span style={{ fontSize: 12, opacity: .7 }}>Partner</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 13, opacity: .85 }}><DualDate gregorian={P.today.gregorian} bangla={P.today.bangla} tone="inverse" /></span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 999, background: "var(--brand-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{P.partner.initials}</div>
            <span style={{ fontSize: 13 }}>{P.partner.name}</span>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>{pr.name}</h1>
            <div style={{ fontSize: 14, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
              <Icon name="map-pin" size={15} />{pr.place}
            </div>
          </div>
          <StatusBadge kind="batch" status={pr.status} />
        </div>

        <AlertBanner severity="info" title="Read-only view">
          You have investor access to this project. Finances are visible; operational and
          settings controls are managed by the owner.
        </AlertBanner>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          <StatCard label="Revenue" icon="dollar-sign" value={<Money amount={pr.revenue} />} />
          <StatCard label="Net profit" icon="trending-up" tone="ok" value={<Money amount={profit} />} trend={{ dir: "up", text: "38% margin" }} />
          <StatCard label={`Your share (${pr.sharePct}%)`} icon="scale" value={<Money amount={share} />} />
          <StatCard label="Your investment" icon="dollar-sign" value={<Money amount={pr.invested} />} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
          <Card>
            <CardHeader title="Finance ledger" subtitle="This project only" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              {P.ledger.map((l, i) => (
                <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: i ? "1px solid var(--border)" : "none" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 999, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    background: l.amount >= 0 ? "var(--tint-ok)" : "var(--tint-critical)" }}>
                    <Icon name={l.amount >= 0 ? "trending-up" : "trending-down"} size={16} color={l.amount >= 0 ? "var(--status-ok)" : "var(--status-danger)"} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{l.label}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}><DualDate gregorian={l.date} bangla={l.bangla} /></div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>
                    <Money amount={l.amount} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Batches" subtitle="Polyculture stock" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              {P.batches.map((b, i) => (
                <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: i ? "1px solid var(--border)" : "none" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--tint-brand)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name="fish" size={20} color="var(--brand-primary)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{b.pond} · {b.species}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Stocked <DualDate gregorian={b.stocked} bangla={b.bangla} /></div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                    <StatusBadge kind="batch" status={b.status} />
                    <StatusBadge kind="grade" status={b.grade} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ fontSize: 12, color: "var(--text-secondary)", textAlign: "center", padding: "4px 0" }}>
          Investor access · read-only · Jamuna Gher only
        </div>
      </div>
    </div>
  );
}

window.PartnerApp = PartnerApp;
