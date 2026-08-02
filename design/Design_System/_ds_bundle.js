/* @ds-bundle: {"format":4,"namespace":"FMSAquacultureDesignSystem_dbe44a","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"CardHeader","sourcePath":"components/core/Card.jsx"},{"name":"ICONS","sourcePath":"components/core/Icon.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"ConnectivityBar","sourcePath":"components/data/ConnectivityBar.jsx"},{"name":"StatCard","sourcePath":"components/data/StatCard.jsx"},{"name":"AlertBanner","sourcePath":"components/feedback/AlertBanner.jsx"},{"name":"Skeleton","sourcePath":"components/feedback/Skeleton.jsx"},{"name":"SkeletonRow","sourcePath":"components/feedback/Skeleton.jsx"},{"name":"StateView","sourcePath":"components/feedback/StateView.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"DualDate","sourcePath":"components/i18n/DualDate.jsx"},{"name":"Money","sourcePath":"components/i18n/Money.jsx"},{"name":"BANGLA_MONTHS","sourcePath":"components/i18n/l10n.js"},{"name":"BANGLA_SEASONS","sourcePath":"components/i18n/l10n.js"},{"name":"StatusBadge","sourcePath":"components/status/StatusBadge.jsx"},{"name":"SyncBadge","sourcePath":"components/status/SyncBadge.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"21ab4c99c93b","components/core/Button.jsx":"145ec2351326","components/core/Card.jsx":"c68720cb6b8a","components/core/Icon.jsx":"325e8ea04cbc","components/core/IconButton.jsx":"329816edbe71","components/data/ConnectivityBar.jsx":"9eac1bd8a95c","components/data/StatCard.jsx":"c6886250a736","components/feedback/AlertBanner.jsx":"82ccab2e9cf2","components/feedback/Skeleton.jsx":"71b0ec8886c8","components/feedback/StateView.jsx":"c1c48962d369","components/forms/Input.jsx":"d456198794cd","components/forms/Select.jsx":"a93d6eb9f160","components/i18n/DualDate.jsx":"71f67bf32dd8","components/i18n/Money.jsx":"20a5e4e833e7","components/i18n/l10n.js":"82d56943bf09","components/status/StatusBadge.jsx":"bf9546f91b94","components/status/SyncBadge.jsx":"8e91e376ab3f","ui_kits/owner_web/OwnerDashboard.jsx":"3b9040a8144c","ui_kits/owner_web/ownerData.js":"deb9330a04c8","ui_kits/partner_web/PartnerApp.jsx":"5225fed3468b","ui_kits/worker_mobile/WorkerApp.jsx":"e2d4ca33e9f7","ui_kits/worker_mobile/workerData.js":"855d74d88750"},"inlinedExternals":[],"unexposedExports":[{"name":"formatBDT","sourcePath":"components/i18n/l10n.js"},{"name":"groupSouthAsian","sourcePath":"components/i18n/l10n.js"},{"name":"toBengaliNumerals","sourcePath":"components/i18n/l10n.js"}]} */

