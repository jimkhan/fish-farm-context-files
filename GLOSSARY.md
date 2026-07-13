# Glossary — Fish Farm Management System (FMS)

> The single source of naming truth. Every other document defers to this file for terms,
> canonical entity names, roles, and status vocabulary. If a name here conflicts with a name
> elsewhere, this file wins and the other document is corrected.
>
> Project name / `<name>` slug: **fish-farm** (repos: `fish-farm-context-files`,
> `fish-farm-backend`, `fish-farm-web`, `fish-farm-mobile-app`).

---

## 1. Domain terms

| Term | Definition | Aliases to avoid |
|---|---|---|
| **FMS** | Fish Farm Management System — this product. | "the app", "the platform" (ambiguous across surfaces) |
| **Portfolio** | The full set of projects an Owner belongs to; the roll-up view across them. | "farm group", "org" |
| **Project** | One aquaculture venture at one **site**, with its own location, camera, weather, inventory, worker, finances and ROI. **The tenant / isolation boundary of the whole system.** Contains one or more Ponds. | "farm", "tenant", "site" (site is the physical place; project is the managed unit) |
| **Site** | The physical location (lat/long + address) of a project. One site per project in v1. | "location" (used loosely — prefer "site") |
| **Polyculture** | Raising multiple species together in one pond (SPF Golda + Parse + Carp). | "mixed farming" |
| **SPF Golda** | Specific-Pathogen-Free giant freshwater prawn (*Macrobrachium rosenbergii*) post-larvae. | "shrimp" (Golda is a prawn), "scampi" |
| **Parse** | Mullet variety raised in the polyculture mix. | "parshe" (use "Parse" consistently) |
| **Carp** | Indian/Chinese carp varieties (rui, katla, mrigal, grass carp). | "fish" (too generic) |
| **Species** | A stockable variety (Golda / Parse / Carp / grass carp, etc.); reference data. | "type", "kind" |
| **Stocking** | The event of putting post-larvae / fingerlings into a pond: species, source, count, date, cost. | "seeding", "st-in" |
| **Batch** | The trackable cohort created by a Stocking; carries a running survival estimate (initial count − cumulative mortality). | "lot", "cohort" (use "Batch") |
| **PL (Post-Larvae)** | Juvenile prawns at stocking. | "larvae", "seed" |
| **Fingerling** | Juvenile fish at stocking. | "fry" (fry is an earlier stage; keep distinct) |
| **Biomass** | Total live weight of stock in a pond/batch = (stocked count − cumulative mortality) × latest avg weight, per species. | "stock weight" |
| **Sampling** | Periodic (≈bi-weekly) measurement of per-species sample size and average weight. | "weighing", "measuring" |
| **ADG** | Average Daily Gain — growth-rate metric (g/day). | "daily growth" |
| **SGR** | Specific Growth Rate — growth-rate metric (%/day). | — |
| **FCR** | Feed Conversion Ratio = feed input ÷ biomass gain; lower is better. **Computed at pond level** in polyculture (never faked per-species). | "feed ratio", "feed efficiency" |
| **Survival rate** | (Current estimated live count ÷ initial stocked count) per batch. | "mortality rate" (its inverse; keep distinct) |
| **Mortality** | A logged death event per pond/species: count, suspected cause, optional photo. Feeds the batch survival estimate. | "loss", "death log" |
| **Harvest** | A partial/progressive removal of stock: date, pond, species, quantity, total weight, grade. Reduces biomass and produces revenue. | "catch", "sale" (sale is the financial side) |
| **Feed quota** | The calculated daily feed amount from latest sampling weight × configurable Body-Weight % band, adjusted for temperature/DO. | "feed plan" (feed plan is the presented view) |
| **BW% (Body-Weight %)** | Feed given as a percentage of fish body weight; declining bands from fry → grow-out. | "feed %" |
| **Feed type** | The physical feed product/class: **floating** (Carp/Parse), **sinking / Scampro** (Golda), **Nursery dust** (starter). Floating and sinking have independent schedules. | "food type" |
| **Scampro / Nourish / Nursery dust** | Feed product names: sinking prawn feed / floating feed / starter dust. | — |
| **Check-tray** | A tray used to observe leftover feed and flag over/under-feeding. | "feed tray" (use "check-tray") |
| **DO (Dissolved Oxygen)** | The most critical water parameter for prawn survival (mg/L). | "oxygen level" |
| **Water parameter** | A measured water-quality value: DO, temperature, pH, ammonia, nitrite, alkalinity, transparency (Secchi). | "water metric" |
| **Secchi depth** | Water transparency measure (cm); indicates plankton density. | "clarity" |
| **Safe range / threshold** | Configurable per-parameter bounds; a reading outside range triggers an alert. | "limit" (use "threshold") |
| **Water event / emergency** | A one-tap worker-raised oxygen/water crisis that notifies the owner via the most reliable channel. | "incident" |
| **Chain drag** | Periodic pond-bottom gas-management task (≈30ft chain dragged every 10–15 days). | "bottom raking" |
| **Aeration** | A logged action (running an aerator) tied to a pond to raise DO. | "oxygenation" |
| **Daily Log** | The worker's icon-driven, Bangla, offline-first form capturing feed given, mortalities, and water observations. | "daily report", "diary" |
| **Task** | A scheduled/recurring operational activity (chain drag, liming, grass for grass carp, water exchange) that the worker completes with timestamp + optional proof photo. | "chore", "todo" |
| **Inventory item** | A stocked consumable **per project**: feed types, medicine, lime, nets/chain. Not shared across projects. | "product", "SKU" |
| **Inventory transaction** | A stock movement (receipt, auto-deduction from feeding, adjustment). | "stock move" |
| **Auto-deduction** | Automatic reduction of feed inventory when a feeding is logged. | "consumption" |
| **Financial transaction** | A BDT cost or revenue record scoped to a project (feed, salary, medicine, stocking, equipment, misc; harvest revenue). | "expense", "ledger entry" (use "financial transaction") |
| **ROI** | Return on investment per project (and portfolio roll-up); real-time net profit + projected return. | "profit" (net profit is one input) |
| **Camera** | A per-site IP camera; RTSP stream transcoded to a browser-playable format (HLS/WebRTC) via a media server. | "CCTV", "webcam" |
| **Media server** | Per-site component (e.g. MediaMTX/ffmpeg-based) that transcodes RTSP → HLS/WebRTC. | "transcoder" (fine as description; entity is "media server") |
| **Device** | A hardware unit installed at a pond (e.g. a DO sensor) that can ingest readings. Phase 3 for control. | "sensor" (a sensor is one kind of device) |
| **Weather widget** | Site-local weather keyed to the project's location, highlighting rain/heat that affect feeding and oxygen. | "forecast" |
| **Alert / Notification** | A delivered warning (push + SMS/WhatsApp): threshold breach, water emergency, low stock, missed task, abnormal mortality. | "message" (too generic) |
| **Audit trail** | Immutable record of actor, project, action, entity, timestamp — the basis of remote trust. | "history", "log" (Daily Log is different) |
| **Bangla calendar (Bongabdo / Bangla Shôn)** | Bangladesh's solar civil calendar, Bangla Academy revised (2019). Pohela Boishakh = 14 April. **Not** the West Bengal/sidereal calendar; `Intl`/ICU do not implement these rules. | "Bengali calendar" (fine as synonym), "ICU calendar" (wrong) |
| **Pohela Boishakh** | Bengali New Year (1 Boishakh); fixed to 14 April in Bangladesh. | "Nobo Borsho" (fine informally) |
| **Ritu** | The six Bengali seasons (two months each): Grishmo, Borsha, Sharod, Hemonto, Sheet, Bosonto — used for seasonal aquaculture advisories. | "season" (keep "ritu" for the Bangla concept) |
| **Bengali numerals** | The digit glyphs ০–৯ used in worker-facing dates/numbers. | "Bangla digits" (fine) |
| **Dual-date display** | Owner-facing presentation showing both Bangla and Gregorian dates. | — |
| **Tenant isolation** | The enforced guarantee that every query is scoped to the caller's project memberships; no cross-project read/write. | "multi-tenancy" (isolation is the guarantee, not just the model) |
| **Membership** | A user's role *within* a specific project (Owner/Worker/Partner). Authorization is by membership, not a global role. | "permission", "account role" |
| **Offline-first** | The worker app captures all logs locally and syncs with conflict handling when connectivity returns. | "offline mode" (implies optional) |
| **Sync queue** | The local ordered store of pending offline writes awaiting upload. | "outbox" (fine as description) |
| **AIDLC** | AI-Driven Life-Cycle: specs are the source of truth, code is a build artifact generated per task. | "SDLC" |
| **Contract-first** | The backend implements `contracts/openapi.yaml`; web + mobile clients are generated from the same contract so surfaces cannot drift. | "API-first" (fine as synonym) |

