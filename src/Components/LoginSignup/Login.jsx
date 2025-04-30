import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      console.log(response);
      alert(response.data.message);

      const { token } = response.data;
      localStorage.setItem("token", token);

      // Dispatch event to notify Navbar of login
      window.dispatchEvent(new Event("storage"));

      const userResponse = await axios.get(
        "http://localhost:5000/api/user/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (userResponse.data.role === "admin") {
        navigate("/admin_dashboard");
      } else {
        navigate("/users_dashboard");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Invalid credentials");
      alert(error.response?.data?.message || "Login failed");
    }
  };

  const handleForgotPassword = () => {
    // Redirect to forgot password page
    navigate("/forgot-password");
  };

  return (
    <div className="login-form-container">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>

      <div className="form-link">
        <span>
          <a href="#" onClick={handleForgotPassword}>
            Forgot your password?
          </a>
        </span>
        <span>
          Do not have an account? <a href="/signup">Sign up</a>
        </span>
      </div>
    </div>
  );
};

export default Login;
