One-line: Dashboard KPI tile — label, big value, optional trend and icon. Pass money as a `<Money>` node so numerals/grouping stay correct.

```jsx
<StatCard label="Portfolio revenue" icon="dollar-sign"
  value={<Money amount={1245000} />}
  trend={{ dir: "up", text: "১২% vs last cycle" }} />
<StatCard label="Open alerts" icon="bell" tone="critical" value="৩" />
```

`tone` colors the icon; `trend.dir` up=green, down=red.
