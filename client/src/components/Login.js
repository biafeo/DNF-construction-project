import React, { useState } from "react";
import { useHistory } from "react-router-dom";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const history = useHistory();

  function handleSubmit(e) {
    e.preventDefault();

    fetch("/sign_in", {
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
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
