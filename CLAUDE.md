# CLAUDE.md — Agent Operating Guide (Project Constitution)

> This file governs **how** code is written for the Fish Farm Management System (FMS). Every coding agent session reads it first. It is the contract that makes fully agentic, zero-manual-code Construction consistent. **When this file and a prompt conflict, this file wins** unless the human explicitly overrides in chat.

## 0. Source of truth
- **What to build:** `Fish-Farm-Management-System-BRD.md` (v3.1)
- **Work breakdown:** `BACKLOG.md` (TASK-001…TASK-051)
- **How it's structured:** `TECHNICAL_SPECIFICATION.md` (architecture, events, flows), `ERD.md` (data model), `contracts/openapi.yaml` (API)
- This file (`CLAUDE.md`): how to write the code.

If a requirement is ambiguous, **stop and ask the human** — do not invent scope.

## 1. Project in one paragraph
A multi-project, multi-site polyculture aquaculture management system (Bangladesh). A remote owner manages several pond projects, each at its own site with its own worker, finances, inventory, camera, and weather. Some projects are co-owned with partners. **Project is the tenant/isolation boundary.** Backend is a NestJS modular monolith (Clean Architecture); owner web is Next.js; the worker app is React Native (offline-first, Bangla). Data in PostgreSQL via TypeORM (Data Mapper).

## 2. Non-negotiable invariants (NEVER violate)
1. **Tenant isolation:** every query against project-owned data is filtered by `project_id` derived from the caller's membership. No endpoint queries unscoped. A user must never read or write another project's data. This is a security boundary, not a convenience.
2. **Domain purity (Clean Architecture):** the `domain` layer of every module imports **zero** frameworks — no NestJS, no TypeORM, no HTTP. Dependencies point inward only: `presentation → application → domain` and `infrastructure → domain`. Domain never imports outward.
3. **TypeORM = Data Mapper, infrastructure only:** TypeORM entity classes and decorators live in `infrastructure/persistence`. They are *persistence models*, mapped to/from pure domain entities by a mapper. Never put `@Entity`/`@Column` on a domain class. Never use Active Record.
4. **Migrations only:** `synchronize: false` always. Every schema change ships an explicit, reversible TypeORM migration. Never auto-sync.
5. **No secrets in code:** config via environment variables. Never hardcode keys, tokens, passwords, or connection strings.
6. **Bangla calendar = the shared package only:** never use `Intl`/ICU for Bangla dates (wrong calendar). Use `packages/calendar`. See `TECHNICAL_SPECIFICATION.md` (calendar) and ADR-011.
7. **No browser storage in web artifacts/components beyond approved state libs:** persistence is server-side; the RN app uses its local DB + sync queue, not ad-hoc storage.
8. **Tests are part of the unit, not optional.** A unit is not done until its tests pass (see §7).

## 3. Tech stack (locked)
| Layer | Choice |
|---|---|
| Backend | NestJS (TypeScript), modular monolith, Clean Architecture |
| ORM / DB | TypeORM (Data Mapper) + PostgreSQL |
| Owner web | Next.js (TypeScript) |
| Worker app | **Expo SDK 57** + React Native (TypeScript), offline-first, Bangla (ADR-020) |
| Validation | class-validator / zod at the presentation boundary (DTOs) |
| Auth | JWT sessions; membership-based authorization |
| Push | FCM (SMS/WhatsApp adapters are Phase 2 stubs) |
| Tests | Jest (unit + integration); negative isolation + calendar-anchor suites |

## 4. Repository structure (four separate repos — ADR-002)
```
fish-farm/                     parent workspace (open this so the agent sees the hub)
  fish-farm-context-files/     THE HUB: specs + contracts + this file (source of truth)
  fish-farm-backend/           NestJS backend (modular monolith)
    packages/
      shared/                  cross-cutting DTOs, domain-event contracts, types
      calendar/                Bangla calendar (Gregorian↔Bangla, numerals, ritu) — used by api, web, mobile
    migrations/                TypeORM migrations
  fish-farm-web/               Next.js owner dashboard (consumes @fish-farm/* + generated client)
  fish-farm-mobile-app/        React Native worker app (consumes @fish-farm/* + generated client)
```
> Separate repos (ADR-002). Shared `packages/*` are hosted in `fish-farm-backend/packages/*` and
> **published** to web + mobile (OI-1), so the Bangla calendar stays byte-identical (NFR-016). The
> code repos keep the hub in context via a multi-root workspace or a `fish-farm-context-files`
> submodule.

