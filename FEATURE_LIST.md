# Feature List — Fish Farm Management System (FMS)

> Version 1.0 · 2026-07-02 · Each `FT-` delivers one or more `FR-`/`NFR-` (from
> `PRODUCT_SPECIFICATION.md`), tags its target surface(s), and carries a priority. Every `FR-001…
> FR-061` is delivered by ≥ 1 feature (see the coverage note at the end). Each `FT-` maps to
> exactly one `MOD-` (see `MODULE_LIST.md`). Surfaces: `backend` · `web` · `mobile` · `shared`.

## Priority definitions
- **P1** — v1 / Phase 1 (Core operations: loss & waste prevention; foundational).
- **P2** — Phase 2 (Insight & money: analytics, harvest, finance, camera/weather, reporting, SMS/WhatsApp).
- **P3** — Phase 3 (Optimization & scale: IoT sensors, disease analytics, predictive).

---

### Group A — Platform & Tenant Foundation  (MOD-01)
| ID | Feature | Description | Delivers | Surface | Priority | Notes |
|---|---|---|---|---|---|---|
| FT-001 | API scaffold & configuration | NestJS modular-monolith skeleton, env-based config, health check, module wiring. | NFR-006, NFR-010 (enables FR-011) | backend | P1 | E0 scaffold |
| FT-002 | Persistence & migrations | TypeORM Data Mapper data source; reversible migrations; `synchronize:false`. | NFR-006 (enables FR-011) | backend | P1 | Data Mapper only |
| FT-003 | Tenant isolation core | Project-scope guard + request-scoped tenant context from membership. | FR-003, NFR-011 | backend | P1 | Before any project-owned table (E0-S7) |
| FT-004 | Scoped repository base | Auto-injects `project_id` filter into every project-owned query. | FR-003, NFR-011 | backend | P1 | Only sanctioned data path |
| FT-005 | Audit trail | Immutable actor/project/action/entity/timestamp on every state change. | FR-005, NFR-012 | backend | P1 | |
| FT-006 | Error contract & mapping | Typed domain errors → HTTP; shared `Error` schema. | NFR-005 (supports all FR) | backend | P1 | Never leak project existence |
| FT-007 | Domain event bus | In-process `PascalCase` past-tense events for cross-module reactions. | enables FR-020, FR-023, FR-028, FR-030, FR-043 | backend | P1 | ADR-015 |

### Group B — Identity, Auth & Membership  (MOD-02)
| ID | Feature | Description | Delivers | Surface | Priority | Notes |
|---|---|---|---|---|---|---|
| FT-008 | Authentication & JWT sessions | Login, access/refresh tokens; token carries user id only. | FR-001 | backend, web, mobile | P1 | ADR-005 |
| FT-009 | Password reset & account mgmt | Reset request/confirm; basic account management. | FR-006 | backend, web | P1 | |
| FT-010 | Membership authorization & RBAC | Resolve per-project role each request; hide finance/settings from Worker; Partner read-only. | FR-002, FR-004 | backend | P1 | |
| FT-011 | Membership management | Invite/assign/remove members; Worker limited to one active project. | FR-009 | backend, web | P1 | E0-S6 |

### Group C — Projects, Portfolio & Owner Web App  (MOD-03)
| ID | Feature | Description | Delivers | Surface | Priority | Notes |
|---|---|---|---|---|---|---|
| FT-012 | Project management | CRUD: name, site lat/long+address, currency/land unit, status. | FR-007 | backend, web | P1 | |
| FT-013 | Inline first-pond creation | Create first pond during project creation. | FR-008 | backend, web | P1 | Frictionless single-pond |
| FT-014 | Project scope selection | Select active project; scope every downstream call. | FR-011 | backend, web, mobile | P1 | |
| FT-015 | Portfolio roll-up dashboard | Aggregate biomass + alerts (+ finance snapshot in P2) with drill-down. | FR-010 | web, backend | P1 | Finance roll-up = P2 |
| FT-016 | Owner web application shell | Next.js scaffold, routing, layout, auth session, design-token theming. | NFR-002, NFR-014 | web | P1 | Hosts all owner pages |
| FT-017 | Dual-date rendering | Show Bangla + Gregorian dates across owner UI. | FR-058 | web | P1 | Uses MOD-11 |

