import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ navItems, activeTab, onTabChange, children, title, subtitle, headerAction }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out!');
  };

  const getInitials = (name = '') =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const roleColors = {
    candidate: 'var(--accent-purple)',
    company: 'var(--accent-teal)',
    admin: 'var(--accent-orange)',
  };

  return (
    <div className="ds-shell">
      {/* Mobile Overlay */}
      <div
        className={`ds-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ===== SIDEBAR ===== */}
      <aside className={`ds-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div className="ds-brand">
          <Link to="/" className="ds-brand-link">
            <div className="ds-brand-icon">💼</div>
            <div className="ds-brand-text">
              <span className="ds-brand-name">JobPortal</span>
              <span className="ds-brand-tagline">Find your dream job</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="ds-nav">
          <p className="ds-nav-label">MENU</p>
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`ds-nav-item ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => {
                onTabChange(item.key);
                setSidebarOpen(false);
              }}
            >
              <span className="ds-nav-icon">{item.icon}</span>
              <span className="ds-nav-text">{item.label}</span>
              {activeTab === item.key && <span className="ds-nav-pip" />}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer — User + Logout */}
        <div className="ds-sidebar-footer">
          <div className="ds-user-card">
            <div
              className="ds-user-avatar"
              style={{ background: roleColors[user?.role] || 'var(--primary)' }}
            >
              {getInitials(user?.name)}
            </div>
            <div className="ds-user-info">
              <p className="ds-user-name">{user?.name}</p>
              <p className="ds-user-role">{user?.role}</p>
            </div>
          </div>
          <button className="ds-logout-btn" onClick={handleLogout}>
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* ===== MAIN AREA ===== */}
      <div className="ds-main">
        {/* Topbar */}
        <header className="ds-topbar">
          <div className="ds-topbar-left">
            <button
              className="ds-hamburger"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <span /><span /><span />
            </button>
            <div className="ds-topbar-title-wrap">
              <h1 className="ds-topbar-title">{title}</h1>
              {subtitle && <p className="ds-topbar-subtitle">{subtitle}</p>}
            </div>
          </div>
          {headerAction && <div className="ds-topbar-action">{headerAction}</div>}
        </header>

        {/* Content */}
        <main className="ds-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