---

## 2. Entities (canonical names → shared data models)

Canonical PascalCase names. DB tables are `snake_case` (e.g. `project_membership`). Every
project-owned entity carries an indexed `project_id` (tenant isolation, NFR-10). "Surfaces"
notes where the entity is primarily produced/consumed.

| Canonical entity | Meaning | Owning parent | Surfaces |
|---|---|---|---|
| **User** | An authenticated person; holds memberships, not a global role. | — | backend, web, mobile |
| **ProjectMembership** | Binds a User to a Project with a role (OWNER/WORKER/PARTNER). | Project + User | backend, web |
| **Project** | The tenant/isolation boundary: site, currency, status. | — | backend, web (portfolio + drill-down) |
| **Pond** | A water body within a project (area in decimal/katha, depth, notes). | Project | backend, web, mobile |
| **Species** | Reference variety (Golda/Parse/Carp…). | — (reference) | backend, shared |
| **Stocking** | A stock-in event for a pond (species, source, count, date, cost). | Pond | backend, web, mobile |
| **Batch** | Cohort created by a Stocking; running survival estimate. | Stocking → Pond | backend, web, mobile |
| **Sampling** | Per-species sample size + average weight over time. | Batch | backend, mobile, web |
| **Mortality** | Death event (count, cause, photo); feeds survival/biomass. | Batch | backend, mobile |
| **Treatment** | A medicine/chemical application to a batch (product, dose, withdrawal days → derived export-safe date). | Batch | backend, web, mobile |
| **Harvest** | Partial/progressive harvest (qty, weight, grade). | Batch | backend, web, mobile |
| **FeedingLog** | A logged feeding (qty_kg, feed inventory item, time); auto-deducts inventory. | Batch + InventoryItem | backend, mobile |
| **InventoryItem** | A per-project consumable (feed/medicine/lime/chain) with stock level + low-stock threshold. | Project | backend, web, mobile |
| **InventoryTxn** | A stock movement (receipt / deduction / adjustment). | InventoryItem → Project | backend, web |
| **WaterReading** | One water-parameter reading (source manual/sensor, parameter, value, read_at). | Pond | backend, mobile |
| **WaterThreshold** | Configurable safe-range bounds per parameter (per project/pond). | Project/Pond | backend, web |
| **Task** | A schedulable/recurring operational activity definition. | Project (per pond) | backend, web, mobile |
| **TaskLog** | A completed task instance (timestamp, optional proof photo). | Task → Pond | backend, mobile |
| **FinancialTxn** | A BDT cost or revenue record scoped to a project. | Project | backend, web |
| **Camera** | A per-site camera + stream configuration. | Project | backend, web |
| **Device** | Installed hardware at a pond (e.g. DO sensor) for ingestion. | Pond → Project | backend |
| **Alert** | A raised/delivered notification event with type + severity + channel. | Project (via source) | backend, web, mobile |
| **AuditEntry** | Immutable actor/project/action/entity/timestamp record. | Project | backend |
| **WeatherSnapshot** | Site-local weather reading keyed to a project's location. | Project | backend, web |

