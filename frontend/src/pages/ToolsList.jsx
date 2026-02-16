import { useEffect, useMemo, useState } from "react";
import { getTools } from "../lib/api";
import ToolCard from "../components/ToolCard.jsx";

export default function ToolsList() {
  const [tools, setTools] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTools() {
      try {
        const data = await getTools();
        setTools(data);
      } catch (err) {
        console.error("Error fetching tools:", err);
        setError("Failed to load tools. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchTools();
  }, []);

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tools;
    return tools.filter((t) => t.name.toLowerCase().includes(q));
  }, [query, tools]);

  return (
    <div className="container">
      <h1>Tools</h1>

      <input
        className="input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search tools..."
      />

      {/* Loading State */}
      {loading && (
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <div className="spinner" />
          <p>Loading tools...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <p style={{ color: "red", marginTop: 16 }}>{error}</p>
      )}

      {/* Tools Grid */}
      {!loading && !error && (
        <div
          style={{
            display: "grid",
            gap: 12,
            marginTop: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          {filteredTools.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredTools.length === 0 && (
        <p className="muted" style={{ marginTop: 16 }}>
          No tools match your search.
        </p>
      )}
    </div>
  );
}
