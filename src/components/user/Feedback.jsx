import React, { useEffect, useState, } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import {useAuth} from "../utilities/AuthProvider";
import './Feedback.css';

const Feedback = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventName, setEventName] = useState("");
  const [eventId, setEventId] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
        if (!isAuthenticated) {
          navigate('/login'); }
      }, [isAuthenticated, navigate]);


  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://13.48.125.242:8000/api/getevent/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch event details');
        }

        const data = await response.json();
        setEventName(data.event.eventName);
        setEventId(data.event._id);
      } catch (error) {
        console.error('Error fetching event:', error);
        setSubmissionMessage(`Failed to load event details: ${error.message}. Please try again later.`);
        setShowForm(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleCommentsChange = (event) => {
    setComments(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const fetchPostFeedback = async () => {
      try {
        const response = await fetch(`http://13.48.125.242:8000/api/feedback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
          },
          body: JSON.stringify({ eventName, eventId, rating, comments })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch event details');
        }

        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error fetching event:', error);
        setSubmissionMessage(`Failed to load event details: ${error.message}. Please try again later.`);
        setShowForm(false);
      }
    };

    fetchPostFeedback();
    setShowForm(false);
    setSubmissionMessage("Your feedback has been submitted successfully! redirecting to home page....");
    setTimeout(() => {
      navigate('/home');
    }, 3000);
  };

  return (
    <div className="feedback">
      <div className="feedback-main-container">
        {showForm ? (
          <div className="feedback-form-container">
            <h2>Feedback Form</h2>
            <form className="feedback-form" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="event-name">
                  Event Name:
                </label>
                <input
                  id="event-name"
                  type="text"
                  value={eventName}
                  readOnly
                  className="form-control"
                    />
              </div>
              <div>
                <label htmlFor="rating-id">
                  Rating
                </label>
                <div id="rating-id">
                  {[...Array(5)].map((star, index) => {
                    index += 1;
                    return (
                      <button
                        type="button"
                        key={index}
                        onClick={() => handleRating(index)}
                      >
                        <span className={`star ${index <= rating ? "on" : "off"}`} style={{ fontSize: '1.8rem', color: index <= rating ? '#eeff07' : '#ccc', transition: 'color 0.2s ease-in-out', margin: '0 3px' }}>&#9733;</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label htmlFor="comments-id">
                  Comments
                </label>
                <textarea
                  id="comments-id"
                  value={comments}
                  onChange={handleCommentsChange}
                  placeholder="Please share your comments here..."
                  className="form-control bg-white"
                  rows={5}
                  required
                ></textarea>
              </div>
              <button type="submit" className="feedback-button btn w-100" style={{ backgroundColor: '#e64833', borderColor: '#e64833', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.9rem' }}>
                Submit Feedback
              </button>
            </form>
          </div>
        ) : (
          <div className="feedback-submission">
            <p>{submissionMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;