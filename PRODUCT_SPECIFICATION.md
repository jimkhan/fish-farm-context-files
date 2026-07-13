# Product Specification — Fish Farm Management System (FMS)

> Version 1.0 · 2026-07-02 · Defers to `GLOSSARY.md` for terms. Every `FR-`/`NFR-` cites its
> parent `BR-` (from `PROJECT_CONCEPT_NOTE.md`) and its BRD/SRS v3.1 trace code, and tags the
> target surface(s): `backend` · `web` · `mobile` · `shared`. Acceptance criteria (Given/When/
> Then) are authored per module in Phase 5 and in `BACKLOG.md` in Phase 6.

---

## 1. Product overview

The FMS is a multi-project, multi-site polyculture aquaculture management platform for a single
portfolio owner in Bangladesh. It connects four things usually scattered across notebooks and
phone calls — daily operations, stock & growth, finances, and live visual monitoring — into one
project-isolated source of truth. A remote owner runs several pond projects from a **Next.js web
dashboard**; a per-site worker logs daily work through an **offline-first, Bangla React Native
app**; a **NestJS modular-monolith backend** enforces tenant isolation and business rules over
**PostgreSQL**; and a **shared Bangla-calendar package + OpenAPI contract** keep the surfaces
aligned. The **Project is the tenant/isolation boundary**: every operational and financial record
belongs to exactly one project, and access is by per-project membership (Owner/Worker/Partner),
so a co-owning partner sees only their own project.

## 2. Vision statement

Turn an informal, trust-based, multi-site prawn-and-fish operation into a **measured** one —
preventing stock loss and feed waste and making remote management trustworthy — **without adding
so much friction that the worker stops using it**, and with hard per-project isolation so
co-ownership is safe.

## 3. Goals (prioritized)

| Priority | Goal | KPI | Parent |
|---|---|---|---|
| P1 | **Tenant isolation is unbreakable** — no cross-project read/write, ever. | 0 leakage incidents | BR-002, BR-003 |
| P1 | **Prevent avoidable stock loss** from water events. | Survival ≥ 80%; 0 un-alerted crashes | BR-006 |
| P1 | **Worker actually adopts** the daily log. | 100% operating-day log completion; ≤2-min log | BR-004 |
| P1 | **Reduce feed waste.** | FCR ≤ 1.5; feed cost % trending down | BR-005 |
| P2 | **Real-time financial visibility** per project + portfolio. | Net profit/ROI visible live | BR-007 |
| P2 | **Trustworthy remote oversight** (verifiable logs + camera). | 100% critical tasks timestamped | BR-008, BR-009 |
| P2 | **Optimize growth.** | ADG/SGR tracked; harvest targets hit | BR-011 |
| P1 | **Correct Bangla-calendar experience.** | Passes anchor tests | BR-010 |

## 4. User personas

**P-1 · Rahim, the Portfolio Owner (remote).** Runs 2–4 pond projects from a city, some co-owned.
Tech-comfortable on a laptop. Wants early warning, a truthful profit picture, and to verify the
worker did the work — without driving to each site. Primary surface: **web**; receives push/SMS
alerts.

**P-2 · Karim, the On-site Worker.** One site, low-to-mid digital/English literacy, low-end
Android, intermittent mobile data. Needs to log feeding/mortality/water and complete tasks in
**Bangla** in under two minutes, offline, with big icons and photo proof. Primary surface:
**mobile**.

**P-3 · Shirin, the Partner / Co-owner.** Co-owns one project with the owner; not operational.
Wants transparent, **read-only** visibility of *her* project's growth and finances, and a
guarantee she cannot see — and is not seen by — any other project. Primary surface: **web**.

**P-4 · Dr. Anis, Consultant / Vet (Phase 3).** Advises on disease/water for assigned projects;
read + treatment notes. Out of v1 scope; noted so the model doesn't preclude it.

## 5. Pain points (per persona)

- **Owner (P-1):** finds out about oxygen crashes too late; can't tell if feeding/tasks really
  happened; no profit number until harvest; fears a partner accidentally seeing another project.
- **Worker (P-2):** English/complex apps are unusable; no signal at the pond; typing is slow;
  unclear what feed amount to give today.
- **Partner (P-3):** no transparency into her investment; must trust verbal updates; worries her
  data is mixed with strangers' projects.
- **Consultant (P-4):** no water/health history to advise from (Phase 3).

## 6. User journeys (surface per step)

