# FMS — UI/UX Design Process (Design-First)

> **Purpose.** We are designing the full **web** (owner/partner) and **mobile** (worker) UI *before*
> writing any front-end code, using Claude to generate high-fidelity screen mockups. This file is
> the durable process record — anyone (or any new session) can resume from here.
>
> **Source of truth for content/behavior** stays the spec hub (`PRODUCT_SPECIFICATION.md`,
> `FEATURE_LIST.md`, module docs, `contracts/openapi.yaml`, `contracts/design-tokens.json`,
> `GLOSSARY.md`, `DECISIONS.md`). This file governs only the *design* workflow and prompts.

---

## 0. How this works (the loop)

1. **Design-System Prompt (§1)** — a single reusable "master brief" that establishes brand, tokens,
   roles, localization, component language, and required states. It is **prepended/attached to every
   page prompt** so every screen is visually and behaviorally consistent.
2. **Page & Flow Inventory (§2)** — the complete list of screens for both surfaces, each with an ID,
   priority, audience, and a **status** column (the review tracker).
3. **Per-page prompts (§3)** — one detailed prompt per screen. We proceed **one screen at a time**:
   - Claude (the operator) hands the user the next page prompt (design-system prompt + the page's
     section).
   - The user runs it in Claude design and pastes the output back.
   - Claude **reviews** the output against this brief + the spec, then **confirms** or lists precise
     revisions. On confirm, the screen's status flips to ✅ **Approved** in §2 and notes go in §4.
4. **Review log (§4)** — per-screen review notes + revision history, so decisions survive sessions.

**Output format we ask Claude design for:** a single **self-contained responsive HTML file** (inline
CSS, no external build) that renders the screen at the right breakpoint (desktop for web, a phone
frame ~390px for mobile), uses the **exact token values** below, loads **Inter** + **Noto Sans
Bengali** via Google Fonts, draws icons as inline SVG (lucide style), fills in **realistic content**
(real Bangla text where the surface requires it, ৳ + Bengali numerals for money, dual dates on web),
and **shows every key state** (default, empty, loading, error/degraded, role-denied, offline/sync as
applicable) either inline or as labeled variants. Mobile screens must look like a native RN app, not
a web page.

---

## 1. THE DESIGN-SYSTEM PROMPT (attach to every page prompt)

> Copy everything in this block as the top of each page request.

```
You are a senior product designer creating a high-fidelity UI mockup for the **Fish Farm Management
System (FMS)** — a multi-project aquaculture (pond farming) management platform used in Bangladesh.
Produce a SINGLE self-contained, responsive HTML file (inline CSS only; inline SVG icons in the
lucide style; load Inter and Noto Sans Bengali from Google Fonts). Modern, clean, calm, and smart —
generous whitespace, clear hierarchy, confident restraint. No lorem ipsum: use realistic domain
content. Show the key states described for the screen.

## The product & who uses it
A remote OWNER runs 2–4 pond "projects" (each a farm site) from a web dashboard. Each site has one
WORKER who logs daily operations from a phone. Some projects have a read-only PARTNER (investor).
The **Project is the tenant boundary** — one project's data must never bleed into another. Stock is
polyculture: SPF Golda (giant freshwater prawn), Parse (mullet), and Carp varieties.

Three roles (design for the one named per screen):
- OWNER — WEB. Full read/write on owned projects + a cross-project portfolio. Sees finances & settings.
- PARTNER — WEB, READ-ONLY, incl. finances, on their co-owned project(s) only. No portfolio of
  projects they don't belong to; no write controls, no settings, no member admin.
- WORKER — MOBILE ONLY, offline-first, 100% Bangla. Operational logging (feed, water, mortality,
  tasks, emergency, camera) on their ONE assigned project. NEVER sees finance or settings.
Role-gating is HIDDEN, not disabled: a role that can't see something sees no trace of it (no greyed
buttons). Never reveal another project's existence.

## Brand & visual tokens (use these exact values — they are the shipped design tokens)
Brand: primary teal #0E7490 (water/aquaculture), primaryDark #155E75, accent #0891B2.
Neutrals: bg #F8FAFC, surface #FFFFFF, border #E2E8F0, textPrimary #0F172A, textSecondary #475569,
textInverse #FFFFFF.
Alert severity: info #0284C7, warning #D97706, critical #DC2626 (oxygen/water emergency).
Status: ok/positive #16A34A, muted #94A3B8, danger #DC2626.
Type: base font "Inter, system-ui, sans-serif"; Bangla font "'Noto Sans Bengali','Hind Siliguri',
sans-serif"; mono "JetBrains Mono". Sizes px: xs12 sm14 md16(base) lg20 xl24 2xl32. Weights 400/500/700.
Line-height tight1.2 / normal1.5.
Spacing px: 4,8,12,16,24,32; mobile min tap target 48px.
Radius px: sm6, md10, lg16, pill999. Shadow card "0 1px 3px rgba(15,23,42,.08)", modal
"0 10px 30px rgba(15,23,42,.18)". Icon sizes px: 20 / 28 / 40 (icon-first worker actions).
Icons: lucide set (inline SVG). This is a single-brand, water-calm, high-contrast, low-literacy-
friendly system. Tokens are a refinable starting point — you may tune shades subtly for polish but
keep the teal identity, the severity palette, and the accessibility intent.

## Localization (hard rules — this is a Bangladesh product)
- WEB (owner/partner): **dual dates** everywhere — Gregorian + Bangla in parens, e.g.
  "2026-07-21 (৫ শ্রাবণ ১৪৩৩)". Money and money-adjacent numbers use **Bengali numerals**.
- MOBILE (worker): **100% Bangla** — every label, number (Bengali numerals ০–৯), and date (Bangla
  calendar, single date) is Bangla. Icon-first with Bangla captions. Show a season (ritu) where noted
  (e.g. বর্ষা/monsoon, গ্রীষ্ম/summer).
- Money: BDT only. Format "৳" + Bengali numerals + South-Asian lakh/crore grouping, whole taka, no
  decimals. Examples: ৳৬,৫০০ ; ৳১,২৩,৪৫৬ ; a loss as -৳৮০০ in red. Never Western "1,234.00".
- Never use a Western/`Intl` Bangla calendar; dates come from the app's own calendar package.
- General numbers on WEB may be Western except money; on MOBILE all numbers are Bengali numerals.

## Required states & patterns (design them, don't ignore them)
- Degraded/unavailable: any widget backed by an external service (camera, weather) that is down shows
  a calm "temporarily unavailable — the rest of the page is unaffected" state (warning triangle, muted
  surface), NEVER a crash or blank. Weather can also be "stale" (cached, out of date).
- Empty: purposeful empty states with a one-line explanation + primary action (no dead ends).
- Loading: skeletons/placeholders, not spinners-only where content is substantial.
- Closed project: a read-only/archived banner; write controls hidden.
- MOBILE offline/sync: every write is optimistic and instantly "saved". Show a global connectivity +
  pending-sync indicator, and per-item sync state — PENDING (queued), SYNCED, CONFLICT, FAILED (retry).
  Offline copy in Bangla, e.g. "অফলাইন — সংরক্ষিত, পরে সিংক হবে" (Offline — saved, will sync later).
- Status vocabulary (use as badges, exact set): Batch ACTIVE/HARVESTING/CLOSED; Task
  SCHEDULED/DUE/DONE/MISSED; Alert severity INFO/WARNING/CRITICAL; Alert state
  RAISED/SENT/ACKNOWLEDGED/RESOLVED; Feed observation NORMAL/LEFTOVER/EMPTY; Harvest grade
  EXPORT/LOCAL; Sync PENDING/SYNCED/CONFLICT/FAILED.
- Accessibility: WCAG 2.1 AA on web (contrast, visible focus ring in brand accent, keyboard nav,
  aria on status/icons). Mobile: ≥48px targets, high contrast, minimal typing.

## Deliver
A polished, presentation-ready mockup of the ONE screen described below, in the design language above.
Prefer clarity over decoration. Label any state variants you include.
```

