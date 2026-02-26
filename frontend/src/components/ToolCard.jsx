import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge.jsx";

export default function ToolCard({ tool }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 12,
        display: "flex",            
        flexDirection: "column",   
        minHeight: 160              
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <h3 style={{ margin: 0 }}>{tool.name}</h3>
        <StatusBadge available={tool.available} />
      </div>

      <p style={{ margin: "6px 0" }}>
        {tool.category} • {tool.condition}
      </p>

      <div style={{ marginTop: "auto" }}> {/* 👈 changed from 8 to "auto" */}
        <Link to={`/tools/${tool.id}`}>View Details</Link>
      </div>
    </div>
  );
}