# MOD-02 — Identity, Auth & Membership

**Project:** Fish Farm Management System (FMS) | **Surface:** backend | **Version:** 1.0 | **Status:** Not Started
**Owns features:** FT-008, FT-009, FT-010, FT-011
**Contract refs:** CON-001, CON-002, CON-003, CON-004, CON-005, CON-010, CON-011, CON-012
**Dependencies:** MOD-01

---

## 1. Overview

**Purpose.** Establish *who* a caller is and *what they may do* — where "what they may do" is
resolved **per project via membership, never a global role**. This module authenticates users
(JWT), manages accounts and password resets, models `ProjectMembership`, and provides the
`MembershipResolverPort` that MOD-01's project-scope guard consumes to enforce tenant isolation.

**Scope.** Users, credentials, JWT sessions, password reset, `ProjectMembership` (Owner/Worker/
Partner), per-request role resolution, and the RBAC gates that hide finance/settings from Workers
and make Partners read-only. It does **not** own any operational domain data.

**Position in architecture.** Sits directly on MOD-01. It **implements** the
`MembershipResolverPort` interface declared in MOD-01, satisfying MOD-01's only inward dependency
without creating a cycle (MOD-01 depends on the interface, not on this module).

**Dependencies.** MOD-01 (scaffold, persistence, error contract, audit, event bus).

## 2. Functional details

### 2.1 Core functions
- **F1 — Authentication & JWT sessions (FT-008).** `POST /auth/login` verifies credentials and
  issues a short-lived access token + a longer-lived refresh token; `POST /auth/refresh` rotates
  them. The access token's claims carry **only** the user id (`sub`) — no role, no project.
- **F2 — Password reset & account management (FT-009).** `POST /auth/password-reset/request` issues
  a single-use, time-boxed token; `POST /auth/password-reset/confirm` sets a new password. Basic
  account fields (name, email) are manageable.
- **F3 — Membership authorization & RBAC (FT-010).** Implements `MembershipResolverPort.resolve
  (userId) → {projectId, role}[]`. Provides an `@Roles()` guard/decorator so endpoints can require
  `OWNER`/`WORKER`/`PARTNER`; enforces "Worker: no finance/settings" and "Partner: read-only".
- **F4 — Membership management (FT-011).** `GET/POST/DELETE /projects/{id}/members` lets a
  project's Owner invite/assign a member by email with a role and remove members, enforcing the
  "Worker = exactly one active project" and "at least one Owner" invariants.

### 2.2 Sub-modules
- **auth** — login, refresh, JWT strategy, credential verification. State: refresh-token records.
- **users** — user aggregate, account fields, deactivation. State: `user` rows.
- **membership** — `ProjectMembership` CRUD, invite flow, invariants. State: `project_membership`.
- **rbac** — `MembershipResolverPort` impl, `@Roles()` guard, role capability matrix. State: none
  (reads membership per request).

### 2.3 User interactions
Consumed by the web (login, membership admin screens) and mobile (login). No UI in this module;
it exposes the auth + membership endpoints in the contract.

### 2.4 Business rules & validation
- **R1** Passwords are hashed with **argon2id**; plaintext passwords are never stored or logged.
- **R2** Access token TTL is short (e.g., 15 min); refresh TTL longer (e.g., 30 days) and
  **rotated** on use; a reused (already-rotated) refresh token revokes the token family.
- **R3** The token carries `sub` only; role/project are resolved server-side per request (ADR-005).
- **R4** A **Worker** may hold **exactly one `ACTIVE`** project membership at a time.
- **R5** A **Partner** membership is **read-only** on its project(s), including finance.
- **R6** Only a project's **Owner** may invite/assign/remove members of that project.
- **R7** A project must always have **at least one Owner**; removing the last Owner is rejected.
- **R8** Invite is by email; if no account exists, a pending account/invite is created scoped to
  that project only — it must not expose or join any other project.
- **R9** Password-reset tokens are single-use and expire; used/expired tokens are rejected.
- **R10** A JWT with a valid signature but a deactivated/deleted `sub` is rejected (401).

### 2.5 Edge cases
1. **Login for a user with zero memberships** → succeeds; `/me` returns empty memberships; any
   project-scoped route returns 403 (handled by MOD-01 guard).
2. **Invite an email that already has an account (possibly in other projects)** → creates a
   membership only in the target project; the invitee gains no visibility of their other projects
   from this action and this project gains no visibility of theirs.
3. **Assign `WORKER` to a user who is already an active Worker elsewhere** → rejected with a clear
   conflict; Owner must deactivate the prior worker membership first.
4. **Refresh-token replay** (a previously rotated token is presented) → revoke the family, force
   re-login.
5. **Password-reset token used twice or after expiry** → rejected; no state change.
6. **Owner attempts to remove themselves when they are the only Owner** → rejected (R7).
7. **Partner issues any write to their own project** → 403 (read-only), even though they are a
   member.
