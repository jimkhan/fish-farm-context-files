import React from "react";

/* Skeleton placeholder for substantial loading content (not a spinner). */
export function Skeleton({ width = "100%", height = 16, radius = "var(--radius-sm)", style, ...rest }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "block",
        width,
        height,
        borderRadius: radius,
        background: "linear-gradient(90deg, var(--surface-muted) 25%, #E9EEF4 37%, var(--surface-muted) 63%)",
        backgroundSize: "400% 100%",
        animation: "fms-shimmer 1.4s ease infinite",
        ...style,
      }}
      {...rest}
    >
      <style>{"@keyframes fms-shimmer{0%{background-position:100% 0}100%{background-position:0 0}}"}</style>
    </span>
  );
}

/* Composed skeleton mimicking a card row: title line + two meta lines. */
export function SkeletonRow({ lines = 2, style }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, ...style }}>
      <Skeleton width="55%" height={18} />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? "70%" : "90%"} height={12} />
      ))}
    </div>
  );
}
