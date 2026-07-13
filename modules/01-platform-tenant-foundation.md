# MOD-01 — Platform & Tenant Foundation

**Project:** Fish Farm Management System (FMS) | **Surface:** backend, shared | **Version:** 1.0 | **Status:** Not Started
**Owns features:** FT-001, FT-002, FT-003, FT-004, FT-005, FT-006, FT-007
**Contract refs:** shared `Error` schema (consumed by all operations)
**Dependencies:** none (this module is the root of the build graph)

---

## 1. Overview

**Purpose.** Provide the NestJS skeleton and the *shared-kernel* that every other module builds on:
the persistence layer (TypeORM Data Mapper), the **tenant-isolation mechanism** (project-scope
guard + scoped-repository base), the audit trail, the domain-error→HTTP contract, and the in-process
domain event bus. This module is what makes fully agentic, uniform construction of the rest of the
system safe — especially partner isolation.

**Scope.** Cross-cutting infrastructure only; it owns **no** business domain. It exposes reusable
building blocks (base classes, decorators, interceptors, ports) consumed by MOD-02…MOD-12.

**Position in architecture.** The innermost/lowest layer. Per Clean Architecture, its shared domain
primitives (base domain entity, `DomainError`, event contracts, tenant context type) import zero
frameworks; its infrastructure pieces (TypeORM data source, guard, interceptors) wire NestJS +
TypeORM around them. Every project-owned query in the system flows through the scoped-repository
base defined here.

**Dependencies.** None. It must exist and pass its isolation tests **before any project-owned table
is queried** (CLAUDE.md §9, build unit E0-S7).

## 2. Functional details

### 2.1 Core functions
- **F1 — App scaffold & config (FT-001).** Bootstrap a NestJS modular-monolith app; load all
  configuration from environment variables (no secrets in code); expose a `/health` endpoint;
  register global pipes (validation), the exception filter, the audit interceptor, and the scope
  guard.
- **F2 — Persistence & migrations (FT-002).** Configure a single TypeORM `DataSource` with
  `synchronize:false`; provide the migration commands; establish the persistence-model + mapper
  pattern (persistence models live in `infrastructure/persistence`, never decorated domain classes).
- **F3 — Tenant context & scope guard (FT-003).** On every authenticated request, resolve the
  caller's `ProjectMembership`s (via a port implemented by MOD-02) and populate a request-scoped
  **TenantContext** with the caller's user id, the resolved active `project_id`, and role. Reject
  requests that reference a project the caller is not a member of.
- **F4 — Scoped repository base (FT-004).** A generic base repository that **automatically adds
  `project_id = :ctxProjectId`** to every read and sets it on every write for project-owned
  entities, sourcing the id from TenantContext. It is the *only* sanctioned way to access
  project-owned data.
- **F5 — Audit trail (FT-005).** An interceptor that writes an immutable `AuditEntry` (actor,
  project, action, entity, entity id, timestamp) for every state-changing request, within the same
  DB transaction as the change.
- **F6 — Error contract (FT-006).** A `DomainError` base + typed subclasses (`NotFoundError`,
  `ForbiddenError`, `ValidationError`, `ConflictError`, `UnprocessableError`) and a global filter
  mapping them to the shared `Error` response schema; unknown errors → 500 with a correlation id.
- **F7 — Domain event bus (FT-007).** An in-process publisher/subscriber for `PascalCase`
  past-tense domain events, with event contracts defined in `packages/shared`.

### 2.2 Sub-modules
- **config** — env schema validation at boot (fail fast if a required var is missing); typed config
  service. State: none (immutable at boot).
- **persistence** — `DataSource`, migration runner wiring, `BaseProjectOwnedPersistenceModel`
  (adds `project_id` column + index), mapper conventions. State: connection pool.
- **shared-kernel/tenant** — `TenantContext` (request-scoped), `ProjectScopeGuard`,
  `MembershipResolverPort` (interface; implemented by MOD-02), `ScopedRepository<T>` base.
- **shared-kernel/audit** — `AuditInterceptor`, `AuditEntry` model + writer.
- **shared-kernel/errors** — `DomainError` hierarchy, `DomainExceptionFilter`, correlation-id
  middleware.
