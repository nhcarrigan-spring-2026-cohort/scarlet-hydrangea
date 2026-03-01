import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../lib/api";
import ErrorMessage from "../components/ErrorMessage";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    username: "",
    full_name: "",
    password: "",
  });

  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const errors = useMemo(() => {
    const e = {};

    // email
    if (!form.email) e.email = "Email is required";
    else if (!emailRegex.test(form.email)) e.email = "Enter a valid email";

    // username 3-50
    if (!form.username) e.username = "Username is required";
    else if (form.username.length < 3 || form.username.length > 50) {
      e.username = "Username must be 3–50 characters";
    }

    // full_name 1-100
    if (!form.full_name) e.full_name = "Full name is required";
    else if (form.full_name.length < 1 || form.full_name.length > 100) {
      e.full_name = "Full name must be 1–100 characters";
    }

    // password 8+
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Password must be 8+ characters";

    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function markTouched(name) {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");
    setSuccessMsg("");

    // mark everything touched so errors show
    setTouched({ email: true, username: true, full_name: true, password: true });

    if (!isValid) return;

    setSubmitting(true);
    try {
      await registerUser({
        email: form.email.trim(),
        username: form.username.trim(),
        full_name: form.full_name.trim(),
        password: form.password,
      });

      setSuccessMsg("Account created ✅ Redirecting to login...");
      // don’t auto-login (per acceptance criteria)
      setTimeout(() => navigate("/login"), 700);
    } catch (err) {
      // ApiError message should already be clean if apiRequest is written well
      setApiError(err?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-narrow">
      <form onSubmit={handleSubmit}>
        <div className="card-lg login-card">
          <h1>Create account</h1>

          <div style={{ marginBottom: "1rem", textAlign: "left", display: "flex", flexDirection: "column" }}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="input"
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              onBlur={() => markTouched("email")}
              placeholder="you@example.com"
              required
            />
            {touched.email && errors.email && (
              <span className="note" style={{ color: "red", fontWeight: "bold" }}>
                {errors.email}
              </span>
            )}
          </div>

          <div style={{ marginBottom: "1rem", textAlign: "left", display: "flex", flexDirection: "column" }}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              className="input"
              value={form.username}
              onChange={(e) => setField("username", e.target.value)}
              onBlur={() => markTouched("username")}
              placeholder="3–50 characters"
              required
            />
            {touched.username && errors.username && (
              <span className="note" style={{ color: "red", fontWeight: "bold" }}>
                {errors.username}
              </span>
            )}
          </div>

          <div style={{ marginBottom: "1rem", textAlign: "left", display: "flex", flexDirection: "column" }}>
            <label htmlFor="full_name">Full name</label>
            <input
              id="full_name"
              className="input"
              value={form.full_name}
              onChange={(e) => setField("full_name", e.target.value)}
              onBlur={() => markTouched("full_name")}
              placeholder="1–100 characters"
              required
            />
            {touched.full_name && errors.full_name && (
              <span className="note" style={{ color: "red", fontWeight: "bold" }}>
                {errors.full_name}
              </span>
            )}
          </div>

          <div style={{ marginBottom: "1rem", textAlign: "left", display: "flex", flexDirection: "column" }}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              type="password"
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
              onBlur={() => markTouched("password")}
              placeholder="At least 8 characters"
              required
            />
            {touched.password && errors.password && (
              <span className="note" style={{ color: "red", fontWeight: "bold" }}>
                {errors.password}
              </span>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Creating..." : "Create account"}
          </button>

          <div style={{ marginTop: 12 }}>
            <span className="muted">Already have an account?</span>{" "}
            <Link to="/login">Log in</Link>
          </div>

          {successMsg && <p style={{ marginTop: 12 }}>{successMsg}</p>}
          {apiError && <ErrorMessage message={apiError} small />}
        </div>
      </form>
    </div>
  );
}