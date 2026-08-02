import React from "react";
import { Icon } from "../core/Icon.jsx";

export function Select({
  label, hint, error, options = [], id, lang = "en", style, containerStyle, ...rest
}) {
  const fam = lang === "bn" ? "var(--font-bangla)" : "var(--font-base)";
  const selId = id || (label ? "sel-" + String(label).replace(/\s+/g, "-").toLowerCase() : undefined);
  const borderColor = error ? "var(--status-danger)" : "var(--border-strong)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: fam, ...containerStyle }}>
      {label ? (
        <label htmlFor={selId} style={{ fontSize: "var(--text-sm)", fontWeight: "var(--fw-medium)", color: "var(--text-primary)" }}>{label}</label>
      ) : null}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <select
          id={selId}
          aria-invalid={error ? "true" : undefined}
          style={{
            width: "100%",
            height: 44,
            padding: "0 38px 0 12px",
            fontFamily: fam,
            fontSize: "var(--text-md)",
            color: "var(--text-primary)",
            background: "var(--surface)",
            border: `1px solid ${borderColor}`,
            borderRadius: "var(--radius-md)",
            outline: "none",
            appearance: "none",
            WebkitAppearance: "none",
            cursor: "pointer",
            boxSizing: "border-box",
            ...style,
          }}
          {...rest}
        >
          {options.map((o) => {
            const val = typeof o === "object" ? o.value : o;
            const lbl = typeof o === "object" ? o.label : o;
            return <option key={val} value={val}>{lbl}</option>;
          })}
        </select>
        <span style={{ position: "absolute", right: 12, display: "flex", color: "var(--text-secondary)", pointerEvents: "none" }}>
          <Icon name="chevron-down" size={18} />
        </span>
      </div>
      {error ? (
        <span style={{ fontSize: "var(--text-xs)", color: "var(--status-danger)" }}>{error}</span>
      ) : hint ? (
        <span style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>{hint}</span>
      ) : null}
    </div>
  );
}
