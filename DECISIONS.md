# Architecture Decisions — Fish Farm Management System (FMS)

> Version 1.0 · 2026-07-02 · Each ADR records Status, Context (the driving `FR-`/`NFR-`),
> Decision, Alternatives rejected (+ why), and Consequences. ADR IDs are immutable. Many decisions
> are pre-committed by `CLAUDE.md` (the project constitution) — those ADRs record the rationale
> and are marked **Accepted (constitution)**. Changing an Accepted ADR is a Phase-7 guardrail:
> stop and ask a human.

---

## ADR-001 — Modular monolith with Clean Architecture (per-module layering)
- **Status:** Accepted (constitution)
- **Context:** NFR-006 (framework-free domain), NFR-010 (single low-cost deployment), NFR-011
  (central isolation). One owner, one modest budget, but many bounded concerns (feed, water,
  finance…).
- **Decision:** A single NestJS deployment composed of modules, each with
  `presentation → application → domain` + `infrastructure → domain`. Dependencies point inward
  only; the domain imports no frameworks. Be pragmatic about ceremony per module to protect MVP
  timelines.
- **Alternatives rejected:** *Microservices* — operational cost and complexity unjustified for one
  owner/portfolio; *layered-but-not-clean* — would let TypeORM/HTTP leak into business logic,
  violating NFR-006 and making later extraction hard.
- **Consequences:** Clear seams enable later extraction of hot modules (see ADR-019); upfront
  mapping ceremony (domain↔persistence) is the cost; enforced by code review against CLAUDE.md.

## ADR-002 — Multi-repo layout with a spec hub (AIDLC)
- **Status:** Accepted · *(ADR-017 briefly superseded this on 2026-07-05, then was **reverted** the
  same day by human decision — separate repos retained. See ADR-017.)*
- **Context:** The generator's non-negotiable folder rule; specs are the source of truth, code is
  a build artifact.
- **Decision:** Four repos under a `fish-farm/` parent: `fish-farm-context-files` (hub with all
  specs + contracts) and `fish-farm-{backend,web,mobile-app}` (code + only `.cursorrules` +
  `README.md`). The hub must be in the agent's context whenever code is generated.
- **Alternatives rejected:** *Single mono-repo with docs inline* — blurs source-of-truth and lets
  code and specs drift in the same commit; *docs inside each code repo* — duplicates and desyncs.
- **Consequences:** Coding agents always reference the hub; contract changes propagate from one
  place; requires a multi-root workspace or submodule so each code repo sees the hub.

## ADR-003 — Contract-first API with OpenAPI as the single source of truth
- **Status:** Accepted
- **Context:** FR-001…FR-061 delivered across backend + web + mobile; the surfaces must not drift.
- **Decision:** `contracts/openapi.yaml` is authoritative. The backend implements it (validated by
  contract tests); web + mobile generate typed clients from it. Endpoints are tagged with `CON-`
  ids tracing to `FR-`.
- **Alternatives rejected:** *Code-first (generate spec from NestJS)* — makes the contract a side
  effect of one surface, so clients chase the backend; *hand-written clients* — drift and
  duplication.
- **Consequences:** A contract change is a deliberate, reviewed act (Phase-7 guardrail) that
  regenerates clients; adds a generation step to CI.

## ADR-004 — REST/JSON over HTTPS (not GraphQL)
- **Status:** Accepted
- **Context:** FR-003 (path-scoped resources aid isolation), NFR-003/004 (low-end clients,
  intermittent networks), offline sync.
- **Decision:** RESTful JSON, resources nested under `/projects/{projectId}/…`; a dedicated
  `POST /sync` batch endpoint for offline replay with idempotency keys.
- **Alternatives rejected:** *GraphQL* — flexible querying is low-value here, complicates
  project-scope enforcement and offline batching, and adds client weight the worker phone can't
  spare.
- **Consequences:** Scope is explicit in the URL and enforceable by one guard; simple caching and
  offline batching; some endpoint proliferation, managed by the contract.

## ADR-005 — JWT sessions + per-project membership authorization (not global RBAC)
- **Status:** Accepted (constitution)
- **Context:** FR-001/002/003/004, NFR-005, BR-003. The same person may be Owner of A and have no
  access to B.
- **Decision:** Authenticate with JWT (short-lived access + refresh); the token carries only the
  user id. Authorization is resolved from `ProjectMembership` **per project per request** — role
  (`OWNER`/`WORKER`/`PARTNER`) is never asserted by the client.
- **Alternatives rejected:** *Global role on the user/token* — cannot express per-project roles and
  invites privilege bugs; *session cookies only* — awkward for the RN client and offline flows.
