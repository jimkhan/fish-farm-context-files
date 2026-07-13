# MOD-04 — Ponds, Stocking & Batches

**Project:** Fish Farm Management System (FMS) | **Surface:** backend | **Version:** 1.0 | **Status:** Not Started
**Owns features:** FT-018, FT-019, FT-020, FT-021, FT-022
**Contract refs:** CON-013, CON-014, CON-015, CON-016, CON-017, CON-043
**Dependencies:** MOD-01, MOD-03 (consumes `MortalityRecorded` / `SamplingRecorded` / `HarvestRecorded` events from MOD-07 via shared contracts)

---

## 1. Overview

**Purpose.** Model the physical/biological core of a project: **Ponds**, **Stocking** events, the
**Batches** they create, and the derived **survival** and **biomass** figures the rest of the
system reads. This is the first project-owned domain module and the anchor most other domains hang
off.

**Scope.** Pond CRUD; stocking events; batch tracking with a running survival estimate; per-species
stocking-density advisory; the biomass overview read-model. It maintains survival/biomass by
**reacting to events** (`MortalityRecorded`, `SamplingRecorded`, `HarvestRecorded`) published by
MOD-07 — it does not compute mortality or sampling itself.

**Position in architecture.** Sits on MOD-01 (scoped repo, events) and MOD-03 (a pond belongs to a
project). It **implements** MOD-03's `ProvisionFirstPondPort` (so inline first-pond creation is
atomic without a cycle) and **provides** the biomass read-model consumed by MOD-03 (portfolio),
MOD-05 (feed quota), and MOD-07 (FCR).

**Dependencies.** MOD-01, MOD-03. Consumes MOD-07 events via `packages/shared` contracts (no build
dependency on MOD-07 — ADR-015).

## 2. Functional details

### 2.1 Core functions
- **F1 — Pond management (FT-018).** Create/list ponds with area (decimal/katha), depth, notes,
  scoped to a project. CON-013/014.
- **F2 — Stocking events (FT-019).** Record a stocking (species, source/hatchery, PL/fingerling
  count, date, stocking cost); each stocking creates exactly one Batch. CON-015.
- **F3 — Batch tracking & survival (FT-020).** A Batch carries `initial_count` and a running
  `survival_estimate = initial_count − cumulative_mortality` (clamped ≥ 0), reduced further by
  harvests. Maintained by consuming `MortalityRecorded`/`HarvestRecorded`. CON-016/017. FR-014/028.
- **F4 — Stocking-density advisory (FT-021).** Density = count ÷ pond area, compared to a
  per-species sane range; surface an over/under advisory.
- **F5 — Biomass overview (FT-022).** Per species: `(initial_count − cumulative_mortality − harvested)
  × latest_avg_weight`; aggregated per pond/project. CON-043. FR-038.

### 2.2 Sub-modules
- **ponds** — Pond aggregate + CRUD. State: `pond`.
- **stocking** — Stocking events + `ProvisionFirstPondPort` impl. State: `stocking`.
- **batches** — Batch aggregate, survival read-model, status transitions. State: `batch`.
- **biomass** — biomass read-model + density advisory. State: derived (materialized on `batch`).
- **species-ref** — read access to `Species` reference data (density ranges). State: reference only.

### 2.3 User interactions
Owner/Worker (web/mobile) create ponds and record stockings; the worker sees density advisories and
biomass; the owner sees biomass in the portfolio and project dashboard. Partner sees read-only.

### 2.4 Business rules & validation
- **R1** A Pond belongs to exactly one project; `area > 0`; depth optional; all pond/stocking/batch
  rows carry an indexed `project_id` (even though reachable via pond) per CLAUDE.md.
- **R2** Stocking `count > 0`; `stockedOn` is a valid date; `stockingCost` is money (integer minor
  units/decimal, never float — NFR-015); `speciesId` references existing `Species` reference data.
- **R3** Each Stocking creates **exactly one** Batch (`Stocking 1—1 Batch`).
- **R4** `survival_estimate = max(0, initial_count − cumulative_mortality − harvested_count)`; it is
  never negative; if mortality/harvest would exceed initial, clamp at 0 and flag a data anomaly.
- **R5** A pond may hold **multiple batches** (true polyculture: multiple species). Density advisory
  is computed **per species** (and a total-pond density is available).
- **R6** Biomass uses the **latest sampling average weight** per species; before the first sampling
  a batch has a count but **no** weight-derived biomass (weight-based biomass is null until then).
- **R7** No new ponds/stockings on a **CLOSED** project (honors MOD-03 project status).
- **R8** Species is **reference data** (not project-owned) and is not project-scoped; ponds/batches
  are project-owned and always scoped.
- **R9** All reads/writes of project-owned data go through the scoped repository (MOD-01).

