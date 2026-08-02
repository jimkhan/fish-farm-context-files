import React from "react";
import { Badge } from "../core/Badge.jsx";

/* Exact FMS status vocabularies -> tone + labels (en / bn).
   kind: batch | task | severity | alert | feed | grade */
const MAP = {
  batch: {
    ACTIVE: { tone: "brand", dot: true, en: "Active", bn: "সক্রিয়" },
    HARVESTING: { tone: "info", dot: true, en: "Harvesting", bn: "আহরণ চলছে" },
    CLOSED: { tone: "neutral", dot: true, en: "Closed", bn: "বন্ধ" },
  },
  task: {
    SCHEDULED: { tone: "neutral", dot: true, en: "Scheduled", bn: "নির্ধারিত" },
    DUE: { tone: "warning", dot: true, en: "Due", bn: "বাকি" },
    DONE: { tone: "ok", icon: "check", en: "Done", bn: "সম্পন্ন" },
    MISSED: { tone: "critical", dot: true, en: "Missed", bn: "মিস" },
  },
  severity: {
    INFO: { tone: "info", icon: "info", en: "Info", bn: "তথ্য" },
    WARNING: { tone: "warning", icon: "alert-triangle", en: "Warning", bn: "সতর্কতা" },
    CRITICAL: { tone: "critical", icon: "alert-circle", en: "Critical", bn: "জরুরি" },
  },
  alert: {
    RAISED: { tone: "critical", dot: true, en: "Raised", bn: "উত্থাপিত" },
    SENT: { tone: "warning", dot: true, en: "Sent", bn: "পাঠানো" },
    ACKNOWLEDGED: { tone: "info", dot: true, en: "Acknowledged", bn: "স্বীকৃত" },
    RESOLVED: { tone: "ok", icon: "check", en: "Resolved", bn: "সমাধান" },
  },
  feed: {
    NORMAL: { tone: "ok", dot: true, en: "Normal", bn: "স্বাভাবিক" },
    LEFTOVER: { tone: "warning", dot: true, en: "Leftover", bn: "উদ্বৃত্ত" },
    EMPTY: { tone: "info", dot: true, en: "Empty", bn: "খালি" },
  },
  grade: {
    EXPORT: { tone: "brand", dot: true, en: "Export", bn: "রপ্তানি" },
    LOCAL: { tone: "neutral", dot: true, en: "Local", bn: "স্থানীয়" },
  },
};

export function StatusBadge({ kind, status, lang = "en", style, ...rest }) {
  const def = (MAP[kind] || {})[status];
  if (!def) return <Badge tone="neutral" style={style}>{status}</Badge>;
  const label = lang === "bn" ? def.bn : def.en;
  return (
    <Badge tone={def.tone} dot={def.dot} icon={def.icon} style={style} {...rest}>
      {label}
    </Badge>
  );
}
