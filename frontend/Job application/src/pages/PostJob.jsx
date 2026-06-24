import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { postJob } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

const NAV_ITEMS = [
  { key: 'overview',    icon: '📊', label: 'Overview' },
  { key: 'jobs',        icon: '💼', label: 'My Jobs' },
  { key: 'applicants',  icon: '👥', label: 'Applicants' },
];

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary: '',
    jobType: 'Full-time',
    category: '',
    deadline: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await postJob(form);
      toast.success('Job posted successfully!');
      navigate('/company-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      navItems={NAV_ITEMS}
      activeTab=""
      onTabChange={() => navigate('/company-dashboard')}
      title="Post a New Job 📝"
      subtitle="Fill in the details to attract the best candidates"
    >
      <div style={{ maxWidth: 700 }}>
        {error && <div className="alert alert-error">{error}</div>}

        <div className="ds-section-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Job Title *</label>
              <input
                name="title"
                type="text"
                placeholder="e.g. Frontend Developer, Data Analyst"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location *</label>
                <input
                  name="location"
                  type="text"
                  placeholder="e.g. Mumbai, Remote"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Salary Range</label>
                <input
                  name="salary"
                  type="text"
                  placeholder="e.g. ₹5-8 LPA"
                  value={form.salary}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Job Type *</label>
                <select name="jobType" value={form.jobType} onChange={handleChange}>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Remote</option>
                  <option>Internship</option>
                  <option>Contract</option>
                </select>
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  name="category"
                  type="text"
                  placeholder="e.g. Technology, Finance"
                  value={form.category}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Application Deadline</label>
              <input
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Job Description *</label>
              <textarea
                name="description"
                placeholder="Describe the role, responsibilities, and what you are looking for..."
                value={form.description}
                onChange={handleChange}
                style={{ minHeight: 150 }}
                required
              />
            </div>

            <div className="form-group">
              <label>Requirements</label>
              <textarea
                name="requirements"
                placeholder="List the skills, experience, and qualifications needed..."
                value={form.requirements}
                onChange={handleChange}
                style={{ minHeight: 120 }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                type="submit"
                className="btn-primary"
                style={{ flex: 1, padding: '0.75rem', fontSize: '1rem' }}
                disabled={loading}
              >
                {loading ? 'Posting...' : '🚀 Post Job'}
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '0.75rem 1.5rem' }}
                onClick={() => navigate('/company-dashboard')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PostJob;
