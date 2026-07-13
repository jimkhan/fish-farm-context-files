# Module List — Fish Farm Management System (FMS)

> Version 1.0 · 2026-07-02 · 12 modules. Every `FT-` maps to exactly one module. Numbers are
> zero-padded and immutable. "Surface" is the module's **primary** surface; individual features
> may span surfaces (delivered as per-surface tasks in Phase 6). Cross-module *data* needs are
> satisfied via domain events + read-models (ADR-015), so the **build/code** dependency graph
> stays acyclic even where runtime data flows both ways. Detail files are authored in Phase 5.

---

### MOD-01 — Platform & Tenant Foundation   (Surface: backend, shared)
- **Summary:** The backend skeleton and the shared-kernel that makes tenant isolation, audit, and
  cross-module events uniform. Nothing project-owned is queried before this exists.
- **Scope:** NestJS scaffold + config + health; TypeORM Data Mapper data source + migrations
  pipeline; project-scope guard + tenant context; scoped-repository base; audit interceptor;
  domain-error→HTTP filter + error contract; in-process domain event bus.
- **Owns features:** FT-001, FT-002, FT-003, FT-004, FT-005, FT-006, FT-007
- **Sub-modules:** config · persistence · shared-kernel (isolation/audit/errors) · events
- **Dependencies:** none
- **Contract refs:** shared `Error` schema (used by all)
- **Detail file:** modules/01-platform-tenant-foundation.md

### MOD-02 — Identity, Auth & Membership   (Surface: backend)
- **Summary:** Who the user is and what they may do — per-project, never global.
- **Scope:** login + JWT issue/refresh; password reset; users; `ProjectMembership`; per-request
  role resolution; RBAC gates (Worker no finance/settings; Partner read-only).
- **Owns features:** FT-008, FT-009, FT-010, FT-011
- **Sub-modules:** auth · users · membership · rbac
- **Dependencies:** MOD-01
- **Contract refs:** CON-001, CON-002, CON-003, CON-004, CON-005, CON-010, CON-011, CON-012
- **Detail file:** modules/02-identity-auth-membership.md

### MOD-03 — Projects, Portfolio & Owner Web App   (Surface: backend, web)
- **Summary:** The Project aggregate, the portfolio roll-up, and the owner web application shell
  that hosts every owner-facing page.
- **Scope:** project CRUD (site/currency/land unit/status); inline first pond; active-project scope
  selection; portfolio roll-up (biomass + alerts; finance snapshot in P2); Next.js shell (routing,
  layout, session, theming); dual-date rendering.
- **Owns features:** FT-012, FT-013, FT-014, FT-015, FT-016, FT-017
- **Sub-modules:** projects · portfolio · web-shell
- **Dependencies:** MOD-01, MOD-02, MOD-11 (dates)
- **Contract refs:** CON-006, CON-007, CON-008, CON-009, CON-035
- **Detail file:** modules/03-projects-portfolio-web-app.md

### MOD-04 — Ponds, Stocking & Batches   (Surface: backend)
- **Summary:** The physical/biological core: ponds, stocking events, batches, survival & biomass.
- **Scope:** ponds (area/depth/notes); stocking events; batch creation + running survival estimate;
  stocking-density advisory; biomass overview derivation.
- **Owns features:** FT-018, FT-019, FT-020, FT-021, FT-022
- **Sub-modules:** ponds · stocking · batches · biomass
- **Dependencies:** MOD-01, MOD-03
- **Contract refs:** CON-013, CON-014, CON-015, CON-016, CON-017, CON-043
- **Detail file:** modules/04-ponds-stocking-batches.md

### MOD-05 — Feed & Inventory   (Surface: backend)
- **Summary:** Feed discipline and the per-project stock it draws down — tightly coupled by
  auto-deduction.
