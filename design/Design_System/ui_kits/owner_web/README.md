# Owner Web — UI kit

High-fidelity recreation of the **Owner** web experience for FMS. The owner runs
2–4 pond projects remotely with full read/write and a cross-project portfolio,
and is the only role that sees finances and settings.

## Screens / flow (`index.html`)
1. **Portfolio** — KPI stat tiles (revenue, net profit, open alerts, avg survival) + a
   card per owned project. Click a project card (or the sidebar) to drill in.
2. **Project view** — per-project KPIs, batches list (polyculture: SPF Golda, Parse,
   Carp), today's tasks, alerts (this-project-only), and a weather widget.

## States demonstrated
- **Degraded/stale external service** — the Weather widget has ok / stale / down toggles
  (top-right) showing the cached-data warning and the calm "temporarily unavailable" state.
- **Critical emergency** — Jamuna project surfaces a raised emergency banner.
- **Empty** — projects with no alerts/tasks show purposeful empty states.
- **Closed project** — `ProjectView` renders the archived read-only banner when status is CLOSED.

## Localization
Dual dates everywhere (Gregorian + Bangla in parens via `DualDate`); all money via
`Money` (৳ + Bengali numerals + lakh/crore grouping). General counts are Western on web.

## Composition
Composes DS primitives only — `Sidebar`/`TopBar` are layout scaffolding local to this kit;
everything else is `StatCard`, `Card`, `StatusBadge`, `AlertBanner`, `StateView`, `Money`,
`DualDate`, `Button`, `IconButton`, `Icon`. Data is mock content in `ownerData.js`.

Files: `index.html`, `OwnerDashboard.jsx`, `ownerData.js`.
