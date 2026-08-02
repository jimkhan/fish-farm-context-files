One-line: The ONLY correct way to render an FMS status — pass the vocabulary `kind` and the exact enum `status`; it picks the right tone and bilingual label. Never hand-color a status pill.

```jsx
<StatusBadge kind="batch" status="ACTIVE" />
<StatusBadge kind="task" status="MISSED" />
<StatusBadge kind="severity" status="CRITICAL" />
<StatusBadge kind="feed" status="LEFTOVER" lang="bn" />  {/* worker mobile */}
```

Vocabularies: batch (ACTIVE/HARVESTING/CLOSED), task (SCHEDULED/DUE/DONE/MISSED), severity (INFO/WARNING/CRITICAL), alert (RAISED/SENT/ACKNOWLEDGED/RESOLVED), feed (NORMAL/LEFTOVER/EMPTY), grade (EXPORT/LOCAL). Use `lang="bn"` on the mobile worker app.
