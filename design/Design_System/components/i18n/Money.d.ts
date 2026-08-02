import * as React from "react";

export interface MoneyProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "style"> {
  /** taka amount (integer; rounded to whole taka) */
  amount: number;
  /** Bengali numerals (default true — always true in FMS) */
  bengali?: boolean;
  /** render negatives in danger red (default true) */
  colorNegative?: boolean;
  size?: string;
  weight?: number | string;
  style?: React.CSSProperties;
}

/**
 * BDT money: "৳" + Bengali numerals + lakh/crore grouping, whole taka, no decimals.
 * Negatives (losses) render red. e.g. amount={123456} -> ৳১,২৩,৪৫৬
 * @dsName Money
 */
export declare function Money(props: MoneyProps): JSX.Element;
