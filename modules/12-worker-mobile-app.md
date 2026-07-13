# MOD-12 — Worker Mobile App: Tasks, Daily Log & Offline Sync

**Project:** Fish Farm Management System (FMS) | **Surface:** mobile, backend | **Version:** 1.0 | **Status:** Not Started
**Owns features:** FT-063, FT-064, FT-065, FT-066, FT-067, FT-068, FT-069
**Contract refs:** CON-040, CON-029, CON-030, CON-031
**Dependencies:** MOD-01, MOD-02, MOD-04, MOD-05, MOD-06, MOD-07, MOD-09, MOD-11

---

## 1. Overview

**Purpose.** The make-or-break worker surface: an **offline-first, Bangla, ≤2-minute** app that lets
the on-site worker log daily operations and complete tasks with no connectivity, plus the server
**sync** endpoint that reconciles those offline writes safely. If the worker won't use it, the whole
system fails (RISK-003); if sync loses data, trust is gone (NFR-001).

**Scope.** The React Native app shell (single-project binding, Bangla i18n, icon-first); the offline
local store + sync queue engine; the backend `POST /sync` endpoint with idempotent, conflict-safe
reconciliation; the icon-driven Bangla Daily Log; the recurring task scheduler + completion (with
proof photo) and missed-task detection; the mobile camera view.

**Position in architecture.** A client surface (mobile) plus a thin backend sync/task slice. It does
not own operational domain logic — offline writes replay through the **same domain use-cases** as the
online endpoints (feeding→MOD-05 deduction, mortality/sampling→MOD-07, water→MOD-06). Tasks are its
own small domain here; missed tasks emit `MissedTask` (→ MOD-09).

**Dependencies.** MOD-01 (sync transaction, audit, events), MOD-02 (auth, worker membership), MOD-04/
05/06/07 (the domains it writes into), MOD-09 (missed-task alert), MOD-11 (Bangla dates/numerals).

## 2. Functional details

### 2.1 Core functions
- **F1 — Worker mobile app shell (FT-063).** RN scaffold; navigation; **binding to the worker's one
  active project**; Bangla i18n (react-i18next) + Bengali numerals + Bangla dates (MOD-11);
  icon-first, large-touch-target UI. NFR-002/003/009.
- **F2 — Offline store & sync queue engine (FT-064).** WatermelonDB local DB is the **source of
  truth**; writes are optimistic; an **ordered mutation queue** carries `sync_state`
  (`PENDING/SYNCED/CONFLICT/FAILED`); ids are UUID v4 **minted offline**; the queue survives app
  restart. FR-034, NFR-001.
- **F3 — Sync endpoint & conflict resolution (FT-065).** `POST /sync` replays a batch; **idempotent
  by `clientMutationId`**; append-only logs never conflict; the rare mutable record resolves
  **server-authoritative last-write-wins** with the losing value preserved in the audit trail;
  returns a per-mutation result. CON-040.
- **F4 — Icon-driven Bangla Daily Log (FT-066).** A ≤2-minute composite form: feed given, mortality,
  water observation — offline, with optional photo. FR-033, NFR-009.
- **F5 — Recurring task scheduler & reminders (FT-067).** Owner defines recurring tasks (chain drag,
  liming, water exchange…); the worker sees due tasks; a due task passing uncompleted emits
  `MissedTask` (→ MOD-09). CON-029/030. FR-031.
- **F6 — Task completion with proof photo (FT-068).** Mark a task complete offline with timestamp +
  optional photo; syncs later. CON-031. FR-032.
- **F7 — Mobile camera view (FT-069).** View the site camera stream (HLS/WebRTC). FR-049. (P2)

### 2.2 Sub-modules
- **mobile-shell** (mobile) — scaffold, nav, i18n, theming, single-project binding.
- **offline-engine** (mobile) — WatermelonDB models, mutation queue, sync client, conflict UI.
- **sync-api** (backend) — `POST /sync`, idempotency, dispatch to domain use-cases, conflict policy.
- **tasks** (backend + mobile) — task definitions, due/missed detection, task logs.

### 2.3 User interactions
Worker (mobile): open app (already scoped to one project) → log feed/mortality/water offline →
complete tasks with photo → raise emergency → view camera → see sync status. All Bangla, icon-first.

### 2.4 Business rules & validation
- **R1** The app is bound to the worker's **single active project**; **no other project's data is
  ever stored or shown locally** (client-side isolation).