**J-1 · Owner onboards a project.** Create project with site location + currency `[web→backend]` →
create first pond inline `[web→backend]` → invite a Worker and a Partner with roles
`[web→backend]` → configure water thresholds and low-stock levels `[web→backend]` → project
appears in portfolio `[web]`.

**J-2 · Worker logs a day offline.** Open app (already scoped to one project) `[mobile]` → tap
today's feeding, enter qty `[mobile, offline]` → log a mortality with photo `[mobile, offline]` →
enter DO/temp reading `[mobile, offline]` → mark chain-drag task done with photo `[mobile,
offline]` → later, connectivity returns → sync queue uploads, inventory auto-deducts, thresholds
evaluated `[mobile↔backend]`.

**J-3 · Water emergency.** Worker taps "oxygen emergency" `[mobile]` → backend raises a CRITICAL
alert `[backend]` → owner receives it via the most reliable channel even with app closed
`[backend→push/SMS]` → owner opens camera + latest readings `[web]` → acknowledges within SLA
`[web→backend]`.

**J-4 · Owner reviews money & growth (Phase 2).** Open portfolio roll-up `[web]` → drill into a
project → see net profit, projected ROI, biomass, FCR, survival `[web←backend]` → export a report
`[web←backend]`.

**J-5 · Partner checks her project.** Log in → sees only her project(s) `[web←backend, isolation]`
→ views growth + finances read-only `[web]` → any attempt to reach another project is denied
`[backend]`.

## 7. Functional requirements

> Format: **FR-NNN** — "The system must …" — *Parent:* BR- · *Surface(s)* · *(BRD trace)*. Min 20; 61 specified.

### 7.1 Authentication & Access (Parent: BR-003, BR-014)
- **FR-001** — The system must authenticate users via login and issue JWT sessions. *BR-003* · backend, web, mobile · *(AUTH-1)*
- **FR-002** — The system must determine a user's capabilities from their **project membership(s)** and per-project role, not a global role. *BR-003* · backend · *(AUTH-1)*
- **FR-003** — The system must enforce **project-scoped authorization** so every read and write is filtered to the caller's memberships; access to a non-member project must be denied. *BR-002, BR-003* · backend · *(AUTH-2, NFR-10)*
- **FR-004** — The system must hide financial data and settings from the **Worker** role and make the **Partner** role strictly read-only. *BR-003, BR-007* · backend, web, mobile · *(AUTH-3)*
- **FR-005** — The system must record an **audit trail** (actor, project, action, entity, timestamp) for every state-changing action. *BR-014* · backend · *(AUTH-4)*
- **FR-006** — The system must provide password reset and basic account management. *BR-003* · backend, web · *(AUTH-5)*

### 7.2 Project & Membership (Parent: BR-001, BR-002)
- **FR-007** — The system must let the owner create and manage **Projects** (name, site lat/long + address, currency/unit settings, status active/closed). *BR-001* · backend, web · *(PROJ-1)*
- **FR-008** — The system must let a project contain one or more **Ponds** and allow creating the first pond inline during project creation. *BR-001* · backend, web · *(PROJ-2)*
- **FR-009** — The system must let the owner **invite/assign members** with a role, where a Worker is assigned to exactly one active project at a time and a Partner to the project(s) they co-own. *BR-003* · backend, web · *(PROJ-3)*
- **FR-010** — The system must provide a **portfolio view** aggregating owned projects (biomass, alerts, finances) with drill-down into any single project. *BR-001* · web, backend · *(PROJ-4)*
- **FR-011** — The system must run all other modules **within the selected project's scope**. *BR-002* · backend, web, mobile · *(PROJ-5)*

### 7.3 Pond, Batch & Stocking (Parent: BR-011)
- **FR-012** — The system must model **Ponds** with area (decimal/katha), depth, and notes. *BR-011* · backend, web, mobile · *(POND-1)*
- **FR-013** — The system must record **Stocking events** per pond: species, source/hatchery, PL/fingerling count, date, and stocking cost. *BR-011* · backend, web, mobile · *(POND-2)*
- **FR-014** — The system must create a trackable **Batch** per stocking with a running survival estimate (initial count − cumulative mortality). *BR-011* · backend · *(POND-3)*
- **FR-015** — The system must display **stocking density** (count ÷ pond area) with a sane-range advisory per species. *BR-011* · web, mobile · *(POND-4)*