### 2.5 Edge cases
1. **Stocking into a pond in another project** → denied by scope (403/404), no data disclosure.
2. **Mortality/harvest exceeding initial count** (bad data) → survival clamps at 0 and the anomaly
   is flagged (not a negative number).
3. **Biomass before any sampling** → count is known; weight-derived biomass is null until the first
   `SamplingRecorded`.
4. **Multiple species in one pond** → each stocking → its own batch; per-species density advisories;
   pond-level totals available (FCR remains pond-level in MOD-07).
5. **Editing pond area after stocking** → density recomputed live; historical stockings unchanged.
6. **Duplicate `MortalityRecorded`/`HarvestRecorded` event** (at-least-once bus) → applied once
   (idempotent by event id) so cumulative figures don't double-count.
7. **Closing a batch with remaining biomass** → allowed only via status transition
   `ACTIVE→HARVESTING→CLOSED` with a reason; not a silent delete.
8. **Density with tiny/zero area** → validation prevents area ≤ 0, avoiding divide-by-zero.

### 2.6 Error states
| Trigger | Code / HTTP | Message | Recovery |
|---|---|---|---|
| Pond/stocking in a non-member project | `FORBIDDEN`/`NOT_FOUND` / 403/404 | "You do not have access to this resource." | None. |
| Area ≤ 0 or count ≤ 0 | `VALIDATION` / 400 | "Area and count must be positive." | Fix input. |
| Unknown `speciesId` | `VALIDATION` / 400 | "Unknown species." | Choose a valid species. |
| Stocking on a closed project | `PROJECT_CLOSED` / 409 | "This project is closed." | Reopen or discard. |
| Invalid batch status transition | `INVALID_TRANSITION` / 409 | "Invalid batch status change." | Use a valid transition. |

## 3. Non-functional (surface: backend)
- **NFR-011 (isolation)** — every pond/stocking/batch query scoped by `project_id` (AC-061).
- **NFR-015 (money)** — stocking cost stored as integer minor units/decimal (AC-070).
- **NFR-004 (performance)** — indexed `project_id` and `pond_id`; biomass is a maintained read-model,
  not recomputed per request.

## 4. Technical details

