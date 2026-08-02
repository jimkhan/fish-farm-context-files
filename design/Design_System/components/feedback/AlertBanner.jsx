import React from "react";
import { Icon } from "../core/Icon.jsx";

const SEV = {
  info: { icon: "info", fg: "var(--sev-info)", bg: "var(--tint-info)", border: "#BAE6FD", title: "#075985" },
  warning: { icon: "alert-triangle", fg: "var(--sev-warning)", bg: "var(--tint-warning)", border: "#FDE68A", title: "#92400E" },
  critical: { icon: "alert-circle", fg: "var(--sev-critical)", bg: "var(--tint-critical)", border: "#FECACA", title: "#991B1B" },
};

export function AlertBanner({
  severity = "info", title, children, action, lang = "en", style, ...rest
}) {
  const s = SEV[severity] || SEV.info;
  const fam = lang === "bn" ? "var(--font-bangla)" : "var(--font-base)";
  return (
    <div
      role={severity === "critical" ? "alert" : "status"}
      style={{
        display: "flex",
        gap: 12,
        padding: "12px 14px",
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: "var(--radius-md)",
        fontFamily: fam,
        ...style,
      }}
      {...rest}
    >
      <Icon name={s.icon} size={20} color={s.fg} style={{ marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {title ? <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--fw-bold)", color: s.title, lineHeight: "var(--lh-tight)" }}>{title}</div> : null}
        {children ? <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginTop: title ? 2 : 0, lineHeight: "var(--lh-normal)" }}>{children}</div> : null}
      </div>
      {action ? <div style={{ flexShrink: 0 }}>{action}</div> : null}
    </div>
  );
}
