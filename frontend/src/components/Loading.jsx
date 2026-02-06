export default function Loading({ message = "Loading..." }) {
  return (
    <div style={{ padding: 16 }}>
      <p style={{ margin: 0 }}>{message}</p>
    </div>
  );
}
