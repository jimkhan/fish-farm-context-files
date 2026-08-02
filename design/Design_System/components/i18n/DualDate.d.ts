import * as React from "react";

export interface DualDateProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "style"> {
  /** Gregorian date string, e.g. "2026-07-21" */
  gregorian?: string;
  /** Bangla calendar date from the app's calendar package, e.g. "5 শ্রাবণ 1433"
   *  (Western digits are auto-converted to Bengali numerals) */
  bangla?: string;
  /** dual = web (Gregorian + Bangla in parens); bn = mobile (Bangla only) */
  mode?: "dual" | "bn";
  /** optional Bangla season (ritu) suffix, mobile only */
  season?: string;
  /** inverse renders the muted (Bangla/season) half in light color for dark surfaces */
  tone?: "default" | "inverse";
  style?: React.CSSProperties;
}

/**
 * Localized date. WEB shows dual dates "2026-07-21 (৫ শ্রাবণ ১৪৩৩)"; MOBILE
 * shows the single Bangla date. The Bangla value must come from the app's
 * own calendar package — never from Intl.
 * @dsName DualDate
 */
export declare function DualDate(props: DualDateProps): JSX.Element;
