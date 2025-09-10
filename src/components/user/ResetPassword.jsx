import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './ResetPassword.css';

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    const token = localStorage.getItem("otpToken"); // Get the token from storage
    if (!token) {
      setError("Session expired. Please verify OTP again.");
      return;
    }

    try {
      const response = await fetch("http://13.48.125.242:8000/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }
      setMessage(data.message);
      localStorage.removeItem("otpToken"); // Clear token after success
      navigate("/login");
    } catch (err) {
      console.error("Error resetting password:", err);
      setError(err.message || "Failed to reset password. Please try again.");
    }
  };


  return (
    <div className="reset">
      <div className="reset-maincontainer">
        <div className="reset-formcontainer">
          <h2>Reset Password</h2>
          {message && <p className="message">{message}</p>}
          {error && <p className="error">{error}</p>}
          <form className="reset-form" onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">
              Reset Password
            </button>
          </form>
          <button
            onClick={() => navigate("/login")}
            className="loginBack-button"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