- **Scope:** feed quota calculator (BW% × sampling); temp/DO adjustment; floating vs sinking
  schedules; feeding reminders; feeding log + inventory auto-deduction; check-tray; inventory items
  + transactions + reconciliation; low-stock alerts.
- **Owns features:** FT-023, FT-024, FT-025, FT-026, FT-027, FT-028, FT-029, FT-030, FT-031
- **Sub-modules:** feed-calc · schedules · feeding-log · inventory
- **Dependencies:** MOD-01, MOD-04, MOD-09 (low-stock alerts); consumes `SamplingRecorded`
  (MOD-07) and water read-model (MOD-06) via events — no build cycle.
- **Contract refs:** CON-018, CON-018a, CON-022, CON-023, CON-024
- **Detail file:** modules/05-feed-inventory.md

### MOD-06 — Water Quality & Emergency   (Surface: backend)
- **Summary:** The highest-priority loss-prevention domain: readings, thresholds, emergencies.
- **Scope:** water reading capture (7 parameters, manual/sensor); configurable thresholds + breach
  events; trend data; pond-bottom/aeration logs; one-tap emergency water event; secured sensor
  ingestion (P3).
- **Owns features:** FT-032, FT-033, FT-034, FT-035, FT-036, FT-037
- **Sub-modules:** readings · thresholds · trends · emergency · sensor-ingestion
- **Dependencies:** MOD-01, MOD-04, MOD-09 (alerts)
- **Contract refs:** CON-025, CON-026, CON-027, CON-027a, CON-028, CON-044
- **Detail file:** modules/06-water-quality-emergency.md

### MOD-07 — Health, Growth & Harvest   (Surface: backend)
- **Summary:** Everything about stock condition over time and its removal.
- **Scope:** mortality (→survival/biomass); treatments; abnormal-mortality detection; sampling;
  growth analytics (ADG/SGR); pond-level FCR + survival; partial harvests; harvest-to-date vs
  projected.
- **Owns features:** FT-038, FT-039, FT-040, FT-041, FT-042, FT-043, FT-044, FT-045
- **Sub-modules:** mortality-health · sampling-growth · fcr-survival · harvest
- **Dependencies:** MOD-01, MOD-04, MOD-09 (alerts); consumes `FeedingLogged` (MOD-05) for FCR via
  events — no build cycle.
- **Contract refs:** CON-019, CON-020, CON-021
- **Detail file:** modules/07-health-growth-harvest.md

### MOD-08 — Finance & ROI   (Surface: backend, web)
- **Summary:** The money picture per project and across the portfolio, strictly role-gated.
- **Scope:** BDT cost recording; harvest revenue + remaining harvest value; real-time net profit &
  projected ROI (per project + roll-up); Owner/Partner read-only, hidden from Worker.
- **Owns features:** FT-046, FT-047, FT-048, FT-049
- **Sub-modules:** costs · revenue · roi · finance-rbac
- **Dependencies:** MOD-01, MOD-03; consumes harvest (MOD-07) and feed-cost (MOD-05) events — no
  build cycle.
- **Contract refs:** CON-032, CON-033, CON-034
- **Detail file:** modules/08-finance-roi.md

### MOD-09 — Notifications & Alerts   (Surface: backend)
- **Summary:** The one place alerts are raised, delivered, and acknowledged — consumed by every
  domain that can breach a threshold.
- **Scope:** alert lifecycle + 5 types; channel port with FCM push (MVP), SMS/WhatsApp adapters
  (P2); device registration; critical-alert reliable delivery + acknowledgement + SLA.
- **Owns features:** FT-050, FT-051, FT-052
- **Sub-modules:** alert-engine · channels (fcm/sms/whatsapp) · delivery-sla
- **Dependencies:** MOD-01, MOD-02, MOD-03; subscribes to events from MOD-05/06/07/12.
- **Contract refs:** CON-038, CON-039, CON-045
- **Detail file:** modules/09-notifications-alerts.md

