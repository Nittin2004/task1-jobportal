import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import App from './App.jsx';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '386932037035-k8v833noqjk7m4nn75ukvk9r1p5j5f2e.apps.googleusercontent.com';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
);
