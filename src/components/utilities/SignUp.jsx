import React, { useState,useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./AuthProvider";
import './SignUp.css';

const SignUp = () => {
  const [formData, setformData] = useState({
    userName: "",
    userEmail: "",
    password: "",
    confirmPassword: "",
    userPhonenumber: ""
  });

  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
    const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
      if (isAuthenticated) {
        navigate('/home'); 
      }
    }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setformData({ ...formData, [name]: value });
  };

  const validatePassword = (password) => {
    const minLength = /.{8,}/;
    const upperCase = /[A-Z]/;
    const lowerCase = /[a-z]/;
    const digit = /[0-9]/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (!minLength.test(password)) {
        return "Password must be at least 8 characters long.";
    }
    if (!upperCase.test(password)) {
        return "Password must contain at least one uppercase letter.";
    }
    if (!lowerCase.test(password)) {
        return "Password must contain at least one lowercase letter.";
    }
    if (!digit.test(password)) {
        return "Password must contain at least one digit.";
    }
    if (!specialChar.test(password)) {
        return "Password must contain at least one special character.";
    }

    return "";
};


  const handleSubmit = (event) => {
    event.preventDefault();


    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const passwordError = validatePassword(formData.password);
        if (passwordError) {
            setError(passwordError);
            return;
        }
        
    fetch('http://13.48.125.242:8000/api/signup', {
      method: ['POST'],
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error("error")
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          console.log("User logged in successfully!");
          navigate("/login");
        } else {
          console.error("Error:", data.message);
        }
      })
  };

  return (
    <div className="signup">
      <div className="signup-maincontainer">
        <div className="signup-formcontainer">
          <h2 className="text-white text-center mb-4">Register</h2>
          {submitted ? (
            <p className="text-white text-center">Thank you for registering, {formData.name}!</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3 text-start">
                <label htmlFor="username" className="form-label text-white">Name:</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3 text-start">
                <label htmlFor="email" className="form-label text-white">Email:</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="userEmail"
                  value={formData.userEmail}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3 text-start">
                <label htmlFor="password" className="form-label text-white">Password:</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <ul>
                            <li>At least 8 characters</li>
                            <li>At least one uppercase letter</li>
                            <li>At least one lowercase letter</li>
                            <li>At least one digit</li>
                            <li>At least one special character</li>
                        </ul>
              </div>
              <div className="mb-3 text-start">
                <label htmlFor="confirmPassword" className="form-label text-white">Confirm Password:</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3 text-start">
                <label htmlFor="phonenumber" className="form-label text-white">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  id="phonenumber"
                  name="userPhonenumber"
                  value={formData.userPhonenumber}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && <p className="text-danger mb-3">{error}</p>}

              <button type="submit" className="singup-button btn btn-danger w-100 mt-3" style={{ backgroundColor: '#e64833', borderColor: '#e64833' }}>Register</button>

              <div className="mt-3 text-center">
                <a href="/login" className="text-white text-decoration-none">Already Have an Account? Click Here</a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignUp;
