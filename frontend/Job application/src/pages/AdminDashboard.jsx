import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import toast from 'react-hot-toast';
import {
  getAdminStats,
  getAllCandidates,
  getAllCompanies,
  getAllJobs,
  getAllApplications,
  getAllBookings,
  adminDeleteCandidate,
  adminDeleteJob,
  adminDeleteCompany,
  adminDeleteBooking,
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
  { key: 'mentorships',  icon: '🤝', label: 'Mentorships' },
];

const AdminDashboard = () => {
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [appPage, setAppPage] = useState(1);
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('All');
  const APP_PER_PAGE = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, candidatesRes, companiesRes, jobsRes, appsRes, bookingsRes] = await Promise.all([
          getAdminStats(),
          getAllCandidates(),
          getAllCompanies(),
          getAllJobs(),
          getAllApplications(),
          getAllBookings().catch(() => ({ data: [] })),
        ]);
        setStats(statsRes.data);
        setCandidates(candidatesRes.data);
        setCompanies(companiesRes.data);
        setJobs(jobsRes.data);
        setApplications(appsRes.data);
        setBookings(bookingsRes.data || []);
      } catch {
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Delete this mentorship booking?')) return;
    try {
      await adminDeleteBooking(id);
      setBookings((prev) => prev.filter((b) => b._id !== id));
      toast.success('Booking deleted');
    } catch { toast.error('Failed to delete booking'); }
  };

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
      {tab === 'stats' && (() => {
        // --- Derived chart data (computed from already-fetched state) ---
        const STATUS_COLORS = {
          Pending:    '#f59e0b',
          Reviewed:   '#6366f1',
          Shortlisted:'#10b981',
          Rejected:   '#ef4444',
          Hired:      '#06b6d4',
        };
        const appStatusData = ['Pending','Reviewed','Shortlisted','Rejected','Hired'].map(s => ({
          name: s,
          value: applications.filter(a => a.status === s).length,
        })).filter(d => d.value > 0);

        const JOB_TYPE_COLORS = ['#6366f1','#10b981','#f59e0b','#ec4899','#06b6d4'];
        const jobTypes = ['Full-time','Part-time','Remote','Internship','Contract'];
        const jobTypeData = jobTypes.map(t => ({
          name: t,
          count: jobs.filter(j => j.jobType === t).length,
        })).filter(d => d.count > 0);

        const companyJobMap = {};
        jobs.forEach(j => {
          const name = j.company?.name || 'Unknown';
          companyJobMap[name] = (companyJobMap[name] || 0) + 1;
        });
        const topCompaniesData = Object.entries(companyJobMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([name, count]) => ({ name, count }));

        return (
          <div>
            {/* Stat Cards */}
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
              <div className="ds-stat-card" style={{ '--accent': '#8b5cf6' }}>
                <div className="ds-stat-icon" style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}>🤝</div>
                <div className="ds-stat-body">
                  <div className="ds-stat-num">{stats?.totalBookings || bookings.length || 0}</div>
                  <div className="ds-stat-lbl">Mentorships</div>
                </div>
              </div>
            </div>

            {/* ── Charts Row ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>

              {/* Chart 1 — Application Status Donut */}
              <div className="ds-section-card" style={{ minHeight: 320 }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>📊 Application Status Breakdown</h3>
                {appStatusData.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', paddingTop: '3rem' }}>No application data yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={appStatusData}
                        cx="50%" cy="50%"
                        innerRadius={60} outerRadius={95}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {appStatusData.map((entry) => (
                          <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: 'var(--ds-bg)', border: '1px solid var(--ds-border)', borderRadius: 8, color: 'var(--text-main)' }}
                        formatter={(val, name) => [`${val} applications`, name]}
                      />
                      <Legend iconType="circle" iconSize={10} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Chart 2 — Jobs by Type */}
              <div className="ds-section-card" style={{ minHeight: 320 }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>💼 Jobs by Type</h3>
                {jobTypeData.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', paddingTop: '3rem' }}>No job data yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={jobTypeData} barCategoryGap="30%">
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--ds-border)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis allowDecimals={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: 'var(--ds-bg)', border: '1px solid var(--ds-border)', borderRadius: 8, color: 'var(--text-main)' }}
                        formatter={(val) => [`${val} jobs`]}
                        cursor={{ fill: 'rgba(99,102,241,0.06)' }}
                      />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {jobTypeData.map((_, i) => (
                          <Cell key={i} fill={JOB_TYPE_COLORS[i % JOB_TYPE_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Chart 3 — Top Companies by Job Count */}
              <div className="ds-section-card" style={{ minHeight: 320, gridColumn: topCompaniesData.length > 3 ? 'span 2' : 'span 1' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>🏢 Top Companies by Jobs Posted</h3>
                {topCompaniesData.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', paddingTop: '3rem' }}>No data yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={topCompaniesData} layout="vertical" barCategoryGap="25%">
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--ds-border)" horizontal={false} />
                      <XAxis type="number" allowDecimals={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" width={110} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: 'var(--ds-bg)', border: '1px solid var(--ds-border)', borderRadius: 8, color: 'var(--text-main)' }}
                        formatter={(val) => [`${val} jobs posted`]}
                        cursor={{ fill: 'rgba(16,185,129,0.06)' }}
                      />
                      <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="ds-section-card" style={{ marginTop: '1.5rem' }}>
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
        );
      })()}

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

      {/* ===== MENTORSHIPS TAB ===== */}
      {tab === 'mentorships' && (
        <div>
          <div className="ds-page-title-row">
            <h2>🤝 Mentorship Bookings</h2>
            <span className="ds-count-badge">{bookings.length}</span>
          </div>

          <div className="ds-section-card">
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📅</p>
                <p>No mentorship sessions booked across the platform yet.</p>
              </div>
            ) : (
              <div className="ds-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Mentor</th>
                      <th>Topic / Session</th>
                      <th>Date & Time</th>
                      <th>Status</th>
                      <th>Meeting Link</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b._id}>
                        <td>
                          <strong>{b.studentId?.name || 'Unknown Student'}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.studentId?.email || ''}</div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ background: b.mentorColor || '#6366f1', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                              {b.mentorAvatar || 'EM'}
                            </span>
                            <div>
                              <strong>{b.mentorName || 'Expert Mentor'}</strong>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.mentorRole || ''}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <strong>{b.sessionType || '1:1 Mentoring'}</strong>
                          {b.topic && b.topic !== (b.sessionType || '') && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>"{b.topic}"</div>
                          )}
                        </td>
                        <td>
                          <div><strong>{b.date}</strong></div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{b.timeSlot}</div>
                        </td>
                        <td>
                          <span className="badge badge-reviewed" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                            ● {b.status || 'Confirmed'}
                          </span>
                        </td>
                        <td>
                          <a
                            href={b.meetingLink || 'https://meet.google.com/nexthire-live'}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'underline', fontSize: '0.85rem' }}
                          >
                            Join Meet ↗
                          </a>
                        </td>
                        <td>
                          <button
                            className="btn-danger"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                            onClick={() => handleDeleteBooking(b._id)}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
