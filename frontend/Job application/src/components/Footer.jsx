import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <h2>💼 NextHire</h2>
            <p>Connecting talented candidates with top companies across India. Your career journey starts here.</p>
          </div>

          {/* Job Seekers */}
          <div className="footer-col">
            <h4>Job Seekers</h4>
            <ul>
              <li><Link to="/register/candidate">Create Account</Link></li>
              <li><Link to="/jobs">Browse Jobs</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/candidate-dashboard">My Applications</Link></li>
            </ul>
          </div>

          {/* Employers */}
          <div className="footer-col">
            <h4>Employers</h4>
            <ul>
              <li><Link to="/register/company">Register Company</Link></li>
              <li><Link to="/post-job">Post a Job</Link></li>
              <li><Link to="/company-dashboard">Dashboard</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li>📧 support@nexthire.com</li>
              <li>📞 +91 9797925921</li>
              <li>📍 jammu, India</li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} NextHire. All rights reserved.</p>
          <div className="footer-links">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Admin: <Link to="/login">Login</Link></span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
