One-line: Render any BDT amount — always "৳" + Bengali numerals + South-Asian lakh/crore grouping, whole taka, losses in red. Use for every money value, web and mobile.

```jsx
<Money amount={6500} />      {/* ৳৬,৫০০ */}
<Money amount={123456} />    {/* ৳১,২৩,৪৫৬ */}
<Money amount={-800} />      {/* -৳৮০০ in red */}
```

Never format taka with Western digits or decimals. Negatives auto-color red (`colorNegative={false}` to opt out).
