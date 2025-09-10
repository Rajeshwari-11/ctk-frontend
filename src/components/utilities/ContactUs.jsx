import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./AuthProvider";
import './ContactUs.css';

function ContactUs() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState({
    contactName: '',
    contactEmail: '',
    contactMessage: '',
    contactPhonenumber: ''
  }
  );
  const [submissionMessage, setSubmissionMessage] = useState("");
  useEffect(() => {
      if (!isAuthenticated) {
        navigate('/login'); }
    }, [isAuthenticated, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const fetchPostContact = async () => {
      try {
        const response = await fetch(`http://13.48.125.242:8000/api/contact-post`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch event details');
        }
        const data = await response.json();
      } catch (error) {
        console.error('Error fetching event:', error);
        setSubmissionMessage(`Failed to load event details: ${error.message}. Please try again later.`);
        setShowForm(false);
      }
    };

    fetchPostContact();
    setShowForm(false);
    setSubmissionMessage("Your message has been sent successfully! We will contact you as soon as possible. Redirecting to homepage...."); // More appropriate message for contact us
    setTimeout(() => {
      navigate('/home');
    }, 3000);
  };


  return (
        <div className="contactus">
          <div className="contactus-main-container">
            {showForm ? (
              <div className="contactus-form-container">
                <h2>Contact Us</h2>
                <p className="contactus-description">
                  We'd love to hear from you! Please fill out the form below.
                </p>
                <form className="contactus-form" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="name">
                      Name:
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="contactName"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email">
                      Email:
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phonenumber">
                      Phone Number:
                    </label>
                    <input
                      type="text"
                      id="phonenumber"
                      name="contactPhonenumber"
                      value={formData.contactPhonenumber}
                      onChange={(e) => setFormData({ ...formData, contactPhonenumber: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message">
                      Message:
                    </label>
                    <textarea
                      id="message"
                      name="contactMessage"
                      value={formData.contactMessage}
                      onChange={(e) => setFormData({ ...formData, contactMessage: e.target.value })}
                      rows="4"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="contact-formbutton"            >
                    Submit
                  </button>
                </form>

                <div className="contact-furtherdetails">
                  <h3>For Further Details</h3>
                  <p>
                    ☎︎: +91 9347758782
                  </p>
                  <p>
                    ✉︎: ctkevents@gmail.com
                  </p>
                </div>
              </div>
            ) : (
              <div className="contact-submission">
                <p>{submissionMessage}</p>
              </div>
            )}
          </div>
        </div>

  );
}

export default ContactUs;