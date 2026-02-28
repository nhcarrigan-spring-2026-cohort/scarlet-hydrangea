import { useState } from "react";
import ErrorMessage from "../components/ErrorMessage";


export default function Login() {
  // If already logged in, redirect to home immediately
  if (localStorage.getItem("token")) {
    window.location.href = "/";
    return null;
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  // Regex to validate standard email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Live validation: triggered when the user leaves the input field (blur)
  function validateEmail(e) {
    const value = e.target.value;
    let error = "";
    if (value !== "" && !emailRegex.test(value)) {
      error = "Please enter a valid email address";
    }
    setErrors(prev => ({ ...prev, email: error }));
  }

  // Update UI and clear old API errors on change
  function handleEmailChange(e) {
    setEmail(e.target.value);
  };

  function validatePassword(e) {
    const value = e.target.value;
    let error = "";
    if (value !== "" && value.length < 8) {
      error = "Password must be at least 8 characters";
    }

    setErrors(prev => ({ ...prev, password: error }));
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  // Main login handler: validates fields and calls the backend API
  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");

    // Guard clause: Stop if there are validation errors or empty fields
    if (Object.values(errors).some(err => err !== "") || !email || !password) {
      return;
    }

    try {
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

      if (!response.ok) {
        const data = await response.json();
        setApiError(data.error || "Please try again");
      } else {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        window.location.href = "/";
      }
    } catch (err) {
      setApiError("Couldn't connect to server.")
    }

  }

  return (
    <div className="container-narrow">
      <form onSubmit={handleSubmit}>
        <div className="card-lg login-card">
          <h1>Login</h1>
          <div style={{ marginBottom: '1rem', textAlign: 'left', display: "flex", flexDirection: "column" }}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="test@email.com"
              value={email}
              onChange={handleEmailChange}
              onBlur={validateEmail}
              className="input"
              required
            />
            {errors.email &&
              <span className="note errorMessage-animation"
                style={{ color: 'red', fontWeight: "bold" }}>
                {errors.email}
              </span>
            }
          </div>
          <div style={{ marginBottom: '1rem', textAlign: 'left', display: "flex", flexDirection: "column" }}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={handlePasswordChange}
              onBlur={validatePassword}
              className="input"
              required
            />
            {errors.password &&
              <span className="note errorMessage-animation"
                style={{ color: 'red', fontWeight: "bold" }}>
                {errors.password}
              </span>
            }
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
          {apiError && <ErrorMessage message={apiError} small />}
        </div>
      </form>
    </div>
  );
}