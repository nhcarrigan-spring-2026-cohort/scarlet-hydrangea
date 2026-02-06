import { useParams, Link } from "react-router-dom";
import mockTools from "../mock/tools.mock.js";
import StatusBadge from "../components/StatusBadge.jsx";

export default function ToolDetail() {
  const { id } = useParams();
  const tool = mockTools.find((t) => String(t.id) === String(id));

  if (!tool) {
    return (
      <div className="container-narrow">
        <h1>Tool not found</h1>
        <Link to="/tools">Back to Tools</Link>
      </div>
    );
  }

  return (
    <div className="container-narrow">
      <Link to="/tools" className="muted">
        ← Back to Tools
      </Link>

      <div className="card-lg" style={{ marginTop: 16 }}>
        <h1 style={{ marginBottom: 12 }}>{tool.name}</h1>

        <p>
          <strong>Category:</strong> {tool.category}
        </p>

        <p>
          <strong>Condition:</strong> {tool.condition}
        </p>

        <p style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <strong>Status:</strong> <StatusBadge available={tool.available} />
        </p>

        <button
          className={`btn btn-primary ${tool.available ? "" : "btn-disabled"}`}
          disabled={!tool.available}
          style={{ marginTop: 16 }}
        >
          {tool.available ? "Request to Borrow" : "Unavailable"}
        </button>

        <p className="note" style={{ marginTop: 10 }}>
          
        </p>
      </div>
    </div>
  );
}
