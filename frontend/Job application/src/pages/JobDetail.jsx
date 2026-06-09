import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getJobById, saveJob, unsaveJob, getSavedJobs } from '../services/api';
import { useAuth } from '../context/AuthContext';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await getJobById(id);
        setJob(res.data);
      } catch (err) {
        toast.error('Job not found');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();

    if (user?.role === 'candidate') {
      getSavedJobs().then((res) => {
        setIsSaved(res.data.some((s) => s.job?._id === id));
      }).catch(() => {});
    }
  }, [id]);

  const handleSave = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      if (isSaved) {
        await unsaveJob(id);
        setIsSaved(false);
        toast.success('Job removed from saved');
      } else {
        await saveJob(id);
        setIsSaved(true);
        toast.success('Job saved!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  if (loading) return <div className="loading">Loading job details...</div>;
  if (!job) return <div className="empty"><h3>Job not found</h3></div>;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 800 }}>
        <Link to="/jobs" style={{ color: 'var(--primary)', fontWeight: 600, display: 'inline-block', marginBottom: '1rem' }}>
          ← Back to Jobs
        </Link>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{job.title}</h1>
              <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1.1rem', marginTop: '0.25rem' }}>
                {job.company?.name}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              {user?.role === 'candidate' && (
                <button className="btn-secondary" onClick={handleSave}>
                  {isSaved ? '❤️ Saved' : '🤍 Save Job'}
                </button>
              )}
              {user?.role === 'candidate' && (
                <Link to={`/apply/${id}`}>
                  <button className="btn-primary" style={{ padding: '0.6rem 1.5rem' }}>Apply Now →</button>
                </Link>
              )}
              {!user && (
                <Link to="/login">
                  <button className="btn-primary" style={{ padding: '0.6rem 1.5rem' }}>Login to Apply</button>
                </Link>
              )}
            </div>
          </div>

          <div className="job-meta" style={{ marginBottom: '1.5rem' }}>
            <span>📍 {job.location}</span>
            {job.salary && <span>💰 {job.salary}</span>}
            <span>💼 {job.jobType}</span>
            <span>🗂 {job.category}</span>
            {job.deadline && <span>⏰ Deadline: {new Date(job.deadline).toLocaleDateString('en-IN')}</span>}
          </div>

          <div className="divider"></div>

          <div className="detail-section">
            <h3>Job Description</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{job.description}</p>
          </div>

          {job.requirements && (
            <div className="detail-section">
              <h3>Requirements</h3>
              <p style={{ whiteSpace: 'pre-line' }}>{job.requirements}</p>
            </div>
          )}

          {job.company?.description && (
            <div className="detail-section">
              <h3>About the Company</h3>
              <p>{job.company.description}</p>
            </div>
          )}

          {job.company?.website && (
            <div className="detail-section">
              <h3>Company Website</h3>
              <a href={job.company.website} target="_blank" rel="noreferrer" className="resume-link">
                {job.company.website}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
