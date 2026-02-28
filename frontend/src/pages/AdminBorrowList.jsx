import { useEffect, useState } from "react";
import { getAllBorrows } from "../lib/api";
import StatusBadge from "../components/StatusBadge";

export default function AdminBorrowList() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBorrows() {
      try {
        const data = await getAllBorrows();
        setBorrows(data);
      } catch (err) {
        if (err.status === 401) {
          setError("Unauthorized. Please login.");
        } else if (err.status === 403) {
          setError("Access denied. Admins only.");
        } else {
          setError("Failed to load borrows");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchBorrows();
  }, []);

  if (loading)
    return (
      <div
        className="container-narrow"
        style={{ textAlign: "center", marginTop: 90 }}
      >
        <div className="spinner" />
        <p
          className="note"
          style={{
            marginTop: 20,
            marginLeft: 12,
            fontWeight: "bolder",
            textAlign: "center",
            fontSize: "larger",
          }}
        >
          Loading ...
        </p>
      </div>
    );

  if (error)
    return (
      <p
        style={{
          textAlign: "center",
          marginTop: 100,
          fontWeight: "bolder",
          fontSize: 30,
        }}
      >
        {error}
      </p>
    );

  if (borrows.length === 0)
    return (
      <p
        style={{
          textAlign: "center",
          marginTop: 100,
          fontWeight: "bolder",
          fontSize: 30,
        }}
      >
        No borrow requests found.
      </p>
    );

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <h1 style={{ marginBottom: "2rem" }}>All Borrow Requests</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {borrows.map((borrow) => (
          <div
            key={borrow.id}
            style={{
              background: "#1e1e1e",
              border: "1px solid #333",
              borderRadius: "12px",
              padding: "20px",
              transition: "0.2s ease",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>{borrow.item?.name}</h3>

            <p style={{ marginBottom: "8px" }}>
              <strong>Borrower:</strong> {borrow.borrower?.full_name}
            </p>

            <div style={{ marginTop: "10px" }}>
              <StatusBadge status={borrow.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
