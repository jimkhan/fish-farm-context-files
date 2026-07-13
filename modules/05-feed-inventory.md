# MOD-05 — Feed & Inventory

**Project:** Fish Farm Management System (FMS) | **Surface:** backend | **Version:** 1.0 | **Status:** Not Started
**Owns features:** FT-023, FT-024, FT-025, FT-026, FT-027, FT-028, FT-029, FT-030, FT-031
**Contract refs:** CON-018, CON-018a, CON-022, CON-023, CON-024
**Dependencies:** MOD-01, MOD-04, MOD-09 (consumes biomass/sampling read-model from MOD-04 and latest water readings from MOD-06 via shared read-models/events)

---

## 1. Overview

**Purpose.** Turn feed — the largest variable cost — into a disciplined, measured input: compute the
**daily feed quota** from the latest sampling weight and a configurable Body-Weight % table, adjust
it for temperature and dissolved oxygen, run independent floating vs sinking schedules, and make
**logging a feeding auto-deduct** the matching per-project inventory (with low-stock alerts and
reconciliation).

**Scope.** Feed quota calculation; temp/DO adjustment; floating vs sinking/Scampro schedules;
feeding reminders; feeding logs with inventory auto-deduction; check-tray observation; per-project
inventory items, transactions, low-stock alerts, and reconciliation.

**Position in architecture.** A project-owned domain on MOD-01/MOD-04. It **reads** the biomass +
latest-sampling-weight read-model (MOD-04) and the latest water reading (MOD-06), **emits**
`FeedingLogged` (consumed for FCR) and `LowStock` (→ MOD-09), and never queries another module's
tables directly.

**Dependencies.** MOD-01, MOD-04, MOD-09. Consumes MOD-06 water read-model and MOD-07
`SamplingRecorded` via shared contracts (no build cycle — ADR-015).

## 2. Functional details

### 2.1 Core functions
- **F1 — Feed quota calculator (FT-023, FR-016).** Daily quota = biomass (survival × latest avg
  weight) × configurable **BW% band** for the growth stage, per species. `GET …/feed-plan` (CON-018a).
- **F2 — Temperature/DO adjustment (FT-024, FR-017).** Reduce or skip the quota when the latest DO
  is low or temperature is outside the safe band (not BW% alone), with an explicit reason.
- **F3 — Floating vs sinking schedules (FT-025, FR-018).** Independent schedules for **floating**
  (Carp/Parse) and **sinking/Scampro** (Golda), each mapped to its feed-type inventory.
- **F4 — Feeding reminders (FT-026, FR-019).** Morning/evening reminders per schedule to the worker
  (delivered via MOD-09 push and mirrored as offline-capable local reminders on mobile, MOD-12).
- **F5 — Feeding log + auto-deduction (FT-027, FR-020).** Logging a feeding records `qty_kg` and
  **atomically deducts** the matching inventory item; emits `FeedingLogged`. `POST …/feedings` (CON-018).
- **F6 — Check-tray observation (FT-028, FR-021).** Record `NORMAL`/`LEFTOVER`/`EMPTY` to flag
  over/under-feeding and nudge subsequent quotas.
- **F7 — Inventory items & stock (FT-029, FR-042).** Per-project feed + consumables with quantity
  and low-stock threshold. `GET/POST …/inventory` (CON-022/023).
- **F8 — Low-stock alerts (FT-030, FR-043).** When quantity crosses the low-stock threshold, emit
  `LowStock` (→ MOD-09), debounced.
- **F9 — Reconciliation & transactions (FT-031, FR-044).** Receipts/adjustments; reconcile
  (receipts − deductions = quantity). `POST …/inventory/{itemId}/transactions` (CON-024).

### 2.2 Sub-modules
- **feed-calc** — `FeedQuotaCalculator` + temp/DO adjuster (pure domain services). State: none.
- **schedules** — floating/sinking schedule config + reminder emission. State: `feed_schedule`.
- **feeding-log** — feeding log use-case + deduction. State: `feeding_log`.
- **inventory** — items, transactions, low-stock, reconciliation. State: `inventory_item`,
  `inventory_txn`.