(() => {

const __ds_ns = (window.FMSAquacultureDesignSystem_dbe44a = window.FMSAquacultureDesignSystem_dbe44a || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  children,
  padding = 16,
  interactive = false,
  muted = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: muted ? "var(--surface-muted)" : "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-card)",
      padding,
      cursor: interactive ? "pointer" : undefined,
      transition: interactive ? "box-shadow .15s ease, border-color .15s ease" : undefined,
      ...style
    }
  }, rest), children);
}
function CardHeader({
  title,
  subtitle,
  action,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 12,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-md)",
      fontWeight: "var(--fw-bold)",
      color: "var(--text-primary)",
      lineHeight: "var(--lh-tight)"
    }
  }, title), subtitle ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--text-secondary)",
      marginTop: 2
    }
  }, subtitle) : null), action || null);
}
Object.assign(__ds_scope, { Card, CardHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Lucide-style icon set (24x24, stroke, currentColor).
   Paths transcribed from the open-source Lucide icon set (ISC).
   Curated to the FMS aquaculture domain. */
const ICONS = {
  droplet: "M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5S5 13 5 15a7 7 0 0 0 7 7z",
  fish: "M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6zM18 12v.5M16 17.93a9.77 9.77 0 0 1 0-11.86M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4M16.01 17.47l-.23 1.4A2 2 0 0 1 13.8 20.5H9.5",
  thermometer: "M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z",
  wind: "M12.8 19.6A2 2 0 1 0 14 16H2M17.5 8a2.5 2.5 0 1 1 2 4H2M9.8 4.4A2 2 0 1 1 11 8H2",
  utensils: "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7",
  camera: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  "alert-triangle": "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  "alert-circle": "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 8v4M12 16h.01",
  info: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01",
  "check-circle": "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3",
  check: "M20 6 9 17l-5-5",
  x: "M18 6 6 18M6 6l12 12",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  "cloud-off": "M2 2l20 20M5.8 5.8A6 6 0 0 0 8 17h10a4 4 0 0 0 1.3-.2M12 6a6 6 0 0 1 5.7 4.2A4 4 0 0 1 20 14",
  cloud: "M17.5 19a4.5 4.5 0 1 0 0-9h-1.8A7 7 0 1 0 4 15.7",
  "refresh-cw": "M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6",
  "wifi-off": "M2 2l20 20M8.5 16.5a5 5 0 0 1 7 0M2 8.82a15 15 0 0 1 4.17-2.65M10.66 5c4.01-.36 8.14.9 11.34 3.76M16.85 11.25a10 10 0 0 1 2.22 1.68M5 12.85a10 10 0 0 1 5.24-2.76M12 20h.01",
  wifi: "M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  user: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  eye: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  settings: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  "layout-dashboard": "M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z",
  "trending-up": "M22 7 13.5 15.5 8.5 10.5 2 17M16 7h6v6",
  "trending-down": "M22 17 13.5 8.5 8.5 13.5 2 7M16 17h6v-6",
  "dollar-sign": "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  "clipboard-list": "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM12 11h4M12 16h4M8 11h.01M8 16h.01",
  plus: "M12 5v14M5 12h14",
  "chevron-right": "M9 18l6-6-6-6",
  "chevron-down": "M6 9l6 6 6-6",
  "arrow-left": "M19 12H5M12 19l-7-7 7-7",
  "map-pin": "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  skull: "M8 20v2h8v-2M12.5 17l-.5-1-.5 1h1zM16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20M9 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM15 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  "life-buoy": "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M14.83 9.17l3.53-3.53M4.93 19.07l4.24-4.24",
  scale: "M12 3v18M8 21h8M7 7l-4 6a3 3 0 0 0 6 0L5 7zM17 7l-4 6a3 3 0 0 0 6 0l-2-6zM3 7h4l5-2 5 2h4",
  "bell": "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0",
  "menu": "M4 12h16M4 6h16M4 18h16",
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  lock: "M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM7 11V7a5 5 0 0 1 10 0v4",
  archive: "M21 8v13H3V8M1 3h22v5H1zM10 12h4"
};
function Icon({
  name,
  size = 20,
  strokeWidth = 2,
  color = "currentColor",
  title,
  style,
  ...rest
}) {
  const d = ICONS[name];
  if (!d) return null;
  const paths = d.split("M").filter(Boolean).map((seg, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: "M" + seg.trim()
  }));
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    role: title ? "img" : "presentation",
    "aria-label": title,
    "aria-hidden": title ? undefined : true,
    style: {
      display: "block",
      flexShrink: 0,
      ...style
    }
  }, rest), title ? /*#__PURE__*/React.createElement("title", null, title) : null, paths);
}
Object.assign(__ds_scope, { ICONS, Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  neutral: {
    bg: "var(--surface-muted)",
    fg: "var(--text-secondary)",
    dot: "var(--status-muted)"
  },
  brand: {
    bg: "var(--tint-brand)",
    fg: "var(--brand-primary-dark)",
    dot: "var(--brand-primary)"
  },
  ok: {
    bg: "var(--tint-ok)",
    fg: "#166534",
    dot: "var(--status-ok)"
  },
  info: {
    bg: "var(--tint-info)",
    fg: "#075985",
    dot: "var(--sev-info)"
  },
  warning: {
    bg: "var(--tint-warning)",
    fg: "#92400E",
    dot: "var(--sev-warning)"
  },
  critical: {
    bg: "var(--tint-critical)",
    fg: "#991B1B",
    dot: "var(--sev-critical)"
  }
};
function Badge({
  children,
  tone = "neutral",
  dot = false,
  icon,
  style,
  ...rest
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 24,
      padding: "0 10px",
      borderRadius: "var(--radius-pill)",
      background: t.bg,
      color: t.fg,
      fontFamily: "var(--font-base)",
      fontSize: "var(--text-xs)",
      fontWeight: "var(--fw-medium)",
      lineHeight: 1,
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), dot ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: t.dot,
      flexShrink: 0
    }
  }) : null, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 13
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    height: 36,
    padding: "0 12px",
    font: "var(--text-sm)",
    icon: 16,
    gap: 6
  },
  md: {
    height: 44,
    padding: "0 16px",
    font: "var(--text-md)",
    icon: 20,
    gap: 8
  },
  lg: {
    height: 52,
    padding: "0 24px",
    font: "var(--text-md)",
    icon: 24,
    gap: 10
  }
};
const VARIANTS = {
  primary: {
    background: "var(--brand-primary)",
    color: "var(--text-inverse)",
    border: "1px solid var(--brand-primary)"
  },
  secondary: {
    background: "var(--surface)",
    color: "var(--text-primary)",
    border: "1px solid var(--border-strong)"
  },
  ghost: {
    background: "transparent",
    color: "var(--brand-primary)",
    border: "1px solid transparent"
  },
  danger: {
    background: "var(--status-danger)",
    color: "var(--text-inverse)",
    border: "1px solid var(--status-danger)"
  }
};
function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  block = false,
  disabled = false,
  type = "button",
  style,
  onClick,
  ...rest
}) {
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    style: {
      display: block ? "flex" : "inline-flex",
      width: block ? "100%" : undefined,
      alignItems: "center",
      justifyContent: "center",
      gap: s.gap,
      height: s.height,
      padding: s.padding,
      font: "inherit",
      fontFamily: "var(--font-base)",
      fontSize: s.font,
      fontWeight: "var(--fw-medium)",
      lineHeight: 1,
      borderRadius: "var(--radius-md)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      transition: "background .15s ease, box-shadow .15s ease",
      outlineOffset: 2,
      ...v,
      ...style
    }
  }, rest), icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: s.icon
  }) : null, children ? /*#__PURE__*/React.createElement("span", null, children) : null, iconRight ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.icon
  }) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: 36,
  md: 44,
  lg: 52
};
const ICON = {
  sm: 18,
  md: 20,
  lg: 24
};
function IconButton({
  icon,
  label,
  size = "md",
  variant = "secondary",
  disabled = false,
  style,
  onClick,
  ...rest
}) {
  const dim = SIZES[size] || SIZES.md;
  const variants = {
    primary: {
      background: "var(--brand-primary)",
      color: "var(--text-inverse)",
      border: "1px solid var(--brand-primary)"
    },
    secondary: {
      background: "var(--surface)",
      color: "var(--text-secondary)",
      border: "1px solid var(--border-strong)"
    },
    ghost: {
      background: "transparent",
      color: "var(--text-secondary)",
      border: "1px solid transparent"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onClick: onClick,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: dim,
      height: dim,
      borderRadius: "var(--radius-md)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      transition: "background .15s ease",
      outlineOffset: 2,
      ...(variants[variant] || variants.secondary),
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: ICON[size] || ICON.md,
    title: label
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/data/ConnectivityBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Global connectivity + pending-sync indicator for the offline-first mobile app.
   online=true -> synced/queued state in teal; online=false -> calm offline bar.
   pending = number of queued writes. Bangla copy. */
function ConnectivityBar({
  online = true,
  pending = 0,
  lang = "bn",
  style,
  ...rest
}) {
  const fam = lang === "bn" ? "var(--font-bangla)" : "var(--font-base)";
  const bnNum = n => String(n).replace(/[0-9]/g, d => "০১২৩৪৫৬৭৮৯"[+d]);
  const num = lang === "bn" ? bnNum(pending) : String(pending);
  let bg, fg, icon, text;
  if (!online) {
    bg = "var(--tint-warning)";
    fg = "var(--sev-warning)";
    icon = "wifi-off";
    text = lang === "bn" ? "অফলাইন — সংরক্ষিত, পরে সিংক হবে" : "Offline — saved, will sync later";
  } else if (pending > 0) {
    bg = "var(--tint-info)";
    fg = "var(--sev-info)";
    icon = "refresh-cw";
    text = lang === "bn" ? `${num}টি পরিবর্তন সিংক হচ্ছে` : `Syncing ${num} change(s)`;
  } else {
    bg = "var(--tint-ok)";
    fg = "var(--status-ok)";
    icon = "check-circle";
    text = lang === "bn" ? "সব সিংক হয়েছে" : "All synced";
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 14px",
      background: bg,
      color: fg,
      fontFamily: fam,
      fontSize: "var(--text-sm)",
      fontWeight: "var(--fw-medium)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 18,
    title: text
  }), /*#__PURE__*/React.createElement("span", null, text));
}
Object.assign(__ds_scope, { ConnectivityBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ConnectivityBar.jsx", error: String((e && e.message) || e) }); }

// components/data/StatCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* KPI stat tile — label, big value, optional trend + icon. Value is passed
   pre-formatted (use <Money> for taka). Trend: {dir:'up'|'down', text} */
function StatCard({
  label,
  value,
  icon,
  trend,
  tone = "neutral",
  style,
  ...rest
}) {
  const toneColor = {
    neutral: "var(--brand-primary)",
    ok: "var(--status-ok)",
    warning: "var(--sev-warning)",
    critical: "var(--sev-critical)"
  }[tone] || "var(--brand-primary)";
  const trendColor = trend ? trend.dir === "up" ? "var(--status-ok)" : trend.dir === "down" ? "var(--status-danger)" : "var(--text-secondary)" : null;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-card)",
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--text-secondary)",
      fontFamily: "var(--font-base)"
    }
  }, label), icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: "var(--radius-md)",
      background: "var(--tint-brand)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 18,
    color: toneColor
  })) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-2xl)",
      fontWeight: "var(--fw-bold)",
      color: "var(--text-primary)",
      lineHeight: "var(--lh-tight)",
      fontVariantNumeric: "tabular-nums"
    }
  }, value), trend ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      fontSize: "var(--text-xs)",
      color: trendColor,
      fontWeight: "var(--fw-medium)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: trend.dir === "down" ? "trending-down" : "trending-up",
    size: 14
  }), trend.text) : null);
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/AlertBanner.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SEV = {
  info: {
    icon: "info",
    fg: "var(--sev-info)",
    bg: "var(--tint-info)",
    border: "#BAE6FD",
    title: "#075985"
  },
  warning: {
    icon: "alert-triangle",
    fg: "var(--sev-warning)",
    bg: "var(--tint-warning)",
    border: "#FDE68A",
    title: "#92400E"
  },
  critical: {
    icon: "alert-circle",
    fg: "var(--sev-critical)",
    bg: "var(--tint-critical)",
    border: "#FECACA",
    title: "#991B1B"
  }
};
function AlertBanner({
  severity = "info",
  title,
  children,
  action,
  lang = "en",
  style,
  ...rest
}) {
  const s = SEV[severity] || SEV.info;
  const fam = lang === "bn" ? "var(--font-bangla)" : "var(--font-base)";
  return /*#__PURE__*/React.createElement("div", _extends({
    role: severity === "critical" ? "alert" : "status",
    style: {
      display: "flex",
      gap: 12,
      padding: "12px 14px",
      background: s.bg,
      border: `1px solid ${s.border}`,
      borderRadius: "var(--radius-md)",
      fontFamily: fam,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: s.icon,
    size: 20,
    color: s.fg,
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, title ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--fw-bold)",
      color: s.title,
      lineHeight: "var(--lh-tight)"
    }
  }, title) : null, children ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--text-secondary)",
      marginTop: title ? 2 : 0,
      lineHeight: "var(--lh-normal)"
    }
  }, children) : null), action ? /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, action) : null);
}
Object.assign(__ds_scope, { AlertBanner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/AlertBanner.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Skeleton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Skeleton placeholder for substantial loading content (not a spinner). */
function Skeleton({
  width = "100%",
  height = 16,
  radius = "var(--radius-sm)",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    "aria-hidden": "true",
    style: {
      display: "block",
      width,
      height,
      borderRadius: radius,
      background: "linear-gradient(90deg, var(--surface-muted) 25%, #E9EEF4 37%, var(--surface-muted) 63%)",
      backgroundSize: "400% 100%",
      animation: "fms-shimmer 1.4s ease infinite",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("style", null, "@keyframes fms-shimmer{0%{background-position:100% 0}100%{background-position:0 0}}"));
}

/* Composed skeleton mimicking a card row: title line + two meta lines. */
function SkeletonRow({
  lines = 2,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      ...style
    }
  }, /*#__PURE__*/React.createElement(Skeleton, {
    width: "55%",
    height: 18
  }), Array.from({
    length: lines
  }).map((_, i) => /*#__PURE__*/React.createElement(Skeleton, {
    key: i,
    width: i === lines - 1 ? "70%" : "90%",
    height: 12
  })));
}
Object.assign(__ds_scope, { Skeleton, SkeletonRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Skeleton.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StateView.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Purposeful state view: empty | unavailable | stale | offline.
   Calm muted surface, icon, one-line explanation, one primary action. Never a crash/blank. */
const VARIANTS = {
  empty: {
    icon: "clipboard-list",
    fg: "var(--status-muted)",
    bg: "transparent",
    border: "1px dashed var(--border-strong)"
  },
  unavailable: {
    icon: "alert-triangle",
    fg: "var(--sev-warning)",
    bg: "var(--surface-muted)",
    border: "1px solid var(--border)"
  },
  stale: {
    icon: "clock",
    fg: "var(--sev-warning)",
    bg: "var(--surface-muted)",
    border: "1px solid var(--border)"
  },
  offline: {
    icon: "wifi-off",
    fg: "var(--status-muted)",
    bg: "var(--surface-muted)",
    border: "1px solid var(--border)"
  }
};
function StateView({
  variant = "empty",
  icon,
  title,
  message,
  action,
  lang = "en",
  compact = false,
  style,
  ...rest
}) {
  const v = VARIANTS[variant] || VARIANTS.empty;
  const fam = lang === "bn" ? "var(--font-bangla)" : "var(--font-base)";
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      gap: 8,
      padding: compact ? "20px 16px" : "36px 24px",
      background: v.bg,
      border: v.border,
      borderRadius: "var(--radius-lg)",
      fontFamily: fam,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: "var(--radius-pill)",
      background: "var(--surface)",
      border: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 2
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon || v.icon,
    size: 22,
    color: v.fg
  })), title ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-md)",
      fontWeight: "var(--fw-bold)",
      color: "var(--text-primary)"
    }
  }, title) : null, message ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--text-secondary)",
      maxWidth: 320,
      lineHeight: "var(--lh-normal)"
    }
  }, message) : null, action ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, action) : null);
}
Object.assign(__ds_scope, { StateView });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StateView.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  hint,
  error,
  icon,
  suffix,
  id,
  lang = "en",
  style,
  containerStyle,
  ...rest
}) {
  const fam = lang === "bn" ? "var(--font-bangla)" : "var(--font-base)";
  const inputId = id || (label ? "in-" + String(label).replace(/\s+/g, "-").toLowerCase() : undefined);
  const borderColor = error ? "var(--status-danger)" : "var(--border-strong)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      fontFamily: fam,
      ...containerStyle
    }
  }, label ? /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--fw-medium)",
      color: "var(--text-primary)"
    }
  }, label) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    }
  }, icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 12,
      display: "flex",
      color: "var(--text-secondary)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 18
  })) : null, /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    "aria-invalid": error ? "true" : undefined,
    style: {
      width: "100%",
      height: 44,
      padding: icon ? "0 12px 0 38px" : "0 12px",
      paddingRight: suffix ? 44 : 12,
      fontFamily: fam,
      fontSize: "var(--text-md)",
      color: "var(--text-primary)",
      background: "var(--surface)",
      border: `1px solid ${borderColor}`,
      borderRadius: "var(--radius-md)",
      outline: "none",
      boxSizing: "border-box",
      ...style
    }
  }, rest)), suffix ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 12,
      color: "var(--text-secondary)",
      fontSize: "var(--text-sm)"
    }
  }, suffix) : null), error ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--status-danger)"
    }
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--text-secondary)"
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  label,
  hint,
  error,
  options = [],
  id,
  lang = "en",
  style,
  containerStyle,
  ...rest
}) {
  const fam = lang === "bn" ? "var(--font-bangla)" : "var(--font-base)";
  const selId = id || (label ? "sel-" + String(label).replace(/\s+/g, "-").toLowerCase() : undefined);
  const borderColor = error ? "var(--status-danger)" : "var(--border-strong)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      fontFamily: fam,
      ...containerStyle
    }
  }, label ? /*#__PURE__*/React.createElement("label", {
    htmlFor: selId,
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--fw-medium)",
      color: "var(--text-primary)"
    }
  }, label) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selId,
    "aria-invalid": error ? "true" : undefined,
    style: {
      width: "100%",
      height: 44,
      padding: "0 38px 0 12px",
      fontFamily: fam,
      fontSize: "var(--text-md)",
      color: "var(--text-primary)",
      background: "var(--surface)",
      border: `1px solid ${borderColor}`,
      borderRadius: "var(--radius-md)",
      outline: "none",
      appearance: "none",
      WebkitAppearance: "none",
      cursor: "pointer",
      boxSizing: "border-box",
      ...style
    }
  }, rest), options.map(o => {
    const val = typeof o === "object" ? o.value : o;
    const lbl = typeof o === "object" ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: val,
      value: val
    }, lbl);
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 12,
      display: "flex",
      color: "var(--text-secondary)",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 18
  }))), error ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--status-danger)"
    }
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--text-secondary)"
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/i18n/l10n.js
try { (() => {
/* FMS localization helpers — business logic only (no styling).
   Bengali numerals, BDT money (lakh/crore grouping), Bangla month/season names.
   NOTE: real Gregorian<->Bangla calendar conversion comes from the app's own
   calendar package. These helpers format numerals/money and provide Bangla
   month + season (ritu) names; pass an explicit Bangla date for display. */

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
function toBengaliNumerals(input) {
  return String(input).replace(/[0-9]/g, d => BN_DIGITS[+d]);
}

/** South-Asian (lakh/crore) grouping of an integer's digits, as a string. */
function groupSouthAsian(intStr) {
  const neg = intStr.startsWith("-");
  let s = neg ? intStr.slice(1) : intStr;
  if (s.length <= 3) return (neg ? "-" : "") + s;
  const last3 = s.slice(-3);
  let rest = s.slice(0, -3);
  rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return (neg ? "-" : "") + rest + "," + last3;
}

/** Whole-taka BDT: "৳" + Bengali numerals + lakh/crore grouping. No decimals. */
function formatBDT(amount, {
  bengali = true
} = {}) {
  const rounded = Math.round(Number(amount) || 0);
  const grouped = groupSouthAsian(String(rounded));
  const withNumerals = bengali ? toBengaliNumerals(grouped) : grouped;
  return "৳" + withNumerals;
}
const BANGLA_MONTHS = ["বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন", "কার্তিক", "অগ্রহায়ণ", "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র"];

/** Bangla seasons (ritu) */
const BANGLA_SEASONS = {
  grishmo: "গ্রীষ্ম",
  // summer
  borsha: "বর্ষা",
  // monsoon
  sharat: "শরৎ",
  // autumn
  hemanta: "হেমন্ত",
  // late autumn
  sheet: "শীত",
  // winter
  basanta: "বসন্ত" // spring
};
Object.assign(__ds_scope, { toBengaliNumerals, groupSouthAsian, formatBDT, BANGLA_MONTHS, BANGLA_SEASONS });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/i18n/l10n.js", error: String((e && e.message) || e) }); }

// components/i18n/DualDate.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Dual date for WEB (owner/partner): Gregorian + Bangla in parens.
   e.g. "2026-07-21 (৫ শ্রাবণ ১৪৩৩)".
   Single Bangla date for MOBILE (worker): pass mode="bn".
   The Bangla portion (`bangla`) must come from the app's calendar package —
   pass it explicitly; this component only lays out + applies numerals. */
function DualDate({
  gregorian,
  bangla,
  mode = "dual",
  season,
  tone = "default",
  style,
  ...rest
}) {
  const banglaText = bangla ? __ds_scope.toBengaliNumerals(bangla) : null;
  const inverse = tone === "inverse";
  const mutedColor = inverse ? "rgba(255,255,255,.72)" : "var(--text-secondary)";
  if (mode === "bn") {
    return /*#__PURE__*/React.createElement("span", _extends({
      style: {
        fontFamily: "var(--font-bangla)",
        color: "inherit",
        ...style
      }
    }, rest), banglaText, season ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: mutedColor
      }
    }, " · " + season) : null);
  }
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "baseline",
      gap: 6,
      fontVariantNumeric: "tabular-nums",
      color: "inherit",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-base)"
    }
  }, gregorian), banglaText ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-bangla)",
      color: mutedColor,
      fontSize: "0.92em"
    }
  }, "(", banglaText, ")") : null);
}
Object.assign(__ds_scope, { DualDate });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/i18n/DualDate.jsx", error: String((e && e.message) || e) }); }

