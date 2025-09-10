import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer-main">
      <div className="footer-left">
        <div>
          <p>&copy; 2025 LoyaltyMethods. All rights reserved.</p>
        </div>
        <div>
          <a href="#privacy" >Privacy Policy</a>
          <span>|</span>
          <a href="#terms">Terms of Service</a>
        </div>
      </div>

      <div className="footer-right">
        <div>
          <p>Follow us on:</p>
        </div>
        <div>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebookF} /> facebook 
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} /> twitter
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} /> instagram
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
