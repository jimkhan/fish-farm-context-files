# MOD-03 — Projects, Portfolio & Owner Web App

**Project:** Fish Farm Management System (FMS) | **Surface:** backend, web | **Version:** 1.0 | **Status:** Not Started
**Owns features:** FT-012, FT-013, FT-014, FT-015, FT-016, FT-017
**Contract refs:** CON-006, CON-007, CON-008, CON-009, CON-035
**Dependencies:** MOD-01, MOD-02, MOD-11

---

## 1. Overview

**Purpose.** Own the **Project** aggregate — the tenant/isolation boundary — its lifecycle, the
**portfolio roll-up** across owned projects, and the **owner web application shell** that hosts
every owner/partner-facing page. This module turns "a set of isolated projects" into a navigable
console.

**Scope.** Project CRUD (site, currency, land unit, status); inline first-pond creation during
project setup; active-project scope selection; the portfolio dashboard (biomass + open alerts, with
a finance snapshot arriving in P2) with drill-down; the Next.js shell (routing, layout, auth
session, design-token theming); dual-date (Bangla + Gregorian) rendering across the owner UI.

**Position in architecture.** Backend project services sit on MOD-01/MOD-02. The web shell is the
top-level client for owners/partners; per-domain owner pages (finance, water trends, camera…) plug
into this shell but are delivered by their own modules. Inline first-pond creation is realized
through a **port implemented by MOD-04** (dependency inversion) so this module does not depend on
MOD-04 (keeping the graph acyclic).

