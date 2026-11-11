# Backlog — Fish Farm Management System (FMS)

> Version 1.0 · 2026-07-02 · Jira-ready, AI-actionable, surface-tagged `TASK-` cards. Every card
> traces up by ID (AC → FR/NFR → FT → MOD → BR) and its dependencies form a DAG (build order).
> Every `AC-001…AC-139` appears in ≥ 1 card. Cross-surface work is split into per-surface cards.
> Target repos: `fish-farm-backend`, `fish-farm-web`, `fish-farm-mobile-app`; shared packages
> (`packages/calendar`, `packages/shared`) are hosted in `fish-farm-backend/packages/*` and
> published to the clients (see Open Item OI-1).

## Standard Definition of Done (applies to every card, plus card-specific items)
- All listed `AC-` have passing tests (Given/When/Then); domain logic unit-tested; module has one
  happy + one failure integration test.
- **Tenant-isolation negative test** where the card touches project-owned data (a non-member is
  denied) — a required deliverable (NFR-011).
- Offline path verified for any worker-app card (write offline → sync → assert no loss, NFR-001).
- Calendar cards pass the anchor tests (NFR-016).
- Migration included and reversible; `synchronize:false`; no secrets in code (NFR-005).
- Lint + type-check + tests green; diff self-contained to the unit.
- `contracts/openapi.yaml` honored; `TRACEABILITY_MATRIX.md` + `MODULE_PROGRESS_TRACKER.md` updated.
- Human review gate passed (intent/correctness).

## Priority / build note
IDs are grouped by module in `MODULES_OVERVIEW.md` implementation order. Depend-on edges (not ID
order) define the true build DAG. P1 = MVP; P2/P3 later.

---

## MOD-01 — Platform & Tenant Foundation

### TASK-001 — Scaffold the NestJS API, config, health, and layering purity check
- **Type:** Chore  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-01  **Delivers:** FT-001  **Satisfies:** NFR-006, NFR-010, NFR-005, NFR-007  **Contract:** CON-047 (GET /health)
- **Priority:** P1  **Estimate:** 3  **Depends on:** —
- **Context** — The modular-monolith skeleton every module builds on; establishes Clean-Architecture folders and the domain-purity static check (ADR-001).
- **Acceptance criteria** — AC-001, AC-002, AC-009
- **Technical notes** — `src/main.ts`, `src/app.module.ts`, `src/platform/config`; env-schema validation fail-fast; global validation pipe; static check that `**/domain/**` imports no framework.
- **Non-goals** — No domain modules; no persistence yet.

### TASK-002 — TypeORM Data Mapper data source + reversible migration pipeline
- **Type:** Chore  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-01  **Delivers:** FT-002  **Satisfies:** NFR-006  **Contract:** —
- **Priority:** P1  **Estimate:** 3  **Depends on:** TASK-001
- **Context** — Data Mapper persistence with `synchronize:false`; the `BaseProjectOwnedPersistenceModel` (indexed `project_id`) other modules extend (ADR-007).
- **Acceptance criteria** — AC-011, AC-012
- **Technical notes** — `src/platform/persistence`; migration:generate/run/revert scripts; base persistence model + mapper convention.
- **Non-goals** — No business tables.

### TASK-003 — Error contract + domain-error → HTTP filter + correlation id
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-01  **Delivers:** FT-006  **Satisfies:** NFR-005  **Contract:** Error schema
- **Priority:** P1  **Estimate:** 2  **Depends on:** TASK-001
- **Context** — Typed `DomainError` hierarchy mapped to the shared `Error` schema; 403/404 uniform (no project-existence disclosure).
- **Acceptance criteria** — AC-008
- **Technical notes** — `src/shared-kernel/errors`; global exception filter; correlation middleware.
- **Non-goals** — No per-module error types (those live in their modules).

### TASK-004 — Tenant isolation: project-scope guard + tenant context + scoped-repository base
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-01  **Delivers:** FT-003, FT-004  **Satisfies:** FR-003, NFR-011  **Contract:** —
- **Priority:** P1  **Estimate:** 5  **Depends on:** TASK-002, TASK-003
- **Context** — The single sanctioned data path (ADR-006, E0-S7). Must exist before any project-owned table is queried. Uses `MembershipResolverPort` (impl by MOD-02).
- **Acceptance criteria** — AC-003, AC-004, AC-005, AC-010, AC-014
- **Technical notes** — `src/shared-kernel/tenant`; request-scoped `TenantContext`; `ScopedRepository<T>`; anti-enumeration 403/404; **negative isolation test required**.
- **Non-goals** — No RLS in MVP (OI-2, guardrail).

### TASK-005 — Audit trail interceptor (in-transaction)
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-01  **Delivers:** FT-005  **Satisfies:** FR-005, NFR-012  **Contract:** —
- **Priority:** P1  **Estimate:** 3  **Depends on:** TASK-004
- **Context** — Immutable actor/project/action/entity/timestamp within the same transaction as the change (basis of remote trust).
- **Acceptance criteria** — AC-006, AC-007
- **Technical notes** — `src/shared-kernel/audit`; append-only `audit_entry`; rollback on audit failure.
- **Non-goals** — No audit UI.

### TASK-006 — In-process domain event bus
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-01  **Delivers:** FT-007  **Satisfies:** (enables FR-020/023/028/030/043)  **Contract:** —
- **Priority:** P1  **Estimate:** 2  **Depends on:** TASK-001
- **Context** — Publish/subscribe for `PascalCase` past-tense events; contracts in `packages/shared` (ADR-015). Subscriber failure never crashes the request.
- **Acceptance criteria** — AC-013
- **Technical notes** — `src/platform/events`; idempotent-consumer helper.
- **Non-goals** — No external broker.

---

## MOD-11 — Bangla Calendar (shared)

### TASK-007 — `packages/calendar`: conversion, numerals, ritu, anchors
- **Type:** Feature  **Surface:** shared  **Target repo:** fish-farm-backend/packages/calendar (see OI-1)
- **Module:** MOD-11  **Delivers:** FT-058, FT-059, FT-060, FT-061, FT-062  **Satisfies:** FR-057…FR-061, NFR-016, NFR-002  **Contract:** CON-041
- **Priority:** P1  **Estimate:** 5  **Depends on:** —
- **Context** — The one Bangla-calendar impl (Bangladesh-revised 2019), used identically by backend/web/mobile (ADR-011). Pure, no framework, no `Intl`/ICU.
- **Acceptance criteria** — AC-041, AC-042, AC-043, AC-044, AC-045, AC-046, AC-047, AC-048, AC-049
- **Technical notes** — conversion + month-length/leap logic; Bengali numerals; ritu + advisory registry; **anchor suite + leap + round-trip + no-`Intl` static check required**; thin backend `GET /calendar/convert` (CON-041).
- **Non-goals** — Advisory *content* (authored by MOD-05/06).

---

## MOD-02 — Identity, Auth & Membership

### TASK-008 — Authentication: login, JWT access/refresh, credential hashing
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-02  **Delivers:** FT-008  **Satisfies:** FR-001, NFR-005  **Contract:** CON-001, CON-002
- **Priority:** P1  **Estimate:** 5  **Depends on:** TASK-004
- **Context** — JWT sessions; token carries `sub` only (ADR-005); argon2id; refresh rotation with replay revocation.
- **Acceptance criteria** — AC-015, AC-016, AC-017, AC-018, AC-019, AC-028
- **Technical notes** — `src/modules/identity` auth; `refresh_token` family; no user enumeration.
- **Non-goals** — No social login; no logout endpoint in MVP.