- **Consequences:** A single guard resolves membership + role for every request; token compromise
  can't grant cross-project access because scope is server-resolved.

## ADR-006 — Tenant isolation via project-scope guard + scoped-repository base (data-access layer)
- **Status:** Accepted (constitution) · **P1 security invariant**
- **Context:** NFR-011, FR-003, BR-002/003, RISK-001 (cross-project leakage = severe breach).
- **Decision:** A central guard resolves the caller's memberships and sets a request-scoped tenant
  context. A scoped-repository base automatically injects `project_id = :ctxProject` into every
  project-owned query. **No endpoint queries project data unscoped.** A non-member request returns
  403/404 uniformly (never leaks another project's existence). Built in the foundation before any
  project-owned table is queried (build order E0-S7).
- **Alternatives rejected:** *Per-endpoint manual `where project_id` filters* — one missed filter
  is a breach; *Postgres RLS only* — valuable defense-in-depth but harder to test/trace in the app
  and doesn't cover derived reachability via pond/batch cleanly (may be added later as a second
  layer).
- **Consequences:** Uniform, testable isolation; a mandatory negative test per project-owned unit;
  every project-owned table must carry an indexed `project_id` (even when reachable via pond/batch)
  to keep the filter cheap and uniform.

## ADR-007 — TypeORM Data Mapper in infrastructure; migrations only
- **Status:** Accepted (constitution)
- **Context:** NFR-006 (domain purity), CLAUDE.md invariants #3/#4.
- **Decision:** TypeORM entity classes/decorators live only in `infrastructure/persistence` as
  persistence models, mapped to/from pure domain entities by explicit mappers. **Never** put
  `@Entity`/`@Column` on a domain class; **never** use Active Record. `synchronize:false` always;
  every schema change ships a reversible migration.
- **Alternatives rejected:** *Active Record / decorated domain entities* — couples business logic
  to the ORM, violating NFR-006; *auto-synchronize* — unsafe, non-reversible schema drift.
- **Consequences:** Mapping boilerplate is the cost; the domain stays testable without a database;
  schema evolution is explicit and reviewable.

## ADR-008 — PostgreSQL as the single data store
- **Status:** Accepted (constitution)
- **Context:** Relational, project-scoped data with strong integrity needs (finance, isolation),
  time-series-ish water readings, NFR-010 (one modest deployment).
- **Decision:** PostgreSQL for all operational + financial data; `project_id` indexed on every
  project-owned table; UTC timestamps; `decimal`/integer minor units for money.
- **Alternatives rejected:** *NoSQL document store* — weak for cross-entity integrity and financial
  correctness; *separate time-series DB for water* — premature; Postgres handles v1 volumes, and a
  TSDB can be added in Phase 3 if sensor ingestion scales.
- **Consequences:** One database to back up (NFR-008); familiar tooling; potential future
  partitioning for `water_reading` if sensor volume grows.

## ADR-009 — Shared-vs-duplicated code policy
- **Status:** Accepted
- **Context:** NFR-002/016 (identical Bangla calendar on web+mobile), NFR-006, ADR-003.
- **Decision:** Share **contracts + generated clients**, **`packages/calendar`**, and
  **`packages/shared`** (DTO/type definitions, domain-event contracts, GLOSSARY enums). Do **not**
  share UI, persistence, or framework wiring across surfaces. Backend cross-cutting concerns live
  in a `shared-kernel`, used by every module but not exported to clients.
- **Alternatives rejected:** *Share UI component code between web and RN* — different runtimes,
  false economy; *duplicate the calendar per surface* — guarantees divergence and breaks
  NFR-016/anchor tests.
- **Consequences:** One calendar implementation, tested once; contract is the integration seam;
  shared packages need versioning discipline.

## ADR-010 — Offline-first mobile: local DB + sync queue + conflict resolution
- **Status:** Accepted (constitution)
- **Context:** NFR-001, FR-034, BR-004, RISK-004; the make-or-break requirement.
- **Decision:** WatermelonDB as the local source of truth; an ordered **sync queue** of mutations
  with idempotent `clientMutationId`; `POST /sync` batches replay to the server. Conflict policy:
  **append-only logs never conflict** (feedings, mortalities, readings, task logs are additive);
  for the rare mutable record, **server-authoritative last-write-wins** with the losing write
  preserved in the audit trail; unresolved cases set `sync_state=CONFLICT` for review.
- **Alternatives rejected:** *Naive "POST when online"* — loses data on flaky networks; *full CRDT*
  — overkill given the additive nature of worker logs and one worker per project.