Each backend module under `fish-farm-backend/src/modules/<module>/` has:
```
domain/          entities, value objects, domain services, ports (interfaces)
application/     use-cases, app services, DTOs
infrastructure/  TypeORM persistence models + mappers, repo implementations, adapters
presentation/    controllers, request/response DTOs, guards
```

## 5. Coding conventions
- **Language:** TypeScript strict mode on. No `any` unless justified with a comment.
- **Naming:** entities/classes `PascalCase`; files `kebab-case`; DB tables/columns `snake_case`; events `PascalCase` past-tense (e.g. `WaterThresholdBreached`).
- **DTOs:** validate and shape at the presentation boundary; never leak persistence models outward.
- **Errors:** typed domain errors mapped to HTTP at the presentation layer; never throw raw strings.
- **IDs:** UUID v4.
- **Money:** integer minor units (`amount_minor`) or `decimal` columns; currency is **BDT only** (ADR-018 superseded the per-project currency idea). Never floats for money.
- **Time:** store UTC; convert for display. Bangla dates are display-only via `packages/calendar`.
- **Every project-owned table** carries a `project_id` column (indexed), even when reachable via pond/batch — this enables cheap, uniform isolation filtering.

## 5b. Input validation (EVERY form, EVERY surface — no exceptions)

Every input the user can type into, step, pick or toggle is validated. This is not a per-screen
choice; a form that can be submitted in an invalid state is a defect, the same as a failing test.

**The rules**
1. **Never submit an invalid form.** The submit handler validates first and stops on failure —
   disabling the button is not enough on its own (a disabled-looking control still gets pressed on a
   cheap touchscreen, and the web surface has keyboard submit). No request leaves the client for a
   form that cannot succeed.
2. **A message per field, next to that field.** One message at a time (the first failing rule),
   placed under the input it belongs to, plus the field's error styling. A single form-level "invalid
   input" banner is not acceptable.
3. **Show errors only after the field is touched or submit was pressed.** A cold-open form never
   greets the user with red.
4. **Client rules mirror the server contract; they never invent stricter ones.** Read the DTO /
   `contracts/openapi.yaml` before writing a rule. Being stricter than the API locks users out of
   valid data (e.g. login's password is `MinLength(1)` server-side — a min-8 rule there would lock a
   worker out of their own account; min-8 belongs to password *reset*, where the contract sets it).
5. **Client validation is a courtesy, never the security boundary.** The server re-validates
   everything; DTO validation at the presentation boundary stays mandatory (§5).
6. **Rules are pure, shared and tested.** Compose them from the surface's shared validation module
   (`fish-farm-mobile-app/src/validation`, and the web equivalent) — never a regex inlined in a
   screen. Each rule gets unit tests, and each form gets a test proving an empty/invalid submit is
   refused and the message appears.
7. **Messages are i18n keys, not strings.** A rule returns `{messageKey, params}`; only the i18n
   layer renders text. The worker app is Bangla-only with Bengali numerals (NFR-002, AC-138), so a
   validator that formats its own message will leak Western digits or English.
8. **Keyboard-free worker inputs validate too.** Steppers and chips constrain values at the edges
   (min/max, allowed set) rather than letting an out-of-range value reach the queue.

**Definition of done additions** (see §7): every new form has (a) a schema built from shared rules,
(b) per-field messages in the surface's language, (c) a test that an invalid submit is blocked and
does not call the API, and (d) rules that match the contract they post to.

## 6. Security & access
- Authorization is by `ProjectMembership` role (`OWNER` / `WORKER` / `PARTNER`), resolved per project per request — not a global role.
- `WORKER`: operational read/write on their one project; no finance, no settings.
- `PARTNER`: read-only on their project(s), including finance; nothing else.
- `OWNER`: full on owned projects + portfolio.
- The project-scope guard + scoped-repository base (TASK-004) is the **only** sanctioned way to read project data. Do not bypass it.

## 7. Testing (Definition of Done for every unit)
A unit of work is DONE only when all hold:
- [ ] Domain logic has unit tests; module has an integration test for one happy path + one failure path.
- [ ] **Tenant isolation test** where the unit touches project-owned data: a user without membership is denied (negative test is a deliverable).
- [ ] Offline path verified for any worker-app unit (write offline → sync → assert).
- [ ] **Every form in the unit validates per §5b**: shared pure rules, a per-field message in the
  surface's language, and a test proving an invalid/empty submit is blocked and never calls the API.
- [ ] Calendar units pass the **anchor tests** (21 Feb=8 Falgun, 26 Mar=12 Choitro, 16 Dec=1 Poush, 14 Apr=1 Boishakh).
- [ ] Parent story's acceptance criteria demonstrably met.
- [ ] Migration included and reversible; no secrets in code.
- [ ] Lint + type-check + tests green.
- [ ] Diff is self-contained to the unit and ready for human review.

