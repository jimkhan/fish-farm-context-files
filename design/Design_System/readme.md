# FMS — Fish Farm Management System · Design System

A single-brand design system for **FMS**, a multi-project **aquaculture (pond farming)**
management platform used in **Bangladesh**. The system is water-calm, high-contrast, and
low-literacy-friendly, and it is bilingual by design (English + Bangla, Bengali numerals,
dual/Bangla calendars).

## Product & who uses it
A remote **OWNER** runs 2–4 pond "projects" (farm sites) from a web dashboard. Each site has
one **WORKER** who logs daily operations from a phone. Some projects have a read-only
**PARTNER** (investor). **The Project is the tenant boundary** — one project's data must never
bleed into another, and a role never sees a trace of what it isn't entitled to (role-gating is
*hidden*, not disabled). Stock is polyculture: **SPF Golda** (giant freshwater prawn), **Parse**
(mullet), and **Carp** varieties.

Roles (design for the one named per surface):
- **OWNER** — web, full read/write on owned projects + a cross-project portfolio; sees finances & settings.
- **PARTNER** — web, read-only (incl. finances) on co-owned project(s) only; no portfolio, no writes, no settings, no member admin.
- **WORKER** — mobile only, offline-first, 100% Bangla; operational logging on their ONE assigned project; never sees finance or settings.

## Sources
This system was built from a **written product + token brief** derived from the FMS spec hub. The
authoritative sources — record any future changes there, not here — are:

- **`fish-farm-context-files/DESIGN_PROCESS.md`** — the design workflow, the master design-system
  prompt, the per-screen prompts, the locked decisions (§3b navigation, §3c data-integrity
  invariants), and the review log. **This is the index for every screen in this bundle** (screen-id
  → file mapping lives there).
- **`fish-farm-context-files/contracts/design-tokens.json`** — the shipped token values (colours,
  type, spacing, radii) these CSS tokens mirror.
- **`fish-farm-context-files/`** spec hub — `PRODUCT_SPECIFICATION.md`, `FEATURE_LIST.md`,
  `GLOSSARY.md` (status vocabularies), `DECISIONS.md` (ADR-011 calendar, ADR-018 money/BDT/bigha),
  `contracts/openapi.yaml` (the read-screens = GET endpoints), and the per-module docs.
- **Backend** (implemented, all endpoints live): `fish-farm-backend/` — the API these screens consume.

Consumers: the owner/partner web app `fish-farm-web` and the worker app `fish-farm-mobile-app` build
against these screens. Localization primitives (Bangla calendar, Bengali numerals, `formatBdt`) live
in `fish-farm-backend/packages/{calendar,shared}` and are published to both clients.

## Fonts
- **Inter** (base UI), **Noto Sans Bengali** (Bangla), **JetBrains Mono** (codes/IDs).
- ⚠️ **No local font binaries were supplied.** All three are loaded from **Google Fonts**
  (`tokens/fonts.css`) — the exact specified families, not substitutions. If you want the
  fonts self-hosted (offline/production), please provide the `.woff2`/`.ttf` files and I'll
  swap the `@font-face` src.

## Brand mark
⚠️ **No logo was provided.** Wherever a mark belongs, the name is rendered typographically:
**FMS** in primary teal (#0E7490), weight 700, tight tracking (see the *Brand* cards). Provide
a real logo and I'll wire it into `assets/` and the thumbnail.

---

## CONTENT FUNDAMENTALS (voice & copy)
- **Bilingual, audience-split.** Web (owner/partner) copy is English with domain terms; the
  worker mobile app is **100% Bangla**. Never mix languages within a surface.
- **Plain, operational, calm.** Short imperative labels: "New batch", "Acknowledge",
  "সংরক্ষণ করুন" (Save), "এখনই সতর্কবার্তা পাঠান" (Send alert now). No marketing tone, no hype.
- **You-oriented on partner-facing copy** ("You have investor access to this project"), neutral
  third-person for system/status text.
- **Degraded/empty copy reassures, then directs.** e.g. "Temporarily unavailable — the rest of
  the page is unaffected." and offline: "অফলাইন — সংরক্ষিত, পরে সিংক হবে" (Offline — saved,
  will sync later). Always one clear next action; never a dead end.
- **Casing:** Sentence case for labels and headings. Status vocab is a fixed enum shown via
  badges (ACTIVE, DUE, CRITICAL…) — never re-word it.
- **Numbers & money:** money is **always** BDT — "৳" + Bengali numerals + South-Asian
  lakh/crore grouping, whole taka, no decimals (৳৬,৫০০ · ৳১,২৩,৪৫৬ · loss −৳৮০০ in red). On web,
  general counts may be Western; on mobile **all** numbers are Bengali numerals.
- **Dates:** web shows **dual dates** "2026-07-21 (৫ শ্রাবণ ১৪৩৩)"; mobile shows a single
  Bangla date + season (ঋতু, e.g. বর্ষা/monsoon). Bangla dates come from the app's calendar
  package — never from `Intl`.
- **Emoji:** none. Meaning is carried by lucide icons + status color, never emoji.

