# MOD-10 — Monitoring & Reporting

**Project:** Fish Farm Management System (FMS) | **Surface:** backend, web | **Version:** 1.0 | **Status:** Not Started
**Owns features:** FT-053, FT-054, FT-055, FT-056, FT-057
**Contract refs:** CON-036, CON-037, CON-042, CON-046
**Dependencies:** MOD-01, MOD-03 (reads read-models across MOD-05/06/07/08/12 for summaries/exports)

---

## 1. Overview

**Purpose.** Owner situational awareness that isn't an alert: **live camera** per site, **site-local
weather**, a **daily owner summary**, and **report exports** — all degrading gracefully when a
camera or the weather API is unavailable. (Phase 2.)

**Scope.** Per-site camera stream configuration + web player (RTSP→HLS/WebRTC via a media server;
live-only in MVP); site-local weather widget; daily owner summary; growth/financial/harvest report
exports.

**Position in architecture.** A read/monitor-oriented module on MOD-01/MOD-03. It reads published
read-models from other domains for summaries/exports and integrates two external services (a per-site
media server and a weather API). It never owns operational domain data; it composes it for viewing.

**Dependencies.** MOD-01 (scoped repo, errors), MOD-03 (project/site context). Reads MOD-05 (feed),
MOD-06 (water status), MOD-07 (mortality/growth/harvest), MOD-08 (finance) read-models. Reuses
MOD-02's role gate for financial exports and MOD-11 for report dates.

## 2. Functional details

### 2.1 Core functions
- **F1 — Camera streaming (FT-053, FR-049).** Return a per-project browser-playable stream
  (HLS/WebRTC) transcoded from the site RTSP by a media server; the web mounts a player. CON-036.
- **F2 — Camera policy (FT-054, FR-050).** Live-only in MVP; defined latency and (deferred)
  recording/storage policy; graceful offline state.
- **F3 — Site-local weather (FT-055, FR-051).** Weather keyed to the project's lat/long, highlighting
  heavy rain / extreme heat; cached with graceful degradation. CON-037.
- **F4 — Daily owner summary (FT-056, FR-055).** Feed used, mortalities, water status, tasks done/
  missed for a date. CON-042.
- **F5 — Report exports (FT-057, FR-056).** Growth, financial, and harvest exports; the financial
  export is role-gated. CON-046.

### 2.2 Sub-modules
- **camera** — per-project stream config + policy. State: `camera` (config).
- **weather** — weather adapter + cache + degradation. State: `weather_snapshot` (cache).
- **reporting-exports** — daily summary + exports (compose read-models). State: none (query).

### 2.3 User interactions
Owner (web): watch the site camera, read weather, view the daily summary, export reports. Partner
(web): read-only, may export financial reports for their project. Worker (mobile): camera view is in
MOD-12; no report access. 

### 2.4 Business rules & validation
- **R1** Camera config is **per project**; the client receives a browser-playable **HLS/WebRTC** URL
  from the media server — **raw RTSP URLs/credentials are never exposed to the client** (security).
- **R2** **Live-only in MVP**; recording/clip storage is deferred (P3). A camera/media-server outage
  yields an **offline** state, not a failed dashboard (NFR-007).
- **R3** Weather is keyed to the project's site lat/long; results are **cached**; on API failure the
  cached value is served with a **stale** flag, and with no cache the widget shows unavailable —
  the dashboard still renders (NFR-007).
- **R4** Weather highlights **heavy rain** and **extreme heat** (feeding/oxygen-relevant).
- **R5** The daily summary composes read-models (feed used, mortalities, water status, tasks done/
  missed) for a given date, scoped to the project; a no-activity day returns zeros (not an error).
- **R6** Report exports: **growth** and **harvest** are available to project members per role;
  **financial** export is **role-gated** (Owner + Partner read-only; hidden from Worker — reuses
  MOD-02 matrix / MOD-08 gate).
- **R7** Report dates render **dual** (Bangla + Gregorian) via MOD-11.
- **R8** All camera/weather/summary/export access is project-scoped (NFR-011).

