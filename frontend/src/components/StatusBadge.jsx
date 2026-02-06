export default function StatusBadge({ available }) {
  const label = available ? "Available" : "Unavailable";

  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        border: "1px solid #ddd",
        background: available ? "#eaffea" : "#ffecec",
        color: "#111",
      }}
    >
      {label}
    </span>
  );
}
