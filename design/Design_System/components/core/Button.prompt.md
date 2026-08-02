One-line: The primary action control — use for any button; `primary` for the main action, `secondary`/`ghost` for lesser ones, `danger` for destructive.

```jsx
<Button variant="primary" icon="plus">নতুন ব্যাচ</Button>
<Button variant="secondary" size="lg">Cancel</Button>
<Button variant="danger" icon="alert-triangle">Raise emergency</Button>
```

Variants: primary (teal), secondary (outlined), ghost (text), danger (red). Sizes sm/md/lg — use `lg` (52px) on mobile to satisfy the 48px tap target. `block` for full-width. Icons pass a lucide name via `icon`/`iconRight`.
