One-line: The standard surface container — white, bordered, lg radius, soft shadow; wrap most dashboard content in one.

```jsx
<Card>
  <CardHeader title="Water quality" subtitle="Pond A2" action={<IconButton icon="refresh-cw" label="Refresh" size="sm" />} />
  {/* body */}
</Card>
```

`interactive` adds hover affordance for clickable cards; `muted` uses the muted surface fill. `CardHeader` gives a title/subtitle + right-aligned `action` slot.
