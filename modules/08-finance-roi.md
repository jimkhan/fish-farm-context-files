# MOD-08 — Finance & ROI

**Project:** Fish Farm Management System (FMS) | **Surface:** backend, web | **Version:** 1.0 | **Status:** Not Started
**Owns features:** FT-046, FT-047, FT-048, FT-049
**Contract refs:** CON-032, CON-033, CON-034
**Dependencies:** MOD-01, MOD-03 (consumes `StockingRecorded`, feed-cost, and harvest-revenue events from MOD-04/05/07)

---

## 1. Overview

**Purpose.** Give the owner a real-time, trustworthy money picture per project and across the
portfolio — costs, revenue, net profit, and projected ROI — strictly role-gated so a Worker never
sees it and a Partner sees only their own project's finances. (Phase 2.)

**Scope.** BDT cost recording (feed, salary, medicine, stocking, equipment, misc); harvest revenue
and projected remaining harvest value; real-time net profit and projected ROI per project and as a
portfolio roll-up (optionally per decimal/bigha); finance role gating.

**Position in architecture.** A project-owned domain on MOD-01/MOD-03. It **consumes** cost/revenue
events (`StockingRecorded`, `FeedCostIncurred`, `HarvestRevenueEarned`) to auto-record transactions,
and **provides** per-project net profit to MOD-03's portfolio roll-up. It reads remaining biomass
(MOD-04) for projected harvest value.

**Dependencies.** MOD-01 (scoped repo, events), MOD-03 (project, portfolio). Consumes MOD-04/05/07
events via shared contracts. Reuses MOD-02's capability matrix for role gating.

## 2. Functional details

### 2.1 Core functions
- **F1 — Cost recording (FT-046, FR-045).** Record BDT costs by category (`FEED`, `SALARY`,
  `MEDICINE`, `STOCKING`, `EQUIPMENT`, `MISC`); Owner records manually and some are auto-ingested
  from events. CON-033.
- **F2 — Revenue & remaining harvest value (FT-047, FR-046).** Harvest revenue (auto from harvest
  events) plus projected **remaining harvest value** = remaining biomass × market rate (export vs
  local).
- **F3 — Net profit & projected ROI (FT-048, FR-047).** Real-time net profit and projected ROI per
  project, optionally per decimal/bigha, plus a **portfolio roll-up** across owned projects. CON-034
  (+ feeds CON-035 in MOD-03).
- **F4 — Finance role gating (FT-049, FR-048).** Visible to **Owner** (full) and **Partner**
  (read-only, incl. financials); **hidden from Worker**. Reuses MOD-02's capability matrix.

### 2.2 Sub-modules
- **costs** — cost transactions + event ingestion. State: `financial_txn` (kind=COST).
- **revenue** — revenue transactions + remaining harvest value. State: `financial_txn` (kind=REVENUE).
- **roi** — net profit + projected ROI + portfolio roll-up (pure calc). State: none.
- **finance-rbac** — role gate consuming MOD-02's matrix. State: none.

### 2.3 User interactions
Owner (web): record costs, set market rates, view net profit / projected ROI / portfolio roll-up.
Partner (web): view the same **read-only** for their project(s). Worker: **no access** (finance
hidden). No mobile finance surface.

### 2.4 Business rules & validation
- **R1** Money is integer minor units/decimal (never float); currency is the **project's** currency
  (BDT default) — NFR-015.
- **R2** Cost categories: `FEED`, `SALARY`, `MEDICINE`, `STOCKING`, `EQUIPMENT`, `MISC`; revenue is
  category `HARVEST`.
- **R3** Auto-ingested transactions: `StockingRecorded` → a STOCKING cost; `FeedCostIncurred`
  (inventory receipt) → a FEED cost; `HarvestRevenueEarned` → a HARVEST revenue. Each is
  **idempotent by source reference** (no double counting). Salary/equipment/misc/medicine are manual.
- **R4** Net profit = Σ revenue − Σ cost (recorded transactions). **Projected ROI** =
  (net profit + projected remaining harvest value) ÷ total cost; optionally divided by area
  (per decimal/bigha).
- **R5** Remaining harvest value = Σ over species of remaining biomass × market rate (export/local),
  from MOD-04's read-model; if no market rate is set, use the configured default and flag it.
- **R6** **Role gating (FR-048):** Owner full; Partner read-only (**including** financials — BRD
  default, may be narrowed — **guardrail**); Worker denied. Enforced via MOD-02's capability matrix,
  not re-encoded here.
- **R7** **Cross-project isolation is paramount**: a Partner of project A must never see project B's
  finances; every finance query is project-scoped and, for a Partner, limited to their membership(s).
