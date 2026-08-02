One-line: The global connectivity + pending-sync bar for the mobile worker app — pin it at the top of every screen. Bangla by default.

```jsx
<ConnectivityBar online={false} />           {/* অফলাইন — সংরক্ষিত, পরে সিংক হবে */}
<ConnectivityBar online={true} pending={3} /> {/* ৩টি পরিবর্তন সিংক হচ্ছে */}
<ConnectivityBar online={true} pending={0} /> {/* সব সিংক হয়েছে */}
```

Pair with per-item `<SyncBadge>` on each written record.