- **events** — `DomainEventBus` (publish/subscribe), base `DomainEvent` type.

### 2.3 User interactions
None directly (no UI). Consumed programmatically by other modules. The only externally observable
endpoint is `GET /health` (unauthenticated, liveness/readiness).

### 2.4 Business rules & validation
- **R1** Every project-owned entity **must** carry an indexed `project_id`; a persistence model that
  extends the project-owned base without one is a build error (enforced by review + a schema test).
- **R2** No repository may query a project-owned table without going through `ScopedRepository`
  (which requires a populated TenantContext). Direct `DataSource`/`Repository` access to
  project-owned tables is forbidden.
- **R3** TenantContext's `project_id` is derived **only** from server-resolved membership — never
  from a client-supplied header/body field.
- **R4** A request whose path/body `projectId` is not among the caller's memberships is rejected
  **before** any handler runs.
- **R5** Domain classes import no framework (`@nestjs/*`, `typeorm`, HTTP libs); persistence
  decorators appear only in `infrastructure/persistence`.
- **R6** Every schema change is a reversible migration; `up()` and `down()` are both implemented and
  tested. `synchronize` is never `true`.
- **R7** Audit entries are append-only; no update/delete path exists for `AuditEntry`.

### 2.5 Edge cases
1. **Authenticated user with zero memberships** → any project-scoped request resolves an empty
   membership set → 403 (not 500), and portfolio/`/me` still work (return empty lists).
2. **Path `projectId` valid UUID but caller not a member** → 403/404 uniformly; the response must
   **not** reveal whether the project exists (anti-enumeration).
3. **Request with no `projectId` at all to a project-scoped route** → 400 (missing scope), never a
   silent unscoped query.
4. **Two memberships for the caller across different projects** → the active project is taken from
   the route/selected scope; the guard must not leak data from the other project.
5. **DB transaction fails after the domain write but before audit write** → whole transaction rolls
   back; no orphan state and no orphan audit entry (audit is in the same transaction).
6. **Migration `down()` cannot fully reverse (e.g., data loss)** → the migration must document
   irreversibility explicitly and the reversibility test asserts the documented behavior rather than
   silently passing.
7. **A subscriber to a domain event throws** → the publishing transaction's outcome is unaffected
   for already-committed work; subscriber failures are logged and retried per policy, never crash
   the request.
8. **Clock/UTC:** timestamps are stored UTC; a request from any timezone records consistent UTC
   `read_at`/`created_at`.

### 2.6 Error states
| Trigger | Code / HTTP | Message (to client) | Recovery |
|---|---|---|---|
| Missing/invalid JWT on a protected route | `UNAUTHENTICATED` / 401 | "Authentication required." | Client re-authenticates (MOD-02). |
| Caller not a member of the referenced project | `FORBIDDEN` / 403 | "You do not have access to this resource." | None; do not disclose existence. |
| Project-scoped route called without a project scope | `SCOPE_REQUIRED` / 400 | "Project scope is required." | Client supplies a valid project scope. |
| Required env var missing at boot | (process exits non-zero) | logged: "Missing required config: X" | Fix env; restart. |
| Unhandled/unknown error | `INTERNAL` / 500 + correlationId | "Something went wrong (ref: <id>)." | Investigate via correlation id. |
| Attempt to write via a non-scoped repo (dev-time) | build/test failure | — | Use `ScopedRepository`. |

## 3. Non-functional (this surface: backend)
- **NFR-011 (tenant isolation)** — enforced centrally here; the negative test is a deliverable (AC-004).
- **NFR-006 (maintainability)** — domain purity: the domain has zero framework imports (AC-009).
- **NFR-012 (auditability)** — audit within the same transaction (AC-006).
- **NFR-005 (security)** — secrets via env only; correlation ids; no info leakage on 403/404.
- **NFR-004 (API performance)** — scoping uses the indexed `project_id`; guard adds negligible
  per-request overhead (membership resolution cached per request).

## 4. Technical details

