import React from "react";
import { Icon } from "../core/Icon.jsx";

export function Input({
  label, hint, error, icon, suffix, id, lang = "en", style, containerStyle, ...rest
}) {
  const fam = lang === "bn" ? "var(--font-bangla)" : "var(--font-base)";
  const inputId = id || (label ? "in-" + String(label).replace(/\s+/g, "-").toLowerCase() : undefined);
  const borderColor = error ? "var(--status-danger)" : "var(--border-strong)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: fam, ...containerStyle }}>
      {label ? (
        <label htmlFor={inputId} style={{ fontSize: "var(--text-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-primary)" }}>{label}</label>
      ) : null}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {icon ? <span style={{ position: "absolute", left: 12, display: "flex", color: "var(--text-secondary)" }}><Icon name={icon} size={18} /></span> : null}
        <input
          id={inputId}
          aria-invalid={error ? "true" : undefined}
          style={{
            width: "100%",
            height: 44,
            padding: icon ? "0 12px 0 38px" : "0 12px",
            paddingRight: suffix ? 44 : 12,
            fontFamily: fam,
            fontSize: "var(--text-md)",
            color: "var(--text-primary)",
            background: "var(--surface)",
            border: `1px solid ${borderColor}`,
            borderRadius: "var(--radius-md)",
            outline: "none",
            boxSizing: "border-box",
            ...style,
          }}
          {...rest}
        />
        {suffix ? <span style={{ position: "absolute", right: 12, color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>{suffix}</span> : null}
      </div>
      {error ? (
        <span style={{ fontSize: "var(--text-xs)", color: "var(--status-danger)" }}>{error}</span>
      ) : hint ? (
        <span style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>{hint}</span>
      ) : null}
    </div>
  );
}