// components/i18n/Money.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* BDT money. Bengali numerals + lakh/crore grouping, whole taka, no decimals.
   Losses / negatives render red. Money is ALWAYS Bengali numerals (web + mobile). */
function Money({
  amount,
  bengali = true,
  colorNegative = true,
  size,
  weight,
  style,
  ...rest
}) {
  const n = Number(amount) || 0;
  const negative = n < 0;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      fontFamily: "var(--font-base)",
      fontVariantNumeric: "tabular-nums",
      fontSize: size || "inherit",
      fontWeight: weight || "var(--fw-medium)",
      color: negative && colorNegative ? "var(--status-danger)" : "inherit",
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), __ds_scope.formatBDT(n, {
    bengali
  }));
}
Object.assign(__ds_scope, { Money });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/i18n/Money.jsx", error: String((e && e.message) || e) }); }

// components/status/StatusBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Exact FMS status vocabularies -> tone + labels (en / bn).
   kind: batch | task | severity | alert | feed | grade */
const MAP = {
  batch: {
    ACTIVE: {
      tone: "brand",
      dot: true,
      en: "Active",
      bn: "সক্রিয়"
    },
    HARVESTING: {
      tone: "info",
      dot: true,
      en: "Harvesting",
      bn: "আহরণ চলছে"
    },
    CLOSED: {
      tone: "neutral",
      dot: true,
      en: "Closed",
      bn: "বন্ধ"
    }
  },
  task: {
    SCHEDULED: {
      tone: "neutral",
      dot: true,
      en: "Scheduled",
      bn: "নির্ধারিত"
    },
    DUE: {
      tone: "warning",
      dot: true,
      en: "Due",
      bn: "বাকি"
    },
    DONE: {
      tone: "ok",
      icon: "check",
      en: "Done",
      bn: "সম্পন্ন"
    },
    MISSED: {
      tone: "critical",
      dot: true,
      en: "Missed",
      bn: "মিস"
    }
  },
  severity: {
    INFO: {
      tone: "info",
      icon: "info",
      en: "Info",
      bn: "তথ্য"
    },
    WARNING: {
      tone: "warning",
      icon: "alert-triangle",
      en: "Warning",
      bn: "সতর্কতা"
    },
    CRITICAL: {
      tone: "critical",
      icon: "alert-circle",
      en: "Critical",
      bn: "জরুরি"
    }
  },
  alert: {
    RAISED: {
      tone: "critical",
      dot: true,
      en: "Raised",
      bn: "উত্থাপিত"
    },
    SENT: {
      tone: "warning",
      dot: true,
      en: "Sent",
      bn: "পাঠানো"
    },
    ACKNOWLEDGED: {
      tone: "info",
      dot: true,
      en: "Acknowledged",
      bn: "স্বীকৃত"
    },
    RESOLVED: {
      tone: "ok",
      icon: "check",
      en: "Resolved",
      bn: "সমাধান"
    }
  },
  feed: {
    NORMAL: {
      tone: "ok",
      dot: true,
      en: "Normal",
      bn: "স্বাভাবিক"
    },
    LEFTOVER: {
      tone: "warning",
      dot: true,
      en: "Leftover",
      bn: "উদ্বৃত্ত"
    },
    EMPTY: {
      tone: "info",
      dot: true,
      en: "Empty",
      bn: "খালি"
    }
  },
  grade: {
    EXPORT: {
      tone: "brand",
      dot: true,
      en: "Export",
      bn: "রপ্তানি"
    },
    LOCAL: {
      tone: "neutral",
      dot: true,
      en: "Local",
      bn: "স্থানীয়"
    }
  }
};
function StatusBadge({
  kind,
  status,
  lang = "en",
  style,
  ...rest
}) {
  const def = (MAP[kind] || {})[status];
  if (!def) return /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "neutral",
    style: style
  }, status);
  const label = lang === "bn" ? def.bn : def.en;
  return /*#__PURE__*/React.createElement(__ds_scope.Badge, _extends({
    tone: def.tone,
    dot: def.dot,
    icon: def.icon,
    style: style
  }, rest), label);
}
Object.assign(__ds_scope, { StatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/status/StatusBadge.jsx", error: String((e && e.message) || e) }); }

// components/status/SyncBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Per-item sync state for the offline-first mobile app.
   PENDING (queued) / SYNCED / CONFLICT / FAILED (retry). */
const MAP = {
  PENDING: {
    icon: "clock",
    fg: "var(--sev-warning)",
    bg: "var(--tint-warning)",
    en: "Pending",
    bn: "সিংক বাকি"
  },
  SYNCED: {
    icon: "check-circle",
    fg: "var(--status-ok)",
    bg: "var(--tint-ok)",
    en: "Synced",
    bn: "সিংক হয়েছে"
  },
  CONFLICT: {
    icon: "alert-triangle",
    fg: "var(--sev-warning)",
    bg: "var(--tint-warning)",
    en: "Conflict",
    bn: "দ্বন্দ্ব"
  },
  FAILED: {
    icon: "refresh-cw",
    fg: "var(--sev-critical)",
    bg: "var(--tint-critical)",
    en: "Failed — retry",
    bn: "ব্যর্থ — আবার"
  }
};
function SyncBadge({
  state = "PENDING",
  lang = "bn",
  showLabel = true,
  style,
  ...rest
}) {
  const d = MAP[state] || MAP.PENDING;
  const label = lang === "bn" ? d.bn : d.en;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 26,
      padding: showLabel ? "0 10px 0 8px" : 0,
      width: showLabel ? undefined : 26,
      justifyContent: "center",
      borderRadius: "var(--radius-pill)",
      background: d.bg,
      color: d.fg,
      fontFamily: lang === "bn" ? "var(--font-bangla)" : "var(--font-base)",
      fontSize: "var(--text-xs)",
      fontWeight: "var(--fw-medium)",
      lineHeight: 1,
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: d.icon,
    size: 14,
    title: label
  }), showLabel ? label : null);
}
Object.assign(__ds_scope, { SyncBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/status/SyncBadge.jsx", error: String((e && e.message) || e) }); }

// ui_kits/owner_web/OwnerDashboard.jsx
try { (() => {
const {
  useState
} = React;
const NS = window.FMSAquacultureDesignSystem_dbe44a;
const {
  Button,
  IconButton,
  Card,
  CardHeader,
  Badge,
  StatusBadge,
  Money,
  DualDate,
  AlertBanner,
  StateView,
  StatCard,
  Icon
} = NS;
const D = window.OwnerData;
function Sidebar({
  view,
  setView
}) {
  const nav = [{
    id: "portfolio",
    label: "Portfolio",
    icon: "layout-dashboard"
  }];
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 248,
      background: "var(--brand-primary-dark)",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 20px 16px",
      display: "flex",
      alignItems: "baseline",
      gap: 8,
      borderBottom: "1px solid rgba(255,255,255,.12)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 26,
      fontWeight: 700,
      letterSpacing: -1
    }
  }, "FMS"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      opacity: .7
    }
  }, "Owner")), /*#__PURE__*/React.createElement("nav", {
    style: {
      padding: 12,
      display: "flex",
      flexDirection: "column",
      gap: 2
    }
  }, /*#__PURE__*/React.createElement(NavItem, {
    active: view === "portfolio",
    onClick: () => setView("portfolio"),
    icon: "layout-dashboard",
    label: "Portfolio"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: .6,
      opacity: .55,
      padding: "14px 12px 6px"
    }
  }, "Projects"), D.projects.map(p => /*#__PURE__*/React.createElement(NavItem, {
    key: p.id,
    active: view === p.id,
    onClick: () => setView(p.id),
    icon: "map-pin",
    label: p.name,
    badge: p.alerts
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto",
      padding: 12,
      borderTop: "1px solid rgba(255,255,255,.12)",
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 999,
      background: "var(--brand-accent)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 13,
      fontWeight: 700
    }
  }, D.owner.initials), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.3
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 500
    }
  }, D.owner.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      opacity: .7
    }
  }, "Owner \xB7 3 projects"))));
}
function NavItem({
  active,
  onClick,
  icon,
  label,
  badge
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      width: "100%",
      textAlign: "left",
      padding: "9px 12px",
      borderRadius: 10,
      border: "none",
      cursor: "pointer",
      background: active ? "rgba(255,255,255,.16)" : "transparent",
      color: "#fff",
      fontFamily: "var(--font-base)",
      fontSize: 14,
      fontWeight: active ? 600 : 400
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 18
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, label), badge ? /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 18,
      height: 18,
      padding: "0 5px",
      borderRadius: 999,
      background: "var(--sev-critical)",
      fontSize: 11,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, badge) : null);
}
function TopBar({
  title,
  subtitle,
  right
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "18px 28px",
      borderBottom: "1px solid var(--border)",
      background: "var(--surface)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 22,
      fontWeight: 700,
      color: "var(--text-primary)"
    }
  }, title), subtitle ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-secondary)",
      marginTop: 2
    }
  }, subtitle) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-secondary)"
    }
  }, /*#__PURE__*/React.createElement(DualDate, {
    gregorian: D.today.gregorian,
    bangla: D.today.bangla
  })), right, /*#__PURE__*/React.createElement(IconButton, {
    icon: "bell",
    label: "Alerts"
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "settings",
    label: "Settings"
  })));
}
function PortfolioView({
  setView
}) {
  const totalRev = D.projects.reduce((s, p) => s + p.revenue, 0);
  const totalProfit = D.projects.reduce((s, p) => s + (p.revenue - p.cost), 0);
  const totalAlerts = D.projects.reduce((s, p) => s + p.alerts, 0);
  const avgSurvival = Math.round(D.projects.reduce((s, p) => s + p.survival, 0) / D.projects.length);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 28,
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Portfolio revenue",
    icon: "dollar-sign",
    value: /*#__PURE__*/React.createElement(Money, {
      amount: totalRev
    }),
    trend: {
      dir: "up",
      text: "৳ this cycle"
    }
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Net profit",
    icon: "trending-up",
    value: /*#__PURE__*/React.createElement(Money, {
      amount: totalProfit
    }),
    tone: "ok",
    trend: {
      dir: "up",
      text: "38% margin"
    }
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Open alerts",
    icon: "bell",
    tone: totalAlerts ? "critical" : "ok",
    value: String(totalAlerts),
    trend: {
      dir: "down",
      text: "1 critical"
    }
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Avg survival",
    icon: "fish",
    value: avgSurvival + "%",
    trend: {
      dir: "flat",
      text: "across 12 ponds"
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      marginBottom: 12,
      color: "var(--text-primary)"
    }
  }, "Projects"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 16
    }
  }, D.projects.map(p => {
    const profit = p.revenue - p.cost;
    return /*#__PURE__*/React.createElement(Card, {
      key: p.id,
      interactive: true,
      onClick: () => setView(p.id),
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 16,
        fontWeight: 700,
        color: "var(--text-primary)"
      }
    }, p.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: "var(--text-secondary)",
        display: "flex",
        alignItems: "center",
        gap: 4,
        marginTop: 2
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "map-pin",
      size: 13
    }), p.place)), /*#__PURE__*/React.createElement(StatusBadge, {
      kind: "batch",
      status: p.status
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 20
      }
    }, /*#__PURE__*/React.createElement(Meta, {
      label: "Ponds",
      value: p.ponds
    }), /*#__PURE__*/React.createElement(Meta, {
      label: "Batches",
      value: p.batches
    }), /*#__PURE__*/React.createElement(Meta, {
      label: "Survival",
      value: p.survival + "%"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        borderTop: "1px solid var(--border)",
        paddingTop: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "var(--text-secondary)"
      }
    }, "Net profit"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 18,
        fontWeight: 700
      }
    }, /*#__PURE__*/React.createElement(Money, {
      amount: profit
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, p.alerts ? /*#__PURE__*/React.createElement(Badge, {
      tone: "critical",
      dot: true
    }, p.alerts, " alert", p.alerts > 1 ? "s" : "") : /*#__PURE__*/React.createElement(Badge, {
      tone: "ok",
      icon: "check"
    }, "Clear"), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 18,
      color: "var(--text-secondary)"
    }))));
  }))));
}
function Meta({
  label,
  value
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-secondary)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      fontVariantNumeric: "tabular-nums"
    }
  }, value));
}
function ProjectView({
  project
}) {
  const p = project;
  const batches = D.batchesByProject[p.id] || [];
  const alerts = D.alertsByProject[p.id] || [];
  const tasks = D.tasksByProject[p.id] || [];
  const profit = p.revenue - p.cost;
  const closed = p.status === "CLOSED";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 28,
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, closed ? /*#__PURE__*/React.createElement(AlertBanner, {
    severity: "warning",
    title: "Project closed",
    action: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary"
    }, "View archive")
  }, "This project is archived and read-only. Write controls are hidden.") : null, alerts.some(a => a.severity === "CRITICAL" && a.state === "RAISED") ? /*#__PURE__*/React.createElement(AlertBanner, {
    severity: "critical",
    title: "Emergency raised \u2014 immediate attention",
    action: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "danger"
    }, "Acknowledge")
  }, alerts.find(a => a.severity === "CRITICAL").note) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Revenue",
    icon: "dollar-sign",
    value: /*#__PURE__*/React.createElement(Money, {
      amount: p.revenue
    })
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Net profit",
    icon: "trending-up",
    tone: "ok",
    value: /*#__PURE__*/React.createElement(Money, {
      amount: profit
    })
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Survival",
    icon: "fish",
    value: p.survival + "%"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Active batches",
    icon: "clipboard-list",
    value: String(p.batches)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.6fr 1fr",
      gap: 16,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
    title: "Batches",
    subtitle: p.ponds + " ponds · polyculture",
    action: !closed ? /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      icon: "plus"
    }, "New batch") : null
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, batches.map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: b.id,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "12px 0",
      borderTop: i ? "1px solid var(--border)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 10,
      background: "var(--tint-brand)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "fish",
    size: 20,
    color: "var(--brand-primary)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600
    }
  }, b.pond, " \xB7 ", b.species), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--text-secondary)"
    }
  }, "Stocked ", /*#__PURE__*/React.createElement(DualDate, {
    gregorian: b.stocked,
    bangla: b.bangla
  }), " \xB7 Day ", b.doc)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      fontVariantNumeric: "tabular-nums"
    }
  }, b.pcs.toLocaleString(), " pcs"), /*#__PURE__*/React.createElement(StatusBadge, {
    kind: "batch",
    status: b.status,
    style: {
      marginTop: 4
    }
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(WeatherWidget, null), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
    title: "Today's tasks",
    subtitle: "Worker: " + p.worker
  }), tasks.length === 0 ? /*#__PURE__*/React.createElement(StateView, {
    variant: "empty",
    compact: true,
    title: "No tasks today",
    message: "Scheduled tasks will appear here."
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, tasks.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 500
    }
  }, t.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--text-secondary)"
    }
  }, t.who, " \xB7 ", t.time)), /*#__PURE__*/React.createElement(StatusBadge, {
    kind: "task",
    status: t.status
  }))))))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
    title: "Alerts",
    subtitle: "This project only"
  }), alerts.length === 0 ? /*#__PURE__*/React.createElement(StateView, {
    variant: "empty",
    compact: true,
    title: "No active alerts",
    message: "Water, feed and mortality are within normal range."
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, alerts.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    style: {
      display: "flex",
      gap: 14,
      padding: "14px 0",
      borderTop: i ? "1px solid var(--border)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    kind: "severity",
    status: a.severity
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600
    }
  }, a.title, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 400,
      color: "var(--text-secondary)"
    }
  }, "\xB7 ", a.pond)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-secondary)",
      marginTop: 2
    }
  }, a.note), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--text-secondary)",
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(DualDate, {
    gregorian: a.time.slice(0, 10),
    bangla: a.bangla
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    kind: "alert",
    status: a.state
  })))))));
}

