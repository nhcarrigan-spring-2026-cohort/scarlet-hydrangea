import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToolById } from "../lib/api.js";
import StatusBadge from "../components/StatusBadge.jsx";

export default function ToolDetail() {
  const { id } = useParams();

  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchTool() {
      setLoading(true);
      setErrorMsg("");

      try {
        const data = await getToolById(id);
        if (isMounted) setTool(data);
      } catch {
        if (isMounted) setErrorMsg("We couldn’t load this tool right now.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchTool();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container-narrow" style={{ textAlign: "center" }}>
        <div className="spinner" />
        <p className="note" style={{ marginTop: 10 }}>
          Loading tool details...
        </p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="container-narrow">
        <Link to="/tools">← Back to Tools</Link>

        <div className="card-lg" style={{ marginTop: 16 }}>
          <h1 style={{ marginBottom: 8 }}>Something went wrong</h1>
          <p className="muted">{errorMsg}</p>

          <div style={{ marginTop: 16 }}>
            <Link className="btn" to="/tools">
              Back to Tools
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="container-narrow">
        <Link to="/tools">← Back to Tools</Link>

        <div className="card-lg" style={{ marginTop: 16 }}>
          <h1 style={{ marginBottom: 8 }}>Tool not found</h1>
          <p className="muted">We couldn’t find that tool.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-narrow">
      <Link to="/tools">← Back to Tools</Link>

      <div className="card-lg" style={{ marginTop: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <h1 style={{ margin: 0 }}>{tool.name}</h1>
            <p className="muted" style={{ margin: "6px 0 0" }}>
              {tool.category} • {tool.condition}
            </p>
          </div>

          <StatusBadge available={tool.available} />
        </div>

        <div style={{ marginTop: 18 }}>
          <button className="btn btn-primary" disabled={!tool.available}>
            {tool.available ? "Request to Borrow" : "Currently Unavailable"}
          </button>

          {!tool.available && (
            <p className="note" style={{ marginTop: 10 }}>
              This tool is currently unavailable.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
