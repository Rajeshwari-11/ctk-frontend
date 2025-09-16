import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useAuth } from "./AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronDown, faUserCircle } from "@fortawesome/free-solid-svg-icons";
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

  // For admin
  const [showUsers, setShowUsers] = useState(false);
  const [users, setUsers] = useState([]);

  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/login");
    }
  };

  const handleCancelTicket = useCallback(
    async (bookingId) => {
      const confirmCancel = window.confirm("Are you sure you want to cancel this ticket?");
      if (!confirmCancel) return;

      try {
        const response = await fetch(`http://3.7.246.87:8000/api/cancelticket/${bookingId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Failed to parse error response" }));
          throw new Error(errorData.message || `Cancellation failed! Status: ${response.status}`);
        }

        setBookedTickets((prev) =>
          prev
            .map((group) => ({
              ...group,
              bookings: group.bookings.filter((t) => t._id !== bookingId),
            }))
            .filter((g) => g.bookings.length > 0)
        );

        alert("Ticket cancelled successfully ✅");
      } catch (err) {
        console.error("Error cancelling ticket:", err.message);
        alert(`Error cancelling ticket: ${err.message}`);
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

        const response = await fetch("http://3.7.246.87:8000/api/profilepage", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Failed to parse error response" }));
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data.user);
        setBookedTickets(data.bookings);
        setUserFeedbacks(data.feedbacks);
      } catch (err) {
        console.error("Error fetching user data:", err);
        if (err.message.includes("401") || err.message.includes("403")) {
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

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch("http://3.7.246.87:8000/api/get-users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Error fetching users");
    }
  };

  const allIndividualBookedTickets = bookedTickets
    ? bookedTickets.flatMap((eventBooking) => eventBooking.bookings)
    : [];

  if (loadingUser) {
    return;
  }

  if (userData === null && !loadingUser) {
    return (
      <div className="centered-message">
        <p>
          Failed to load user data or not logged in. Please{" "}
          <button onClick={() => navigate("/login")} className="inline-button">
            log in
          </button>
          .
        </p>
      </div>
    );
  }

  return isAuthenticated ? (
    <div className="profilepage">
      <div className="profilepage-container">
        <div className="profilepage-main-container">
          <div className="profile-top-section">
            <div className="profile-card personal-info-card-override">
              <div className="personal-info-content-wrapper">
                <div className="profile-icon-container">
                  <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
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

                  {/* Buttons */}
                  <div className="button-stack">
                    {/* <button className="profile-action-button" onClick={handleLogout}>
                      Logout
                    </button> */}

                    {isAdmin && (
                      <button
                        className="profile-action-button"
                        onClick={() => {
                          if (!showUsers) fetchUsers();
                          setShowUsers(!showUsers);
                        }}
                      >
                        {showUsers ? "Hide Users" : "Display Users"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!isAdmin && (
            <div className="bottom-section">
              {/* Bookings */}
              <div className="profile-card bottom-card-layout">
                <div
                  className="card-header-with-arrow"
                  onClick={() => setShowBookings(!showBookings)}
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
                      <p className="message-text">Loading your bookings...</p>
                    ) : bookingsError ? (
                      <p className="message-text error">Error: {bookingsError}</p>
                    ) : allIndividualBookedTickets.length === 0 ? (
                      <p className="message-text">No tickets booked.</p>
                    ) : (
                      allIndividualBookedTickets.map((ticket) => (
                        <div key={ticket._id} className="booked-item-container">
                          <div className="item-line">
                            <p className="item-detail-text">
                              <strong>Event:</strong> {ticket.eventName}
                            </p>
                            <p className="item-detail-text">
                              <strong>Event Date:</strong>{" "}
                              {moment(ticket.eventDate).format("YYYY-MM-DD")}
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
                              <strong>Booked On:</strong>{" "}
                              {moment(ticket.bookingDate).format("YYYY-MM-DD")}
                            </p>
                            <div className="action-and-date-container">
                              <button
                                className="cancel-button"
                                onClick={() => handleCancelTicket(ticket._id)}
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

              {/* Feedbacks */}
              <div className="profile-card bottom-card-layout">
                <div
                  className="card-header-with-arrow"
                  onClick={() => setShowFeedbacks(!showFeedbacks)}
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
                      <p className="message-text">Loading your feedbacks...</p>
                    ) : feedbacksError ? (
                      <p className="message-text error">Error: {feedbacksError}</p>
                    ) : userFeedbacks.length === 0 ? (
                      <p className="message-text">No feedbacks submitted yet.</p>
                    ) : (
                      userFeedbacks.map((feedback) => (
                        <div key={feedback._id} className="feedback-item-container">
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
          )}

          {/* Users list for admin */}
          {isAdmin && showUsers && (
            <div className="profile-card bottom-card-layout" style={{ marginTop: "20px" }}>
              <div className="users-header">
                <h2 className="card-header">Users List</h2>
                <button className="users-close-button" onClick={() => setShowUsers(false)}>
                  X
                </button>
              </div>
              {users.length === 0 ? (
                <p>No users found.</p>
              ) : (
                <div className="users-table-container">
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td>{user.userName}</td>
                          <td>{user.userEmail}</td>
                          <td>{user.userPhonenumber}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    navigate("/login")
  );
};

export default ProfilePage;