---

## 2. PAGE & FLOW INVENTORY + REVIEW TRACKER

Status legend: ⬜ not started · 🟡 prompt issued / awaiting output · 🔵 in review · ✅ approved (design
reviewed) · ☑︎ human-approved, **not yet design-reviewed** (pending the batch review in §5).
Priority: **P1** v1 · **P2** phase-2 · **P3** later. "Built" = a stub/real page already exists in
`fish-farm-web` (extend, don't contradict).

### Exported design files — `design/Design_System/` (authoritative mapping)

The full HTML mockup bundle lives in **`fish-farm-context-files/design/Design_System/`** (tokens/,
components/, guidelines/, ui_kits/{owner_web,partner_web,worker_mobile}/, plus one HTML per screen
batch). **The design tool auto-numbered the files by page order, which drifts from the tracker IDs
below** — this table is the source of truth for which file holds which screen:

| File in `design/Design_System/` | Tracker screen IDs |
|---|---|
| `F-01 Design Language.html` | F-01 |
| `F-02 Mobile Design Language.html` | F-02 |
| `W-03 Portfolio Dashboard.html` | W-03 |
| `W-04 Project Overview.html` | W-04 |
| `W-07 Water Quality.html` | W-07 |
| `W-08 Alerts Centre.html` | W-08 |
| `W-05 Feed & W-06 Inventory.html` | **W-09** (Feed + Inventory) |
| `W-10 Health & W-11 Growth.html` | W-10 + W-11 |
| `W-12 Ponds & W-13 Harvest.html` | **W-06** (Ponds) + **W-12** (Harvest) |
| `W-14 Finance & W-15 Tasks.html` | **W-13** (Finance) + **W-14** (Tasks) |
| `W-09 Camera & W-16 Weather.html` | **W-15** (Camera) + W-16 (Weather) |
| `W-17 Reports, Settings & Members.html` | W-17 + W-18 + W-19 |
| `W-01 Login, W-02 Reset, W-20 Project Form & W-21 Account.html` | W-01 + W-02 + **W-05** (Project form) + **W-20** (Account) |
| `M-01 Login, M-04 Feeding & M-05 Water Reading.html` | M-01 + M-04 + M-05 |
| `M-02 Home Today.html` | M-02 |
| `M-03 Daily Log.html` | M-03 |
| `M-06 Mortality & Sampling, M-07 Tasks.html` | M-06 + M-07 |
| `M-08 Water Emergency, M-09 Camera & M-10 Sync Status.html` | M-08 + M-09 + M-10 |

> **Recommended cleanup before build:** rename the drifted files to their tracker IDs so file names
> and this doc agree (e.g. `W-14 Finance…` → `W-13-W-14-finance-tasks.html`). Not blocking.

### Foundation
| ID | Screen | Surface | Pri | Purpose | Status |
|----|--------|---------|-----|---------|--------|
| F-01 | Design language / component gallery | web | P1 | Lock colors, type (Latin+Bangla), buttons, inputs, cards, badges, alerts, dual-date, money, states | ✅ |
| F-02 | Mobile design language / component kit | mobile | P1 | Lock the Bangla, icon-first, big-target mobile kit + sync/offline chrome | ✅ |

### Web — Owner / Partner (Next.js dashboard)
| ID | Screen / Route | Pri | Audience | Purpose | Status |
|----|----------------|-----|----------|---------|--------|
| W-01 | Login `/login` (built) | P1 | public | Sign in; clean, trustworthy, dual-brand | ✅ |
| W-02 | Password reset (request + confirm) | P1 | public | Channel-neutral reset; no account-enumeration | ✅ |
| W-03 | Portfolio dashboard `/portfolio` | P1 | Owner (Partner scoped) | Cross-project roll-up: biomass, open critical alerts, net-profit snapshot, per-project cards; project switcher | ✅ |
| W-04 | Project shell + overview `/projects/{id}` | P1 | Owner, Partner | Per-project header, domain nav, overview KPIs (biomass, survival, active alerts, ponds/batches) | ✅ |
| W-05 | Project create/edit + inline first pond | P1 | Owner | Form: name, site (map/lat-long+address), land unit (bigha), status; atomic first-pond | ✅ |
| W-06 | Ponds & batches | P1 | Owner, Partner | Pond(s), stocking, batch detail (density advisory, biomass, survival) | ✅ |
| W-07 | Water quality + trends `/water` | P2 | Owner, Partner (config=Owner) | Readings, thresholds config, per-parameter trend chart + falling-dawn-DO advisory | ✅ |
| W-08 | Alerts / notifications center | P1 | Owner, Partner | Alert list (type/severity/state), acknowledge (Owner) with SLA | ✅ |
| W-09 | Feed & inventory (2 screens) | P1/P2 | Owner, Partner | Feed plan/quota (+adjustment reason), feeding logs, inventory items/txns, low-stock | ✅ |
| W-10 | Health (mortality + treatments) | P1/P2 | Owner, Partner | Mortality log + spike flag, treatments + withdrawal-window advisory | ✅ |
| W-11 | Growth (sampling, ADG/SGR, FCR) | P2 | Owner, Partner | Sampling, growth analytics, pond FCR + survival | ✅ |
| W-12 | Harvest | P2 | Owner, Partner | Partial/full harvest records, grade, revenue | ✅ |
| W-13 | Finance (built) | P2 | Owner + Partner (RO); hidden from Worker | Net profit, projected ROI, cost/revenue breakdown, record cost (Owner) | ✅ |
| W-14 | Tasks | P1 | Owner (define), Partner (view) | Recurring task defs, due list, completion logs w/ proof photo, missed-task | ✅ |
| W-15 | Monitoring — Camera | P2 | Owner, Partner | HLS/WebRTC live player + offline/degraded state | ✅ |
| W-16 | Monitoring — Weather | P2 | Owner, Partner | Site weather w/ heavy-rain/heat highlights + stale/unavailable states | ✅ |
| W-17 | Reports (daily summary + exports) | P2 | Owner, Partner (fin export gated) | Daily summary, dual dates, CSV export buttons | ✅ |
| W-18 | Settings (project, thresholds, market rates) | P1 | Owner only | Project settings + water thresholds + market rates | ✅ |
| W-19 | Members admin `/projects/{id}/members` | P1 | Owner only | List/invite-by-email+role/remove; 409 invariants as UI errors | ✅ |
| W-20 | Account screen `/me` | P1 | authenticated | User email + memberships/roles; sign out | ✅ |

### Mobile — Worker (React Native, offline-first, 100% Bangla)
| ID | Screen | Pri | Purpose | Status |
|----|--------|-----|---------|--------|
| M-01 | Login | P1 | Simple Bangla sign-in; lands scoped to one project | ✅ |
| M-02 | Home / Today | P1 | Today's tasks, quick-log tiles, sync status, Bangla date + ritu, weather, active alert | ✅ |
| M-03 | Daily Log (composite) | P1 | The ≤2-min, ≤~10-tap icon-first feed+mortality+water log with photo | ✅ |
| M-04 | Feeding | P1 | Log against today's feed plan; check-tray NORMAL/LEFTOVER/EMPTY | ✅ |
| M-05 | Water reading | P1 | 7-parameter capture (DO/temp/pH/…); aeration/chain-drag log | ✅ |
| M-06 | Mortality / Sampling | P1 | Mortality w/ photo; sampling (size + avg weight) | ✅ |
| M-07 | Tasks | P1 | Due list; complete offline w/ timestamp + proof photo; missed indicator | ✅ |
| M-08 | Water Emergency | P1 | One-tap CRITICAL raise; offline "will send when online" | ✅ |
| M-09 | Camera view | P2 | Live site stream; offline placeholder | ✅ |
| M-10 | Sync / Queue status | P1 | Pending/synced/conflict/failed items; last sync; retry/conflict review | ✅ |

Suggested design order: **F-01 → F-02** (lock both languages), then web **W-03, W-04** (the shell &
portfolio set the pattern), then mobile **M-02, M-03** (home + the make-or-break daily log), then fan
out by priority. Login/reset (W-01/W-02/M-01) are quick and can slot in early.

---

## 3. PER-PAGE PROMPTS

Each subsection = the page-specific brief to paste **after** the Design-System Prompt (§1). Written
as we reach each screen (keeps turns focused). Template for new entries:

```
### <ID> — <Screen name> (<surface>, <audience>)
**Goal:** <what the user accomplishes>
**Layout:** <structure/regions>
**Data shown:** <real fields + example content, with localization rendering>
**Primary actions:** <buttons/flows and who can do them>
**States to include:** <default / empty / loading / degraded / role / offline-sync as relevant>
**Localization:** <dual-date vs 100% Bangla; money; ritu; specific Bangla strings>
**Notes:** <spec refs, gotchas, patterns to honor>
```

### F-01 — Design language & core components (web, all owner/partner surfaces)
**Goal:** Establish and prove the whole web visual system on one page, so every later screen inherits it.
**Layout:** A single scrollable "style guide" page with clearly titled sections.
**Data shown / sections to render:**
- **Brand & color:** swatches for brand (teal), neutrals, severity (info/warning/critical), status
  (ok/muted/danger) with hex labels.
- **Typography:** the Inter scale (xs→2xl) with sample text; a **Bangla** block in Noto Sans Bengali
  showing labels, Bengali numerals ০১২৩৪৫৬৭৮৯, and a dual date "2026-07-21 (৫ শ্রাবণ ১৪৩৩)".
- **Money:** ৳ examples in Bengali numerals — ৳৬,৫০০ (profit, green), -৳৮০০ (loss, red), ৳১,২৩,৪৫৬.
- **Buttons:** primary/secondary/ghost/danger, default+hover+focus(visible ring)+disabled, three sizes.
- **Inputs:** text, number (with unit), select, date (dual-date affordance), with label + help + error.
- **Cards:** the base surface card + a KPI stat card (label, big number, delta).
- **Badges:** the full status vocabulary (Batch, Task, Alert severity & state, Feed obs, Grade, Sync).
- **Alert banners:** info/warning/critical inline banners.
- **Degraded widget:** the "temporarily unavailable — rest of page unaffected" pattern.
- **Empty state:** a reusable empty pattern (icon + line + action).
- **Nav chrome:** the top app bar (FMS mark, project switcher, user chip) and the per-project domain
  tab bar (Overview, Ponds, Water, Feed, Health, Growth, Harvest, Finance, Tasks, Camera, Weather,
  Reports, Members, Settings).
**States to include:** show button/input default+focus+error+disabled; card default; degraded + empty.
**Localization:** web = dual date + Bengali-numeral money; include the Bangla type specimen block.
**Notes:** This is the contract every later web prompt references ("use the F-01 system"). Honor the
existing `DegradedWidget` copy and the shipped tokens. Clean, calm, water-themed, WCAG-AA contrast.

### F-02 — Mobile design language & component kit (mobile, WORKER)
**Goal:** Lock the worker app's visual system — 100% Bangla, icon-first, big-target — plus the
offline/sync chrome that has no web equivalent. Every later mobile screen inherits this.
**Layout:** A style-guide page presenting components inside/beside a ~390px phone frame; labeled sections.
**Sections:** app chrome (header w/ project + sync pill + Bangla date/ritu, bottom nav); Bangla type
scale; icon-first action tiles; buttons (≥48px); big number stepper (minimal typing); segmented
chips; photo capture; list rows (task + log entry w/ sync badge); **sync & connectivity chrome**
(offline banner, pending count, 4 sync-state badges); save toast; emergency button + confirm sheet;
empty / loading / camera-offline states; Bangla status badges.
**Localization:** 100% Bangla, Bengali numerals everywhere, single Bangla date + ritu. Bangla glossary
supplied in the prompt (needs native-speaker validation before build).
**Notes:** Distinct from web — this is a native RN app for a rural, low-literacy, outdoor,
one-handed, intermittent-connectivity user. Optimistic writes; ≤2-min / ≤~10-tap daily log.

### W-03 — Portfolio dashboard (web, OWNER; Partner variant)
**Goal:** The owner's landing page — "is anything wrong, and how are my farms doing?" answered in
one glance, then drill down. Alert prominence is the #1 UX principle here.
**Layout:** F-01 app bar → page header (greeting + dual date) → portfolio KPI row → critical-alert
strip → project cards grid → (empty/degraded/loading/Partner variants).
**Data:** `GET /portfolio/summary` — total biomass kg, open critical alert count, portfolio net
profit; per project: name, location, status, biomass, active alerts, net profit, worker, last activity.
**States:** default (3 projects, one with a CRITICAL alert), empty (no projects), degraded, loading,
**Partner variant** (only co-owned project(s); no cross-project totals; no create/settings).
**Localization:** dual dates; money ৳ + Bengali numerals; other figures Western.
**Notes:** Never disclose a project the viewer isn't a member of. Drill-down, not overload.

### W-04 — Project shell + overview (web, OWNER + PARTNER)
**Goal:** The per-project home. Establishes the navigation chrome every domain page lives inside,
and answers "how is THIS farm doing?" **This screen settles the 14-tab overflow question.**
**Layout:** app bar → project header (name, location, status, worker, dual date) → domain navigation
(role-conditional, with an explicit overflow strategy) → overview KPI row → active alerts → pond/batch
summary → recent activity.
**States:** default (Owner), **Partner variant** (no Members/Settings in nav, no write actions),
**CLOSED project** (read-only banner, write affordances hidden), degraded, loading.
**Notes:** Nav must gracefully carry ~14 domains at 1280px — designer proposes scroll+fade vs "More"
menu vs grouped/sidebar, and justifies. Members + Settings are Owner-only and must be absent (not
greyed) for Partner.

---

## 3b. LOCKED NAVIGATION DECISION (binding for every web screen)

**Decided at W-04, supersedes the horizontal tab bar sketched in F-01.**

The per-project navigation is a **grouped left sidebar**, not a tab bar:

```
OPERATIONS       Overview · Ponds · Water [badge] · Feed · Tasks [badge]
STOCK & GROWTH   Inventory · Health · Growth · Harvest
BUSINESS         Finance · Reports
MONITORING       Camera · Weather
ADMIN · OWNER ONLY   Members · Settings
```

Why it won: all ~14 areas stay visible at 1280px with zero overflow; the daily-use areas sit together
under Operations; **live counts render as badges in the nav itself** (Water ·2, Tasks ·3) so urgent
items surface without opening anything; new domains drop into a group without a "More" menu ever
hiding something critical.

Role/lifecycle rules: the **ADMIN group is absent entirely for Partner** (never greyed). On a CLOSED
project, Monitoring (live camera/weather) is dropped and badges disappear — but every historical
domain stays browsable.

### M-03 — Daily Log, composite (mobile, WORKER) — the adoption-critical screen
**Goal:** feed + mortality + water logged in **≤2 minutes and ≤~10 taps**, offline, minimal typing.
**Layout:** designer chooses single scrolling composite vs. 3-step flow, and must annotate the tap
count. Pond picker → খাবার (stepper + type + check-tray chips) → মৃত্যু (stepper + optional photo) →
পানি (DO/temp) → one optimistic save.
**States:** default, partial (only one section filled), offline save + toast, photo captured, success.
**Notes:** F-02 kit + the two corrections (fish-off mortality mark; only mg/L & pH in Latin).
No keyboard — steppers and chips. This screen decides worker adoption (RISK-003).

### W-07 — Water quality + trends (web, OWNER + PARTNER) — the domain-page template
**Goal:** the richest domain page; establishes the reusable pattern (readings list + chart +
config + advisory) that Feed/Health/Growth/Harvest/Tasks pages will all inherit.
**Data:** readings per pond/parameter, per-parameter trend chart over a window, the **falling-dawn-DO
PatternAdvisory** (CON-059 — non-null only for DO when a decline is currently active), and
safe-range thresholds (Owner-configurable).
**States:** default, advisory active, no-advisory, empty, degraded, loading, Partner (no threshold
config), CLOSED.
**Notes:** the advisory is a *pattern* signal distinct from an instantaneous breach — it can fire
while every single reading is still in range. Thresholds config is OWNER-ONLY.

### W-08 — Alerts / notifications centre (web, OWNER + PARTNER)
**Goal:** the cross-cutting alert inbox + acknowledgement workflow. Distinct from the W-07 domain
template — this is a triage queue, not a data page.
**Data:** alert type (WATER_THRESHOLD / WATER_EMERGENCY / LOW_STOCK / MISSED_TASK /
ABNORMAL_MORTALITY), severity (INFO/WARNING/CRITICAL), lifecycle state (RAISED → SENT →
ACKNOWLEDGED → RESOLVED), pond/source, dual timestamps, acknowledger.
**States:** default queue, critical-unacknowledged past SLA, all-clear/empty, degraded, loading,
**Partner (view-only — NO Acknowledge control anywhere)**.
**Notes:** critical alerts have a ~15-minute acknowledgement SLA and re-notify on breach.

### W-09 — Feed (Operations) + Inventory (Stock & Growth) — batched pair
**Goal:** the feed loop — what to feed today, what was actually fed, and whether stock will last.
Two screens in one prompt, both following the W-07 domain template.
**Feed page:** today's plan per feed type (floating for Carp/Parse, sinking for Golda), the
temp/DO **adjustment reason**, feeding logs w/ check-tray observation, consumption trend.
**Inventory page:** items + stock levels, reorder thresholds, receipt/adjustment ledger, low-stock.
**Notes:** feeding auto-deducts inventory — show that link explicitly. Low-stock ties to W-08's
LOW_STOCK alert. Owner writes; Partner read-only.

### W-10 + W-11 — Health & Growth — batched pair
**Health:** mortality log + spike detection, treatments with withdrawal-window advisory (export-safe
date). **Growth:** samplings, ADG/SGR per species, pond-level FCR + survival.
**Notes:** both follow the W-07 template. Null-safety matters — ADG/SGR need ≥2 samplings and FCR
needs biomass gain; never fabricate a number, show an explicit "not computable yet" state.
Withdrawal window must block/flag EXPORT-grade harvest.

### W-06 + W-12 — Ponds & Batches + Harvest — batched pair (stock lifecycle)
**Goal:** the stock lifecycle end-to-end — pond → stocking → batch → harvest. Harvest must honour
the **withdrawal window** designed in W-10 (EXPORT-grade blocked until the export-safe date).
**Notes:** density advisory = count ÷ area (bigha); polyculture means multiple batches per pond;
harvest reduces biomass and feeds revenue (money in ৳ Bengali numerals).

---

## 3c. DATA-INTEGRITY INVARIANTS (binding — quote in every remaining prompt)

Arithmetic errors have appeared in three consecutive batches (W-09, W-12, W-06). Mockups get checked
by stakeholders who *do* the sums; a figure that doesn't add up undermines the design. Every screen
must satisfy:

1. **Column totals = sum of the rows shown.** (Stock value, stocking cost, harvest revenue, feed kg.)
2. **Row-level derivations must compute.** `qty × unit cost = line value`; `weight × price/kg =
   revenue`; `landed ÷ projected = %`.
3. **Biomass is bounded by physical reality:** `biomass = alive × avg weight`, where
   `alive = stocked − cumulative mortality − harvested pieces`. Therefore **biomass can never exceed
   `stocked × avg weight`**.
4. **Cumulative harvested pieces per batch ≤ stocked pieces.** You cannot land more animals than
   were put in.
5. **Standing biomass and remaining-to-harvest must reconcile** — "remaining to harvest" is the
   current standing biomass (optionally grown), not an unrelated number.
6. **Cross-screen anchors are fixed.** Once a figure is approved on one screen, every other screen
   uses it: **total stocked 42,000 · cumulative mortality 3,360 · alive 38,640 · survival 92% ·
   standing biomass 1,840 kg · FCR 1.62 · export-safe date 2026-08-09 (২৪ শ্রাবণ ১৪৩৩) · today
   2026-07-21 (৫ শ্রাবণ ১৪৩৩)**. Pond areas: A2 1.5 · J1 2.0 · B3 1.2 · C1 1.0 bigha (5.7 total).
7. **One fixture timeline.** A pond's stocking date/age must be identical on every screen.

---

## 3d. FINAL BATCH REVIEW (planned)

When every screen is designed, the HTML files are exported to **`fish-farm-context-files/design/`**
(named by screen id — `W-13-finance.html`, `M-04-feeding.html`, …). The operator then reads them
directly from disk and runs one consolidated pass covering:

1. **Screens never operator-reviewed** — currently W-13, W-14 (see log below).
2. **The §3c data-integrity sweep across every screen at once** — this is the only way to catch
   cross-screen contradictions (the 42,000-vs-42,500 class of error), which per-screen review misses.
3. **Outstanding fixes issued but not re-verified** — M-03 stepper alignment, W-07 critical-floor
   relabel, W-09 inventory arithmetic + polyculture feed lines, W-06/W-12 data pass.
4. **Locked-convention conformance** — sidebar nav (§3b), role-gating (hidden not disabled),
   dual dates, ৳ + Bengali numerals, the seven status vocabularies.

---

## 4. REVIEW LOG (per-screen decisions & revisions)

### §5 CONSOLIDATED BATCH REVIEW — 2026-07-25 — all 30 screens design-reviewed ✅

The full HTML bundle landed in `design/Design_System/`. The 13 screens previously only human-approved
(☑︎) were read in full and reviewed against the brief + §3c data-integrity invariants (via parallel
agents, one per file). **Result: every un-reviewed screen PASSES.** No blocking/critical issues in any
file. Notably: **W-13 Finance arithmetic reconciles exactly** (net profit −৳২,৫৭,৪০০ = 156,600 −
414,000; ROI 155% via the open formula; cost categories sum to ৳৪,১৪,০০০ and 100%) and the
security-critical **Worker-finance-denied** state leaks no figures, Partner is read-only. The
**offline emergency guarantee** (M-08) is present and exact, and the **mortality icon is a fish-off
mark, not a skull** (M-06). No Western digits or Gregorian dates leaked into any mobile screen.

**Outstanding fixes — all LOW/MEDIUM, none blocking. Apply on the next regen of each file:**

| # | Sev | File(s) | Fix |
|---|-----|---------|-----|
| A | MED | `W-14 Finance & W-15 Tasks` | Partner rendered **"A. Rahman / 30% stake"** — must be the anchor **Anwar Hossain** (used on every other screen). |
| B | MED | `W-14 Finance…` + `W-17 Reports…` | **Ashar Bangla dates off by one.** With the (correct, consistent) anchor 1 Srabon = 2026-07-17, the Ashar rows are 1 day high: 07-15 should be ৩০ আষাঢ় (not ৩১), 07-14 → ২৯ (not ৩০), 07-12 → ২৭, 07-08 → ২৩. Decrement each Ashar date by one. |
| C | MED | `W-14 Finance…` + `W-12 Ponds & W-13 Harvest` | Reconcile **"remaining harvest value"**: Finance shows ৳৯,০০,০০০ = 1,200 kg × ৳৭৫০ — consistent with Harvest's "remaining to harvest 1,200 kg", but Ponds shows standing biomass 1,840 kg. Settle the model (standing 1,840, of which 1,200 kg expected to land) and make Finance's figure follow it. Folds into the pending W-06/W-12 data pass. |
| D | MED | `W-17 Reports, Settings & Members` | Settings **Project details is missing the currency row** — add **৳ BDT · Fixed (not editable)**, matching W-05's project form. |
| E | LOW | `W-14 Finance…` | A few **Gregorian-only** sub-labels ("Cycle to date · since 2026-04-20", missed-panel/completion timestamps, "All done" header) — make dual. Also the amount placeholder "e.g. 8,500" → Bengali. |
| F | LOW | mobile files | **Tap targets < 48px**: back-chevron 40px, pond-change "বদলান" 34px, retry/detail 44px, player controls 44px, missed-task "এখন করুন" 44px. Raise to ≥48px (primary actions already comply). |
| G | LOW | `M-08…Sync` / `W-09 Camera…` | Cosmetic: M-10 count-tile label "সিংক" → the full "সিংক হয়েছে"; CONNECTING frames labelled "shimmer" actually render a spinner (intent — not a frozen box — is met); W-17 mortality delta uses a ▲ with down-styling. |

**Cross-screen anchors verified consistent across the whole set:** owner Rahima Khatun, worker Karim
Uddin, project Meghna Gher / Debidwar Cumilla, 4 ponds A2/J1/B3/C1, DO safe 4.0–8.0 / critical 3.0,
Pond A2 DO 2.1 mg/L + export-safe 2026-08-09 (২৪ শ্রাবণ ১৪৩৩), today 2026-07-21 (৫ শ্রাবণ ১৪৩৩ · বর্ষা).
The two remaining data-model items to settle before build are **(B)** the Ashar calendar off-by-one
(a mockup-only conversion slip — the real `@fish-farm/calendar` package computes these correctly) and
**(C)** the remaining-harvest-value / standing-biomass relationship (already open from W-06/W-12).

---

### W-17 + W-18 + W-19 — 2026-07-25 — ☑︎ HUMAN-APPROVED, NOT DESIGN-REVIEWED

Accepted by the human; output not seen by the operator. Unverified and worth checking in the §5 pass:
Reports' **zero-activity day** (must show honest zeros + water status OK, not an error and not a
fabricated worse status) and the **financial-export role gate**; Settings' thresholds **matching the
Water screen exactly** (DO safe 4.0–8.0, critical 3.0) and the market-rate → Finance
"remaining harvest value" linkage; Members' two guardrails (**worker-already-active-elsewhere** and
**last-owner-cannot-be-removed**) reading as protected rules rather than generic errors.

