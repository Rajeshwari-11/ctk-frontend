import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./AuthProvider"; // Adjust the import path as necessary
import './LoginPage.css';

const LoginPage = () => {
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, login, loading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home'); // Redirect to profile if already authenticated
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userEmail || !password) {
        setError("Both fields are required!");
        return;
    }

    setError(""); // Clear any previous errors

    try {
        await login(userEmail, password); // Wait for login to complete
        navigate('/home'); // Navigate to home after successful login
    } catch (err) {
        setError(err.message || "Login failed. Please try again."); // Display error message
    }
};

  if (loading) {
    return (
      <div className="centered-message">
        <p>Loading...</p> {/* Show a loading message or spinner */}
      </div>
    );
  }

  return (
    <div className="login">
      <div className="login-maincontainer">
        <div className="login-formcontainer">
          <h2>Login</h2>
          {error && <p className="text-danger mb-3">{error}</p>}
          <form className="login-form" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="login-button"
            >
              Login
            </button>
            <div>
              <a href="/forgot-password">
                Forgot password?
              </a>
            </div>
            <div>
              <a href="/signup">
                New User? Register Here
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;