import * as React from "react";
import type { IconName } from "./Icon";

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "style"> {
  /** color tone */
  tone?: "neutral" | "brand" | "ok" | "info" | "warning" | "critical";
  /** leading status dot */
  dot?: boolean;
  /** leading icon */
  icon?: IconName;
  style?: React.CSSProperties;
}

/**
 * Generic pill badge. For domain status vocab prefer StatusBadge / SyncBadge.
 * @dsName Badge
 */
export declare function Badge(props: BadgeProps): JSX.Element;