### 2.5 Edge cases
1. **Camera/media server down** → player shows an offline state; the rest of the dashboard loads (R2).
2. **Weather API down, cache present** → serve cached with `stale=true` (R3).
3. **Weather API down, no cache** → "weather unavailable"; dashboard still renders (R3).
4. **Raw RTSP credentials** → never sent to the client; only the transcoded URL is (R1).
5. **Worker requests a financial export** → 403 (hidden).
6. **Partner exports a financial report** for their project → allowed (read-only).
7. **Daily summary for a day with no activity** → all zeros, not an error (R5).
8. **Export/camera/weather for a non-member project** → denied (403/404).

### 2.6 Error states
| Trigger | Code / HTTP | Message | Recovery |
|---|---|---|---|
| Camera/media server unavailable | 200 + `online:false` | "Camera is offline." | Retry later; dashboard unaffected. |
| Weather API unavailable | 200 + `stale:true`/unavailable | "Weather may be out of date." | Cached/degraded view. |
| Worker requests financial export | `FORBIDDEN` / 403 | "Finance is not available for your role." | None. |
| Access to a non-member project | `FORBIDDEN`/`NOT_FOUND` / 403/404 | "You do not have access to this resource." | None. |
| Invalid export kind | `VALIDATION` / 400 | "Unknown report type." | Use growth/financial/harvest. |

## 3. Non-functional (surfaces: backend, web)
- **NFR-007 (availability)** — the marquee case: camera/weather degrade gracefully; the dashboard
  never fails because a widget's backing service is down (AC-119/121).
- **NFR-011 (isolation)** — camera/weather/reports scoped; financial export role-gated (AC-123/124).
- **NFR-005 (security)** — RTSP credentials never reach the client (AC-118).
- **NFR-002 (localization)** — report dual dates via MOD-11 (AC-126).

## 4. Technical details

### 4.1 Components
`MonitoringModule`: `CameraController` (CON-036), `WeatherController` (CON-037) with
`WeatherAdapter` + cache + circuit breaker; `ReportingModule`: `DailySummaryQuery` (CON-042),
`ExportController` (CON-046) reusing MOD-08's finance gate. Web: `CameraPlayer` (HLS.js/WebRTC),
`WeatherWidget`, `DailySummary`, export buttons.

### 4.2 Files / folders
```
# repo: fish-farm-backend
src/modules/monitoring/
  domain/          camera.entity.ts, weather-snapshot.vo.ts
  application/     get-camera-config.query.ts, get-weather.query.ts
  infrastructure/  persistence (camera.model.ts, weather-cache.model.ts + mappers), weather.adapter.ts (3rd-party), media-server.config.ts
  presentation/    camera.controller.ts, weather.controller.ts, dtos
src/modules/reporting/
  application/     daily-summary.query.ts, export-report.usecase.ts
  presentation/    reporting.controller.ts, dtos
migrations/        00xx_camera_weather_cache.ts

# repo: fish-farm-web
components/          CameraPlayer.tsx, WeatherWidget.tsx, DailySummary.tsx, ExportButtons.tsx
```

### 4.3 State and data
Tables: `camera` (id, project_id [idx], stream_url_secret [server-only], protocol, label),
`weather_snapshot` (project_id [idx], payload, fetched_at) as a cache. Reports/summaries are queries
over other modules' read-models (no own operational tables).

### 4.4 Key logic
- **Camera:** resolve per-project media-server stream (HLS/WebRTC) URL; return `online` status;
  never return raw RTSP/credentials.
- **Weather:** adapter fetch keyed to site lat/long → cache; on failure serve cache with `stale`
  or an unavailable marker (circuit breaker).
- **Daily summary:** for a date, aggregate feed used (MOD-05), mortalities (MOD-07), water status
  (MOD-06), tasks done/missed (MOD-12) → compose; dates dual-rendered (MOD-11).
- **Export:** assemble the requested report; financial gated via MOD-08's role check; stream a file.

### 4.5 Reusable / shared patterns
The graceful-degradation wrapper (serve stale/offline instead of failing) is the template for all
external-service widgets. Report composition reads published read-models rather than importing
domain internals. Dual-date rendering reuses MOD-11; finance gating reuses MOD-08/MOD-02.

### 4.6 Integration points
- **Reads:** feed (MOD-05), water status (MOD-06), mortality/growth/harvest (MOD-07), finance
  (MOD-08) read-models.
