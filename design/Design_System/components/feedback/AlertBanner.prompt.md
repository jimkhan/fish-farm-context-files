One-line: Inline tinted severity banner for page-level notices — closed/archived project, degraded service, form errors.

```jsx
<AlertBanner severity="warning" title="Project closed"
  action={<Button size="sm" variant="secondary">View archive</Button>}>
  This project is archived and read-only. Write controls are hidden.
</AlertBanner>
<AlertBanner severity="critical" title="Low oxygen">Pond A2 dissolved O₂ below threshold.</AlertBanner>
```

Severities info/warning/critical. Pass `lang="bn"` on mobile. Critical uses role=alert for AT.