8. **Two people invited as Partner to the same project** → both allowed (co-ownership); each sees
   only that project.
9. **Concurrent invites of the same email/role** → idempotent-ish: second resolves to the existing
   membership rather than creating a duplicate.

### 2.6 Error states
| Trigger | Code / HTTP | Message | Recovery |
|---|---|---|---|
| Wrong email/password | `INVALID_CREDENTIALS` / 401 | "Invalid email or password." | Retry; no user enumeration (same message for unknown email). |
| Expired/invalid access token | `UNAUTHENTICATED` / 401 | "Session expired." | Refresh or re-login. |
| Reused/invalid refresh token | `TOKEN_REVOKED` / 401 | "Please sign in again." | Re-login. |
| Expired/used reset token | `RESET_TOKEN_INVALID` / 400 | "This reset link is no longer valid." | Request a new reset. |
| Non-Owner manages members | `FORBIDDEN` / 403 | "Only the project owner can manage members." | None. |
| Worker already active elsewhere | `WORKER_ALREADY_ASSIGNED` / 409 | "This worker is already assigned to an active project." | Deactivate prior membership. |
| Remove last Owner | `LAST_OWNER` / 409 | "A project must have at least one owner." | Assign another Owner first. |
| Partner write attempt | `FORBIDDEN` / 403 | "Partners have read-only access." | None. |

## 3. Non-functional (this surface: backend)
- **NFR-005 (security)** — argon2id hashing; TLS in transit; secrets via env; no user enumeration;
  refresh rotation. Verified by AC-016/017/019.
- **NFR-011 (tenant isolation)** — the membership resolver is the source of truth the scope guard
  uses; correctness here is a precondition for isolation (AC-022, AC-029).
- **NFR-004 (performance)** — membership resolution is cached per request so the guard adds
  negligible overhead.
- **NFR-012 (auditability)** — membership changes and logins emit audit entries (via MOD-01).

## 4. Technical details

### 4.1 Components
`AuthModule` (controller + service + `JwtStrategy` + `RefreshTokenService`), `UsersModule`
(service + repo), `MembershipModule` (controller + service + repo), `RbacModule`
(`MembershipResolver` implementing MOD-01's port, `RolesGuard`, `@Roles()` decorator, capability
matrix).

### 4.2 Files / folders (repo: `fish-farm-backend`)
```
src/modules/identity/
  domain/          user.entity.ts, project-membership.entity.ts, role.vo.ts, domain errors, events (MemberInvited, MemberRemoved)
  application/     login.usecase.ts, refresh.usecase.ts, request-reset.usecase.ts, confirm-reset.usecase.ts, invite-member.usecase.ts, remove-member.usecase.ts
  infrastructure/  persistence (user.model.ts, membership.model.ts, refresh-token.model.ts, reset-token.model.ts + mappers), membership-resolver.ts (implements MembershipResolverPort), password-hasher.ts (argon2id)
  presentation/    auth.controller.ts, members.controller.ts, me.controller.ts, roles.guard.ts, dtos
migrations/        00xx_users_memberships_tokens.ts
```

