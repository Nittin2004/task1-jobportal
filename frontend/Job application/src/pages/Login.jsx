import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import GoogleAuthButton from '../components/GoogleAuthButton';

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
      const res = await loginUser({ ...form, email: form.email.trim(), password: form.password.trim(), role });
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
        <p>Login to continue to NextHire</p>

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
          <>
            <div style={{ margin: '1.25rem 0 0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
            </div>
            <GoogleAuthButton role={role} text={`Continue with Google as ${role === 'candidate' ? 'Candidate' : 'Company'}`} />
            
            <div className="auth-footer" style={{ marginTop: '1.25rem' }}>
              Don't have an account?{' '}
              <Link to={`/register/${role}`}>Register here</Link>
            </div>
          </>
        )}
        {role === 'admin' && (
          <div className="auth-footer" style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
