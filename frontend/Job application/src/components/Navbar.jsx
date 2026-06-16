import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const [prepOpen, setPrepOpen] = useState(false);

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

          {/* Preparation Dropdown */}
          <div 
            className={`nav-dropdown ${prepOpen ? 'active' : ''}`}
            onMouseEnter={() => {
              if (window.innerWidth > 768) setPrepOpen(true);
            }}
            onMouseLeave={() => {
              if (window.innerWidth > 768) setPrepOpen(false);
            }}
          >
            <button 
              className="nav-dropdown-trigger"
              onClick={(e) => {
                e.preventDefault();
                setPrepOpen(!prepOpen);
              }}
            >
              Preparation <span className="chevron-down">{prepOpen ? '▲' : '▼'}</span>
            </button>
            <div className={`nav-dropdown-menu ${prepOpen ? 'mobile-show' : ''}`}>
              <Link to="/preparation/aptitude" className="nav-dropdown-item" onClick={() => { setPrepOpen(false); setMenuOpen(false); }}>
                <span className="nav-dropdown-icon">🔢</span>
                <div className="nav-dropdown-info">
                  <span className="nav-dropdown-title">Aptitude</span>
                  <span className="nav-dropdown-desc">Quantitative & logical reasoning</span>
                </div>
              </Link>
              <Link to="/preparation/dsa" className="nav-dropdown-item" onClick={() => { setPrepOpen(false); setMenuOpen(false); }}>
                <span className="nav-dropdown-icon">🌳</span>
                <div className="nav-dropdown-info">
                  <span className="nav-dropdown-title">DSA</span>
                  <span className="nav-dropdown-desc">Data structures & algorithms</span>
                </div>
              </Link>
              <Link to="/preparation/oops" className="nav-dropdown-item" onClick={() => { setPrepOpen(false); setMenuOpen(false); }}>
                <span className="nav-dropdown-icon">🧱</span>
                <div className="nav-dropdown-info">
                  <span className="nav-dropdown-title">OOPs Concepts</span>
                  <span className="nav-dropdown-desc">Object-oriented paradigms</span>
                </div>
              </Link>
              <Link to="/preparation/dbms" className="nav-dropdown-item" onClick={() => { setPrepOpen(false); setMenuOpen(false); }}>
                <span className="nav-dropdown-icon">🗄️</span>
                <div className="nav-dropdown-info">
                  <span className="nav-dropdown-title">DBMS</span>
                  <span className="nav-dropdown-desc">Database fundamentals & ACID</span>
                </div>
              </Link>
              <Link to="/preparation/computernetwork" className="nav-dropdown-item" onClick={() => { setPrepOpen(false); setMenuOpen(false); }}>
                <span className="nav-dropdown-icon">🌐</span>
                <div className="nav-dropdown-info">
                  <span className="nav-dropdown-title">Computer Networks</span>
                  <span className="nav-dropdown-desc">OSI layers, TCP/IP & protocols</span>
                </div>
              </Link>
              <Link to="/preparation/sql" className="nav-dropdown-item" onClick={() => { setPrepOpen(false); setMenuOpen(false); }}>
                <span className="nav-dropdown-icon">💾</span>
                <div className="nav-dropdown-info">
                  <span className="nav-dropdown-title">SQL Questions</span>
                  <span className="nav-dropdown-desc">Important queries & commands</span>
                </div>
              </Link>
            </div>
          </div>

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