### W-15 + W-16 — 2026-07-22 — ☑︎ HUMAN-APPROVED, NOT DESIGN-REVIEWED

Accepted by the human; output not seen by the operator. Unverified: the camera OFFLINE / CONNECTING /
NO-CAMERA-CONFIGURED ladder, the "raw RTSP never reaches the client" note, and — most importantly —
the weather **STALE (cached)** treatment, which must mark last-known values as out-of-date rather
than presenting them as current. Check in the §5 batch review.

### W-13 + W-14 — 2026-07-22 — ☑︎ HUMAN-APPROVED, NOT DESIGN-REVIEWED

Delivered as a `claude.ai/design` share link, which is auth-gated (WebFetch → 403), so the operator
could not inspect it. **The human reviewed it and accepted it.** No verification was performed of:
the net-profit/ROI arithmetic, the cost-breakdown percentages, the ledger totals, or — most
importantly — the **WORKER role-denied state** (finance must leak no figure at all). All of these
are outstanding and must be checked in the §5 batch review once the HTML lands in the repo.

**File-naming drift to reconcile:** the delivered file is titled "W-14 Finance & W-15 Tasks"; in this
tracker Finance is **W-13**, Tasks is **W-14**, and W-15 is Camera. Rename on import so the design
files and the review log agree.

