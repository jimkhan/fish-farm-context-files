import React from "react";
import { Icon } from "../core/Icon.jsx";

/* KPI stat tile — label, big value, optional trend + icon. Value is passed
   pre-formatted (use <Money> for taka). Trend: {dir:'up'|'down', text} */
export function StatCard({
  label, value, icon, trend, tone = "neutral", style, ...rest
}) {
  const toneColor = {
    neutral: "var(--brand-primary)",
    ok: "var(--status-ok)",
    warning: "var(--sev-warning)",
    critical: "var(--sev-critical)",
  }[tone] || "var(--brand-primary)";
  const trendColor = trend
    ? (trend.dir === "up" ? "var(--status-ok)" : trend.dir === "down" ? "var(--status-danger)" : "var(--text-secondary)")
    : null;
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-card)",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", fontFamily: "var(--font-base)" }}>{label}</span>
        {icon ? (
          <span style={{ width: 32, height: 32, borderRadius: "var(--radius-md)", background: "var(--tint-brand)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name={icon} size={18} color={toneColor} />
          </span>
        ) : null}
      </div>
      <div style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--fw-bold)", color: "var(--text-primary)", lineHeight: "var(--lh-tight)", fontVariantNumeric: "tabular-nums" }}>
        {value}
      </div>
      {trend ? (
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "var(--text-xs)", color: trendColor, fontWeight: "var(--fw-medium)" }}>
          <Icon name={trend.dir === "down" ? "trending-down" : "trending-up"} size={14} />
          {trend.text}
        </div>
      ) : null}
    </div>
  );
}
