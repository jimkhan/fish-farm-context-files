# MOD-09 — Notifications & Alerts

**Project:** Fish Farm Management System (FMS) | **Surface:** backend | **Version:** 1.0 | **Status:** Not Started
**Owns features:** FT-050, FT-051, FT-052
**Contract refs:** CON-038, CON-039, CON-045
**Dependencies:** MOD-01, MOD-02, MOD-03 (subscribes to events from MOD-05, MOD-06, MOD-07, MOD-12)

---

## 1. Overview

**Purpose.** The single place where alerts are **raised, delivered, acknowledged, and resolved**.
It turns domain events (a water breach, a low-stock crossing, a missed task, a mortality spike, an
emergency) into notifications that reach the right project members through the most reliable
channel — and guarantees that **critical alerts reach the owner even if the app is closed**.

**Scope.** Alert lifecycle + the five alert types; a `NotificationChannel` port with an FCM push
adapter (MVP) and SMS/WhatsApp adapters (Phase 2 stubs behind the same port); device-token
registration; critical-delivery reliability with retry/fallback and an acknowledgement SLA.

**Position in architecture.** A low-level, cross-cutting service that domain modules depend on to
raise alerts. It subscribes to domain events (so domains stay decoupled from delivery) and reads
recipients from memberships (MOD-02). It never owns domain data.

**Dependencies.** MOD-01 (event bus, scoped repo, audit, errors), MOD-02 (membership → recipients),
MOD-03 (project context). Subscribes to events emitted by MOD-05/06/07/12.

## 2. Functional details

### 2.1 Core functions
- **F1 — Alert lifecycle & types (FT-050).** Subscribe to domain events and raise an `Alert` with
  the correct **type** (`WATER_THRESHOLD` | `WATER_EMERGENCY` | `LOW_STOCK` | `MISSED_TASK` |
  `ABNORMAL_MORTALITY`) and **severity** (`INFO`/`WARNING`/`CRITICAL`); manage state
  `RAISED → SENT → ACKNOWLEDGED → RESOLVED`; debounce repeats.
- **F2 — Channel & device registration (FT-051).** A `NotificationChannel` port; the **FCM** push
  adapter is active in MVP; **SMS/WhatsApp** adapters implement the same port and are stubbed
  (Phase 2). `POST /notifications/devices` (CON-045) registers a user's FCM token.
- **F3 — Critical delivery & acknowledgement (FT-052).** Deliver CRITICAL alerts to the owner even
  when the app is closed (high-priority FCM notification message), with retry/backoff and a fallback
  channel; track acknowledgement against an SLA (target 15 min) and escalate/re-notify if unmet.
  `GET /projects/{id}/alerts` (CON-038) lists; `POST …/alerts/{alertId}/acknowledge` (CON-039) acks.

### 2.2 Sub-modules
- **alert-engine** — event subscribers, raise/dedup logic, state machine, SLA timer. State: `alert`.
- **channels** — `NotificationChannel` port + `FcmAdapter` (active), `SmsAdapter`/`WhatsAppAdapter`
  (stubs). State: `delivery_attempt`.
- **devices** — device-token registry. State: `device_token`.

### 2.3 User interactions
- **Owner (web/mobile):** receives push; views the alert list; acknowledges alerts.
- **Worker (mobile):** receives operational alerts on their project (missed task, low stock, water
  threshold); can acknowledge operational alerts.
- **Partner (web):** may **view** alerts on their project (read-only); cannot acknowledge.

### 2.4 Business rules & validation
- **R1** Alerts are **project-scoped**; recipients are resolved from membership — a user who is not
  a member of the alert's project never receives or sees it.
- **R2** **Recipient policy:** the **Owner** receives all alerts, and **CRITICAL** always targets the
  Owner; the **Worker** receives operational alerts (`MISSED_TASK`, `LOW_STOCK`, `WATER_THRESHOLD`)
  on their project; **Partners** are read-only viewers.
- **R3** A `WATER_EMERGENCY` and a critical `WATER_THRESHOLD` breach are **CRITICAL** and must reach
  the Owner even if the app is closed (FCM high-priority notification, not data-only).
- **R4** **Debounce/dedup:** repeated identical breaches within a configurable window collapse into
  the existing active alert (no notification storm); a distinct/escalating condition raises anew.
- **R5** **Idempotency:** the event bus is at-least-once; alert creation is idempotent keyed by
  `(projectId, type, source, window)` so a duplicated event yields one alert.
- **R6** **Delivery reliability:** on channel failure, retry with backoff; if still failing, use the
  next available channel (Phase-2 SMS/WhatsApp); the alert is never silently dropped.
- **R7** **Acknowledgement SLA:** CRITICAL alerts track time-to-ack; if unacknowledged within the
  SLA, re-notify/escalate. Acknowledgement is idempotent.
