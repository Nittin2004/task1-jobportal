import { useState, useEffect } from 'react';
import { getJobs } from '../services/api';
import JobCard from '../components/JobCard';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  const fetchJobs = async (pageNum = 1) => {
    setLoading(true);
    try {
      const params = { page: pageNum, limit: 6 };
      if (search) params.search = search;
      if (location) params.location = location;
      if (jobType) params.jobType = jobType;
      const res = await getJobs(params);
      
      // If backend returned paginated object { data, total, page, pages }
      if (res.data && res.data.data) {
        setJobs(res.data.data);
        setPage(res.data.page || pageNum);
        setTotalPages(res.data.pages || 1);
        setTotalJobs(res.data.total || res.data.data.length);
      } else {
        // Fallback if backend returned array
        setJobs(Array.isArray(res.data) ? res.data : []);
        setPage(1);
        setTotalPages(1);
        setTotalJobs(Array.isArray(res.data) ? res.data.length : 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(1); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(1);
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
              Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalJobs} total job{totalJobs !== 1 ? 's' : ''})
            </p>
            <div className="jobs-grid">
              {jobs.map((job) => <JobCard key={job._id} job={job} />)}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginTop: '3rem', paddingBottom: '2rem'
              }}>
                <button
                  disabled={page <= 1}
                  onClick={() => { fetchJobs(page - 1); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                  style={{
                    padding: '0.6rem 1.25rem', borderRadius: '8px', border: '1px solid var(--border)',
                    background: page <= 1 ? 'transparent' : 'var(--primary)',
                    color: page <= 1 ? 'var(--text-muted)' : '#fff',
                    fontWeight: 600, cursor: page <= 1 ? 'not-allowed' : 'pointer',
                    opacity: page <= 1 ? 0.4 : 1, transition: 'all 0.2s',
                  }}
                >
                  ← Previous
                </button>
                <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => { fetchJobs(page + 1); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                  style={{
                    padding: '0.6rem 1.25rem', borderRadius: '8px', border: '1px solid var(--border)',
                    background: page >= totalPages ? 'transparent' : 'var(--primary)',
                    color: page >= totalPages ? 'var(--text-muted)' : '#fff',
                    fontWeight: 600, cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                    opacity: page >= totalPages ? 0.4 : 1, transition: 'all 0.2s',
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Jobs;
