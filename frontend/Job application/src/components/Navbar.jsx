import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (user?.role === 'candidate') return '/candidate-dashboard';
    if (user?.role === 'company') return '/company-dashboard';
    if (user?.role === 'admin') return '/admin-dashboard';
    return '/';
  };

  const handleLogoClick = (e) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link
          to="/"
          className="nav-logo"
          onClick={handleLogoClick}
        >
          💼 JobPortal
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/jobs" onClick={() => setMenuOpen(false)}>
            Browse Jobs
          </Link>

          {!user ? (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>

              <Link
                to="/register/candidate"
                className="btn-primary-1"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to={getDashboardLink()}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>

              <span className="nav-user">
                👤 {user.name}
              </span>

              <button
                className="btn-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;