import * as React from "react";
import type { IconName } from "./Icon";

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  icon: IconName;
  /** required accessible label (aria-label + title) */
  label: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost";
  style?: React.CSSProperties;
}

/**
 * Square icon-only button. Always requires an accessible `label`.
 * @dsName IconButton
 */
export declare function IconButton(props: IconButtonProps): JSX.Element;
