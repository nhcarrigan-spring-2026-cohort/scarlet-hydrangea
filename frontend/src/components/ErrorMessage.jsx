export default function ErrorMessage({ message, onRetry, small }) {
  const Tag = small ? "h3" : "h1";
  return (
    <div style={{ marginTop: 20, padding: 16, textAlign: "center" }}>
      <Tag>{message}</Tag>
      {onRetry && <button className="btn btn-primary" onClick={onRetry}>Try Again</button>}
    </div>
  );
}