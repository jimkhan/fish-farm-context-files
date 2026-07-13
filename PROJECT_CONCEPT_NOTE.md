# Project Concept Note — Fish Farm Management System (FMS)

> Defers to `GLOSSARY.md` for all terms. Assigns business requirements (`BR-`) and risks
> (`RISK-`). Business language only — no solutions in the requirements. Source: the approved
> BRD/SRS v3.1 (`Fish-Farm-Management-System-BRD.md`).

---

## 1. Title and version

- **Title:** Polyculture Fish Farm Management System (FMS) — Project Concept Note
- **Version:** 1.0 (derived from BRD/SRS v3.1)
- **Date:** 2026-07-02
- **Owner:** Portfolio Owner / Project Sponsor
- **Surfaces:** backend (NestJS), web (Next.js owner dashboard), mobile (React Native worker app), shared (Bangla calendar + API contract)

## 2. Executive summary

The FMS is a centralized platform that lets a remote owner operate a **portfolio of polyculture
aquaculture projects** — each at its own site, raising **SPF Golda** (giant freshwater prawn),
**Parse** (mullet), and **Carp** — from one place, while a per-site worker performs and logs
daily tasks through a lightweight, offline-capable, Bangla-language mobile app. Each **project is
a self-contained, isolated unit** (its own location, stock cycle, feed inventory, worker,
finances, camera, weather, and ROI), and access is scoped per project so a partner who co-owns
one project sees only that project. On top sits a **portfolio view** that rolls everything up and
drills into any single project. The core value is a **single source of truth** connecting daily
operations, stock/growth, finances, and live visual monitoring — whose purpose is to **prevent
stock loss**, **reduce feed waste** (the largest variable cost), and **make remote multi-site
management trustworthy** through verifiable logs and camera evidence, properly isolated per
project.

## 3. Background

The owner manages the farm remotely and depends on an on-site worker for execution. Today this
relies on memory, verbal updates, and manual calculation, causing feed waste, inconsistent water
management, late reactions to problems, and no reliable financial picture until harvest. An
existing IP camera provides some visibility but is not integrated with operations. Connectivity
at the sites is rural and intermittent, and the worker has low-to-mid digital/English literacy and
a low-end Android phone. Some projects are co-owned with partners who must see only their own
project. The FMS converts this informal, trust-based operation into a measured one — without
adding so much friction that the worker stops using it.

## 4. Problem statement (pain + cost)

Informal, memory-and-phone-call operation of multiple remote polyculture sites produces four
compounding, quantifiable losses:

- **Feed waste** — feeding by habit rather than by body-weight/temperature/DO drives FCR above
  target; feed is the largest variable cost, so every point of FCR is direct margin lost.
- **Avoidable stock loss** — undetected oxygen/water events (dawn DO crashes) can kill an entire
  batch; without early warning and reliable alerting, a single event is catastrophic.
- **No trustworthy remote picture** — the owner cannot verify that critical daily tasks were done
  or see live conditions per site, so remote management rests on unverifiable trust.
- **No real-time financial truth** — costs and revenue are scattered across notebooks; net profit
  and ROI per project are unknown until harvest, and there is no way to isolate a partner's
  project financials from the rest.

## 5. Purpose and objectives (measurable)

| # | Objective | Target / KPI | Traces to |
|---|---|---|---|
| O1 | Reduce feed waste via disciplined, species-specific feeding. | Overall **FCR ≤ 1.5**. | G1 |
| O2 | Prevent avoidable stock loss from water events. | **Survival ≥ 80%** per batch; **zero un-alerted** oxygen crashes. | G2 |
| O3 | Make remote management reliable. | **100%** of critical daily tasks logged with timestamp; camera available on demand. | G3 |
| O4 | Provide real-time financial visibility. | Live net-profit and projected-ROI view, accurate to recorded transactions, per project + portfolio. | G4 |
| O5 | Optimize growth. | Track **ADG/SGR** per species; hit target harvest weights on schedule. | G5 |
| O6 | Guarantee tenant isolation. | **Zero** cross-project data reads/writes; isolation proven by negative tests. | NFR-10 |

## 6. Business requirements (`BR-`)

