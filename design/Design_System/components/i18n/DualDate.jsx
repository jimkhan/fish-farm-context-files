import React from "react";
import { toBengaliNumerals } from "./l10n.js";

/* Dual date for WEB (owner/partner): Gregorian + Bangla in parens.
   e.g. "2026-07-21 (৫ শ্রাবণ ১৪৩৩)".
   Single Bangla date for MOBILE (worker): pass mode="bn".
   The Bangla portion (`bangla`) must come from the app's calendar package —
   pass it explicitly; this component only lays out + applies numerals. */
export function DualDate({ gregorian, bangla, mode = "dual", season, tone = "default", style, ...rest }) {
  const banglaText = bangla ? toBengaliNumerals(bangla) : null;
  const inverse = tone === "inverse";
  const mutedColor = inverse ? "rgba(255,255,255,.72)" : "var(--text-secondary)";
  if (mode === "bn") {
    return (
      <span style={{ fontFamily: "var(--font-bangla)", color: "inherit", ...style }} {...rest}>
        {banglaText}
        {season ? <span style={{ color: mutedColor }}>{" · " + season}</span> : null}
      </span>
    );
  }
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: 6,
        fontVariantNumeric: "tabular-nums",
        color: "inherit",
        ...style,
      }}
      {...rest}
    >
      <span style={{ fontFamily: "var(--font-base)" }}>{gregorian}</span>
      {banglaText ? (
        <span style={{ fontFamily: "var(--font-bangla)", color: mutedColor, fontSize: "0.92em" }}>
          ({banglaText})
        </span>
      ) : null}
    </span>
  );
}
