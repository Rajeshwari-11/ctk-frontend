import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import { useAuth } from './AuthProvider';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronDown,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./ProfilePage.css"; // Import the external CSS file

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [bookedTickets, setBookedTickets] = useState([]);
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);
  const [feedbacksError, setFeedbacksError] = useState(null);
  const [showBookings, setShowBookings] = useState(false);
  const [showFeedbacks, setShowFeedbacks] = useState(false);
   const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/login");
    }
  };

  const handleCancelTicket = useCallback(
    async (bookingId) => {
      try {
        const response = await fetch(`http://13.48.125.242:8000/api/cancelticket/${bookingId}`, {
          method: 'DELETE',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
          throw new Error(errorData.message || `Cancellation failed! Status: ${response.status}`);
        }

        setBookedTickets((prevBookings) => {
          return prevBookings.map(eventGroup => ({
            ...eventGroup,
            bookings: eventGroup.bookings.filter(
              (ticket) => ticket._id !== bookingId
            )
          })).filter(eventGroup => eventGroup.bookings.length > 0);
        });

        console.log("Ticket cancelled successfully!");
      } catch (err) {
        console.error("Error cancelling ticket:", err.message);
      }
    },
    [navigate]
  );

  useEffect(() => {
    const fetchAllUserData = async () => {
      setLoadingUser(true);
      setLoadingBookings(true);
      setLoadingFeedbacks(true);
      setBookingsError(null);
      setFeedbacksError(null);

      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://13.48.125.242:8000/api/profilepage", {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data.user);
        setBookedTickets(data.bookings);
        setUserFeedbacks(data.feedbacks);

      } catch (err) {
        console.error("Error fetching user data:", err);
        if (err.message.includes('401') || err.message.includes('403')) {
          handleLogout();
        } else {
          setUserData(null);
          setBookingsError(`Failed to load data: ${err.message}`);
          setFeedbacksError(`Failed to load data: ${err.message}`);
        }
      } finally {
        setLoadingUser(false);
        setLoadingBookings(false);
        setLoadingFeedbacks(false);
      }
    };

    fetchAllUserData();
  }, [navigate]);

  // if(!isAuthenticated){
  //   navigate("/login");
  // }

  const allIndividualBookedTickets = bookedTickets ? bookedTickets.flatMap(eventBooking => eventBooking.bookings) : [];

  if (loadingUser) {
    return (
      <div className="centered-message">
        <p>Loading user data...</p>
      </div>
    );
  }

  if (userData === null && !loadingUser) {
    return (
      <div className="centered-message">
        <p>
          Failed to load user data or not logged in. Please{" "}
          <button
            onClick={() => navigate("/login")}
            className="inline-button"
          >
            log in
          </button>
          .
        </p>
      </div>
    );
  }

  return (
    isAuthenticated?(
    <div className="profilepage">
    <div className="profilepage-container">
      <div className="profilepage-main-container">
        <div className="profile-top-section">
          <div
            className="profile-card personal-info-card-override"
          >
            <div className="personal-info-content-wrapper">
              <div className="profile-icon-container">
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className="profile-icon"
                />
              </div>

              <div className="personal-info-details">
                <h2 className="card-header">Personal Information</h2>
                <p style={{ color: "#fff" }}>
                  <strong>Name:</strong> {userData.userName || "N/A"}
                </p>
                <p style={{ color: "#fff" }}>
                  <strong>Email:</strong> {userData.userEmail || "N/A"}
                </p>
                <p style={{ color: "#fff" }}>
                  <strong>Phone:</strong> {userData.userPhonenumber || "N/A"}
                </p>
                <button
                  className="logout-button"
                  onClick={() => {
                    console.log("Logging out...");
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bottom-section">
          <div className="profile-card bottom-card-layout">
            <div
              className="card-header-with-arrow"
              onClick={() => {
                console.log("Bookings header clicked!");
                setShowBookings(!showBookings);
              }}
            >
              <h2 className="card-header">My Bookings</h2>
              <FontAwesomeIcon
                icon={showBookings ? faChevronDown : faChevronRight}
                className="arrow-icon"
              />
            </div>
            {showBookings && (
              <div className="scrollable-content">
                {loadingBookings ? (
                  <p className="message-text">
                    Loading your bookings...
                  </p>
                ) : bookingsError ? (
                  <p className="message-text error">
                    Error: {bookingsError}
                  </p>
                ) : allIndividualBookedTickets.length === 0 ? (
                  <p className="message-text">
                    No tickets booked.
                  </p>
                ) : (
                  allIndividualBookedTickets.map((ticket) => (
                    <div
                      key={ticket._id}
                      className="booked-item-container"
                    >
                      <div className="item-line">
                        <p className="item-detail-text">
                          <strong>Event:</strong> {ticket.eventName}
                        </p>
                        <p className="item-detail-text">
                          <strong>Event Date:</strong> {moment(ticket.eventDate).format('YYYY-MM-DD')}
                        </p>
                      </div>

                      <div className="item-line">
                        <p className="item-detail-text">
                          <strong>Booking ID:</strong> {ticket._id}
                        </p>
                        <p className="item-detail-text">
                          <strong>Tickets:</strong> {ticket.numberOfTickets}
                        </p>
                        <p className="item-detail-text">
                          <strong>Booked On:</strong> {moment(ticket.bookingDate).format('YYYY-MM-DD')}
                        </p>
                        <div className="action-and-date-container">
                          <button
                            className="cancel-button"
                            onClick={() =>
                              handleCancelTicket(
                                ticket._id,
                                ticket.numberOfTickets,
                                ticket.eventId
                              )
                            }
                          >
                            Cancel Ticket
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="profile-card bottom-card-layout">
            <div
              className="card-header-with-arrow"
              onClick={() => {
                console.log("Feedbacks header clicked!");
                setShowFeedbacks(!showFeedbacks);
              }}
            >
              <h2 className="card-header">My Feedbacks</h2>
              <FontAwesomeIcon
                icon={showFeedbacks ? faChevronDown : faChevronRight}
                className="arrow-icon"
              />
            </div>
            {showFeedbacks && (
              <div className="scrollable-content">
                {loadingFeedbacks ? (
                  <p className="message-text">
                    Loading your feedbacks...
                  </p>
                ) : feedbacksError ? (
                  <p className="message-text error">
                    Error: {feedbacksError}
                  </p>
                ) : userFeedbacks.length === 0 ? (
                  <p className="message-text">
                    No feedbacks submitted yet.
                  </p>
                ) : (
                  userFeedbacks.map((feedback) => (
                    <div
                      key={feedback._id}
                      className="feedback-item-container"
                    >
                      <p className="feedback-item-text">
                        <strong>Event:</strong> {feedback.eventName}
                      </p>
                      <p className="feedback-item-text">
                        <strong>Rating:</strong>{" "}
                        {[...Array(5)].map((star, i) => (
                          <span
                            key={i}
                            className={i < feedback.rating ? "star-filled" : "star-empty"}
                          >
                            &#9733;
                          </span>
                        ))}
                      </p>
                      <p className="feedback-item-text">
                        <strong>Comments:</strong> {feedback.comments}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
    ):(
      navigate('/login')
    )
  );
};

export default ProfilePage;