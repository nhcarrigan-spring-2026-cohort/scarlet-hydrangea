import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

import { getMyBorrows } from "../lib/api";
import StatusBadge from "../components/StatusBadge.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getMyBorrows();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load your requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) return <Loading />;

  if (error) return <ErrorMessage message={error} onRetry={loadData} />;

  return (
    <div className="container">
      <h1>My Requests</h1>

      <div
        style={{
          display: "grid",
          gap: 20,
          marginTop: 18,
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        {requests.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              gridColumn: "1 / -1",
              padding: "40px 0",
            }}
          >
            <h3>You haven’t requested any tools yet.</h3>

            <Link
              to="/tools"
              style={{
                display: "inline-block",
                marginTop: 12,
                padding: "8px 16px",
                backgroundColor: "#007bff",
                color: "white",
                borderRadius: 4,
                textDecoration: "none",
              }}
            >
              Browse tools
            </Link>
          </div>
        ) : (
          requests.map((borrow) => {
            const requestStatus = String(borrow.status || "unknown").toLowerCase();
            const toolId = borrow.item?.id;
            const toolName = borrow.item?.name ?? "Unnamed Tool";

            return (
              <div
                key={borrow.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <h3 style={{ margin: 0 }}>{toolName}</h3>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    marginTop: 12,
                  }}
                >
                  <span className="muted">Status:</span>

                  <StatusBadge status={requestStatus} />

                  {toolId ? (
                    <Link
                      to={`/tools/${toolId}`}
                      style={{
                        width: "fit-content",
                        padding: "6px 12px",
                        backgroundColor: "#007bff",
                        color: "white",
                        borderRadius: 4,
                        textDecoration: "none",
                        marginTop: 10,
                      }}
                    >
                      View Tool
                    </Link>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}