/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getJobById, applyForJob, uploadResume } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ApplyJob = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getJobById(id).then((res) => setJob(res.data)).catch(() => toast.error('Job not found'));
  }, [id]);

  const handleUpload = async () => {
    if (!resumeFile) return toast.error('Please select a resume file');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      const res = await uploadResume(formData);
      setResumeUrl(res.data.resumeUrl);
      toast.success('Resume uploaded!');
    } catch (err) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!resumeUrl) return setError('Please upload your resume first');
    setSubmitting(true);
    try {
      await applyForJob({
        jobId: id,
        coverLetter,
        resumeUrl,
        candidateEmail: user.email,
      });
      toast.success('Application submitted successfully!');
      navigate('/candidate-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (!job) return <div className="loading">Loading...</div>;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 700 }}>
        <Link to={`/jobs/${id}`} style={{ color: 'var(--primary)', fontWeight: 600, display: 'inline-block', marginBottom: '1rem' }}>
          ← Back to Job
        </Link>

        <div className="page-header">
          <h1>Apply for Job</h1>
          <p>Applying for: <strong>{job.title}</strong> at <strong>{job.company?.name}</strong></p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="card">
          <form onSubmit={handleSubmit}>
            {/* Resume Upload */}
            <div className="form-group">
              <label>Upload Resume (PDF, DOC, DOCX)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files[0])}
                style={{ padding: '0.5rem 0' }}
              />
              <button
                type="button"
                className="btn-secondary"
                style={{ marginTop: '0.5rem' }}
                onClick={handleUpload}
                disabled={uploading || !resumeFile}
              >
                {uploading ? 'Uploading...' : '📤 Upload Resume'}
              </button>
              {resumeUrl && (
                <div className="alert alert-success" style={{ marginTop: '0.5rem' }}>
                  ✅ Resume uploaded successfully!
                </div>
              )}
            </div>

            <div className="divider"></div>

            {/* Cover Letter */}
            <div className="form-group">
              <label>Cover Letter (Optional)</label>
              <textarea
                placeholder="Tell the employer why you are a great fit for this role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                style={{ minHeight: 160 }}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : '🚀 Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;
