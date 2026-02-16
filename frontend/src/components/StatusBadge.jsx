const STATUS_META = {
  available: { label: "Available", tone: "ok" },
  checked_out: { label: "Checked out", tone: "warn" },
  unknown: { label: "Status unknown", tone: "muted" },
};

export default function StatusBadge(props) {
  const {
    // New shape (preferred)
    status,

    // Legacy shape (kept because older screens still pass it)
    available,

    className = "",
    title,
    onClick,
  } = props;

  let normalizedStatus = status;

  if (!normalizedStatus) {
    if (available === true) normalizedStatus = "available";
    else if (available === false) normalizedStatus = "checked_out";
    else normalizedStatus = "unknown";
  }

  const meta = STATUS_META[normalizedStatus] || STATUS_META.unknown;

  const rootClass =
    "badge statusBadge " +
    `statusBadge--${meta.tone}` +
    (className ? ` ${className}` : "");

  const content = meta.label;

  if (typeof onClick === "function") {
    return (
      <button type="button" className={rootClass} title={title} onClick={onClick}>
        {content}
      </button>
    );
  }

  return (
    <span className={rootClass} title={title}>
      {content}
    </span>
  );
}