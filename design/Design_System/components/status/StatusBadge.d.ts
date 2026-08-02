import * as React from "react";

export type StatusKind = "batch" | "task" | "severity" | "alert" | "feed" | "grade";

export interface StatusBadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "style"> {
  /** which vocabulary */
  kind: StatusKind;
  /**
   * batch: ACTIVE|HARVESTING|CLOSED
   * task: SCHEDULED|DUE|DONE|MISSED
   * severity: INFO|WARNING|CRITICAL
   * alert: RAISED|SENT|ACKNOWLEDGED|RESOLVED
   * feed: NORMAL|LEFTOVER|EMPTY
   * grade: EXPORT|LOCAL
   */
  status: string;
  /** en (web) or bn (mobile/worker) label */
  lang?: "en" | "bn";
  style?: React.CSSProperties;
}

/**
 * Canonical status badge for every FMS status vocabulary. Maps the exact
 * status enum to the correct tone + bilingual label — never hand-color status.
 * @dsName StatusBadge
 * @startingPoint section="Status" subtitle="Batch/task/alert/feed/grade status vocab" viewport="700x160"
 */
export declare function StatusBadge(props: StatusBadgeProps): JSX.Element;