- **Consequences:** Zero-loss offline logging; additive modeling favored in the schema; sync engine
  is a first-class, tested component.
- **Amendment (2026-07-07, ERD-alignment pass):** the offline-syncable entity set is extended with
  **SAMPLING** and **POND_ACTION** (both worker-logged pond-side; both additive, so no new conflict
  surface). `SyncRequest.entity` enum, `CreateSampling.clientMutationId`, and the
  `client_mutation_id` columns in `ERD.md` updated accordingly.

## ADR-011 — Custom Bangla calendar package (no Intl/ICU)
- **Status:** Accepted (constitution)
- **Context:** FR-057…FR-061, NFR-016, CLAUDE.md invariant #6.
- **Decision:** `packages/calendar` implements Bangladesh-revised (2019) rules algorithmically
  (Pohela Boishakh = 14 Apr; months 1–6 = 31d, 7–10 = 30d, Falgun = 29/30 in Gregorian leap,
  Choitro = 30d; year = Gregorian − 593/−594; six ritu). Verified against fixed anchors. Bengali
  numerals + ritu helpers included. Identical on web + mobile + backend.
- **Alternatives rejected:** *`Intl`/ICU Bengali calendar* — implements the West Bengal/sidereal
  calendar, giving wrong dates; *per-surface reimplementation* — divergence risk.
- **Consequences:** One tested source of Bangla dates; anchor tests are a required deliverable;
  a leap-year edge (Falgun 29→30) must be covered.

## ADR-012 — Camera via per-site media server (RTSP→HLS/WebRTC); live-only in MVP
- **Status:** Accepted
- **Context:** FR-049/050, MON-1/2, RISK-006; browsers cannot embed RTSP.
- **Decision:** A per-site media server (MediaMTX/ffmpeg) transcodes RTSP→HLS/WebRTC; the web
  dashboard consumes each project's own stream URL from its `Camera` config. **Live-only** in MVP;
  recording/clips deferred to a later phase.
- **Alternatives rejected:** *Embed RTSP directly* — unsupported by browsers; *cloud VMS* — cost
  and complexity beyond NFR-010 for MVP.
- **Consequences:** Camera is its own deployable unit, isolated from the app tier; graceful
  degradation when a site camera is down (NFR-007); recording is a clean later add.

## ADR-013 — Money as integer minor units / decimal, currency per project
- **Status:** Accepted (constitution)
- **Context:** NFR-015, FR-045…FR-048, CLAUDE.md §5.
- **Decision:** Store money as integer minor units (poisha) or Postgres `decimal`; never float.
  Currency is a per-project setting (BDT default). Formatting to Bengali numerals is a shared
  helper.
- **Alternatives rejected:** *Floating-point money* — rounding errors corrupt finance/ROI; *global
  single currency* — the model allows per-project currency at negligible cost.
- **Consequences:** Correct financial math; explicit currency handling in finance use-cases.

## ADR-014 — Notifications behind a channel port; FCM push MVP, SMS/WhatsApp Phase 2 stubs
- **Status:** Accepted
- **Context:** FR-052/053/054, NFR-013, NOTIF-1/2/3.
- **Decision:** A `NotificationChannel` port with a FCM push adapter (MVP). SMS/WhatsApp adapters
  are Phase-2 implementations of the same port (stubbed in v1). Critical alerts select the most
  reliable available channel and reach the owner even if the app is closed; retry/fallback on
  failure.
- **Alternatives rejected:** *Hard-wire FCM* — makes the Phase-2 channel add invasive; *build
  SMS/WhatsApp now* — out of MVP scope and gateway cost.
- **Consequences:** Channel choice is pluggable; NFR-013 SLA measured; Phase-2 work is additive.

## ADR-015 — In-process domain events for cross-module reactions
- **Status:** Accepted
- **Context:** Cross-module effects (a water reading breaching threshold must raise an alert; a
  feeding must deduct inventory; a mortality must update survival) without coupling modules.
- **Decision:** Modules publish `PascalCase` past-tense domain events (e.g. `WaterThresholdBreached`,
  `FeedingLogged`, `MortalityRecorded`) on an in-process event bus; other modules subscribe.
  Event contracts live in `packages/shared`.
- **Alternatives rejected:** *Direct cross-module service calls* — couples modules and blocks
  extraction; *external message broker* — operational overhead unjustified at MVP scale.
- **Consequences:** Loose coupling and clean seams for later extraction (ADR-019 path); events must
  be well-named and versioned; eventual consistency for cross-module reactions is acceptable here.