/* Weather widget — external service; demonstrates stale + unavailable states. */
function WeatherWidget() {
  const [mode, setMode] = useState("ok"); // ok | stale | down
  return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
    title: "Weather",
    subtitle: "Cumilla district",
    action: /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 4
      }
    }, ["ok", "stale", "down"].map(m => /*#__PURE__*/React.createElement("button", {
      key: m,
      onClick: () => setMode(m),
      style: {
        fontSize: 11,
        padding: "3px 8px",
        borderRadius: 999,
        cursor: "pointer",
        border: "1px solid " + (mode === m ? "var(--brand-primary)" : "var(--border)"),
        background: mode === m ? "var(--tint-brand)" : "var(--surface)",
        color: mode === m ? "var(--brand-primary-dark)" : "var(--text-secondary)"
      }
    }, m)))
  }), mode === "down" ? /*#__PURE__*/React.createElement(StateView, {
    variant: "unavailable",
    compact: true,
    title: "Weather unavailable",
    message: "Temporarily unavailable \u2014 the rest of the page is unaffected."
  }) : /*#__PURE__*/React.createElement("div", null, mode === "stale" ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(AlertBanner, {
    severity: "warning",
    title: "Showing cached data"
  }, "Last updated 6h ago \u2014 network unreachable.")) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "cloud",
    size: 40,
    color: "var(--brand-accent)"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      fontWeight: 700
    }
  }, "31\xB0C"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-secondary)"
    }
  }, "Monsoon \xB7 high humidity \xB7 rain likely")))));
}
function OwnerApp() {
  const [view, setView] = useState("portfolio");
  const project = D.projects.find(p => p.id === view);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      height: "100vh",
      background: "var(--bg)",
      fontFamily: "var(--font-base)",
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement(Sidebar, {
    view: view,
    setView: setView
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      overflow: "auto"
    }
  }, view === "portfolio" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TopBar, {
    title: "Portfolio",
    subtitle: "All owned projects"
  }), /*#__PURE__*/React.createElement(PortfolioView, {
    setView: setView
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TopBar, {
    title: project.name,
    subtitle: project.place + " · Worker: " + project.worker + (project.partner ? " · Partner: " + project.partner : ""),
    right: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      icon: "arrow-left",
      onClick: () => setView("portfolio")
    }, "Portfolio")
  }), /*#__PURE__*/React.createElement(ProjectView, {
    project: project
  }))));
}
window.OwnerApp = OwnerApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/owner_web/OwnerDashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/owner_web/ownerData.js
try { (() => {
/* Owner Web — mock domain data. Business content only. */
window.OwnerData = {
  owner: {
    name: "Rahima Khatun",
    initials: "RK"
  },
  today: {
    gregorian: "2026-07-21",
    bangla: "5 শ্রাবণ 1433"
  },
  projects: [{
    id: "meghna",
    name: "Meghna Gher",
    place: "Debidwar, Cumilla",
    status: "ACTIVE",
    worker: "Jamal Uddin",
    partner: "A. Karim (investor)",
    ponds: 4,
    batches: 3,
    revenue: 842000,
    cost: 512000,
    survival: 88,
    alerts: 1
  }, {
    id: "padma",
    name: "Padma Project",
    place: "Bhanga, Faridpur",
    status: "ACTIVE",
    worker: "Sultana Begum",
    partner: null,
    ponds: 3,
    batches: 2,
    revenue: 403000,
    cost: 268000,
    survival: 91,
    alerts: 0
  }, {
    id: "jamuna",
    name: "Jamuna Gher",
    place: "Sariakandi, Bogura",
    status: "HARVESTING",
    worker: "Anwar Hossain",
    partner: "Nasrin Trading",
    ponds: 5,
    batches: 2,
    revenue: 1120000,
    cost: 690000,
    survival: 84,
    alerts: 2
  }],
  batchesByProject: {
    meghna: [{
      id: "A2",
      pond: "Pond A2",
      species: "SPF Golda",
      status: "ACTIVE",
      stocked: "2026-04-12",
      bangla: "30 চৈত্র 1432",
      pcs: 42000,
      doc: 100
    }, {
      id: "B1",
      pond: "Pond B1",
      species: "Parse (mullet)",
      status: "ACTIVE",
      stocked: "2026-05-02",
      bangla: "19 বৈশাখ 1433",
      pcs: 18000,
      doc: 80
    }, {
      id: "C3",
      pond: "Pond C3",
      species: "Carp (Rui/Katla)",
      status: "HARVESTING",
      stocked: "2026-01-20",
      bangla: "7 মাঘ 1432",
      pcs: 9500,
      doc: 182
    }],
    padma: [{
      id: "P1",
      pond: "Pond P1",
      species: "SPF Golda",
      status: "ACTIVE",
      stocked: "2026-04-28",
      bangla: "15 বৈশাখ 1433",
      pcs: 36000,
      doc: 84
    }, {
      id: "P2",
      pond: "Pond P2",
      species: "Carp (Mrigel)",
      status: "ACTIVE",
      stocked: "2026-03-10",
      bangla: "27 ফাল্গুন 1432",
      pcs: 12000,
      doc: 133
    }],
    jamuna: [{
      id: "J1",
      pond: "Pond J1",
      species: "SPF Golda",
      status: "HARVESTING",
      stocked: "2025-12-15",
      bangla: "1 পৌষ 1432",
      pcs: 51000,
      doc: 218
    }, {
      id: "J4",
      pond: "Pond J4",
      species: "Parse (mullet)",
      status: "ACTIVE",
      stocked: "2026-05-20",
      bangla: "6 জ্যৈষ্ঠ 1433",
      pcs: 22000,
      doc: 62
    }]
  },
  alertsByProject: {
    meghna: [{
      id: 1,
      severity: "WARNING",
      state: "SENT",
      title: "Dissolved oxygen dropping",
      pond: "Pond A2",
      time: "2026-07-21 06:10",
      bangla: "5 শ্রাবণ, ভোর 6:10",
      note: "DO 4.1 mg/L before dawn. Worker notified to run aerator."
    }],
    padma: [],
    jamuna: [{
      id: 2,
      severity: "CRITICAL",
      state: "RAISED",
      title: "Emergency raised by worker",
      pond: "Pond J1",
      time: "2026-07-21 05:40",
      bangla: "5 শ্রাবণ, ভোর 5:40",
      note: "Fish surfacing / gasping. Immediate aeration + partial water exchange requested."
    }, {
      id: 3,
      severity: "INFO",
      state: "RESOLVED",
      title: "Feed delivery received",
      pond: "Store",
      time: "2026-07-20 14:00",
      bangla: "4 শ্রাবণ, দুপুর 2:00",
      note: "1,200 kg grower feed logged to inventory."
    }]
  },
  tasksByProject: {
    meghna: [{
      id: 1,
      title: "Morning water test — A2",
      status: "DONE",
      who: "Jamal",
      time: "06:30"
    }, {
      id: 2,
      title: "Feed round 2 — B1",
      status: "DUE",
      who: "Jamal",
      time: "13:00"
    }, {
      id: 3,
      title: "Net check — C3 harvest prep",
      status: "SCHEDULED",
      who: "Jamal",
      time: "16:00"
    }],
    padma: [{
      id: 1,
      title: "Feed round 1 — P1",
      status: "DONE",
      who: "Sultana",
      time: "07:00"
    }, {
      id: 2,
      title: "Weekly sampling — P2",
      status: "MISSED",
      who: "Sultana",
      time: "yesterday"
    }],
    jamuna: [{
      id: 1,
      title: "Harvest grading — J1",
      status: "DUE",
      who: "Anwar",
      time: "now"
    }, {
      id: 2,
      title: "Emergency aeration — J1",
      status: "DUE",
      who: "Anwar",
      time: "now"
    }]
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/owner_web/ownerData.js", error: String((e && e.message) || e) }); }

// ui_kits/partner_web/PartnerApp.jsx
try { (() => {
const {
  useState
} = React;
const NS = window.FMSAquacultureDesignSystem_dbe44a;
const {
  Button,
  IconButton,
  Card,
  CardHeader,
  Badge,
  StatusBadge,
  Money,
  DualDate,
  AlertBanner,
  StateView,
  StatCard,
  Icon
} = NS;

/* Partner (investor) — READ-ONLY on co-owned project(s) only. Sees finances.
   No portfolio, no write controls, no settings, no member admin. */
const P = {
  partner: {
    name: "Nasrin Trading",
    initials: "NT"
  },
  today: {
    gregorian: "2026-07-21",
    bangla: "5 শ্রাবণ 1433"
  },
  project: {
    name: "Jamuna Gher",
    place: "Sariakandi, Bogura",
    status: "HARVESTING",
    revenue: 1120000,
    cost: 690000,
    invested: 400000,
    sharePct: 35
  },
  batches: [{
    id: "J1",
    pond: "Pond J1",
    species: "SPF Golda",
    status: "HARVESTING",
    grade: "EXPORT",
    stocked: "2025-12-15",
    bangla: "1 পৌষ 1432",
    pcs: 51000
  }, {
    id: "J4",
    pond: "Pond J4",
    species: "Parse (mullet)",
    status: "ACTIVE",
    grade: "LOCAL",
    stocked: "2026-05-20",
    bangla: "6 জ্যৈষ্ঠ 1433",
    pcs: 22000
  }],
  ledger: [{
    id: 1,
    label: "Harvest sale — J1 (export grade)",
    date: "2026-07-18",
    bangla: "3 শ্রাবণ 1433",
    amount: 620000
  }, {
    id: 2,
    label: "Feed purchase — grower",
    date: "2026-07-10",
    bangla: "26 আষাঢ় 1433",
    amount: -184000
  }, {
    id: 3,
    label: "Harvest sale — J1 (local)",
    date: "2026-07-04",
    bangla: "20 আষাঢ় 1433",
    amount: 500000
  }, {
    id: 4,
    label: "Aeration / diesel",
    date: "2026-06-28",
    bangla: "14 আষাঢ় 1433",
    amount: -46000
  }]
};
function PartnerApp() {
  const pr = P.project;
  const profit = pr.revenue - pr.cost;
  const share = Math.round(profit * pr.sharePct / 100);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "var(--bg)",
      fontFamily: "var(--font-base)",
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 28px",
      background: "var(--brand-primary-dark)",
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: -1
    }
  }, "FMS"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      opacity: .7
    }
  }, "Partner")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      opacity: .85
    }
  }, /*#__PURE__*/React.createElement(DualDate, {
    gregorian: P.today.gregorian,
    bangla: P.today.bangla,
    tone: "inverse"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 999,
      background: "var(--brand-accent)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 12,
      fontWeight: 700
    }
  }, P.partner.initials), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13
    }
  }, P.partner.name)))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1080,
      margin: "0 auto",
      padding: 28,
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 24,
      fontWeight: 700
    }
  }, pr.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: "var(--text-secondary)",
      display: "flex",
      alignItems: "center",
      gap: 5,
      marginTop: 3
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 15
  }), pr.place)), /*#__PURE__*/React.createElement(StatusBadge, {
    kind: "batch",
    status: pr.status
  })), /*#__PURE__*/React.createElement(AlertBanner, {
    severity: "info",
    title: "Read-only view"
  }, "You have investor access to this project. Finances are visible; operational and settings controls are managed by the owner."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Revenue",
    icon: "dollar-sign",
    value: /*#__PURE__*/React.createElement(Money, {
      amount: pr.revenue
    })
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Net profit",
    icon: "trending-up",
    tone: "ok",
    value: /*#__PURE__*/React.createElement(Money, {
      amount: profit
    }),
    trend: {
      dir: "up",
      text: "38% margin"
    }
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: `Your share (${pr.sharePct}%)`,
    icon: "scale",
    value: /*#__PURE__*/React.createElement(Money, {
      amount: share
    })
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Your investment",
    icon: "dollar-sign",
    value: /*#__PURE__*/React.createElement(Money, {
      amount: pr.invested
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
    title: "Finance ledger",
    subtitle: "This project only"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, P.ledger.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: l.id,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 0",
      borderTop: i ? "1px solid var(--border)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 999,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: l.amount >= 0 ? "var(--tint-ok)" : "var(--tint-critical)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: l.amount >= 0 ? "trending-up" : "trending-down",
    size: 16,
    color: l.amount >= 0 ? "var(--status-ok)" : "var(--status-danger)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 500
    }
  }, l.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--text-secondary)"
    }
  }, /*#__PURE__*/React.createElement(DualDate, {
    gregorian: l.date,
    bangla: l.bangla
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement(Money, {
    amount: l.amount
  })))))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
    title: "Batches",
    subtitle: "Polyculture stock"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, P.batches.map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: b.id,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 0",
      borderTop: i ? "1px solid var(--border)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 10,
      background: "var(--tint-brand)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "fish",
    size: 20,
    color: "var(--brand-primary)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600
    }
  }, b.pond, " \xB7 ", b.species), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--text-secondary)"
    }
  }, "Stocked ", /*#__PURE__*/React.createElement(DualDate, {
    gregorian: b.stocked,
    bangla: b.bangla
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
      alignItems: "flex-end"
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    kind: "batch",
    status: b.status
  }), /*#__PURE__*/React.createElement(StatusBadge, {
    kind: "grade",
    status: b.grade
  }))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--text-secondary)",
      textAlign: "center",
      padding: "4px 0"
    }
  }, "Investor access \xB7 read-only \xB7 Jamuna Gher only")));
}
window.PartnerApp = PartnerApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/partner_web/PartnerApp.jsx", error: String((e && e.message) || e) }); }

