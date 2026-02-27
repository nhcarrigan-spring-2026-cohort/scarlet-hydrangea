import { useState } from "react";
import ErrorMessage from "../components/ErrorMessage";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      })
    });

    try {
      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Please try again");
      } else {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        navigate("/");
      }
    } catch (err) {
      setError("Couldn't connect to server.")
    }
  }

  return (
    <div className="container-narrow">
      <form onSubmit={handleSubmit}>
        <div className="card-lg">
          <h1>Login</h1>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
          <button type="submit" className="btn btn-primary">Login</button>
          {error && <ErrorMessage message={error} small />}
        </div>
      </form>
    </div>
  );
}