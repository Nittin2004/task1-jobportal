import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const typeColor = {
    'Full-time': '#10b981',
    'Part-time': '#f59e0b',
    'Remote': '#6366f1',
    'Internship': '#ec4899',
    'Contract': '#f97316',
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div>
          <h3 className="job-title">{job.title}</h3>
          <p className="job-company">{job.company?.name || 'Company'}</p>
        </div>
        <span className="job-type-badge" style={{ backgroundColor: typeColor[job.jobType] || '#6366f1' }}>
          {job.jobType}
        </span>
      </div>

      <div className="job-meta">
        <span>📍 {job.location}</span>
        {job.salary && <span>💰 {job.salary}</span>}
        <span>🗂 {job.category}</span>
      </div>

      <p className="job-desc">{job.description?.slice(0, 120)}...</p>

      <div className="job-card-footer">
        <span className="job-date">Posted {formatDate(job.createdAt)}</span>
        <Link to={`/jobs/${job._id}`} className="btn-view">View Job →</Link>
      </div>
    </div>
  );
};
//
export default JobCard;