### MOD-10 — Monitoring & Reporting   (Surface: backend, web)
- **Summary:** Owner situational awareness that isn't an alert: live camera, weather, and reports.
- **Scope:** per-site camera stream config + web player; camera policy (live-only MVP); site-local
  weather widget with graceful degradation; daily owner summary; report exports.
- **Owns features:** FT-053, FT-054, FT-055, FT-056, FT-057
- **Sub-modules:** camera · weather · reporting-exports
- **Dependencies:** MOD-01, MOD-03; reads read-models across domains for summaries/exports.
- **Contract refs:** CON-036, CON-037, CON-042, CON-046
- **Detail file:** modules/10-monitoring-reporting.md

### MOD-11 — Bangla Calendar (shared)   (Surface: shared)
- **Summary:** The one Bangla-calendar implementation used identically by backend, web, and mobile.
- **Scope:** Gregorian↔Bangla conversion (Bangladesh-revised 2019); Bengali numerals + formatting;
  ritu + seasonal advisories; Bangla months/seasons in tasks & reports; anchor-test verification.
- **Owns features:** FT-058, FT-059, FT-060, FT-061, FT-062
- **Sub-modules:** conversion · numerals-format · ritu-advisories · anchors
- **Dependencies:** none (pure package; no framework — CLAUDE.md invariant #6)
- **Contract refs:** CON-041
- **Detail file:** modules/11-bangla-calendar.md

### MOD-12 — Worker Mobile App: Tasks, Daily Log & Offline Sync   (Surface: mobile, backend)
- **Summary:** The make-or-break worker surface — offline-first, Bangla, ≤2-minute — plus the task
  domain it revolves around and the server sync endpoint.
- **Scope:** RN app shell (single-project binding, Bangla i18n, icon-first); offline store + sync
  queue engine; sync endpoint + conflict resolution; icon-driven Bangla Daily Log; recurring task
  scheduler + reminders; task completion with proof photo; mobile camera view.
- **Owns features:** FT-063, FT-064, FT-065, FT-066, FT-067, FT-068, FT-069
- **Sub-modules:** mobile-shell · offline-engine · sync-api · daily-log · tasks
- **Dependencies:** MOD-01, MOD-02, MOD-04, MOD-05, MOD-06, MOD-07, MOD-09, MOD-11 (consumes their
  APIs/contract; tasks emit `MissedTask` to MOD-09).
- **Contract refs:** CON-040, CON-029, CON-030, CON-031
- **Detail file:** modules/12-worker-mobile-app.md

---

## Module dependency map (acyclic)

```
MOD-01  Platform & Tenant Foundation        → (none)
MOD-11  Bangla Calendar (shared)            → (none)
MOD-02  Identity, Auth & Membership         → MOD-01
MOD-03  Projects, Portfolio & Web App       → MOD-01, MOD-02, MOD-11
MOD-09  Notifications & Alerts              → MOD-01, MOD-02, MOD-03
MOD-04  Ponds, Stocking & Batches           → MOD-01, MOD-03
MOD-05  Feed & Inventory                    → MOD-01, MOD-04, MOD-09
MOD-06  Water Quality & Emergency           → MOD-01, MOD-04, MOD-09
MOD-07  Health, Growth & Harvest            → MOD-01, MOD-04, MOD-09
MOD-08  Finance & ROI                       → MOD-01, MOD-03
MOD-10  Monitoring & Reporting              → MOD-01, MOD-03
MOD-12  Worker Mobile App / Tasks / Sync    → MOD-01, MOD-02, MOD-04, MOD-05, MOD-06, MOD-07, MOD-09, MOD-11
```

No cycles: all edges point to lower-level modules. Runtime bidirectional data (feed↔sampling,
finance↔harvest/feed) is carried by domain events + read-models (ADR-015), not build-time imports.

---

*Module List — Fish Farm Management System. Phase 4 artifact. IDs: MOD-01…MOD-12.*