- **R8** Only Owner (and Worker for operational types) may acknowledge; Partner may not (read-only).
- **R9** FCM/provider credentials come from environment variables only (no secrets in code).

### 2.5 Edge cases
1. **Threshold breached repeatedly in minutes** → one active alert (debounced), not a storm (R4).
2. **Owner has no registered device token** → push fails → retry, then fallback (Phase 2); alert is
   marked delivery-pending and surfaced in the list; never lost.
3. **App closed on a CRITICAL** → FCM notification message wakes the device; the alert is delivered.
4. **Acknowledge an already-resolved alert** → no-op (idempotent), returns current state.
5. **Event for a project the potential recipient isn't a member of** → not delivered/visible (R1).
6. **FCM down entirely** → retry/backoff; escalate via fallback; the SLA timer still runs and
   escalation fires; nothing is lost.
7. **Duplicate event delivery** → single alert (R5).
8. **Partner taps acknowledge** → 403 (read-only).
9. **A domain event arrives after the project is CLOSED** → alert may still be recorded but delivery
   policy may suppress non-critical notifications for closed projects (config).

### 2.6 Error states
| Trigger | Code / HTTP | Message | Recovery |
|---|---|---|---|
| Partner attempts acknowledge | `FORBIDDEN` / 403 | "Partners have read-only access." | None. |
| Acknowledge alert in another project | `FORBIDDEN`/`NOT_FOUND` / 403/404 | "You do not have access to this resource." | None. |
| Register device with missing token | `VALIDATION` / 400 | "A device token is required." | Resend with token. |
| Delivery permanently fails all channels | (internal) logged + alert flagged | — | Owner sees unacknowledged alert; escalation continues. |
| SMS/WhatsApp used in MVP | `CHANNEL_UNAVAILABLE` (internal) | — | Falls back to push only (Phase 2 enables others). |

## 3. Non-functional (surface: backend)
- **NFR-013 (notification reliability)** — CRITICAL delivered within SLA via the most reliable
  available channel, with retry/fallback (AC-052, AC-054).
- **NFR-011 (isolation)** — recipients are membership-scoped; no cross-project alerting (AC-056).
- **NFR-005 (security)** — provider secrets via env; scoped acknowledgement.
- **NFR-007 (availability)** — graceful behavior when a channel/provider is down (AC-052 retry).

## 4. Technical details

### 4.1 Components
`NotificationsModule` with `AlertEngine` (event subscribers + state machine + `SlaScheduler` via
`@nestjs/schedule`), `NotificationChannel` port + `FcmAdapter`/`SmsAdapter`(stub)/`WhatsAppAdapter`
(stub), `DeviceTokenService`, `AlertsController` (list/ack), `DevicesController` (register).

### 4.2 Files / folders (repo: `fish-farm-backend`)
```
src/modules/notifications/
  domain/          alert.entity.ts, alert-type.vo.ts, alert-state.vo.ts, notification-channel.port.ts, events (AlertRaised, AlertAcknowledged)
  application/     raise-alert.usecase.ts, acknowledge-alert.usecase.ts, escalate-sla.usecase.ts, recipient-resolver.ts
  infrastructure/  persistence (alert.model.ts, device-token.model.ts, delivery-attempt.model.ts + mappers), fcm.adapter.ts, sms.adapter.stub.ts, whatsapp.adapter.stub.ts, sla.scheduler.ts
  presentation/    alerts.controller.ts, devices.controller.ts, dtos
migrations/        00xx_alerts_devices.ts
```

### 4.3 State and data
Tables: `alert` (id, project_id [indexed], type, severity, state, message, source_ref, raised_at,
acknowledged_at, resolved_at, dedup_key), `device_token` (id, user_id, token, platform, created_at),
`delivery_attempt` (id, alert_id, channel, status, attempted_at, error). All project-owned tables
carry `project_id`.

### 4.4 Key logic
- **Raise:** on a subscribed domain event → resolve recipients (RecipientResolver via MOD-02) →
  dedup by key → create/uplift alert → dispatch via channel(s) → record `delivery_attempt` → set
  `SENT`; start SLA timer for CRITICAL.
- **Escalate:** SLA scheduler scans unacknowledged CRITICAL alerts past SLA → re-notify/escalate.
- **Acknowledge:** validate role/scope → set `ACKNOWLEDGED` (idempotent) → stop SLA escalation.

### 4.5 Reusable / shared patterns
The `NotificationChannel` port is the extension seam for Phase-2 SMS/WhatsApp. Domain modules never
call FCM directly — they emit events; this module owns all delivery. Alert type/severity/state are
mirrored as enums in `packages/shared`.

