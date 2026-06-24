import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getMyApplications, getSavedJobs, unsaveJob, getProfile, updateProfile, uploadResume } from '../services/api';
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
  { key: 'overview',      icon: '📊', label: 'Overview' },
  { key: 'applications',  icon: '📋', label: 'My Applications' },
  { key: 'saved',         icon: '❤️',  label: 'Saved Jobs' },
  { key: 'preparation',   icon: '🚀', label: 'My Preparation' },
  { key: 'mentorship',    icon: '📅', label: 'My Mentorships' },
  { key: 'profile',       icon: '👤', label: 'My Profile' },
];

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '', skills: '', experience: '', education: '' });
  const [resumeFile, setResumeFile] = useState(null);
  const [saving, setSaving] = useState(false);

  // New State for Mock Data & Stats
  const [dsaSolvedCount, setDsaSolvedCount] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dsa_solved');
      if (saved) {
        const parsed = JSON.parse(saved);
        setDsaSolvedCount(Object.values(parsed).filter(Boolean).length);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [appsRes, savedRes, profileRes] = await Promise.all([
          getMyApplications(),
          getSavedJobs(),
          getProfile(),
        ]);
        setApplications(appsRes.data);
        setSavedJobs(savedRes.data);
        setProfile(profileRes.data);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleUnsave = async (jobId) => {
    try {
      await unsaveJob(jobId);
      setSavedJobs((prev) => prev.filter((s) => s.job?._id !== jobId));
      toast.success('Job removed from saved');
    } catch {
      toast.error('Failed to remove');
    }
  };

  const handleEditClick = () => {
    setEditForm({
      name: profile?.name || '',
      phone: profile?.phone || '',
      skills: Array.isArray(profile?.skills) ? profile.skills.join(', ') : '',
      experience: profile?.experience || '',
      education: profile?.education || '',
    });
    setResumeFile(null);
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => setResumeFile(e.target.files[0]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (resumeFile) {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        await uploadResume(formData);
      }
      const skillsArray = editForm.skills.split(',').map((s) => s.trim()).filter(Boolean);
      await updateProfile({
        name: editForm.name,
        phone: editForm.phone,
        skills: skillsArray,
        experience: editForm.experience,
        education: editForm.education,
      });
      const profileRes = await getProfile();
      setProfile(profileRes.data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="ds-page-loader">
      <div className="ds-spinner" />
      <p>Loading dashboard...</p>
    </div>
  );

  const shortlisted = applications.filter(a => a.status === 'Shortlisted' || a.status === 'Hired').length;
  const pending = applications.filter(a => a.status === 'Pending').length;

  return (
    <DashboardLayout
      navItems={NAV_ITEMS}
      activeTab={tab}
      onTabChange={setTab}
      title={`Welcome back, ${user?.name?.split(' ')[0]} 👋`}
      subtitle="Manage your career journey"
      headerAction={
        <Link to="/jobs">
          <button className="btn-primary">🔍 Browse Jobs</button>
        </Link>
      }
    >
      {/* ===== OVERVIEW ===== */}
      {tab === 'overview' && (
        <div>
          <div className="ds-stats-grid">
            <div className="ds-stat-card" style={{ '--accent': '#6366f1' }}>
              <div className="ds-stat-icon" style={{ background: 'rgba(99,102,241,0.12)', color: '#6366f1' }}>📋</div>
              <div className="ds-stat-body">
                <div className="ds-stat-num">{applications.length}</div>
                <div className="ds-stat-lbl">Total Applications</div>
              </div>
            </div>
            <div className="ds-stat-card" style={{ '--accent': '#10b981' }}>
              <div className="ds-stat-icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>✅</div>
              <div className="ds-stat-body">
                <div className="ds-stat-num">{shortlisted}</div>
                <div className="ds-stat-lbl">Shortlisted / Hired</div>
              </div>
            </div>
            <div className="ds-stat-card" style={{ '--accent': '#f59e0b' }}>
              <div className="ds-stat-icon" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>⏳</div>
              <div className="ds-stat-body">
                <div className="ds-stat-num">{pending}</div>
                <div className="ds-stat-lbl">Pending Review</div>
              </div>
            </div>
            <div className="ds-stat-card" style={{ '--accent': '#ec4899' }}>
              <div className="ds-stat-icon" style={{ background: 'rgba(236,72,153,0.12)', color: '#ec4899' }}>❤️</div>
              <div className="ds-stat-body">
                <div className="ds-stat-num">{savedJobs.length}</div>
                <div className="ds-stat-lbl">Saved Jobs</div>
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="ds-section-card">
            <div className="ds-section-header">
              <h3>Recent Applications</h3>
              <button className="ds-link-btn" onClick={() => setTab('applications')}>View All →</button>
            </div>
            {applications.length === 0 ? (
              <div className="ds-empty-mini">
                <p>No applications yet. <Link to="/jobs" className="ds-inline-link">Browse Jobs →</Link></p>
              </div>
            ) : (
              <div className="ds-list">
                {applications.slice(0, 4).map((app) => (
                  <div key={app._id} className="ds-list-item">
                    <div className="ds-list-avatar">
                      {(app.job?.company?.name || app.companyName || '?')[0]}
                    </div>
                    <div className="ds-list-body">
                      <p className="ds-list-title">{app.job ? app.job.title : `${app.jobTitle || 'Deleted Job'} (Closed)`}</p>
                      <p className="ds-list-sub">{app.job?.company?.name || app.companyName || 'Unknown'} · {new Date(app.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <span className={`badge ${statusClass[app.status] || 'badge-pending'}`}>{app.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Smart Job Recommendations & ATS Score */}
          <div className="ds-overview-bottom-grid">
            {/* Recommendations */}
            <div className="ds-section-card">
              <div className="ds-section-header">
                <h3>🎯 Recommended for You</h3>
                <Link to="/jobs"><button className="ds-link-btn">View All →</button></Link>
              </div>
              <div className="ds-list">
                {/* Mock Job 1 */}
                <div className="ds-list-item">
                  <div className="ds-list-avatar" style={{ background: '#e0e7ff', color: '#4f46e5' }}>G</div>
                  <div className="ds-list-body">
                    <p className="ds-list-title">Frontend Developer (React)</p>
                    <p className="ds-list-sub">Global Tech · 90% Match</p>
                  </div>
                  <Link to="/jobs"><button className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>View</button></Link>
                </div>
                {/* Mock Job 2 */}
                <div className="ds-list-item">
                  <div className="ds-list-avatar" style={{ background: '#dcfce7', color: '#16a34a' }}>S</div>
                  <div className="ds-list-body">
                    <p className="ds-list-title">Full Stack Engineer</p>
                    <p className="ds-list-sub">Startup Inc · 85% Match</p>
                  </div>
                  <Link to="/jobs"><button className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>View</button></Link>
                </div>
              </div>
            </div>

            {/* ATS Score / Profile Strength */}
            <div className="ds-section-card ds-ats-card">
              <h3>📄 Profile Strength & ATS</h3>
              <div className="ds-ats-circle-wrap">
                <div className="ds-ats-circle">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path className="circle-progress"
                      strokeDasharray="75, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className="percentage">75%</text>
                  </svg>
                </div>
                <div className="ds-ats-text">
                  <p><strong>Good Strength</strong></p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>Add more skills to reach 90% and boost your ATS ranking.</p>
                  <Link to="/ats-scanner">
                    <button className="btn-secondary" style={{ width: '100%', marginTop: '0.75rem' }}>Scan ATS Score</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== PREPARATION ===== */}
      {tab === 'preparation' && (
        <div>
          <div className="ds-page-title-row">
            <h2>My Preparation Hub</h2>
            <Link to="/preparation"><button className="btn-secondary" style={{ fontSize: '0.85rem' }}>Explore Courses</button></Link>
          </div>
          
          <div className="ds-prep-grid">
            {/* DSA Progress */}
            <div className="ds-section-card ds-dsa-card">
              <div className="ds-dsa-header">
                <div>
                  <h3>💡 DSA Master Sheet</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>Track your coding interview prep</p>
                </div>
                <div className="ds-dsa-score">
                  <span className="ds-dsa-num">{dsaSolvedCount}</span>
                  <span className="ds-dsa-den">/ 400</span>
                </div>
              </div>
              <div className="ds-progress-bg" style={{ height: 8, background: '#e2e8f0', borderRadius: 4, marginTop: '1rem', overflow: 'hidden' }}>
                <div className="ds-progress-fill" style={{ width: `${Math.min(100, (dsaSolvedCount / 400) * 100)}%`, height: '100%', background: '#6366f1', borderRadius: 4 }} />
              </div>
              <Link to="/preparation/dsasheet">
                <button className="btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>Continue Solving</button>
              </Link>
            </div>

            {/* Enrolled Courses */}
            <div className="ds-section-card">
              <h3>📚 Enrolled Courses</h3>
              <div className="ds-list" style={{ marginTop: '1rem' }}>
                <div className="ds-list-item" style={{ alignItems: 'flex-start' }}>
                  <div className="ds-list-avatar" style={{ background: '#fef08a', color: '#854d0e', borderRadius: '8px' }}>JS</div>
                  <div className="ds-list-body" style={{ width: '100%' }}>
                    <p className="ds-list-title">Advanced JavaScript Concepts</p>
                    <p className="ds-list-sub">4/12 Modules Completed</p>
                    <div className="ds-progress-bg" style={{ height: 4, background: '#e2e8f0', borderRadius: 2, marginTop: '0.5rem', overflow: 'hidden' }}>
                      <div className="ds-progress-fill" style={{ width: '33%', height: '100%', background: '#10b981' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MENTORSHIP ===== */}
      {tab === 'mentorship' && (
        <div>
          <div className="ds-page-title-row">
            <h2>My Mentorships</h2>
            <Link to="/mentors"><button className="btn-primary" style={{ fontSize: '0.85rem' }}>Find a Mentor</button></Link>
          </div>

          <div className="ds-section-card">
            <h3>Upcoming Sessions</h3>
            <div className="ds-cards-grid" style={{ marginTop: '1rem' }}>
              <div className="ds-mentor-session-card">
                <div className="ds-ms-header">
                  <div className="ds-ms-date">
                    <span className="ds-ms-month">OCT</span>
                    <span className="ds-ms-day">24</span>
                  </div>
                  <div className="ds-ms-info">
                    <h4>Mock Interview (DSA)</h4>
                    <p>with <strong>Sarah Jenkins</strong> (Google SDE)</p>
                  </div>
                </div>
                <div className="ds-ms-details">
                  <p>🕒 10:00 AM - 11:00 AM IST</p>
                  <p>📹 Google Meet</p>
                </div>
                <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', background: '#10b981', borderColor: '#10b981' }}>Join Call</button>
              </div>
            </div>
          </div>

          <div className="ds-section-card" style={{ marginTop: '1.5rem' }}>
            <h3>Past Feedback</h3>
            <div className="ds-empty-mini">
              <p>No past sessions yet. Book a session to get personalized feedback!</p>
            </div>
          </div>
        </div>
      )}

      {/* ===== APPLICATIONS ===== */}
      {tab === 'applications' && (
        <div>
          <div className="ds-page-title-row">
            <h2>My Applications</h2>
            <span className="ds-count-badge">{applications.length}</span>
          </div>
          {applications.length === 0 ? (
            <div className="ds-empty-state">
              <div className="ds-empty-icon">📭</div>
              <h3>No applications yet</h3>
              <p>Start applying for jobs!</p>
              <Link to="/jobs"><button className="btn-primary" style={{ marginTop: '1rem' }}>Browse Jobs</button></Link>
            </div>
          ) : (
            <div className="ds-section-card">
              <div className="ds-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Company</th>
                      <th>Location</th>
                      <th>Applied On</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app._id}>
                        <td><strong>{app.job ? app.job.title : `${app.jobTitle || 'Deleted Job'} (Closed)`}</strong></td>
                        <td>{app.job?.company ? app.job.company.name : (app.companyName || 'Deleted Company')}</td>
                        <td>{app.job?.company ? (app.job.company.location || '-') : 'N/A'}</td>
                        <td>{new Date(app.createdAt).toLocaleDateString('en-IN')}</td>
                        <td><span className={`badge ${statusClass[app.status] || 'badge-pending'}`}>{app.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== SAVED JOBS ===== */}
      {tab === 'saved' && (
        <div>
          <div className="ds-page-title-row">
            <h2>Saved Jobs</h2>
            <span className="ds-count-badge">{savedJobs.length}</span>
          </div>
          {savedJobs.length === 0 ? (
            <div className="ds-empty-state">
              <div className="ds-empty-icon">🔖</div>
              <h3>No saved jobs</h3>
              <p>Save jobs you like to apply later</p>
            </div>
          ) : (
            <div className="ds-cards-grid">
              {savedJobs.map((saved) =>
                saved.job && (
                  <div key={saved._id} className="ds-job-card">
                    <div className="ds-job-card-top">
                      <div className="ds-job-avatar">{saved.job.company?.name?.[0] || '?'}</div>
                      <div>
                        <h4>{saved.job.title}</h4>
                        <p className="ds-job-company">{saved.job.company?.name}</p>
                      </div>
                    </div>
                    <p className="ds-job-location">📍 {saved.job.location}</p>
                    <div className="ds-job-actions">
                      <Link to={`/jobs/${saved.job._id}`}><button className="btn-primary" style={{ fontSize: '0.82rem', padding: '0.4rem 0.9rem' }}>View</button></Link>
                      <Link to={`/apply/${saved.job._id}`}><button className="btn-secondary" style={{ fontSize: '0.82rem', padding: '0.4rem 0.9rem' }}>Apply</button></Link>
                      <button className="btn-danger" style={{ fontSize: '0.82rem', padding: '0.4rem 0.9rem' }} onClick={() => handleUnsave(saved.job._id)}>Remove</button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}

      {/* ===== PROFILE ===== */}
      {tab === 'profile' && profile && (
        <div>
          <div className="ds-page-title-row">
            <h2>My Profile</h2>
            {!isEditing && (
              <button className="btn-secondary" style={{ fontSize: '0.85rem' }} onClick={handleEditClick}>✏️ Edit Profile</button>
            )}
          </div>
          <div className="ds-profile-wrap">
            {isEditing ? (
              <div className="ds-section-card" style={{ maxWidth: 640 }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Edit Profile</h3>
                <form onSubmit={handleProfileSubmit}>
                  <div className="form-group"><label>Name</label><input type="text" name="name" value={editForm.name} onChange={handleInputChange} required /></div>
                  <div className="form-group"><label>Email (Read-only)</label><input type="text" value={profile.email} disabled style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }} /></div>
                  <div className="form-group"><label>Phone</label><input type="text" name="phone" value={editForm.phone} onChange={handleInputChange} placeholder="Enter phone number" /></div>
                  <div className="form-group"><label>Skills (Comma-separated)</label><input type="text" name="skills" value={editForm.skills} onChange={handleInputChange} placeholder="e.g. React, Node.js, MongoDB" /></div>
                  <div className="form-group"><label>Experience</label><textarea name="experience" value={editForm.experience} onChange={handleInputChange} rows="3" placeholder="Describe your work experience..." /></div>
                  <div className="form-group"><label>Education</label><textarea name="education" value={editForm.education} onChange={handleInputChange} rows="3" placeholder="Describe your education details..." /></div>
                  <div className="form-group">
                    <label>Upload Resume (PDF, DOC, DOCX - Max 5MB)</label>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{ padding: '0.4rem' }} />
                    {profile.resumeUrl && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        Current: <a href={`http://localhost:5000${profile.resumeUrl}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>View Resume</a>
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : '💾 Save Changes'}</button>
                    <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)} disabled={saving}>Cancel</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="ds-profile-grid">
                <div className="ds-section-card ds-profile-hero">
                  <div className="ds-profile-avatar-lg">{(user?.name || 'U')[0].toUpperCase()}</div>
                  <h3>{profile.name}</h3>
                  <p className="ds-profile-email">{profile.email}</p>
                  {profile.phone && <p className="ds-profile-phone">📞 {profile.phone}</p>}
                  {profile.resumeUrl ? (
                    <a href={`http://localhost:5000${profile.resumeUrl}`} target="_blank" rel="noreferrer" className="ds-resume-btn">📄 View Resume</a>
                  ) : (
                    <p className="ds-no-resume">No resume uploaded</p>
                  )}
                </div>
                <div className="ds-profile-details">
                  <div className="ds-section-card">
                    <h4 className="ds-detail-heading">Skills</h4>
                    <div className="tag-list" style={{ marginTop: '0.5rem' }}>
                      {profile.skills?.length > 0
                        ? profile.skills.map((s, i) => <span key={i} className="tag">{s}</span>)
                        : <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No skills added yet</span>}
                    </div>
                  </div>
                  <div className="ds-section-card">
                    <h4 className="ds-detail-heading">Experience</h4>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginTop: '0.5rem', fontSize: '0.9rem' }}>{profile.experience || 'Not provided'}</p>
                  </div>
                  <div className="ds-section-card">
                    <h4 className="ds-detail-heading">Education</h4>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginTop: '0.5rem', fontSize: '0.9rem' }}>{profile.education || 'Not provided'}</p>
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

export default CandidateDashboard;
