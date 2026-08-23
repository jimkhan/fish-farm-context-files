# Traceability Matrix — Fish Farm Management System (FMS)

> Version 1.0 · 2026-07-05 · Phase 6 artifact. Coverage proof across the AIDLC spine
> `BR → FR/NFR → FT → MOD → AC → TASK`, per surface. Every `FR-001…FR-061` traces to ≥1 `FT`,
> ≥1 `AC`, and ≥1 `TASK`; every `NFR-001…NFR-016` has ≥1 `TASK`; every `CON-` endpoint is
> implemented (backend) and consumed (client) by a task. Cells reference the **delivering** task;
> where a surface is bundled into a shell/consumer card that is noted. Authored after the Phase-6
> closure pass (added TASK-046…TASK-050, CON-047, CON-048).

---

## 1. BR → FR roll-up (every BR delivers ≥1 FR)

| BR | Theme | FRs |
|---|---|---|
| BR-001 | Portfolio oversight + drill-down | FR-007, FR-008, FR-010, FR-047 |
| BR-002 | Per-project isolation | FR-003, FR-011, FR-042 |
| BR-003 | Per-project role-based access | FR-001, FR-002, FR-003, FR-004, FR-006, FR-009, FR-048 |
| BR-004 | Offline Bangla daily ops | FR-033, FR-034 |
| BR-005 | Reduce feed waste | FR-016, FR-017, FR-018, FR-019, FR-021, FR-037 |
| BR-006 | Prevent stock loss (water) | FR-017, FR-022, FR-023, FR-024, FR-025, FR-026, FR-030 |
| BR-007 | Real-time finance/ROI | FR-045, FR-046, FR-047, FR-048, FR-040, FR-056 |
| BR-008 | Verifiable remote tasks | FR-031, FR-032, FR-055 |
| BR-009 | Remote view: camera + weather | FR-049, FR-050, FR-051 |
| BR-010 | Bangla calendar | FR-057, FR-058, FR-059, FR-060, FR-061 |
| BR-011 | Stock & growth tracking | FR-012, FR-013, FR-014, FR-015, FR-027, FR-028, FR-029, FR-035, FR-036, FR-038 |
| BR-012 | Feed/consumable inventory | FR-020, FR-042, FR-043, FR-044 |
| BR-013 | Reliable critical alerts | FR-052, FR-053, FR-054 |
| BR-014 | Audit trail | FR-005 |
| BR-015 | Low-cost single deployment | (NFR-010 — see §3) |
| BR-016 | Partial harvests | FR-039, FR-040, FR-041 |

All 16 BRs → ≥1 FR (BR-015 is realized through NFR-010 + TASK-048). ✅

---

## 2. Forward trace — FR → FT → Surface(s) → MOD → TASK(s)

Surface legend per cell: **B** backend · **W** web · **M** mobile · **S** shared.
"Delivered by" lists the task that builds the surface; *(consumes)* marks a shell/consumer card.

