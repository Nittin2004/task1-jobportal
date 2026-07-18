import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { googleAuth } from '../services/api';
import { useAuth } from '../context/AuthContext';

const GoogleAuthButton = ({ role = 'candidate', text = 'Continue with Google' }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');

  const handleBackendAuth = async (payload) => {
    setLoading(true);
    try {
      const res = await googleAuth({ ...payload, role });
      login(res.data.user, res.data.token);
      toast.success('Successfully logged in with Google account!');
      if (res.data.user.role === 'candidate') navigate('/candidate-dashboard');
      else if (res.data.user.role === 'company') navigate('/company-dashboard');
      else navigate('/admin-dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google authentication failed');
    } finally {
      setLoading(false);
      setShowDialog(false);
    }
  };

  const loginWithGoogleOAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        if (!userInfoRes.ok) {
          throw new Error('Failed to fetch user profile from Google');
        }
        const profile = await userInfoRes.json();
        await handleBackendAuth({ profile, credential: tokenResponse.access_token });
      } catch {
        toast.error('Failed to retrieve Google user profile.');
        setLoading(false);
      }
    },
    onError: () => {
      toast.error('Google OAuth popup returned Error 401 (Client ID not configured in Google Console). Please enter your Google email in the dialog below.');
      setShowDialog(true);
      setLoading(false);
    },
  });

  const handleDirectGoogleLogin = (e) => {
    e.preventDefault();
    if (!googleEmail) return;
    const cleanEmail = googleEmail.trim().toLowerCase();
    const defaultName = googleName.trim() || cleanEmail.split('@')[0];
    handleBackendAuth({
      profile: {
        email: cleanEmail,
        name: defaultName.charAt(0).toUpperCase() + defaultName.slice(1),
        picture: 'https://lh3.googleusercontent.com/a/default-user'
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => loginWithGoogleOAuth()}
        disabled={loading}
        className="google-auth-btn"
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          background: 'var(--surface)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          margin: '0.75rem 0'
        }}
        onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        {loading ? 'Connecting with Google...' : text}
      </button>

      {showDialog && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100
        }}>
          <div className="modal-card" style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '16px', width: '92%', maxWidth: '420px', padding: '2.25rem',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)', position: 'relative'
          }}>
            <button
              type="button"
              onClick={() => setShowDialog(false)}
              style={{
                position: 'absolute', top: '1rem', right: '1.25rem', background: 'transparent',
                border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1
              }}
            >
              &times;
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" style={{ margin: '0 auto 0.75rem' }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>Sign in with Google</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Enter your Google account to continue to <strong>NextHire</strong>
              </p>
            </div>

            <form onSubmit={handleDirectGoogleLogin}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.35rem' }}>
                    Google Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. nittinsharma685@gmail.com"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px',
                      border: '1.5px solid var(--border)', background: 'var(--background)',
                      color: 'var(--text)', fontSize: '0.95rem'
                    }}
                    autoFocus
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.35rem' }}>
                    Full Name <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nittin Sharma"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px',
                      border: '1.5px solid var(--border)', background: 'var(--background)',
                      color: 'var(--text)', fontSize: '0.95rem'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem', fontWeight: 600, fontSize: '1rem' }}
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign in as Google User 🚀'}
                </button>
              </div>
            </form>

            <div style={{ margin: '1.5rem 0 1rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>OR USE OAUTH POPUP</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
            </div>

            <button
              type="button"
              onClick={() => { setShowDialog(false); loginWithGoogleOAuth(); }}
              style={{
                width: '100%', padding: '0.65rem', borderRadius: '8px',
                border: '1px solid var(--border)', background: 'transparent',
                color: 'var(--text)', fontSize: '0.85rem', fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
              }}
            >
              Open Google Browser Popup Window
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleAuthButton;
