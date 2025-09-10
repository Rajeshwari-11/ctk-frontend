import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './ForgotPassword.css';


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill("")); // Array to store 6 OTP digits
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [otpToken, setOtpToken] = useState("");
  const navigate = useNavigate();

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      const response = await fetch("http://13.48.125.242:8000/api/forget-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      console.log(response);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setOtpToken(data.token);
      setMessage(data.message);
      setStep(2);
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError(err.message);
    }
  };

  const handleOtpChange = (element, index) => {
    const value = element.target.value;
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next input box
      if (value && index < 5) {
        element.target.nextSibling?.focus();
      }
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://13.48.125.242:8000/api/verifyOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          token: otpToken,
          otp: otp.join("")
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid OTP");
      }

      setMessage(data.message);

      //console.log(otpToken);
      localStorage.setItem("otpToken", otpToken);


      setTimeout(() => {
        localStorage.removeItem("otpToken");
        console.log("OTP token expired and removed from localStorage.");
      }, 10 * 60 * 1000);

      navigate("/reset-password");
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError(err.message);
    }
  };


  return (
    <div className="forgot">
      <div className="forgot-maincontainer">
        <div className="forgot-formcontainer">
          <h2>Forgot Password</h2>
          {message && <p className="message">{message}</p>}
          {error && <p className="error">{error}</p>}
          {step === 1 && (
            <form className="forgot-form" onSubmit={handleEmailSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">
                Send OTP
              </button>
            </form>
          )}
          {step === 2 && (
            <form className="forgot-form" onSubmit={handleOtpSubmit}>
              <div className="otp-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    className="otp-input"
                  />
                ))}
              </div>
              <button type="submit">
                Verify OTP
              </button>
            </form>
          )}
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

export default ForgotPassword;
