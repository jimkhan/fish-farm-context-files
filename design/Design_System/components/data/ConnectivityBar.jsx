import React from "react";
import { Icon } from "../core/Icon.jsx";

/* Global connectivity + pending-sync indicator for the offline-first mobile app.
   online=true -> synced/queued state in teal; online=false -> calm offline bar.
   pending = number of queued writes. Bangla copy. */
export function ConnectivityBar({ online = true, pending = 0, lang = "bn", style, ...rest }) {
  const fam = lang === "bn" ? "var(--font-bangla)" : "var(--font-base)";
  const bnNum = (n) => String(n).replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
  const num = lang === "bn" ? bnNum(pending) : String(pending);

  let bg, fg, icon, text;
  if (!online) {
    bg = "var(--tint-warning)"; fg = "var(--sev-warning)"; icon = "wifi-off";
    text = lang === "bn" ? "অফলাইন — সংরক্ষিত, পরে সিংক হবে" : "Offline — saved, will sync later";
  } else if (pending > 0) {
    bg = "var(--tint-info)"; fg = "var(--sev-info)"; icon = "refresh-cw";
    text = lang === "bn" ? `${num}টি পরিবর্তন সিংক হচ্ছে` : `Syncing ${num} change(s)`;
  } else {
    bg = "var(--tint-ok)"; fg = "var(--status-ok)"; icon = "check-circle";
    text = lang === "bn" ? "সব সিংক হয়েছে" : "All synced";
  }

  return (
    <div
      role="status"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        background: bg,
        color: fg,
        fontFamily: fam,
        fontSize: "var(--text-sm)",
        fontWeight: "var(--fw-medium)",
        ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={18} title={text} />
      <span>{text}</span>
    </div>
  );
}
