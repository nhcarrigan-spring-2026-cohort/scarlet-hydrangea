import { Link } from "react-router-dom";
import mockTools from "../mock/tools.mock.js";
import StatusBadge from "../components/StatusBadge.jsx";

export default function Home() {
  const featured = mockTools.slice(0, 3);

  return (
    <div className="container">
      {/* Hero */}
      <h1>Community Tool Library</h1>
      <p className="muted">Borrow, don’t buy. Share tools with your community.</p>

      <div style={{ marginTop: 16 }}>
        <Link to="/tools" className="btn">
          Browse Tools
        </Link>
      </div>

      {/* How it works */}
      <h2>How it works</h2>
      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        <div className="card">
          <h3>Browse</h3>
          <p className="muted" style={{ margin: 0 }}>
            See available tools
          </p>
        </div>

        <div className="card">
          <h3>Request</h3>
          <p className="muted" style={{ margin: 0 }}>
            Request to borrow (Week 2)
          </p>
        </div>

        <div className="card">
          <h3>Return</h3>
          <p className="muted" style={{ margin: 0 }}>
            Return it so others can use it
          </p>
        </div>
      </div>

      {/* Featured tools */}
      <h2>Featured tools</h2>
      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        {featured.map((tool) => (
          <div key={tool.id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <h3 style={{ margin: 0 }}>{tool.name}</h3>
              <StatusBadge available={tool.available} />
            </div>

            <p className="muted" style={{ margin: "6px 0" }}>
              {tool.category} • {tool.condition}
            </p>

            <Link to={`/tools/${tool.id}`}>View details →</Link>
          </div>
        ))}
      </div>

      <p className="note" style={{ marginTop: 16 }}>
        
      </p>
    </div>
  );
}
