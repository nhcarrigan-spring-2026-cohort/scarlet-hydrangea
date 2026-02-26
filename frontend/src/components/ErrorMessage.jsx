export default function ErrorMessage({ message, onRetry }) {
  return (
    <div style={{ marginTop: 20, padding: 16, textAlign: "center" }}>
      <h1>{message}</h1>
      <button className="btn btn-primary" onClick={onRetry}>Try Again</button>
    </div>
  );
}