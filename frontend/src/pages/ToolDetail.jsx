import { useParams, Link } from "react-router-dom";

const mockTools = [
  { id: 1, name: "Power Drill", category: "Tools", condition: "Good", available: true },
  { id: 2, name: "Ladder", category: "Home", condition: "Fair", available: false },
  { id: 3, name: "Camping Tent", category: "Outdoors", condition: "Great", available: true },
];

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
    <div style={{ padding: 16 }}>
      <Link to="/tools">← Back</Link>
      <h1 style={{ marginTop: 8 }}>{tool.name}</h1>
      <p>{tool.category} • {tool.condition}</p>
      <p>
        Status: <strong>{tool.available ? "Available" : "Unavailable"}</strong>
      </p>
    </div>
  );
}
