One-line: Inline lucide-style SVG icon rendering from a curated aquaculture-domain set; use anywhere you need a glyph, at 20/28/40px.

```jsx
<Icon name="droplet" size={20} title="Water quality" />
<Icon name="fish" size={28} color="var(--brand-primary)" />
```

Decorative icons omit `title` (rendered `aria-hidden`); meaningful icons pass `title` for a `<title>` + `aria-label`. Colors via `color` prop or `currentColor` inheritance. Available names are in the `IconName` union.
