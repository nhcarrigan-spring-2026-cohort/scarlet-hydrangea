import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToolById } from "../lib/api";
import StatusBadge from "../components/StatusBadge";
import "../styles/ToolDetail.css";

export default function ToolDetail() {
  const { id } = useParams();

  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTool() {
      try {
        const data = await getToolById(id);
        setTool(data);
      } catch (err) {
        setError("We couldn’t load this tool right now.");
      } finally {
        setLoading(false);
      }
    }

    fetchTool();
  }, [id]);

  // Loading State
  if (loading) {
    return (
      <div className="td-state">
        <div className="spinner" />
        <p>Loading tool details...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="td-state">
        <h2 className="td-error-title">Something went wrong</h2>
        <p className="td-muted">{error}</p>
        <Link to="/tools" className="td-btn-secondary">
          Back to Tools
        </Link>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="td-state">
        <h2>Tool not found</h2>
        <Link to="/tools" className="td-btn-secondary">
          Back to Tools
        </Link>
      </div>
    );
  }

  return (
    <div className="td-wrapper">
      <div className="td-topbar">
        <Link to="/tools" className="td-back">
          ← Back
        </Link>
      </div>

      <div className="td-card">
        <div className="td-header">
          <div>
            <h1 className="td-title">{tool.name}</h1>
            <p className="td-subtitle">
              {tool.category} • {tool.condition}
            </p>
          </div>

          <StatusBadge available={tool.available} />
        </div>

        <div className="td-divider" />

        <div className="td-action">
          <button
            className={`td-btn-primary ${
              !tool.available ? "td-btn-disabled" : ""
            }`}
            disabled={!tool.available}
          >
            {tool.available ? "Request to Borrow" : "Currently Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
}
