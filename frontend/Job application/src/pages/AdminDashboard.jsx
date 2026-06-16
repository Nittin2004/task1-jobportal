import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  getAdminStats,
  getAllCandidates,
  getAllCompanies,
  getAllJobs,
  getAllApplications,
  adminDeleteCandidate,
  adminDeleteJob,
  adminDeleteCompany,
} from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

const statusClass = {
  Pending: 'badge-pending',
  Reviewed: 'badge-reviewed',
  Shortlisted: 'badge-shortlisted',
  Rejected: 'badge-rejected',
  Hired: 'badge-hired',
};

const NAV_ITEMS = [
  { key: 'stats',        icon: '📊', label: 'Overview' },
  { key: 'candidates',   icon: '👤', label: 'Candidates' },
  { key: 'companies',    icon: '🏢', label: 'Companies' },
  { key: 'jobs',         icon: '💼', label: 'Jobs' },
  { key: 'applications', icon: '📋', label: 'Applications' },
];

const AdminDashboard = () => {
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [appPage, setAppPage] = useState(1);
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('All');
  const APP_PER_PAGE = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, candidatesRes, companiesRes, jobsRes, appsRes] = await Promise.all([
          getAdminStats(),
          getAllCandidates(),
          getAllCompanies(),
          getAllJobs(),
          getAllApplications(),
        ]);
        setStats(statsRes.data);
        setCandidates(candidatesRes.data);
        setCompanies(companiesRes.data);
        setJobs(jobsRes.data);
        setApplications(appsRes.data);
      } catch {
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteCandidate = async (id) => {
    if (!window.confirm('Delete this candidate?')) return;
    try {
      await adminDeleteCandidate(id);
      setCandidates((prev) => prev.filter((c) => c._id !== id));
      toast.success('Candidate deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await adminDeleteJob(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      toast.success('Job deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleDeleteCompany = async (id) => {
    if (!window.confirm('Delete this company?')) return;
    try {
      await adminDeleteCompany(id);
      setCompanies((prev) => prev.filter((c) => c._id !== id));
      toast.success('Company deleted');
    } catch { toast.error('Failed to delete company'); }
  };

  if (loading) return (
    <div className="ds-page-loader">
      <div className="ds-spinner" />
      <p>Loading admin dashboard...</p>
    </div>
  );

  return (
    <DashboardLayout
      navItems={NAV_ITEMS}
      activeTab={tab}
      onTabChange={setTab}
      title="⚙️ Admin Dashboard"
      subtitle="Manage all users, jobs, and applications"
    >
      {/* ===== OVERVIEW / STATS ===== */}
      {tab === 'stats' && (
        <div>
          <div className="ds-stats-grid">
            <div className="ds-stat-card" style={{ '--accent': '#6366f1' }}>
              <div className="ds-stat-icon" style={{ background: 'rgba(99,102,241,0.12)', color: '#6366f1' }}>👤</div>
              <div className="ds-stat-body">
                <div className="ds-stat-num">{stats?.totalCandidates}</div>
                <div className="ds-stat-lbl">Total Candidates</div>
              </div>
            </div>
            <div className="ds-stat-card" style={{ '--accent': '#10b981' }}>
              <div className="ds-stat-icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>🏢</div>
              <div className="ds-stat-body">
                <div className="ds-stat-num">{stats?.totalCompanies}</div>
                <div className="ds-stat-lbl">Total Companies</div>
              </div>
            </div>
            <div className="ds-stat-card" style={{ '--accent': '#f59e0b' }}>
              <div className="ds-stat-icon" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>💼</div>
              <div className="ds-stat-body">
                <div className="ds-stat-num">{stats?.totalJobs}</div>
                <div className="ds-stat-lbl">Total Jobs</div>
              </div>
            </div>
            <div className="ds-stat-card" style={{ '--accent': '#06b6d4' }}>
              <div className="ds-stat-icon" style={{ background: 'rgba(6,182,212,0.12)', color: '#06b6d4' }}>✅</div>
              <div className="ds-stat-body">
                <div className="ds-stat-num">{stats?.activeJobs}</div>
                <div className="ds-stat-lbl">Active Jobs</div>
              </div>
            </div>
            <div className="ds-stat-card" style={{ '--accent': '#ec4899' }}>
              <div className="ds-stat-icon" style={{ background: 'rgba(236,72,153,0.12)', color: '#ec4899' }}>📋</div>
              <div className="ds-stat-body">
                <div className="ds-stat-num">{stats?.totalApplications}</div>
                <div className="ds-stat-lbl">Applications</div>
              </div>
            </div>
          </div>

          {/* Quick Summary Card */}
          <div className="ds-section-card">
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Platform Summary</h3>
            <div className="ds-summary-grid">
              <div className="ds-summary-item">
                <span className="ds-summary-icon">📌</span>
                <span><strong>{stats?.totalCandidates}</strong> candidates registered on platform</span>
              </div>
              <div className="ds-summary-item">
                <span className="ds-summary-icon">📌</span>
                <span><strong>{stats?.totalCompanies}</strong> companies registered on platform</span>
              </div>
              <div className="ds-summary-item">
                <span className="ds-summary-icon">📌</span>
                <span><strong>{stats?.totalJobs}</strong> jobs posted ({stats?.activeJobs} currently active)</span>
              </div>
              <div className="ds-summary-item">
                <span className="ds-summary-icon">📌</span>
                <span><strong>{stats?.totalApplications}</strong> total applications submitted</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== CANDIDATES ===== */}
      {tab === 'candidates' && (
        <div>
          <div className="ds-page-title-row">
            <h2>Candidates</h2>
            <span className="ds-count-badge">{candidates.length}</span>
          </div>
          <div className="ds-section-card">
            <div className="ds-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Joined On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((c) => (
                    <tr key={c._id}>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.email}</td>
                      <td>{c.phone || '-'}</td>
                      <td>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                      <td><button className="btn-danger" onClick={() => handleDeleteCandidate(c._id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===== COMPANIES ===== */}
      {tab === 'companies' && (
        <div>
          <div className="ds-page-title-row">
            <h2>Companies</h2>
            <span className="ds-count-badge">{companies.length}</span>
          </div>
          <div className="ds-section-card">
            <div className="ds-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>Email</th>
                    <th>Industry</th>
                    <th>Location</th>
                    <th>Joined On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((c) => (
                    <tr key={c._id}>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.email}</td>
                      <td>{c.industry || '-'}</td>
                      <td>{c.location || '-'}</td>
                      <td>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                      <td><button className="btn-danger" onClick={() => handleDeleteCompany(c._id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===== JOBS ===== */}
      {tab === 'jobs' && (
        <div>
          <div className="ds-page-title-row">
            <h2>All Jobs</h2>
            <span className="ds-count-badge">{jobs.length}</span>
          </div>
          <div className="ds-section-card">
            <div className="ds-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((j) => (
                    <tr key={j._id}>
                      <td><strong>{j.title}</strong></td>
                      <td>{j.company?.name || '[Deleted Company]'}</td>
                      <td>{j.location}</td>
                      <td>{j.jobType}</td>
                      <td><span className={`badge ${j.isActive ? 'badge-shortlisted' : 'badge-rejected'}`}>{j.isActive ? 'Active' : 'Closed'}</span></td>
                      <td><button className="btn-danger" onClick={() => handleDeleteJob(j._id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===== APPLICATIONS ===== */}
      {tab === 'applications' && (() => {
        // Filter by search + status
        const filtered = applications.filter((app) => {
          const name = (app.candidate?.name || app.candidateName || '').toLowerCase();
          const job  = (app.job?.title || app.jobTitle || '').toLowerCase();
          const co   = (app.job?.company?.name || app.companyName || '').toLowerCase();
          const matchSearch = appSearch === '' || name.includes(appSearch.toLowerCase()) || job.includes(appSearch.toLowerCase()) || co.includes(appSearch.toLowerCase());
          const matchStatus = appStatusFilter === 'All' || app.status === appStatusFilter;
          return matchSearch && matchStatus;
        });

        const totalPages = Math.max(1, Math.ceil(filtered.length / APP_PER_PAGE));
        const safePage   = Math.min(appPage, totalPages);
        const paginated  = filtered.slice((safePage - 1) * APP_PER_PAGE, safePage * APP_PER_PAGE);

        return (
          <div>
            <div className="ds-page-title-row">
              <h2>All Applications</h2>
              <span className="ds-count-badge">{filtered.length} / {applications.length}</span>
            </div>

            {/* Filters */}
            <div className="ds-filter-bar">
              <div className="ds-filter-search-wrap">
                <span className="ds-filter-search-icon">🔍</span>
                <input
                  className="ds-filter-search"
                  type="text"
                  placeholder="Search candidate, job or company..."
                  value={appSearch}
                  onChange={(e) => { setAppSearch(e.target.value); setAppPage(1); }}
                />
              </div>
              <select
                className="ds-filter-select"
                value={appStatusFilter}
                onChange={(e) => { setAppStatusFilter(e.target.value); setAppPage(1); }}
              >
                {['All', 'Pending', 'Reviewed', 'Shortlisted', 'Rejected', 'Hired'].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="ds-section-card">
              <div className="ds-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Job</th>
                      <th>Company</th>
                      <th>Applied On</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                          No applications found
                        </td>
                      </tr>
                    ) : paginated.map((app) => (
                      <tr key={app._id}>
                        <td>
                          <strong>{app.candidate?.name || app.candidateName || '[Deleted]'}</strong>
                          <br />
                          <small style={{ color: 'var(--text-muted)' }}>{app.candidate?.email || app.candidateEmail || '-'}</small>
                        </td>
                        <td>{app.job?.title || app.jobTitle || '[Deleted Job]'}</td>
                        <td>{app.job?.company?.name || app.companyName || '[Deleted Company]'}</td>
                        <td>{new Date(app.createdAt).toLocaleDateString('en-IN')}</td>
                        <td><span className={`badge ${statusClass[app.status] || 'badge-pending'}`}>{app.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
               
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="ds-pagination">
                  <button
                    className="ds-page-btn"
                    onClick={() => setAppPage(1)}
                    disabled={safePage === 1}
                    title="First page"
                  >«</button>
                  <button
                    className="ds-page-btn"
                    onClick={() => setAppPage((p) => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                  >‹ Prev</button>

                  {/* Page number pills */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === '...' ? (
                        <span key={`dot-${idx}`} className="ds-page-dots">…</span>
                      ) : (
                        <button
                          key={item}
                          className={`ds-page-btn ds-page-num ${safePage === item ? 'active' : ''}`}
                          onClick={() => setAppPage(item)}
                        >{item}</button>
                      )
                    )
                  }

                  <button
                    className="ds-page-btn"
                    onClick={() => setAppPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                  >Next ›</button>
                  <button
                    className="ds-page-btn"
                    onClick={() => setAppPage(totalPages)}
                    disabled={safePage === totalPages}
                    title="Last page"
                  >»</button>

                  <span className="ds-page-info">
                    Page {safePage} of {totalPages} · Showing {(safePage - 1) * APP_PER_PAGE + 1}–{Math.min(safePage * APP_PER_PAGE, filtered.length)} of {filtered.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </DashboardLayout>
  );
};

export default AdminDashboard;
