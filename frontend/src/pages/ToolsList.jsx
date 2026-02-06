import { useMemo, useState } from "react";
import mockTools from "../mock/tools.mock.js";
import ToolCard from "../components/ToolCard.jsx";

export default function ToolsList() {
  const [query, setQuery] = useState("");

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mockTools;
    return mockTools.filter((t) => t.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="container">
      <h1>Tools</h1>

      <input
        className="input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search tools..."
      />

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

      {filteredTools.length === 0 && (
        <p className="muted" style={{ marginTop: 16 }}>
          No tools match your search.
        </p>
      )}
    </div>
  );
}