### 4.6 Integration points
- **Subscribes:** `WaterThresholdBreached`, `WaterEmergencyRaised` (MOD-06); `LowStock` (MOD-05);
  `AbnormalMortalityDetected` (MOD-07); `MissedTask` (MOD-12 tasks).
- **Consumes:** MOD-02 recipient resolution; MOD-03 project context; MOD-01 event bus/audit.
- **Provides:** open-alert counts to MOD-03 portfolio; emits `AlertRaised`/`AlertAcknowledged`.

### 4.7 Contract impact
CON-038 (list alerts), CON-039 (acknowledge), CON-045 (register device) already defined in
`contracts/openapi.yaml`. No new endpoints/schemas required.

### 4.8 Testing notes
Unit: dedup/debounce, state-machine transitions, recipient policy, SLA escalation trigger.
Integration: event → alert raised → FCM adapter (faked) delivery → ack happy path; failure path
(delivery retry + fallback). Required: the **scoped-recipient negative test** (AC-056) and the
**critical-delivery-when-app-closed** behavior via a faked FCM high-priority message (AC-052).

## 5. Acceptance criteria

- **AC-050** — *Given* a subscribed domain event (e.g., `WaterThresholdBreached`), *When* it is
  received, *Then* an `Alert` of the correct type and severity is raised in `RAISED` state on the
  event's project. — parent FR-053
- **AC-051** — *Given* an alert, *When* its state changes, *Then* only valid transitions
  (`RAISED→SENT→ACKNOWLEDGED→RESOLVED`) are allowed and invalid ones are rejected. — parent FR-053
- **AC-052** — *Given* a CRITICAL alert and an owner whose app is closed, *When* it is dispatched,
  *Then* it is delivered via a high-priority push notification; on delivery failure it is retried
  with backoff (and falls back to the next channel when available). — parent FR-054, NFR-013
- **AC-053** — *Given* a user registers an FCM device token, *When* an alert targets that user,
  *Then* it is dispatched to their registered device(s). — parent FR-052
- **AC-054** — *Given* a CRITICAL alert unacknowledged past the SLA, *When* the SLA scheduler runs,
  *Then* the owner is re-notified/escalated; acknowledging records `acknowledgedAt` and stops
  escalation. — parent FR-054, NFR-013
- **AC-055** — *Given* repeated identical breaches within the debounce window, *When* they occur,
  *Then* only the existing active alert is kept and no duplicate notifications are sent. — parent FR-053
- **AC-056** — *Given* a user who is not a member of a project, *When* an alert is raised there,
  *Then* they neither receive nor can view it. — parent FR-052, NFR-011
- **AC-057** — *Given* the SMS and WhatsApp adapters, *When* the system runs in MVP, *Then* they
  implement the `NotificationChannel` port but are inactive, and enabling them later requires no
  change to the alert engine. — parent FR-052
- **AC-058** — *Given* the same domain event delivered twice (at-least-once bus), *When* processed,
  *Then* exactly one alert exists (idempotent by dedup key). — parent NFR-013
- **AC-059** — *Given* a Partner, *When* they attempt to acknowledge an alert, *Then* it returns
  `FORBIDDEN`/403; an Owner (or Worker for operational types) may acknowledge. — parent FR-004

## 6. Implementation & done

### 6.1 Definition of done
- [ ] All ACs (AC-050…AC-059) tested, including scoped-recipient negative (AC-056) and
  critical-delivery/retry (AC-052).
- [ ] Integration test: event → raise → deliver (faked FCM) → ack happy path + one failure
  (delivery retry/fallback or partner-ack denied).
- [ ] Migration(s) reversible; `synchronize:false`; FCM secret via env; no secrets in code.
- [ ] Lint + type-check + tests green; diff self-contained; contract unchanged.
- [ ] Matrix + tracker updated; human review passed.

### 6.2 Implementation notes
Keep domains decoupled: they emit events, this module owns all delivery. Implement the FCM adapter
against the `NotificationChannel` port; ship SMS/WhatsApp as stubs so Phase 2 is purely additive.
Use `@nestjs/schedule` for the SLA scan. Make raise idempotent by a computed dedup key so
at-least-once events don't duplicate.

### 6.3 Risks / caveats
- Notification storms: get the debounce window right or a flapping sensor spams the owner (AC-055).
- Delivery guarantees depend on FCM; the SLA escalation + Phase-2 fallback are the safety net —
  never treat "push sent" as "owner saw it" until acknowledged.

### 6.4 Open questions
- Alert channel per recipient (BRD open question #3): default push for MVP, SMS/WhatsApp Phase 2.
  Confirm the SLA target (assumed 15 min for CRITICAL). — minor.
- Should non-critical alerts be suppressed for `CLOSED` projects? (Default: yes, suppress
  non-critical for closed projects.)

---

*MOD-09 detail — Fish Farm Management System. Phase 5 artifact. ACs: AC-050…AC-059.*
