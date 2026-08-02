One-line: Per-item sync indicator for offline-first mobile writes; Bangla by default. Every optimistically-saved item shows one.

```jsx
<SyncBadge state="PENDING" />   {/* সিংক বাকি */}
<SyncBadge state="SYNCED" />
<SyncBadge state="FAILED" />     {/* ব্যর্থ — আবার (retry) */}
<SyncBadge state="CONFLICT" showLabel={false} />
```

States: PENDING / SYNCED / CONFLICT / FAILED. Pair with the global connectivity indicator (ConnectivityBar).
