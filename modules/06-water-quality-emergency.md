# MOD-06 — Water Quality & Emergency

**Project:** Fish Farm Management System (FMS) | **Surface:** backend | **Version:** 1.0 | **Status:** Not Started
**Owns features:** FT-032, FT-033, FT-034, FT-035, FT-036, FT-037
**Contract refs:** CON-025, CON-026, CON-027, CON-027a, CON-028, CON-044
**Dependencies:** MOD-01, MOD-04, MOD-09

---

## 1. Overview

**Purpose.** The highest-priority loss-prevention domain. Capture water parameters per pond,
compare them to configurable safe ranges, raise threshold and **emergency** alerts (the difference
between catching an oxygen crash early and losing a whole batch), plot trends with early-warning
patterns, and log pond-bottom/aeration actions.

**Scope.** Water readings (7 parameters, manual + sensor); configurable thresholds and breach
detection; trend data + early-warning patterns; one-tap emergency water event; pond-bottom
(chain-drag) and aeration action logs; a secured sensor-ingestion endpoint (P3).

**Position in architecture.** A project-owned domain on MOD-01/MOD-04. It **emits**
`WaterThresholdBreached` and `WaterEmergencyRaised` (→ MOD-09) and **provides** the latest-reading
read-model consumed by MOD-05 (temp/DO feed adjustment). Recurring scheduling of chain-drag lives
in Tasks (MOD-12); the logged *action* record lives here.

**Dependencies.** MOD-01 (scoped repo, events), MOD-04 (pond), MOD-09 (alert delivery).

## 2. Functional details

### 2.1 Core functions
- **F1 — Water reading capture (FT-032, FR-022).** Record `DO`, `TEMP`, `PH`, `AMMONIA`, `NITRITE`,
  `ALKALINITY`, `SECCHI` per pond with `source = MANUAL`, `read_at` (UTC). CON-025/026.
- **F2 — Thresholds & breach alerts (FT-033, FR-023).** Configurable safe ranges per parameter
  (per project/pond); a reading out of range emits `WaterThresholdBreached` (WARNING), below the
  critical bound emits a CRITICAL. CON-027/027a.
- **F3 — Trends & early warning (FT-034, FR-024).** Query readings over time; detect patterns
  (e.g., falling dawn DO across days) and surface an early-warning. (P2)
- **F4 — Pond-bottom & aeration logs (FT-035, FR-025).** Log chain-drag (every 10–15 days) and
  aeration actions tied to a pond.
- **F5 — Emergency water-event (FT-036, FR-026).** A one-tap worker emergency raises a CRITICAL
  alert to the owner via the most reliable channel, independent of any reading. CON-028.
- **F6 — Secured sensor ingestion (FT-037, FR-022 sensor).** Device-key-authenticated ingestion
  with `source = SENSOR`, mapped to the device's own pond/project. CON-044. (P3)

### 2.2 Sub-modules
- **readings** — reading capture + latest-reading read-model. State: `water_reading`.
- **thresholds** — safe-range config + breach evaluation. State: `water_threshold`.
- **trends** — time-series queries + pattern detection. State: none (query).
- **emergency** — one-tap emergency event. State: reuses alert (MOD-09).
- **actions** — pond-bottom/aeration logs. State: `pond_action`.
- **sensor-ingestion** — device-key guard + ingestion (P3). State: `device` mapping.

### 2.3 User interactions
Worker (mobile): record readings (offline), raise emergency, log aeration/chain-drag. Owner (web):
configure thresholds, view trends, receive breach/emergency alerts. Partner: read-only.

### 2.4 Business rules & validation
- **R1** Readings belong to a pond; `parameter` ∈ the 7-value enum; `value` numeric; `read_at` UTC;
  `source` ∈ `{MANUAL, SENSOR}`; all rows carry indexed `project_id`.
- **R2** Thresholds are **configurable**; seed defaults: DO ≥ 4–5 mg/L (critical < 3); pH 7.0–8.5;
  temp 26–32 °C; un-ionized ammonia < 0.1 mg/L; nitrite < 0.5 mg/L; alkalinity 50–150 mg/L; Secchi
  30–40 cm. A threshold may have min-only (DO, alkalinity), max-only (ammonia, nitrite), range (pH,
  temp, Secchi), and an optional critical bound.
- **R3** A reading out of the safe range emits `WaterThresholdBreached` (severity WARNING); a
  reading past the **critical** bound emits it as CRITICAL. Repeated breaches are debounced by MOD-09.
- **R4** The **emergency** flow always raises a CRITICAL alert to the owner, even with no reading.
- **R5** Early-warning patterns (e.g., N consecutive falling dawn-DO readings) raise an advisory,
  distinct from an instantaneous breach.
- **R6** Sensor ingestion is authenticated by a **device key**; a device maps to exactly one
  pond/project and may **only** post readings for that project (no cross-project ingestion).
- **R7** Chain-drag/aeration are logged actions tied to a pond; the recurring *reminder* is a Task
  (MOD-12), and completing that task may create the action record here.