- **External:** per-site media server (RTSP→HLS/WebRTC); weather API.
- **Reuses:** MOD-02/MOD-08 finance role gate; MOD-11 dates.

### 4.7 Contract impact
CON-036 (camera), CON-037 (weather), CON-042 (daily summary), CON-046 (export) already defined. No
new endpoints/schemas required for MVP. (Camera recording, when added in P3, will introduce new
endpoints — note as `CON-055+` then.)

### 4.8 Testing notes
Unit: weather degradation (stale/unavailable) and camera offline state (AC-119/121); daily-summary
composition incl. no-activity zeros (AC-122/125); financial-export gating (AC-123). Integration:
**RTSP credentials never leak to the client** (AC-118) and **non-member denied** (AC-124) are
required deliverables. Dual-date in reports (AC-126).

## 5. Acceptance criteria

- **AC-118** — *Given* a project camera, *When* its config is requested, *Then* the client receives
  a browser-playable HLS/WebRTC URL and **never** the raw RTSP URL/credentials. — parent FR-049, NFR-005
- **AC-119** — *Given* the camera/media server is down, *When* the dashboard loads, *Then* the player
  shows an offline state and the rest of the dashboard still renders. — parent FR-050, NFR-007
- **AC-120** — *Given* a project's site location, *When* weather is requested, *Then* it is keyed to
  that location and highlights heavy rain / extreme heat. — parent FR-051
- **AC-121** — *Given* the weather API is down, *When* weather is requested, *Then* a cached value is
  served with a `stale` flag (or an unavailable marker with no cache), and the dashboard still
  renders. — parent FR-051, NFR-007
- **AC-122** — *Given* a date, *When* the daily summary is requested, *Then* it reports feed used,
  mortalities, water status, and tasks done/missed for that project/date. — parent FR-055
- **AC-123** — *Given* a report export, *When* a growth/harvest export is requested, *Then* it is
  produced for members; a **financial** export is denied to a Worker (403) and allowed read-only to
  a Partner/Owner. — parent FR-056, FR-048
- **AC-124** — *Given* a user not a member of project P, *When* they access P's camera/weather/
  reports/exports, *Then* it is denied (403/404). — parent NFR-011
- **AC-125** — *Given* a date with no activity, *When* the daily summary is requested, *Then* it
  returns zeros (not an error). — parent FR-055
- **AC-126** — *Given* a report, *When* it renders dates, *Then* they display dual (Bangla +
  Gregorian) via MOD-11. — parent FR-058

## 6. Implementation & done

### 6.1 Definition of done
- [ ] All ACs (AC-118…AC-126) tested, including **RTSP-credential non-leak** (AC-118), graceful
  degradation (AC-119/121), financial-export gating (AC-123), and non-member denial (AC-124).
- [ ] Integration test: daily summary composition happy path + one failure (worker export or
  non-member).
- [ ] Migration(s) reversible; `synchronize:false`; camera/weather secrets via env; no secrets in
  code or client payloads.
- [ ] Lint + type-check + tests green; diff self-contained; contract unchanged (P3 recording adds
  `CON-055+` later).
- [ ] Matrix + tracker updated; human review passed.

### 6.2 Implementation notes
Keep RTSP credentials server-side; hand the client only the media-server HLS/WebRTC URL. Wrap the
weather adapter in a circuit breaker + cache so the widget degrades, never blocks. Compose the daily
summary from read-models, not by importing domain services. Reuse MOD-08's finance gate for the
financial export.

### 6.3 Risks / caveats
- **Camera streaming complexity is underestimated (RISK-006)** — treat the media server as its own
  deployable unit; live-only MVP; defer recording. A camera outage must never break the dashboard.
- Weather API rate limits/outages — cache aggressively; the stale/unavailable path is required.

### 6.4 Open questions
- Camera recording (BRD open question #4): live-only in MVP is the default; confirm no recorded
  footage is required for launch.
- Weather provider choice (OpenWeather vs a BD source) — adapter-isolated; pick at implementation.

---

*MOD-10 detail — Fish Farm Management System. Phase 5 artifact. ACs: AC-118…AC-126.*
