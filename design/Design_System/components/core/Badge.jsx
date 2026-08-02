import React from "react";
import { Icon } from "./Icon.jsx";

const TONES = {
  neutral: { bg: "var(--surface-muted)", fg: "var(--text-secondary)", dot: "var(--status-muted)" },
  brand: { bg: "var(--tint-brand)", fg: "var(--brand-primary-dark)", dot: "var(--brand-primary)" },
  ok: { bg: "var(--tint-ok)", fg: "#166534", dot: "var(--status-ok)" },
  info: { bg: "var(--tint-info)", fg: "#075985", dot: "var(--sev-info)" },
  warning: { bg: "var(--tint-warning)", fg: "#92400E", dot: "var(--sev-warning)" },
  critical: { bg: "var(--tint-critical)", fg: "#991B1B", dot: "var(--sev-critical)" },
};

export function Badge({ children, tone = "neutral", dot = false, icon, style, ...rest }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 24,
        padding: "0 10px",
        borderRadius: "var(--radius-pill)",
        background: t.bg,
        color: t.fg,
        fontFamily: "var(--font-base)",
        fontSize: "var(--text-xs)",
        fontWeight: "var(--fw-medium)",
        lineHeight: 1,
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      {dot ? <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.dot, flexShrink: 0 }} /> : null}
      {icon ? <Icon name={icon} size={13} /> : null}
      {children}
    </span>
  );
}
