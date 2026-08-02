import * as React from "react";

export interface SelectOption { value: string; label: React.ReactNode; }

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "style"> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  /** option list — strings or {value,label} */
  options?: (string | SelectOption)[];
  lang?: "en" | "bn";
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
}

/**
 * Labeled native select with chevron, hint and error states. 44px tall.
 * @dsName Select
 */
export declare function Select(props: SelectProps): JSX.Element;