Shared, non-persistent contract types (in `packages/shared` / `contracts/`): DTOs,
domain-event contracts (e.g. `WaterThresholdBreached`), and the Bangla calendar types
(`packages/calendar`).

---

## 3. Roles and actors

**Human roles — always per project via ProjectMembership, never global.**

| Role | Scope | Access summary |
|---|---|---|
| **Owner / Admin** | Member of all projects they own + portfolio view. | Full read/write on owned projects; portfolio roll-up; finances; settings. |
| **Worker** | Exactly one active project at a time. | Operational read/write (logs, tasks, water, feeding, camera view) on their one project. **No finance, no settings.** |
| **Partner / Co-owner** | The specific project(s) they co-own. | **Read-only**, including finances, on their project(s) only. Cannot see any other project. |
| **Consultant / Vet** *(Phase 3)* | Assigned project(s). | Read + treatment notes on assigned project(s). |

**System / external actors**

| Actor | Role in the system |
|---|---|
| **Weather API** | Third-party source of site-local weather (e.g. OpenWeather / BD source). |
| **SMS/WhatsApp gateway** | Delivery channel for critical alerts (Phase 2). |
| **FCM (push)** | Primary MVP push-notification channel. |
| **Media server** | Per-site RTSP→HLS/WebRTC transcoder feeding the camera view. |
| **Sensor / Device** | Optional automated water-reading source via secured ingestion endpoint. |
| **AIDLC coding agent** | Generates code per backlog task from the spec hub (governed by `CLAUDE.md`). |

