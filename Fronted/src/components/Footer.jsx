import React from 'react';
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaInstagram } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-left">©2025 TripNest Oscar Echeverri</div>
      <div className="footer-right">
        <a href="https://www.facebook.com/oscar.echeverr"target="_blank"rel="noopener noreferrer"  aria-label="Facebook"><FaFacebookF /></a>
        <a href="https://www.linkedin.com/in/oscar-echeverri01/"target="_blank"rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
        <a href="https://x.com/OscarEcheverryP" target="_blank"rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
        <a href="https://www.instagram.com/oscar.echeverr/" aria-label="Instagram"><FaInstagram /></a>
      </div>
    </div>
  </footer>
);

export default Footer;
