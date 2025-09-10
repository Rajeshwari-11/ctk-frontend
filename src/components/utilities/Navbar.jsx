import React, { useState, useEffect, useRef, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import Notifications from './Notifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faInbox, faInfoCircle, faCalendarAlt, faEnvelope, faSignOutAlt, faSignInAlt, faUserPlus, faUser, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { NotificationContext } from '../utilities/NotificationsContext';
import './Navbar.css'; // Import the new CSS file

const Navbar = () => {
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const [showVerticalNavText, setShowVerticalNavText] = useState(false);
  const { refreshTrigger } = useContext(NotificationContext);
  const verticalNavbarRef = useRef(null);
  const hamburgerRef = useRef(null);
  const navigate = useNavigate();

  const toggleVerticalNav = () => {
    setShowVerticalNavText(!showVerticalNavText);
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showVerticalNavText &&
        verticalNavbarRef.current &&
        !verticalNavbarRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setShowVerticalNavText(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showVerticalNavText]);

  const handleLogout = () => {
    logout();
    navigate('/login')
  };

  const handleProfileClick = () => {
    navigate('/profile'); // Navigate to the profile page
  };

  return (
    <>
      {/* Horizontal Navbar */}
      <nav className="top-navbar">
        <div className="top-navbar-container">
          <div className="top-navbar-left">
            {/* Hamburger Button */}
            <button
              className="hamburger-button"
              onClick={toggleVerticalNav}
              ref={hamburgerRef}
              aria-label="Toggle Navigation"
              title="Toggle Navigation"
            >
              <span className="hamburger-icon-bar"></span>
              <span className="hamburger-icon-bar"></span>
              <span className="hamburger-icon-bar"></span>
            </button>
            <NavLink to="/home" className="top-navbar-brand">
              <span className="logo">CTK EVENTS</span>
            </NavLink>
          </div>

          {/* Horizontal Navbar Links (Right) */}
          <div className="top-navbar-right">
            {isAuthenticated ? (
              <>
                <button className="icon-button" onClick={handleProfileClick}
                  aria-label="Profile" title="Profile"> {/* Tooltip for profile */}
                  <FontAwesomeIcon icon={faUser} className="navbar-top-icon" />
                </button>
                <div>
                  <Notifications refreshTrigger={refreshTrigger} />
                </div>
                <div>
                  <button className="nav-button" onClick={handleLogout}
                    aria-label="Logout" title="Logout"> {/* Tooltip for logout */}
                    <FontAwesomeIcon icon={faSignOutAlt} className="navbar-top-icon" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="me-3">
                  <NavLink to="/login" className={({ isActive }) => isActive ? "top-nav-link active-top" : "top-nav-link"}
                    title="Login"> {/* Tooltip for login */}
                    <FontAwesomeIcon icon={faSignInAlt} className="navbar-top-icon" />
                    Login
                  </NavLink>
                </div>
                <div className="me-2">
                  <NavLink to="/signup" className={({ isActive }) => isActive ? "top-nav-link active-top" : "top-nav-link"}
                    title="Sign Up"> {/* Tooltip for sign up */}
                    <FontAwesomeIcon icon={faUserPlus} className="navbar-top-icon" />
                    Sign Up
                  </NavLink>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Vertical Navbar */}
      <nav
        className={`vertical-navbar ${showVerticalNavText ? 'expanded' : 'collapsed'}`}
        ref={verticalNavbarRef}
      >
        <ul className="vertical-nav-list">
          <li className="nav-item vertical-nav-item">
            <NavLink to="/home" className={({ isActive }) => isActive ? "vertical-nav-link active-vertical" : "vertical-nav-link"}>
              <FontAwesomeIcon icon={faHome} className="navbar-icon" />
              <span className={`nav-text ${showVerticalNavText ? 'visible' : 'hidden'}`}>Home</span>
              <span className="tooltip-text">Home</span>
            </NavLink>
          </li>
          <li className="nav-item vertical-nav-item">
            <NavLink to="/about" className={({ isActive }) => isActive ? "vertical-nav-link active-vertical" : "vertical-nav-link"}>
              <FontAwesomeIcon icon={faInfoCircle} className="navbar-icon" />
              <span className={`nav-text ${showVerticalNavText ? 'visible' : 'hidden'}`}>About</span>
              <span className="tooltip-text">About</span>
            </NavLink>
          </li>
          <li className="nav-item vertical-nav-item">
            <NavLink to="/events" className={({ isActive }) => isActive ? "vertical-nav-link active-vertical" : "vertical-nav-link"}>
              <FontAwesomeIcon icon={faCalendarAlt} className="navbar-icon" />
              <span className={`nav-text ${showVerticalNavText ? 'visible' : 'hidden'}`}>Events</span>
              <span className="tooltip-text">Events</span>
            </NavLink>
          </li>
          <li className="nav-item vertical-nav-item">
            <NavLink to="/faq" className={({ isActive }) => isActive ? "vertical-nav-link active-vertical" : "vertical-nav-link"}>
              <FontAwesomeIcon icon={faQuestionCircle} className="navbar-icon" />
              <span className={`nav-text ${showVerticalNavText ? 'visible' : 'hidden'}`}>FAQs</span>
              <span className="tooltip-text">FAQs</span>
            </NavLink>
          </li>
          {isAuthenticated ? ( // Check if isAuthenticated is true first
            isAdmin ? ( // If authenticated AND isAdmin is true, show Inbox
              <>
                <li className="nav-item vertical-nav-item">
                  <NavLink to="/Inbox" className={({ isActive }) => isActive ? "vertical-nav-link active-vertical" : "vertical-nav-link"}>
                    <FontAwesomeIcon icon={faInbox} className="navbar-icon" />
                    <span className={`nav-text ${showVerticalNavText ? "visible" : "hidden"}`}>Inbox</span>
                    <span className="tooltip-text">Inbox</span>
                  </NavLink>
                </li>
                <li className="nav-item vertical-nav-item">
                  <button className="vertical-nav-link nav-button" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="navbar-icon" />
                    <span className={`nav-text ${showVerticalNavText ? 'visible' : 'hidden'}`}>Logout</span>
                    <span className="tooltip-text">Logout</span>
                  </button>
                </li>

              </>


            ) : ( 
              <>
                <li className="nav-item vertical-nav-item">
                  <NavLink to="/contact" className={({ isActive }) => isActive ? "vertical-nav-link active-vertical" : "vertical-nav-link"}>
                    <FontAwesomeIcon icon={faEnvelope} className="navbar-icon" />
                    <span className={`nav-text ${showVerticalNavText ? "visible" : "hidden"}`}>Contact Us</span>
                    <span className="tooltip-text">Contact Us</span>
                  </NavLink>
                </li>
                <li className="nav-item vertical-nav-item">
                  <button className="vertical-nav-link nav-button" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="navbar-icon" />
                    <span className={`nav-text ${showVerticalNavText ? 'visible' : 'hidden'}`}>Logout</span>
                    <span className="tooltip-text">Logout</span>
                  </button>
                </li>
              </>
            )
          ) : (
            <>
              <li className="nav-item vertical-nav-item">
                <NavLink to="/login" className={({ isActive }) => isActive ? "vertical-nav-link active-vertical" : "vertical-nav-link"}>
                  <FontAwesomeIcon icon={faSignInAlt} className="navbar-icon" />
                  <span className={`nav-text ${showVerticalNavText ? 'visible' : 'hidden'}`}>Login</span>
                  <span className="tooltip-text">Login</span>
                </NavLink>
              </li>
              <li className="nav-item vertical-nav-item">
                <NavLink to="/signup" className={({ isActive }) => isActive ? "vertical-nav-link active-vertical" : "vertical-nav-link"}>
                  <FontAwesomeIcon icon={faUserPlus} className="navbar-icon" />
                  <span className={`nav-text ${showVerticalNavText ? 'visible' : 'hidden'}`}>Sign Up</span>
                  <span className="tooltip-text">Sign Up</span>
                </NavLink>
              </li>
            </>
          )}
      </ul>
    </nav >
    </>
  );
};

export default Navbar;