- **R8** Portfolio roll-up aggregates **owned** projects only; mixed currencies are subtotaled per
  currency (no FX conversion in MVP).
- **R9** No finance writes on a `CLOSED` project (reads still allowed).

### 2.5 Edge cases
1. **Worker requests finance** → 403 (hidden), no data.
2. **Partner writes a transaction** → 403 (read-only); Partner reads → allowed for their project.
3. **Duplicate revenue/cost event** → idempotent by source ref; counted once (R3).
4. **ROI before any revenue** → net profit is negative (costs only); projected ROI uses remaining
   harvest value.
5. **Remaining harvest value with no market rate** → uses default rate, flagged as estimated (R5).
6. **Portfolio with mixed currencies** → per-currency subtotals; no silent summing across currencies.
7. **Partner of A queries B's finance** → denied (403/404), no disclosure (R7).
8. **Negative/again-zero biomass** → remaining harvest value 0, not negative.

### 2.6 Error states
| Trigger | Code / HTTP | Message | Recovery |
|---|---|---|---|
| Worker accesses finance | `FORBIDDEN` / 403 | "Finance is not available for your role." | None (hidden). |
| Partner writes finance | `FORBIDDEN` / 403 | "Partners have read-only access." | None. |
| Partner accesses another project's finance | `FORBIDDEN`/`NOT_FOUND` / 403/404 | "You do not have access to this resource." | None. |
| Invalid amount/category | `VALIDATION` / 400 | "Invalid amount or category." | Fix input. |
| Finance write on closed project | `PROJECT_CLOSED` / 409 | "This project is closed." | Reopen or discard. |

## 3. Non-functional (surfaces: backend, web)
- **NFR-011 (isolation)** — finance is the marquee isolation case: Partner sees only their project
  (AC-115).
- **NFR-015 (money)** — integer minor units/decimal, per-project currency (AC-116).
- **NFR-005 (security)** — finance hidden from Worker; role gate via MOD-02 matrix (AC-113/114).
- **NFR-004 (performance)** — net profit/ROI computed from indexed, scoped transaction sums.

## 4. Technical details

### 4.1 Components
`FinanceModule`: `CostsController`/`RevenueController` (CON-032/033), `SummaryController` (CON-034),
`RoiCalculator` (pure), `RemainingHarvestValueService`, event handlers (`on-stocking`, `on-feed-cost`,
`on-harvest-revenue`), `FinanceRoleGuard` (uses MOD-02 matrix). Web: finance pages (role-gated),
charts, portfolio finance snapshot.

### 4.2 Files / folders
```
# repo: fish-farm-backend
src/modules/finance/
  domain/          financial-txn.entity.ts, category.vo.ts, roi.service.ts, remaining-value.service.ts, events (nothing new; consumes)
  application/     record-cost.usecase.ts, finance-summary.query.ts, on-stocking.handler.ts, on-feed-cost.handler.ts, on-harvest-revenue.handler.ts
  infrastructure/  persistence (financial-txn.model.ts + mapper), market-rate.config.ts
  presentation/    finance.controller.ts, finance-role.guard.ts, dtos
migrations/        00xx_financial_txn.ts

# repo: fish-farm-web
app/projects/[id]/finance/     page.tsx (role-gated)
components/                     NetProfitCard, RoiChart, CostBreakdown, PortfolioFinance
```

### 4.3 State and data
Table: `financial_txn` (id, project_id [idx], kind [COST|REVENUE], category, amount_minor, currency,
occurred_on, source_ref nullable [idempotency], note). Market rates are configuration
(per species/grade). ROI/net profit are computed, not stored.

### 4.4 Key logic
- **Record/ingest:** manual cost or event → upsert `financial_txn` idempotent by `source_ref`.
- **Summary:** Σ cost, Σ revenue → net profit; + remaining harvest value → projected ROI; optional
  ÷ area.
- **Portfolio:** aggregate per-project net profit for owned projects (per currency) → to MOD-03.

### 4.5 Reusable / shared patterns
`RoiCalculator` and `RemainingHarvestValueService` are pure. The finance role gate **reuses**
MOD-02's capability matrix (the single source for "Worker no finance / Partner read-only"). Money
handling follows the shared `Money` type (minor units).

### 4.6 Integration points
- **Consumes:** `StockingRecorded` (MOD-04), `FeedCostIncurred` (MOD-05), `HarvestRevenueEarned`
  (MOD-07); remaining biomass read-model (MOD-04).
- **Provides:** per-project net profit to MOD-03 portfolio roll-up (CON-035).

