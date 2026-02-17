import mockData from "../mock/tools.mock";

export default function MyRequests() {
  return (
    <main>
      <h1>My Requests</h1>
      {mockData.length >= 1 ? (mockData.map((data) => (
        <div key={data.id}>
          <h3>{data.name}</h3>
          <p>Status: {data.status}</p>
        </div>
      ))
      ) : ("No requests found.")}
      <p>Request list coming soon</p>
    </main>
  )
}