- **R2** All domain writes (feeding, mortality, water reading, task log, water event) go through the
  **offline queue** and then `POST /sync`; the UI is optimistic against the local DB.
- **R3** Ids are **UUID v4 minted offline** (ADR-016), enabling idempotent sync without server
  round-trips.
- **R4** Sync is **idempotent by `clientMutationId`**; replaying a batch never duplicates.
- **R5** **Append-only worker logs never conflict.** Only rare mutable records use
  server-authoritative LWW, with the losing value written to the audit trail; unresolved cases are
  surfaced as `CONFLICT`.
- **R6** Offline writes replay through the **same server domain use-cases** as online — so a synced
  feeding deducts inventory (MOD-05), a synced water reading evaluates thresholds (MOD-06), etc.
- **R7** The queue and any pending writes **survive app restart** (persisted).
- **R8** UI is **Bangla-only** with Bengali numerals and Bangla dates (MOD-11), icon-driven, daily
  log completable in **≤ 2 min** (NFR-009); cold start ≤ 3 s on ~2 GB Android (NFR-003).
- **R9** Photos are compressed before queueing; uploaded on sync.
- **R10** A due task passing its window uncompleted emits `MissedTask` (server-detected) → MOD-09.

### 2.5 Edge cases
1. **Logged offline for hours** → queued; on reconnect syncs in order; no loss (NFR-001).
2. **Retry after partial failure** → idempotent by `clientMutationId`; no duplicates (R4).
3. **Mutable-record conflict** → server LWW; loser to audit; `CONFLICT` surfaced for the rare case.
4. **Synced feeding when stock now insufficient** → feeding recorded + discrepancy flagged (MOD-05),
   not lost.
5. **Late-synced critical water reading** → breach still raised, flagged delayed (MOD-06).
6. **App killed mid-entry** → pending writes survive restart (R7).
7. **Worker reassigned to another project** → prior project's local data is cleared; no residue (R1).
8. **Partial batch sync** → per-mutation result; failed stay queued for retry (R4).
9. **Emergency raised while fully offline** → queued and fired on reconnect; the worker is told it
   will send when online — **a real constraint** (emergency needs connectivity to reach the owner);
   see risks/open questions.
10. **Large photo on a low-end device** → compressed before queueing to protect performance/storage.

### 2.6 Error states
| Trigger | Where | Message (Bangla in UI) | Recovery |
|---|---|---|---|
| No connectivity | mobile | "অফলাইন — সংরক্ষিত, পরে সিংক হবে" ("Offline — saved, will sync later") | Auto-sync on reconnect. |
| Sync mutation failed | mobile/backend | item marked `FAILED` | Retry with backoff. |
| Mutation conflict | backend→mobile | item marked `CONFLICT` | Server value applied; worker informed. |
| Auth expired during sync | backend | `UNAUTHENTICATED`/401 | Re-login; queue preserved. |
| Write outside the bound project | mobile/backend | `FORBIDDEN`/403 | Blocked (should not occur; single-project). |

## 3. Non-functional (surfaces: mobile, backend)
- **NFR-001 (offline-first)** — 100% of daily-log actions captured offline; zero loss on reconnect;
  queue survives restart (AC-128/129/130/137).
- **NFR-002 (localization)** — Bangla-only + Bengali numerals + Bangla dates via MOD-11 (AC-133/138).
- **NFR-003 (performance)** — cold start ≤ 3 s on ~2 GB Android over 2G (AC-133).
- **NFR-009 (usability)** — daily log ≤ 2 min, ≤ ~10 taps, icon-driven (AC-133).
- **NFR-011 (isolation)** — single-project binding; no cross-project local data (AC-127/139).
- **NFR-013 (reliability)** — missed-task and (connectivity-permitting) emergency alerts via MOD-09
  (AC-135).

## 4. Technical details

### 4.1 Components
Mobile: RN app (`AppShell`, `i18n`, `Theme` from design-tokens), WatermelonDB models + `SyncEngine`
(mutation queue, `SyncClient` calling CON-040, conflict handler), screens (`DailyLog`, `Tasks`,
`Feeding`, `WaterReading`, `Emergency`, `Camera`, `SyncStatus`). Backend: `SyncModule`
(`SyncController` CON-040, `MutationDispatcher` → domain use-cases, idempotency store),
`TasksModule` (`TasksController` CON-029/030, `TaskLogController` CON-031, `MissedTaskScheduler`).