### 4.7 Contract impact
CON-032 (list txns), CON-033 (create txn), CON-034 (summary) already defined. Market-rate config may
warrant `CON-054` when its UI is detailed; note in the matrix when introduced. No new contract for
the core P2 flows.

### 4.8 Testing notes
Unit: net profit / projected ROI math (AC-111), remaining harvest value (AC-110), idempotent event
ingestion (AC-108/109/117). Integration: **cross-project partner-isolation negative** (AC-115) and
**worker-hidden / partner-read-only** (AC-113/114) are required deliverables. Money-as-minor-units
(AC-116).

## 5. Acceptance criteria

- **AC-107** — *Given* an Owner, *When* they record a BDT cost with a category, *Then* it is stored
  as integer minor units in the project currency. — parent FR-045, NFR-015
- **AC-108** — *Given* a `HarvestRevenueEarned` event, *When* processed, *Then* a HARVEST revenue
  transaction is recorded once (idempotent by source ref). — parent FR-046
- **AC-109** — *Given* `StockingRecorded` / `FeedCostIncurred` events, *When* processed, *Then* the
  corresponding STOCKING/FEED cost transactions are recorded once each. — parent FR-045
- **AC-110** — *Given* remaining biomass and a market rate, *When* remaining harvest value is
  computed, *Then* it equals Σ (remaining biomass × rate) by grade. — parent FR-046
- **AC-111** — *Given* recorded costs and revenue, *When* the summary is requested, *Then* net
  profit = Σrevenue − Σcost and projected ROI is computed, optionally per decimal/bigha. — parent FR-047
- **AC-112** — *Given* an Owner of several projects, *When* the portfolio finance roll-up is
  requested, *Then* it aggregates net profit across **owned** projects (per currency). — parent FR-047
- **AC-113** — *Given* a Worker, *When* they request any finance endpoint, *Then* it returns
  `FORBIDDEN`/403 (finance hidden). — parent FR-048
- **AC-114** — *Given* a Partner, *When* they read their project's finance, *Then* it succeeds
  read-only; a write returns `FORBIDDEN`/403. — parent FR-048
- **AC-115** — *Given* a Partner of project A, *When* they request project B's finance, *Then* it is
  denied with no disclosure (cross-project isolation). — parent FR-048, NFR-011
- **AC-116** — *Given* any monetary value, *When* stored/computed, *Then* it uses integer minor
  units/decimal (never float) in the project currency. — parent NFR-015
- **AC-117** — *Given* a duplicated cost/revenue event, *When* processed, *Then* the transaction is
  counted exactly once (idempotent). — parent FR-046

## 6. Implementation & done

### 6.1 Definition of done
- [ ] All ACs (AC-107…AC-117) tested, including the **partner cross-project isolation** (AC-115) and
  **worker-hidden/partner-read-only** (AC-113/114) deliverables.
- [ ] Integration test: record cost + ingest revenue → summary happy path + one failure (worker or
  cross-project denied).
- [ ] Idempotent event ingestion verified (AC-108/109/117).
- [ ] Migration(s) reversible; `synchronize:false`; money per NFR-015; no secrets.
- [ ] Lint + type-check + tests green; diff self-contained; contract unchanged (or `CON-054` added
  with matrix update for market-rate config).
- [ ] Matrix + tracker updated; human review passed.

### 6.2 Implementation notes
Reuse MOD-02's capability matrix for the role gate — do **not** re-encode "Worker no finance /
Partner read-only" here (avoids drift). Ingest cost/revenue idempotently by `source_ref`. Keep
`RoiCalculator` pure. Portfolio roll-up returns per-currency subtotals; do not sum across currencies.

### 6.3 Risks / caveats
- **Financial data exposure is a severe trust breach** (RISK: financial data exposure /
  cross-project leakage). The partner-isolation and worker-hidden tests are non-negotiable
  deliverables; this is a **guardrail** area (PII/finance).
- Double counting from event + manual entry — the `source_ref` idempotency guard prevents it; manual
  entries for categories that are also event-sourced should be discouraged/validated.

### 6.4 Open questions
- **Partner finance visibility (BRD open question #2):** default is **read-only including
  financials**. If it should be **growth/harvest only**, that is a one-line change to the finance
  role gate (deny Partner) — **confirm before go-live. Guardrail (access/PII).**
- Mixed-currency portfolio roll-up: MVP shows per-currency subtotals (no FX). Confirm no conversion
  is needed for launch.

---

*MOD-08 detail — Fish Farm Management System. Phase 5 artifact. ACs: AC-107…AC-117.*