| FR | FT | Target surfaces | MOD | Delivering TASK(s) |
|---|---|---|---|---|
| FR-001 | FT-008 | B, W, M | MOD-02 | TASK-008 (B); TASK-013 (W consumes); TASK-042 (M consumes) |
| FR-002 | FT-010 | B | MOD-02 | TASK-010 |
| FR-003 | FT-003, FT-004 | B | MOD-01 | TASK-004 |
| FR-004 | FT-010 | B, W, M | MOD-02 | TASK-010 (B); TASK-034/047 (W gating); TASK-042 (M hides finance) |
| FR-005 | FT-005 | B | MOD-01 | TASK-005 |
| FR-006 | FT-009 | B, W | MOD-02 | TASK-009 (B); **TASK-046 (W)** |
| FR-007 | FT-012 | B, W | MOD-03 | TASK-011 (B); TASK-014 (W) |
| FR-008 | FT-013 | B, W | MOD-03/04 | TASK-011 + TASK-018 (B adapter); TASK-014 (W inline first pond) |
| FR-009 | FT-011 | B, W | MOD-02 | TASK-010 (B); **TASK-047 (W)** |
| FR-010 | FT-015 | W, B | MOD-03 | TASK-012 (B); TASK-014 (W) |
| FR-011 | FT-014 | B, W, M | MOD-03 | TASK-011 (B); TASK-013/014 (W); TASK-042 (M single-project binding) |
| FR-012 | FT-018 | B, W, M | MOD-04 | TASK-018 (B); TASK-014 (W inline) + **TASK-052 (W multi-pond)** · M — see §6 R1 |
| FR-013 | FT-019 | B, W, M | MOD-04 | TASK-019 (B); CON-048 species lookup TASK-018; **TASK-052 (W stocking UI)**; M — §6 R1 |
| FR-014 | FT-020 | B | MOD-04 | TASK-019 |
| FR-015 | FT-021 | W, M | MOD-04 | TASK-019 (B calc); **TASK-052 (W density advisory)**; M — §6 R1 |
| FR-016 | FT-023 | B | MOD-05 | TASK-021 |
| FR-017 | FT-024 | B | MOD-05 | TASK-021 |
| FR-018 | FT-025 | B, M | MOD-05 | TASK-021 (B); TASK-043 (M) |
| FR-019 | FT-026 | M, B | MOD-05 | TASK-021 (B reminders); TASK-044 (M local reminders) |
| FR-020 | FT-027 | B, M | MOD-05 | TASK-022 (B); TASK-043 (M) |
| FR-021 | FT-028 | M | MOD-05 | TASK-043 (M check-tray) |
| FR-022 | FT-032, FT-037 | B, M | MOD-06 | TASK-023, TASK-027 (B); TASK-043 (M) |
| FR-023 | FT-033 | B, W | MOD-06 | TASK-023 (B); TASK-039 (W thresholds view) |
| FR-024 | FT-034 | W | MOD-06 | TASK-026 (B data) + TASK-039 (W charts) |
| FR-025 | FT-035 | B, M | MOD-06 | TASK-025 (B); TASK-043/044 (M) · CON-050 reserved |
| FR-026 | FT-036 | M, B | MOD-06 | TASK-024 (B); TASK-043 (M emergency) |
| FR-027 | FT-038 | B, M | MOD-07 | TASK-028 (B); TASK-043 (M) |
| FR-028 | FT-020, FT-038 | B | MOD-04/07 | TASK-019 + TASK-028 |
| FR-029 | FT-039 | B, W, M | MOD-07 | TASK-028 (B, done — CON-051 delivered) · W treatments UI (P2) |
| FR-030 | FT-040 | B | MOD-07 | TASK-028 |
| FR-031 | FT-067 | B, W, M | MOD-12 | TASK-041 (B); TASK-044 (M); W task-def UI — §6 R2 |
| FR-032 | FT-068 | M | MOD-12 | TASK-044 |
| FR-033 | FT-066 | M | MOD-12 | TASK-043 |
| FR-034 | FT-064, FT-065 | M, B | MOD-12 | TASK-040 (B); TASK-042 (M engine) |
| FR-035 | FT-041 | B, M, W | MOD-07 | TASK-029 (B, done — CON-052 delivered for ADG/SGR); TASK-043 (M) · W sampling view (P2) |
| FR-036 | FT-042 | B, W | MOD-07 | TASK-029 (B, done — CON-052 delivered for ADG/SGR) · W growth charts (P2) |
| FR-037 | FT-043 | B, W | MOD-07 | TASK-030 (B) · W FCR view (P2) |
| FR-038 | FT-022 | B, W | MOD-04 | TASK-019 (B); TASK-012/014 (W biomass overview) + **TASK-052 (W per-batch)** |
| FR-039 | FT-044 | B, W, M | MOD-07 | TASK-031 (B); W/M harvest UI (P2) |
| FR-040 | FT-044 | B | MOD-07 | TASK-031 |
| FR-041 | FT-045 | W | MOD-07 | TASK-031 (B data) · W progress view CON-053 reserved (P2) |
| FR-042 | FT-029 | B, W, M | MOD-05 | TASK-020 (B); W/M inventory UI (P2 web, M via daily log) |
| FR-043 | FT-030 | B, W | MOD-05 | TASK-020 (B); TASK-039 (W alert surfacing) |
| FR-044 | FT-031 | B | MOD-05 | TASK-020 |
| FR-045 | FT-046 | B, W | MOD-08 | TASK-032 (B); TASK-034 (W) |
| FR-046 | FT-047 | B, W | MOD-08 | TASK-031/032 (B); TASK-034 (W) |
| FR-047 | FT-048 | W, B | MOD-08 | TASK-033 (B); TASK-034 (W) |
| FR-048 | FT-049 | B, W | MOD-08 | TASK-032 (B gate); TASK-034/038 (W) |
| FR-049 | FT-053, FT-069 | W, B, M | MOD-10/12 | TASK-035 (B); TASK-039 (W); TASK-045 (M) |
| FR-050 | FT-054 | W, B | MOD-10 | TASK-035 (B policy); TASK-039 (W) |
| FR-051 | FT-055 | W, B | MOD-10 | TASK-036 (B); TASK-039 (W) |
| FR-052 | FT-051 | B, M, W | MOD-09 | TASK-016 (B); TASK-042 (M device reg) |
| FR-053 | FT-050 | B | MOD-09 | TASK-015 |
| FR-054 | FT-052 | B, M | MOD-09 | TASK-017 (B); TASK-042 (M) |
| FR-055 | FT-056 | W, B | MOD-10 | TASK-037 (B); TASK-039 (W) |
| FR-056 | FT-057 | W, B | MOD-10 | TASK-038 (B); TASK-039 (W) |
| FR-057 | FT-058 | S, B, W, M | MOD-11 | TASK-007 (S); consumed B/W/M via package |
| FR-058 | FT-059, FT-017 | W, M | MOD-11/03 | TASK-007 (S); TASK-014 (W dual-date); TASK-043 (M numerals) |
| FR-059 | FT-060 | B, S, W | MOD-11 | TASK-007 (S/B ritu) |
| FR-060 | FT-061 | B, W | MOD-11 | TASK-007 (S) + consumed by tasks/reports |
| FR-061 | FT-062 | S | MOD-11 | TASK-007 (anchor suite) |

