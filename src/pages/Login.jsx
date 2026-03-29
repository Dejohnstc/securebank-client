import { useState } from "react";
import api from "../api/api.js";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/api/auth/login", { email, password });

      // ✅ SAVE TOKEN
      localStorage.setItem("token", res.data.token);

      // ✅ SAVE USER (VERY IMPORTANT)
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ ROLE-BASED REDIRECT
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="login-page">

      <div className="login-card">

        <div className="login-brand">
          <div className="logo-box">SB</div>
          <h2>SecureBank</h2>
        </div>

        <h3 className="login-title">Sign in to your account</h3>

        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        <div className="login-footer">
          <p>
            Don’t have an account?
            <button
              className="register-link"
              onClick={() => navigate("/register")}
            >
              Create one
            </button>
          </p>
        </div>

      </div>

    </div>
  );
}

export default Login;