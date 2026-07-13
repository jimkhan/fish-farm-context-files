# MOD-07 — Health, Growth & Harvest

**Project:** Fish Farm Management System (FMS) | **Surface:** backend | **Version:** 1.0 | **Status:** Not Started
**Owns features:** FT-038, FT-039, FT-040, FT-041, FT-042, FT-043, FT-044, FT-045
**Contract refs:** CON-019, CON-020, CON-021
**Dependencies:** MOD-01, MOD-04, MOD-09 (consumes `FeedingLogged` from MOD-05 for FCR via shared events)

---

## 1. Overview

**Purpose.** Track stock condition and value over time: **mortality** (which drives survival and
biomass), **treatments**, **sampling** (which drives feed quota and growth metrics), **growth**
(ADG/SGR), **pond-level FCR & survival**, and **partial harvests** (which reduce biomass and
produce revenue).

**Scope.** Mortality logging + abnormal-spike detection; treatment/medicine records; sampling;
growth analytics (ADG/SGR); actual FCR at **pond level** and survival rate per batch; partial/
progressive harvests; harvest-to-date vs projected.

**Position in architecture.** A project-owned domain on MOD-01/MOD-04. It is the **source** of the
`MortalityRecorded`, `SamplingRecorded`, and `HarvestRecorded` events that MOD-04 consumes to
maintain survival/biomass, and of `AbnormalMortalityDetected` (→ MOD-09). It **consumes**
`FeedingLogged` (MOD-05) to compute pond-level FCR, and emits harvest revenue toward Finance (MOD-08).

**Dependencies.** MOD-01, MOD-04 (batch), MOD-09 (alerts). Consumes MOD-05 `FeedingLogged` via
shared events (no build cycle — ADR-015).

## 2. Functional details

### 2.1 Core functions
- **F1 — Mortality logging (FT-038, FR-027/028).** Count, suspected cause category, optional photo,
  per batch; emits `MortalityRecorded` (→ MOD-04 survival/biomass). CON-019.
- **F2 — Treatment records (FT-039, FR-029).** Product, dose, date, withdrawal period. (P2)
- **F3 — Abnormal mortality detection (FT-040, FR-030).** Flag spikes vs baseline; emit
  `AbnormalMortalityDetected` (→ MOD-09). (P2)
- **F4 — Sampling (FT-041, FR-035).** Per species: sample size + average weight; emits
  `SamplingRecorded` (→ MOD-04 latest weight, → MOD-05 quota). CON-020. (record P1; analytics P2)
- **F5 — Growth analytics (FT-042, FR-036).** Growth curves, **ADG** and **SGR** per species. (P2)
- **F6 — Pond-level FCR & survival (FT-043, FR-037).** Actual FCR = total feed input ÷ biomass gain,
  computed at **pond level only**; survival rate per batch. (P2)
- **F7 — Partial harvest (FT-044, FR-039/040).** Date, pond, species, quantity, total weight, grade
  (export/local); emits `HarvestRecorded` (→ MOD-04 reduce biomass, → MOD-08 revenue). CON-021. (P2)
- **F8 — Harvest-to-date vs projected (FT-045, FR-041).** Progress vs projection. (P2)

### 2.2 Sub-modules
- **mortality-health** — mortality logging, spike detection, treatments. State: `mortality`,
  `treatment`.
- **sampling-growth** — sampling records, ADG/SGR. State: `sampling`.
- **fcr-survival** — pond-level FCR (from accumulated feed), survival rate. State: derived (feed
  accumulator per pond).
- **harvest** — partial harvests, harvest-to-date. State: `harvest`.

### 2.3 User interactions
Worker (mobile): log mortality (offline, with photo), record sampling, record harvests. Owner (web):
view growth curves, FCR, survival, harvest progress; record treatments. Partner: read-only.

### 2.4 Business rules & validation
- **R1** Mortality `count > 0`; suspected cause category from a controlled list (+ free note);
  optional photo; emits `MortalityRecorded` with an idempotency id.