### 4.1 Components
`AppModule` (root), `ConfigModule`, `PersistenceModule` (`DataSource` provider),
`SharedKernelModule` exporting: `ProjectScopeGuard`, `TenantContext` (request-scoped provider),
`ScopedRepository<T>` base, `AuditInterceptor`, `DomainExceptionFilter`, `DomainEventBus`,
`MembershipResolverPort` (token/interface).

### 4.2 Files / folders (repo: `fish-farm-backend`)
```
src/main.ts
src/app.module.ts
src/platform/config/            (env schema, config service)
src/platform/persistence/       (data-source.ts, base persistence models, mapper base)
src/platform/events/            (domain-event-bus.ts, domain-event.ts)
src/shared-kernel/tenant/       (tenant-context.ts, project-scope.guard.ts, scoped-repository.ts, membership-resolver.port.ts)
src/shared-kernel/audit/        (audit.interceptor.ts, audit-entry.model.ts, audit.writer.ts)
src/shared-kernel/errors/       (domain-error.ts, domain-exception.filter.ts, correlation.middleware.ts)
migrations/                     (0001_init_audit_and_indexes.ts, ...)
packages/shared/                (event contracts, DTO/enum types, Error type)
```

### 4.3 State and data
Owns the `audit_entry` table (append-only): `id uuid pk, project_id uuid null (indexed), actor_user_id uuid null, action text, entity_type text, entity_id uuid null, occurred_at timestamptz, metadata jsonb null` (column names per ERD.md; shipped in migration `CreateAuditEntry`, TASK-005). Provides
the `BaseProjectOwnedPersistenceModel` other modules extend (guarantees indexed `project_id`).
TenantContext is request-scoped in-memory state only.

### 4.4 Key logic
- **Membership resolution:** guard calls `MembershipResolverPort.resolve(userId)` → set of
  `{projectId, role}`; selects the active project from the route param; populates TenantContext or
  throws `ForbiddenError`.
- **Scoped query:** `ScopedRepository.find*` composes `where` with `project_id = ctx.projectId`;
  `save` stamps `project_id = ctx.projectId` and forbids overriding it.
- **Audit:** interceptor opens/join the request transaction, runs the handler, and on success writes
  the `AuditEntry` before commit.

### 4.5 Reusable / shared patterns
`ScopedRepository<T>`, `DomainError` hierarchy, `DomainEvent`/`DomainEventBus`,
`BaseProjectOwnedPersistenceModel`, and the mapper convention are the templates every later module
reuses. `packages/shared` holds cross-surface event/DTO/enum types.

### 4.6 Integration points
- **MOD-02** implements `MembershipResolverPort` (auth provides the user id; membership provides
  roles/projects). This is the one inward dependency inversion this module declares.
- All domain modules (MOD-04…MOD-12) extend `ScopedRepository` and publish/subscribe on
  `DomainEventBus`.

### 4.7 Contract impact
No new endpoints beyond `GET /health` (may be added to `openapi.yaml` as `CON-047` — health/liveness
— when convenient; not required for MVP clients). Defines the shared **`Error`** schema already in
`contracts/openapi.yaml`. No schema changes required by this module.

### 4.8 Testing notes
Unit-test the scoped-repository query composition and the `DomainError`→HTTP mapping in isolation.
Integration-test the guard + scoped repo against a real Postgres (test container) using a throwaway
project-owned entity fixture. The **negative isolation test** (AC-004) and **domain-purity test**
(AC-009, a static check that `src/**/domain/**` imports no framework packages) are required
deliverables. Migration reversibility is tested by running `up` then `down` on a clean schema.

## 5. Acceptance criteria

- **AC-001** — *Given* the app is starting with all required env vars set, *When* it boots, *Then*
  `GET /health` returns 200 and no secret value appears in code or logs. — parent FR-001, NFR-005
- **AC-002** — *Given* a required env var is missing, *When* the app boots, *Then* it exits non-zero
  with a message naming the missing key (fail fast). — parent NFR-005
- **AC-003** — *Given* an authenticated Owner member of project P, *When* they query a project-owned
  resource in P, *Then* only rows with `project_id = P` are returned. — parent FR-003, NFR-011
- **AC-004** — *Given* a user who is **not** a member of project P, *When* they request any
  project-owned resource in P, *Then* the response is 403/404 with no data and no disclosure of P's
  existence (negative isolation test). — parent FR-003, NFR-011