### 4.3 State and data
Tables: `user` (id, email unique, name, password_hash, status), `project_membership` (id, user_id,
project_id [indexed], role, status), `refresh_token` (id, user_id, family_id, hash, expires_at,
rotated_at), `password_reset_token` (id, user_id, hash, expires_at, used_at). `project_membership`
carries `project_id` (it *defines* scope) but access to manage it is Owner-gated, not
self-scoped-read (an Owner reads their project's memberships).

### 4.4 Key logic
- **Login:** find user by email → verify argon2id hash (constant-time) → issue tokens.
- **Resolve:** `MembershipResolver.resolve(userId)` → active memberships; the scope guard selects
  the route's project and role.
- **Invite:** upsert user by email → create membership with invariants (R4/R6/R7) → emit
  `MemberInvited`.

### 4.5 Reusable / shared patterns
`@Roles()` guard + capability matrix is reused by every downstream module needing role checks.
`Role` value object and `Membership` shape are mirrored as enums/types in `packages/shared`.

### 4.6 Integration points
- **Provides** `MembershipResolverPort` implementation to MOD-01 (via DI token).
- **Consumes** MOD-01: scoped repository (for membership reads scoped to the Owner's project),
  audit interceptor, error contract, event bus.
- Emits `MemberInvited` / `MemberRemoved` (may notify via MOD-09 later).

### 4.7 Contract impact
All endpoints already exist in `contracts/openapi.yaml` (CON-001…CON-005, CON-010…CON-012). No new
endpoints or schemas required. (A future `POST /auth/logout` is optional and not in MVP scope.)

### 4.8 Testing notes
Unit: password hashing/verification, token rotation/replay detection, the worker-one-project and
last-owner invariants, the capability matrix. Integration (real Postgres): full login→/me→member
management happy path, plus failure paths (wrong password, non-owner manage, partner write). The
**membership-resolver correctness test** (AC-022) and the **cross-project non-exposure test on
invite** (AC-029) are required deliverables feeding NFR-011.

## 5. Acceptance criteria

- **AC-015** — *Given* valid credentials, *When* a user logs in, *Then* a short-lived access token
  and a refresh token are returned. — parent FR-001
- **AC-016** — *Given* a wrong password (or unknown email), *When* login is attempted, *Then* it
  returns `INVALID_CREDENTIALS`/401 with an identical message for both cases (no enumeration). —
  parent FR-001, NFR-005
- **AC-017** — *Given* a new/updated password, *When* it is stored, *Then* only an argon2id hash is
  persisted and the plaintext never appears in logs. — parent NFR-005
- **AC-018** — *Given* an issued access token, *When* it is decoded, *Then* it contains the user id
  (`sub`) and **no** role or project claim. — parent FR-002
- **AC-019** — *Given* a refresh token that has already been rotated, *When* it is presented again,
  *Then* the token family is revoked and the request returns `TOKEN_REVOKED`/401. — parent FR-001, NFR-005
- **AC-020** — *Given* a password-reset request, *When* the user confirms with a valid unexpired
  token, *Then* the password changes; an expired/used token returns `RESET_TOKEN_INVALID`/400. —
  parent FR-006
- **AC-021** — *Given* an authenticated user, *When* they call `GET /me`, *Then* the response lists
  their project memberships with roles and no other user's data. — parent FR-002
- **AC-022** — *Given* a user with memberships in projects A and B, *When* `MembershipResolver`
  resolves them, *Then* it returns exactly those `{project, role}` pairs, and the scope guard uses
  them to permit A/B and deny others. — parent FR-002, NFR-011
- **AC-023** — *Given* a non-Owner member, *When* they attempt to invite/assign/remove a member,
  *Then* it returns `FORBIDDEN`/403. — parent FR-009
- **AC-024** — *Given* a user who is already an active Worker on project A, *When* an Owner assigns
  them as Worker on project B, *Then* it returns `WORKER_ALREADY_ASSIGNED`/409. — parent FR-009
- **AC-025** — *Given* a Partner on project P, *When* they attempt any write on P, *Then* it returns
  `FORBIDDEN`/403 (read-only). — parent FR-004
- **AC-026** — *Given* a Worker on project P, *When* they call a finance or settings endpoint,
  *Then* it returns `FORBIDDEN`/403 (finance/settings hidden from Workers). — parent FR-004
- **AC-027** — *Given* a project with a single Owner, *When* an attempt is made to remove that
  Owner, *Then* it returns `LAST_OWNER`/409. — parent FR-009
- **AC-028** — *Given* a JWT with a valid signature whose `sub` is a deactivated/deleted user,
  *When* it is used, *Then* the request returns `UNAUTHENTICATED`/401. — parent NFR-005
- **AC-029** — *Given* an invited email that already belongs to a user in other projects, *When*
  the Owner invites them to project P, *Then* a membership is created only in P and neither party
  gains visibility of the other's projects. — parent FR-009, NFR-011

## 6. Implementation & done

### 6.1 Definition of done
- [ ] All ACs (AC-015…AC-029) have passing tests, including AC-022 (resolver correctness) and
  AC-029 (cross-project non-exposure on invite).
- [ ] Integration test: one happy path (login → /me → invite → list) + one failure path
  (non-owner manage or partner write denied).
- [ ] Tenant-isolation negative tests present where membership reads touch project data.
- [ ] Migration(s) reversible; `synchronize:false`; no secrets in code; argon2id in use.
- [ ] Lint + type-check + tests green; diff self-contained.
- [ ] `contracts/openapi.yaml` unchanged (endpoints already defined); matrix + tracker updated;
  human review passed.

### 6.2 Implementation notes
Wire `MembershipResolver` to MOD-01's port via a DI token so MOD-01 stays decoupled. Cache the
resolved memberships on the request object to avoid repeated lookups per request. Keep the role
capability matrix data-driven (a table of role → allowed actions) so downstream modules reference it
rather than re-implementing checks.

### 6.3 Risks / caveats
- The capability matrix must stay the single source for "Worker no finance / Partner read-only";
  duplicating the rule in downstream modules risks drift. Downstream finance gating (MOD-08) must
  consume this matrix, not re-encode it.
- Invite-by-email + account creation touches account existence; keep responses non-enumerating.

### 6.4 Open questions
- Should invited users set their own password via an invite link (recommended) or does the Owner
  set an initial credential? (Default: invite link + self-set password.)
- Partner default finance visibility (BRD open question #2): read-only **including** financials is
  the current default — confirm before Finance (MOD-08) is detailed. **Guardrail (access/PII):
  escalate if changing.**

---

*MOD-02 detail — Fish Farm Management System. Phase 5 artifact. ACs: AC-015…AC-029.*