// ui_kits/worker_mobile/WorkerApp.jsx
try { (() => {
const {
  useState
} = React;
const NS = window.FMSAquacultureDesignSystem_dbe44a;
const {
  Button,
  StatusBadge,
  SyncBadge,
  ConnectivityBar,
  StateView,
  Icon,
  DualDate
} = NS;
const W = window.WorkerData;
const BN = n => String(n).replace(/[0-9]/g, d => "০১২৩৪৫৬৭৮৯"[+d]);
const bangla = {
  fontFamily: "var(--font-bangla)"
};

/* Icon-first action tiles */
const ACTIONS = [{
  id: "feed",
  label: "খাবার",
  icon: "utensils",
  color: "var(--brand-primary)"
}, {
  id: "water",
  label: "পানি",
  icon: "droplet",
  color: "var(--brand-accent)"
}, {
  id: "mortality",
  label: "মৃত্যু",
  icon: "skull",
  color: "var(--text-secondary)"
}, {
  id: "task",
  label: "কাজ",
  icon: "clipboard-list",
  color: "var(--sev-info)"
}, {
  id: "camera",
  label: "ক্যামেরা",
  icon: "camera",
  color: "var(--brand-primary-dark)"
}, {
  id: "emergency",
  label: "জরুরি",
  icon: "life-buoy",
  color: "var(--sev-critical)"
}];
function Home({
  online,
  setScreen,
  recent
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...bangla,
      display: "flex",
      flexDirection: "column",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement(ConnectivityBar, {
    online: online,
    pending: online ? 2 : 3,
    style: {
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: "auto",
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: "var(--text-primary)"
    }
  }, "\u09B8\u09CD\u09AC\u09BE\u0997\u09A4\u09AE, ", W.worker.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: "var(--text-secondary)",
      marginTop: 2
    }
  }, W.worker.project, " \xB7 ", W.worker.pond), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: "var(--text-secondary)",
      marginTop: 2,
      display: "flex",
      gap: 6,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar",
    size: 15
  }), /*#__PURE__*/React.createElement(DualDate, {
    mode: "bn",
    bangla: "5 \u09B6\u09CD\u09B0\u09BE\u09AC\u09A3 1433",
    season: W.date.season
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 12,
      marginBottom: 20
    }
  }, ACTIONS.map(a => /*#__PURE__*/React.createElement("button", {
    key: a.id,
    onClick: () => setScreen(a.id),
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      minHeight: 96,
      padding: 12,
      borderRadius: 16,
      cursor: "pointer",
      background: "var(--surface)",
      border: "1px solid var(--border)",
      boxShadow: "var(--shadow-card)",
      fontFamily: "var(--font-bangla)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 999,
      background: a.id === "emergency" ? "var(--tint-critical)" : "var(--tint-brand)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: a.icon,
    size: 28,
    color: a.color
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: "var(--text-primary)"
    }
  }, a.label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      marginBottom: 10
    }
  }, "\u0986\u099C\u0995\u09C7\u09B0 \u0995\u09BE\u099C"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      marginBottom: 20
    }
  }, W.tasks.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: 12,
      borderRadius: 12,
      background: "var(--surface)",
      border: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600
    }
  }, t.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-secondary)"
    }
  }, "\u09AA\u09C1\u0995\u09C1\u09B0 ", t.pond, " \xB7 ", t.time)), /*#__PURE__*/React.createElement(StatusBadge, {
    kind: "task",
    status: t.status,
    lang: "bn"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      marginBottom: 10
    }
  }, "\u09B8\u09BE\u09AE\u09CD\u09AA\u09CD\u09B0\u09A4\u09BF\u0995 \u098F\u09A8\u09CD\u099F\u09CD\u09B0\u09BF"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, recent.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.id,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: 12,
      borderRadius: 12,
      background: "var(--surface)",
      border: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600
    }
  }, r.kind), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-secondary)"
    }
  }, r.detail, " \xB7 ", r.time)), /*#__PURE__*/React.createElement(SyncBadge, {
    state: r.sync,
    showLabel: false
  }))))));
}
function FeedForm({
  online,
  onSave,
  onBack
}) {
  const [weight, setWeight] = useState("12");
  const [obs, setObs] = useState("NORMAL");
  const chips = [{
    v: "NORMAL",
    l: "স্বাভাবিক"
  }, {
    v: "LEFTOVER",
    l: "উদ্বৃত্ত"
  }, {
    v: "EMPTY",
    l: "খালি"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...bangla,
      display: "flex",
      flexDirection: "column",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement(TitleBar, {
    title: "\u0996\u09BE\u09AC\u09BE\u09B0 \u09B2\u09BF\u09AA\u09BF\u09AC\u09A6\u09CD\u09A7",
    onBack: onBack
  }), /*#__PURE__*/React.createElement(ConnectivityBar, {
    online: online,
    pending: online ? 2 : 3,
    style: {
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: "auto",
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      marginBottom: 8
    }
  }, "\u09AA\u09C1\u0995\u09C1\u09B0"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, ["এ২", "বি১", "সি৩"].map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: p,
    style: {
      flex: 1,
      textAlign: "center",
      padding: "12px 0",
      borderRadius: 12,
      fontSize: 16,
      fontWeight: 600,
      border: "1px solid " + (i === 0 ? "var(--brand-primary)" : "var(--border)"),
      background: i === 0 ? "var(--tint-brand)" : "var(--surface)",
      color: i === 0 ? "var(--brand-primary-dark)" : "var(--text-secondary)"
    }
  }, p)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      marginBottom: 8
    }
  }, "\u09AA\u09B0\u09BF\u09AE\u09BE\u09A3 (\u0995\u09C7\u099C\u09BF)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(BigStep, {
    onClick: () => setWeight(w => String(Math.max(0, +w - 1))),
    icon: "chevron-down"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: "center",
      fontSize: 34,
      fontWeight: 700,
      fontFamily: "var(--font-bangla)"
    }
  }, BN(weight)), /*#__PURE__*/React.createElement(BigStep, {
    onClick: () => setWeight(w => String(+w + 1)),
    icon: "plus"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      marginBottom: 8
    }
  }, "\u0996\u09BE\u09AC\u09BE\u09B0\u09C7\u09B0 \u09AA\u09B0\u09CD\u09AF\u09AC\u09C7\u0995\u09CD\u09B7\u09A3"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, chips.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.v,
    onClick: () => setObs(c.v),
    style: {
      flex: 1,
      padding: "14px 0",
      borderRadius: 12,
      cursor: "pointer",
      fontFamily: "var(--font-bangla)",
      fontSize: 15,
      fontWeight: 600,
      border: "1px solid " + (obs === c.v ? "var(--brand-primary)" : "var(--border)"),
      background: obs === c.v ? "var(--tint-brand)" : "var(--surface)",
      color: obs === c.v ? "var(--brand-primary-dark)" : "var(--text-secondary)"
    }
  }, c.l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      borderTop: "1px solid var(--border)",
      background: "var(--surface)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    block: true,
    icon: "check",
    onClick: () => onSave({
      weight,
      obs
    }),
    lang: "bn"
  }, "\u09B8\u0982\u09B0\u0995\u09CD\u09B7\u09A3 \u0995\u09B0\u09C1\u09A8")));
}
function BigStep({
  onClick,
  icon
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      width: 56,
      height: 56,
      borderRadius: 16,
      border: "1px solid var(--border-strong)",
      background: "var(--surface)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 24,
    color: "var(--brand-primary)"
  }));
}
function Emergency({
  onBack,
  onRaise
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...bangla,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "var(--tint-critical)"
    }
  }, /*#__PURE__*/React.createElement(TitleBar, {
    title: "\u099C\u09B0\u09C1\u09B0\u09BF \u0985\u09AC\u09B8\u09CD\u09A5\u09BE",
    onBack: onBack,
    tone: "critical"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: "auto",
      padding: 20,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 88,
      height: 88,
      borderRadius: 999,
      background: "var(--sev-critical)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "life-buoy",
    size: 44,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 700
    }
  }, "\u0985\u0995\u09CD\u09B8\u09BF\u099C\u09C7\u09A8 / \u09AA\u09BE\u09A8\u09BF\u09B0 \u099C\u09B0\u09C1\u09B0\u09BF \u0985\u09AC\u09B8\u09CD\u09A5\u09BE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      color: "var(--text-secondary)",
      lineHeight: 1.6,
      maxWidth: 300
    }
  }, "\u098F\u0987 \u09AC\u09CB\u09A4\u09BE\u09AE \u099A\u09BE\u09AA\u09B2\u09C7 \u09AE\u09BE\u09B2\u09BF\u0995\u0995\u09C7 \u09B8\u0999\u09CD\u0997\u09C7 \u09B8\u0999\u09CD\u0997\u09C7 \u09B8\u09A4\u09B0\u09CD\u0995\u09AC\u09BE\u09B0\u09CD\u09A4\u09BE \u09AA\u09BE\u09A0\u09BE\u09A8\u09CB \u09B9\u09AC\u09C7\u0964 \u09AE\u09BE\u099B \u09AD\u09C7\u09B8\u09C7 \u0989\u09A0\u099B\u09C7 \u09AC\u09BE \u09B9\u09BE\u0981\u09AA\u09BE\u099A\u09CD\u099B\u09C7?")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    block: true,
    variant: "danger",
    icon: "life-buoy",
    onClick: onRaise,
    lang: "bn"
  }, "\u098F\u0996\u09A8\u0987 \u09B8\u09A4\u09B0\u09CD\u0995\u09AC\u09BE\u09B0\u09CD\u09A4\u09BE \u09AA\u09BE\u09A0\u09BE\u09A8"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    block: true,
    variant: "secondary",
    onClick: onBack,
    lang: "bn"
  }, "\u09AC\u09BE\u09A4\u09BF\u09B2")));
}
function Placeholder({
  title,
  onBack
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...bangla,
      display: "flex",
      flexDirection: "column",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement(TitleBar, {
    title: title,
    onBack: onBack
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      padding: 20
    }
  }, /*#__PURE__*/React.createElement(StateView, {
    variant: "offline",
    lang: "bn",
    title: "\u0985\u09AB\u09B2\u09BE\u0987\u09A8 \u2014 \u09B8\u0982\u09B0\u0995\u09CD\u09B7\u09BF\u09A4",
    message: "\u0986\u09AA\u09A8\u09BE\u09B0 \u098F\u09A8\u09CD\u099F\u09CD\u09B0\u09BF \u09B8\u0982\u09B0\u0995\u09CD\u09B7\u09BF\u09A4 \u09B9\u09AF\u09BC\u09C7\u099B\u09C7, \u09A8\u09C7\u099F\u0993\u09AF\u09BC\u09BE\u09B0\u09CD\u0995 \u098F\u09B2\u09C7 \u09B8\u09BF\u0982\u0995 \u09B9\u09AC\u09C7\u0964",
    action: /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      variant: "secondary",
      onClick: onBack,
      lang: "bn"
    }, "\u09AB\u09BF\u09B0\u09C7 \u09AF\u09BE\u09A8")
  })));
}
function TitleBar({
  title,
  onBack,
  tone
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "12px 12px",
      background: "var(--surface)",
      borderBottom: "1px solid var(--border)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    "aria-label": "\u09AB\u09BF\u09B0\u09C7 \u09AF\u09BE\u09A8",
    style: {
      width: 44,
      height: 44,
      borderRadius: 12,
      border: "none",
      background: "transparent",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 24,
    color: tone === "critical" ? "var(--sev-critical)" : "var(--text-primary)"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 700,
      fontFamily: "var(--font-bangla)"
    }
  }, title));
}
function Toast({
  text
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 16,
      right: 16,
      bottom: 24,
      zIndex: 20,
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "12px 14px",
      borderRadius: 12,
      background: "var(--text-primary)",
      color: "#fff",
      fontFamily: "var(--font-bangla)",
      fontSize: 14,
      boxShadow: "var(--shadow-modal)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check-circle",
    size: 20,
    color: "var(--status-ok)"
  }), text);
}
function WorkerApp() {
  const [screen, setScreen] = useState("feed" === "x" ? "feed" : "home");
  const [online, setOnline] = useState(false);
  const [recent, setRecent] = useState(W.recent);
  const [toast, setToast] = useState(null);
  const showToast = t => {
    setToast(t);
    setTimeout(() => setToast(null), 2600);
  };
  const saveFeed = ({
    weight,
    obs
  }) => {
    const obsL = {
      NORMAL: "স্বাভাবিক",
      LEFTOVER: "উদ্বৃত্ত",
      EMPTY: "খালি"
    }[obs];
    setRecent(r => [{
      id: Date.now(),
      kind: "খাবার দেওয়া হয়েছে",
      detail: `এ২ · ${BN(weight)} কেজি · ${obsL}`,
      sync: "PENDING",
      time: "এইমাত্র"
    }, ...r]);
    setScreen("home");
    showToast(online ? "সংরক্ষিত — সিংক হচ্ছে" : "অফলাইন — সংরক্ষিত, পরে সিংক হবে");
  };
  let body;
  if (screen === "feed") body = /*#__PURE__*/React.createElement(FeedForm, {
    online: online,
    onSave: saveFeed,
    onBack: () => setScreen("home")
  });else if (screen === "emergency") body = /*#__PURE__*/React.createElement(Emergency, {
    onBack: () => setScreen("home"),
    onRaise: () => {
      setScreen("home");
      showToast("সতর্কবার্তা পাঠানো হয়েছে (সারিবদ্ধ)");
    }
  });else if (screen === "home") body = /*#__PURE__*/React.createElement(Home, {
    online: online,
    setScreen: setScreen,
    recent: recent
  });else body = /*#__PURE__*/React.createElement(Placeholder, {
    title: {
      water: "পানি পরীক্ষা",
      mortality: "মৃত্যু লিপিবদ্ধ",
      task: "কাজের তালিকা",
      camera: "ক্যামেরা"
    }[screen],
    onBack: () => setScreen("home")
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 12,
      padding: 24,
      minHeight: "100vh",
      background: "var(--surface-muted)",
      fontFamily: "var(--font-bangla)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      fontFamily: "var(--font-base)",
      fontSize: 13,
      color: "var(--text-secondary)"
    }
  }, "Network:", /*#__PURE__*/React.createElement("button", {
    onClick: () => setOnline(o => !o),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "5px 10px",
      borderRadius: 999,
      cursor: "pointer",
      border: "1px solid var(--border)",
      background: "var(--surface)",
      color: online ? "var(--status-ok)" : "var(--sev-warning)",
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: online ? "wifi" : "wifi-off",
    size: 16
  }), online ? "Online" : "Offline")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 390,
      height: 800,
      background: "#000",
      borderRadius: 44,
      padding: 10,
      boxShadow: "var(--shadow-modal)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 18,
      left: "50%",
      transform: "translateX(-50%)",
      width: 120,
      height: 26,
      background: "#000",
      borderRadius: 999,
      zIndex: 30
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      height: "100%",
      background: "var(--bg)",
      borderRadius: 34,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      flexShrink: 0,
      background: "var(--surface)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0
    }
  }, body), toast ? /*#__PURE__*/React.createElement(Toast, {
    text: toast
  }) : null)));
}
window.WorkerApp = WorkerApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/worker_mobile/WorkerApp.jsx", error: String((e && e.message) || e) }); }

