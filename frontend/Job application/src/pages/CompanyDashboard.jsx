import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getMyJobs, getJobApplicants, updateAppStatus, deleteJob } from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusClass = {
  Pending: 'badge-pending',
  Reviewed: 'badge-reviewed',
  Shortlisted: 'badge-shortlisted',
  Rejected: 'badge-rejected',
  Hired: 'badge-hired',
};

const CompanyDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appLoading, setAppLoading] = useState(false);

  useEffect(() => {
    getMyJobs()
      .then((res) => setJobs(res.data))
      .catch(() => toast.error('Failed to load jobs'))
      .finally(() => setLoading(false));
  }, []);

  const handleViewApplicants = async (job) => {
    setSelectedJob(job);
    setTab('applicants');
    setAppLoading(true);
    try {
      const res = await getJobApplicants(job._id);
      setApplicants(res.data);
    } catch {
      toast.error('Failed to load applicants');
    } finally {
      setAppLoading(false);
    }
  };

  const handleStatusChange = async (appId, status) => {
    try {
      await updateAppStatus(appId, status);
      setApplicants((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status } : a))
      );
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      toast.success('Job deleted');
    } catch {
      toast.error('Failed to delete job');
    }
  };

  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicantCount || 0), 0);

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Company Dashboard 🏢</h1>
            <p>Welcome, <strong>{user?.name}</strong></p>
          </div>
          <Link to="/post-job">
            <button className="btn-primary">+ Post New Job</button>
          </Link>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{jobs.length}</div>
            <div className="stat-label">Jobs Posted</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{jobs.filter(j => j.isActive).length}</div>
            <div className="stat-label">Active Jobs</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab-btn ${tab === 'jobs' ? 'active' : ''}`} onClick={() => setTab('jobs')}>
            💼 My Jobs
          </button>
          {selectedJob && (
            <button className={`tab-btn ${tab === 'applicants' ? 'active' : ''}`} onClick={() => setTab('applicants')}>
              👥 Applicants — {selectedJob.title}
            </button>
          )}
        </div>

        {/* Jobs Tab */}
        {tab === 'jobs' && (
          <div>
            {loading ? (
              <div className="loading">Loading jobs...</div>
            ) : jobs.length === 0 ? (
              <div className="empty">
                <h3>No jobs posted yet</h3>
                <p>Start hiring by posting your first job</p>
                <Link to="/post-job">
                  <button className="btn-primary" style={{ marginTop: '1rem' }}>+ Post a Job</button>
                </Link>
              </div>
            ) : (
              <div className="card table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Location</th>
                      <th>Type</th>
                      <th>Posted On</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job._id}>
                        <td><strong>{job.title}</strong></td>
                        <td>{job.location}</td>
                        <td>{job.jobType}</td>
                        <td>{new Date(job.createdAt).toLocaleDateString('en-IN')}</td>
                        <td>
                          <span className={`badge ${job.isActive ? 'badge-shortlisted' : 'badge-rejected'}`}>
                            {job.isActive ? 'Active' : 'Closed'}
                          </span>
                        </td>
                        <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <button
                            className="btn-secondary"
                            style={{ fontSize: '0.8rem', padding: '0.3rem 0.7rem' }}
                            onClick={() => handleViewApplicants(job)}
                          >
                            👥 Applicants
                          </button>
                          <button
                            className="btn-danger"
                            style={{ fontSize: '0.8rem', padding: '0.3rem 0.7rem' }}
                            onClick={() => handleDeleteJob(job._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Applicants Tab */}
        {tab === 'applicants' && (
          <div>
            {appLoading ? (
              <div className="loading">Loading applicants...</div>
            ) : applicants.length === 0 ? (
              <div className="empty">
                <h3>No applicants yet</h3>
                <p>No one has applied to this job yet</p>
              </div>
            ) : (
              <div className="card table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Candidate Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Resume</th>
                      <th>Applied On</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((app) => (
                      <tr key={app._id}>
                        <td>
                          <strong>{app.candidate?.name || app.candidateName || '[Deleted Candidate]'}</strong>
                          {!app.candidate && app.candidateName && (
                            <span style={{ fontSize: '0.75rem', color: '#ef4444', marginLeft: '0.5rem', background: '#fee2e2', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                              Deleted
                            </span>
                          )}
                        </td>
                        <td>{app.candidate?.email || app.candidateEmail || '-'}</td>
                        <td>{app.candidate?.phone || app.candidatePhone || '-'}</td>
                        <td>
                          {app.resumeUrl ? (
                            <a
                              href={`http://localhost:5000${app.resumeUrl}`}
                              target="_blank"
                              rel="noreferrer"
                              className="resume-link"
                            >
                              📄 View
                            </a>
                          ) : '-'}
                        </td>
                        <td>{new Date(app.createdAt).toLocaleDateString('en-IN')}</td>
                        <td>
                          <select
                            className="status-select"
                            value={app.status}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          >
                            <option>Pending</option>
                            <option>Reviewed</option>
                            <option>Shortlisted</option>
                            <option>Rejected</option>
                            <option>Hired</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