### W-06 + W-12 — 2026-07-22 — ✅ DESIGN APPROVED · data-consistency pass required

**The withdrawal gate is the best interaction produced so far.** EXPORT is genuinely unselectable for
Pond A2 with an explicit reason and countdown, LOCAL stays available, and the copy makes it a
constraint rather than a hint: *"This constraint cannot be overridden from the harvest form. It clears
only when the withdrawal period ends, or if the treatment record is corrected on the Health screen."*
It even names its own source of truth (Health → Treatments) and carries the identical date
2026-08-09 (২৪ শ্রাবণ ১৪৩৩). A food-safety rule expressed as a real system constraint.

**Also verified:** the density advisory reuses the amber "ADVISORY · NOT A HARD LIMIT" language and
**all seven density calculations are correct** (12,000÷1.5=8,000; 3,600÷1.5=2,400; 12,000÷2.0=6,000;
4,000÷2.0=2,000; 2,400÷1.2=2,000; 3,000÷1.2=2,500; 5,500÷1.0=5,500), with per-species ranges and an
explicit **"No range configured for Parse mullet — density is recorded but not assessed"** instead of
an invented range. The advisory correctly links over-stocking to A2's DO crash and mortality spike —
the third screen to connect that causal chain. Water area 1.5+2.0+1.2+1.0=5.7 ✓. Harvest-progress
panel reconciles perfectly (480÷620=77%, 160÷420=38%, landed 640 + remaining 1,200 = 1,840 = 35%).
DEGRADED is excellent: density assessment unavailable, *"The advisory can't fire without it, so it
says so plainly rather than showing a false 'all clear'."* EMPTY (Pond D4, added but unstocked) and
both PARTNER variants are correct.

