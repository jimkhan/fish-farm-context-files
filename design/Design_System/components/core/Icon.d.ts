import * as React from "react";

export type IconName =
  | "droplet" | "fish" | "thermometer" | "wind" | "utensils" | "camera"
  | "alert-triangle" | "alert-circle" | "info" | "check-circle" | "check" | "x"
  | "clock" | "calendar" | "cloud-off" | "cloud" | "refresh-cw" | "wifi-off" | "wifi"
  | "users" | "user" | "eye" | "settings" | "layout-dashboard" | "trending-up"
  | "trending-down" | "dollar-sign" | "clipboard-list" | "plus" | "chevron-right"
  | "chevron-down" | "arrow-left" | "map-pin" | "skull" | "life-buoy" | "scale"
  | "bell" | "menu" | "home" | "lock" | "archive";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  /** Lucide-style icon name */
  name: IconName;
  /** px, defaults 20 (also 28 / 40 in the icon scale) */
  size?: number;
  strokeWidth?: number;
  color?: string;
  /** accessible label; omit for decorative icons (aria-hidden) */
  title?: string;
}

/**
 * Inline lucide-style SVG icon. currentColor by default.
 * @dsName Icon
 */
export declare function Icon(props: IconProps): JSX.Element;
