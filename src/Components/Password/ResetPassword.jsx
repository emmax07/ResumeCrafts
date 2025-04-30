import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Forget_Reset.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Pass the reset token (if provided in URL or through email)
      const response = await axios.post(
        "http://localhost:5000/api/reset-password",
        {
          password,
          token: "some-reset-token", // You will need to pass the token from the reset email link
        }
      );
      setSuccess(response.data.message);
      navigate("/login");
      setError("");
    } catch (error) {
      setError("Failed to reset password", error);
      setSuccess("");
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      {success && <div className="success">{success}</div>}
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