**Data-consistency pass required (violations of §3c):**
- **Biomass exceeds the physical maximum on 5 of 7 batches** — A2 Rui (3,600×62.0=223 kg, shows 300),
  J1 Parse (4,000×40.0=160, shows 240), B3 Rui/Catla (2,400×95.0=228, shows 250), B3 Parse
  (3,000×45.0=135, shows 160), C1 Golda (5,500×34.0=187, shows 270). Only A2 Golda and J1 Golda obey
  `biomass ≤ stocked × avg weight`.
- **C1 harvested 13,500 pieces (3,000+4,700+5,800) from a 5,500-piece stocking** — impossible.
- **Stocking cost total** shows ৳১,২০,৫০০ (120,500); rows sum to 122,500.
- **Harvest revenue**: B3 row 160 kg × ৳৩৪০ = ৳৫৪,৪০০, shown ৳৫৪,৮০০. Revenue total shows ৳৫,৮৯,৭৫০
  (589,750); rows sum to 550,150.
- **Total stocked 42,500 here vs the approved 42,000** on W-04/W-10/W-11 (which drives survival 92%).
- **Standing biomass 1,840 kg (Ponds) vs remaining-to-harvest 1,200 kg (Harvest)** — with 640 kg
  already landed these describe the same stock and must reconcile.