### 4.1 Components
`PondsModule` exposing `PondsController` (CON-013/014), `StockingController` (CON-015),
`BatchesController` (CON-016/017), `BiomassController` (CON-043); `ProvisionFirstPondAdapter`
(implements MOD-03's port); event handlers for `MortalityRecorded`/`SamplingRecorded`/
`HarvestRecorded`; `SpeciesRefRepository`.

### 4.2 Files / folders (repo: `fish-farm-backend`)
```
src/modules/ponds/
  domain/          pond.entity.ts, stocking.entity.ts, batch.entity.ts, species.ref.ts, density.service.ts, biomass.service.ts, events (BatchCreated, StockingRecorded)
  application/     create-pond.usecase.ts, record-stocking.usecase.ts, get-batch.query.ts, biomass-overview.query.ts, provision-first-pond.adapter.ts, on-mortality.handler.ts, on-sampling.handler.ts, on-harvest.handler.ts
  infrastructure/  persistence (pond.model.ts, stocking.model.ts, batch.model.ts, species.model.ts + mappers), biomass-read.repo.ts
  presentation/    ponds.controller.ts, stocking.controller.ts, batches.controller.ts, biomass.controller.ts, dtos
migrations/        00xx_species_ref.ts, 00xx_ponds_stocking_batches.ts
```

### 4.3 State and data
Tables: `species` (reference: id, name, density_min, density_max, notes — seeded), `pond`
(id, project_id [idx], name, area_decimal, depth_m, notes), `stocking` (id, project_id [idx],
pond_id [idx], species_id, source, hatchery_name, count, stocked_on, stocking_cost_minor, currency),
`batch` (id, project_id [idx], pond_id [idx], species_id, initial_count, cumulative_mortality,
harvested_count, latest_avg_weight_g nullable, status, stocked_on). Biomass is materialized on
`batch` (survival + latest weight) and aggregated on read.

### 4.4 Key logic
- **Record stocking:** validate → create `stocking` + `batch` (survival = initial) in one
  transaction → emit `StockingRecorded`, `BatchCreated`.
- **On mortality/harvest event:** idempotently increment `cumulative_mortality`/`harvested_count`;
  recompute `survival_estimate` (clamp ≥ 0).
- **On sampling event:** update `latest_avg_weight_g`.
- **Biomass overview:** per species, `survival × latest_avg_weight_g` (null if no weight yet),
  aggregated for the pond/project.

### 4.5 Reusable / shared patterns
The biomass read-model is the canonical source consumed by portfolio (MOD-03), feed quota (MOD-05),
and FCR (MOD-07). Density advisory logic is a pure domain service. Event handlers follow the MOD-01
idempotent-consumer pattern.

### 4.6 Integration points
- **Implements** MOD-03 `ProvisionFirstPondPort`.
- **Provides** biomass/survival read-model to MOD-03, MOD-05, MOD-07.
- **Consumes** `MortalityRecorded`, `SamplingRecorded`, `HarvestRecorded` (MOD-07) via shared events.
- **Emits** `BatchCreated`, `StockingRecorded`.

### 4.7 Contract impact
CON-013 (list ponds), CON-014 (create pond), CON-015 (stocking→batch), CON-016/017 (batches),
CON-043 (biomass) already defined. No new endpoints/schemas required (Species reference lookup may
later warrant a `GET /species` endpoint — note as `CON-048` if the UI needs it; not required for the
core flows).

### 4.8 Testing notes
Unit: survival clamp (R4/AC-063), density advisory ranges (AC-065), biomass with/without sampling
(AC-066), idempotent event consumption (AC-064). Integration: create pond → stock → batch happy path
+ non-member denied (AC-061). The **scoped negative test** (AC-061) and **idempotent mortality**
(AC-064) are required. Verify `ProvisionFirstPondPort` atomicity with MOD-03 (AC-068).

## 5. Acceptance criteria

- **AC-060** — *Given* an authorized member, *When* they create a pond with area/depth/notes, *Then*
  it is persisted scoped to their project. — parent FR-012
- **AC-061** — *Given* a user who is not a member of project P, *When* they create a pond or stocking
  in P, *Then* it is denied (403/404) with no data disclosure. — parent FR-012, FR-013, NFR-011
- **AC-062** — *Given* a valid stocking, *When* it is recorded, *Then* exactly one Batch is created
  with `initial_count` and `survival_estimate = initial_count`. — parent FR-013, FR-014
- **AC-063** — *Given* a batch, *When* a `MortalityRecorded` event is consumed, *Then*
  `survival_estimate = max(0, initial − cumulative_mortality − harvested)`. — parent FR-014, FR-028
- **AC-064** — *Given* the same `MortalityRecorded` event delivered twice, *When* consumed, *Then*
  cumulative mortality increases only once (idempotent). — parent FR-028
- **AC-065** — *Given* a stocking, *When* density is shown, *Then* it equals count ÷ pond area and
  carries a per-species advisory when outside the sane range. — parent FR-015
- **AC-066** — *Given* a batch with a latest sampling weight, *When* biomass is computed, *Then* it
  equals `survival × latest_avg_weight` per species; before the first sampling, weight-based biomass
  is null. — parent FR-038
- **AC-067** — *Given* a `HarvestRecorded` event, *When* consumed, *Then* the batch's remaining
  count and biomass are reduced accordingly. — parent FR-038
- **AC-068** — *Given* a create-project request with a first pond, *When* MOD-03 calls
  `ProvisionFirstPondPort`, *Then* the pond is created atomically within the project-creation
  transaction. — parent FR-008
- **AC-069** — *Given* a CLOSED project, *When* a stocking or pond creation targets it, *Then* it
  returns `PROJECT_CLOSED`/409. — parent FR-012
- **AC-070** — *Given* a stocking cost, *When* it is stored, *Then* it is persisted as integer minor
  units/decimal (never float) in the project currency. — parent FR-013, NFR-015

## 6. Implementation & done

### 6.1 Definition of done
- [ ] All ACs (AC-060…AC-070) tested, including scoped negative (AC-061) and idempotent mortality
  (AC-064).
- [ ] Integration test: create pond → stock → batch happy path + one failure (non-member or
  closed-project).
- [ ] `ProvisionFirstPondPort` atomic with MOD-03 (AC-068).
- [ ] Migration(s) reversible; `synchronize:false`; money stored per NFR-015; no secrets.
- [ ] Lint + type-check + tests green; diff self-contained; contract unchanged (or `CON-048` added
  with matrix update if a species-list endpoint is introduced).
- [ ] Matrix + tracker updated; human review passed.

### 6.2 Implementation notes
Maintain survival/biomass as a read-model updated by idempotent event handlers rather than
recomputing on every read. Keep density and biomass as pure domain services. Seed `Species`
reference data via migration. Implement `ProvisionFirstPondPort` so MOD-03's create-project
transaction stays atomic.

### 6.3 Risks / caveats
- Event ordering: a `SamplingRecorded` may arrive before/after mortality; handlers must be
  order-independent and idempotent so the read-model converges correctly.
- Biomass accuracy depends on timely sampling; before first sampling, avoid implying a false
  weight-based biomass (return null, not zero).

### 6.4 Open questions
- Do we need a `GET /species` endpoint for the UI to pick species, or is species a fixed seeded
  list surfaced via config? (Default: seeded reference; add `CON-048` only if the UI needs dynamic
  listing.)
- Per-species density sane ranges: source values (lab/advisory). (Default: configurable per species
  in `Species` reference; seed with sensible defaults, tune later.)

---

*MOD-04 detail — Fish Farm Management System. Phase 5 artifact. ACs: AC-060…AC-070.*
