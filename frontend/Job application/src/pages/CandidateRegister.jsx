import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerCandidate } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CandidateRegister = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await registerCandidate(form);
      login(res.data.user, res.data.token);
      toast.success('Registration successful!');
      navigate('/candidate-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className='text-center '>Create Account 👤</h1>
        <p>Register as a job seeker and start applying</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Enter your name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter you email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" placeholder="+91 9999999999" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Minimum 6 characters" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={6} required />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Register as Candidate'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
        <div className="auth-footer mt-1">
          Are you a company? <Link to="/register/company">Register as Company</Link>
        </div>
      </div>
    </div>
  );
};

export default CandidateRegister;