### W-10 + W-11 — 2026-07-22 — ✅ BOTH APPROVED (2 trivial continuity nits) — strongest batch yet

**Every derived number reconciles, and the derivations are shown.** The W-09 arithmetic lesson was
fully absorbed: 3,360/42,000 = 8.0%; 42,000 − 3,360 = 38,640 = 92%; ADG (28.4 − 24.2) ÷ 10 = 0.42;
**SGR (ln 28.4 − ln 24.2) ÷ 10 × 100 = 1.6 — mathematically correct**; FCR 405 ÷ 250 = 1.62 with the
gain itself derived (670 − 420). Withdrawal dates check out too: 2026-07-19 + 21 days = 2026-08-09,
and "19 days left" from 07-21 is right. Growth even states "Shared with the Health screen's survival
estimate — same inputs, one source of truth."

**Health:** the spike advisory mirrors W-07's treatment (amber, "ANOMALY · NOT A FIXED THRESHOLD"),
explains the actual detection rule including the minimum-count guard — matching the backend
`SpikeDetector`'s real design — and **cross-links the two signals**: "Likely cause: Pond A2 dissolved
oxygen crashed to 2.1 mg/L this morning — the system linked these two signals for you." All five
cause categories, proof-photo counts, offline-sync origin. **Treatments are handled with proper
regulatory seriousness**: dose, applied date, withdrawal period, computed export-safe date, a red
"EXPORT-grade harvest not permitted until…" banner with a days-left counter, plus the real-world
nuance that "Local-market harvest rules may differ". EMPTY is framed as good news. **DEGRADED states
that withdrawal dates are always shown even when analytics are down** — exactly right: regulatory
data must never be hidden by an outage.

**Growth:** the null-safety rule is implemented exactly as the backend enforces it — ADG/SGR withheld
below two samplings, FCR withheld without positive biomass gain, each with the *reason* and an
unblocking action ("showing '0' or a trend line would be fabricated"). The GROWTH ANOMALY variant
surfaces negative ADG as amber and honestly lists "non-representative sample" among likely causes.
FCR's ▼-is-good semantic is made legible ("lower is better").

**Nits (no re-run):** (1) the sampling log is labelled "latest first" but row 3 (07-21 10:40, SPF
Golda) sits below a 07-11 row — fix the sort. (2) Pond C1's stocking age drifts across variants
("2 days ago" in W-09 Feed, "3 days ago" in Growth EMPTY) — pin one timeline for the fixture data.

### W-09 — 2026-07-22 — ✅ APPROVED (2 data-accuracy fixes) — batching validated

**The adjustment reason is the win.** Each auto-reduced quota shows the rule, the cause, the delta
(10 kg → 8 kg) *and the reasoning* — "Fish eat less and consume more oxygen digesting when DO is low…
Restores automatically when DO recovers" / "Above the comfort band — appetite and digestion drop in
warm water… prevent leftover feed fouling the pond." The owner never sees an unexplained machine
number. Exactly the intent.

