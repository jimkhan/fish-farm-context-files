# Modules Overview — Fish Farm Management System (FMS)

> Version 1.0 · 2026-07-02 · Index of the 12 modules, cross-cutting concerns, and the
> implementation order (a topological sort of the acyclic dependency map in `MODULE_LIST.md`,
> reconciled with the `CLAUDE.md §9` build order). Per-module detail files are written in Phase 5.

## Module index

| # | Module | Surface | Purpose | Owns features | Detail file |
|---|---|---|---|---|---|
| MOD-01 | Platform & Tenant Foundation | backend, shared | Scaffold + shared-kernel: isolation, audit, errors, events, persistence. | FT-001…FT-007 | modules/01-platform-tenant-foundation.md |
| MOD-02 | Identity, Auth & Membership | backend | Auth + per-project membership/RBAC. | FT-008…FT-011 | modules/02-identity-auth-membership.md |
| MOD-03 | Projects, Portfolio & Owner Web App | backend, web | Project aggregate, portfolio roll-up, owner web shell. | FT-012…FT-017 | modules/03-projects-portfolio-web-app.md |
| MOD-04 | Ponds, Stocking & Batches | backend | Ponds, stocking, batches, survival & biomass. | FT-018…FT-022 | modules/04-ponds-stocking-batches.md |
| MOD-05 | Feed & Inventory | backend | Feed quota/schedules/logging + per-project inventory. | FT-023…FT-031 | modules/05-feed-inventory.md |
| MOD-06 | Water Quality & Emergency | backend | Readings, thresholds, trends, emergency, aeration. | FT-032…FT-037 | modules/06-water-quality-emergency.md |
| MOD-07 | Health, Growth & Harvest | backend | Mortality, treatments, sampling, ADG/SGR/FCR, harvest. | FT-038…FT-045 | modules/07-health-growth-harvest.md |
| MOD-08 | Finance & ROI | backend, web | Costs, revenue, net profit & ROI, role-gated. | FT-046…FT-049 | modules/08-finance-roi.md |
| MOD-09 | Notifications & Alerts | backend | Alert lifecycle + channels (FCM MVP). | FT-050…FT-052 | modules/09-notifications-alerts.md |
| MOD-10 | Monitoring & Reporting | backend, web | Camera, weather, daily summary, exports. | FT-053…FT-057 | modules/10-monitoring-reporting.md |
| MOD-11 | Bangla Calendar (shared) | shared | One Bangla-calendar impl for all surfaces. | FT-058…FT-062 | modules/11-bangla-calendar.md |
| MOD-12 | Worker Mobile App: Tasks, Daily Log & Offline Sync | mobile, backend | Offline-first Bangla worker app + task domain + sync. | FT-063…FT-069 | modules/12-worker-mobile-app.md |

## Cross-cutting concerns

- **Tenant isolation** (MOD-01: FT-003/FT-004) — the project-scope guard + scoped-repository base;
  every project-owned query is auto-filtered. The single most important mechanism; a negative
  isolation test is a deliverable on every project-owned unit (NFR-011).
- **Auth & RBAC** (MOD-02) — per-request membership/role resolution; consumed by every endpoint.
- **API contract** (`contracts/openapi.yaml`) — the shared seam; backend implements, clients
  generate. Changes are a human-approved guardrail.
- **Design tokens** (`contracts/design-tokens.json`) — shared by web + mobile UI.
- **Bangla calendar** (MOD-11) — the only sanctioned source of Bangla dates; used everywhere.
- **Error contract & domain-error mapping** (MOD-01: FT-006) — one error shape across surfaces.
- **Audit logging** (MOD-01: FT-005) — every state change, within the same transaction.
- **Domain events** (MOD-01: FT-007) — decouple cross-module reactions (alerts, deductions,
  survival/FCR updates).
- **Offline sync** (MOD-12: FT-064/FT-065) — the mobile local store + queue + server reconciliation.

## Implementation order (topological; respects the DAG and CLAUDE.md §9)

CLAUDE.md build order is `E0 → E1 → E2 → E3 → E4 → E5 → E7 → E6 → E8`, with the E0 foundation
(scaffold, auth, project+membership E0-S6, tenant isolation E0-S7, calendar E0-S8) **before any
project-owned domain module**. Mapped to modules:

1. **MOD-01 — Platform & Tenant Foundation** (E0: scaffold + isolation E0-S7 + audit + events + persistence). *Blocks everything.*
2. **MOD-11 — Bangla Calendar** (E0-S8; pure/shared — can be built in parallel with MOD-01/02).
3. **MOD-02 — Identity, Auth & Membership** (E0: auth + membership).
4. **MOD-03 — Projects, Portfolio & Owner Web App** (E0-S6 project+membership; web shell). *Tenant isolation (step 1) must exist before this queries project data.*
5. **MOD-09 — Notifications & Alerts** (alert infra needed by domains that raise alerts).
6. **MOD-04 — Ponds, Stocking & Batches** (first project-owned domain).
7. **MOD-05 — Feed & Inventory**.
8. **MOD-06 — Water Quality & Emergency**.
9. **MOD-07 — Health, Growth & Harvest**.
10. **MOD-10 — Monitoring & Reporting**.
11. **MOD-08 — Finance & ROI**.
12. **MOD-12 — Worker Mobile App: Tasks, Daily Log & Offline Sync** (consumes the domain APIs; the offline engine + sync endpoint are the highest-risk client work).

**Cross-surface notes:** the owner **web shell** (MOD-03/FT-016) must precede web features of
MOD-08/MOD-10; the **mobile shell + offline engine** (MOD-12/FT-063/FT-064) must precede mobile
delivery of MOD-04/05/06/07 features. MOD-11 (calendar) must precede any surface rendering Bangla
dates. Phase-1 (P1) features across these modules constitute the MVP; P2/P3 features are scheduled
after the P1 slice of each module ships.

---

*Modules Overview — Fish Farm Management System. Phase 4 artifact.*