### 7.4 Feed (Parent: BR-005, BR-012)
- **FR-016** — The system must calculate the **daily feed quota** from the latest sampling weight per species and a configurable Body-Weight % table. *BR-005* · backend · *(FEED-1)*
- **FR-017** — The system must **adjust feeding rates for temperature and DO** (reduce/skip when DO is low or water too cold/hot), not BW% alone. *BR-005, BR-006* · backend · *(FEED-2)*
- **FR-018** — The system must maintain **independent schedules for floating feed** (Carp/Parse) and **sinking feed/Scampro** (Golda). *BR-005* · backend, mobile · *(FEED-3)*
- **FR-019** — The system must issue **scheduled feeding reminders** (e.g. morning/evening) to the worker. *BR-005* · mobile, backend · *(FEED-4)*
- **FR-020** — The system must **auto-deduct** the corresponding feed from inventory when a feeding is logged. *BR-012* · backend, mobile · *(FEED-5)*
- **FR-021** — The system must support a **check-tray/leftover-feed observation** so the worker can flag over/under-feeding. *BR-005* · mobile · *(FEED-6)*

### 7.5 Water Quality (Parent: BR-006)
- **FR-022** — The system must record **water parameters** per pond per reading: DO, temperature, pH, ammonia, nitrite, alkalinity, transparency (Secchi), with source manual/sensor. *BR-006* · backend, mobile · *(WQ-1)*
- **FR-023** — The system must support **configurable safe-range thresholds** per parameter and trigger an alert when a reading is out of range. *BR-006* · backend, web · *(WQ-2)*
- **FR-024** — The system must **plot parameter trends** over time and surface early-warning patterns (e.g. falling dawn DO). *BR-006* · web · *(WQ-3)*
- **FR-025** — The system must model **pond-bottom/gas-management** (chain drag every 10–15 days) and **aeration** actions as logged events tied to a pond. *BR-006* · backend, mobile · *(WQ-4)*
- **FR-026** — The system must provide an **emergency water-event** one-tap flow that immediately notifies the owner via the most reliable channel. *BR-006, BR-013* · mobile, backend · *(WQ-5)*

### 7.6 Health, Mortality & Disease (Parent: BR-011)
- **FR-027** — The system must log **mortality** per pond per species with count, suspected cause category, and optional photo. *BR-011* · backend, mobile · *(HEALTH-1)*
- **FR-028** — The system must feed **cumulative mortality** into the batch survival estimate and biomass calculation automatically. *BR-011* · backend · *(HEALTH-2)*
- **FR-029** — The system must record **treatments/medicine applications** (product, dose, date, withdrawal period). *BR-011* · backend, web, mobile · *(HEALTH-3)*
- **FR-030** — The system must **flag abnormal mortality spikes** for owner attention. *BR-006, BR-011* · backend · *(HEALTH-4)*

### 7.7 Task & Worker Operations (Parent: BR-004, BR-008)
- **FR-031** — The system must provide a **routine task scheduler** with recurring reminders (chain drag, grass for grass carp, liming, water exchange, etc.). *BR-008* · backend, web, mobile · *(TASK-1)*
- **FR-032** — The system must let the worker **mark tasks complete** with a timestamp and optional proof photo. *BR-008* · mobile · *(TASK-2)*
- **FR-033** — The system must provide a **Daily Log** capturing feed given, mortalities, and water observations in a simple, icon-driven, Bangla mobile form. *BR-004* · mobile · *(TASK-3)*
- **FR-034** — The worker app must function **fully offline** and **sync** when connectivity returns, without data loss. *BR-004* · mobile, backend · *(TASK-4, NFR-1)*

### 7.8 Sampling & Growth (Parent: BR-011)
- **FR-035** — The system must record **bi-weekly sampling** per species (sample size, average weight). *BR-011* · backend, mobile, web · *(GROW-1)*
- **FR-036** — The system must generate **growth curves** and compute **ADG** and **SGR** per species. *BR-011* · backend, web · *(GROW-2)*
- **FR-037** — The system must compute **actual FCR at pond level** and **survival rate** per batch. *BR-005, BR-011* · backend, web · *(GROW-3)*
- **FR-038** — The system must derive the **biomass overview** from (stocked count − cumulative mortality) × latest average weight, per species. *BR-011* · backend, web · *(GROW-4)*

### 7.9 Harvest (Parent: BR-016)
- **FR-039** — The system must support **partial/progressive harvests** (date, pond, species, quantity, total weight, grade export/local). *BR-016* · backend, web, mobile · *(HARVEST-1)*
- **FR-040** — The system must have harvests **reduce remaining biomass** and feed forward into actual revenue. *BR-016, BR-007* · backend · *(HARVEST-2)*
- **FR-041** — The system must report **harvest-to-date vs projected**. *BR-016* · web · *(HARVEST-3)*