### Group D — Ponds, Stocking & Batches  (MOD-04)
| ID | Feature | Description | Delivers | Surface | Priority | Notes |
|---|---|---|---|---|---|---|
| FT-018 | Pond management | Area (decimal/katha), depth, notes. | FR-012 | backend, web, mobile | P1 | |
| FT-019 | Stocking events | Species, source/hatchery, count, date, cost. | FR-013 | backend, web, mobile | P1 | |
| FT-020 | Batch tracking & survival estimate | Create batch; running survival = initial − cumulative mortality. | FR-014, FR-028 | backend | P1 | |
| FT-021 | Stocking density advisory | Count ÷ area with per-species sane-range advisory. | FR-015 | web, mobile | P1 | |
| FT-022 | Biomass overview derivation | (stocked − mortality) × latest avg weight, per species. | FR-038 | backend, web | P1 | Overview P1; analytics P2 |

### Group E — Feed & Inventory  (MOD-05)
| ID | Feature | Description | Delivers | Surface | Priority | Notes |
|---|---|---|---|---|---|---|
| FT-023 | Feed quota calculator | Daily quota from latest sampling weight × configurable BW% band. | FR-016 | backend | P1 | Reads sampling read-model |
| FT-024 | Temperature/DO feed adjustment | Reduce/skip feed on low DO or unsafe temperature. | FR-017 | backend | P1 | Reads water read-model |
| FT-025 | Floating vs sinking schedules | Independent schedules for floating (Carp/Parse) and sinking/Scampro (Golda). | FR-018 | backend, mobile | P1 | |
| FT-026 | Feeding reminders | Morning/evening scheduled reminders to worker. | FR-019 | mobile, backend | P1 | |
| FT-027 | Feeding log + auto-deduction | Log feeding; deduct inventory; emit `FeedingLogged`. | FR-020 | backend, mobile | P1 | |
| FT-028 | Check-tray observation | Flag leftover/over/under-feeding. | FR-021 | mobile | P1 | |
| FT-029 | Inventory items & stock levels | Per-project feed + consumables with quantities. | FR-042 | backend, web, mobile | P1 | Not shared across projects |
| FT-030 | Low-stock replenishment alerts | Threshold crossed → alert via MOD-09. | FR-043 | backend, web | P1 | |
| FT-031 | Inventory reconciliation & transactions | Receipts/adjustments; reconcile with feeding deductions. | FR-044 | backend | P1 | |

### Group F — Water Quality & Emergency  (MOD-06)
| ID | Feature | Description | Delivers | Surface | Priority | Notes |
|---|---|---|---|---|---|---|
| FT-032 | Water reading capture | DO, temp, pH, ammonia, nitrite, alkalinity, Secchi; manual source. | FR-022 | backend, mobile | P1 | |
| FT-033 | Thresholds & breach alerts | Configurable safe ranges; out-of-range emits `WaterThresholdBreached`. | FR-023 | backend, web | P1 | |
| FT-034 | Water trend charts | Plot parameter trends; surface early-warning (falling dawn DO). | FR-024 | web | P2 | |
| FT-035 | Pond-bottom & aeration logs | Chain drag (10–15 days) and aeration as logged events. | FR-025 | backend, mobile | P1 | |
| FT-036 | Emergency water-event flow | One-tap oxygen/water emergency → CRITICAL alert to owner. | FR-026 | mobile, backend | P1 | |
| FT-037 | Secured sensor ingestion | Device-key authenticated water readings (source=SENSOR). | FR-022 (sensor) | backend | P3 | IoT |