- **R8** No water writes on a `CLOSED` project.
- **R9** All project-owned reads/writes are scoped (MOD-01).

### 2.5 Edge cases
1. **DO below the critical bound** → immediate CRITICAL breach alert (owner reached even if app
   closed, via MOD-09).
2. **Reading out of range but above critical** → WARNING breach.
3. **Emergency raised with no reading** → CRITICAL alert still delivered (R4).
4. **Sensor posts for a device mapped to project A** → only project A readings accepted; a payload
   claiming another project is rejected (R6).
5. **Invalid/expired device key** → 401; no reading stored.
6. **Max-only parameter** (ammonia/nitrite) → breaches only when exceeding max, not on a low value.
7. **Repeated breaches within minutes** → single active alert (debounced by MOD-09).
8. **Falling dawn DO over several days** → early-warning advisory even if each single reading is
   within range (pattern, not instant breach).
9. **Offline reading synced hours later** → thresholds evaluated at sync; a past critical still
   raises an alert, flagged as delayed (ties to MOD-12 sync).

### 2.6 Error states
| Trigger | Code / HTTP | Message | Recovery |
|---|---|---|---|
| Reading for a non-member project | `FORBIDDEN`/`NOT_FOUND` / 403/404 | "You do not have access to this resource." | None. |
| Invalid parameter/value | `VALIDATION` / 400 | "Invalid water parameter or value." | Fix input. |
| Sensor with invalid device key | `UNAUTHENTICATED` / 401 | "Invalid device credentials." | Re-provision device key. |
| Sensor posting to a non-owned project | `FORBIDDEN` / 403 | "Device is not authorized for this project." | None. |
| Water write on closed project | `PROJECT_CLOSED` / 409 | "This project is closed." | Reopen or discard. |

## 3. Non-functional (surface: backend)
- **NFR-011 (isolation)** — readings/thresholds/actions scoped; sensor ingestion locked to the
  device's project (AC-089/090).
- **NFR-013 (reliability)** — emergency + critical breach reach the owner via MOD-09 (AC-086).
- **NFR-001 (offline)** — offline readings sync and still trigger breach evaluation (AC-091).
- **NFR-005 (security)** — device-key auth for sensor ingestion; **guardrail**: a secured
  ingestion endpoint touching auth — escalate design/rotation.
- **NFR-004 (performance)** — indexed `(project_id, pond_id, parameter, read_at)` for trends.

## 4. Technical details

### 4.1 Components
`WaterModule`: `ReadingsController` (CON-025/026), `ThresholdsController` (CON-027/027a),
`EmergencyController` (CON-028), `SensorIngestionController` (CON-044, `DeviceKeyGuard`),
`TrendsQuery`, `BreachEvaluator` (pure domain service), `PatternDetector`, `PondActionService`.

### 4.2 Files / folders (repo: `fish-farm-backend`)
```
src/modules/water/
  domain/          water-reading.entity.ts, water-threshold.entity.ts, parameter.vo.ts, breach-evaluator.ts, pattern-detector.ts, pond-action.entity.ts, events (WaterThresholdBreached, WaterEmergencyRaised, PondActionLogged)
  application/     record-reading.usecase.ts, configure-thresholds.usecase.ts, raise-emergency.usecase.ts, trends.query.ts, log-pond-action.usecase.ts, ingest-sensor.usecase.ts
  infrastructure/  persistence (water-reading.model.ts, water-threshold.model.ts, pond-action.model.ts, device.model.ts + mappers), latest-reading-read.repo.ts
  presentation/    water.controller.ts, thresholds.controller.ts, sensor.controller.ts, device-key.guard.ts, dtos
migrations/        00xx_water_readings_thresholds.ts, 00xx_pond_actions_devices.ts
```

### 4.3 State and data
Tables: `water_reading` (id, project_id [idx], pond_id [idx], parameter, value, source, device_id
nullable, read_at), `water_threshold` (id, project_id [idx], parameter, min, max, critical),
`pond_action` (id, project_id [idx], pond_id [idx], type [AERATION|CHAIN_DRAG], at, note),
`device` (id, project_id [idx], pond_id, key_hash, label). Indexed for time-series trend queries.

### 4.4 Key logic
- **Record reading:** validate → persist → `BreachEvaluator` compares to threshold →
  emit `WaterThresholdBreached` (WARNING/CRITICAL) if out of range → update latest-reading
  read-model (for MOD-05).
- **Emergency:** persist event → emit `WaterEmergencyRaised` (CRITICAL) → MOD-09 delivers.
- **Trends/pattern:** query series → `PatternDetector` (e.g., monotonic dawn-DO decline over N days)
  → advisory.
- **Sensor ingest:** `DeviceKeyGuard` resolves device → project/pond → store reading source=SENSOR
  scoped to that project only.

### 4.5 Reusable / shared patterns
`BreachEvaluator` and `PatternDetector` are pure domain services. The latest-reading read-model is
the canonical input to MOD-05's temp/DO adjustment. `WaterThresholdBreached`/`WaterEmergencyRaised`
follow the MOD-09 alert-event pattern.