### 7.10 Inventory (Parent: BR-012)
- **FR-042** — The system must track stock levels **per project** for each feed type and other consumables (medicine, lime, nets/chain), not shared across projects. *BR-012, BR-002* · backend, web, mobile · *(INV-1)*
- **FR-043** — The system must trigger **replenishment alerts** when per-project low-stock thresholds are crossed. *BR-012* · backend, web · *(INV-2)*
- **FR-044** — The system must **reconcile inventory** with auto-deductions from feeding logs within the same project. *BR-012* · backend · *(INV-3)*

### 7.11 Financial & ROI (Parent: BR-007)
- **FR-045** — The system must record **costs in BDT per project** (feed, salary, medicine, stocking, equipment, misc). *BR-007* · backend, web · *(FIN-1)*
- **FR-046** — The system must track **revenue** from harvests and project **remaining harvest value** per project. *BR-007, BR-016* · backend, web · *(FIN-2)*
- **FR-047** — The system must display **real-time net profit and projected ROI per project**, optionally per decimal/bigha, plus a **portfolio roll-up**. *BR-007, BR-001* · web, backend · *(FIN-3)*
- **FR-048** — The system must show financial views to the project's **Owner and Partner(s) (read-only)** and hide them from the **Worker**. *BR-007, BR-003* · backend, web · *(FIN-4)*

### 7.12 Monitoring — Camera & Weather (Parent: BR-009)
- **FR-049** — The system must **stream each site's IP camera** to that project's dashboard, transcoding RTSP → HLS/WebRTC via a media server, with per-project stream config. *BR-009* · web, backend · *(MON-1)*
- **FR-050** — The system must define **camera latency, recording, and storage policy** (live-only in MVP; clip recording later). *BR-009* · web, backend · *(MON-2)*
- **FR-051** — The system must show **site-local weather** keyed to each project's location, highlighting heavy rain / extreme heat that affect feeding and oxygen. *BR-009* · web, backend · *(MON-3)*

### 7.13 Notifications & Alerts (Parent: BR-013)
- **FR-052** — The system must deliver alerts through **app push and SMS/WhatsApp**, choosing the channel for reliability. *BR-013* · backend, mobile, web · *(NOTIF-1)*
- **FR-053** — The system must support alert types: **water-threshold breach, emergency water event, low feed stock, missed scheduled task, abnormal mortality**. *BR-013* · backend · *(NOTIF-2)*
- **FR-054** — The system must ensure **critical alerts** (oxygen/water emergency) reach the owner even if the app is closed. *BR-013* · backend, mobile · *(NOTIF-3)*

### 7.14 Reporting (Parent: BR-007, BR-008)
- **FR-055** — The system must provide a **daily owner summary** (feed used, mortalities, water status, tasks done). *BR-008* · web, backend · *(RPT-1)*
- **FR-056** — The system must **export** growth, financial, and harvest reports. *BR-007* · web, backend · *(RPT-2)*

### 7.15 Localization & Bengali Calendar (Parent: BR-010)
- **FR-057** — The system must provide a shared **Gregorian ↔ Bengali calendar** conversion using **Bangladesh-revised (2019) rules**, identical on web and mobile. *BR-010* · shared, backend, web, mobile · *(CAL-1)*
- **FR-058** — The system must display worker-facing dates in the **Bangla calendar with Bengali numerals** and show **dual dates** (Bangla + Gregorian) on the owner dashboard. *BR-010* · web, mobile · *(CAL-2)*
- **FR-059** — The system must expose the current **Bangla season (ritu)** for a date and allow **seasonal advisories** to hook into it. *BR-010* · backend, shared, web · *(CAL-3)*
- **FR-060** — The system must allow recurring tasks and reports to reference **Bangla months/seasons** in addition to absolute dates. *BR-010* · backend, web · *(CAL-4)*
- **FR-061** — The system's calendar conversion must be **verified against fixed anchors** (21 Feb = 8 Falgun, 26 Mar = 12 Choitro, 16 Dec = 1 Poush, 14 Apr = 1 Boishakh). *BR-010* · shared · *(CAL-5)*

## 8. Non-functional requirements

> Each NFR is measurable and tagged by surface, with its BRD trace.