### Group G — Health, Growth & Harvest  (MOD-07)
| ID | Feature | Description | Delivers | Surface | Priority | Notes |
|---|---|---|---|---|---|---|
| FT-038 | Mortality logging | Count, cause category, optional photo → survival & biomass. | FR-027, FR-028 | backend, mobile | P1 | |
| FT-039 | Treatment records | Product, dose, date, withdrawal period. | FR-029 | backend, web, mobile | P2 | |
| FT-040 | Abnormal mortality detection | Flag mortality spikes for owner. | FR-030 | backend | P2 | Analytics depth P3 |
| FT-041 | Sampling records | Per-species sample size + average weight. | FR-035 | backend, mobile, web | P1 | Record P1 (feeds quota); analytics P2 |
| FT-042 | Growth analytics | Growth curves, ADG, SGR per species. | FR-036 | backend, web | P2 | |
| FT-043 | Pond-level FCR & survival | Actual FCR (pond) and survival rate (batch). | FR-037 | backend, web | P2 | No fake per-species FCR |
| FT-044 | Partial harvest management | Qty, weight, grade export/local; reduces biomass, feeds revenue. | FR-039, FR-040 | backend, web, mobile | P2 | |
| FT-045 | Harvest-to-date vs projected | Progress reporting against projection. | FR-041 | web | P2 | |

### Group H — Finance & ROI  (MOD-08)
| ID | Feature | Description | Delivers | Surface | Priority | Notes |
|---|---|---|---|---|---|---|
| FT-046 | Cost recording | BDT costs: feed, salary, medicine, stocking, equipment, misc. | FR-045 | backend, web | P2 | Money integer/decimal |
| FT-047 | Revenue & remaining harvest value | Harvest revenue + projected remaining value per project. | FR-046 | backend, web | P2 | |
| FT-048 | Net profit & projected ROI | Real-time per project + portfolio roll-up, optional per decimal/bigha. | FR-047 | web, backend | P2 | |
| FT-049 | Finance role gating | Owner + Partner (read-only); hidden from Worker. | FR-048 | backend, web | P2 | |

### Group I — Notifications & Alerts  (MOD-09)
| ID | Feature | Description | Delivers | Surface | Priority | Notes |
|---|---|---|---|---|---|---|
| FT-050 | Alert lifecycle & types | RAISED→SENT→ACK→RESOLVED; 5 alert types; SLA tracking. | FR-053 | backend | P1 | |
| FT-051 | Push channel & device registration | FCM push (MVP); SMS/WhatsApp adapters behind same port. | FR-052 | backend, mobile | P1 | SMS/WhatsApp = P2 |
| FT-052 | Critical alert reliable delivery | CRITICAL reaches owner even if app closed; ack within SLA. | FR-054, NFR-013 | backend, mobile, web | P1 | |

### Group J — Monitoring & Reporting  (MOD-10)
| ID | Feature | Description | Delivers | Surface | Priority | Notes |
|---|---|---|---|---|---|---|
| FT-053 | Camera streaming | Per-site RTSP→HLS/WebRTC config + web player. | FR-049 | web, backend | P2 | |
| FT-054 | Camera policy | Live-only MVP; latency/recording/storage policy. | FR-050 | web, backend | P2 | Recording P3 |
| FT-055 | Site-local weather widget | Weather keyed to project location; rain/heat highlights; graceful degradation. | FR-051 | web, backend | P2 | |
| FT-056 | Daily owner summary | Feed used, mortalities, water status, tasks done. | FR-055 | web, backend | P2 | |
| FT-057 | Report exports | Growth, financial, harvest exports. | FR-056 | web, backend | P2 | |

### Group K — Bangla Calendar (shared)  (MOD-11)
| ID | Feature | Description | Delivers | Surface | Priority | Notes |
|---|---|---|---|---|---|---|
| FT-058 | Gregorian↔Bangla conversion | Bangladesh-revised (2019) rules; identical on all surfaces. | FR-057 | shared, backend, web, mobile | P1 | No Intl/ICU |
| FT-059 | Bengali numerals & formatting | Numeral glyphs + Bangla-date formatting helpers. | FR-058 | shared, web, mobile | P1 | |
| FT-060 | Ritu & seasonal advisories | Expose current season; advisory hooks (monsoon/heat). | FR-059 | backend, shared, web | P1 | |
| FT-061 | Bangla months/seasons in tasks & reports | Reference Bangla months/seasons alongside absolute dates. | FR-060 | backend, web | P1 | |
| FT-062 | Calendar anchor verification | Verify against 21 Feb, 26 Mar, 16 Dec, 14 Apr anchors. | FR-061 | shared | P1 | Required deliverable |

