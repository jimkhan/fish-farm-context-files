# Documentation Index — Fish Farm Management System (FMS)   ·   Last updated: 2026-07-05   ·   Phase: 7

> Entry point for the spec hub. Refreshed at the end of every phase. Start here.

## Surfaces
`backend` (NestJS) · `web` (Next.js owner dashboard) · `mobile` (React Native worker app) · `shared` (Bangla calendar + API contract)

## Hub repo
**`fish-farm-context-files`** — the single source of truth. All specs and contracts live here.
Code repos (created in Phase 7) hold only generated code plus their own `.cursorrules` + `README.md`:
`fish-farm-backend` · `fish-farm-web` · `fish-farm-mobile-app`.

> **Note on inputs:** `Fish-Farm-Management-System-BRD.md` (BRD/SRS v3.1) is the prerequisite
> brief that seeds this cascade. `CLAUDE.md` is the coding constitution that governs the *code*
> generated later (Phase 7 onward). `GENERATE_PROJECT_DOCS.md` is the generator process itself.
> All three live in this hub.

## Reading order (the AIDLC cascade)
`GLOSSARY` → `PROJECT_CONCEPT_NOTE` → `PRODUCT_SPECIFICATION` → `TECHNICAL_SPECIFICATION` + `DECISIONS` + `contracts/` + `ERD` → `FEATURE_LIST` + `MODULE_LIST` → `modules/*` → `BACKLOG` + `TRACEABILITY_MATRIX` → `MODULE_PROGRESS_TRACKER`

## Artifact registry

| File | Phase | Status | ID range |
|---|---|---|---|
| `GENERATE_PROJECT_DOCS.md` | — (process) | Reference | — |
| `Fish-Farm-Management-System-BRD.md` | — (input brief, BRD v3.1) | Reference | — |
| `CLAUDE.md` | — (coding constitution) | Reference | — |
| `GLOSSARY.md` | 1 | ✅ Complete | — |
| `PROJECT_CONCEPT_NOTE.md` | 1 | ✅ Complete | BR-001…BR-016, RISK-001…RISK-007 |
| `INDEX.md` | 1 (refreshed each phase) | ✅ Current | — |
| `PRODUCT_SPECIFICATION.md` | 2 | ✅ Complete | FR-001…FR-061, NFR-001…NFR-016 |
| `TECHNICAL_SPECIFICATION.md` | 3 | ✅ Complete | — |
| `DECISIONS.md` | 3 (+P7 amend) | ✅ Complete | ADR-001…ADR-017 (ADR-017 reverted; ADR-002 governs repo layout) |
| `contracts/openapi.yaml` | 3 (+P6 closure) | ✅ Complete | CON-001…CON-048 (CON-049…057 reserved) |
| `contracts/design-tokens.json` | 3 | ✅ Complete (stub) | — |
| `contracts/schemas/` | 3 | ✅ Complete (pointer) | — |
| `FEATURE_LIST.md` | 4 | ✅ Complete | FT-001…FT-069 |
| `MODULE_LIST.md` | 4 | ✅ Complete | MOD-01…MOD-12 |
| `modules/MODULES_OVERVIEW.md` | 4 | ✅ Complete | — |
| `modules/01-platform-tenant-foundation.md` | 5 | ✅ Complete | AC-001…AC-014 |
| `modules/02-identity-auth-membership.md` | 5 | ✅ Complete | AC-015…AC-029 |
| `modules/03-projects-portfolio-web-app.md` | 5 | ✅ Complete | AC-030…AC-040 |
| `modules/11-bangla-calendar.md` | 5 | ✅ Complete | AC-041…AC-049 |
| `modules/09-notifications-alerts.md` | 5 | ✅ Complete | AC-050…AC-059 |
| `modules/04-ponds-stocking-batches.md` | 5 | ✅ Complete | AC-060…AC-070 |
| `modules/05-feed-inventory.md` | 5 | ✅ Complete | AC-071…AC-082 |
| `modules/06-water-quality-emergency.md` | 5 | ✅ Complete | AC-083…AC-093 |
| `modules/07-health-growth-harvest.md` | 5 | ✅ Complete | AC-094…AC-106 |
| `modules/08-finance-roi.md` | 5 | ✅ Complete | AC-107…AC-117 |
| `modules/10-monitoring-reporting.md` | 5 | ✅ Complete | AC-118…AC-126 |
| `modules/12-worker-mobile-app.md` | 5 | ✅ Complete | AC-127…AC-139 |
| `BACKLOG.md` | 6 | ✅ Complete | TASK-001…TASK-051 |
| `TRACEABILITY_MATRIX.md` | 6 | ✅ Complete | — |
| `MODULE_PROGRESS_TRACKER.md` | 7 | ✅ Complete | — |
| `fish-farm-backend/.cursorrules` + `README.md` | 7 | ✅ Complete | — |
| `fish-farm-web/.cursorrules` + `README.md` | 7 | ✅ Complete | — |
| `fish-farm-mobile-app/.cursorrules` + `README.md` | 7 | ✅ Complete | — |
| `ERD.md` | — (supplementary, added construction-time) | ✅ Complete | 29 tables (24 business + 5 platform) across MOD-01…MOD-12 |

