import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DisplayEvents.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../utilities/AuthProvider";
 
const DisplayEvents = () => {
  const [events, setEvents] = useState([]);
  const [expiredEvents, setExpiredEvents] = useState([]);
  const [showExpired, setShowExpired] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 4; // 👈 change this number to how many you want per page
 
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://3.7.246.87:8000/api/getevents", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error("Error fetching upcoming events");
        }
        const data = await response.json();
        setEvents(data.upcomingEvents);
        setExpiredEvents(data.expiredEvents);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchEvents();
  }, []);
 
  const handleUpdateClick = (e, id) => {
    e.stopPropagation();
    navigate(`/updateEvent/${id}`);
  };
 
  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Do you want to delete this event?")) {
      fetch(`http://3.7.246.87:8000/api/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            console.log(response.json());
          }
          navigate("/event");
          navigate("/home");
        })
        .catch((error) => {
          console.error("Error deleting event:", error);
        });
    }
  };
 
  const handleEventClick = (e, id) => {
    e.stopPropagation();
    if (isAuthenticated) {
      navigate(`/event/${id}`);
    } else {
      navigate("/login");
    }
  };
 
  const toggleEventsDisplay = () => {
    setShowExpired(!showExpired);
    setCurrentPage(1); // reset to first page when toggling
  };
 
  // 🟢 Pagination logic
  const dataToShow = showExpired ? expiredEvents : events;
  const totalPages = Math.ceil(dataToShow.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const currentEvents = dataToShow.slice(startIndex, startIndex + eventsPerPage);
 
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
 
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
 
  return (
    <div className="displayevents">
      <div className="displayevents-main-container">
        <div className="display-content-wrapper">
          <div className="events-container">
            <div className="events-header">
              <h1 className="header-title">
                {showExpired ? "Expired Events" : "Upcoming Events"}
              </h1>
              <button
                className="expired-events-btn"
                type="submit"
                onClick={toggleEventsDisplay}
              >
                {showExpired ? "Show Upcoming Events" : "Show Expired Events"}
              </button>
            </div>
 
            <div className="event-grid">
              {currentEvents.length === 0 ? (
                <p>
                  {showExpired
                    ? "No Expired events available."
                    : "No Upcoming events available."}
                </p>
              ) : (
                currentEvents.map((event) => (
                  <div
                    key={event._id}
                    className="event-card"
                    onClick={(e) => handleEventClick(e, event._id)}
                  >
                    <div className="image-container">
                      <img
                        src={event.eventImage}
                        alt={event.eventName}
                        className="event-image"
                      />
                    </div>
                    <div className="details-container">
                      <p>
                        <strong>{event.eventName}</strong>
                      </p>
                      <p>
                        Date: {new Date(event.eventDate).toLocaleDateString()}
                      </p>
                      <p>Time: {event.eventTime}</p>
                      <p>Location: {event.eventLocation}</p>
                      <p>Ticket Price: ₹{event.eventTicketPrice}</p>
                      {isAdmin && (
                        <div className="admin-event-actions">
                          <button
                            className="update-event-btn"
                            onClick={(e) => handleUpdateClick(e, event._id)}
                          >
                            <FontAwesomeIcon icon={faEdit} className="me-1" />
                            Update
                          </button>
                          <button
                            className="delete-event-btn"
                            onClick={(e) => handleDeleteClick(e, event._id)}
                          >
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              className="me-1"
                            />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
 
            {/* 🟢 Pagination Controls */}
            {dataToShow.length > eventsPerPage && (
              <div className="pagination">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Prev
                </button>
                <span className="page-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default DisplayEvents;