Business language, no solutions. Downstream `FR-`/`FT-`/`MOD-`/`AC-`/`TASK-` cite these IDs.

- **BR-001** — The owner must be able to remotely oversee and operate a **portfolio of multiple
  aquaculture projects across different sites** from one place, with drill-down into any single
  project.
- **BR-002** — Each project must be a **self-contained venture** whose operational and financial
  data is isolated from every other project; nothing blends across projects by accident.
- **BR-003** — Access must be granted **per project by role** (Owner, Worker, Partner), so a
  co-owning partner sees only the project(s) they are party to — including its finances — and
  nothing else.
- **BR-004** — An on-site worker must be able to **record daily operations** (feeding, mortality,
  water observations) quickly and in **Bangla**, even with **no network connectivity**, and have
  the records sync reliably later.
- **BR-005** — The business must **reduce feed waste** through disciplined, species-appropriate
  feeding driven by growth stage and water conditions.
- **BR-006** — The business must **prevent avoidable stock loss** from water/oxygen events through
  early warning and a reliable emergency-alert path to the owner.
- **BR-007** — The owner must have **real-time financial visibility** — net profit and projected
  ROI — per project and rolled up across the portfolio, with finances hidden from workers.
- **BR-008** — The business must be able to **verify that critical daily tasks were actually
  performed** (timestamped logs and photo/camera evidence) to make remote, trust-based management
  reliable.
- **BR-009** — Stakeholders must be able to **view each site remotely** via its camera and see
  **site-local weather** that affects feeding and oxygen.
- **BR-010** — Dates and seasons must be presented in the **Bangladeshi Bangla calendar** for
  worker-facing use, and as **dual dates** (Bangla + Gregorian) for the owner, with seasonal
  (ritu) advisories.
- **BR-011** — The business must **track stock and growth** (stocking, sampling, biomass,
  survival, FCR) to optimize harvest timing and outcomes.
- **BR-012** — The business must **track feed and consumable inventory per project**, deducting
  automatically as feed is used and warning before stock runs out.
- **BR-013** — **Critical alerts** (oxygen/water emergencies) must **reach the owner reliably**
  even when the app is closed or connectivity is poor.
- **BR-014** — The business must maintain an **audit trail** of who did what, in which project, and
  when — the basis of remote trust and dispute resolution.
- **BR-015** — The system must run at **low cost on a single modest deployment** serving the whole
  portfolio, not a heavyweight per-tenant footprint.
- **BR-016** — The business must support **partial/progressive harvests** and reflect them in
  remaining biomass and in revenue per project.

## 7. Target users

- **Portfolio Owner / Admin** — remote operator, member of all projects they own; needs trust,
  early warning, profit visibility, and multi-site oversight.
- **On-site Worker** — executes daily tasks at one site; needs a simple, fast, Bangla, offline
  tool with minimal taps and icon-driven design (low digital/English literacy, low-end Android).
- **Partner / Co-owner** — co-owns a specific project; needs transparency on their investment
  (including financials) with strict isolation from all other projects.
- **Consultant / Vet** *(Phase 3)* — advises on disease/water on assigned projects.

## 8. Key features overview

1. **Multi-project portfolio & tenant isolation.** Projects are the isolation boundary. Every
   read/write is auto-scoped to the caller's memberships, so partners and workers can only ever
   touch their own project(s). A portfolio view rolls up biomass, alerts, and finances with
   drill-down. This is foundational — partner trust depends on it.
2. **Pond, batch & stocking management.** Model ponds (area/depth), record stocking events, and
   create trackable batches with running survival estimates and stocking-density advisories.
3. **Feed management.** Compute daily feed quota from the latest sampling weight × configurable
   BW% band, adjust for temperature and DO, separate floating vs sinking/Scampro schedules, remind
   the worker, log feeding (which auto-deducts inventory), and observe leftover via check-tray.
4. **Water-quality monitoring & alerting.** Record DO, temp, pH, ammonia, nitrite, alkalinity, and
   Secchi per pond; compare against configurable thresholds; plot trends and surface early-warning
   patterns; support a one-tap emergency water-event flow and pond-bottom/aeration tasks.