### 2.3 User interactions
Worker (mobile): sees today's feed plan (per feed type), logs feedings (offline), records check-tray;
receives reminders. Owner (web): configures BW% table, schedules, inventory items + thresholds;
sees stock levels. Partner: read-only.

### 2.4 Business rules & validation
- **R1** Quota = biomass × BW% band; the BW% table is **configurable** per species/growth stage and
  is **not** hard-coded.
- **R2** If there is **no latest sampling weight** for a species, the quota is **not fabricated** —
  the plan indicates sampling is required.
- **R3** Temp/DO adjustment: if latest DO < configured low threshold or temperature is outside the
  safe band, the quota is **reduced by a configured factor or skipped (0)**, with a stated reason.
- **R4** Floating and sinking are **independent** schedules and deduct from their **matching
  feed-type** inventory; logging against a mismatched feed type is rejected/flagged.
- **R5** Logging a feeding **atomically** decrements the inventory item; the feeding (a physical
  fact) is always recorded even if stock is insufficient — in that case the shortfall is **flagged
  as a reconciliation discrepancy**, never silently lost or blocked.
- **R6** Low-stock fires **once per downward crossing** of the threshold (debounced by MOD-09), not
  on every deduction below it.
- **R7** Inventory is **per project** and never shared; all reads/writes are scoped (NFR-011).
- **R8** Monetary values (inventory receipt cost) are integer minor units/decimal (NFR-015); a feed
  purchase may emit a cost event to Finance (MOD-08).
- **R9** No feed/inventory writes on a `CLOSED` project.

### 2.5 Edge cases
1. **Quota requested before first sampling** → returns "sampling required", no fabricated number (R2).
2. **DO below critical at feeding time** → plan recommends **skip** (quota 0) with the DO reason (R3).
3. **Feeding logged offline, synced later** → deduction applied on sync; if stock now insufficient,
   feeding is recorded and a discrepancy is flagged (no data loss) — ties to MOD-12 sync.
4. **Feeding against a mismatched feed-type item** (sinking logged to a floating item) → rejected/
   flagged (R4).
5. **Threshold crossing** → single `LowStock`; staying below threshold across further deductions
   does not re-fire (R6).
6. **Over-deduction → negative stock** → recorded with a flagged discrepancy, surfaced for
   correction, not hidden.
7. **Inventory item in another project** → scope-denied (403/404).
8. **Concurrent feedings on the same item** → atomic decrement; no lost update.
9. **Check-tray = LEFTOVER repeatedly** → subsequent quota nudged down (advisory), logged as guidance.

### 2.6 Error states
| Trigger | Code / HTTP | Message | Recovery |
|---|---|---|---|
| Feed plan without sampling weight | `SAMPLING_REQUIRED` / 409 | "Record a sampling to compute today's feed." | Add a sampling (MOD-07). |
| Mismatched feed-type deduction | `FEED_TYPE_MISMATCH` / 400 | "Feed type does not match this inventory item." | Choose the correct item. |
| Inventory item in non-member project | `FORBIDDEN`/`NOT_FOUND` / 403/404 | "You do not have access to this resource." | None. |
| Negative delta making stock invalid (manual txn) | `VALIDATION` / 400 | "Adjustment would make stock invalid." | Fix the adjustment. |
| Feed/inventory write on closed project | `PROJECT_CLOSED` / 409 | "This project is closed." | Reopen or discard. |

## 3. Non-functional (surface: backend)
- **NFR-011 (isolation)** — inventory is per-project and scoped (AC-078).
- **NFR-015 (money)** — inventory cost as minor units/decimal (AC-082).
- **NFR-001 (offline)** — feedings logged offline sync without loss; deduction on sync (AC-076).
- **NFR-004 (performance)** — quota reads the maintained read-model; deduction is an indexed atomic
  update.

## 4. Technical details