### 4.2 Files / folders
```
# repo: fish-farm-mobile-app
src/app/                shell, navigation, providers
src/i18n/               bn.json (Bangla strings)
src/db/                 watermelon models, schema, migrations
src/sync/               mutation-queue.ts, sync-engine.ts, sync-client.ts, conflict.ts
src/screens/            DailyLog, Tasks, Feeding, WaterReading, Emergency, Camera, SyncStatus
src/lib/                api-client (generated from openapi), calendar (packages/calendar)

# repo: fish-farm-backend
src/modules/sync/
  application/     apply-mutation.usecase.ts (dispatch to feed/health/water use-cases), idempotency.store.ts
  presentation/    sync.controller.ts (CON-040), dtos
src/modules/tasks/
  domain/          task.entity.ts, task-log.entity.ts, recurrence.vo.ts, events (MissedTask)
  application/     create-task.usecase.ts, complete-task.usecase.ts, missed-task.scheduler.ts
  infrastructure/  persistence (task.model.ts, task-log.model.ts + mappers)
  presentation/    tasks.controller.ts (CON-029/030), task-logs.controller.ts (CON-031), dtos
migrations/        00xx_tasks_tasklogs.ts, 00xx_sync_idempotency.ts
```

### 4.3 State and data
Mobile (WatermelonDB): local mirrors of the worker's project data + a `mutation_queue`
(clientMutationId, entity, op, payload, sync_state, created_at). Backend: `task` (id, project_id
[idx], pond_id nullable, title, recurrence_days, next_due_on), `task_log` (id, project_id [idx],
task_id [idx], completed_at, photo_url), `sync_mutation` (clientMutationId unique — idempotency).

### 4.4 Key logic
- **Offline write:** create local row + enqueue mutation (`PENDING`), UUID v4 id.
- **Sync:** `SyncEngine` batches `PENDING` → `POST /sync`; backend dispatches each mutation to the
  matching domain use-case inside a transaction, keyed by `clientMutationId` (idempotent); returns
  per-mutation `SYNCED/CONFLICT/FAILED`; client updates `sync_state`.
- **Missed task:** scheduler scans due tasks past their window → emit `MissedTask` (→ MOD-09).
- **Reassignment:** on membership change, purge local project data.

### 4.5 Reusable / shared patterns
The `MutationDispatcher` maps queued mutations to existing domain use-cases — so offline and online
share one code path (no duplicate business logic). The offline-engine + conflict policy (ADR-010) is
the template for any future offline entity. Bangla rendering reuses MOD-11; the API client is
generated from `openapi.yaml`.

### 4.6 Integration points
- **Backend `POST /sync`** dispatches to MOD-05 (feeding→deduction), MOD-06 (water→threshold),
  MOD-07 (mortality/sampling/harvest), MOD-06 (emergency).
- **Emits** `MissedTask` (→ MOD-09); tasks may create `pond_action` (MOD-06) on completion.
- **Consumes** camera config (MOD-10) for the mobile view; Bangla dates (MOD-11); auth (MOD-02).

### 4.7 Contract impact
CON-040 (sync), CON-029/030 (tasks), CON-031 (task logs) already defined. The `SyncRequest`/
`SyncResponse` schemas cover the mutation entities (FEEDING_LOG, MORTALITY, WATER_READING, TASK_LOG,
WATER_EVENT, SAMPLING, POND_ACTION). No new endpoints required; if a new offline entity is added later, extend the
`SyncRequest.entity` enum in `openapi.yaml` (guardrail — affects clients).

### 4.8 Testing notes
The offline path is the required deliverable per CLAUDE.md §7: **write offline → sync → assert no
loss** (AC-128/129). Also required: **idempotent replay** (AC-130), **single-project isolation /
no cross-project local data** (AC-127/139), **shared deduction path on sync** (AC-132), **≤2-min
Bangla daily log** usability check (AC-133), and **missed-task alert** (AC-135). Conflict-resolution
tests cover append-only-never-conflicts + mutable LWW-with-audit (AC-131).

## 5. Acceptance criteria

- **AC-127** — *Given* a worker bound to one project, *When* the app loads, *Then* only that
  project's data is stored/shown locally; no other project's data is present. — parent FR-033, NFR-011
- **AC-128** — *Given* no connectivity, *When* the worker submits a daily log, *Then* it is stored
  locally as `PENDING` and survives an app restart. — parent FR-034, NFR-001
- **AC-129** — *Given* queued offline entries, *When* connectivity returns, *Then* they sync via
  `POST /sync` with no data loss. — parent FR-034, NFR-001
