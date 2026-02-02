import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Community Tool Library</h1>
      <p>Borrow, don’t buy.</p>
      <Link to="/tools">Go to Tools</Link>
    </div>
  );
}
