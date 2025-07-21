import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h2 className="footer-brand">FinanceTrackr</h2>
            <p className="footer-tagline">
              Empowering you to take control of your money. Track your expenses, set goals, and grow your wealth.
            </p>
          </div>
          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-list">
              <li><a href="/">Dashboard</a></li>
              <li><a href="/reports">Reports</a></li>
              <li><a href="/budget">Budget Planner</a></li>
              <li><a href="/settings">Settings</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3 className="footer-heading">Resources</h3>
            <ul className="footer-list">
              <li><a href="/blog">Blog</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/support">Support</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3 className="footer-heading">Stay Updated</h3>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Your email address"
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-button">Subscribe</button>
            </form>
          </div>
        </div>
        <hr className="footer-divider" />
        <div className="footer-bottom">
          <p>© 2025 FinanceTrackr. All rights reserved.</p>
          <div className="social-icons">
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
}