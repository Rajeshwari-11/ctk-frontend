import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Notifications.css'; // Import the CSS file

function Notifications({ refreshTrigger }) {
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const notificationsRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate
  

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://13.48.125.242:8000/api/get-notification', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      // Check if new notifications have arrived based on count
      if (data.length > notifications.length) {
        setHasNewNotification(true);
      }
      setNotifications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [notifications.length]); // Add notifications.length to dependency array to re-run when its length changes

  useEffect(() => {
    fetchNotifications();
  }, [refreshTrigger, fetchNotifications]);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  // Handle clicking on a notification item
  const handleNotificationClick = (link) => {
    if (link) {
      setIsOpen(false); // Close notifications after clicking
      navigate(link); // Navigate to the specified link
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target) &&
        !event.target.closest('.notification-icon-container') // Use class to avoid issues with direct style attributes
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <div className="notification-icon-container" onClick={() => {
        toggleNotifications();
        setHasNewNotification(false); // Clear badge on open
      }}>
        <span className="notification-icon" role="img" aria-label="Notifications">🔔</span>
        {hasNewNotification && <span className="notification-badge"></span>}
      </div>

      {isOpen && (
        <div className="notifications-fixed-container" ref={notificationsRef}>
          <h2 className="notifications-title">Notifications</h2>
          <div className="notifications-list-container">
            {loading && <p className="notifications-loading">Loading...</p>}
            {error && <p className="notifications-error">{error}</p>}
            {!loading && !error && notifications.length === 0 && (
              <p className="no-notifications">No notifications.</p>
            )}
            <ul className="notifications-list">
              {notifications.map((notification, index) => (
                <li
                  key={notification.id || index}
                  className={`notification-list-item ${notification.link ? 'clickable-notification-item' : ''}`}
                  onClick={notification.link ? () => handleNotificationClick(notification.link) : null}
                >
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-timestamp">
                    {notification.timestamp
                      ? new Date(notification.timestamp).toLocaleString()
                      : 'No timestamp'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default Notifications;