## ADR-016 — UUID v4 identifiers
- **Status:** Accepted (constitution)
- **Context:** CLAUDE.md §5; offline id generation on mobile before sync.
- **Decision:** All entity PKs are UUID v4; the mobile client can mint ids offline, enabling
  idempotent sync without server round-trips.
- **Alternatives rejected:** *Auto-increment integers* — cannot be generated offline and leak
  volume/ordering; *UUID v7* — acceptable later for index locality, not required for v1.
- **Consequences:** Offline-generated ids merge cleanly; slightly larger indexes (acceptable).

## ADR-017 — Single monorepo workspace  ~~(supersedes ADR-002)~~  **[REVERTED]**
- **Status:** **Rejected / Reverted 2026-07-05** (proposed and accepted, then reversed the same day
  by human decision). **ADR-002 (separate multi-repo) stands.** Retained for history — do not act on
  this ADR. ID kept immutable per the ID rule.
- **Context (why it was proposed):** OI-1 (hosting of `packages/calendar` + `packages/shared`). A
  monorepo would give the shared packages one home and keep the Bangla calendar byte-identical
  across surfaces (NFR-016).
- **Why reverted:** the owner elected to keep **separate repositories** (the ADR-002 four-repo
  layout). OI-1 is instead resolved by hosting shared packages in **`fish-farm-backend/packages/*`**
  and publishing them to the web + mobile clients (the original documented default). This keeps the
  4-repo topology, CI-per-repo, and the spec-hub model intact.
- **Net effect on the specs:** all monorepo edits were rolled back — ADR-002 reinstated; CLAUDE.md
  §4 and TECHNICAL_SPECIFICATION §3 describe the four-repo layout with `packages/*` under the
  backend; the three `.cursorrules` point back at `../fish-farm-context-files/`; **TASK-051** was
  repurposed from "monorepo bootstrap" to "scaffold the shared `packages/*` hosting + publishing
  (OI-1)". No invariant, contract, or module boundary ever changed.

## ADR-018 — Localization & external-provider defaults (currency, money format, land unit, weather)
- **Status:** Accepted (2026-07-06, human decision) — resolves OI-4, OI-5 and BRD §14 Q5.
- **Context:** Several deferred choices gated finance, reporting, ponds, and the weather widget:
  mixed-currency handling (OI-4), the confirmed land unit + BDT formatting (BRD §14 Q5), and the
  weather provider (OI-5).
- **Decision:**
  - **Currency — single BDT.** Every project uses **BDT**; there is **no multi-currency and no FX**.
    The portfolio roll-up (FR-047, CON-035/CON-034) is a single-currency sum — no per-currency
    subtotals. `currency` stays on the model (default `BDT`) for forward-compatibility but is not a
    user choice in v1. *(This closes OI-4: the "per-currency subtotals" branch is dropped.)*
  - **Money format — South-Asian.** Display uses **lakh/crore grouping** (e.g. `১,২৩,৪৫৬`), the
    **৳** symbol, and **Bengali numerals** in the worker app; the owner UI shows Bengali numerals
    (dual where dates are dual). Storage is unchanged: integer minor units (poisha) / `decimal`,
    never float (ADR-013). Formatting is a `packages/shared` helper (not `Intl`).
  - **Land unit — Bigha default.** `landUnit` defaults to **`BIGHA`** (enum keeps `DECIMAL`/`KATHA`/
    `BIGHA` selectable per project). Stocking-density advisories (FR-015) compute **count ÷ area in
    the project's unit**; the seeded per-species sane-ranges must be **calibrated to bigha** (follow-up
    on TASK-018/019 — ranges previously assumed decimal; 1 bigha ≈ 33 decimal, region-dependent).
  - **Weather provider — OpenWeather.** The weather adapter (FR-051, CON-037, TASK-036) uses
    **OpenWeather**, keyed to site lat/long, behind the existing cache + circuit breaker (graceful
    degradation, NFR-007). API key via env (NFR-005). *(Closes OI-5.)*
- **Alternatives rejected:** *Multi-currency + FX* — no second currency exists; pure overhead.
  *International thousands grouping* — less locally idiomatic for the owner/worker. *Decimal/Katha
  default* — owner confirmed bigha. *BD Met Dept / Open-Meteo* — OpenWeather is better-documented with
  a usable free tier; Open-Meteo retained as a noted fallback if key/quota becomes an issue.
- **Consequences:** finance/ROI math and reports assume one currency (simpler); a money-format helper
  + a land-unit-aware density helper are added to `packages/shared`; **TASK-018/019 must reseed
  density ranges in bigha**; TASK-036 targets OpenWeather; TASK-033/034/038 drop any per-currency
  logic. No change to storage, isolation, or the contract beyond the `landUnit` default.

