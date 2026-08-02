import * as React from "react";
import type { IconName } from "./Icon";

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  /** visual weight */
  variant?: "primary" | "secondary" | "ghost" | "danger";
  /** sm 36px / md 44px / lg 52px (lg meets mobile 48px tap target) */
  size?: "sm" | "md" | "lg";
  /** leading icon name */
  icon?: IconName;
  /** trailing icon name */
  iconRight?: IconName;
  /** full-width */
  block?: boolean;
  style?: React.CSSProperties;
}

/**
 * Primary action button. Teal primary, outlined secondary, quiet ghost, red danger.
 * @dsName Button
 * @startingPoint section="Core" subtitle="Teal action button, 4 variants x 3 sizes" viewport="700x120"
 */
export declare function Button(props: ButtonProps): JSX.Element;