Every FR → ≥1 FT → exactly one MOD → ≥1 delivering TASK. ✅
(Residual per-surface UI items that are bundled or deferred are itemized in §6, not silently dropped.)

---

## 3. NFR → coverage (every NFR has a measurable threshold + task)

| NFR | Threshold | Surface | Delivering / verifying TASK(s) |
|---|---|---|---|
| NFR-001 | 100% offline capture, 0 data loss, survives restart | M, B | TASK-040, TASK-042 (offline write→sync→no-loss test) |
| NFR-002 | 100% worker UI Bangla + Bengali numerals; owner dual-date | M, W | TASK-042, TASK-043 (M); TASK-013, TASK-014 (W); TASK-007 (S) |
| NFR-003 | cold start ≤3 s; daily log ≤2 min on low-end Android | M | TASK-042, TASK-043 |
| NFR-004 | p95 < 300 ms @100 concurrent; ≤200 sync batch < 5 s | B | **TASK-050** (perf harness) |
| NFR-005 | RBAC; TLS 1.2+; argon2id; secrets via env | B, W, M | TASK-003, TASK-004, TASK-008, TASK-048 |
| NFR-006 | domain layer imports zero frameworks | B | TASK-001 (purity static check) |
| NFR-007 | ≥99% uptime; graceful degradation camera/weather down | B, W | **TASK-048** (deploy + degradation); TASK-036 (weather breaker); TASK-001 (CON-047 health) |
| NFR-008 | daily backups; RPO ≤24 h, RTO ≤4 h; documented restore | B | **TASK-049** |
| NFR-009 | daily log ≤2 min, ≤~10 taps; icon-driven | M | TASK-043 |
| NFR-010 | single VPS serves whole portfolio; no per-tenant infra | B | TASK-001, **TASK-048** |
| NFR-011 | every query project-scoped at data layer; negative test | B | TASK-004 (+ negative test on every project-owned card) |
| NFR-012 | immutable audit entry in same transaction | B | TASK-005 |
| NFR-013 | CRITICAL delivered within SLA (15 min) w/ retry/fallback | B, M | TASK-017 |
| NFR-014 | web WCAG 2.1 AA; mobile large targets/high contrast | W, M | TASK-013 (W a11y smoke), TASK-042 (M); TASK-046/047 (W) |
| NFR-015 | money as integer minor units / decimal, never float | B | TASK-019, TASK-031, TASK-032 |
| NFR-016 | Bangla conversion Bangladesh-revised 2019; no Intl/ICU | S | TASK-007 (anchor + no-Intl static check) |