### 4.1 Components
`FeedModule` (`FeedQuotaCalculator`, `TempDoAdjuster`, `ScheduleService`, `FeedingLogUseCase`),
`InventoryModule` (`InventoryService`, `TransactionService`, `LowStockDetector`); event handlers for
`SamplingRecorded` (cache latest weight if needed) and water read-model access; emits `FeedingLogged`,
`LowStock`, optional `FeedCostIncurred`.

### 4.2 Files / folders (repo: `fish-farm-backend`)
```
src/modules/feed/
  domain/          feed-quota.service.ts, temp-do-adjuster.ts, bw-band.vo.ts, feed-schedule.entity.ts, feeding-log.entity.ts, feed-observation.vo.ts, events (FeedingLogged, FeedingReminderDue)
  application/     get-feed-plan.query.ts, log-feeding.usecase.ts, configure-schedule.usecase.ts
  infrastructure/  persistence (feed-schedule.model.ts, feeding-log.model.ts, bw-table.model.ts + mappers)
  presentation/    feed.controller.ts, dtos
src/modules/inventory/
  domain/          inventory-item.entity.ts, inventory-txn.entity.ts, low-stock.policy.ts, events (LowStock, FeedCostIncurred)
  application/     create-item.usecase.ts, record-txn.usecase.ts, deduct-on-feeding.handler.ts, reconcile.query.ts
  infrastructure/  persistence (inventory-item.model.ts, inventory-txn.model.ts + mappers)
  presentation/    inventory.controller.ts, dtos
migrations/        00xx_feed_schedules_bw.ts, 00xx_inventory.ts, 00xx_feeding_logs.ts
```

### 4.3 State and data
Tables: `bw_table` (species/stage → BW% band), `feed_schedule` (project_id, feed_type, times),
`feeding_log` (id, project_id [idx], batch_id [idx], inventory_item_id, qty_kg, fed_at, observation),
`inventory_item` (id, project_id [idx], name, feed_type, unit, quantity, low_stock_threshold),
`inventory_txn` (id, project_id [idx], item_id [idx], delta, reason, at). All project-owned tables
carry `project_id`.

### 4.4 Key logic
- **Feed plan:** read biomass + latest weight (MOD-04) and latest DO/temp (MOD-06) → base quota =
  biomass × BW% band → apply temp/DO factor → split by feed type per schedule.
- **Log feeding:** in one transaction, insert `feeding_log`, decrement `inventory_item.quantity`
  (atomic), insert a deduction `inventory_txn`; if crossing threshold → emit `LowStock`; emit
  `FeedingLogged`.
- **Reconcile:** quantity == Σ(receipts) − Σ(deductions); mismatch → discrepancy flag.

### 4.5 Reusable / shared patterns
`FeedQuotaCalculator` and `TempDoAdjuster` are pure, unit-testable domain services. The
feeding→deduction transaction is the template for "log + side-effect atomically". `LowStock`/
`FeedingLogged` events integrate with MOD-09/MOD-07.

### 4.6 Integration points
- **Reads:** biomass/latest-weight read-model (MOD-04); latest water reading (MOD-06).
- **Emits:** `FeedingLogged` (→ MOD-07 FCR), `LowStock` (→ MOD-09), optional `FeedCostIncurred`
  (→ MOD-08).
- **Consumes:** feedings arriving via `POST /sync` (MOD-12) apply the same deduction logic.

### 4.7 Contract impact
CON-018 (log feeding), CON-018a (feed plan), CON-022/023 (inventory items), CON-024 (inventory txn)
already defined. No new endpoints/schemas required. (BW% table config may later warrant a config
endpoint; note as `CON-049` if the owner UI needs to edit it via API — not required for MVP compute.)

### 4.8 Testing notes
Unit: quota math across BW% bands (AC-071), no-sampling behavior (AC-072), temp/DO factor (AC-073),
feed-type mismatch (AC-075), low-stock single-fire (AC-079), reconciliation (AC-080). Integration:
log feeding → deduction → low-stock happy path + non-member denied (AC-078) + offline-sync deduction
with discrepancy (AC-076). Money-as-minor-units (AC-082).

## 5. Acceptance criteria

- **AC-071** — *Given* a batch with a latest sampling weight and a configured BW% band, *When* the
  feed plan is requested, *Then* the quota = biomass × BW% band, split by feed type (floating vs
  sinking). — parent FR-016, FR-018
