import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { sendOtp, registerCandidate } from '../services/api';
import { useAuth } from '../context/AuthContext';
import GoogleAuthButton from '../components/GoogleAuthButton';

const CandidateRegister = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Form details, 2: OTP verification
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', otp: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devInfoOtp, setDevInfoOtp] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await sendOtp({ email: form.email.trim(), role: 'candidate' });
      if (res.data.devOtp) {
        setDevInfoOtp(res.data.devOtp);
        console.log('--- Dev OTP Code ---', res.data.devOtp);
      }
      toast.success('Verification OTP sent to your email!');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    const toastId = toast.loading('Resending OTP code...');
    try {
      const res = await sendOtp({ email: form.email.trim(), role: 'candidate' });
      if (res.data.devOtp) setDevInfoOtp(res.data.devOtp);
      toast.success('New OTP sent to your email!', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP code', { id: toastId });
    }
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    if (!form.otp || form.otp.trim().length < 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await registerCandidate({
        ...form,
        email: form.email.trim(),
        otp: form.otp.trim(),
      });
      login(res.data.user, res.data.token);
      toast.success('Registration & verification successful!');
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
        <h1 className="text-center">Create Account 👤</h1>
        <p>{step === 1 ? 'Register as a job seeker and start applying' : `Verify email sent to ${form.email}`}</p>

        {error && <div className="alert alert-error">{error}</div>}

        {step === 1 ? (
          <>
            <form onSubmit={handleSendOtp}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 9999999999"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  minLength={6}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '0.75rem', fontWeight: 600 }}
                disabled={loading}
              >
                {loading ? 'Sending Verification Code...' : 'Send OTP & Continue ➡️'}
              </button>
            </form>

            <div style={{ margin: '1.25rem 0 0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
            </div>

            <GoogleAuthButton role="candidate" text="Sign up with Google" />

            <div className="auth-footer" style={{ marginTop: '1.25rem' }}>
              Already have an account? <Link to="/login">Login</Link>
            </div>
            <div className="auth-footer mt-1">
              Are you a company? <Link to="/register/company">Register as Company</Link>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmitRegistration}>
            {devInfoOtp && (
              <div
                style={{
                  background: 'var(--background)',
                  border: '1px dashed var(--primary)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  textAlign: 'center',
                  fontSize: '0.85rem',
                  color: 'var(--text)',
                }}
              >
                💡 <strong>Dev Mode verification code:</strong>{' '}
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary)', letterSpacing: '2px' }}>
                  {devInfoOtp}
                </span>
              </div>
            )}

            <div className="form-group" style={{ textAlign: 'center', margin: '1.5rem 0' }}>
              <label style={{ marginBottom: '0.75rem', display: 'block', fontWeight: 600 }}>
                Enter 6-Digit OTP Verification Code
              </label>
              <input
                type="text"
                placeholder="000000"
                maxLength={6}
                value={form.otp}
                onChange={(e) => setForm({ ...form, otp: e.target.value.replace(/\D/g, '') })}
                style={{
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  letterSpacing: '8px',
                  fontWeight: 700,
                  padding: '0.75rem',
                  width: '80%',
                  margin: '0 auto',
                  display: 'block',
                  borderRadius: '10px',
                  border: '2px solid var(--primary)',
                  background: 'var(--background)',
                }}
                autoFocus
                required
              />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                We sent a verification code to <strong>{form.email}</strong>. Check your inbox or spam folder.
              </p>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontWeight: 600, fontSize: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Verifying & Registering...' : 'Verify OTP & Complete Registration ✅'}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', fontSize: '0.85rem' }}>
              <button
                type="button"
                onClick={handleResendOtp}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
              >
                🔄 Resend OTP Code
              </button>
              <button
                type="button"
                onClick={() => { setStep(1); setError(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
              >
                ✏️ Change Email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CandidateRegister;