All 16 NFRs → ≥1 TASK. ✅ (NFR-004/007/008 closed by the new TASK-048/049/050.)

---

## 4. Surface coverage matrix (every targeted surface has a task)

`—` = not targeted · `✓` = explicit delivering task · `~` = bundled/consumer or deferred (see §6).

| FR | backend | web | mobile |
|---|---|---|---|
| FR-001 | ✓ TASK-008 | ✓ TASK-013 | ✓ TASK-042 |
| FR-004 | ✓ TASK-010 | ✓ TASK-034/047 | ✓ TASK-042 |
| FR-006 | ✓ TASK-009 | ✓ **TASK-046** | — |
| FR-007 | ✓ TASK-011 | ✓ TASK-014 | — |
| FR-009 | ✓ TASK-010 | ✓ **TASK-047** | — |
| FR-011 | ✓ TASK-011 | ✓ TASK-013 | ✓ TASK-042 |
| FR-012 | ✓ TASK-018 | ✓ **TASK-052** | ~ R1 |
| FR-013 | ✓ TASK-019 | ✓ **TASK-052** | ~ R1 |
| FR-015 | ✓ TASK-019 | ✓ **TASK-052** | ~ R1 |
| FR-018 | ✓ TASK-021 | — | ✓ TASK-043 |
| FR-020 | ✓ TASK-022 | — | ✓ TASK-043 |
| FR-022 | ✓ TASK-023 | — | ✓ TASK-043 |
| FR-023 | ✓ TASK-023 | ✓ TASK-039 | — |
| FR-031 | ✓ TASK-041 | ~ R2 | ✓ TASK-044 |
| FR-035 | ✓ TASK-029 | ~ P2 | ✓ TASK-043 |
| FR-039 | ✓ TASK-031 | ~ P2 | ~ P2 |
| FR-042 | ✓ TASK-020 | ~ P2 | ~ TASK-043 |
| FR-049 | ✓ TASK-035 | ✓ TASK-039 | ✓ TASK-045 |
| FR-052 | ✓ TASK-016 | ~ TASK-039 | ✓ TASK-042 |
| FR-057 | ✓ TASK-007 | ✓ TASK-007 | ✓ TASK-007 |

(FRs whose only target is backend, or a single client, are covered in §2 and omitted here for brevity.)
**No P1 targeted surface is left with no card.** The `~`-marked P2/deferred UI items are tracked in §6.

---

## 5. Contract → task coverage (every CON endpoint built + consumed)

| CON range | Endpoints | Built by (backend) | Consumed by (client) |
|---|---|---|---|
| CON-001…004 | auth/reset | TASK-008, TASK-009 | TASK-013, **TASK-046** |
| CON-005 | /me | TASK-010 | TASK-013, TASK-042 |
| CON-006…012 | projects + members | TASK-011 | TASK-014, **TASK-047** |
| CON-013…017, CON-043 | ponds/batches/biomass | TASK-018, TASK-019 | TASK-014, **TASK-052** |
| CON-018, CON-018a | feeding + plan | TASK-021, TASK-022 | TASK-043 |
| CON-019…021 | mortality/sampling/harvest | TASK-028, TASK-029, TASK-031 | TASK-043 |
| CON-022…024 | inventory | TASK-020 | TASK-039 |
| CON-025…028, CON-027a | water + emergency | TASK-023, TASK-024 | TASK-039, TASK-043 |
| CON-029…031 | tasks | TASK-041 | TASK-044 |
| CON-032…035 | finance + portfolio | TASK-032, TASK-033, TASK-012 | TASK-034 |
| CON-036, CON-037 | camera, weather | TASK-035, TASK-036 | TASK-039, TASK-045 |
| CON-038, CON-039, CON-045 | alerts + devices | TASK-015, TASK-016, TASK-017 | TASK-042 |
| CON-040 | /sync | TASK-040 | TASK-042 |
| CON-041 | calendar | TASK-007 | TASK-014, TASK-043 |
| CON-042, CON-046 | reports | TASK-037, TASK-038 | TASK-039 |
| CON-044 | sensor ingestion | TASK-027 | (device, not a client) |
| **CON-047** | **/health** | **TASK-001** | **TASK-048** (orchestration/monitoring) |
| **CON-048** | **/species** | **TASK-018** | **TASK-014** (stocking UI) |
| CON-049…057 | reserved (deferred P2/P3) | — (declared, not defined) | — |

