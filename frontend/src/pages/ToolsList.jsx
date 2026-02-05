import { Link } from "react-router-dom";
import mockTools from "../mock/tools.mock";

export default function ToolsList() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Tools</h1>

      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        {mockTools.map((t) => (
          <div key={t.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
            <h3 style={{ margin: 0 }}>{t.name}</h3>
            <p style={{ margin: "6px 0" }}>
              {t.category} • {t.condition}
            </p>
            <strong>{t.available ? "Available" : "Unavailable"}</strong>

            <div style={{ marginTop: 8 }}>
              <Link to={`/tools/${t.id}`}>View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
