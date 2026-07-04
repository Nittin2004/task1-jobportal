import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import CandidateRegister from './pages/CandidateRegister';
import CompanyRegister from './pages/CompanyRegister';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import ApplyJob from './pages/ApplyJob';
import CandidateDashboard from './pages/CandidateDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import PostJob from './pages/PostJob';
import AdminDashboard from './pages/AdminDashboard';
import Preparation from './pages/Preparation';
import AcademyDashboard from './pages/AcademyDashboard';
import Mentorship from './pages/Mentorship';
import DSACheatSheet from './pages/DSACheatSheet';
import DSALeaderboard from './pages/DSALeaderboard';
import ResumeScanner from './pages/ResumeScanner';
import CoursePlayer from './pages/CoursePlayer';

import './index.css';

// Dashboard routes — no Navbar/Footer
const DASHBOARD_PATHS = [
  '/candidate-dashboard',
  '/company-dashboard',
  '/admin-dashboard',
  '/post-job',
];

function AppLayout() {
  const location = useLocation();
  const isDashboard = DASHBOARD_PATHS.some((p) => location.pathname.startsWith(p));
  const isDSA = location.pathname === '/dsa';

  return (
    <>
      <ScrollToTop />
    
      <Toaster position="top-right" />
      {!isDashboard && !isDSA && <Navbar />}
      <main className={isDashboard ? '' : isDSA ? 'main-content main-content--dsa' : 'main-content'}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/candidate" element={<CandidateRegister />} />
          <Route path="/register/company" element={<CompanyRegister />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/preparation" element={<Preparation />} />
          <Route path="/preparation/:module" element={<Preparation />} />
          <Route path="/academy" element={<AcademyDashboard />} />
          <Route path="/academy/course/:id" element={<CoursePlayer />} />
          <Route path="/mentors" element={<Mentorship />} />
          <Route path="/dsa" element={<DSACheatSheet />} />
          <Route path="/preparation/leaderboard" element={<DSALeaderboard />} />
          <Route path="/ats-scanner" element={<ResumeScanner />} />

          {/* Protected Routes */}
          <Route path="/apply/:id" element={
            <ProtectedRoute role="candidate">
              <ApplyJob />
            </ProtectedRoute>
          } />
          
          <Route path="/post-job" element={
            <ProtectedRoute role="company">
              <PostJob />
            </ProtectedRoute>
          } />
          
          {/* Dashboard Routes (Full Screen — no Navbar/Footer) */}
          <Route path="/candidate-dashboard" element={
            <ProtectedRoute role="candidate">
              <CandidateDashboard />
            </ProtectedRoute>
          } />

          <Route path="/company-dashboard" element={
            <ProtectedRoute role="company">
              <CompanyDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin-dashboard" element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={
            <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <h1 style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--primary)' }}>404</h1>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Page Not Found</h2>
              <p style={{ color: 'var(--text-muted)' }}>The page you are looking for does not exist or has been moved.</p>
            </div>
          } />
        </Routes>
      </main>
      {!isDashboard && !isDSA && <Footer />}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
