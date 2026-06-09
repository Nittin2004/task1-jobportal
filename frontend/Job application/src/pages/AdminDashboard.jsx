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

const statusClass = {
  Pending: 'badge-pending',
  Reviewed: 'badge-reviewed',
  Shortlisted: 'badge-shortlisted',
  Rejected: 'badge-rejected',
  Hired: 'badge-hired',
};

const AdminDashboard = () => {
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
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
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await adminDeleteJob(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      toast.success('Job deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleDeleteCompany = async (id) => {
    if (!window.confirm('Delete this company?')) return;
    try {
      await adminDeleteCompany(id);
      setCompanies((prev) => prev.filter((c) => c._id !== id));
      toast.success('Company deleted');
    } catch {
      toast.error('Failed to delete company');
    }
  };

  if (loading) return <div className="loading">Loading admin dashboard...</div>;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>⚙️ Admin Dashboard</h1>
          <p>Manage all users, jobs, and applications</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.totalCandidates}</div>
              <div className="stat-label">Total Candidates</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalCompanies}</div>
              <div className="stat-label">Total Companies</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalJobs}</div>
              <div className="stat-label">Total Jobs</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.activeJobs}</div>
              <div className="stat-label">Active Jobs</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalApplications}</div>
              <div className="stat-label">Applications</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="tabs">
          {[
            { key: 'stats', label: '📊 Overview' },
            { key: 'candidates', label: '👤 Candidates' },
            { key: 'companies', label: '🏢 Companies' },
            { key: 'jobs', label: '💼 Jobs' },
            { key: 'applications', label: '📋 Applications' },
          ].map((t) => (
            <button
              key={t.key}
              className={`tab-btn ${tab === t.key ? 'active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'stats' && (
          <div className="card">
            <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Platform Overview</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 2 }}>
              📌 <strong>{stats?.totalCandidates}</strong> candidates registered<br />
              📌 <strong>{stats?.totalCompanies}</strong> companies registered<br />
              📌 <strong>{stats?.totalJobs}</strong> jobs posted ({stats?.activeJobs} active)<br />
              📌 <strong>{stats?.totalApplications}</strong> total applications submitted<br />
            </p>
          </div>
        )}

        {/* Candidates */}
        {tab === 'candidates' && (
          <div className="card table-wrap">
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
                    <td>
                      <button className="btn-danger" onClick={() => handleDeleteCandidate(c._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Companies */}
        {tab === 'companies' && (
          <div className="card table-wrap">
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
                    <td>
                      <button className="btn-danger" onClick={() => handleDeleteCompany(c._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Jobs */}
        {tab === 'jobs' && (
          <div className="card table-wrap">
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
                    <td>
                      <span className={`badge ${j.isActive ? 'badge-shortlisted' : 'badge-rejected'}`}>
                        {j.isActive ? 'Active' : 'Closed'}
                      </span>
                    </td>
                    <td>
                      <button className="btn-danger" onClick={() => handleDeleteJob(j._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Applications */}
        {tab === 'applications' && (
          <div className="card table-wrap">
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
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <strong>{app.candidate?.name || app.candidateName || '[Deleted]'}</strong>
                      <br />
                      <small style={{ color: 'var(--text-muted)' }}>{app.candidate?.email || app.candidateEmail || '-'}</small>
                    </td>
                    <td>{app.job?.title || app.jobTitle || '[Deleted Job]'}</td>
                    <td>{app.job?.company?.name || app.companyName || '[Deleted Company]'}</td>
                    <td>{new Date(app.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <span className={`badge ${statusClass[app.status] || 'badge-pending'}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