Legend: ✅ Complete · ⏳ Not started · 🔄 In progress

## ID ranges in use (highest number per prefix, so IDs never collide)

| Prefix | Artifact | Highest assigned | Lives in |
|---|---|---|---|
| `BR-` | Business requirement | **BR-016** | PROJECT_CONCEPT_NOTE.md |
| `RISK-` | Risk | **RISK-007** | PROJECT_CONCEPT_NOTE.md |
| `FR-` | Functional requirement | **FR-061** | PRODUCT_SPECIFICATION.md |
| `NFR-` | Non-functional requirement | **NFR-016** | PRODUCT_SPECIFICATION.md |
| `ADR-` | Architecture decision | **ADR-018** | DECISIONS.md |
| `CON-` | Contract element | **CON-048** (CON-049…057 reserved) | contracts/openapi.yaml |
| `FT-` | Feature | **FT-069** | FEATURE_LIST.md |
| `MOD-` | Module | **MOD-12** | MODULE_LIST.md |
| `AC-` | Acceptance criterion | **AC-143** | modules/ · BACKLOG.md |
| `TASK-` | Backlog card | **TASK-051** | BACKLOG.md |

> IDs are immutable. Never renumber; add new IDs and mark dead ones `[deprecated]`.

## Phase status
- **Phase 1 — Concept, Glossary & Index:** ✅ Complete.
- **Phase 2 — Product Specification:** ✅ Complete (`FR-001…FR-061`, `NFR-001…NFR-016`).
- **Phase 3 — Technical Spec, Decisions & Contracts:** ✅ Complete (`ADR-001…ADR-016`, `CON-001…CON-046`, `contracts/` stubs).
- **Phase 4 — Feature List & Module Definition:** ✅ Complete (`FT-001…FT-069`, `MOD-01…MOD-12`, MODULES_OVERVIEW).
- **Phase 5 — Module Detail Files:** ✅ Complete — **12 of 12** (MOD-01…MOD-12; `AC-001…AC-139`).
- **Phase 6 — Backlog & Traceability:** ✅ Complete (`TASK-001…TASK-050`, `TRACEABILITY_MATRIX.md`). A closure pass added TASK-046/047 (web FR-006/FR-009), TASK-048/049/050 (NFR-007/008/004), CON-047/048, and `AC-140…AC-142`.
- **Phase 7 — Execution Setup:** ✅ Complete (`MODULE_PROGRESS_TRACKER.md`; `.cursorrules` + `README.md` in each code repo).
- **Next:** Build task by task per each repo's `.cursorrules`, following the BACKLOG dependency DAG. Start with **TASK-051** (shared `packages/*` hosting) + **TASK-001** (scaffold). **All Open Items resolved** — OI-1 (separate repos), OI-2 (RLS deferred), OI-3 (queue+reconnect), OI-6 (partner full-finance read-only) on 2026-07-05; OI-4 (single BDT), OI-5 (OpenWeather), land-unit (bigha default) + South-Asian BDT formatting on 2026-07-06 (ADR-018). No decisions block construction.

---

*INDEX.md — Fish Farm Management System spec hub. Read this first.*
