import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('candidate');
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser({ ...form, role });
      login(res.data.user, res.data.token);
      toast.success('Login successful!');
      if (res.data.user.role === 'candidate') navigate('/candidate-dashboard');
      else if (res.data.user.role === 'company') navigate('/company-dashboard');
      else navigate('/admin-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className='hd text-center'>Login</h1>
        <p>Login to continue to JobPortal</p>

        <div className="role-tabs">
          {['candidate', 'company', 'admin'].map((r) => (
            <button key={r} className={`role-tab ${role === r ? 'active' : ''}`} onClick={() => setRole(r)}>
              {r === 'candidate' ? '👤 Candidate' : r === 'company' ? '🏢 Company' : '⚙️ Admin'}
            </button>
          ))}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {role !== 'admin' && (
          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to={`/register/${role}`}>Register here</Link>
          </div>
        )}
        {role === 'admin' && (
          <div className="auth-footer" style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Admin: admin@jobportal.com / Admin@123
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
