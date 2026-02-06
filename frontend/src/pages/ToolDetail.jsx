import { useParams, Link } from "react-router-dom";
import mockTools from "../mock/tools.mock";


export default function ToolDetail() {
  const { id } = useParams();
  const tool = mockTools.find((t) => String(t.id) === String(id));

  if (!tool) {
    return (
      <div style={{ padding: 16 }}>
        <h1>Tool not found</h1>
        <Link to="/tools">Back to Tools</Link>
      </div>
    );
  }

  return (
  <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
    <Link to="/tools" style={{ textDecoration: "none", color: "#555" }}>
      ← Back to Tools
    </Link>

    <div
      style={{
        marginTop: 16,
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 8,
      }}
    >
      <h1 style={{ marginBottom: 12 }}>{tool.name}</h1>

      <p>
        <strong>Category:</strong> {tool.category}
      </p>

      <p>
        <strong>Condition:</strong> {tool.condition}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        <span style={{ color: tool.available ? "green" : "red" }}>
          {tool.available ? "Available" : "Unavailable"}
        </span>
      </p>

      <button
        disabled={!tool.available}
        style={{
          marginTop: 16,
          padding: "10px 16px",
          borderRadius: 4,
          border: "none",
          backgroundColor: tool.available ? "#2563eb" : "#aaa",
          color: "#fff",
          cursor: tool.available ? "pointer" : "not-allowed",
        }}
      >
        Request to Borrow
      </button>
    </div>
  </div>
);

}