- **R2** Sampling `sampleSize > 0`, `avgWeightG > 0`; emits `SamplingRecorded`.
- **R3** **FCR is computed at the pond level only** (total feed input ÷ total biomass gain); the
  system must **not** present per-species FCR unless feed is physically segregated (BRD note; guard).
- **R4** Survival rate per batch = current survival ÷ initial (reads MOD-04 read-model); target KPI
  ≥ 80%.
- **R5** ADG = (W₂ − W₁) / days; SGR = (ln W₂ − ln W₁) / days × 100 — per species from consecutive
  samplings; require ≥ 2 samplings.
- **R6** Abnormal-mortality detection compares a period's mortality to a baseline; a spike emits
  `AbnormalMortalityDetected` (debounced by MOD-09).
- **R7** Treatments record a **withdrawal period**; harvesting `EXPORT`-grade within the withdrawal
  window raises an advisory/warning (export/food-safety sensitivity for SPF prawn).
- **R8** Harvest quantity/weight cannot exceed remaining biomass/count; a harvest reduces remaining
  biomass (via `HarvestRecorded` → MOD-04) and produces revenue (→ MOD-08).
- **R9** All project-owned reads/writes scoped; no writes on a `CLOSED` project.

### 2.5 Edge cases
1. **Mortality exceeding remaining survival** → recorded and flagged; MOD-04 clamps survival at 0.
2. **FCR before biomass gain is measurable** (fewer than two samplings / no gain) → FCR is
   unavailable, not fabricated (R3).
3. **Per-species FCR requested** → refused; only pond-level FCR is exposed (R3).
4. **Harvest exceeding remaining biomass** → rejected/flagged (R8).
5. **Sampling weight lower than the previous** → recorded; ADG may be negative → flagged as a
   growth anomaly (not hidden).
6. **Export harvest within a treatment withdrawal window** → advisory/warn (R7).
7. **Duplicate mortality/sampling/harvest event** → idempotent downstream (MOD-04) — this module
   emits stable event ids.
8. **Abnormal spike detected repeatedly** → single alert (debounced by MOD-09).
9. **Offline mortality/sampling/harvest synced later** → same processing path (ties to MOD-12 sync).

### 2.6 Error states
| Trigger | Code / HTTP | Message | Recovery |
|---|---|---|---|
| Data for a non-member project | `FORBIDDEN`/`NOT_FOUND` / 403/404 | "You do not have access to this resource." | None. |
| count/size/weight ≤ 0 | `VALIDATION` / 400 | "Count, sample size, and weight must be positive." | Fix input. |
| Per-species FCR requested | `NOT_SUPPORTED` / 400 | "FCR is reported at pond level in polyculture." | Use pond-level FCR. |
| Harvest exceeds remaining | `HARVEST_EXCEEDS_STOCK` / 409 | "Harvest exceeds remaining stock." | Reduce quantity. |
| Export harvest within withdrawal | `WITHDRAWAL_WARNING` / 200 + flag | "Within medicine withdrawal period." | Proceed with caution / defer. |
| Write on closed project | `PROJECT_CLOSED` / 409 | "This project is closed." | Reopen or discard. |

## 3. Non-functional (surface: backend)
- **NFR-011 (isolation)** — mortality/sampling/harvest/treatment scoped (AC-105).
- **NFR-013 (reliability)** — abnormal-mortality spike raises an alert via MOD-09 (AC-100).
- **NFR-001 (offline)** — offline mortality/sampling/harvest sync without loss (AC-094/096/102).
- **NFR-015 (money)** — harvest revenue as minor units/decimal (AC-106).

## 4. Technical details

### 4.1 Components
`HealthModule` (mortality, treatment, `SpikeDetector`), `GrowthModule` (sampling, `AdgSgrCalculator`,
`FcrCalculator`, `SurvivalQuery`), `HarvestModule` (partial harvest, harvest-to-date). Event handler
accumulates `FeedingLogged` per pond for FCR. Emits `MortalityRecorded`, `SamplingRecorded`,
`HarvestRecorded`, `AbnormalMortalityDetected`, harvest-revenue event.

