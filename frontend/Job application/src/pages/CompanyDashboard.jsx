/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getMyJobs, getJobApplicants, updateAppStatus, deleteJob, getProfile, updateProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const statusClass = {
  Pending: 'badge-pending',
  Reviewed: 'badge-reviewed',
  Shortlisted: 'badge-shortlisted',
  Rejected: 'badge-rejected',
  Hired: 'badge-hired',
};

const NAV_ITEMS = [
  { key: 'overview',    icon: '📊', label: 'Overview' },
  { key: 'jobs',        icon: '💼', label: 'My Jobs' },
  { key: 'applicants',  icon: '👥', label: 'Applicants' },
  { key: 'profile',     icon: '🏢', label: 'Company Profile' },
];

const CompanyDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appLoading, setAppLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    website: '',
    industry: '',
    location: '',
    companySize: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, profileRes] = await Promise.all([
          getMyJobs(),
          getProfile(),
        ]);
        setJobs(jobsRes.data);
        setProfile(profileRes.data);
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEditClick = () => {
    setEditForm({
      name: profile?.name || '',
      phone: profile?.phone || '',
      website: profile?.website || '',
      industry: profile?.industry || '',
      location: profile?.location || '',
      companySize: profile?.companySize || '',
      description: profile?.description || '',
    });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(editForm);
      const profileRes = await getProfile();
      setProfile(profileRes.data);
      setIsEditing(false);
      toast.success('Company profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

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
      setApplicants((prev) => prev.map((a) => (a._id === appId ? { ...a, status } : a)));
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

  const activeJobs = jobs.filter((j) => j.isActive).length;
  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicantCount || 0), 0);

  if (loading) return (
    <div className="ds-page-loader">
      <div className="ds-spinner" />
      <p>Loading dashboard...</p>
    </div>
  );

  return (
    <DashboardLayout
      navItems={NAV_ITEMS}
      activeTab={tab}
      onTabChange={(key) => {
        if (key === 'applicants' && !selectedJob) return;
        setTab(key);
      }}
      title="Company Dashboard 🏢"
      subtitle={`Welcome, ${user?.name}`}
      headerAction={
        <Link to="/post-job">
          <button className="btn-primary">+ Post New Job</button>
        </Link>
      }
    >
      {/* ===== OVERVIEW ===== */}
      {tab === 'overview' && (
        <div>
          <div className="ds-stats-grid">
            <div className="ds-stat-card" style={{ '--accent': '#6366f1' }}>
              <div className="ds-stat-icon" style={{ background: 'rgba(99,102,241,0.12)', color: '#6366f1' }}>💼</div>
              <div className="ds-stat-body">
                <div className="ds-stat-num">{jobs.length}</div>
                <div className="ds-stat-lbl">Jobs Posted</div>
              </div>
            </div>
            <div className="ds-stat-card" style={{ '--accent': '#10b981' }}>
              <div className="ds-stat-icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>✅</div>
              <div className="ds-stat-body">
                <div className="ds-stat-num">{activeJobs}</div>
                <div className="ds-stat-lbl">Active Jobs</div>
              </div>
            </div>
            <div className="ds-stat-card" style={{ '--accent': '#f59e0b' }}>
              <div className="ds-stat-icon" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>👥</div>
              <div className="ds-stat-body">
                <div className="ds-stat-num">{totalApplicants}</div>
                <div className="ds-stat-lbl">Total Applicants</div>
              </div>
            </div>
            <div className="ds-stat-card" style={{ '--accent': '#ef4444' }}>
              <div className="ds-stat-icon" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>🔴</div>
              <div className="ds-stat-body">
                <div className="ds-stat-num">{jobs.length - activeJobs}</div>
                <div className="ds-stat-lbl">Closed Jobs</div>
              </div>
            </div>
          </div>

          {/* Recent Jobs */}
          <div className="ds-section-card">
            <div className="ds-section-header">
              <h3>Recent Job Postings</h3>
              <button className="ds-link-btn" onClick={() => setTab('jobs')}>View All →</button>
            </div>
            {jobs.length === 0 ? (
              <div className="ds-empty-mini">
                <p>No jobs posted yet. <Link to="/post-job" className="ds-inline-link">Post a Job →</Link></p>
              </div>
            ) : (
              <div className="ds-list">
                {jobs.slice(0, 4).map((job) => (
                  <div key={job._id} className="ds-list-item">
                    <div className="ds-list-avatar" style={{ background: 'rgba(99,102,241,0.12)', color: '#6366f1' }}>💼</div>
                    <div className="ds-list-body">
                      <p className="ds-list-title">{job.title}</p>
                      <p className="ds-list-sub">{job.location} · {job.jobType} · {new Date(job.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className={`badge ${job.isActive ? 'badge-shortlisted' : 'badge-rejected'}`}>{job.isActive ? 'Active' : 'Closed'}</span>
                      <button className="ds-link-btn" onClick={() => handleViewApplicants(job)}>View →</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== MY JOBS ===== */}
      {tab === 'jobs' && (
        <div>
          <div className="ds-page-title-row">
            <h2>My Jobs</h2>
            <span className="ds-count-badge">{jobs.length}</span>
          </div>
          {jobs.length === 0 ? (
            <div className="ds-empty-state">
              <div className="ds-empty-icon">📭</div>
              <h3>No jobs posted yet</h3>
              <p>Start hiring by posting your first job</p>
              <Link to="/post-job"><button className="btn-primary" style={{ marginTop: '1rem' }}>+ Post a Job</button></Link>
            </div>
          ) : (
            <div className="ds-section-card">
              <div className="ds-table-wrap">
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
                        <td><span className={`badge ${job.isActive ? 'badge-shortlisted' : 'badge-rejected'}`}>{job.isActive ? 'Active' : 'Closed'}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <button className="btn-secondary" style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem' }} onClick={() => handleViewApplicants(job)}>👥 Applicants</button>
                            <button className="btn-danger" style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem' }} onClick={() => handleDeleteJob(job._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== APPLICANTS ===== */}
      {tab === 'applicants' && (
        <div>
          <div className="ds-page-title-row">
            <div>
              <h2>Applicants</h2>
              {selectedJob && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>For: <strong>{selectedJob.title}</strong></p>}
            </div>
            <button className="btn-secondary" style={{ fontSize: '0.85rem' }} onClick={() => setTab('jobs')}>← Back to Jobs</button>
          </div>
          {!selectedJob ? (
            <div className="ds-empty-state">
              <div className="ds-empty-icon">👥</div>
              <h3>Select a job first</h3>
              <p>Go to My Jobs and click "Applicants" on a job</p>
              <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => setTab('jobs')}>View My Jobs</button>
            </div>
          ) : appLoading ? (
            <div className="ds-page-loader"><div className="ds-spinner" /><p>Loading applicants...</p></div>
          ) : applicants.length === 0 ? (
            <div className="ds-empty-state">
              <div className="ds-empty-icon">📭</div>
              <h3>No applicants yet</h3>
              <p>No one has applied to this job yet</p>
            </div>
          ) : (
            <div className="ds-section-card">
              <div className="ds-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Candidate</th>
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
                            <span style={{ fontSize: '0.75rem', color: '#ef4444', marginLeft: '0.5rem', background: '#fee2e2', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Deleted</span>
                          )}
                        </td>
                        <td>{app.candidate?.email || app.candidateEmail || '-'}</td>
                        <td>{app.candidate?.phone || app.candidatePhone || '-'}</td>
                        <td>
                          {app.resumeUrl ? (
                            <a href={`http://localhost:5000${app.resumeUrl}`} target="_blank" rel="noreferrer" className="resume-link">📄 View</a>
                          ) : '-'}
                        </td>
                        <td>{new Date(app.createdAt).toLocaleDateString('en-IN')}</td>
                        <td>
                          <select className="status-select" value={app.status} onChange={(e) => handleStatusChange(app._id, e.target.value)}>
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
            </div>
          )}
        </div>
      )}

      {/* ===== PROFILE ===== */}
      {tab === 'profile' && profile && (
        <div>
          <div className="ds-page-title-row">
            <h2>Company Profile</h2>
            {!isEditing && (
              <button className="btn-secondary" style={{ fontSize: '0.85rem' }} onClick={handleEditClick}>✏️ Edit Profile</button>
            )}
          </div>
          <div className="ds-profile-wrap">
            {isEditing ? (
              <div className="ds-section-card" style={{ maxWidth: 640 }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Edit Company Profile</h3>
                <form onSubmit={handleProfileSubmit}>
                  <div className="form-group"><label>Company Name</label><input type="text" name="name" value={editForm.name} onChange={handleInputChange} required /></div>
                  <div className="form-group"><label>Email (Read-only)</label><input type="text" value={profile.email} disabled style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }} /></div>
                  <div className="form-group"><label>Phone</label><input type="text" name="phone" value={editForm.phone} onChange={handleInputChange} placeholder="Enter contact phone number" /></div>
                  <div className="form-group"><label>Website</label><input type="text" name="website" value={editForm.website} onChange={handleInputChange} placeholder="e.g. https://company.com" /></div>
                  <div className="form-group"><label>Industry</label><input type="text" name="industry" value={editForm.industry} onChange={handleInputChange} placeholder="e.g. IT, Healthcare, Finance" /></div>
                  <div className="form-group"><label>Location</label><input type="text" name="location" value={editForm.location} onChange={handleInputChange} placeholder="e.g. Mumbai, India" /></div>
                  <div className="form-group"><label>Company Size</label><input type="text" name="companySize" value={editForm.companySize} onChange={handleInputChange} placeholder="e.g. 50-200 employees" /></div>
                  <div className="form-group"><label>Description</label><textarea name="description" value={editForm.description} onChange={handleInputChange} rows="4" placeholder="Describe your company, its mission, values, etc..." /></div>
                  
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : '💾 Save Changes'}</button>
                    <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)} disabled={saving}>Cancel</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="ds-profile-grid">
                <div className="ds-section-card ds-profile-hero">
                  <div className="ds-profile-avatar-lg">{(profile.name || 'C')[0].toUpperCase()}</div>
                  <h3>{profile.name}</h3>
                  <p className="ds-profile-email">{profile.email}</p>
                  {profile.phone && <p className="ds-profile-phone">📞 {profile.phone}</p>}
                  {profile.website && (
                    <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noreferrer" className="ds-resume-btn" style={{ textAlign: 'center', display: 'block' }}>🌐 Visit Website</a>
                  )}
                </div>
                <div className="ds-profile-details">
                  <div className="ds-section-card">
                    <h4 className="ds-detail-heading">About Company</h4>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginTop: '0.5rem', fontSize: '0.9rem', whiteSpace: 'pre-line' }}>{profile.description || 'No description provided'}</p>
                  </div>
                  <div className="ds-section-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div>
                      <h4 className="ds-detail-heading" style={{ fontSize: '0.85rem' }}>Industry</h4>
                      <p style={{ color: 'var(--text-main)', fontWeight: 600, marginTop: '0.25rem' }}>{profile.industry || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="ds-detail-heading" style={{ fontSize: '0.85rem' }}>Location</h4>
                      <p style={{ color: 'var(--text-main)', fontWeight: 600, marginTop: '0.25rem' }}>📍 {profile.location || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="ds-detail-heading" style={{ fontSize: '0.85rem' }}>Company Size</h4>
                      <p style={{ color: 'var(--text-main)', fontWeight: 600, marginTop: '0.25rem' }}>👥 {profile.companySize || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CompanyDashboard;
