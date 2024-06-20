import React, { useState } from "react";
import { useHistory } from "react-router-dom";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const history = useHistory();

  function handleSubmit(e) {
    e.preventDefault();

    fetch("/api/sign_in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((r) => {
        if (r.ok) {
          return r.json();
        } else {
          throw new Error("Login failed");
        }
      })
      .then((data) => {
        console.log("Login successful:", data);
        setUser(data);
        if (data.isBoss) {
          history.push("/home");
        } else {
          history.push(`/employee/${data.id}`);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Invalid email or password");
        setUser(null);
      });
  }

  return (
    <div className="login-container">
      <div className="login-box">
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          <button type="submit" className="toggle-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
