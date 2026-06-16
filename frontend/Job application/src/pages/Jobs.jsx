import { useState, useEffect } from 'react';
import { getJobs } from '../services/api';
import JobCard from '../components/JobCard';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (location) params.location = location;
      if (jobType) params.jobType = jobType;
      const res = await getJobs(params);
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Browse Jobs</h1>
          <p>Find the perfect opportunity for you</p>
        </div>

        {/* Search Bar */}
        <form className="search-bar" onSubmit={handleSearch}>
          <div className="form-group">
            <label>Job Title / Keywords</label>
            <input type="text" placeholder="e.g. React Developer" value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input type="text" placeholder="e.g. Mumbai, Remote" value={location}
              onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Job Type</label>
            <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Remote">Remote    </option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">🔍 Search</button>
        </form>

        {loading ? (
          <div className="loading">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="empty">
            <h3>No jobs found</h3>
            <p>Try different search terms</p>
          </div>
        ) : (
          <>
            <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
              Found <strong>{jobs.length}</strong> job{jobs.length !== 1 ? 's' : ''}
            </p>
            <div className="jobs-grid">
              {jobs.map((job) => <JobCard key={job._id} job={job} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Jobs;
