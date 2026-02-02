import { Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ToolsList from "./pages/ToolsList.jsx";
import ToolDetail from "./pages/ToolDetail.jsx";

export default function App() {
  return (
    <div>
      <nav style={{ display: "flex", gap: 12, padding: 16, borderBottom: "1px solid #ddd" }}>
        <Link to="/">Home</Link>
        <Link to="/tools">Tools</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools" element={<ToolsList />} />
        <Route path="/tools/:id" element={<ToolDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