- **AC-005** — *Given* a project-scoped route called without any project scope, *When* the request is
  handled, *Then* it is rejected with `SCOPE_REQUIRED`/400 and **no** database query runs against a
  project-owned table. — parent FR-003, NFR-011
- **AC-006** — *Given* a state-changing request succeeds, *When* the transaction commits, *Then* a
  matching immutable `AuditEntry` (actor, project, action, entity, timestamp) exists in the same
  transaction. — parent FR-005, NFR-012
- **AC-007** — *Given* a state-changing request whose domain write succeeds but whose audit write
  fails, *When* the transaction resolves, *Then* the entire transaction rolls back (no orphan state,
  no orphan audit). — parent FR-005, NFR-012
- **AC-008** — *Given* a handler throws a typed `DomainError`, *When* the exception filter runs,
  *Then* the response body matches the shared `Error` schema with the correct code/HTTP status; an
  unknown error yields `INTERNAL`/500 with a correlation id. — parent FR-006-equivalent (NFR-005)
- **AC-009** — *Given* the backend source, *When* the domain-purity check runs, *Then* no file under
  any `domain/` folder imports `@nestjs/*`, `typeorm`, or an HTTP library. — parent NFR-006
- **AC-010** — *Given* any project-owned persistence model, *When* the schema test runs, *Then* it
  has an indexed `project_id` column. — parent NFR-011
- **AC-011** — *Given* a schema migration, *When* `up()` then `down()` run on a clean database,
  *Then* the schema returns to its prior state (or documents any irreversibility explicitly). —
  parent NFR-006
- **AC-012** — *Given* the `synchronize` setting, *When* the app runs in any environment, *Then* it
  is `false`. — parent NFR-006
- **AC-013** — *Given* a published domain event with a throwing subscriber, *When* the event is
  dispatched, *Then* the subscriber failure is logged/retried and the publishing request is not
  crashed. — parent FR-007-equivalent
- **AC-014** — *Given* a client attempts to set `project_id` in a write body, *When* a scoped write
  runs, *Then* the persisted `project_id` is the TenantContext value and the client value is ignored.
  — parent FR-003, NFR-011

## 6. Implementation & done

### 6.1 Definition of done
- [ ] All ACs (AC-001…AC-014) have passing tests, including the negative isolation test (AC-004) and
  the domain-purity check (AC-009).
- [ ] Integration test covers one happy path (scoped read/write in a member's project) and one
  failure path (non-member denied).
- [ ] Migration(s) included and reversible; `synchronize:false`; no secrets in code.
- [ ] Lint + type-check + tests green; diff self-contained to this unit.
- [ ] `contracts/openapi.yaml` unchanged except optional `GET /health`; `Error` schema present.
- [ ] `TRACEABILITY_MATRIX.md` + `MODULE_PROGRESS_TRACKER.md` updated; human review passed.

### 6.2 Implementation notes
Build in this order: config → persistence/data-source → error contract → tenant context + scope
guard → scoped repository base → audit interceptor → event bus. Use a request-scoped provider for
TenantContext. Keep the `MembershipResolverPort` an interface here; MOD-02 supplies the
implementation via DI so this module has no build dependency on MOD-02.

### 6.3 Risks / caveats
- The scoped-repository base must cover **all** query shapes (find, query builder, relations) or a
  gap becomes an isolation hole — treat any raw query builder use on project-owned tables as
  requiring an explicit scope. Consider adding Postgres RLS later as defense-in-depth (ADR-006).
- Audit-in-transaction adds a write per mutation; acceptable at MVP scale (NFR-004).

### 6.4 Open questions
- Should Postgres row-level security be enabled as a second isolation layer in MVP, or deferred?
  (Default: deferred; app-layer scoping + tests first, per ADR-006.) — **guardrail (security):
  escalate before deciding.**
- Audit retention/rotation policy (size growth over years). (Default: keep indefinitely in MVP;
  revisit with backups NFR-008.)

---

*MOD-01 detail — Fish Farm Management System. Phase 5 artifact. ACs: AC-001…AC-014.*
