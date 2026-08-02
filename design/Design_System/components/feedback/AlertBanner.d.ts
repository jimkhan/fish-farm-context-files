import * as React from "react";

export interface AlertBannerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "style" | "title"> {
  severity?: "info" | "warning" | "critical";
  title?: React.ReactNode;
  /** body copy */
  children?: React.ReactNode;
  /** trailing action node (Button / link) */
  action?: React.ReactNode;
  lang?: "en" | "bn";
  style?: React.CSSProperties;
}

/**
 * Inline severity banner — closed-project notice, degraded-service note,
 * validation. Calm tinted surface, never a full-bleed alarm. Critical gets role=alert.
 * @dsName AlertBanner
 */
export declare function AlertBanner(props: AlertBannerProps): JSX.Element;