### TASK-009 — Password reset + basic account management
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-02  **Delivers:** FT-009  **Satisfies:** FR-006  **Contract:** CON-003, CON-004
- **Priority:** P1  **Estimate:** 2  **Depends on:** TASK-008
- **Context** — Single-use, time-boxed reset tokens.
- **Acceptance criteria** — AC-020
- **Technical notes** — `password_reset_token`; used/expired rejected.
- **Non-goals** — No email templating engine (adapter only).

### TASK-010 — Membership + RBAC resolver + capability matrix (implements MembershipResolverPort)
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-02  **Delivers:** FT-010, FT-011  **Satisfies:** FR-002, FR-004, FR-009, NFR-011  **Contract:** CON-005, CON-010, CON-011, CON-012
- **Priority:** P1  **Estimate:** 5  **Depends on:** TASK-008
- **Context** — Per-project role resolution feeding MOD-01's guard; Worker-one-active-project + last-Owner invariants; the capability matrix (Worker no finance/settings; Partner read-only) is the single source reused downstream.
- **Acceptance criteria** — AC-021, AC-022, AC-023, AC-024, AC-025, AC-026, AC-027, AC-029
- **Technical notes** — `membership`, `rbac`; `@Roles()` guard; invite-by-email cross-project non-exposure test required.
- **Non-goals** — No org-wide roles.

---

## MOD-03 — Projects, Portfolio & Owner Web App

### TASK-011 — Project CRUD, status, scope selection (backend)
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-03  **Delivers:** FT-012, FT-014  **Satisfies:** FR-007, FR-011  **Contract:** CON-006, CON-007, CON-008, CON-009
- **Priority:** P1  **Estimate:** 5  **Depends on:** TASK-010, TASK-004
- **Context** — Project aggregate (site/currency/land unit/status); creating a project creates the OWNER membership; declares `ProvisionFirstPondPort`.
- **Acceptance criteria** — AC-030, AC-031, AC-033, AC-036, AC-040
- **Technical notes** — `src/modules/projects`; closed-project read-only; scope selection drives TenantContext.
- **Non-goals** — Inline pond creation lives in TASK-018 (the adapter).

### TASK-012 — Portfolio roll-up API (backend)
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-03  **Delivers:** FT-015  **Satisfies:** FR-010, NFR-011  **Contract:** CON-035
- **Priority:** P1  **Estimate:** 3  **Depends on:** TASK-011, TASK-019, TASK-015
- **Context** — Aggregate biomass (MOD-04) + open alerts (MOD-09) across owned projects; finance snapshot in P2.
- **Acceptance criteria** — AC-034, AC-035
- **Technical notes** — reads read-models; owner-only; never includes a non-owned project.
- **Non-goals** — No finance in P1 roll-up.

### TASK-013 — Owner web app shell: routing, auth session, theming (web)
- **Type:** Feature  **Surface:** web  **Target repo:** fish-farm-web
- **Module:** MOD-03  **Delivers:** FT-016  **Satisfies:** NFR-002, NFR-014, NFR-005  **Contract:** (consumes)
- **Priority:** P1  **Estimate:** 5  **Depends on:** TASK-011, TASK-007
- **Context** — Next.js shell hosting all owner pages; auth-guard redirect; design-token theming; graceful-degradation wrappers.
- **Acceptance criteria** — AC-038, AC-039
- **Technical notes** — generated API client from openapi; WCAG AA smoke; TanStack Query.
- **Non-goals** — Per-domain pages arrive with their modules.

### TASK-014 — Project + portfolio web pages with dual dates (web)
- **Type:** Feature  **Surface:** web  **Target repo:** fish-farm-web
- **Module:** MOD-03  **Delivers:** FT-017, FT-015(web)  **Satisfies:** FR-058, FR-010, NFR-002  **Contract:** CON-006/007/035
- **Priority:** P1  **Estimate:** 3  **Depends on:** TASK-013, TASK-012
- **Context** — Project create/edit + inline first-pond form; portfolio dashboard; dual-date rendering everywhere.
- **Acceptance criteria** — AC-037
- **Technical notes** — `DualDate` component (MOD-11); ProjectForm with firstPond; ProjectSwitcher.
- **Non-goals** — No finance widgets (P2).

---

## MOD-09 — Notifications & Alerts

### TASK-015 — Alert engine: lifecycle, types, dedup, recipient policy
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-09  **Delivers:** FT-050  **Satisfies:** FR-053, NFR-011  **Contract:** CON-038, CON-039
- **Priority:** P1  **Estimate:** 5  **Depends on:** TASK-010, TASK-006
- **Context** — Subscribes to domain events; raises scoped alerts; state machine; debounce; idempotent by dedup key.
- **Acceptance criteria** — AC-050, AC-051, AC-055, AC-056, AC-058, AC-059
- **Technical notes** — `src/modules/notifications`; scoped-recipient negative test required.
- **Non-goals** — Channel delivery is TASK-016.

### TASK-016 — Push (FCM) channel + device registration + SMS/WhatsApp stubs
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-09  **Delivers:** FT-051  **Satisfies:** FR-052  **Contract:** CON-045
- **Priority:** P1  **Estimate:** 3  **Depends on:** TASK-015
- **Context** — `NotificationChannel` port; FCM active; SMS/WhatsApp inactive stubs (Phase 2 additive).
- **Acceptance criteria** — AC-053, AC-057
- **Technical notes** — FCM key via env; `device_token` registry.
- **Non-goals** — No SMS/WhatsApp delivery in MVP.

### TASK-017 — Critical delivery reliability + SLA escalation + acknowledgement
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-09  **Delivers:** FT-052  **Satisfies:** FR-054, NFR-013  **Contract:** CON-039
- **Priority:** P1  **Estimate:** 3  **Depends on:** TASK-016
- **Context** — CRITICAL reaches owner even if app closed (high-priority FCM); retry/backoff/fallback; SLA scan re-notifies.
- **Acceptance criteria** — AC-052, AC-054
- **Technical notes** — `@nestjs/schedule` SLA scanner; idempotent acknowledge.
- **Non-goals** — No SMS fallback until Phase 2.

---

## MOD-04 — Ponds, Stocking & Batches

### TASK-018 — Pond CRUD + species reference + first-pond adapter
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-04  **Delivers:** FT-018  **Satisfies:** FR-012, FR-008, NFR-011  **Contract:** CON-013, CON-014, CON-048 (GET /species)
- **Priority:** P1  **Estimate:** 5  **Depends on:** TASK-011
- **Context** — Ponds scoped to a project; implements `ProvisionFirstPondPort` (atomic inline pond with project creation); seeds `Species` reference.
- **Acceptance criteria** — AC-060, AC-061, AC-068, AC-069, AC-032
- **Technical notes** — `src/modules/ponds`; area>0; **`landUnit` defaults to BIGHA** (ADR-018; DECIMAL/KATHA/BIGHA selectable); scoped negative test required.
- **Non-goals** — Stocking/batches are TASK-019.