5. **Offline-first Bangla daily log & tasks.** The worker captures feed, mortality, and water
   observations in a ≤2-minute icon-driven Bangla form that works fully offline and syncs with
   conflict handling; recurring tasks are reminded and completed with proof photos.
6. **Health, mortality & harvest.** Log mortality (count/cause/photo) feeding survival and biomass;
   record treatments with withdrawal periods; support partial harvests with grade (export/local)
   that reduce biomass and feed revenue.
7. **Financial & ROI.** Record BDT costs and harvest revenue per project; show real-time net
   profit and projected ROI per project and as a portfolio roll-up; finances visible to Owner and
   Partner (read-only), hidden from Worker.
8. **Monitoring, calendar & notifications.** Stream each site's camera (RTSP→HLS/WebRTC), show
   site-local weather, present Bangla-calendar dates with seasonal advisories, and deliver alerts
   via push (MVP) and SMS/WhatsApp (Phase 2), with critical alerts reaching the owner reliably.

## 9. Surfaces and rationale

| Surface | Stack | Why it exists / what it's for |
|---|---|---|
| **backend** | NestJS (TypeScript), modular monolith, Clean Architecture, TypeORM (Data Mapper) + PostgreSQL | The single source of truth and the enforcement point for tenant isolation (NFR-10). Implements the API contract, business rules, alerting, sync endpoints, and audit. One deployment serves the whole portfolio (BR-015). |
| **web** | Next.js (TypeScript) | The owner/partner surface: portfolio dashboard, per-project drill-down, finances, water trends, camera view, weather, reports, membership management. Generated from the shared API contract. |
| **mobile** | React Native (TypeScript), offline-first, Bangla | The worker surface: ≤2-minute daily log, tasks with proof photos, water readings, feeding logs, emergency water event, camera view — all working offline with a sync queue. The make-or-break adoption surface. |
| **shared** | `packages/calendar` (Bangla calendar), `packages/shared` (DTOs/event contracts), `contracts/` (OpenAPI + design tokens) | Contract-first backbone so the three surfaces cannot drift; identical Bangla-calendar behavior on web and mobile. |

## 10. Expected outcomes

- Feed given by disciplined quota, not habit → FCR trends toward ≤ 1.5.
- Water events caught early and alerted → survival held ≥ 80%; no un-alerted oxygen crashes.
- Every operating day has a complete, timestamped worker log the owner can trust.
- Real-time per-project and portfolio net profit / ROI, replacing "wait until harvest."
- Partners see exactly and only their own project — verifiably, by construction.
- A worker who actually uses the app because it is fast, Bangla, offline, and icon-driven.

## 11. Business value

- **Margin protection:** cutting feed waste attacks the largest variable cost directly.
- **Catastrophe avoidance:** early water-event warning prevents whole-batch losses that dwarf any
  software cost.
- **Trustworthy remote operation:** verifiable logs + camera evidence let one owner run several
  sites without being present.
- **Investor confidence:** isolated, read-only partner financials make co-ownership safe and
  transparent.
- **Low run cost:** one modest deployment serves the entire portfolio.

## 12. Scope summary (in / out for v1)

**In scope (v1 — Phase 1 "Core operations", the loss/waste preventers):**
- Project & membership setup, project-scoped access, **tenant isolation** (foundational).
- Pond / batch / stocking setup under a project.
- Feed calculator + schedules + inventory deduction (per project).
- Offline-first, Bangla daily worker log (feed, mortality, water observation).
- Water-quality logging + threshold alerts; emergency water-event flow.
- Basic task reminders.
- Portfolio dashboard + per-project biomass overview.
- Bangla calendar (shared) — foundational for all date display.

**Deferred (Phase 2 — insight & money):** sampling/growth curves/FCR/survival analytics; harvest
management; full financial/ROI module + portfolio roll-up; per-site camera streaming + weather
widget; SMS/WhatsApp alert channel.

**Deferred (Phase 3 — optimization & scale):** health/disease analytics & biosecurity; IoT (DO
sensors, automated aerator alerts/control); multi-pond intelligence & predictive feed adjustment;
Consultant/Vet role; richer partner reporting.

**Out of scope (initial release):** public SaaS / onboarding unrelated third-party farms;
automated hardware control; marketplace/buyer-facing sales; accounting-grade financials
(tax/payroll compliance); native desktop apps.

