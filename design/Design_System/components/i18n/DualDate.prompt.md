One-line: Localized date display — dual (Gregorian + Bangla) on web, single Bangla on mobile. Use everywhere a date appears.

```jsx
{/* web owner/partner */}
<DualDate gregorian="2026-07-21" bangla="5 শ্রাবণ 1433" />
{/* mobile worker */}
<DualDate mode="bn" bangla="5 শ্রাবণ 1433" season="বর্ষা" />
```

The Bangla date string must come from the app's calendar package (pass it in) — never compute it from Intl. Western digits in `bangla` are auto-converted to Bengali numerals.