### 4.2 Files / folders (repo: `fish-farm-backend`)
```
src/modules/health/
  domain/          mortality.entity.ts, treatment.entity.ts, cause-category.vo.ts, spike-detector.ts, events (MortalityRecorded, AbnormalMortalityDetected)
  application/     log-mortality.usecase.ts, record-treatment.usecase.ts, detect-spike.handler.ts
src/modules/growth/
  domain/          sampling.entity.ts, adg-sgr.service.ts, fcr.service.ts, survival.service.ts, events (SamplingRecorded)
  application/     record-sampling.usecase.ts, growth.query.ts, fcr.query.ts, on-feeding-logged.handler.ts
src/modules/harvest/
  domain/          harvest.entity.ts, grade.vo.ts, events (HarvestRecorded, HarvestRevenueEarned)
  application/     record-harvest.usecase.ts, harvest-progress.query.ts
  infrastructure/  persistence (mortality/treatment/sampling/harvest models + mappers, pond-feed-accumulator)
  presentation/    controllers (CON-019/020/021), dtos
migrations/        00xx_mortality_treatment.ts, 00xx_sampling.ts, 00xx_harvest.ts
```

### 4.3 State and data
Tables: `mortality` (id, project_id [idx], batch_id [idx], count, cause_category, photo_url,
occurred_at), `treatment` (id, project_id [idx], batch_id, product, dose, administered_on,
withdrawal_days), `sampling` (id, project_id [idx], batch_id [idx], sample_size, avg_weight_g,
sampled_on), `harvest` (id, project_id [idx], batch_id [idx], quantity, total_weight_kg, grade,
harvested_on, revenue_minor — BDT only, ADR-018), `pond_feed_accumulator` (project_id, pond_id, total_feed_kg)
for FCR. All carry `project_id`.

### 4.4 Key logic
- **Log mortality:** validate → persist → emit `MortalityRecorded` (idempotency id) → spike detector
  evaluates period vs baseline → maybe `AbnormalMortalityDetected`.
- **Record sampling:** persist → emit `SamplingRecorded`; ADG/SGR computed from consecutive
  samplings on read.
- **On `FeedingLogged`:** accumulate pond feed total (idempotent) for FCR.
- **FCR:** pond-level = accumulated feed ÷ biomass gain (from MOD-04 read-model); refuse per-species.
- **Harvest:** validate ≤ remaining → persist → emit `HarvestRecorded` (→ MOD-04) + revenue event
  (→ MOD-08).

### 4.5 Reusable / shared patterns
`AdgSgrCalculator`, `FcrCalculator`, `SpikeDetector`, `SurvivalService` are pure domain services.
Event emission (`MortalityRecorded`/`SamplingRecorded`/`HarvestRecorded`) is the integration seam
with MOD-04/05/08/09.

### 4.6 Integration points
- **Emits:** `MortalityRecorded`, `SamplingRecorded`, `HarvestRecorded` (→ MOD-04);
  `AbnormalMortalityDetected` (→ MOD-09); harvest-revenue (→ MOD-08).
- **Consumes:** `FeedingLogged` (MOD-05) for FCR; MOD-04 biomass/survival read-model.
- **Consumes:** mortality/sampling/harvest arriving via `POST /sync` (MOD-12) use the same path.

### 4.7 Contract impact
CON-019 (mortality), CON-020 (sampling), CON-021 (harvest) already defined. Treatments and FCR/
growth/harvest-progress read endpoints may be added as `CON-051…CON-053` when their UIs are
detailed (P2); note them in the matrix when introduced. Core P1 flows (mortality, sampling) need no
new contract.

### 4.8 Testing notes
Unit: survival/biomass effect of mortality (with MOD-04), ADG/SGR math (AC-097), **pond-level FCR +
refusal of per-species** (AC-098), spike detection (AC-100), harvest-exceeds-stock (AC-103),
withdrawal advisory (AC-101). Integration: log mortality → survival updates happy path + non-member
denied (AC-105); harvest → biomass reduce + revenue (AC-102). Money-as-minor-units (AC-106).

## 5. Acceptance criteria

