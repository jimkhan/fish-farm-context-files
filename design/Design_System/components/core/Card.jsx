import React from "react";

export function Card({
  children, padding = 16, interactive = false, muted = false, style, ...rest
}) {
  return (
    <div
      style={{
        background: muted ? "var(--surface-muted)" : "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-card)",
        padding,
        cursor: interactive ? "pointer" : undefined,
        transition: interactive ? "box-shadow .15s ease, border-color .15s ease" : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, style, ...rest }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 12,
        ...style,
      }}
      {...rest}
    >
      <div>
        <div style={{ fontSize: "var(--text-md)", fontWeight: "var(--fw-bold)", color: "var(--text-primary)", lineHeight: "var(--lh-tight)" }}>{title}</div>
        {subtitle ? <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginTop: 2 }}>{subtitle}</div> : null}
      </div>
      {action || null}
    </div>
  );
}
