import React from "react";
import { formatBDT } from "./l10n.js";

/* BDT money. Bengali numerals + lakh/crore grouping, whole taka, no decimals.
   Losses / negatives render red. Money is ALWAYS Bengali numerals (web + mobile). */
export function Money({ amount, bengali = true, colorNegative = true, size, weight, style, ...rest }) {
  const n = Number(amount) || 0;
  const negative = n < 0;
  return (
    <span
      style={{
        fontFamily: "var(--font-base)",
        fontVariantNumeric: "tabular-nums",
        fontSize: size || "inherit",
        fontWeight: weight || "var(--fw-medium)",
        color: negative && colorNegative ? "var(--status-danger)" : "inherit",
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      {formatBDT(n, { bengali })}
    </span>
  );
}
