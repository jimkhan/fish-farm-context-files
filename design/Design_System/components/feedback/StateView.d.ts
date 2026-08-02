import * as React from "react";
import type { IconName } from "../core/Icon";

export interface StateViewProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "style" | "title"> {
  /** empty (no data yet), unavailable (external service down), stale (cached/out of date), offline */
  variant?: "empty" | "unavailable" | "stale" | "offline";
  icon?: IconName;
  title?: React.ReactNode;
  message?: React.ReactNode;
  /** one primary action — no dead ends */
  action?: React.ReactNode;
  lang?: "en" | "bn";
  compact?: boolean;
  style?: React.CSSProperties;
}

/**
 * Purposeful empty / degraded / stale / offline placeholder. Calm muted surface,
 * icon + one-line explanation + one action. Use instead of a blank/crash for any
 * widget backed by an external service (camera, weather) or an empty list.
 * @dsName StateView
 * @startingPoint section="Feedback" subtitle="Empty / unavailable / stale / offline states" viewport="700x260"
 */
export declare function StateView(props: StateViewProps): JSX.Element;
