import * as React from "react";

export interface ConnectivityBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "style"> {
  /** online now? */
  online?: boolean;
  /** number of queued/pending writes */
  pending?: number;
  lang?: "bn" | "en";
  style?: React.CSSProperties;
}

/**
 * Global connectivity + pending-sync bar for the offline-first mobile app.
 * Offline -> calm "saved, will sync later" (Bangla); online with queue ->
 * "syncing N"; clear -> "all synced". Bangla by default.
 * @dsName ConnectivityBar
 */
export declare function ConnectivityBar(props: ConnectivityBarProps): JSX.Element;
