# Partner Web — UI kit

The **Partner** (investor) web view. Read-only access to their co-owned project(s) only —
finances included — with **no** portfolio, write controls, settings, or member admin. The
existence of projects they don't belong to is never revealed.

## Screen (`index.html`)
A single co-owned project (Jamuna Gher):
- Header with FMS "Partner" lockup and dual date. No settings/bell write affordances.
- A **read-only** info banner explaining access scope (role-gating is communicated, not
  shown as disabled controls — there are simply no "New batch" / edit buttons anywhere).
- Finance KPIs including the partner's profit share and investment.
- Finance ledger (income/expense with dual dates, all money in ৳ Bengali numerals).
- Batches with batch + harvest-grade badges (EXPORT / LOCAL).

## Role-gating demonstrated
Compared to the Owner kit, everything write- or admin-related is **absent**, not greyed:
no portfolio nav, no "New batch", no settings, no member admin. Finances remain visible
because partners are entitled to them.

## Composition
`StatCard`, `Card`, `StatusBadge`, `AlertBanner`, `Money`, `DualDate`, `Icon`. Mock data is
inline in `PartnerApp.jsx`.

Files: `index.html`, `PartnerApp.jsx`.
