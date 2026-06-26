import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const [academyOpen, setAcademyOpen] = useState(false);
  const [careersOpen, setCareersOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [prepOpen, setPrepOpen] = useState(false);
  
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const closeAll = () => {
    setMenuOpen(false);
    setAcademyOpen(false);
    setCareersOpen(false);
    setProfileOpen(false);
    setPrepOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    closeAll();
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
    closeAll();
  };

  return (
    <nav className={`navbar ${isVisible ? '' : 'navbar-hidden'}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={handleLogoClick}>
          💼 NextHire
        </Link>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          
          {/* Academy Dropdown */}
          <div 
            className={`nav-dropdown ${academyOpen ? 'active' : ''}`}
            onMouseEnter={() => { if (window.innerWidth > 768) setAcademyOpen(true); }}
            onMouseLeave={() => { if (window.innerWidth > 768) setAcademyOpen(false); }}
          >
            <button className="nav-dropdown-trigger" onClick={(e) => { e.preventDefault(); setAcademyOpen(!academyOpen); }}>
              Academy <span className="chevron-down">{academyOpen ? '▲' : '▼'}</span>
            </button>
            <div className={`nav-dropdown-menu ${academyOpen ? 'mobile-show' : ''}`}>
              <Link to="/academy" className="nav-dropdown-item" onClick={closeAll}>
                <span className="nav-dropdown-icon">🎓</span>
                <div className="nav-dropdown-info">
                  <span className="nav-dropdown-title">Full Courses</span>
                  <span className="nav-dropdown-desc">Premium learning paths</span>
                </div>
              </Link>
              <Link to="/mentors" className="nav-dropdown-item" onClick={closeAll}>
                <span className="nav-dropdown-icon">🤝</span>
                <div className="nav-dropdown-info">
                  <span className="nav-dropdown-title">Find a Mentor</span>
                  <span className="nav-dropdown-desc">1-on-1 career guidance</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Preparation Dropdown */}
          <div 
            className={`nav-dropdown ${prepOpen ? 'active' : ''}`}
            onMouseEnter={() => { if (window.innerWidth > 768) setPrepOpen(true); }}
            onMouseLeave={() => { if (window.innerWidth > 768) setPrepOpen(false); }}
          >
            <button className="nav-dropdown-trigger" onClick={(e) => { e.preventDefault(); setPrepOpen(!prepOpen); }}>
              Preparation <span className="chevron-down">{prepOpen ? '▲' : '▼'}</span>
            </button>
            <div className={`nav-dropdown-menu ${prepOpen ? 'mobile-show' : ''}`}>
              <Link to="/preparation/dsa" className="nav-dropdown-item" onClick={closeAll}>
                <span className="nav-dropdown-icon">🌳</span>
                <div className="nav-dropdown-info">
                  <span className="nav-dropdown-title">DSA</span>
                  <span className="nav-dropdown-desc">Data structures & algorithms</span>
                </div>
              </Link>
              <Link to="/preparation/aptitude" className="nav-dropdown-item" onClick={closeAll}>
                <span className="nav-dropdown-icon">🔢</span>
                <div className="nav-dropdown-info">
                  <span className="nav-dropdown-title">Aptitude</span>
                  <span className="nav-dropdown-desc">Quantitative & logic</span>
                </div>
              </Link>
              <Link to="/preparation/oops" className="nav-dropdown-item" onClick={closeAll}>
                <span className="nav-dropdown-icon">🧱</span>
                <div className="nav-dropdown-info">
                  <span className="nav-dropdown-title">OOPs Concepts</span>
                  <span className="nav-dropdown-desc">Object-oriented paradigms</span>
                </div>
              </Link>
              <Link to="/preparation/dbms" className="nav-dropdown-item" onClick={closeAll}>
                <span className="nav-dropdown-icon">🗄️</span>
                <div className="nav-dropdown-info">
                  <span className="nav-dropdown-title">DBMS & SQL</span>
                  <span className="nav-dropdown-desc">Databases and queries</span>
                </div>
              </Link>
              <Link to="/preparation/computernetwork" className="nav-dropdown-item" onClick={closeAll}>
                <span className="nav-dropdown-icon">🌐</span>
                <div className="nav-dropdown-info">
                  <span className="nav-dropdown-title">Computer Networks</span>
                  <span className="nav-dropdown-desc">OSI layers & protocols</span>
                </div>
              </Link>
            </div>
          </div>

          <Link to="/jobs" className="nav-dropdown-item" style={{ padding: '0.65rem 1rem', fontWeight: 600, color: 'var(--text)' }} onClick={closeAll}>
            Browse Jobs
          </Link>
          <Link to="/ats-scanner" className="nav-highlight-link" onClick={closeAll} style={{ padding: '0.5rem 1rem', color: 'var(--primary)', fontWeight: 700, background: '#eef2ff', borderRadius: '8px' }}>
            ✨ ATS Scanner
          </Link>

          {/* User Auth Section */}
          {!user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
              <Link to="/login" onClick={closeAll} style={{ fontWeight: 600, color: 'var(--text)' }}>
                Login
              </Link>
              <Link to="/register/candidate" className="btn-primary-1" onClick={closeAll}>
                Register
              </Link>
            </div>
          ) : (
            <div 
              className={`nav-dropdown ${profileOpen ? 'active' : ''}`}
              onMouseEnter={() => { if (window.innerWidth > 768) setProfileOpen(true); }}
              onMouseLeave={() => { if (window.innerWidth > 768) setProfileOpen(false); }}
              style={{ marginLeft: 'auto' }}
            >
              <button className="nav-dropdown-trigger" onClick={(e) => { e.preventDefault(); setProfileOpen(!profileOpen); }}>
                👤 {user.name} {user.isPremium && <span style={{ background: 'linear-gradient(to right, #6366f1, #a855f7)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', marginLeft: '4px' }}>PRO</span>} <span className="chevron-down">{profileOpen ? '▲' : '▼'}</span>
              </button>
              <div className={`nav-dropdown-menu ${profileOpen ? 'mobile-show' : ''}`}>
                <Link to={getDashboardLink()} className="nav-dropdown-item" onClick={closeAll}>
                  <span className="nav-dropdown-icon">📊</span>
                  <div className="nav-dropdown-info">
                    <span className="nav-dropdown-title">My Dashboard</span>
                    <span className="nav-dropdown-desc">Manage your profile</span>
                  </div>
                </Link>
                <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 1rem' }} />
                <button className="nav-dropdown-item" onClick={handleLogout} style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                  <span className="nav-dropdown-icon">🚪</span>
                  <div className="nav-dropdown-info">
                    <span className="nav-dropdown-title" style={{ color: '#ef4444' }}>Logout</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;