## 13. Success criteria (KPIs)

| KPI | Target | Traces to |
|---|---|---|
| Overall FCR | ≤ 1.5 | O1 / G1 |
| Survival rate per batch | ≥ 80% | O2 / G2 |
| Daily worker-log completion | 100% of operating days | O3 / G3 |
| Critical water alerts acknowledged | Within SLA (e.g. 15 min) | O2 / NFR |
| Feed cost as % of total cost | Trending down vs baseline | O1 |
| Net profit / projected ROI | Positive and visible in real time | O4 / G4 |
| Cross-project data leakage incidents | 0 | O6 / NFR-10 |

## 14. Assumptions

1. Multiple projects, each at its own site, each with one or more ponds; species are mixed within
   ponds (true polyculture). Feed inventory, worker, finances, camera, and weather are **per
   project**, not shared.
2. Some projects are co-owned with partners who must see only their own project.
3. The worker uses a low-to-mid-range Android phone over intermittent rural connectivity, so
   offline operation is mandatory, not optional.
4. Each site's IP camera exposes an RTSP (or ONVIF) stream that requires a media server to reach
   browsers.
5. Feeding rates are configurable (change with growth stage, temperature, DO), not hard-coded.
6. Money is **BDT — the single currency** (no multi-currency, no FX; ADR-018), formatted South-Asian
   (lakh/crore, ৳, Bengali numerals). Land unit defaults to **bigha** (decimal/katha/bigha
   selectable; ADR-018).
7. Push (FCM) is the MVP alert channel; SMS/WhatsApp arrive in Phase 2.
8. A partner's default visibility is read-only **including** financials (an open question may
   narrow this).

## 15. Risks (`RISK-`)

| ID | Description | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| **RISK-001** | **Cross-project data leakage** — a partner or worker reads/writes another project's data. | Medium | **Severe** (trust/security breach) | Central tenant-isolation layer (NFR-10): project-scope guard + scoped-repository base; every query auto-filtered by `project_id`; isolation tested as a first-class, negative acceptance criterion before any project-owned table is queried. |
| **RISK-002** | **Oxygen crash / water event** causes mass mortality. | Medium | **Catastrophic** (whole batch) | Configurable water thresholds + emergency one-tap alert flow + logged aeration/chain-drag tasks; critical alerts reach owner even if app closed. |
| **RISK-003** | **Worker doesn't adopt the app** (too complex / not offline / not Bangla). | Medium-High | High (system fails its purpose) | Offline-first, Bangla, ≤2-minute logging, icon-driven UI, simple proof photos; usability measured (NFR-8). |
| **RISK-004** | **Connectivity loss at the farm** → lost data / missed alerts. | High | High | Offline sync queue with conflict handling; SMS/WhatsApp fallback for critical alerts (Phase 2). |
| **RISK-005** | **Over-engineering Clean Architecture** delays the MVP. | Medium | Medium (schedule) | Pragmatic per-module layering; ship Phase 1 first; keep ceremony proportional (ADR to be recorded). |
| **RISK-006** | **Camera streaming complexity** underestimated. | Medium | Medium (feature slips) | Treat the media server as its own task; live-only in MVP; defer recording to a later phase. |
| **RISK-007** | **FCR mis-attribution** in polyculture yields misleading metrics. | Medium | Medium (bad decisions) | Compute FCR at pond level only; never fake per-species precision unless feed is physically segregated. |

## 16. Conclusion

The FMS turns an informal, trust-based multi-site prawn/fish operation into a measured one, with
the **Project as a hard tenant-isolation boundary** so a portfolio owner and co-owning partners
can share the platform safely. v1 deliberately ships the loss- and waste-preventing core (Phase 1)
— tenant isolation, ponds/batches, feed discipline, water alerting, and an offline Bangla worker
log — before insight/money (Phase 2) and optimization/scale (Phase 3). The next document, the
Product Specification, decomposes these business requirements into functional (`FR-`) and
non-functional (`NFR-`) requirements with measurable thresholds, each tracing back to a `BR-`
here.

---

*Project Concept Note — Fish Farm Management System. Phase 1 artifact. IDs: BR-001…BR-016, RISK-001…RISK-007.*