---

## ADR-020 — Worker app runs on Expo (SDK 57, CNG) rather than bare React Native

- **Status:** Accepted (2026-08-23) — human override in chat during the TASK-042 scaffold.
- **Context:** ADR-003/TECHNICAL_SPECIFICATION §2 targeted **bare RN 0.74.x** for the worker app.
  During scaffolding the human directed: *"I want to use latest Expo and latest React Native."*
  npm's RN `latest` (0.87.0) is not yet carried by any Expo SDK, so "latest of both" resolves to the
  newest SDK plus the newest RN that SDK supports.
- **Decision:**
  - **Expo SDK 57** (`expo ~57.0.15`) with **React Native 0.86.2** and React 19.2 — the newest RN
    pairing Expo supports. Expo SDK 57 is **New-Architecture-only**.
  - **Continuous Native Generation (CNG):** `android/` is generated by `expo prebuild` from
    `app.json` and is **not committed**. Android 9+/API 28 and compile/target 36 are pinned through
    `expo-build-properties`, so the NFR-003 low-end-Android target is unchanged.
  - **WatermelonDB stays the local source of truth** (ADR-010, NFR-001), on its **async adapter**
    (`jsi: false`) reached through React Native's TurboModule interop layer. Its **JSI adapter is
    not usable** on this stack: the community Expo plugin
    (`@morrowdigital/watermelondb-expo-plugin`) injects `JSIModulePackage` into
    `MainApplication.kt`, an API the New Architecture removed, and the Kotlin compile fails — so the
    plugin is not installed. The offline queue, conflict policy and sync contract (CON-040) are
    untouched by this decision.
  - **Navigation stays `@react-navigation/native-stack`, not expo-router**, so the file layout in
    MOD-12 §4.2 (`src/app` = shell/nav/providers) holds; expo-router would claim `src/app` as a
    route tree.
  - **Bangla fonts are bundled** (`@expo-google-fonts/noto-sans-bengali`) instead of inherited from
    the device — a low-end Android may carry no Bangla face at all (NFR-002).
  - **Offline UUID v4 comes from `expo-crypto`** (`randomUUID`) instead of `uuid` +
    `react-native-get-random-values`; ADR-016 (ids minted offline) is unchanged.
- **Alternatives rejected:** *Bare RN 0.74.x as originally specced* — overridden by the human.
  *Expo Go for development* — impossible: WatermelonDB is a native module, so a **dev client** build
  is required. *expo-router* — collides with the specced folder layout for no gain on a 10-screen
  flat stack. *Latest RN (0.87.0) with Expo* — unsupported pairing; would break expo-modules.
- **Consequences:**
  - Dev flow becomes `expo prebuild` → `expo run:android` with a **dev client**; Expo Go is not
    usable. `android/` is generated, so native edits must be expressed as config plugins.
  - **Verified at scaffold time (2026-08-23) on an Android emulator (API 36, bridgeless
    `fabric:true`):** the app builds (`assembleDebug`) and boots, WatermelonDB creates
    `fms-worker.db` + WAL in the app data dir, and a queue query runs clean. Bangla renders in the
    bundled Noto Sans Bengali and the date comes out of `@fish-farm/calendar` (৮ ভাদ্র ১৪৩৩ · শরৎ).
  - **Open risk:** React Native Directory still lists **WatermelonDB as "untested on the New
    Architecture"** (surfaced by `expo-doctor`, deliberately not silenced). Boot + query working is
    not the same as the offline guarantee: TASK-042 must still prove offline write → app restart →
    sync with no loss (AC-128/129/130/137). If WatermelonDB proves unviable under the New
    Architecture, that is a **guardrail-level** decision (it would change ADR-010's local store) and
    returns to the human. Whether the JSI fast path is needed for the NFR-003 cold-start budget is a
    separate, later question.
  - FCM push moves to `expo-notifications`/config-plugin wiring when MOD-09's mobile slice lands;
    `@react-native-firebase/messaging` is no longer the assumed client (no code depends on it yet).
  - Web and backend surfaces are unaffected; the API contract and shared packages are unchanged.

---

*DECISIONS.md — Fish Farm Management System. Phase 3 artifact. IDs: ADR-001…ADR-020 (ADR-017
reverted; ADR-019 unassigned — two older ADRs reference it as a future "extract hot modules"
decision; ADR-002 governs the repo layout; ADR-020 amends the mobile stack). Constitution-locked
ADRs require human approval to change.*
