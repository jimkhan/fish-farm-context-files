import React from "react";
import { Icon } from "./Icon.jsx";

const SIZES = {
  sm: { height: 36, padding: "0 12px", font: "var(--text-sm)", icon: 16, gap: 6 },
  md: { height: 44, padding: "0 16px", font: "var(--text-md)", icon: 20, gap: 8 },
  lg: { height: 52, padding: "0 24px", font: "var(--text-md)", icon: 24, gap: 10 },
};

const VARIANTS = {
  primary: { background: "var(--brand-primary)", color: "var(--text-inverse)", border: "1px solid var(--brand-primary)" },
  secondary: { background: "var(--surface)", color: "var(--text-primary)", border: "1px solid var(--border-strong)" },
  ghost: { background: "transparent", color: "var(--brand-primary)", border: "1px solid transparent" },
  danger: { background: "var(--status-danger)", color: "var(--text-inverse)", border: "1px solid var(--status-danger)" },
};

export function Button({
  children, variant = "primary", size = "md", icon, iconRight, block = false,
  disabled = false, type = "button", style, onClick, ...rest
}) {
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: block ? "flex" : "inline-flex",
        width: block ? "100%" : undefined,
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        height: s.height,
        padding: s.padding,
        font: "inherit",
        fontFamily: "var(--font-base)",
        fontSize: s.font,
        fontWeight: "var(--fw-medium)",
        lineHeight: 1,
        borderRadius: "var(--radius-md)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "background .15s ease, box-shadow .15s ease",
        outlineOffset: 2,
        ...v,
        ...style,
      }}
      {...rest}
    >
      {icon ? <Icon name={icon} size={s.icon} /> : null}
      {children ? <span>{children}</span> : null}
      {iconRight ? <Icon name={iconRight} size={s.icon} /> : null}
    </button>
  );
}
