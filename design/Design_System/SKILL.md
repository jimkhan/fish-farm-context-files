---
name: fms-design
description: Use this skill to generate well-branded interfaces and assets for FMS (Fish Farm Management System) — a bilingual (English/Bangla) multi-project aquaculture platform for Bangladesh — either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files
(`tokens/`, `components/`, `guidelines/`, `ui_kits/`).

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and
create static HTML files for the user to view. If working on production code, copy assets and
read the rules here to become an expert in designing with this brand.

Key rules to honor for FMS:
- **Localization is not optional.** Web = English + dual dates "2026-07-21 (৫ শ্রাবণ ১৪৩৩)";
  mobile worker = 100% Bangla with Bengali numerals and a single Bangla date + season. Money is
  always BDT — "৳" + Bengali numerals + lakh/crore grouping, whole taka, losses in red.
- **Role-gating is hidden, not disabled.** Owners see finances/settings/portfolio; partners are
  read-only on their project(s) only; workers never see finance or settings. Never reveal another
  project's existence.
- **Offline-first mobile.** Writes are optimistic ("saved"), with a global connectivity bar and
  per-item sync state (PENDING/SYNCED/CONFLICT/FAILED).
- **Always design the degraded/empty/stale/loading states** — never a crash or blank.
- Teal water identity, calm tinted status colors, lucide icons (inline SVG), Inter + Noto Sans
  Bengali, soft shadows, 16px card radius, WCAG 2.1 AA focus rings.

If the user invokes this skill without other guidance, ask what they want to build or design,
ask a few clarifying questions (role/surface, online/offline, which states), and act as an
expert designer who outputs HTML artifacts _or_ production code, depending on the need.