**Domain accuracy verified:** the species→feed-type mapping is right (SPF Golda prawn → SINKING,
Carp/Parse → FLOATING), matching the backend's own rule; floating/sinking totals are split; the
check-tray badges carry their operational meaning ("LEFTOVER signals over-feeding; EMPTY can mean
under-feeding — both feed back into tomorrow's quota"); an offline-origin feeding row is marked
"synced offline"; the feed KPI "Grower feed cover · 6 days left" links straight to Inventory, and
Inventory's LOW row (45 kg vs 100 kg reorder) matches W-08's LOW_STOCK alert exactly. Feed EMPTY
explains the real dependency (no sampling → no biomass → no quota) and offers "Create sampling task".
**DEGRADED gives operational guidance** — "Feed to yesterday's ration until this recovers" — which is
genuinely useful rather than decorative.

**Fixes required:**
1. **Inventory totals don't reconcile.** "Total stock value ৳১,৮৮,২০০" (188,200) vs the sum of the
   Stock value column ≈ ৳৫৫,১২০. Also Starter feed: 160 kg × ৳৬৮ = ৳১০,৮৮০, shown as ৳১০,৯৬০.
   Make every derived figure add up — stakeholders check the arithmetic.
2. **Polyculture feed types.** Pond A2 is "SPF Golda prawn + Rui carp" but shows a single SINKING
   line. Per FR-018 the floating and sinking schedules run independently, so a mixed pond should show
   BOTH rations (sinking for the prawn batch, floating for the carp batch). Confirm the intended
   model and render per-batch feed lines for mixed ponds.

**Not verified (cut off in the submitted screens):** Inventory's full stock-movement ledger, the
"Record stock movement" panel, and Inventory's EMPTY / DEGRADED / LOADING / PARTNER variants.

### W-08 — 2026-07-22 — ✅ APPROVED (no fixes) — first clean pass

**Correctly framed as a triage queue, not a data page**, and grouped by urgency (NEEDS ACTION →
EARLIER TODAY → RESOLVED) so the urgent is unmissable and everything else recedes.

**SLA is the standout.** Unacknowledged criticals carry an elapsed-time progress bar against the
15-minute SLA, a distinct "SLA breached · re-notified" badge, and a plain-language footer stating
what actually happened ("15-min SLA breached 3 min ago — worker & owner re-notified at 09:38" /
"escalated to owner"). That is the escalation model made legible.

**Verified:** all five alert types and the full lifecycle vocabulary used correctly; severity filters
carry counts; provenance distinguishes worker / auto sensor / inventory monitor / task scheduler; the
expanded row shows the complete trail (RAISED → SENT → ACKNOWLEDGED with "11 min after raise" and the
acknowledger), the delivery channel, and links through to the relevant domain page. Resolved items
explain their own auto-resolution ("after 2 readings in range"). **ALL CLEAR** applies W-07's
philosophy consistently — reassuring, with a "Monitor active · last check 2 min ago" pill rather than
a blank page. **DEGRADED carries a genuinely excellent line**: "Critical push notifications are still
delivered directly to your phone" — it reassures that safety-critical delivery does not depend on
this page. **PARTNER**: same data incl. SLA status and who acknowledged, no Acknowledge control and
no bulk action; the awaiting-owner rows read "Owner acknowledges" with a lock — accepted as a
*status label* rather than a disabled control, since it usefully communicates who owes the action.

**Consistency win:** this page already states "below the 3.0 critical floor", matching the W-07
threshold fix — no contradiction between the two screens.

### W-07 — 2026-07-22 — ✅ APPROVED (1 data-consistency fix) — **DOMAIN-PAGE TEMPLATE LOCKED**

**The reusable skeleton is now fixed** and self-documented on the page: *header → filters → headline
KPI state → early-warning advisory → trend chart → readings table → config panel*. Feed, Health,
Growth, Harvest and Tasks should all copy this, swapping only parameters/series/thresholds.

**The advisory is the standout.** It is amber (clearly distinct from the red critical treatment),
badged "TREND WARNING · NOT A THRESHOLD BREACH", shows the declining run (7.0 → 6.5 → 6.0 → 2.1) with
a dual-date range, and *explains the domain reasoning* — dawn is when oxygen is lowest because there
is no overnight photosynthesis, so a steady dawn decline is the earliest reliable warning. It also
states plainly that it can fire while individual readings are still in the safe band. Its actions are
notifications ("Notify worker to check aeration"), never equipment control — the M-02 lesson held.

**Also verified:** all 7 parameters in the filter; window 7/14/30d; equal-height KPIs with ▲ carets
and provenance (Auto sensor vs Karim Uddin); chart shades the safe band, marks the critical line, and
**visually separates dawn vs midday series** with dual-date axis labels; readings table flags `dawn`
rows, shows source avatars and OK/WARNING/CRITICAL badges, with pagination; thresholds panel covers
all 7 parameters with a live edit row and notes that changes are audit-logged with name + dual date.
**NO-ADVISORY variant is exactly right** — an explicit "No early-warning pattern detected… the
monitor is active and checking every morning" rather than an empty space, so absence is meaningful.
EMPTY explains what belongs there and offers the action that actually helps (create a reading task /
notify the worker). DEGRADED downgrades only the chart while KPIs and table stay live. **PARTNER**:
identical data, advisory carries no action buttons, no Notify worker, thresholds show "Managed by
owner" with an explicit "cannot be edited from a partner account" note.

**Fix required — threshold mislabel:** the chart's red dashed line sits at **4.0** but is labelled
**"Critical floor 4.0"**. Per the page's own thresholds panel, DO safe-min = 4.0 and **critical =
3.0**. Relabel that line "Safe minimum 4.0" and draw the true critical floor at 3.0 (ideally show
both). The KPI card already says "below 3.0 safe floor", so the chart currently contradicts the rest
of the page — and this is exactly the warning-vs-critical distinction the product hinges on.

**Nit:** the amber-highlighted dawn points (the declining advisory run) aren't in the chart legend —
add an entry so the encoding is self-explanatory.

### M-03 — 2026-07-22 — ✅ APPROVED (1 alignment fix)

**The adoption-critical screen delivers.** Structure: a **single scrolling form** (not a wizard) —
the right call for tap economy. **Tap budget annotated and met**: "পুকুর ০ · খাবার ১ · মৃত্যু ০ ·
পানি ৪ · সংরক্ষণ ১ = ৬ ট্যাপ" — six taps for a normal morning, well inside the ~10 budget.

**Verified correct:** keyboard-free throughout (steppers + chips only). Smart defaults do the work —
pond pre-selected (০ taps), feed pre-filled to today's plan so "as planned" is one confirming tap,
mortality defaults to ০ and is toggled OFF with "কোনো মৃত্যু নেই — বাদ থাকবে". Every section is
skippable and a running footer states exactly what will/won't be saved ("খাবার ও পানি সংরক্ষণ হবে ·
মৃত্যু বাদ"). Extra water parameters hide behind "আরও প্যারামিটার (pH · অ্যামোনিয়া)" so the default
path stays short. Photo is explicitly optional ("ছবি (প্রমাণ · ঐচ্ছিক)"). Date now matches the set
(৫ শ্রাবণ ১৪৩৩) — the M-02 nit was applied.

**The M-02 scope correction was applied correctly:** a low DO (২.১ mg/L) turns the field red and
raises an inline danger card whose action is **"জরুরি জানান"** — a thing the system genuinely does.
The footer states it outright: "কোনো এয়ারেটর/যন্ত্র নিয়ন্ত্রণ নেই — শুধু জরুরি জানানোর পথ". The ৪ mg/L
threshold also matches the seeded backend DO minimum.

OFFLINE SAVE and SUCCESS are both strong — the offline confirmation ("ফোনে সংরক্ষিত") lists all
three saved parts with অপেক্ষমাণ badges, and the success screen is a genuine small-win moment
("লগ সম্পন্ন! আজকের কাজ শেষ, করিম") with a clear route home. That is the habit loop the product runs on.

**Fix required (reported by the human reviewer):** in the খাবার section the stepper's value+unit are
mis-aligned — the large Bengali numeral and its small unit (১০ / কেজি) are not baseline-aligned or
optically centred in the value box, and the box geometry drifts between the DEFAULT and FILLED
states. Baseline-align value and unit, optically centre the pair, and keep every stepper identical
in width/height across sections and states.

### M-02 — 2026-07-21 — ✅ APPROVED (1 scope correction)

**Both F-02 corrections applied:** mortality is now a red **fish-off** mark (no skull) ✅; units
localised with only `mg/L`/`pH` left Latin (২৯° সে, ১২ কেজি) ✅.

**Verified correct:** 100% Bangla incl. Bengali numerals in the status bar, times, temps and
percentages; single Bangla date + ritu ("৭ শ্রাবণ ১৪৩৩ · বর্ষা"), no Gregorian. Attention priority is
exactly right — critical oxygen alert first, then tasks, then quick-log. The alert card doesn't just
warn, it **says what to do**. Weather is actionable and feeding/oxygen-relevant ("ভারী বৃষ্টি — খাবার
কমান, অক্সিজেন খেয়াল রাখুন") and correctly shown in its stale/cached form. Tasks show a remaining
count + all three states. **OFFLINE state is the standout**: amber pill + verbatim banner, pending
count (৭টি অপেক্ষমাণ), per-entry অপেক্ষমাণ / ব্যর্থ+আবার badges, weather falls back to last-known —
and the screen stays completely usable, i.e. offline reads as normal rather than broken. The
জরুরি subtitle even swaps to the offline guarantee ("অফলাইনেও কাজ করে — সংযোগ পেলেই পাঠানো হবে").
EMPTY state is warm and personal ("শুভ সকাল, করিম") and points at the tiles. LOADING keeps the real
header so context is never lost — good judgment beyond the brief.

**Scope correction (must fix):** the critical-alert card renders **"এয়ারেটর চালু করুন" as a tappable
button**, which implies the app can remotely start an aerator. **Aerator control is an explicit
Phase-3 non-goal** (BACKLOG TASK-027). Keep the wording as *instruction text*, and make the actual
button something the system really does — e.g. জরুরি জানান / মালিককে জানান (raise emergency / notify
owner). Never render an actuation control the backend cannot perform.

**Nit:** M-02 dates to ৭ শ্রাবণ while W-03/W-04 use ৫ শ্রাবণ. Harmless, but pin one reference date
across the set for a coherent presentation.

### W-04 — 2026-07-21 — ✅ APPROVED (1 carry-forward fix)

**The navigation decision is correct and is now locked (see §3b).** The grouped left sidebar solves
the 14-area problem properly, and putting live counts *in the nav* (Water ·2, Tasks ·3) is a genuine
improvement over the brief — urgency is visible before you click anything.

**Verified correct:** ▲/▼ carets restored on delta chips (W-03 nit fixed). Four equal-height KPIs;
Survival estimate shows its derivation ("Stocked 42,000 − 3,360 lost") — good transparency. Active
alerts panel w/ Acknowledge, dual timestamps, provenance. **Recent activity feed** attributes every
log to Karim Uddin with dual timestamps — this is exactly how a remote owner verifies work happened,
which is a stated product goal. Ponds & batches table shows polyculture (SPF Golda · Carp / · Parse),
bigha areas, batch badges (ACTIVE/HARVESTING), and flags the critical pond in red incl. a "Gasping"
water state. **PARTNER variant: ADMIN group entirely absent, no Acknowledge controls anywhere,
finance still visible** — the W-03 carry-forward note was applied correctly. CLOSED variant re-labels
KPIs for a finished cycle ("Final biomass / At harvest close", "Cycle total"), drops Active alerts,
and its banner explicitly lists *acknowledging* among hidden write actions — thoughtful. Degraded
(activity feed only) and Loading skeletons both correct.

**Carry-forward fix:** the CLOSED-project sidebar drops **STOCK & GROWTH** (Inventory/Health/Growth/
Harvest). That contradicts its own banner ("All data stays visible for reference") — post-cycle
harvest and growth history is precisely what an owner reviews. Keep Stock & Growth present and
read-only on CLOSED. Dropping MONITORING on CLOSED is accepted as intentional (no live site).

### W-03 — 2026-07-21 — ✅ APPROVED

**Verified correct:** F-01 chrome reused faithfully. **Alert prominence achieved** — the "Open
critical alerts: 2" KPI is rendered in critical red (tinted surface + red border + red icon) and is
unmistakably the loudest element, followed by a dedicated red "Critical alerts — act now" strip with
project·pond·what-happened, relative + dual timestamps, provenance (worker-raised vs auto sensor —
a nice nod to the sensor-ingestion path), and per-alert Acknowledge. KPI cards are **equal height**
(the F-01 carry-forward nit is fixed). Restrained delta chips + subtle sparklines, no decorative
arrows. Money ৳৪,২১,০০০ / ৳৬,৮৫,০০০ in Bengali numerals; non-money (1,840 kg) Western — rule correct.
Dual dates throughout. CLOSED project card correctly muted, relabelled "Final biomass", no write
affordances. All four variants delivered: EMPTY (deliberately no zeroed KPI row — good judgment),
DEGRADED (KPI row degrades, project list still renders — page never blanks), LOADING (shimmer
skeletons), and **PARTNER** — scoped to their one co-owned project, no cross-project totals, no
"New project", no settings, no hint another project exists, finance visible (correct: Partner is
read-only *including* finance). Isolation handled exactly right.

**Carry-forward nits (not worth a re-run):**
- Delta chips lost the ▲/▼ caret F-01 established ("6.1% this week" vs "▲ 6.1% this week"). Restore
  the caret on later screens for direction-at-a-glance.
- The CLOSED card's footer truncates ("cycle ended 2026-06-30 (১৬…"). Allow wrap or shorten.
- **Accepted enhancement:** ritu ("· বর্ষা") was added to the web date line. Not required on web, but
  a good contextual touch — **standardise it** on web page headers going forward.
- For W-08 (alerts): Partner may VIEW alerts but must never see an Acknowledge control.

### F-02 — 2026-07-21 — ✅ APPROVED (2 binding corrections carried forward)

**Verified correct:** phone chrome w/ Bengali-numeral status bar, teal header, project name, amber
offline pill + verbatim banner "অফলাইন — সংরক্ষিত, পরে সিংক হবে", single Bangla date + ritu
"৫ শ্রাবণ ১৪৩৩ · বর্ষা" (no Gregorian ✓), pending count "৭টি অপেক্ষমাণ", 5-item bottom nav.
Bangla type scale correctly biased larger than web (base 18px vs 16). Bengali numerals everywhere
incl. times/quantities. Icon tiles ≥108px w/ 40px icons. Buttons ≥52px. **Big stepper** (−/+ ≥56px,
"কোনো কীবোর্ড নেই") + compact variant — minimal-typing goal met. Segmented chips ≥52px. Photo
capture empty→captured w/ retake. List rows w/ per-item sync badges. **All 4 sync states** in Bangla
+ retry. Save toast confirms local save *and* later upload. **Emergency**: oversized red trigger,
confirm sheet, and the offline variant "অফলাইন — সংযোগ পেলেই সাথে সাথে পাঠানো হবে" — the OI-3 safety
constraint handled exactly right. Empty / skeleton / camera-offline states all Bangla.

**Binding corrections — apply to EVERY mobile screen from here:**
1. **Mortality icon must NOT be a skull (☠).** It is morbid and culturally jarring for routine daily
   logging. Use a fish-based mark instead (fish + minus, or a "fish-off" glyph), or a neutral
   loss/down indicator. Keep the red tint for domain colour.
2. **Scientific units** — "mg/L" was left in Latin while °সে and কেজি were localised. Pick one rule
   and hold it. **Open decision for the native reviewer:** keep `mg/L`/`pH` in Latin (common
   convention, compact) vs. full Bangla (মি.গ্রা./লি.). Until decided, keep Latin for `mg/L`/`pH`
   only and localise every other unit.

**Accepted as intentional:** the header pill *and* the full-width offline banner are redundant by
design — justified for a low-literacy, high-stakes context.

**Open:** all Bangla copy still needs native-speaker validation before build (esp. sync vocabulary).

_(Appended as screens are reviewed. Format: ID — date — verdict — notes/changes requested.)_

### F-01 — 2026-07-21 — 🔵 Accepted with 3 revisions

**Verified correct (locked as the reference):**
- Tokens exact: brand `#0E7490`/`#155E75`/`#0891B2`, neutrals, severity `#0284C7`/`#D97706`/`#DC2626`,
  status `#16A34A`/`#94A3B8`/`#DC2626`.
- Type: Inter scale (xs12→2xl32) + Noto Sans Bengali specimen with Bengali numerals ০–৯.
- **Localization correct**: dual date `2026-07-21 (৫ শ্রাবণ ১৪৩৩)`; money `৳৬,৫০০` / `-৳৮০০` (red) /
  `৳১,২৩,৪৫৬` lakh-grouped, whole taka; non-money web figures stay Western (`1,840 kg`) — exactly the rule.
- Buttons 4 variants × default/hover/focus(ring)/disabled × 3 sizes; inputs incl. number+unit
  (kg/bigha), dual-date field, and an error state.
- **Full status vocabulary present and correct** (Batch, Task, Alert severity, Alert state, Feed
  observation, Harvest grade, Sync) — all 7 groups.
- Alert banners info/warning/critical; degraded copy matches the shipped `DegradedWidget`
  ("…temporarily unavailable. The rest of this page is unaffected."); stale-cache + empty states good.
- Nav chrome: app bar (FMS mark, project switcher, bell, settings, user chip w/ role) + domain tab bar
  + project meta line with dual date.

**Revisions requested:**
1. **KPI stat cards** — the oversized green arrow graphics are decorative clip-art and dominate the
   card. Replace with a restrained delta: a small chip (`▲ 8.4%` in status-ok) and, if a trend is
   wanted, a subtle inline sparkline (~24px tall, 1.5px stroke, muted). "Clarity over decoration."
2. **Add a loading/skeleton pattern** — required by the system prompt but missing. Add shimmer
   placeholders for a KPI card + a table row.
3. **Add the closed-project read-only banner** — required pattern, missing. Neutral/muted banner:
   "This project is closed and read-only." with write controls hidden.

**Deferred (decide at W-04, not a blocker):** the 14-tab domain bar overflows ("Weathe…"). Needs an
explicit overflow strategy (horizontal scroll w/ fade, or a "More" menu) and role-conditional tabs
(Members/Settings are Owner-only; Partner sees neither).

**Minor/optional:** `textInverse` swatch absent; dual dates render in mono — prefer the base font for
dates in production screens.

**2026-07-21 — revision round 2 → ✅ APPROVED.** All three revisions verified:
1. KPI arrows replaced with restrained delta chips (`▲ 8.4% this week` in status-ok; `▼ 3.2% vs last
   month` in danger) + a subtle muted sparkline. The number is the hero again.
2. Loading section added — KPI-card skeleton + two table-row skeletons, soft shimmer, no spinners.
3. Closed-project banner added — archive icon, neutral/muted, calm copy: "This project is closed and
   read-only… Write actions … are hidden while the project is archived." Correctly non-alarming.
**F-01 is now the locked web reference.** Later web prompts should say "use the F-01 design language."
_Carry-forward nit (apply on real screens, not worth re-running F-01): KPI cards in a row should be
equal height — the Biomass card had trailing dead space vs. Net profit._
