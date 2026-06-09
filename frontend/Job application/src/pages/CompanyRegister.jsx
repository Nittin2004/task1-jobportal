import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerCompany } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CompanyRegister = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', industry: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await registerCompany(form);
      login(res.data.user, res.data.token);
      toast.success('Company registered successfully!');
      navigate('/company-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Register Company 🏢</h1>
        <p>Post jobs and find the best candidates</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name</label>
            <input type="text" placeholder="Acme Corp" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="hr@company.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" placeholder="+91 9999999999" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Industry</label>
              <input type="text" placeholder="e.g. Technology, Finance" value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" placeholder="e.g. Mumbai, Remote" value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Minimum 6 characters" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={6} required />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem' }} disabled={loading}>
            {loading ? 'Registering...' : 'Register Company'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegister;
