import { Link } from "react-router-dom";
import { getBorrows } from "../lib/api";
import { useState, useEffect, useCallback } from "react";
import StatusBadge from "../components/StatusBadge.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("borrower_id");

  // Memorize loadData to prevent unnecessary useEffect executions unless userId changes
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBorrows(userId);
      setRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [userId, loadData]);

  if (loading)
    return (
      <Loading />
    );

  if (error)
    return (
      <ErrorMessage message={error} onRetry={loadData} />
    );

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
                marginTop: "12px",
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
        ) : (requests.map((data) => {
          const requestStatus = (data.status || "unknown").toLowerCase();

          return (
            <div
              key={data.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <h3 style={{ margin: 0 }}>{data.item?.name ?? "Unnamed Tool"}</h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginTop: 12,
                }}
              >
                <span className="muted">Status:</span>

                {/* Badge should hug its content; fix that in StatusBadge styles */}
                <StatusBadge status={requestStatus} />

                <Link
                  to={`/tools/${data.item?.id}`}
                  style={{
                    width: "fit-content",
                    padding: "6px 12px",
                    backgroundColor: "#007bff",
                    color: "white",
                    borderRadius: 4,
                    textDecoration: "none",
                    marginTop: "10px",
                  }}
                >
                  View Tool
                </Link>
              </div>
            </div>
          );
        })
        )}
      </div>
    </div>
  );
}