Every defined CON endpoint (CON-001…048) is built and consumed by a task. ✅
CON-049…057 are explicitly **reserved** (see openapi.yaml foot registry) — not dangling.

---

## 6. Coverage checks

- [x] Every BR → ≥1 FR; every FR → ≥1 FT and ≥1 AC — **YES** (§1, §2)
- [x] Every FR delivered on every surface it targets — **YES for P1**; P2/deferred UI tracked as residuals below (no silent miss)
- [x] Every NFR has a threshold and ≥1 TASK on each applicable surface — **YES** (§3; NFR-004/007/008 closed)
- [x] Every FT → exactly one MOD; every AC → ≥1 TASK — **YES**
- [x] Every endpoint in openapi.yaml (CON-001…048) implemented (backend) and consumed (client) by a task — **YES** (§5)
- [x] Every TASK traces back to a requirement; task graph is acyclic — **YES** (build DAG per BACKLOG "Depends on")

### Residual items (tracked, not silently dropped)

- **R1 — Pond/stocking/density client UI (FR-012/013/015 web+mobile).** Backend done (TASK-018/019). **Web half closed 2026-08-03 by TASK-052** (design W-06 `/projects/{id}/ponds` — multi-pond management, stocking, per-species density advisory). The **mobile** half remains deferred (single-pond is the v1 norm per PRODUCT_SPEC §13). *Action: add a mobile card if/when a worker's project runs multiple ponds.*
- **R2 — Task-definition authoring UI on web (FR-031 web).** Owner-creates-recurring-task backend is TASK-041; worker completion is TASK-044. A web task-definition editor is **not yet carded** (P1/P2 boundary). *Action: add a small web card under MOD-10/12 or fold into TASK-039.*
- **R3 — P2 read UIs** (treatments, growth/ADG/SGR, FCR, harvest progress, inventory web, market-rate config) map to reserved **CON-049…054** and are intentionally Phase-2. Their tasks are authored when those contracts are defined.

These residuals are **P2/deferred by design**, not gate failures. All P1 surfaces are covered.

---

## 7. Open items — all resolved (no decision blocks construction)

Every OI-1…OI-6 and the BRD §14 Q5 questions are resolved (2026-07-05 / 2026-07-06). None gate the
"ready to execute" state; the follow-up column notes downstream build implications only.

| Item | Status | Blocks / follow-up |
|---|---|---|
| OI-1 hosting of `packages/*` | ✅ **Resolved → separate repos, packages in backend** (ADR-002; ADR-017 monorepo reverted) | Shared `packages/*` in `fish-farm-backend/packages/*`, published to clients; scaffolded by **TASK-051** (do-first) |
| OI-2 Postgres RLS as 2nd isolation layer | ✅ **Resolved → deferred** (ADR-006 stands) | none for MVP |
| OI-3 offline emergency delivery | ✅ **Resolved → queue + fire on reconnect** | SMS fallback stays Phase 2 |
| OI-6 Partner finance visibility | ✅ **Resolved → full financials read-only** | AC-113/114, TASK-032/034 stand |
| OI-5 weather provider choice | ✅ **Resolved → OpenWeather** (ADR-018) | TASK-036 |
| OI-4 mixed-currency portfolio | ✅ **Resolved → single BDT, no FX/subtotals** (ADR-018) | TASK-033 |
| land unit + BDT formatting (BRD §14 Q5) | ✅ **Resolved → bigha default + South-Asian ৳** (ADR-018) | TASK-018/019 (reseed density in bigha), finance/report format |

---

*Traceability Matrix — Fish Farm Management System. Phase 6 artifact. Pairs with BACKLOG.md.
Any "NO"/residual here is planning work to close before or during the relevant task, not a
discovery to make mid-build.*