- **AC-130** — *Given* a sync batch retried after a partial failure, *When* replayed, *Then* it is
  idempotent by `clientMutationId` and creates no duplicates. — parent FR-034, NFR-001
- **AC-131** — *Given* append-only logs, *When* synced, *Then* they never conflict; *Given* a rare
  mutable-record conflict, *Then* it resolves server-authoritative (LWW) with the loser preserved in
  the audit trail. — parent FR-034
- **AC-132** — *Given* a feeding logged offline, *When* it syncs, *Then* the server applies the same
  inventory deduction as the online endpoint (MOD-05). — parent FR-034, FR-020
- **AC-133** — *Given* the daily-log screen, *When* a worker completes a log, *Then* it is
  icon-driven, Bangla with Bengali numerals, and completable in ≤ 2 minutes. — parent FR-033, NFR-002, NFR-009
- **AC-134** — *Given* an owner-defined recurring task, *When* it is due, *Then* the worker sees it
  and completing it records a `TaskLog` with timestamp + optional photo. — parent FR-031, FR-032
- **AC-135** — *Given* a due task passing uncompleted, *When* the scheduler runs, *Then* `MissedTask`
  is emitted and an alert is raised via MOD-09. — parent FR-031
- **AC-136** — *Given* a configured camera, *When* the worker opens the camera view, *Then* the site
  stream (HLS/WebRTC) plays. — parent FR-049
- **AC-137** — *Given* a partial sync, *When* it completes, *Then* each mutation returns
  `SYNCED/CONFLICT/FAILED` and failed ones remain queued for retry. — parent FR-034, NFR-001
- **AC-138** — *Given* any date/number in the worker UI, *When* rendered, *Then* it uses Bangla
  dates + Bengali numerals via `packages/calendar` (no `Intl`). — parent FR-058, NFR-002, NFR-016
- **AC-139** — *Given* a worker reassigned to a different project, *When* membership changes, *Then*
  the prior project's local data is cleared (no residue). — parent NFR-011

## 6. Implementation & done

### 6.1 Definition of done
- [ ] All ACs (AC-127…AC-139) tested, including the **offline write→sync→no-loss** path (AC-128/129),
  **idempotent replay** (AC-130), **single-project isolation** (AC-127/139), and **shared deduction
  on sync** (AC-132).
- [ ] Conflict-resolution tests (append-only never conflicts; mutable LWW + audit) pass (AC-131).
- [ ] Missed-task alert path verified (AC-135).
- [ ] Migration(s) reversible; `synchronize:false`; no secrets; Bangla strings complete.
- [ ] Mobile: cold-start and ≤2-min daily-log usability checks pass on a low-end Android profile.
- [ ] Lint + type-check + tests green; diff self-contained; contract unchanged (or `SyncRequest`
  enum extended with matrix update).
- [ ] Matrix + tracker updated; human review passed.

### 6.2 Implementation notes
Make the sync endpoint dispatch to existing domain use-cases (one code path for offline + online).
Persist the mutation queue so it survives restart. Mint UUID v4 ids on-device. Keep the daily log to
the fewest taps possible (icon-first, sensible defaults). Purge local data on reassignment. Generate
the API client from `openapi.yaml`.

### 6.3 Risks / caveats
- **Worker adoption (RISK-003)** rides on this module — invest in the ≤2-min icon-driven Bangla UX;
  usability is a first-class acceptance criterion.
- **Offline emergency (NFR-013 tension):** an emergency raised while fully offline cannot reach the
  owner until connectivity; it queues and fires on reconnect. This is a genuine constraint —
  consider an on-device SMS fallback in a later phase. **Open question / guardrail.**
- Sync conflict policy must be exactly ADR-010; a wrong policy risks silent data loss — the
  append-only modeling minimizes conflicts, but the mutable-LWW-with-audit path must be tested.

### 6.4 Open questions
- **Offline emergency delivery:** is an on-device SMS fallback (worker's phone → owner) desired when
  the app is fully offline? (Default: no in MVP; queue + fire on reconnect; revisit in Phase 2 with
  the SMS/WhatsApp channel.) — **guardrail (safety/reliability).**
- Local data retention on the device (how long to keep synced history offline). (Default: keep a
  rolling window; purge old synced rows to protect low-end storage.)

---

*MOD-12 detail — Fish Farm Management System. Phase 5 artifact. ACs: AC-127…AC-139. Phase 5 complete (12/12).*
