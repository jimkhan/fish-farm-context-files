# MOD-11 — Bangla Calendar (shared)

**Project:** Fish Farm Management System (FMS) | **Surface:** shared | **Version:** 1.0 | **Status:** Not Started
**Owns features:** FT-058, FT-059, FT-060, FT-061, FT-062
**Contract refs:** CON-041
**Dependencies:** none (pure package; no framework — CLAUDE.md invariant #6)

---

## 1. Overview

**Purpose.** Provide the **one** Bangla-calendar implementation used identically by backend, web,
and mobile: Gregorian↔Bangla conversion under the **Bangladesh-revised (2019) rules**, Bengali
numerals + date formatting, the six-season (**ritu**) mapping with seasonal-advisory hooks, and the
anchor-test verification that guarantees correctness.

**Scope.** A framework-free TypeScript package `packages/calendar`. It performs pure date math and
formatting; it holds no persistence, no HTTP, no state. A thin backend endpoint (`CON-041`) exposes
conversion for server-side reports; web and mobile import the package directly so behavior cannot
diverge.

**Position in architecture.** The lowest shared layer alongside MOD-01. Consumed by MOD-03
(dual-date), MOD-12 (worker Bangla dates), MOD-10 (report dates), and any module referencing Bangla
months/seasons. Because it is pure, it has zero dependencies and can be built in parallel with the
backend foundation (build unit E0-S8).

**Dependencies.** None.

## 2. Functional details

### 2.1 Core functions
- **F1 — Gregorian → Bangla (FT-058).** `toBangla(gregorianDate) → { year, month, day, ritu }`.
- **F2 — Bangla → Gregorian (FT-058).** `toGregorian({ year, month, day }) → gregorianDate`.
- **F3 — Bengali numerals & formatting (FT-059).** `toBengaliNumerals(n)` (০–৯) and
  `formatBangla(banglaDate, opts)` producing worker-facing strings; a dual-date formatter for owner
  UI (Bangla + Gregorian).
- **F4 — Ritu & seasonal advisories (FT-060).** `getRitu(banglaDateOrMonth) → Ritu` and an advisory
  hook registry so modules can attach seasonal guidance (e.g., raise oxygen-risk guidance in
  Borsha/monsoon, heat guidance in Grishmo).
- **F5 — Bangla months/seasons for tasks & reports (FT-061).** Month/season name helpers so
  recurring tasks and reports can reference Bangla months/seasons alongside absolute dates.
- **F6 — Anchor verification (FT-062).** A test suite asserting the fixed national-day anchors.

### 2.2 Sub-modules
- **conversion** — the core Gregorian↔Bangla algorithm (month-length + leap rules). Pure functions.
- **numerals-format** — numeral mapping + formatters (Bangla, dual-date).
- **ritu-advisories** — season resolution + advisory-hook registry (data + interface; consumers
  register advisories).
- **anchors** — the anchor constants + verification suite.

### 2.3 User interactions
None directly. Rendered through consuming surfaces: worker dates (Bangla + Bengali numerals) on
mobile; dual dates on the owner web; Bangla months/seasons in tasks/reports.

### 2.4 Business rules & validation — Bangladesh-revised (2019), effective 1426 BS / Oct 2019
- **R1** **Pohela Boishakh = 14 April**, always (1 Boishakh).
- **R2** Month lengths: **Boishakh–Ashshin (months 1–6) = 31 days**; **Kartik, Ogrohayon, Poush,
  Magh (7–10) = 30 days**; **Falgun (11) = 29 days (30 in a Gregorian leap year)**; **Choitro (12)
  = 30 days**. (Totals: 365 normally, 366 in leap.)
- **R3** **Falgun gets its 30th day when the Gregorian year in which that Falgun's February falls is
  a leap year** — this absorbs the Feb-29 extra day and keeps Pohela Boishakh on 14 April.
- **R4** **Bengali year = Gregorian − 593** on/after 14 April, **− 594** before 14 April.
- **R5** Six ritu, two months each: **Grishmo** (Boishakh–Joishtho), **Borsha** (Asharh–Srabon),
  **Sharod** (Bhadro–Ashshin), **Hemonto** (Kartik–Ogrohayon), **Sheet** (Poush–Magh), **Bosonto**
  (Falgun–Choitro).
- **R6** **Never** use `Intl`/ICU (they implement the West Bengal/sidereal calendar and give wrong
  dates) or any non-`packages/calendar` source for Bangla dates.
- **R7** Numerals render with Bengali glyphs ০–৯; `0 → ০`, `2026 → ২০২৬`.
- **R8** The package is pure: no framework, no I/O, deterministic given an input date.

> **Verified month starts (non-leap Bangla year, for reference):** Boishakh 1 = 14 Apr; Poush 1 =
> 16 Dec; Falgun 1 = 14 Feb; Choitro 1 = 15 Mar. Hence the anchors: 21 Feb = 8 Falgun, 26 Mar = 12
> Choitro, 16 Dec = 1 Poush, 14 Apr = 1 Boishakh.

### 2.5 Edge cases
1. **Gregorian leap year** (e.g., Feb 2024) → the Bangla year that began 14 Apr 2023 has 366 days;
   Falgun = 30 days; Choitro 30 ends 13 Apr 2024; Pohela Boishakh stays 14 Apr 2024.
2. **Boundary 13→14 April** → 13 Apr is Choitro 30 (year N−1 offset −594 style); 14 Apr is Boishakh
   1 (offset flips to −593, year increments).
3. **Dates just before 14 April** (Jan–early Apr) → year uses the −594 offset and lands in
   Magh/Falgun/Choitro of the previous Bangla year.
4. **Round-trip** → `toBangla(toGregorian(b)) === b` and vice versa for every date across a full
   year, including the leap Falgun 30.
5. **Invalid Bangla input** (day 31 in Falgun, month 13, day 0) → typed validation error, not a
   silent wrap.
6. **Zero and multi-digit numerals** → `0 → ০`, `105 → ১০৫` (per-digit mapping, not lookup of the
   whole number).
7. **Very old/far-future Gregorian dates** → conversion still applies the rules (no overflow); tests
   cover a range of years, not just the current one.

### 2.6 Error states
| Trigger | Result | Message | Recovery |
|---|---|---|---|
| Invalid Bangla date (bad month/day) | throws `InvalidBanglaDateError` | "Invalid Bangla date: <detail>." | Caller validates input. |
| Non-date / NaN passed to `toBangla` | throws `InvalidInputError` | "A valid date is required." | Pass a valid Date/ISO string. |
| Advisory hook registered for an unknown ritu | throws at registration | "Unknown ritu: <value>." | Use a valid `Ritu` value. |

## 3. Non-functional (surface: shared)
- **NFR-016 (calendar correctness)** — matches Bangladesh-revised (2019) exactly; passes anchor
  tests; **no `Intl`/ICU** (AC-041, AC-043, AC-047).
- **NFR-002 (localization)** — Bengali numerals + Bangla formatting (AC-045).
- **NFR-006-style purity** — the package imports no framework and is deterministic (AC-047).
- **Performance** — pure arithmetic, O(1) per conversion; safe for hot paths on low-end mobile.

## 4. Technical details

### 4.1 Components
`packages/calendar` exports: `toBangla`, `toGregorian`, `toBengaliNumerals`, `formatBangla`,
`formatDual`, `getRitu`, `banglaMonthName`, `rituName`, `registerSeasonalAdvisory`,
`getAdvisories(date)`, and types `BanglaDate`, `Ritu`, `BanglaMonth`.

### 4.2 Files / folders (package: `packages/calendar`, consumed by all repos)
```
packages/calendar/
  src/conversion.ts        (toBangla / toGregorian, month-length + leap logic)
  src/numerals.ts          (toBengaliNumerals, digit map)
  src/format.ts            (formatBangla, formatDual)
  src/ritu.ts              (getRitu, ritu↔month map, advisory registry)
  src/anchors.ts           (anchor constants)
  src/types.ts             (BanglaDate, Ritu, BanglaMonth, errors)
  test/anchors.test.ts     (required anchor suite)
  test/conversion.test.ts  (round-trip, leap, boundaries)
  test/numerals.test.ts
```
The backend `calendar` module is a thin controller over this package for `CON-041`; web + mobile
import the package directly.

### 4.3 State and data
None (pure). No tables, no persistence. The advisory registry is in-memory configuration populated
by consumers at startup.

### 4.4 Key logic
- **toBangla:** compute the Bangla new-year anchor (14 Apr of the governing Gregorian year); the day
  offset from that anchor indexes into the month-length array (with Falgun length chosen by the
  Gregorian leap status governing that Falgun) to yield month/day; year from R4.
- **toGregorian:** inverse — sum month lengths up to (month−1) plus (day−1), add to 14 Apr of the
  governing Gregorian year.
- **Leap decision:** Falgun length = 30 iff the Gregorian February within this Bangla year is in a
  leap Gregorian year (R3).

### 4.5 Reusable / shared patterns
This *is* the shared pattern: one calendar, imported everywhere. `formatDual` is the canonical
owner dual-date; `formatBangla` the canonical worker date. The advisory registry is the hook other
modules use for seasonal guidance rather than re-deriving seasons.

### 4.6 Integration points
- **MOD-03** uses `formatDual` for owner dual dates.
- **MOD-12** uses `formatBangla` + `toBengaliNumerals` for worker-facing dates.
- **MOD-10** uses month/season names in reports.
- **MOD-06/MOD-05** may register seasonal advisories (monsoon oxygen risk, heat feeding guidance).
- Backend exposes `CON-041 GET /calendar/convert`.

### 4.7 Contract impact
`CON-041 GET /calendar/convert` already exists in `contracts/openapi.yaml`, returning the
`BanglaDate` schema (year, month, day, ritu, `formattedBn`). No new endpoints/schemas required.

### 4.8 Testing notes
The **anchor suite is a required deliverable** (AC-041): 21 Feb = 8 Falgun, 26 Mar = 12 Choitro,
16 Dec = 1 Poush, 14 Apr = 1 Boishakh. Add a **leap-year** case proving Falgun = 30 and Pohela
Boishakh stays 14 Apr (AC-043), a **round-trip** property test across a full year (AC-044), numeral
tests (AC-045), a **static check that the package imports no framework and never calls `Intl`**
(AC-047), and boundary tests at 13→14 April.

## 5. Acceptance criteria

- **AC-041** — *Given* the Gregorian dates 21 Feb, 26 Mar, 16 Dec, and 14 Apr, *When* converted to
  Bangla, *Then* they yield **8 Falgun, 12 Choitro, 1 Poush, and 1 Boishakh** respectively (anchor
  tests pass). — parent FR-061, NFR-016
- **AC-042** — *Given* a Gregorian date on/after 14 April, *When* converted, *Then* the Bangla year
  = Gregorian − 593; for a date before 14 April, = Gregorian − 594. — parent FR-057
- **AC-043** — *Given* a Gregorian leap year, *When* the Bangla year spanning that February is
  computed, *Then* Falgun has 30 days and Pohela Boishakh remains 14 April. — parent FR-057, NFR-016
- **AC-044** — *Given* any Bangla date in a year, *When* it is converted to Gregorian and back,
  *Then* the original Bangla date is recovered (round-trip). — parent FR-057
- **AC-045** — *Given* a number, *When* formatted, *Then* it renders with Bengali numerals
  (e.g., 2026 → ২০২৬, 0 → ০). — parent FR-058
- **AC-046** — *Given* a Bangla month, *When* `getRitu` is called, *Then* it returns the correct
  season (e.g., Asharh → Borsha, Boishakh → Grishmo, Poush → Sheet). — parent FR-059
- **AC-047** — *Given* the `packages/calendar` source, *When* a static check runs, *Then* it imports
  no framework and makes **no** `Intl`/ICU calendar call. — parent NFR-016
- **AC-048** — *Given* an invalid Bangla date (e.g., 31 Falgun or month 13), *When* converted,
  *Then* it throws a typed `InvalidBanglaDateError` (no silent wrap). — parent FR-057
- **AC-049** — *Given* a date referenced by a task or report, *When* its Bangla month/season is
  requested, *Then* the correct month name and ritu are returned for display. — parent FR-060

## 6. Implementation & done

### 6.1 Definition of done
- [ ] All ACs (AC-041…AC-049) tested; **anchor suite green** (AC-041) and leap-year case (AC-043).
- [ ] Round-trip property test across a full year passes (AC-044).
- [ ] Static no-`Intl`/no-framework check passes (AC-047).
- [ ] Package is pure (no framework, no I/O); exported API typed.
- [ ] `CON-041` backend endpoint returns the `BanglaDate` schema; contract unchanged.
- [ ] Lint + type-check + tests green; diff self-contained; matrix + tracker updated; review passed.

### 6.2 Implementation notes
Implement conversion with an explicit month-length array and a single leap decision; avoid clever
day-of-year shortcuts that obscure the leap/anchor logic. Keep formatters separate from conversion
so numerals/locale changes don't touch the math. Consumers register seasonal advisories at startup;
the package only stores and returns them.

### 6.3 Risks / caveats
- The **Falgun leap rule** (which Gregorian year governs the extra day) is the single most
  error-prone point — the leap-year AC (AC-043) and the round-trip AC (AC-044) exist specifically to
  catch a wrong leap attribution.
- Any accidental `Intl`/`toLocaleDateString('bn')` use silently produces the wrong (sidereal)
  calendar — the static check (AC-047) guards this.

### 6.4 Open questions
- None. The Bangladesh-revised (2019) rules and anchors are fully specified (BRD §7.14 + calendar
  note). Seasonal-advisory *content* (the actual guidance text per ritu) is authored by the
  consuming modules (MOD-05/MOD-06), not here.

---

*MOD-11 detail — Fish Farm Management System. Phase 5 artifact. ACs: AC-041…AC-049.*
