import React from "react";
import { Icon } from "../core/Icon.jsx";

/* Purposeful state view: empty | unavailable | stale | offline.
   Calm muted surface, icon, one-line explanation, one primary action. Never a crash/blank. */
const VARIANTS = {
  empty: { icon: "clipboard-list", fg: "var(--status-muted)", bg: "transparent", border: "1px dashed var(--border-strong)" },
  unavailable: { icon: "alert-triangle", fg: "var(--sev-warning)", bg: "var(--surface-muted)", border: "1px solid var(--border)" },
  stale: { icon: "clock", fg: "var(--sev-warning)", bg: "var(--surface-muted)", border: "1px solid var(--border)" },
  offline: { icon: "wifi-off", fg: "var(--status-muted)", bg: "var(--surface-muted)", border: "1px solid var(--border)" },
};

export function StateView({
  variant = "empty", icon, title, message, action, lang = "en", compact = false, style, ...rest
}) {
  const v = VARIANTS[variant] || VARIANTS.empty;
  const fam = lang === "bn" ? "var(--font-bangla)" : "var(--font-base)";
  return (
    <div
      role="status"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 8,
        padding: compact ? "20px 16px" : "36px 24px",
        background: v.bg,
        border: v.border,
        borderRadius: "var(--radius-lg)",
        fontFamily: fam,
        ...style,
      }}
      {...rest}
    >
      <div style={{ width: 44, height: 44, borderRadius: "var(--radius-pill)", background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 2 }}>
        <Icon name={icon || v.icon} size={22} color={v.fg} />
      </div>
      {title ? <div style={{ fontSize: "var(--text-md)", fontWeight: "var(--fw-bold)", color: "var(--text-primary)" }}>{title}</div> : null}
      {message ? <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", maxWidth: 320, lineHeight: "var(--lh-normal)" }}>{message}</div> : null}
      {action ? <div style={{ marginTop: 8 }}>{action}</div> : null}
    </div>
  );
}