### 4.6 Integration points
- **Emits:** `WaterThresholdBreached`, `WaterEmergencyRaised` (→ MOD-09); `PondActionLogged`.
- **Provides:** latest-reading read-model (→ MOD-05).
- **Consumes:** readings arriving via `POST /sync` (MOD-12) use the same record+evaluate path;
  Task completion (MOD-12) may create a `pond_action`.

### 4.7 Contract impact
CON-025 (list readings), CON-026 (create reading), CON-027/027a (thresholds), CON-028 (emergency),
CON-044 (sensor ingestion) already defined. No new endpoints/schemas required. (A `pond_action`
endpoint may be added as `CON-050` when the UI needs to log/list actions directly; not required for
the core reading/threshold/emergency flows.)

### 4.8 Testing notes
Unit: breach evaluation across min-only/max-only/range/critical (AC-084/092), pattern detection
(AC-087). Integration: reading → breach → alert happy path + non-member denied (AC-090) + emergency
→ critical (AC-086) + sensor device-key auth incl. wrong-project rejection (AC-089). Offline-sync
breach evaluation (AC-091). The device-key security tests are required deliverables.

## 5. Acceptance criteria

- **AC-083** — *Given* an authorized member, *When* they record a reading for any of the 7
  parameters with `source=MANUAL`, *Then* it is stored scoped to the pond/project with a UTC
  `read_at`. — parent FR-022
- **AC-084** — *Given* a configured safe range, *When* a reading is out of range, *Then*
  `WaterThresholdBreached` is emitted as WARNING; below the critical bound it is emitted as
  CRITICAL. — parent FR-023
- **AC-085** — *Given* a project, *When* thresholds are configured (or seeded defaults are used),
  *Then* each parameter's min/max/critical are applied in breach evaluation. — parent FR-023
- **AC-086** — *Given* a worker raises a one-tap emergency, *When* it is submitted, *Then* a
  CRITICAL alert reaches the owner via MOD-09 even without any reading. — parent FR-026, NFR-013
- **AC-087** — *Given* a series of readings, *When* trends are queried, *Then* they return over time
  and a falling-dawn-DO pattern surfaces an early-warning advisory. — parent FR-024
- **AC-088** — *Given* an aeration or chain-drag action, *When* logged, *Then* a `pond_action` tied
  to the pond is recorded. — parent FR-025
- **AC-089** — *Given* a sensor with a valid device key mapped to project A, *When* it posts a
  reading, *Then* it is stored as `source=SENSOR` for A only; an invalid key returns 401 and a
  payload for another project is rejected. — parent FR-022, NFR-005, NFR-011
- **AC-090** — *Given* a user not a member of project P, *When* they read/write P's water data,
  *Then* it is denied (403/404). — parent FR-022, NFR-011
- **AC-091** — *Given* a reading captured offline, *When* it syncs later, *Then* thresholds are
  evaluated and any breach is raised (flagged delayed). — parent FR-022, FR-023, NFR-001
- **AC-092** — *Given* a max-only parameter (e.g., ammonia), *When* a reading exceeds max, *Then* it
  breaches; a low value does not. — parent FR-023
- **AC-093** — *Given* a CLOSED project, *When* a water write targets it, *Then* it returns
  `PROJECT_CLOSED`/409. — parent FR-022

## 6. Implementation & done

### 6.1 Definition of done
- [ ] All ACs (AC-083…AC-093) tested, including non-member denial (AC-090), device-key auth /
  wrong-project rejection (AC-089), and emergency→critical (AC-086).
- [ ] Integration test: reading → breach → alert happy path + one failure (non-member or invalid
  device key).
- [ ] Migration(s) reversible; `synchronize:false`; device keys hashed; secrets via env.
- [ ] Lint + type-check + tests green; diff self-contained; contract unchanged (or `CON-050` added
  with matrix update for pond-action endpoints).
- [ ] Matrix + tracker updated; human review passed.

### 6.2 Implementation notes
Keep `BreachEvaluator` pure and exhaustively tested across threshold shapes — it is the trigger for
the system's most important alerts. Use the same record+evaluate path for online and `POST /sync`
readings. Seed default thresholds via migration. Hash device keys; support rotation.

### 6.3 Risks / caveats
- **Sensor ingestion is security-sensitive** (device-key auth, cross-project risk) — treat as a
  guardrail; get key provisioning/rotation and the wrong-project rejection right (AC-089). This
  feature is **P3**, so it may ship after MVP, but the endpoint contract and isolation must hold.
- Threshold semantics vary per parameter (min/max/critical); a wrong sign is a missed or false
  alert — the min-only/max-only/range tests (AC-092) guard this.

### 6.4 Open questions
- Default safe ranges are advisory (BRD note) — confirm/tune per stock and lab advice before go-live.
  (Default: seed BRD-suggested ranges.)
- Are thresholds configured per project or per pond? (Default: per project with optional per-pond
  override.)

---

*MOD-06 detail — Fish Farm Management System. Phase 5 artifact. ACs: AC-083…AC-093.*
