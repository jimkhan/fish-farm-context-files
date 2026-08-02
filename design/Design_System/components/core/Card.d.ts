import * as React from "react";

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "style"> {
  padding?: number;
  /** hover affordance for clickable cards */
  interactive?: boolean;
  /** muted surface fill */
  muted?: boolean;
  style?: React.CSSProperties;
}

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "style" | "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** right-aligned action node (Button, IconButton, Badge) */
  action?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Surface container — white, 1px border, lg radius, soft card shadow.
 * @dsName Card
 * @startingPoint section="Core" subtitle="White surface card with header" viewport="700x180"
 */
export declare function Card(props: CardProps): JSX.Element;
export declare function CardHeader(props: CardHeaderProps): JSX.Element;