---

## 4. Status / state vocabulary

Fixed enumerations. Downstream schemas and contracts must use these exact tokens.

| Domain | Allowed values | Notes |
|---|---|---|
| **Membership role** | `OWNER` \| `WORKER` \| `PARTNER` | (`CONSULTANT` reserved, Phase 3). |
| **Project status** | `ACTIVE` \| `CLOSED` | Closed projects are read-only/archived. |
| **Batch status** | `ACTIVE` \| `HARVESTING` \| `CLOSED` | Closed when fully harvested/terminated. |
| **Stocking source** | `HATCHERY` \| `WILD` \| `OTHER` | Free-text hatchery name captured separately. |
| **Water reading source** | `MANUAL` \| `SENSOR` | Sensor readings arrive via secured ingestion. |
| **Water parameter** | `DO` \| `TEMP` \| `PH` \| `AMMONIA` \| `NITRITE` \| `ALKALINITY` \| `SECCHI` | Units defined in the technical spec. |
| **Feed type** | `FLOATING` \| `SINKING` \| `NURSERY_DUST` | Floating vs sinking schedule independently. |
| **Feed observation** | `NORMAL` \| `LEFTOVER` \| `EMPTY` | Check-tray over/under-feeding flag. |
| **Task status** | `SCHEDULED` \| `DUE` \| `DONE` \| `MISSED` | Missed triggers an alert. |
| **Harvest grade** | `EXPORT` \| `LOCAL` | Drives revenue rate. |
| **Alert type** | `WATER_THRESHOLD` \| `WATER_EMERGENCY` \| `LOW_STOCK` \| `MISSED_TASK` \| `ABNORMAL_MORTALITY` | Per NOTIF-2. |
| **Alert severity** | `INFO` \| `WARNING` \| `CRITICAL` | Critical must reach owner even if app closed. |
| **Alert state** | `RAISED` \| `SENT` \| `ACKNOWLEDGED` \| `RESOLVED` | Ack SLA tracked (KPI). |
| **Notification channel** | `PUSH` \| `SMS` \| `WHATSAPP` | Push = MVP; SMS/WhatsApp = Phase 2. |
| **Sync state** (mobile) | `PENDING` \| `SYNCED` \| `CONFLICT` \| `FAILED` | Offline-first queue lifecycle. |
| **Financial txn kind** | `COST` \| `REVENUE` | Categories: feed/salary/medicine/stocking/equipment/misc. |
| **Currency** | `BDT` (single currency; no multi-currency/FX — ADR-018) | Stored as integer minor units (poisha) or `decimal`, never floats; displayed South-Asian (lakh/crore, ৳, Bengali numerals). |
| **Land unit** | `BIGHA` (default) \| `DECIMAL` \| `KATHA` | Pond area unit; bigha default per ADR-018 (~33 decimal/bigha); density advisory computes count ÷ area in the project's unit. |
| **Ritu (season)** | `GRISHMO` \| `BORSHA` \| `SHAROD` \| `HEMONTO` \| `SHEET` \| `BOSONTO` | Two Bangla months each. |
| **Bangla month** | `BOISHAKH` \| `JOISHTHO` \| `ASHARH` \| `SRABON` \| `BHADRO` \| `ASHSHIN` \| `KARTIK` \| `OGROHAYON` \| `POUSH` \| `MAGH` \| `FALGUN` \| `CHOITRO` | Lengths per Bangladesh-revised (2019) rules. |

---

*Glossary — Fish Farm Management System. Phase 1 artifact. Canonical source for all naming.*
