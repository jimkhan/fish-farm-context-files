import * as React from "react";

export interface SkeletonProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "style"> {
  width?: number | string;
  height?: number | string;
  radius?: string;
  style?: React.CSSProperties;
}

export interface SkeletonRowProps {
  /** number of meta lines below the title */
  lines?: number;
  style?: React.CSSProperties;
}

/**
 * Shimmering loading placeholder for substantial content. Prefer over spinners.
 * @dsName Skeleton
 */
export declare function Skeleton(props: SkeletonProps): JSX.Element;
export declare function SkeletonRow(props: SkeletonRowProps): JSX.Element;