**Dependencies.** MOD-01 (scope guard, scoped repo, audit, errors), MOD-02 (auth session, Owner
role, membership — creating a project creates the creator's OWNER membership), MOD-11 (Bangla dates).

## 2. Functional details

### 2.1 Core functions
- **F1 — Project management (FT-012).** Owner creates/updates a project: name, site (lat/long +
  address), currency (BDT default), land unit (decimal/katha/bigha), status (`ACTIVE`/`CLOSED`).
  Creating a project also creates the creator's `OWNER` membership (via MOD-02).
- **F2 — Inline first-pond creation (FT-013).** `POST /projects` may include a `firstPond`; the
  project and its first pond are created **atomically** in one transaction via
  `ProvisionFirstPondPort` (implemented by MOD-04).
- **F3 — Project scope selection & context (FT-014).** Selecting an active project drives the
  `project_id` used by MOD-01's TenantContext for all downstream calls.
- **F4 — Portfolio roll-up (FT-015).** `GET /portfolio/summary` aggregates the caller's **owned**
  projects: total biomass and open critical alerts now; a finance snapshot in P2. Drill-down opens a
  single project respecting membership.
- **F5 — Owner web application shell (FT-016).** Next.js scaffold: routing/navigation, layout,
  auth session handling (login redirect, token refresh), design-token theming, and the mount points
  other modules' owner pages render into.
- **F6 — Dual-date rendering (FT-017).** Every date in the owner UI shows Bangla + Gregorian via
  `packages/calendar` (MOD-11).

### 2.2 Sub-modules
- **projects** (backend) — Project aggregate, CRUD use-cases, status transitions, `ProvisionFirst
  PondPort` interface. State: `project` rows.
- **portfolio** (backend) — read-only aggregation across owned projects (reads biomass read-model
  from MOD-04 and open alerts from MOD-09). State: none (query only).
- **web-shell** (web) — Next.js app router, auth/session, layout/nav, theming, dual-date component,
  graceful-degradation wrappers. State: server-cached queries (TanStack Query); active project in
  the route.

### 2.3 User interactions
- **Owner (web):** create/edit projects, add first pond inline, view the portfolio, drill into a
  project, switch active project. **Partner (web):** land on their co-owned project(s); no owner
  portfolio of projects they don't belong to. **Worker (mobile):** no project management; scope is
  fixed to their one project (MOD-12).

### 2.4 Business rules & validation
- **R1** Only an `OWNER` may create or update a project; the creator becomes its first Owner.
- **R2** `siteLat ∈ [-90,90]`, `siteLng ∈ [-180,180]`; name is required and non-empty.
- **R3** Currency defaults to BDT; money elsewhere follows the project currency (NFR-015).
- **R4** A `CLOSED` project is read-only: writes to it (any module) are rejected; reads still work.
- **R5** The **portfolio** includes only projects where the caller is `OWNER`; drill-down and every
  aggregate is filtered by the caller's memberships (no cross-project leakage).
- **R6** Inline first-pond creation is atomic with project creation; if pond creation fails, the
  project is not created.
- **R7** Owner-facing dates render dual (Bangla + Gregorian); Bangla comes only from
  `packages/calendar`, never `Intl`/ICU.
- **R8** The web shell requires an authenticated session for all pages except login; token refresh
  is transparent.

### 2.5 Edge cases
1. **Create project with `firstPond` where pond validation fails** → whole request rolls back; no
   orphan project (R6).
2. **Partner navigates to the owner portfolio URL** → they do **not** see an aggregation of projects
   they aren't a member of; they are limited to their own project(s) (403 or scoped redirect).
3. **Owner with many projects** → portfolio lists all owned; selecting one sets scope for
   subsequent drill-down calls.
4. **Writing to a `CLOSED` project** (e.g., a stale mobile sync) → rejected with a clear status; the
   client surfaces it without data loss.
5. **Dual-date at the Bangla leap boundary** (Falgun 29↔30 in a Gregorian leap year) → renders the
   correct Bangla date (delegated to and tested in MOD-11).
6. **A dashboard widget's backing service is down** (camera/weather from MOD-10) → the widget shows
   a degraded state; the rest of the dashboard still loads (NFR-007).
7. **Co-owned project** (owner + partner) → appears in the owner's portfolio and on the partner's
   single-project view; each sees only what their membership allows.
8. **Concurrent updates to the same project** → last write wins with an audit trail; no partial
   update.

### 2.6 Error states
| Trigger | Code / HTTP | Message | Recovery |
|---|---|---|---|
| Non-owner creates/updates a project | `FORBIDDEN` / 403 | "Only an owner can manage projects." | None. |
| Invalid site coordinates / missing name | `VALIDATION` / 400 | "Please provide a valid site location and name." | Fix input. |
| Inline first-pond invalid | `VALIDATION` / 400 | "First pond details are invalid." | Fix pond input; project not created. |
| Write to a closed project | `PROJECT_CLOSED` / 409 | "This project is closed and read-only." | Reopen (owner) or discard. |
| Non-member/partner accessing another project | `FORBIDDEN`/`NOT_FOUND` / 403/404 | "You do not have access to this resource." | None (no disclosure). |
| Unauthenticated web page access | (redirect) / 302 → /login | — | Sign in. |

## 3. Non-functional (surfaces: backend, web)
- **NFR-011 (isolation)** — project CRUD is scoped; portfolio only aggregates owned projects
  (AC-034/035).
- **NFR-002 (localization)** — owner dual dates via MOD-11 (AC-037); **NFR-016** calendar
  correctness inherited from MOD-11.
- **NFR-014 (accessibility)** — the web shell meets WCAG 2.1 AA (contrast, focus, keyboard nav).
- **NFR-007 (availability)** — the dashboard degrades gracefully when a dependent widget is down
  (AC-039).
- **NFR-005 (security)** — authenticated session required; scoped reads.

## 4. Technical details

### 4.1 Components
Backend: `ProjectsModule` (controller, create/update use-cases, `ProvisionFirstPondPort` token),
`PortfolioModule` (aggregation query service). Web: Next.js `app/` shell (layout, providers, auth
guard, TanStack Query client, theme from `design-tokens.json`), `DualDate` component,
`PortfolioDashboard`, `ProjectSwitcher`, `ProjectForm`.

### 4.2 Files / folders
```
# repo: fish-farm-backend
src/modules/projects/
  domain/          project.entity.ts, project-status.vo.ts, provision-first-pond.port.ts, events (ProjectCreated, ProjectClosed)
  application/     create-project.usecase.ts, update-project.usecase.ts, portfolio-summary.query.ts
  infrastructure/  persistence (project.model.ts + mapper), portfolio-read.repo.ts
  presentation/    projects.controller.ts, portfolio.controller.ts, dtos
migrations/        00xx_projects.ts

# repo: fish-farm-web
app/                 layout.tsx, providers.tsx, (auth)/login, portfolio/page.tsx, projects/[id]/...
components/          DualDate.tsx, ProjectSwitcher.tsx, PortfolioDashboard.tsx, ProjectForm.tsx
lib/                 api-client (generated from openapi), calendar (packages/calendar binding), theme (design-tokens)
```

### 4.3 State and data
Owns `project` (id, name, site_lat, site_lng, address, currency, land_unit, status, created_at).
Portfolio is a query-only aggregation (no own table). Web holds server-cached query state and the
active project id in the route.

### 4.4 Key logic
- **Create project (+ first pond):** open transaction → create `project` → create OWNER membership
  (MOD-02) → if `firstPond`, call `ProvisionFirstPondPort.create()` (MOD-04) → emit `ProjectCreated`
  → commit.
- **Portfolio summary:** resolve caller's OWNER memberships → for each, read biomass read-model
  (MOD-04) + open alerts (MOD-09) → aggregate → return roll-up + per-project rows.

### 4.5 Reusable / shared patterns
`DualDate` and the calendar binding are reused by every owner page. The web shell's auth/session +
theming + graceful-degradation wrappers are the template for all owner pages across modules.

### 4.6 Integration points
- **MOD-02:** creating a project creates the OWNER membership; Owner-role gate on project writes.
- **MOD-04:** implements `ProvisionFirstPondPort`; provides the biomass read-model for portfolio.
- **MOD-09:** provides open-alert counts for the portfolio.
- **MOD-11:** dual-date rendering.
- Emits `ProjectCreated` / `ProjectClosed`.

### 4.7 Contract impact
Endpoints already defined: CON-006 (list), CON-007 (create + firstPond), CON-008 (get), CON-009
(update), CON-035 (portfolio summary). No new endpoints or schemas required. (Land unit + currency
are already in the `Project`/`CreateProject` schemas.)

### 4.8 Testing notes
Backend: negative isolation (Worker/Partner cannot create/update; portfolio never returns a
non-owned project's data — AC-031/034/035); inline-pond atomicity (AC-032); closed-project
read-only (AC-036). Web: auth-guard redirect (AC-038); dual-date rendering against a calendar
anchor (AC-037, relies on MOD-11 anchor tests); graceful-degradation of a down widget (AC-039);
WCAG AA checks on the shell.

## 5. Acceptance criteria

- **AC-030** — *Given* an authenticated Owner, *When* they create a project with site/currency/land
  unit, *Then* the project is persisted and the creator holds an `OWNER` membership on it. — parent FR-007
- **AC-031** — *Given* a Worker or Partner, *When* they attempt to create or update a project,
  *Then* it returns `FORBIDDEN`/403. — parent FR-007, FR-004
- **AC-032** — *Given* a create-project request with a valid `firstPond`, *When* it succeeds, *Then*
  the project and its first pond both exist; and *When* the pond is invalid, *Then* neither is
  created (atomic). — parent FR-008
- **AC-033** — *Given* an Owner selects an active project, *When* they call a project-scoped
  endpoint, *Then* TenantContext carries that `project_id` and only its data is returned. — parent FR-011
- **AC-034** — *Given* an Owner of projects A and B (and not C), *When* they load the portfolio,
  *Then* it aggregates biomass + open alerts for A and B only and never includes C. — parent FR-010, NFR-011
- **AC-035** — *Given* a Partner, *When* they request the owner portfolio, *Then* they see only
  their co-owned project(s) and no aggregation of projects they aren't a member of. — parent FR-010, NFR-011
- **AC-036** — *Given* a `CLOSED` project, *When* any write targets it, *Then* it returns
  `PROJECT_CLOSED`/409; reads still succeed. — parent FR-007
- **AC-037** — *Given* any date shown in the owner UI, *When* it renders, *Then* it displays both
  the Bangla (via `packages/calendar`) and Gregorian date. — parent FR-058
- **AC-038** — *Given* an unauthenticated visitor, *When* they open any owner page except login,
  *Then* they are redirected to login. — parent NFR-005
- **AC-039** — *Given* a dashboard widget whose backing service (e.g., camera/weather) is down,
  *When* the portfolio/project dashboard loads, *Then* that widget shows a degraded state and the
  rest of the page still renders. — parent NFR-007
- **AC-040** — *Given* a project with a specific currency and land unit, *When* values are displayed,
  *Then* money uses that currency and area uses that land unit. — parent FR-007

## 6. Implementation & done

### 6.1 Definition of done
- [ ] All ACs (AC-030…AC-040) tested, including isolation negatives (AC-031/034/035) and inline-pond
  atomicity (AC-032).
- [ ] Integration test: Owner create→add first pond→view portfolio happy path + one failure
  (non-owner or closed-project write denied).
- [ ] Web: auth-guard, dual-date, and graceful-degradation covered; WCAG AA smoke check.
- [ ] Migration(s) reversible; `synchronize:false`; no secrets in code.
- [ ] Lint + type-check + tests green; diff self-contained; contract unchanged.
- [ ] Matrix + tracker updated; human review passed.

### 6.2 Implementation notes
Declare `ProvisionFirstPondPort` in this module's domain; MOD-04 provides the implementation via DI,
mirroring the MOD-01/MOD-02 port pattern to keep the graph acyclic. Build the backend project CRUD +
portfolio query before the web shell; generate the web API client from `openapi.yaml`. Keep the web
shell thin — per-domain pages arrive with their own modules.

### 6.3 Risks / caveats
- Inline first-pond couples two modules in one transaction; use the port + a single transaction
  boundary owned by the project use-case so failure is atomic.
- Portfolio aggregation reads across modules (biomass, alerts) — read via published read-models/
  events, not by importing those modules' internals, to preserve boundaries.

### 6.4 Open questions
- Portfolio finance snapshot is **P2** (FR-047 lands with MOD-08). Confirm the P1 portfolio shows
  biomass + open alerts only (default: yes).
- Should a project support **multiple Owners** (co-ownership at the Owner level) or is co-ownership
  always via `PARTNER`? (Default: co-ownership via PARTNER; single Owner. Aligns with MOD-02 R7.)

---

*MOD-03 detail — Fish Farm Management System. Phase 5 artifact. ACs: AC-030…AC-040.*
