import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../utilities/AuthProvider";
import "./EventDetail.css";
import moment from "moment";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null); // Initialize with null to handle loading state
  const [isExpired, setIsExpired] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchEventDetails = async (eventId) => {
      try {
        const response = await fetch(`http://13.48.125.242:8000/api/getevent/${eventId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
          },
        });

        if (!response.ok) {
          navigate('/login');
          throw new Error("Failed to fetch event details...");
        }

        const data = await response.json();
        setEvent(data.event);

        const eventDate = new Date(data.event.eventDate);
        const today = new Date();
        eventDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (eventDate < today) {
          setIsExpired(true);
        } else {
          setIsExpired(false);
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };
    fetchEventDetails(id);

  }, [id]);

  if (!event) {
    return <p>Loading event details...</p>;
  }

  const handleViewTicketsClick = () => {
    navigate(`/vieweventtickets/${event._id}`)
  }

  const handleViewFeedbacksClick = (e) => {
    navigate(`/viewfeedback/${event._id}`);
  }

  const handleBookTicketClick = () => {
    navigate(`/booking/${event._id}`);

  };

  const handleProvideFeedbackClick = () => {
    navigate(`/feedback/${event._id}`);
  };

  return (
    <div className="event">
      <div className="event-details-container">
        <div className="event-details-top ">
          <img
            src={event.eventImage} 
            alt={event.eventName}
            className="event-details-image"
          />
          <div className="event-details-info">
            <h2>{event.eventName}</h2>
            <div className="event-description">
              <p><strong>About:</strong> {event.eventDescription}</p>
            </div>
            <div className="event-details">
              <p><strong>Event Date:</strong> {moment(event.eventDate).format('YYYY-MM-DD')}</p>
              <p><strong>Location:</strong>   {event.eventLocation}</p>
              <p><strong>Available Tickets:</strong> {event.eventAvailableTickets}</p>
              <p><strong>Ticket Price:</strong> ₹{event.eventTicketPrice}</p>
              <p><strong>Event Time:</strong> {event.eventTime}</p>
            </div>
            <div className="event-buttons">
              <button className="back-button" onClick={() => navigate("/events")}>
                Back to Events
              </button>

              {/* Scenario 1: isExpired is true AND isAdmin is true */}
              {isExpired && isAdmin ? (
                <button
                  className="action-button" // You might want a different class for this button
                  onClick={handleViewFeedbacksClick} // Assuming you have this handler
                >
                  View Feedbacks
                </button>
              ) : /* Scenario 2: isExpired is true AND isAdmin is false */
                isExpired && !isAdmin ? (
                  <button
                    className="action-button" // Or "book-ticket-button" if styling is similar
                    onClick={handleProvideFeedbackClick}
                  >
                    Provide Feedback
                  </button>
                ) : /* Scenario 3: isExpired is false AND isAdmin is true */
                  !isExpired && isAdmin ? (
                    <button
                      className="action-button" // Or "book-ticket-button" if styling is similar
                      onClick={handleViewTicketsClick} // Assuming you have this handler
                    >
                      View Tickets
                    </button>
                  ) : /* Scenario 4: isExpired is false AND isAdmin is false (standard user, upcoming event) */
                    !isExpired && !isAdmin ? (
                      event.eventAvailableTickets === 0 ? ( // Check tickets only for non-admin, non-expired case
                        <button
                          className="book-ticket-button disabled-button"
                          disabled
                        >
                          Sold Out
                        </button>
                      ) : (
                        <button
                          className="book-ticket-button"
                          onClick={handleBookTicketClick}
                        >
                          Book Ticket
                        </button>
                      )
                    ) : null /* Fallback, though all cases should be covered */
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;