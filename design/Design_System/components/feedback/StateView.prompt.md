One-line: The one placeholder for empty / degraded / stale / offline — a calm muted surface with icon, one-line reason, and a single action. Never leave a blank or let a widget crash.

```jsx
{/* external service down — rest of page unaffected */}
<StateView variant="unavailable" title="Camera temporarily unavailable"
  message="The feed is down. The rest of the page is unaffected."
  action={<Button size="sm" variant="secondary" icon="refresh-cw">Retry</Button>} />

{/* empty list */}
<StateView variant="empty" title="No batches yet"
  message="Start a batch to begin tracking stock and feed."
  action={<Button size="sm" icon="plus">New batch</Button>} />
```

Variants empty / unavailable / stale / offline. Always give an `action`. `lang="bn"` on mobile.