### TASK-019 — Stocking, batch, survival read-model, density, biomass
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-04  **Delivers:** FT-019, FT-020, FT-021, FT-022  **Satisfies:** FR-013, FR-014, FR-015, FR-028, FR-038, NFR-015  **Contract:** CON-015, CON-016, CON-017, CON-043
- **Priority:** P1  **Estimate:** 8  **Depends on:** TASK-018, TASK-006
- **Context** — Stocking→batch; survival/biomass read-model maintained by idempotent handlers for `MortalityRecorded`/`SamplingRecorded`/`HarvestRecorded`; per-species density; stocking cost as money.
- **Acceptance criteria** — AC-062, AC-063, AC-064, AC-065, AC-066, AC-067, AC-070
- **Technical notes** — clamp survival ≥0; biomass null before first sampling; idempotent event consumers; **stocking-density advisory computes count ÷ area in the project's `landUnit` (bigha default); seed per-species sane-ranges calibrated to bigha** (ADR-018; ~33 decimal/bigha).
- **Non-goals** — Mortality/sampling/harvest *sources* are MOD-07.

### TASK-052 — Ponds & batches web screen (web)
- **Type:** Feature  **Surface:** web  **Target repo:** fish-farm-web
- **Module:** MOD-04  **Delivers:** FT-018/019/020/021/022 (web)  **Satisfies:** FR-012, FR-013, FR-015, FR-038, NFR-007, NFR-014  **Contract:** CON-013/014/015/016/043/048
- **Priority:** P1  **Estimate:** 5  **Depends on:** TASK-013, TASK-014, TASK-018, TASK-019
- **Context** — Design **W-06** `/projects/{id}/ponds` — the first of the nine designed-but-uncarded web screens (added 2026-08-03 to close the design↔backlog gap the tracker's screen audit found). Pond cards with their per-species batches, the per-batch stocking-density advisory, KPI row, stocking history, and the Owner-only add-pond / record-stocking flows.
- **Acceptance criteria** — (client) AC-065 (density = count ÷ pond area, per-species advisory when outside the sane range), AC-066 (biomass = survival × latest avg weight; **null before the first sampling — render "—", never 0**), AC-060/AC-062 (Owner create pond / record stocking through the contract), AC-039 (a down biomass/density service degrades that widget only)
- **Technical notes** — Density is computed client-side from `Pond.area` (project `landUnit`, bigha default) + `Batch.initialCount` + `Species.defaultDensityMin/Max`; a species with no configured range renders "No range · not assessed", never a false all-clear. Role gate is *hidden, not disabled* — a Partner sees every pond, batch and advisory but no write affordance anywhere.
- **Non-goals** — No water trend chart (W-07/TASK-053); no harvest recording (W-12); no CSV export (no `kind=ponds` in CON-046); no withdrawal badge (W-10 owns it).

---

## MOD-05 — Feed & Inventory

### TASK-020 — Inventory items, transactions, low-stock alerts, reconciliation
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-05  **Delivers:** FT-029, FT-030, FT-031  **Satisfies:** FR-042, FR-043, FR-044, NFR-011, NFR-015  **Contract:** CON-022, CON-023, CON-024
- **Priority:** P1  **Estimate:** 5  **Depends on:** TASK-018, TASK-015
- **Context** — Per-project inventory; low-stock crossing → `LowStock` (single fire); reconcile receipts−deductions.
- **Acceptance criteria** — AC-078, AC-079, AC-080, AC-082
- **Technical notes** — `src/modules/inventory`; scoped negative test required.
- **Non-goals** — Feeding deduction is TASK-022.

### TASK-021 — Feed quota calculator + temp/DO adjuster + schedules & reminders
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-05  **Delivers:** FT-023, FT-024, FT-025, FT-026  **Satisfies:** FR-016, FR-017, FR-018, FR-019  **Contract:** CON-018a
- **Priority:** P1  **Estimate:** 5  **Depends on:** TASK-019, TASK-023
- **Context** — Quota = biomass × BW% band; temp/DO reduce/skip; floating vs sinking; reminders (server push + mobile local).
- **Acceptance criteria** — AC-071, AC-072, AC-073, AC-081
- **Technical notes** — pure `FeedQuotaCalculator`/`TempDoAdjuster`; SAMPLING_REQUIRED when no weight.
- **Non-goals** — Feeding log is TASK-022.

### TASK-022 — Feeding log + inventory auto-deduction + check-tray
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-05  **Delivers:** FT-027, FT-028  **Satisfies:** FR-020, FR-021  **Contract:** CON-018
- **Priority:** P1  **Estimate:** 5  **Depends on:** TASK-020, TASK-021
- **Context** — Atomic feeding-insert + inventory-decrement + txn; emits `FeedingLogged`; feed-type mismatch rejected; same path for online and `POST /sync`.
- **Acceptance criteria** — AC-074, AC-075, AC-077
- **Technical notes** — one transaction; low-stock event on crossing.
- **Non-goals** — Offline discrepancy on sync is validated in TASK-040 (AC-076).

---

## MOD-06 — Water Quality & Emergency

### TASK-023 — Water readings + thresholds + breach evaluator
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-06  **Delivers:** FT-032, FT-033  **Satisfies:** FR-022, FR-023, NFR-011  **Contract:** CON-025, CON-026, CON-027, CON-027a
- **Priority:** P1  **Estimate:** 5  **Depends on:** TASK-018, TASK-015
- **Context** — 7 parameters (manual); configurable thresholds (seeded defaults); breach → `WaterThresholdBreached` (WARNING/CRITICAL); provides latest-reading read-model to MOD-05.
- **Acceptance criteria** — AC-083, AC-084, AC-085, AC-090, AC-092, AC-093
- **Technical notes** — pure `BreachEvaluator` across min/max/range/critical; scoped negative test required.
- **Non-goals** — Offline breach-on-sync is validated in TASK-040 (AC-091).

### TASK-024 — Emergency water-event flow (one-tap → CRITICAL)
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-06  **Delivers:** FT-036  **Satisfies:** FR-026, NFR-013  **Contract:** CON-028
- **Priority:** P1  **Estimate:** 2  **Depends on:** TASK-023, TASK-017
- **Context** — Raises `WaterEmergencyRaised` (CRITICAL) reaching owner via MOD-09, independent of readings.
- **Acceptance criteria** — AC-086
- **Technical notes** — reuses alert critical path.
- **Non-goals** — Offline-emergency handling documented in TASK-040/OI-3.

### TASK-025 — Pond-bottom & aeration action logs
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-06  **Delivers:** FT-035  **Satisfies:** FR-025  **Contract:** (CON-050 if UI needs)
- **Priority:** P1  **Estimate:** 2  **Depends on:** TASK-018
- **Context** — Chain-drag/aeration as `pond_action` logs tied to a pond (recurring reminder is a Task in MOD-12).
- **Acceptance criteria** — AC-088
- **Non-goals** — Task scheduling (MOD-12).

### TASK-026 — Water trend charts + early-warning patterns
- **Type:** Feature  **Surface:** backend, web  **Target repo:** fish-farm-backend (+web in TASK-039)
- **Module:** MOD-06  **Delivers:** FT-034  **Satisfies:** FR-024  **Contract:** CON-025
- **Priority:** P2  **Estimate:** 3  **Depends on:** TASK-023
- **Context** — Time-series query + `PatternDetector` (falling dawn DO).
- **Acceptance criteria** — AC-087
- **Non-goals** — Chart UI is part of TASK-039.

### TASK-027 — Secured sensor ingestion (device-key)
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-06  **Delivers:** FT-037  **Satisfies:** FR-022(sensor), NFR-005, NFR-011  **Contract:** CON-044
- **Priority:** P3  **Estimate:** 3  **Depends on:** TASK-023
- **Context** — Device-key-authenticated ingestion mapped to the device's project only. **Guardrail (auth).**
- **Acceptance criteria** — AC-089
- **Technical notes** — hashed device keys; wrong-project rejection test required.
- **Non-goals** — No aerator control (Phase 3).

---

## MOD-07 — Health, Growth & Harvest

### TASK-028 — Mortality logging + spike detection + treatments
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-07  **Delivers:** FT-038, FT-039, FT-040  **Satisfies:** FR-027, FR-028, FR-029, FR-030, NFR-011  **Contract:** CON-019
- **Priority:** P1 (mortality) / P2 (treatment, spike)  **Estimate:** 5  **Depends on:** TASK-019, TASK-015
- **Context** — Emits `MortalityRecorded` (→ MOD-04 survival/biomass); spike → `AbnormalMortalityDetected`; treatments with withdrawal (export-harvest advisory).
- **Acceptance criteria** — AC-094, AC-095, AC-100, AC-101, AC-105
- **Technical notes** — stable event ids; scoped negative test required.
- **Non-goals** — Sampling/harvest are TASK-029/031.

### TASK-029 — Sampling + growth analytics (ADG/SGR)
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-07  **Delivers:** FT-041, FT-042  **Satisfies:** FR-035, FR-036  **Contract:** CON-020
- **Priority:** P1 (sampling) / P2 (analytics)  **Estimate:** 3  **Depends on:** TASK-019
- **Context** — Emits `SamplingRecorded` (→ feed quota + biomass); ADG/SGR from consecutive samplings.
- **Acceptance criteria** — AC-096, AC-097
- **Non-goals** — FCR is TASK-030.

### TASK-030 — Pond-level FCR + survival rate
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-07  **Delivers:** FT-043  **Satisfies:** FR-037  **Contract:** —
- **Priority:** P2  **Estimate:** 3  **Depends on:** TASK-022, TASK-029
- **Context** — FCR at **pond level only** (accumulates `FeedingLogged`); per-species FCR refused (RISK-007).
- **Acceptance criteria** — AC-098, AC-099
- **Non-goals** — No per-species FCR (deliberate).

### TASK-031 — Partial harvest + harvest-to-date + revenue
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-07  **Delivers:** FT-044, FT-045  **Satisfies:** FR-039, FR-040, FR-041, NFR-015  **Contract:** CON-021
- **Priority:** P2  **Estimate:** 5  **Depends on:** TASK-019
- **Context** — Emits `HarvestRecorded` (→ MOD-04 reduce biomass) + revenue event (→ MOD-08); grade export/local; qty ≤ remaining.
- **Acceptance criteria** — AC-102, AC-103, AC-104, AC-106
- **Non-goals** — Finance summary is MOD-08.

---

## MOD-08 — Finance & ROI

### TASK-032 — Financial transactions + event ingestion + role gate
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-08  **Delivers:** FT-046, FT-049  **Satisfies:** FR-045, FR-046, FR-048, NFR-011, NFR-015  **Contract:** CON-032, CON-033
- **Priority:** P2  **Estimate:** 5  **Depends on:** TASK-010, TASK-019, TASK-031, TASK-020
- **Context** — Costs/revenue in BDT (minor units); idempotent ingestion of stocking/feed/harvest events by source ref; role gate reuses MOD-02 matrix. **Guardrail (finance/PII).**
- **Acceptance criteria** — AC-107, AC-108, AC-109, AC-113, AC-114, AC-115, AC-116, AC-117
- **Technical notes** — partner cross-project isolation + worker-hidden tests required.
- **Non-goals** — ROI calc is TASK-033.

### TASK-033 — Net profit + projected ROI + remaining harvest value + summary
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-08  **Delivers:** FT-047, FT-048  **Satisfies:** FR-047  **Contract:** CON-034
- **Priority:** P2  **Estimate:** 3  **Depends on:** TASK-032, TASK-012
- **Context** — Net profit = Σrev−Σcost; projected ROI incl. remaining harvest value; **single-currency (BDT) portfolio roll-up** — simple sum, no per-currency subtotals (ADR-018, OI-4 resolved).
- **Acceptance criteria** — AC-110, AC-111, AC-112
- **Non-goals** — No multi-currency, no FX (single BDT per ADR-018).

### TASK-034 — Finance web pages (role-gated)
- **Type:** Feature  **Surface:** web  **Target repo:** fish-farm-web
- **Module:** MOD-08  **Delivers:** FT-048(web)  **Satisfies:** FR-047, FR-048, NFR-014  **Contract:** CON-032/034
- **Priority:** P2  **Estimate:** 3  **Depends on:** TASK-013, TASK-033
- **Context** — NetProfit/ROI/cost-breakdown pages; hidden from Worker; Partner read-only.
- **Acceptance criteria** — (client enforcement of AC-113/AC-114; display of AC-111)
- **Non-goals** — No mobile finance.

---

## MOD-10 — Monitoring & Reporting

### TASK-035 — Camera stream config API + policy
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-10  **Delivers:** FT-053, FT-054  **Satisfies:** FR-049, FR-050, NFR-005, NFR-011  **Contract:** CON-036
- **Priority:** P2  **Estimate:** 3  **Depends on:** TASK-011
- **Context** — Per-project HLS/WebRTC URL from the media server; **raw RTSP creds never sent to client**; live-only MVP.
- **Acceptance criteria** — AC-118, AC-119, AC-124
- **Non-goals** — Recording (P3); player UI (TASK-039).

### TASK-036 — Weather adapter + cache + graceful degradation
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-10  **Delivers:** FT-055  **Satisfies:** FR-051, NFR-007  **Contract:** CON-037
- **Priority:** P2  **Estimate:** 3  **Depends on:** TASK-011
- **Context** — Weather keyed to site lat/long via **OpenWeather** (ADR-018, OI-5 resolved); cache + circuit breaker (stale/unavailable), never blocks the dashboard; API key via env.
- **Acceptance criteria** — AC-120, AC-121
- **Non-goals** — No provider abstraction beyond the adapter port (Open-Meteo is a noted fallback, not built in v1).

### TASK-037 — Daily owner summary API
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-10  **Delivers:** FT-056  **Satisfies:** FR-055  **Contract:** CON-042
- **Priority:** P2  **Estimate:** 3  **Depends on:** TASK-019, TASK-022, TASK-023, TASK-028, TASK-041
- **Context** — Compose feed used / mortalities / water status / tasks done-missed for a date; no-activity → zeros.
- **Acceptance criteria** — AC-122, AC-125
- **Non-goals** — UI in TASK-039.

### TASK-038 — Report exports (growth/financial/harvest)
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-10  **Delivers:** FT-057  **Satisfies:** FR-056, FR-048, NFR-002  **Contract:** CON-046
- **Priority:** P2  **Estimate:** 3  **Depends on:** TASK-033, TASK-029, TASK-031, TASK-007
- **Context** — Growth/harvest for members; **financial export role-gated** (Worker 403; Partner read-only); dual dates in reports.
- **Acceptance criteria** — AC-123, AC-126
- **Non-goals** — Scheduled emailing (later).

### TASK-039 — Monitoring & reporting web UI (camera/weather/summary/exports)
- **Type:** Feature  **Surface:** web  **Target repo:** fish-farm-web
- **Module:** MOD-10  **Delivers:** FT-053/055/056/057 (web)  **Satisfies:** FR-049, FR-051, FR-055, FR-056, NFR-007  **Contract:** CON-036/037/042/046
- **Priority:** P2  **Estimate:** 5  **Depends on:** TASK-013, TASK-035, TASK-036, TASK-037, TASK-038, TASK-026
- **Context** — Camera player (HLS/WebRTC), weather widget (degrades), daily summary, export buttons, trend charts.
- **Acceptance criteria** — (client) AC-119, AC-121, AC-126
- **Non-goals** — No mobile (camera view is TASK-045).

---

## MOD-12 — Worker Mobile App: Tasks, Daily Log & Offline Sync

### TASK-040 — Backend sync endpoint: idempotency, conflict resolution, dispatch
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-12  **Delivers:** FT-065  **Satisfies:** FR-034, FR-020, FR-022/023, NFR-001  **Contract:** CON-040
- **Priority:** P1  **Estimate:** 8  **Depends on:** TASK-022, TASK-023, TASK-024, TASK-028, TASK-010
- **Context** — `POST /sync` replays batches, idempotent by `clientMutationId`, dispatching to the **same domain use-cases** as online; append-only never conflicts; mutable LWW + audit (ADR-010). Validates offline feed-deduction discrepancy (AC-076) and late water-breach (AC-091).
- **Acceptance criteria** — AC-129, AC-130, AC-131, AC-132, AC-137, AC-076, AC-091
- **Technical notes** — `src/modules/sync`; `sync_mutation` idempotency store; per-mutation result.
- **Non-goals** — Mobile client is TASK-042/043.

### TASK-041 — Backend task scheduler, definitions, logs, missed detection
- **Type:** Feature  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-12  **Delivers:** FT-067(backend), FT-068(backend)  **Satisfies:** FR-031, FR-032  **Contract:** CON-029, CON-030, CON-031
- **Priority:** P1  **Estimate:** 3  **Depends on:** TASK-010, TASK-015
- **Context** — Recurring task defs; task logs; `MissedTaskScheduler` emits `MissedTask` (→ MOD-09).
- **Acceptance criteria** — AC-134, AC-135
- **Non-goals** — Mobile task UI is TASK-044.

### TASK-042 — Mobile app shell + Bangla i18n + single-project binding + offline store/queue
- **Type:** Feature  **Surface:** mobile  **Target repo:** fish-farm-mobile-app
- **Module:** MOD-12  **Delivers:** FT-063, FT-064  **Satisfies:** FR-034, NFR-001, NFR-002, NFR-003, NFR-009, NFR-011  **Contract:** CON-040 (client)
- **Priority:** P1  **Estimate:** 8  **Depends on:** TASK-007, TASK-008, TASK-040
- **Context** — RN shell; WatermelonDB local source of truth; ordered mutation queue (sync_state); UUID v4 offline; single-project binding; purge on reassignment.
- **Acceptance criteria** — AC-127, AC-128, AC-138, AC-139
- **Technical notes** — persisted queue survives restart; **offline write→sync→no-loss test required**.
- **Non-goals** — Domain screens in TASK-043/044.

### TASK-043 — Mobile Daily Log (feed/mortality/water) — icon-driven Bangla, ≤2 min
- **Type:** Feature  **Surface:** mobile  **Target repo:** fish-farm-mobile-app
- **Module:** MOD-12  **Delivers:** FT-066  **Satisfies:** FR-033, NFR-002, NFR-009  **Contract:** CON-040 (sync)
- **Priority:** P1  **Estimate:** 5  **Depends on:** TASK-042
- **Context** — The ≤2-minute composite offline form (feed given, mortality, water observation) with photo; the make-or-break adoption surface.
- **Acceptance criteria** — AC-133
- **Technical notes** — icon-first; Bengali numerals; usability check on low-end Android.
- **Non-goals** — Tasks screen is TASK-044.

### TASK-044 — Mobile tasks: due list, completion with proof photo, reminders
- **Type:** Feature  **Surface:** mobile  **Target repo:** fish-farm-mobile-app
- **Module:** MOD-12  **Delivers:** FT-067(mobile), FT-068(mobile)  **Satisfies:** FR-031, FR-032  **Contract:** CON-029/031 (client)
- **Priority:** P1  **Estimate:** 3  **Depends on:** TASK-042, TASK-041
- **Context** — Due-task list; complete offline with timestamp + optional photo; local reminders (offline) + push backup.
- **Acceptance criteria** — AC-134 (mobile)
- **Non-goals** — Missed-task detection is server-side (TASK-041).

### TASK-045 — Mobile camera view
- **Type:** Feature  **Surface:** mobile  **Target repo:** fish-farm-mobile-app
- **Module:** MOD-12  **Delivers:** FT-069  **Satisfies:** FR-049  **Contract:** CON-036 (client)
- **Priority:** P2  **Estimate:** 2  **Depends on:** TASK-042, TASK-035
- **Context** — Worker views the site stream (HLS/WebRTC).
- **Acceptance criteria** — AC-136
- **Non-goals** — No recording.

---

## MOD-05/06/07/12 — Mobile screens designed but uncarded (2026-09-01 design↔backlog audit)

> The same gap the 2026-08-03 audit found for web (closed by TASK-052): four **approved worker
> screens** in `design/Design_System/` had no backlog card, so the mobile build would have stopped
> with them unbuilt. `DESIGN_PROCESS.md` §3a lists M-01…M-10; cards existed only for M-01/M-02/M-03/
> M-07/M-09/M-10 (via TASK-042…TASK-045). These four close it. **TASK-053…TASK-060 are reserved for
> the eight remaining designed-but-uncarded WEB screens** (TASK-052's non-goals already name W-07 as
> TASK-053), so these mobile cards are minted from TASK-061 to avoid a collision.
>
> Each card is the **client** half of domain behaviour the backend already implements — no new
> endpoint, no new domain rule. Every mutation goes through the existing offline queue and
> `POST /sync` (CON-040), so the offline guarantees (AC-128/129/130/137) apply unchanged.

### TASK-061 — Mobile water emergency: one-tap raise + offline guarantee (M-08)
- **Type:** Feature  **Surface:** mobile  **Target repo:** fish-farm-mobile-app
- **Module:** MOD-12 (client of MOD-06)  **Delivers:** FT-036(mobile)  **Satisfies:** FR-026, NFR-001, NFR-002, NFR-013  **Contract:** CON-040 (`WATER_EVENT`)
- **Priority:** P1  **Estimate:** 3  **Depends on:** TASK-042, TASK-024, TASK-040
- **Context** — Design **M-08** — the highest-stakes worker screen. Fish are dying now; the worker may be panicking, in the dark, one-handed. One dominant red জরুরি button is the only thing to do; optional zero-typing context chips (মাছ ভাসছে / অক্সিজেন কম / পানি খারাপ / গণমৃত্যু) help the owner but are never required. **One** deliberate confirmation prevents a misfire without slowing a real crisis. Offline the emergency **queues and still counts** — the sheet promises "সংযোগ পেলেই সাথে সাথে পাঠানো হবে" and the SENT state repeats it. Meanwhile-advice (manual aeration, water exchange, do not feed) is **text, never a control**.
- **Acceptance criteria** — AC-086 (a one-tap emergency reaches the owner as a CRITICAL alert via MOD-09 with no reading attached), **AC-144** (offline, the emergency is queued, the worker is told in Bangla that it will send the instant a connection returns, and it fires on reconnect), AC-128/AC-129 (queued through the same offline path, no loss)
- **Technical notes** — `WATER_EVENT` mutation (`pondId`, optional `note` carrying the chosen chip) through the existing queue; the queue drain fires it on reconnect. No SMS fallback (MOD-12 §6.4 open question — default "no" for MVP). The app **notifies only**: no aerator/equipment affordance anywhere on the screen, and the advice block must read as instructions to the worker, never as controls.
- **Non-goals** — No on-device SMS fallback; no alert acknowledgement UI (owner web owns it); no threshold configuration.

### TASK-062 — Mobile feeding screen: today's plan + check-tray observation (M-04)
- **Type:** Feature  **Surface:** mobile  **Target repo:** fish-farm-mobile-app
- **Module:** MOD-12 (client of MOD-05)  **Delivers:** FT-027(mobile), FT-028  **Satisfies:** FR-020, FR-021, NFR-002, NFR-009  **Contract:** CON-018a (plan), CON-040 (`FEEDING_LOG`)
- **Priority:** P1  **Estimate:** 3  **Depends on:** TASK-042, TASK-043, TASK-021
- **Context** — Design **M-04** — the single-purpose feeding screen behind the খাবার tab (the M-03 composite covers the quick daily case). Today's plan per pond with its species mix and planned কেজি per feed type; polyculture ponds split floating and sinking rations onto separate lines; a temp/DO-adjusted quota shows **why** it was cut. Logging is the big stepper pre-filled with the plan ("as planned" = one tap), feed type, and the check-tray chips স্বাভাবিক / উদ্বৃত্ত / খালি.
- **Acceptance criteria** — AC-073 (an adjusted quota is shown with its explicit reason), AC-074 (a logged feeding deducts the matching inventory item on sync), AC-077 (the check-tray observation is recorded), AC-076 (a feeding logged offline against now-insufficient stock is still recorded and flagged, never lost)
- **Technical notes** — Reuses the existing reference mirror (ponds, `feed_plan`) and the daily-log write path; per-feed-type lines need the plan's `lines[]`, not just `totalKg`.
- **Non-goals** — No inventory adjustment UI; no quota configuration (owner web).

### TASK-063 — Mobile water reading: 7-parameter capture + aeration/chain-drag log (M-05)
- **Type:** Feature  **Surface:** mobile  **Target repo:** fish-farm-mobile-app
- **Module:** MOD-12 (client of MOD-06)  **Delivers:** FT-032(mobile), FT-035(mobile)  **Satisfies:** FR-022, FR-025, NFR-002, NFR-009  **Contract:** CON-040 (`WATER_READING`, `POND_ACTION`)
- **Priority:** P1  **Estimate:** 3  **Depends on:** TASK-042, TASK-043, TASK-024, TASK-025
- **Context** — Design **M-05** — the full reading behind the পানি tab: all seven parameters (DO, temp, pH, ammonia, nitrite, alkalinity, Secchi) on steppers, keyboard-free, with the safe range visible and a breach shown inline; plus logging an aeration or chain-drag action as a `pond_action`. M-03 captures only the morning DO/temp pair.
- **Acceptance criteria** — AC-083 (all seven parameters can be recorded), AC-084 (an out-of-range reading is surfaced as a breach), AC-092 (a max-only parameter such as ammonia breaches on exceeding max), AC-088 (an aeration/chain-drag action is logged as `pond_action`), AC-091 (a reading captured offline is still threshold-evaluated when it syncs late)
- **Technical notes** — One `WATER_READING` mutation per parameter (the sync contract takes a single parameter each); thresholds should come from the project's configured safe ranges rather than the design's hard-coded floors — mirror them alongside ponds.
- **Non-goals** — No trend chart (owner web W-07); no threshold configuration; no sensor ingestion.

### TASK-064 — Mobile mortality & sampling (M-06)
- **Type:** Feature  **Surface:** mobile  **Target repo:** fish-farm-mobile-app
- **Module:** MOD-12 (client of MOD-07)  **Delivers:** FT-038(mobile), FT-041(mobile)  **Satisfies:** FR-027, FR-028, FR-035, NFR-002, NFR-009  **Contract:** CON-040 (`MORTALITY`, `SAMPLING`)
- **Priority:** P1  **Estimate:** 3  **Depends on:** TASK-042, TASK-043, TASK-027, TASK-029
- **Context** — Design **M-06** — mortality (near-daily) and sampling (every ~10 days) under one segmented control. Mortality defaults to ০ so "no deaths" costs nothing; cause is single-select chips (অক্সিজেন / রোগ / শিকার / হ্যান্ডলিং / অজানা); a photo is optional proof, never a blocker. An unusually high count shows a **calm amber note framed without blame** — information that the owner will be told. Sampling records sample size + average weight with the pond's recent samplings for a sanity check.
- **Acceptance criteria** — AC-094 (mortality with count, cause and optional photo is logged), AC-095 (survival/biomass update on sync), AC-096 (a sampling is recorded and feeds the quota), AC-100 (a spike is detected server-side; the client states plainly that the owner is informed, never as an error or blame)
- **Technical notes** — The mortality icon is the **fish-off mark, never a skull** (design review §5). The "higher than usual" note needs a local baseline (recent mortality rows) — do not fabricate a server figure. Sampling avg weight steps in decimals (grams).
- **Non-goals** — No treatment recording; no growth charts; no harvest.

---

## MOD-12 / MOD-09 — Mobile gaps found while building the worker app (2026-09-25)

> Three deliverables the mobile cards deliberately left open, recorded rather than quietly dropped.
> TASK-065 is buildable now; **TASK-066 and TASK-067 are blocked and must not be started** until the
> human resolves what each one names.

### TASK-065 — Mobile local task reminders (on-device, no server)
- **Type:** Feature  **Surface:** mobile  **Target repo:** fish-farm-mobile-app
- **Module:** MOD-12  **Delivers:** FT-067(mobile — the reminder half)  **Satisfies:** FR-031, NFR-001, NFR-002  **Contract:** — (no endpoint; on-device only)
- **Priority:** P2  **Estimate:** 2  **Depends on:** TASK-044
- **Context** — TASK-044 delivered the due list and completion but **not** the reminders its own context names; FR-031 asks for "recurring reminders" and FT-067's mobile column is exactly that. These are **local** notifications scheduled on the device from the mirrored task list, so they work with no signal — which is the point, since the worker is usually offline. Push (the "backup" half) is MOD-09's channel and is blocked separately (TASK-067).
- **Acceptance criteria** — **AC-145** — *Given* open tasks due today, *When* the app has notification permission, *Then* a **Bangla** local reminder is scheduled for each at the day's reminder time, completing a task cancels its reminder, and a refused permission degrades silently (the task list still works) — parent FR-031, NFR-002
- **Technical notes** — `expo-notifications` local scheduling only; no FCM credentials needed. Reconcile (schedule missing / cancel stale) whenever the mirrored task list changes, so a completed or deleted task never fires. **`Task` carries no time-of-day** (the M-07 mockup shows "সকাল ৭:০০" but the contract has only `dueOn`), so reminders fire at a fixed local morning hour until the contract carries a per-task time — do not fabricate one. **Because every task of a day therefore shares one slot, reminders are scheduled per *slot*, not per task** (amended 2026-09-25 after a device check found six alarms registered for the same second — the `MAX_REMINDERS` cap limits the queue but not the pile-up at the tray). One notification names up to three tasks and counts the rest; reconciliation matches on a fingerprint of slot + task ids, so completing one task of six rebuilds that slot with the remaining five. When the contract gains a per-task time, slots become naturally distinct and the grouping quietly stops applying.
- **Non-goals** — No push/FCM (TASK-067); no missed-task detection (server-side, TASK-041); no per-task time UI.

### TASK-066 — Proof-photo upload for mortality and task completion  🚧 **BLOCKED — contract gap**
- **Type:** Feature  **Surface:** mobile, backend  **Target repo:** fish-farm-mobile-app (+ backend)
- **Module:** MOD-12 (+MOD-07)  **Delivers:** FT-038/FT-068 (the photo half)  **Satisfies:** FR-027, FR-032, MOD-12 R9  **Contract:** **needs a new endpoint — none exists**
- **Priority:** P2  **Estimate:** — (unestimable until the contract is decided)  **Depends on:** TASK-043, TASK-044, TASK-064
- **Context** — `Mortality.photoUrl` and `TaskLog.photoUrl` are **server-side URLs**, and MOD-12 R9 says photos are "compressed before queueing; uploaded on sync" — but **no endpoint in `contracts/openapi.yaml` accepts a file**. The mobile app therefore captures and compresses the photo, keeps it on the device (`photo_local_uri`), and never sends a `file://` path as `photoUrl`. The proof the owner is supposed to see does not reach them today.
- **Blocked on (human decision — contract change is a guardrail):** (a) add an upload endpoint (multipart or a pre-signed-URL handshake) and where the bytes live (VPS disk vs object storage — ADR territory, none exists); (b) how an **offline-queued** photo uploads — the `/sync` batch is JSON, so the photo needs its own transfer that resolves to a URL *before* or *after* the mutation replays; (c) retention/size limits for a low-end device and a modest VPS.
- **Acceptance criteria** — to be written once the contract is decided; today's behaviour (photo kept locally, never a fake URL) is covered by existing tests.
- **Non-goals** — Do not invent an endpoint or a storage location to unblock this.

### TASK-068 — Mobile task streak (M-07 ALL DONE) — needs a source of truth for "consecutive days"
- **Type:** Feature  **Surface:** mobile (+ backend, if the streak is server-computed)  **Target repo:** fish-farm-mobile-app
- **Module:** MOD-12  **Delivers:** FT-067 (the ALL DONE frame's habit loop)  **Satisfies:** FR-031, NFR-009  **Contract:** **none today — see below**
- **Priority:** P3  **Estimate:** 2 (client only, once the figure exists)  **Depends on:** TASK-044
- **Context** — M-07's ALL DONE frame shows a streak pill, "টানা ৭ দিন সব কাজ শেষ" — the reward that keeps the daily habit going. It is the one element of M-07 the app does **not** render, because it cannot be computed honestly: a streak needs, for every past day, whether *every* task due that day was completed, and the mobile mirror keeps only current tasks (a recurring task is one row rolled forward, so yesterday's due-set is gone). The rest of the frame — the check circle, the Bangla congratulation, the recap and হোমে ফিরুন — is built and shipping.
- **Blocked on (human decision):** where the figure comes from — (a) the server computes it from `task_log` (it has the full history) and returns it with the task list, which needs a contract field; or (b) the app retains a small local per-day "all done" ledger, which is cheap but resets on reinstall and cannot be trusted across devices. (a) is the honest one; (b) is the offline-pure one.
- **Acceptance criteria** — to be written with the decision. Today's behaviour (streak omitted, never fabricated) is deliberate and matches TASK-064's "do not fabricate a server figure" rule.
- **Non-goals** — Do not invent a streak client-side from the current task list; a wrong streak is worse than none for a habit cue.

### TASK-067 — Mobile push registration + alert delivery  🚧 **BLOCKED — credentials**
- **Type:** Feature  **Surface:** mobile  **Target repo:** fish-farm-mobile-app
- **Module:** MOD-09 (client)  **Delivers:** FT-051(mobile)  **Satisfies:** FR-031, NFR-013  **Contract:** CON-045 (`POST /notifications/devices`)
- **Priority:** P2  **Estimate:** 2  **Depends on:** TASK-016, TASK-065
- **Context** — MOD-09 registers a device's FCM token (CON-045) and pushes alerts; the worker app is a delivery target (missed tasks, water breaches, emergencies raised elsewhere).
- **Blocked on (human):** a Firebase project and its `google-services.json` — the repo has none, and adding the Firebase Gradle plugin without it breaks the Android build. Nothing else blocks it.
- **Acceptance criteria** — AC-052/AC-055 (client half) once credentials exist.
- **Non-goals** — No SMS/WhatsApp (Phase 2 stubs); no local reminders (TASK-065).

---

## MOD-02 / MOD-03 — Web surfaces missed in the first pass (Phase-6 closure)

### TASK-046 — Password reset + account management web pages (web)
- **Type:** Feature  **Surface:** web  **Target repo:** fish-farm-web
- **Module:** MOD-02  **Delivers:** FT-009(web)  **Satisfies:** FR-006, NFR-014  **Contract:** CON-003, CON-004
- **Priority:** P1  **Estimate:** 2  **Depends on:** TASK-013, TASK-009
- **Context** — Closes the web surface for FR-006 (backend was TASK-009). Request-reset and confirm-reset pages plus a basic account screen; consumes the reset endpoints from the generated client. No user-enumeration in UI messaging (mirror backend AC-020).
- **Acceptance criteria** — (client) AC-020 — *Given* a user requests a reset, *When* they submit their email, *Then* the app shows a channel-neutral confirmation and never reveals whether the account exists; *and Given* a used/expired token, *When* confirm is attempted, *Then* the error is surfaced without leaking account state.
- **Technical notes** — `fish-farm-web`; reset-request + reset-confirm routes; WCAG AA; TanStack Query mutation; no domain data cached client-side.
- **Non-goals** — No email templating (backend adapter, TASK-009).

### TASK-047 — Membership admin web pages: invite / assign / remove (web)
- **Type:** Feature  **Surface:** web  **Target repo:** fish-farm-web
- **Module:** MOD-03 (delivers MOD-02 feature)  **Delivers:** FT-011(web)  **Satisfies:** FR-009, FR-004, NFR-011, NFR-014  **Contract:** CON-010, CON-011, CON-012
- **Priority:** P1  **Estimate:** 3  **Depends on:** TASK-013, TASK-010
- **Context** — Closes the web surface for FR-009 (backend was TASK-010). Owner-only Members page per project: list members, invite by email with a role, remove a member; surfaces the Worker-one-active-project and last-Owner invariants as UI errors from the backend 409s. Hidden from Worker/Partner.
- **Acceptance criteria** — (client) AC-024, AC-025, AC-026 — *Given* an Owner on the Members page, *When* they invite a WORKER already active elsewhere, *Then* the backend 409 is shown as a clear message and no membership is created; *and* the page is not reachable by a WORKER or PARTNER (route guard + backend 403).
- **Technical notes** — `fish-farm-web`; Members route under `/projects/{id}/members`; role-gated nav; generated client for CON-010/011/012.
- **Non-goals** — No org-wide roles; no mobile membership admin.

## MOD-01 — Platform: infra, delivery & the operational NFRs (Phase-6 closure)

### TASK-048 — Deployment topology: Docker Compose, TLS, media-server + weather provisioning (backend/infra)
- **Type:** Chore  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-01  **Delivers:** (operationalizes FT-001)  **Satisfies:** NFR-010, NFR-007, NFR-005  **Contract:** —
- **Priority:** P1  **Estimate:** 5  **Depends on:** TASK-001, TASK-002
- **Context** — The single-VPS deployment the whole portfolio runs on (TECH-SPEC §18): Docker Compose for `api + postgres + media-server`; TLS termination (Nginx/Caddy); env-var secret injection (no secrets in code, NFR-005); per-site MediaMTX/ffmpeg unit for camera transcoding (isolated from the app tier); OpenWeather API key wiring via env (ADR-018). Graceful-degradation posture for camera/weather down (NFR-007).
- **Acceptance criteria** — AC-140 — *Given* a clean host, *When* `docker compose up` runs with a valid `.env`, *Then* api + postgres + media server start, `/health` (CON-047) returns `ok`, and TLS terminates; *and Given* the weather API or a site camera is down, *When* the dashboard loads, *Then* the app degrades (feature disabled) rather than crashing.
- **Technical notes** — compose files + reverse-proxy config live in `fish-farm-backend`; media server is its own service; secrets only via env; no `synchronize` on boot.
- **Non-goals** — No Kubernetes; no per-tenant infra (NFR-010); camera recording (P3).

### TASK-049 — Automated daily backups + documented restore runbook (backend/infra)
- **Type:** Chore  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-01  **Delivers:** (operationalizes FT-002)  **Satisfies:** NFR-008  **Contract:** —
- **Priority:** P1  **Estimate:** 3  **Depends on:** TASK-002, TASK-048
- **Context** — NFR-008 has a hard threshold (RPO ≤ 24 h, RTO ≤ 4 h) but no card. Automated daily `pg_dump` of operational + financial data with retention; an off-host copy; a **documented, tested restore procedure**. Backups must never contain plaintext secrets.
- **Acceptance criteria** — AC-141 — *Given* the scheduled backup job, *When* a day elapses, *Then* a dated dump exists off-host (RPO ≤ 24 h); *and Given* a dump, *When* the restore runbook is followed on a clean database, *Then* the system is operational within RTO ≤ 4 h and a restore-verification query passes.
- **Technical notes** — scheduled `pg_dump`; restore runbook in `fish-farm-backend/README` or `/ops`; retention policy; restore rehearsal is part of DoD.
- **Non-goals** — No PITR/WAL streaming in v1; no cross-region DR.

### TASK-050 — Performance & load-test harness for the API NFR (backend)
- **Type:** Spike  **Surface:** backend  **Target repo:** fish-farm-backend
- **Module:** MOD-01  **Delivers:** (verifies FT-003/FT-004 + sync)  **Satisfies:** NFR-004  **Contract:** CON-040
- **Priority:** P2  **Estimate:** 3  **Depends on:** TASK-004, TASK-040
- **Context** — NFR-004 sets p95 API latency < 300 ms @ 100 concurrent and a ≤200-record sync batch < 5 s, but nothing measures it. A repeatable load harness (k6/artillery) asserting both thresholds against a seeded dataset, wired into CI as a non-blocking perf gate.
- **Acceptance criteria** — AC-142 — *Given* a seeded database at expected v1 volumes, *When* the harness drives 100 concurrent requests across read/write endpoints, *Then* measured p95 < 300 ms; *and Given* a 200-mutation offline batch, *When* posted to `/sync`, *Then* it completes < 5 s.
- **Technical notes** — harness scripts in `fish-farm-backend/perf`; runs against a test container; reports p95; scope-guard overhead included in the measured path.
- **Non-goals** — No production APM/observability stack (follow-up); no soak testing.

## MOD-01 — Shared packages hosting (OI-1, separate-repo layout)

### TASK-051 — Scaffold shared `packages/*` in the backend repo + publishing to clients (chore)
- **Type:** Chore  **Surface:** shared  **Target repo:** fish-farm-backend
- **Module:** MOD-01  **Delivers:** (realizes OI-1 under ADR-002)  **Satisfies:** NFR-006, NFR-016  **Contract:** —
- **Priority:** P1  **Estimate:** 3  **Depends on:** —  *(do this before TASK-007/042 land)*
- **Context** — Separate-repo layout (ADR-002; the monorepo ADR-017 was reverted). Shared packages live in `fish-farm-backend/packages/{calendar,shared}` and are **published** (npm registry or git dependency, scope `@fish-farm/*`) so the web + mobile repos consume identical builds — keeping the Bangla calendar byte-identical across surfaces (NFR-016) without a monorepo. Establishes the package skeletons, versioning, and the publish/consume wiring.
- **Acceptance criteria** — AC-143 — *Given* the packages are published, *When* the web and mobile repos install `@fish-farm/calendar` and `@fish-farm/shared`, *Then* both resolve to the same version and import cleanly, and a shared calendar anchor test passes identically in all three repos; *and Given* the code repos, *When* the agent works, *Then* each keeps `fish-farm-context-files` in context (multi-root workspace or submodule).
- **Technical notes** — `fish-farm-backend/packages/calendar` + `/shared` as buildable TS packages; publish pipeline (private npm or git tag); TypeScript project references within the backend repo; web/mobile add them as dependencies (not path imports across repos).
- **Non-goals** — No monorepo/workspace restructure (ADR-017 reverted); no app code (TASK-001+); no CI beyond the publish step (rest in TASK-048).

## Open items (backlog-level; resolve with the human)
- **OI-1** — ✅ **RESOLVED 2026-07-05 → separate repos, packages in the backend** (ADR-002 stands;
  the monorepo ADR-017 was proposed then **reverted** the same day). Shared `packages/{calendar,
  shared}` are hosted in `fish-farm-backend/packages/*` and **published** to web + mobile. Scaffolded
  by **TASK-051**.
- **OI-2** — ✅ **RESOLVED 2026-07-05 → RLS deferred** for MVP; app-layer scoped-repository guard is
  the sole isolation layer (ADR-006 stands). RLS revisited post-v1 as defense-in-depth. **Guardrail.**
- **OI-3** — ✅ **RESOLVED 2026-07-05 → queue + fire on reconnect**; no on-device SMS fallback in v1.
  Offline-raised CRITICAL water events are queued locally and dispatched on reconnect (SMS/WhatsApp
  fallback remains Phase 2). **Guardrail.**
- **OI-4** — ✅ **RESOLVED 2026-07-06 → single currency BDT** (ADR-018). No multi-currency, no FX;
  portfolio roll-up is a single-currency sum (no per-currency subtotals).
- **OI-5** — ✅ **RESOLVED 2026-07-06 → OpenWeather** (ADR-018), keyed to site lat/long, behind the
  cache + circuit breaker; API key via env. Unblocks TASK-036.
- **BRD §14 Q5** — ✅ **RESOLVED 2026-07-06 → land unit default BIGHA** (all three selectable) +
  **South-Asian BDT formatting** (lakh/crore, ৳, Bengali numerals). See ADR-018. Density advisories
  must be reseeded in bigha (TASK-018/019).
- **OI-6** — ✅ **RESOLVED 2026-07-05 → Partner sees full financials read-only** (plus growth/harvest);
  confirms the spec default. AC-113/114 and TASK-032/034 gating stand as written. **Guardrail (PII).**

---

*Backlog — Fish Farm Management System. Phase 6 artifact. TASK-001…TASK-051; AC-001…AC-143
covered (AC-140…AC-143 added in the Phase-6 closure pass; see TRACEABILITY_MATRIX.md). TASK-046/047
close the web surface for FR-006/FR-009; TASK-048/049/050 close NFR-007/008/004; TASK-051 scaffolds
the shared `packages/*` hosting (OI-1, separate repos — ADR-017 monorepo was reverted).*