// ui_kits/worker_mobile/workerData.js
try { (() => {
/* Worker Mobile — 100% Bangla mock data. Bengali numerals throughout. */
window.WorkerData = {
  worker: {
    name: "জামাল উদ্দিন",
    project: "মেঘনা ঘের",
    pond: "পুকুর এ২"
  },
  date: {
    bangla: "৫ শ্রাবণ ১৪৩৩",
    season: "বর্ষা"
  },
  greetingTime: "সকাল ৭:১৫",
  tasks: [{
    id: 1,
    title: "সকালের পানি পরীক্ষা",
    pond: "এ২",
    status: "DONE",
    sync: "SYNCED",
    time: "ভোর ৬:৩০"
  }, {
    id: 2,
    title: "খাবার — দ্বিতীয় বার",
    pond: "বি১",
    status: "DUE",
    sync: "PENDING",
    time: "দুপুর ১:০০"
  }, {
    id: 3,
    title: "জাল পরীক্ষা",
    pond: "সি৩",
    status: "SCHEDULED",
    sync: "SYNCED",
    time: "বিকাল ৪:০০"
  }],
  recent: [{
    id: 1,
    kind: "খাবার দেওয়া হয়েছে",
    detail: "বি১ · ১২ কেজি · স্বাভাবিক",
    sync: "PENDING",
    time: "এইমাত্র"
  }, {
    id: 2,
    kind: "পানি পরীক্ষা",
    detail: "এ২ · অক্সিজেন ৬.২ · পিএইচ ৭.৪",
    sync: "SYNCED",
    time: "ভোর ৬:৩০"
  }, {
    id: 3,
    kind: "মৃত্যু লিপিবদ্ধ",
    detail: "এ২ · ৩টি গলদা",
    sync: "FAILED",
    time: "গতকাল"
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/worker_mobile/workerData.js", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.CardHeader = __ds_scope.CardHeader;

__ds_ns.ICONS = __ds_scope.ICONS;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.ConnectivityBar = __ds_scope.ConnectivityBar;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.AlertBanner = __ds_scope.AlertBanner;

__ds_ns.Skeleton = __ds_scope.Skeleton;

__ds_ns.SkeletonRow = __ds_scope.SkeletonRow;

__ds_ns.StateView = __ds_scope.StateView;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.DualDate = __ds_scope.DualDate;

__ds_ns.Money = __ds_scope.Money;

__ds_ns.BANGLA_MONTHS = __ds_scope.BANGLA_MONTHS;

__ds_ns.BANGLA_SEASONS = __ds_scope.BANGLA_SEASONS;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

__ds_ns.SyncBadge = __ds_scope.SyncBadge;

})();
