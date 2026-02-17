import mockData from "../mock/tools.mock";

export default function MyRequests() {
  return (
    <div className="container">
      <h1>My Requests</h1>
      <div style={{
        display: "grid",
        gap: 12,
        marginTop: 16,
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))"
      }}>
        {mockData.length >= 1 ? (mockData.map((data) => (
          <div key={data.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
            <h3 style={{ margin: 0 }}>{data.name}</h3>
            <span style={{ margin: "6px 0" }} className="muted">Status: {data.available === true ? "Approved ✅" : "Pending ⏳"}</span>
          </div>
        ))
        ) : ("No requests found.")}
      </div>
    </div>
  )
}