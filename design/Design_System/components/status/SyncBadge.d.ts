import * as React from "react";

export interface SyncBadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "style"> {
  /** offline-first per-item sync state */
  state?: "PENDING" | "SYNCED" | "CONFLICT" | "FAILED";
  /** bn (default, worker mobile) or en */
  lang?: "bn" | "en";
  /** show text label beside the icon */
  showLabel?: boolean;
  style?: React.CSSProperties;
}

/**
 * Per-item offline sync state for the worker mobile app. Bangla by default.
 * @dsName SyncBadge
 */
export declare function SyncBadge(props: SyncBadgeProps): JSX.Element;