### Group L — Worker Mobile App: Tasks, Daily Log & Offline Sync  (MOD-12)
| ID | Feature | Description | Delivers | Surface | Priority | Notes |
|---|---|---|---|---|---|---|
| FT-063 | Worker mobile app shell | RN scaffold, navigation, single-project binding, Bangla i18n, icon-first UI. | NFR-002, NFR-003, NFR-009 | mobile | P1 | Android-only v1 |
| FT-064 | Offline store & sync queue engine | WatermelonDB local source of truth; ordered mutation queue with sync state. | FR-034, NFR-001 | mobile | P1 | Make-or-break |
| FT-065 | Sync endpoint & conflict resolution | Batch replay; idempotent `clientMutationId`; server-authoritative LWW + audit. | FR-034, NFR-001 | backend | P1 | ADR-010 |
| FT-066 | Icon-driven Bangla Daily Log | ≤2-min feed/mortality/water form, offline. | FR-033 | mobile | P1 | |
| FT-067 | Recurring task scheduler & reminders | Define recurring tasks (chain drag, liming…); due/missed reminders. | FR-031 | backend, web, mobile | P1 | Owner creates; worker completes |
| FT-068 | Task completion with proof photo | Mark complete with timestamp + optional photo. | FR-032 | mobile | P1 | |
| FT-069 | Mobile camera view | View site camera stream on the worker app. | FR-049 | mobile | P2 | |

---

## Feature count summary
- **Total features:** 69 (FT-001…FT-069).
- **By priority:** P1 = 47 · P2 = 21 · P3 = 1.
- **By surface (features touching each surface; features may span surfaces):**
  - backend ≈ 55
  - web ≈ 36
  - mobile ≈ 24
  - shared = 4 (FT-058…FT-060, FT-062; MOD-11)
- **Per-module ownership:** MOD-01→7, MOD-02→4, MOD-03→6, MOD-04→5, MOD-05→9, MOD-06→6, MOD-07→8, MOD-08→4, MOD-09→3, MOD-10→5, MOD-11→5, MOD-12→7.

## FR → FT coverage (every FR delivered by ≥ 1 feature)
FR-001→FT-008 · FR-002→FT-010 · FR-003→FT-003,FT-004 · FR-004→FT-010 · FR-005→FT-005 ·
FR-006→FT-009 · FR-007→FT-012 · FR-008→FT-013 · FR-009→FT-011 · FR-010→FT-015 · FR-011→FT-014 ·
FR-012→FT-018 · FR-013→FT-019 · FR-014→FT-020 · FR-015→FT-021 · FR-016→FT-023 · FR-017→FT-024 ·
FR-018→FT-025 · FR-019→FT-026 · FR-020→FT-027 · FR-021→FT-028 · FR-022→FT-032,FT-037 ·
FR-023→FT-033 · FR-024→FT-034 · FR-025→FT-035 · FR-026→FT-036 · FR-027→FT-038 · FR-028→FT-020,FT-038 ·
FR-029→FT-039 · FR-030→FT-040 · FR-031→FT-067 · FR-032→FT-068 · FR-033→FT-066 · FR-034→FT-064,FT-065 ·
FR-035→FT-041 · FR-036→FT-042 · FR-037→FT-043 · FR-038→FT-022 · FR-039→FT-044 · FR-040→FT-044 ·
FR-041→FT-045 · FR-042→FT-029 · FR-043→FT-030 · FR-044→FT-031 · FR-045→FT-046 · FR-046→FT-047 ·
FR-047→FT-048 · FR-048→FT-049 · FR-049→FT-053,FT-069 · FR-050→FT-054 · FR-051→FT-055 · FR-052→FT-051 ·
FR-053→FT-050 · FR-054→FT-052 · FR-055→FT-056 · FR-056→FT-057 · FR-057→FT-058 · FR-058→FT-059,FT-017 ·
FR-059→FT-060 · FR-060→FT-061 · FR-061→FT-062.
**All 61 FRs covered.**

---

*Feature List — Fish Farm Management System. Phase 4 artifact. IDs: FT-001…FT-069.*
