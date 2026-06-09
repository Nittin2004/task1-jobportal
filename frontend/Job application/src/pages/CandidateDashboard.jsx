import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getMyApplications, getSavedJobs, unsaveJob, getProfile, updateProfile, uploadResume } from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusClass = {
  Pending: 'badge-pending',
  Reviewed: 'badge-reviewed',
  Shortlisted: 'badge-shortlisted',
  Rejected: 'badge-rejected',
  Hired: 'badge-hired',
};

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '', skills: '', experience: '', education: '' });
  const [resumeFile, setResumeFile] = useState(null);
  const [saving, setSaving] = useState(false);

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
      } catch (err) {
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

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // 1. Upload resume if selected
      if (resumeFile) {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        await uploadResume(formData);
      }

      // 2. Update profile fields
      const skillsArray = editForm.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await updateProfile({
        name: editForm.name,
        phone: editForm.phone,
        skills: skillsArray,
        experience: editForm.experience,
        education: editForm.education,
      });

      // 3. Fetch updated profile
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

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Welcome, {user?.name} 👋</h1>
            <p>Manage your applications and saved jobs</p>
          </div>
          <Link to="/jobs">
            <button className="btn-primary">🔍 Browse Jobs</button>
          </Link>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{applications.length}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{applications.filter(a => a.status === 'Shortlisted' || a.status === 'Hired').length}</div>
            <div className="stat-label">Shortlisted / Hired</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{savedJobs.length}</div>
            <div className="stat-label">Saved Jobs</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{applications.filter(a => a.status === 'Pending').length}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab-btn ${tab === 'applications' ? 'active' : ''}`} onClick={() => setTab('applications')}>
            📋 My Applications
          </button>
          <button className={`tab-btn ${tab === 'saved' ? 'active' : ''}`} onClick={() => setTab('saved')}>
            ❤️ Saved Jobs
          </button>
          <button className={`tab-btn ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
            👤 Profile
          </button>
        </div>

        {/* Applications Tab */}
        {tab === 'applications' && (
          <div>
            {applications.length === 0 ? (
              <div className="empty">
                <h3>No applications yet</h3>
                <p>Start applying for jobs!</p>
                <Link to="/jobs"><button className="btn-primary" style={{ marginTop: '1rem' }}>Browse Jobs</button></Link>
              </div>
            ) : (
              <div className="card table-wrap">
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
                        <td>
                          <strong>{app.job ? app.job.title : `${app.jobTitle || 'Deleted Job'} (Closed)`}</strong>
                        </td>
                        <td>
                          {app.job?.company ? app.job.company.name : (app.companyName || 'Deleted Company')}
                        </td>
                        <td>
                          {app.job?.company ? (app.job.company.location || '-') : 'N/A'}
                        </td>
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
        )}

        {/* Saved Jobs Tab */}
        {tab === 'saved' && (
          <div>
            {savedJobs.length === 0 ? (
              <div className="empty">
                <h3>No saved jobs</h3>
                <p>Save jobs you like to apply later</p>
              </div>
            ) : (
              <div className="jobs-grid">
                {savedJobs.map((saved) => (
                  saved.job && (
                    <div key={saved._id} className="card">
                      <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{saved.job.title}</h3>
                      <p style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>{saved.job.company?.name}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>📍 {saved.job.location}</p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/jobs/${saved.job._id}`}><button className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>View Job</button></Link>
                        <Link to={`/apply/${saved.job._id}`}><button className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>Apply</button></Link>
                        <button className="btn-danger" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }} onClick={() => handleUnsave(saved.job._id)}>Remove</button>
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {tab === 'profile' && profile && (
          isEditing ? (
            <div className="card" style={{ maxWidth: 600 }}>
              <h2 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Edit Profile</h2>
              <form onSubmit={handleProfileSubmit}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email (Read-only)</label>
                  <input type="text" value={profile.email} disabled style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="form-group">
                  <label>Skills (Comma-separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={editForm.skills}
                    onChange={handleInputChange}
                    placeholder="e.g. React, Node.js, Express, MongoDB"
                  />
                </div>
                <div className="form-group">
                  <label>Experience</label>
                  <textarea
                    name="experience"
                    value={editForm.experience}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Describe your work experience..."
                  />
                </div>
                <div className="form-group">
                  <label>Education</label>
                  <textarea
                    name="education"
                    value={editForm.education}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Describe your education details..."
                  />
                </div>
                <div className="form-group">
                  <label>Upload Resume (PDF, DOC, DOCX - Max 5MB)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    style={{ padding: '0.4rem' }}
                  />
                  {profile.resumeUrl && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Current resume: <a href={`http://localhost:5000${profile.resumeUrl}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>View Current Resume</a>
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : '💾 Save Changes'}
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)} disabled={saving}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="card" style={{ maxWidth: 600 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h2 style={{ fontWeight: 700, margin: 0 }}>My Profile</h2>
                <button className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }} onClick={handleEditClick}>
                  ✏️ Edit Profile
                </button>
              </div>
              <div className="form-group"><label>Name</label><input type="text" value={profile.name} readOnly /></div>
              <div className="form-group"><label>Email</label><input type="text" value={profile.email} readOnly /></div>
              <div className="form-group"><label>Phone</label><input type="text" value={profile.phone || 'Not provided'} readOnly /></div>
              <div className="form-group">
                <label>Skills</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {profile.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill, i) => (
                      <span key={i} style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No skills added yet</span>
                  )}
                </div>
              </div>
              <div className="form-group"><label>Experience</label><textarea value={profile.experience || 'Not provided'} readOnly rows="3" style={{ resize: 'none' }} /></div>
              <div className="form-group"><label>Education</label><textarea value={profile.education || 'Not provided'} readOnly rows="3" style={{ resize: 'none' }} /></div>
              {profile.resumeUrl ? (
                <div className="form-group">
                  <label>Resume</label>
                  <div style={{ marginTop: '0.25rem' }}>
                    <a href={`http://localhost:5000${profile.resumeUrl}`} target="_blank" rel="noreferrer" className="resume-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
                      📄 View Resume
                    </a>
                  </div>
                </div>
              ) : (
                <div className="form-group">
                  <label>Resume</label>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'block', marginTop: '0.25rem' }}>No resume uploaded yet</span>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