- **NFR-001 · Offline-first** — The worker app must capture **100%** of daily-log actions offline and sync them with conflict handling on reconnect with **zero data loss**; a queued write must survive app restart. *mobile, backend · (BRD NFR-1)*
- **NFR-002 · Localization** — **100%** of worker-facing UI must be in **Bangla** with Bengali numerals and Bangla-calendar dates; owner UI supports dual dates. *mobile, web · (BRD NFR-2)*
- **NFR-003 · Mobile performance** — Cold start **≤ 3 s** and a complete daily log **≤ 2 min** on a low-end Android (≈2 GB RAM) over 2G/intermittent networks. *mobile · (BRD NFR-3, NFR-8)*
- **NFR-004 · API performance** — **p95 API latency < 300 ms** at 100 concurrent requests; a sync batch of **≤ 200** offline records processes in **< 5 s**. *backend · (BRD NFR-3)*
- **NFR-005 · Security** — Project-scoped RBAC strictly enforced; finances hidden from Workers; **TLS 1.2+** in transit; passwords hashed with a memory-hard KDF (argon2id/bcrypt); secrets only via environment variables. *backend, web, mobile · (BRD NFR-4)*
- **NFR-006 · Maintainability** — The **domain layer imports zero frameworks** (no NestJS/TypeORM/HTTP); dependencies point inward only (Clean Architecture). *backend · (BRD NFR-5)*
- **NFR-007 · Availability** — **≥ 99%** monthly uptime; the system degrades gracefully (feature disabled, not crash) when a site camera or the weather API is down. *backend, web · (BRD NFR-6)*
- **NFR-008 · Backup & recovery** — **Automated daily backups** of operational + financial data; documented restore; **RPO ≤ 24 h, RTO ≤ 4 h**. *backend · (BRD NFR-7)*
- **NFR-009 · Usability** — A worker completes a daily log in **≤ 2 min** with **≤ ~10 taps**; icon-driven design for low literacy. *mobile · (BRD NFR-8)*
- **NFR-010 · Cost** — A **single modest deployment** (one VPS) serves the entire portfolio; no per-tenant infrastructure. *backend · (BRD NFR-9)*
- **NFR-011 · Tenant isolation** — **Every** query is project-scoped **at the data-access layer**, enforced centrally (project-scope guard + scoped-repository base), not per endpoint; a non-member request returns 403/empty and **never** another project's data; proven by a negative test as a first-class deliverable. *backend · (BRD NFR-10)* **[P1 security invariant]**
- **NFR-012 · Auditability** — Every state-changing action writes an **immutable audit entry within the same transaction**. *backend · (derived from AUTH-4)*
- **NFR-013 · Notification reliability** — A **CRITICAL** alert is delivered end-to-end within the **defined SLA (target 15 min)** via the most reliable available channel, with retry/fallback on failure. *backend, mobile · (derived from NOTIF-3)*
- **NFR-014 · Accessibility** — Owner web meets **WCAG 2.1 AA**; mobile uses large touch targets and high-contrast icons for low-literacy users. *web, mobile · (derived from NFR-2/NFR-8)*
- **NFR-015 · Monetary integrity** — Money is stored as **integer minor units or `decimal`** (never float), currency per project (BDT default). *backend · (derived from FIN)*
- **NFR-016 · Calendar correctness** — Bangla conversion matches **Bangladesh-revised (2019)** rules exactly, passes the anchor tests, and uses **no `Intl`/ICU** source. *shared · (derived from CAL-5)*

## 9. Acceptance-criteria approach

All acceptance criteria are written **Given/When/Then**, one behavior each, testable, and assigned
`AC-` IDs. They are authored in the per-module detail files (Phase 5) and mirrored into
`BACKLOG.md` cards (Phase 6). Every unit touching project-owned data ships a **negative
tenant-isolation AC** (a non-member is denied) as a first-class deliverable per NFR-011 and
`CLAUDE.md` §7. Calendar units ship the anchor ACs per FR-061.

## 10. UX principles

- **Worker (mobile):** icon-first, Bangla-only, minimal typing, big touch targets, ≤2-minute log,
  optimistic offline writes with a visible sync state, photo-as-proof in one tap.
- **Owner/Partner (web):** portfolio-at-a-glance with alert prominence, dual dates everywhere,
  drill-down not overload, finances gated by role, camera + weather contextual to the site.
- **Cross-cutting:** never show another project's data; degrade gracefully (camera/weather down);
  numbers in the reader's expected numerals; consistent status vocabulary from the glossary.

