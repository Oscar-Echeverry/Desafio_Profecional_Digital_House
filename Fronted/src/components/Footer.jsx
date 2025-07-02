import React from 'react';
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaInstagram } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-left">©2025 TripNest</div>
      <div className="footer-right">
        <a href="#" aria-label="Facebook"><FaFacebookF /></a>
        <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
        <a href="#" aria-label="Twitter"><FaTwitter /></a>
        <a href="#" aria-label="Instagram"><FaInstagram /></a>
      </div>
    </div>
  </footer>
);

export default Footer;
