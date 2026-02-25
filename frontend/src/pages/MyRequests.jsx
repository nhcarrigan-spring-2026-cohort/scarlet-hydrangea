import mockData from "../mock/tools.mock";
import { Link } from "react-router-dom";
import { getBorrows } from "../lib/api";
import { useState, useEffect } from "react";

export default function MyRequests() {
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
        {mockData.length >= 1
          ? mockData.map((data) => (
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
                <h3 style={{ margin: 0 }}>{data.name}</h3>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    marginTop: 12,
                  }}
                >
                  <span className="muted">
                    Status:{" "}
                    {data.available === true
                      ? "Approved ✅"
                      : "Pending ⏳"}
                  </span>

                  <Link
                    to={`/tools/${data.id}`}
                    style={{
                      width: "fit-content",
                      padding: "6px 12px",
                      backgroundColor: "#007bff",
                      color: "white",
                      borderRadius: 4,
                      textDecoration: "none",
                      marginTop:"10px "
                    }}
                  >
                    View Tool
                  </Link>
                </div>
              </div>
            ))
          : "No requests found."}
      </div>
    </div>
  );
}