- **AC-072** — *Given* a species with no sampling yet, *When* the feed plan is requested, *Then* it
  returns `SAMPLING_REQUIRED` and does not fabricate a quota. — parent FR-016
- **AC-073** — *Given* the latest DO below the low threshold (or temperature out of band), *When*
  the plan is computed, *Then* the quota is reduced/skipped with an explicit reason. — parent FR-017
- **AC-074** — *Given* a feeding log, *When* it is saved, *Then* the matching inventory item's
  quantity is atomically decremented by `qty_kg`. — parent FR-020
- **AC-075** — *Given* a feeding logged against an inventory item of a mismatched feed type, *When*
  saved, *Then* it is rejected/flagged (`FEED_TYPE_MISMATCH`). — parent FR-020
- **AC-076** — *Given* a feeding logged offline, *When* it later syncs and stock is insufficient,
  *Then* the feeding is recorded and a reconciliation discrepancy is flagged (no data loss). —
  parent FR-020, NFR-001
- **AC-077** — *Given* a check-tray observation (`LEFTOVER`/`EMPTY`/`NORMAL`), *When* recorded,
  *Then* it is stored and can nudge subsequent quota guidance. — parent FR-021
- **AC-078** — *Given* a user not a member of project P, *When* they read/write P's inventory, *Then*
  it is denied (403/404). — parent FR-042, NFR-011
- **AC-079** — *Given* a deduction that crosses the low-stock threshold, *When* it commits, *Then* a
  single `LowStock` alert is emitted (via MOD-09), not one per subsequent deduction. — parent FR-043
- **AC-080** — *Given* an item's receipts and deductions, *When* reconciliation runs, *Then*
  `quantity == Σreceipts − Σdeductions`, and any mismatch is flagged. — parent FR-044
- **AC-081** — *Given* configured floating/sinking schedules, *When* a reminder time arrives, *Then*
  a feeding reminder is delivered to the worker for that feed type. — parent FR-019
- **AC-082** — *Given* an inventory receipt cost, *When* stored, *Then* it is persisted as integer
  minor units/decimal (never float) in the project currency. — parent NFR-015

## 6. Implementation & done

### 6.1 Definition of done
- [ ] All ACs (AC-071…AC-082) tested, including scoped negative (AC-078), offline-sync discrepancy
  (AC-076), and low-stock single-fire (AC-079).
- [ ] Integration test: feed plan → log feeding → deduction → low-stock happy path + one failure
  (mismatch or non-member).
- [ ] Migration(s) reversible; `synchronize:false`; money per NFR-015; no secrets.
- [ ] Lint + type-check + tests green; diff self-contained; contract unchanged (or `CON-049` added
  with matrix update for BW% config).
- [ ] Matrix + tracker updated; human review passed.

### 6.2 Implementation notes
Keep `FeedQuotaCalculator` and `TempDoAdjuster` pure and heavily unit-tested — they encode the core
value (feed discipline). Do the feeding-insert + inventory-decrement + txn-insert in one transaction.
Make the deduction path identical whether a feeding arrives via the online endpoint (CON-018) or via
`POST /sync` (MOD-12), so offline and online produce the same result.

### 6.3 Risks / caveats
- Reading two upstream read-models (biomass, water) for the quota — treat missing/stale inputs
  explicitly (no sampling → SAMPLING_REQUIRED; stale DO → conservative reduction), never silently
  guess.
- Negative stock from offline over-deduction is a real possibility; the discrepancy flag + reconcile
  query are the safety net (AC-076/080).

### 6.4 Open questions
- BW% table default bands per species/stage — source values (advisory). (Default: seed sensible
  declining bands fry→grow-out; owner-tunable.)
- Are feeding reminders authoritative on the server (push) or on the mobile device (local, offline)?
  (Default: **both** — mobile local reminders for reliability offline, server push as backup.)

---

*MOD-05 detail — Fish Farm Management System. Phase 5 artifact. ACs: AC-071…AC-082.*
