import React from "react";
import { Icon } from "../core/Icon.jsx";

/* Per-item sync state for the offline-first mobile app.
   PENDING (queued) / SYNCED / CONFLICT / FAILED (retry). */
const MAP = {
  PENDING: { icon: "clock", fg: "var(--sev-warning)", bg: "var(--tint-warning)", en: "Pending", bn: "সিংক বাকি" },
  SYNCED: { icon: "check-circle", fg: "var(--status-ok)", bg: "var(--tint-ok)", en: "Synced", bn: "সিংক হয়েছে" },
  CONFLICT: { icon: "alert-triangle", fg: "var(--sev-warning)", bg: "var(--tint-warning)", en: "Conflict", bn: "দ্বন্দ্ব" },
  FAILED: { icon: "refresh-cw", fg: "var(--sev-critical)", bg: "var(--tint-critical)", en: "Failed — retry", bn: "ব্যর্থ — আবার" },
};

export function SyncBadge({ state = "PENDING", lang = "bn", showLabel = true, style, ...rest }) {
  const d = MAP[state] || MAP.PENDING;
  const label = lang === "bn" ? d.bn : d.en;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 26,
        padding: showLabel ? "0 10px 0 8px" : 0,
        width: showLabel ? undefined : 26,
        justifyContent: "center",
        borderRadius: "var(--radius-pill)",
        background: d.bg,
        color: d.fg,
        fontFamily: lang === "bn" ? "var(--font-bangla)" : "var(--font-base)",
        fontSize: "var(--text-xs)",
        fontWeight: "var(--fw-medium)",
        lineHeight: 1,
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      <Icon name={d.icon} size={14} title={label} />
      {showLabel ? label : null}
    </span>
  );
}
