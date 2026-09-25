import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    console.log("✅ handleLogin started");

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      console.log("Backend Response:", data);

      if (!response.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Saved Token:", localStorage.getItem("token"));
      console.log("Saved User:", localStorage.getItem("user"));

      alert("Login Successful!");

      navigate("/home");
    } catch (error) {
      console.error("Login Error:", error);
      alert("Server Error");
    }
  };

  return (
    <>
      <header className="header">
        <div className="logo">
          <h2>Infinite Computer Solutions</h2>
        </div>
      </header>

      <div className="container">
        <div className="login-box">
          <h1>Login</h1>
          <p>Welcome back!</p>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>
          </form>

          <div className="links">
            <a href="#">Forgot Password?</a>
          </div>

          <p className="signup">
            Don't have an account? <a href="#">Sign Up</a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;