- **AC-094** — *Given* an authorized member, *When* they log a mortality (count, cause, optional
  photo), *Then* it is stored scoped and `MortalityRecorded` is emitted. — parent FR-027
- **AC-095** — *Given* a logged mortality, *When* it is processed, *Then* the batch's survival and
  biomass are updated automatically (via MOD-04 consuming the event). — parent FR-028
- **AC-096** — *Given* a sampling (size, avg weight), *When* recorded, *Then* it is stored and
  `SamplingRecorded` is emitted (updating latest weight for feed/biomass). — parent FR-035
- **AC-097** — *Given* two or more samplings for a species, *When* growth is computed, *Then* ADG
  and SGR are returned per species. — parent FR-036
- **AC-098** — *Given* pond feed input and biomass gain, *When* FCR is requested, *Then* it is
  computed **at pond level**; a per-species FCR request is refused (`NOT_SUPPORTED`). — parent FR-037
- **AC-099** — *Given* a batch, *When* survival rate is requested, *Then* it equals current survival
  ÷ initial count. — parent FR-037
- **AC-100** — *Given* a mortality spike above baseline, *When* detected, *Then*
  `AbnormalMortalityDetected` is emitted and a single alert is raised via MOD-09. — parent FR-030
- **AC-101** — *Given* a treatment with a withdrawal period, *When* an EXPORT harvest is attempted
  within that window, *Then* a withdrawal advisory/warning is surfaced. — parent FR-029
- **AC-102** — *Given* a partial harvest (quantity, weight, grade), *When* recorded, *Then*
  remaining biomass is reduced (via `HarvestRecorded`) and revenue is fed to Finance. — parent FR-039, FR-040
- **AC-103** — *Given* a harvest exceeding remaining stock, *When* attempted, *Then* it returns
  `HARVEST_EXCEEDS_STOCK`/409. — parent FR-039
- **AC-104** — *Given* recorded harvests and a projection, *When* progress is requested, *Then*
  harvest-to-date vs projected is reported. — parent FR-041
- **AC-105** — *Given* a user not a member of project P, *When* they read/write P's health/growth/
  harvest data, *Then* it is denied (403/404). — parent NFR-011
- **AC-106** — *Given* harvest revenue, *When* stored, *Then* it is persisted as integer minor
  units/decimal (never float) in the project currency. — parent NFR-015

## 6. Implementation & done

### 6.1 Definition of done
- [ ] All ACs (AC-094…AC-106) tested, including non-member denial (AC-105), pond-level-FCR /
  per-species refusal (AC-098), and harvest-exceeds-stock (AC-103).
- [ ] Integration test: mortality → survival update happy path + one failure; harvest → biomass
  reduce + revenue.
- [ ] Migration(s) reversible; `synchronize:false`; money per NFR-015; no secrets.
- [ ] Lint + type-check + tests green; diff self-contained; contract unchanged (or `CON-051…053`
  added with matrix update for P2 read endpoints).
- [ ] Matrix + tracker updated; human review passed.

### 6.2 Implementation notes
Keep ADG/SGR, FCR, survival, and spike detection as pure domain services. Accumulate pond feed
totals idempotently from `FeedingLogged` for FCR. Emit stable event ids so MOD-04's consumers stay
idempotent. Use the same processing path for online and `POST /sync` submissions. **Do not** expose
per-species FCR — it is a deliberate anti-feature (BRD note / RISK-007).

### 6.3 Risks / caveats
- **FCR mis-attribution (RISK-007):** the pond-level-only rule and the per-species refusal (AC-098)
  are the guard; do not add per-species FCR without physically segregated feed.
- Survival/biomass correctness depends on idempotent event ids here + idempotent consumers in MOD-04
  (AC-064) — keep the two aligned.

### 6.4 Open questions
- Abnormal-mortality baseline/threshold definition (rolling average? fixed multiple?). (Default:
  flag when a day's mortality exceeds N× the trailing 7-day average; tunable.)
- Cause-category controlled list contents. (Default: seed common categories — disease, water,
  handling, predation, unknown; extensible.)

---

*MOD-07 detail — Fish Farm Management System. Phase 5 artifact. ACs: AC-094…AC-106.*
