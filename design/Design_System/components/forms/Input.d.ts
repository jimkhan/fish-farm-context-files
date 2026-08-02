import * as React from "react";
import type { IconName } from "../core/Icon";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "style"> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  /** error message; also sets aria-invalid + red border */
  error?: React.ReactNode;
  icon?: IconName;
  /** trailing unit/suffix, e.g. "kg", "৳" */
  suffix?: React.ReactNode;
  lang?: "en" | "bn";
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
}

/**
 * Labeled text input with icon, suffix, hint and error states. 44px tall.
 * @dsName Input
 */
export declare function Input(props: InputProps): JSX.Element;