## 8. The agent workflow (per unit — the AI-DLC loop)
For each unit of work, in order:
1. **Restate** the unit, its acceptance criteria, and which files/layers it touches.
2. **Propose a short plan** (entities, use-case, endpoints, tests). Pause here only if something is ambiguous or contradicts a spec.
3. **Implement** following all invariants (§2) and structure (§4).
4. **Write tests** (§7) and run them.
5. **Self-review** against the Definition of Done checklist; fix anything red.
6. **Stop and hand the diff to the human** for validation. Do not start the next unit.

Rules of engagement:
- **One unit per session.** Never bundle multiple units into one diff.
- **Never weaken an invariant to make a test pass.** Fix the code, not the rule.
- **Never expand scope** beyond the current unit. Note follow-ups for the human instead.
- Prefer the smallest change that satisfies the unit and its tests.

## 9. Build order (do not reorder)
Modules build in `MODULES_OVERVIEW.md` implementation order; the depend-on edges in `BACKLOG.md` define the true build DAG. Within MOD-01/foundation, the foundation units — scaffold (TASK-001/002), **tenant isolation (TASK-004)**, **auth (TASK-008/009)**, **project + membership (TASK-010/011)**, **calendar (TASK-007)** — come before any project-owned domain module. Tenant isolation must exist before the first project-owned table is queried.

## 10. Commands (backend — `fish-farm-backend/`; scaffolded in TASK-001/TASK-002)
```
# install:              npm install
# dev:                  npm run start:dev        # watch mode
# start (built):        npm run build && npm run start:prod
# test:                 npm test                 # jest (unit + integration; needs Docker running — see below)
# domain-purity only:   npm run check:purity
# lint / typecheck:     npm run lint  |  npm run typecheck
# build:                npm run build
# migration:generate:   npm run migration:generate -- <Name>
# migration:run:        npm run migration:run
# migration:revert:     npm run migration:revert
# packages (TASK-051):  npm run packages:build   # build @fish-farm/{shared,calendar} (also runs on npm install via prepare)
#                       npm run packages:pack    # build + pack publishable tarballs into dist-packages/
```
**Local/CI prerequisite (since TASK-002):** integration tests spin up a disposable Postgres via
`testcontainers`, so **Docker must be running** wherever `npm test` runs (local machine or CI
runner). `migration:*` scripts additionally need `DB_HOST/DB_PORT/DB_USERNAME/DB_PASSWORD/DB_NAME`
env vars pointing at a reachable Postgres.

## 10b. Commands (mobile — `fish-farm-mobile-app/`; scaffolded 2026-08-23)
```
# install:              npm install               # postinstall syncs tokens + regenerates the API client
# native project:       npm run prebuild          # generate android/ from app.json (Expo CNG; not committed)
#                       npm run prebuild:clean    # regenerate from scratch
# dev server:           npm start                 # expo start --dev-client  (Expo Go will NOT work)
# run on Android:       npm run android           # expo run:android
# release build:        npm run build:android
# lint / typecheck:     npm run lint  |  npm run typecheck
# test:                 npm test                  # jest (jest-expo); offline write->sync->no-loss suite
# env/deps check:       npm run doctor            # expo-doctor
# regenerate contracts: npm run contracts:sync    # tokens:sync + api:generate (openapi.yaml -> typed client)
```
**Stack (ADR-020):** Expo SDK 57 + RN 0.86.x, New Architecture, Android-first (API 28+).
WatermelonDB is native, so development needs a **dev client** build, not Expo Go. `android/` is
generated — express native changes as Expo config plugins in `app.json`, never by editing `android/`.

Web (`fish-farm-web`) commands are added when that repo's scaffold is revisited. Keep these accurate
as the project grows; the agent uses them to self-verify before handing off.

## 11. What the agent must NOT do
- Put TypeORM decorators on domain entities, or use Active Record.
- Query project data without the scoped repository / project context.
- Use `Intl`/ICU (or any non-`packages/calendar` source) for Bangla dates.
- Use `synchronize: true` or skip migrations.
- Hardcode secrets, or commit `.env`.
- Skip tests, or weaken isolation/RBAC to pass a test.
- Invent requirements, endpoints, or fields not in the BRD/specs (`PRODUCT_SPECIFICATION.md`, `TECHNICAL_SPECIFICATION.md`, `contracts/openapi.yaml`) without asking.
- Bundle units, or proceed past a unit without human validation.
