import React from "react";
import { Icon } from "./Icon.jsx";

const SIZES = { sm: 36, md: 44, lg: 52 };
const ICON = { sm: 18, md: 20, lg: 24 };

export function IconButton({
  icon, label, size = "md", variant = "secondary", disabled = false, style, onClick, ...rest
}) {
  const dim = SIZES[size] || SIZES.md;
  const variants = {
    primary: { background: "var(--brand-primary)", color: "var(--text-inverse)", border: "1px solid var(--brand-primary)" },
    secondary: { background: "var(--surface)", color: "var(--text-secondary)", border: "1px solid var(--border-strong)" },
    ghost: { background: "transparent", color: "var(--text-secondary)", border: "1px solid transparent" },
  };
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: dim,
        height: dim,
        borderRadius: "var(--radius-md)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "background .15s ease",
        outlineOffset: 2,
        ...(variants[variant] || variants.secondary),
        ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={ICON[size] || ICON.md} title={label} />
    </button>
  );
}