## 11. Supported platforms / environments per surface

| Surface | Platform / environment |
|---|---|
| backend | NestJS on Node LTS; PostgreSQL; single Linux VPS (Render / DigitalOcean / Hetzner); Docker-friendly. |
| web | Next.js; evergreen desktop + mobile browsers (Chrome/Edge/Firefox/Safari, current − 1). |
| mobile | React Native on **Android** (primary; low-end, Android 9+); offline-first local DB + sync queue. iOS not targeted in v1. |
| shared | `packages/calendar` + `packages/shared` consumed by all three; `contracts/openapi.yaml` as the API source of truth; per-site media server (MediaMTX/ffmpeg) for camera. |

## 12. Feature boundaries (what this is NOT)

- **Not** a public SaaS onboarding unrelated third-party farms — it serves this owner's portfolio.
- **Not** automated hardware control (auto-feeders, IoT aerator switching) in v1 — Phase 3.
- **Not** a marketplace or buyer-facing sales tool.
- **Not** accounting-grade financials (tax, payroll compliance) — lightweight expense tracking only.
- **Not** a native desktop app.
- **Not** using `Intl`/ICU or the West Bengal/sidereal calendar for Bangla dates.

## 13. Assumptions

Inherits `PROJECT_CONCEPT_NOTE.md` §14 (multi-site, per-project resources, some partners,
low-end Android over intermittent networks, RTSP cameras, configurable feed rates, BDT/decimal,
push-first). Additional product-level assumptions:
1. iOS is out of scope for v1 (worker devices are Android).
2. One site per project and typically one pond per project at launch; the model allows growth.
3. Partner default visibility includes financials (open question may narrow this).
4. Weather via **OpenWeather** (single third-party API, keyed to site lat/long) with graceful
   degradation if unavailable (ADR-018).
5. **Single currency: BDT** (no multi-currency/FX), South-Asian money formatting; land unit
   defaults to **bigha** (ADR-018).

## 14. Constraints

- Rural, intermittent connectivity → offline operation is mandatory (NFR-001).
- Low worker digital/English literacy → Bangla + icon-driven UI (NFR-002, NFR-009).
- Low-cost hosting → one modest deployment for the whole portfolio (NFR-010).
- Clean Architecture with TypeORM Data Mapper is mandated (`CLAUDE.md`) → domain purity
  (NFR-006), migrations only, no Active Record.
- Bangla calendar must come from `packages/calendar`, never `Intl`/ICU (NFR-016).
- RTSP cannot embed in browsers → a media server is required per site (FR-049).

## 15. Release scope (v1 vs future)

**v1 (Phase 1 — Core operations, the loss/waste preventers):** FR-001…FR-015, FR-016…FR-021
(feed core), FR-022…FR-026 (water + emergency), FR-027/FR-028 (mortality→survival), FR-031…FR-034
(tasks + offline daily log), FR-042…FR-044 (inventory), FR-053/FR-054 (core + critical alerts,
push channel), FR-057…FR-061 (Bangla calendar), plus the portfolio/biomass overview subset of
FR-010/FR-038. All P1 NFRs, especially **NFR-011 tenant isolation** (foundational, before any
project-owned table is queried).

**Phase 2 (Insight & money):** FR-035…FR-038 (growth/FCR/survival analytics), FR-039…FR-041
(harvest), FR-045…FR-048 (full finance/ROI + portfolio roll-up), FR-024 (trend plots),
FR-049…FR-051 (camera + weather), FR-052 SMS/WhatsApp channel, FR-055/FR-056 (reporting), FR-029
(treatments).

**Phase 3 (Optimization & scale):** FR-030 analytics depth, health/disease + biosecurity, IoT
sensors/aerator control (extends FR-022 sensor source, FR-025), multi-pond intelligence,
predictive feed adjustment, Consultant/Vet role, richer partner reporting, camera recording
(FR-050 clip storage).

## 16. Future roadmap

- **Near term after v1:** finish Phase 2 money+insight; add SMS/WhatsApp reliability fallback.
- **Mid term:** IoT DO sensors feeding `WaterReading` (source `SENSOR`) and automated aeration
  alerts; consultant role and richer partner reports.
- **Long term:** predictive feed adjustment from growth + water + weather; multi-pond optimization;
  optional camera recording and clip review; possible iOS worker app if device mix changes.

---

*Product Specification — Fish Farm Management System. Phase 2 artifact. IDs: FR-001…FR-061, NFR-001…NFR-016.*
