export default function Loading({ message = "Loading..." }) {
  return (
    <div style={{ marginTop: 20, padding: 16, textAlign: "center" }}>
      <div className="spinner" />
      <p style={{ margin: 0 }}>{message}</p>
    </div>
  );
}