## VISUAL FOUNDATIONS
- **Color:** one teal identity — primary `#0E7490`, dark `#155E75`, accent `#0891B2`. Neutrals
  are cool slate (`#F8FAFC` page, `#FFFFFF` surface, `#E2E8F0` border, `#0F172A`/`#475569` text).
  Severity is fixed: info `#0284C7`, warning `#D97706`, critical `#DC2626`; status ok `#16A34A`,
  muted `#94A3B8`, danger `#DC2626`. Badges/banners use very light *tint* fills of these hues so
  color reads calm, not alarming. Max 1–2 background colors per surface.
- **Type:** Inter for UI, Noto Sans Bengali for Bangla, JetBrains Mono for codes/IDs. Scale
  12/14/16(base)/20/24/32; weights 400/500/700; line-height tight 1.2 / normal 1.5.
- **Spacing:** 4/8/12/16/24/32 grid. Mobile minimum tap target **48px**.
- **Radius:** sm 6 / md 10 / lg 16 / pill 999. Buttons & inputs md; cards lg; badges pill.
- **Shadow:** soft and sparing — card `0 1px 3px rgba(15,23,42,.08)`, modal
  `0 10px 30px rgba(15,23,42,.18)`. No heavy or colored shadows.
- **Cards:** white surface, **1px `#E2E8F0` border + soft card shadow + lg (16px) radius**.
  No colored left-border accents, no gradients.
- **Backgrounds:** flat `#F8FAFC` page, white cards. **No** gradients, hero images, textures, or
  illustrations. The dark chrome (owner sidebar, partner/mobile header) is solid `#155E75`.
- **Imagery:** none shipped; the aesthetic is clean and typographic. Domain photos (if added
  later) should be cool/neutral, not warm or filtered.
- **Animation:** minimal and functional — 0.15s ease color/shadow transitions on interactive
  elements; a single shimmer keyframe for skeletons. No bounces, parallax, or decorative motion.
- **Hover / press:** hover darkens/adds shadow subtly; primary uses the teal, secondary is an
  outlined white surface, ghost is transparent. Disabled = 0.5 opacity + not-allowed (used only
  where an action genuinely exists but is unavailable — never to fake role-gating).
- **Focus:** visible focus ring in brand accent (`#0891B2`), 2px offset — WCAG 2.1 AA.
- **Transparency/blur:** avoided; surfaces are opaque for contrast and low-literacy clarity.

## ICONOGRAPHY
- **System:** the **Lucide** icon set (24×24, 2px stroke, `currentColor`, round caps/joins),
  delivered as **inline SVG** through the `Icon` component. Paths are transcribed from the
  open-source Lucide set (ISC) into a curated domain map — no CDN dependency, no icon font.
- **Substitution note:** Lucide has no literal "prawn/golda" glyph, so aquaculture concepts use
  the nearest Lucide metaphors: `fish` (stock/batch), `droplet` (water quality), `utensils`
  (feed), `skull` (mortality), `life-buoy` (emergency), `scale` (harvest/finance share),
  `thermometer`/`wind`/`cloud` (environment). Flagged here in case you want custom species glyphs.
- **Sizes:** 20 (inline/default), 28 (worker action tiles), 40 (feature). Icons are decorative by
  default (`aria-hidden`); pass `title` to make one meaningful (adds `<title>` + `aria-label`).
- **No emoji, no unicode-as-icon.** Status meaning = icon + color + text label together.

---

## Index / manifest

**Root**
- `styles.css` — global entry (import lines only); consumers link this one file.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `fonts.css`.
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand).
- `components/` — reusable React primitives (below).
- `ui_kits/` — full-screen product recreations (below).
- `thumbnail.html` — homepage tile. `readme.md` — this file. `SKILL.md` — Agent Skill entry.

**Components** (namespace `window.FMSAquacultureDesignSystem_dbe44a`)
- core — `Icon`, `Button`, `IconButton`, `Card` (+ `CardHeader`), `Badge`
- status — `StatusBadge` (batch/task/severity/alert/feed/grade vocab), `SyncBadge` (PENDING/SYNCED/CONFLICT/FAILED)
- i18n — `Money` (BDT, Bengali numerals), `DualDate` (dual web / Bangla mobile)
- feedback — `AlertBanner`, `StateView` (empty/unavailable/stale/offline), `Skeleton` (+ `SkeletonRow`)
- data — `StatCard`, `ConnectivityBar`
- forms — `Input`, `Select`

**Intentional additions:** `Icon` (glyph wrapper for the Lucide set), `StatusBadge`/`SyncBadge`
(encode the brief's exact status enums so status is never hand-colored), `Money`/`DualDate`
(enforce the localization rules), `ConnectivityBar` (offline-first requirement), `StateView`
(the required degraded/empty/stale/offline states). These exist because the brief mandates the
behaviors, not because a design system "usually" has them.

**UI kits**
- `ui_kits/owner_web/` — Owner portfolio + project dashboard (alerts, batches, degraded weather).
- `ui_kits/worker_mobile/` — Worker phone app, 100% Bangla, offline-first, icon-first logging.
- `ui_kits/partner_web/` — Partner read-only investor view (finances visible, no write controls).
