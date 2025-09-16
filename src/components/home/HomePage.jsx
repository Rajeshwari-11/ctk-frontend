import React, { useState, useEffect } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utilities/AuthProvider';
import Footer from '../utilities/Footer';
// import colab1 from "../../assets";

const HomePage = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 4;

  useEffect(() => {
    fetch('http://3.7.246.87:8000/api/getevents', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("error")
        }
        return response.json()
      })
      .then((data) => {
        setEvents(data.upcomingEvents || []);
      })
  }, []);

  // const handleFetchUsers = () => {
  //   fetch('http://3.7.246.87:8000/api/get-users', {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
  //     },
  //   })
  //     .then((res) => {
  //       if (!res.ok) throw new Error('Failed to fetch users');
  //       return res.json();
  //     })
  //     .then((data) => {
  //       setUsers(data.users || []);
  //       setShowUsers(true); // show after fetching
  //     })
  //     .catch((err) => console.error(err));
  // };

  const handleEventClick = (id) => {
    // console.log(id);
    if (isAuthenticated) {
      navigate(`/event/${id}`);
    } else {
      navigate('/login');
    }
  };

  const handleMoreEvents = () => {
    navigate(`/events`);
  };

  // pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <>
      <div className="homepage-wrapper">
        <div className="homepage-content-scroller">
          <div className="homepage-header">
            <div className="homepage-heading">CTK Events</div>
            <div className="homepage-subheading">
              Discover the most elegant events happening around you.
            </div>
          </div>

          {isAdmin && (
            <div className="homepage-admin-container">
              <div className="homepage-admin-card">
                <h2 className="homepage-admin-heading">
                  Unleash the Excitement!
                </h2>
                <p className="homepage-admin-subheading">
                  Your platform is ready for dazzling new experiences.
                  <br />
                  It's time to <strong>bring your vision to life</strong> by crafting an unforgettable event.
                </p>
                <p className="homepage-admin-text">
                  Every great gathering starts with a single click.
                  <br />
                  What incredible event will you create today?
                </p>
                <a
                  href='/createEvent'
                  className="homepage-admin-button"
                  onClick={() => {
                    console.log('Navigate to Create Event page!');
                  }}
                >
                  Create New Event
                </a>
              </div>
              
            </div>
          )}

          {showUsers && (
            <div className="homepage-users-container">
              <button
                className="users-close-button"
                onClick={() => setShowUsers(false)}
              >
                ✖
              </button>
              <h2>Users List</h2>
              {users.length === 0 ? (
                <p>No users found.</p>
              ) : (
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
              )}
            </div>
          )}

          <div className="homepage-collaborations">
            <div className="homepage-vision">
              <h2>Our Vision</h2>
              <p>
                To be the leading platform for discovering and experiencing exceptional events,
                fostering connections and enriching lives through memorable experiences.
              </p>
            </div>

            <div className="homepage-collabs">
              <h2 className="text-center">Collaborations</h2>
              <div className="homepage-collabs-logos">
                <div className="imageDiv"><img src={"src/assets/colab4.png"} alt="Logo 1" /></div>
                <div className="imageDiv"><img src={"src/assets/colab1.png"} alt="Logo 2" /></div>
                <div className="imageDiv"><img src={"src/assets/colab2.png"} alt="Logo 3" /></div>
                <div className="imageDiv"><img src={'src/assets/colab3.png'} alt="Logo 4" /></div>
              </div>
            </div>
          </div>

          <div className="homepage-events">
            <h2 className="homepage-eventheading">Upcoming Events</h2>
            {events.length === 0 ? (
              <p>No events available.</p>
            ) : (
              <>
                <div className="homepage-eventgrid">
                  {currentEvents.map((event) => (
                    <div
                      key={event._id}
                      className="homepage-eventcard"
                      onClick={() => handleEventClick(event._id)}
                    >
                      <div className="homepage-eventcard-container">
                        <img
                          src={event.eventImage}
                          alt={event.eventName}
                          className="homepage-eventcard-img"
                        />
                      </div>
                      <div className="homepage-eventcard-detail">
                        <p><strong>{event.eventName}</strong></p>
                        <p>Date: {new Date(event.eventDate).toLocaleDateString()}</p>
                        <p>Time: {event.eventTime}</p>
                        <p>Location: {event.eventLocation}</p>
                        <p>Ticket Price: ₹{event.eventTicketPrice}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination controls */}
                <div className="homepage-pagination">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    ⬅ Prev
                  </button>
                  <span className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Next ➡
                  </button>
                </div>
              </>
            )}
          </div>

          <button type="submit" className="homepage-moreeventsBtn" onClick={handleMoreEvents}>
            More events...
          </button>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
