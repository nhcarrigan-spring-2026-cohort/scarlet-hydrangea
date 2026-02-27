import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";

import Home from "./pages/Home.jsx";
import ToolsList from "./pages/ToolsList.jsx";
import ToolDetail from "./pages/ToolDetail.jsx";
import MyRequests from "./pages/MyRequests.jsx";
import Login from "./pages/Login.jsx";

export default function App() {
  const hasToken = !!localStorage.getItem("token");

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={hasToken ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route path="/tools" element={<ToolsList />} />
        <Route path="/tools/:id" element={<ToolDetail />} />
        <Route path="/requests" element={<MyRequests />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
