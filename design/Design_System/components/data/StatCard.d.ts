import * as React from "react";
import type { IconName } from "../core/Icon";

export interface StatCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "style"> {
  label: React.ReactNode;
  /** pre-formatted value node — use <Money> for taka, Bengali numerals as needed */
  value: React.ReactNode;
  icon?: IconName;
  tone?: "neutral" | "ok" | "warning" | "critical";
  /** trend chip: dir up/down/flat + text */
  trend?: { dir: "up" | "down" | "flat"; text: React.ReactNode };
  style?: React.CSSProperties;
}

/**
 * KPI tile for dashboards — label, large value, optional trend + icon.
 * Pass money via <Money> so grouping/numerals are correct.
 * @dsName StatCard
 * @startingPoint section="Data" subtitle="Dashboard KPI tile with trend" viewport="700x150"
 */
export declare function StatCard(props: StatCardProps): JSX.Element;
