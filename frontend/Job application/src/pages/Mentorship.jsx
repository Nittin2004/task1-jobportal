import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { bookMentorship, getMyBookings } from '../services/api';

// ──────────────────────────────────────────────────────────────────────────────
// Static mentor catalogue
// ──────────────────────────────────────────────────────────────────────────────
const MENTORS = [
  {
    id: 'm1',
    name: 'Priya Sharma',
    initials: 'PS',
    color: '#6366f1',
    colorBg: 'rgba(99,102,241,0.12)',
    role: 'Senior SDE-III @ Google',
    experience: '8 Years Experience',
    expertise: 'DSA · System Design · FAANG Prep',
    rating: 4.9,
    sessions: 320,
    bio: 'Ex-Amazon, currently at Google. I help candidates crack FAANG interviews with focused DSA practice and system design walkthroughs. Placed 50+ students at top companies.',
    skills: ['DSA', 'System Design', 'React', 'Java', 'LLD', 'HLD'],
    availability: ['Mon', 'Wed', 'Fri'],
    sessionTypes: ['Mock Interview', 'Resume Review', 'Career Guidance'],
  },
  {
    id: 'm2',
    name: 'Arjun Mehta',
    initials: 'AM',
    color: '#10b981',
    colorBg: 'rgba(16,185,129,0.12)',
    role: 'Staff Engineer @ Microsoft',
    experience: '11 Years Experience',
    expertise: 'Backend · Distributed Systems · Cloud',
    rating: 5.0,
    sessions: 210,
    bio: 'Staff engineer with 11 years building distributed systems at Microsoft and Flipkart. Specialise in backend architecture, cloud (Azure/AWS) and startup engineering culture.',
    skills: ['Node.js', 'Kubernetes', 'Azure', 'Microservices', 'Golang', 'PostgreSQL'],
    availability: ['Tue', 'Thu', 'Sat'],
    sessionTypes: ['Mock Interview', 'Architecture Review', '1:1 Mentoring'],
  },
  {
    id: 'm3',
    name: 'Sneha Patil',
    initials: 'SP',
    color: '#f59e0b',
    colorBg: 'rgba(245,158,11,0.12)',
    role: 'Data Scientist @ Flipkart',
    experience: '6 Years Experience',
    expertise: 'ML · Python · Data Engineering',
    rating: 4.8,
    sessions: 145,
    bio: 'Passionate about helping students break into data science. I mentor on Python, machine learning pipelines, SQL and interview prep for DS/ML roles at product companies.',
    skills: ['Python', 'Machine Learning', 'SQL', 'Pandas', 'TensorFlow', 'Spark'],
    availability: ['Mon', 'Thu', 'Sun'],
    sessionTypes: ['Portfolio Review', 'ML Mock Interview', 'Study Plan'],
  },
  {
    id: 'm4',
    name: 'Rahul Verma',
    initials: 'RV',
    color: '#8b5cf6',
    colorBg: 'rgba(139,92,246,0.12)',
    role: 'Engineering Manager @ Razorpay',
    experience: '13 Years Experience',
    expertise: 'Leadership · System Design · Fintech',
    rating: 4.9,
    sessions: 180,
    bio: 'I guide both fresh grads and experienced professionals on navigating the tech career ladder — from cracking senior engineer interviews to transitioning into management.',
    skills: ['System Design', 'Java', 'Leadership', 'Agile', 'Fintech', 'Career Growth'],
    availability: ['Sat', 'Sun'],
    sessionTypes: ['Career Guidance', 'Mock Interview', 'Manager Round Prep'],
  },
  {
    id: 'm5',
    name: 'Kiran Rao',
    initials: 'KR',
    color: '#ec4899',
    colorBg: 'rgba(236,72,153,0.12)',
    role: 'Frontend Lead @ Swiggy',
    experience: '7 Years Experience',
    expertise: 'React · Performance · Frontend Arch',
    rating: 4.7,
    sessions: 98,
    bio: 'Frontend enthusiast who loves helping developers master React, performance optimisation and building accessible UIs. Former FAANG front-end interviewer.',
    skills: ['React', 'TypeScript', 'Next.js', 'CSS', 'Performance', 'Accessibility'],
    availability: ['Tue', 'Wed', 'Fri'],
    sessionTypes: ['Code Review', 'Mock Interview', 'Portfolio Review'],
  },
  {
    id: 'm6',
    name: 'Vikram Singh',
    initials: 'VS',
    color: '#0ea5e9',
    colorBg: 'rgba(14,165,233,0.12)',
    role: 'DevOps Architect @ Infosys',
    experience: '10 Years Experience',
    expertise: 'AWS · Docker · CI/CD · Terraform',
    rating: 4.8,
    sessions: 130,
    bio: 'Certified AWS Solutions Architect with deep expertise in DevOps. I simplify Kubernetes, CI/CD and cloud deployment for engineers looking to stand out in the market.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux'],
    availability: ['Mon', 'Wed', 'Sat'],
    sessionTypes: ['AWS Prep', 'Architecture Review', 'Study Plan'],
  },
];

const TOPICS = [
  'All',
  'Mock Interview',
  'Resume Review',
  'Career Guidance',
  'Code Review',
  'System Design',
  'Study Plan',
];

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '06:00 PM', '08:00 PM',
];

const StarRating = ({ rating }) => (
  <span className="mentor-stars">
    {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
    <span className="mentor-rating-num"> {rating}</span>
  </span>
);

// ──────────────────────────────────────────────────────────────────────────────
const MentorCard = ({ mentor, onBook }) => {
  const [showFull, setShowFull] = useState(false);

  return (
    <div className="mentor-card" style={{ '--mentor-color': mentor.color, '--mentor-bg': mentor.colorBg }}>
      {/* Avatar + Info */}
      <div className="mentor-card-top">
        <div className="mentor-avatar" style={{ background: `linear-gradient(135deg, ${mentor.color}, ${mentor.color}cc)` }}>
          {mentor.initials}
        </div>
        <div className="mentor-info">
          <h3 className="mentor-name">{mentor.name}</h3>
          <p className="mentor-role">{mentor.role}</p>
          <p className="mentor-exp">{mentor.experience}</p>
        </div>
      </div>

      <div className="mentor-expertise-pill">{mentor.expertise}</div>

      <p className="mentor-bio">{showFull ? mentor.bio : `${mentor.bio.slice(0, 95)}...`}
        <button className="mentor-read-more" onClick={() => setShowFull(!showFull)}>
          {showFull ? ' less' : ' more'}
        </button>
      </p>

      <div className="mentor-skills-row">
        {mentor.skills.slice(0, 4).map((s) => <span key={s} className="academy-skill-tag">{s}</span>)}
        {mentor.skills.length > 4 && <span className="academy-skill-tag" style={{ opacity: 0.6 }}>+{mentor.skills.length - 4}</span>}
      </div>

      {/* Stats row */}
      <div className="mentor-stats-row">
        <div className="mentor-stat">
          <StarRating rating={mentor.rating} />
        </div>
        <div className="mentor-stat">
          <span className="mentor-stat-num">🗓 {mentor.sessions}+</span>
          <span className="mentor-stat-lbl"> sessions</span>
        </div>
      </div>

      <div className="mentor-availability">
        {mentor.availability.map((d) => <span key={d} className="mentor-day-badge">{d}</span>)}
      </div>

      <div className="mentor-session-types">
        {mentor.sessionTypes.map((t) => <span key={t} className="mentor-session-tag">{t}</span>)}
      </div>

      <button
        className="btn-primary mentor-book-btn"
        style={{ background: mentor.color, width: '100%', marginTop: '1rem', padding: '0.75rem' }}
        onClick={() => onBook(mentor)}
      >
        📅 Book a Session
      </button>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
const BookingModal = ({ mentor, onClose, onSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ date: '', timeSlot: TIME_SLOTS[0], topic: '', sessionType: mentor.sessionTypes[0] });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to book a session');
      return navigate('/login');
    }
    setSubmitting(true);
    try {
      await bookMentorship({
        mentorId: mentor.id,
        mentorName: mentor.name,
        mentorRole: mentor.role,
        mentorAvatar: mentor.initials,
        mentorColor: mentor.color,
        ...form
      });
      toast.success(`✅ Session booked with ${mentor.name}!`);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Booking error:', err);
      toast.error('Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mentor-modal-overlay" onClick={onClose}>
      <div className="mentor-modal" onClick={(e) => e.stopPropagation()}>
        <button className="mentor-modal-close" onClick={onClose}>✕</button>

        <div className="mentor-modal-header" style={{ borderBottom: `3px solid ${mentor.color}` }}>
          <div className="mentor-avatar" style={{ background: `linear-gradient(135deg, ${mentor.color}, ${mentor.color}cc)`, width: 52, height: 52, fontSize: '1rem' }}>
            {mentor.initials}
          </div>
          <div>
            <h3>Book with {mentor.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{mentor.role}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Session Type</label>
            <select value={form.sessionType} onChange={(e) => setForm({ ...form, sessionType: e.target.value })}>
              {mentor.sessionTypes.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Preferred Date</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Time Slot</label>
              <select value={form.timeSlot} onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}>
                {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>What do you want to discuss?</label>
            <textarea
              rows="4"
              required
              placeholder={`E.g., I want to practice ${mentor.sessionTypes[0].toLowerCase()} for Product company interviews...`}
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
              style={{ flex: 1, background: mentor.color, padding: '0.75rem' }}
            >
              {submitting ? 'Booking...' : '✅ Confirm Booking'}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 0.5 }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
const Mentorship = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('All');
  const [bookingMentor, setBookingMentor] = useState(null);
  const [successCount, setSuccessCount] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [activeTab, setActiveTab] = useState('mentors'); // 'mentors' | 'bookings'

  useEffect(() => {
    if (user) {
      setLoadingBookings(true);
      getMyBookings()
        .then((res) => setBookings(res.data || []))
        .catch(() => {})
        .finally(() => setLoadingBookings(false));
    }
  }, [user, successCount]);

  const filteredMentors = filter === 'All'
    ? MENTORS
    : MENTORS.filter((m) => m.sessionTypes.some((t) => t.toLowerCase().includes(filter.toLowerCase())));

  return (
    <div className="academy-page">
      {/* ── HERO ────────────────────────────────── */}
      <div className="mentor-hero">
        <div className="academy-hero-glow" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.35) 0%, transparent 70%)' }} />
        <div className="container">
          <div className="academy-badge-pill" style={{ background: 'rgba(245,158,11,0.18)', color: '#b45309', border: '1px solid rgba(245,158,11,0.4)' }}>
            🤝 1:1 Mentorship · Career Guidance Platform
          </div>
          <h1 className="academy-hero-title">
            Learn Directly from<br />
            <span style={{ background: 'linear-gradient(90deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Industry Experts
            </span>
          </h1>
          <p className="academy-hero-sub">
            Book personalised 1:1 sessions with mentors from Google, Microsoft, Flipkart and more. Mock interviews, career guidance, code reviews — all in one place.
          </p>
          <div className="academy-hero-btns">
            <button
              className="cta-btn-primary"
              style={{ background: '#f59e0b', color: 'white' }}
              onClick={() => { setActiveTab('mentors'); document.getElementById('mentor-list').scrollIntoView({ behavior: 'smooth' }); }}
            >
              Browse Mentors ↓
            </button>
            {user && (
              <button
                className="cta-btn-primary"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text)', border: '1px solid var(--border)' }}
                onClick={() => { setActiveTab('bookings'); document.getElementById('mentor-list').scrollIntoView({ behavior: 'smooth' }); }}
              >
                📅 My Booked Sessions ({bookings.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── HOW MENTORSHIP WORKS ─────────────────── */}
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="academy-section-head">
          <h2>How Mentorship Works</h2>
          <p>Simple, fast and effective — get guidance in 3 easy steps</p>
        </div>
        <div className="how-grid">
          {[
            { step: '01', icon: '🔍', title: 'Find Your Mentor', desc: 'Browse experts by skill, company or session type. Read their bio, check their availability and pick the best match.' },
            { step: '02', icon: '📅', title: 'Book a Session', desc: 'Select a date, time slot and session type (mock interview, resume review, etc.) and confirm your booking instantly.' },
            { step: '03', icon: '🚀', title: 'Grow Your Career', desc: 'Join the video call, get personalised feedback, implement it and return for follow-up sessions to track your progress.' },
          ].map((h) => (
            <div key={h.step} className="how-card">
              <div className="how-step-number" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>STEP {h.step}</div>
              <div className="how-icon">{h.icon}</div>
              <h3>{h.title}</h3>
              <p>{h.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── MENTOR LIST / MY BOOKINGS ───────────── */}
      <div className="container" style={{ paddingBottom: '4rem' }} id="mentor-list">
        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '2px solid var(--border)', marginBottom: '2.5rem' }}>
          <button
            onClick={() => setActiveTab('mentors')}
            style={{
              padding: '0.85rem 0.5rem',
              fontSize: '1.1rem',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'mentors' ? '3px solid #f59e0b' : '3px solid transparent',
              color: activeTab === 'mentors' ? '#f59e0b' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '-2px'
            }}
          >
            🤝 Browse Mentors
          </button>
          {user && (
            <button
              onClick={() => setActiveTab('bookings')}
              style={{
                padding: '0.85rem 0.5rem',
                fontSize: '1.1rem',
                fontWeight: 700,
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'bookings' ? '3px solid #f59e0b' : '3px solid transparent',
                color: activeTab === 'bookings' ? '#f59e0b' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginBottom: '-2px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              📅 My Booked Sessions
              <span style={{ background: activeTab === 'bookings' ? '#f59e0b' : 'var(--border)', color: activeTab === 'bookings' ? 'white' : 'var(--text)', padding: '0.15rem 0.6rem', borderRadius: '999px', fontSize: '0.78rem' }}>
                {bookings.length}
              </span>
            </button>
          )}
        </div>

        {activeTab === 'bookings' && user ? (
          <div>
            <div className="academy-section-head" style={{ textAlign: 'left', marginBottom: '2rem' }}>
              <h2>My Mentorship Sessions</h2>
              <p>Your confirmed 1:1 sessions, scheduled dates, and live video meeting links</p>
            </div>

            {loadingBookings ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading your booked sessions...</div>
            ) : bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px dashed var(--border)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                <h3 style={{ marginBottom: '0.5rem' }}>No Booked Sessions Yet</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't booked any 1:1 mentorship sessions yet.</p>
                <button className="cta-btn-primary" style={{ background: '#f59e0b', color: 'white' }} onClick={() => setActiveTab('mentors')}>
                  Browse Expert Mentors
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                {bookings.map((b) => (
                  <div key={b._id} className="mentor-card" style={{ '--mentor-color': b.mentorColor || '#6366f1', '--mentor-bg': `${b.mentorColor || '#6366f1'}1f`, padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                    <div className="mentor-card-top" style={{ marginBottom: '1rem' }}>
                      <div className="mentor-avatar" style={{ background: `linear-gradient(135deg, ${b.mentorColor || '#6366f1'}, ${b.mentorColor || '#6366f1'}cc)` }}>
                        {b.mentorAvatar || 'EM'}
                      </div>
                      <div className="mentor-info">
                        <h3 className="mentor-name">{b.mentorName || 'Expert Mentor'}</h3>
                        <p className="mentor-role">{b.mentorRole || 'Industry Expert'}</p>
                        <span style={{ display: 'inline-block', padding: '0.2rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', marginTop: '0.35rem' }}>
                          ● {b.status || 'Confirmed'}
                        </span>
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem', fontSize: '0.9rem', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text)' }}>
                        <strong>🗓 Date:</strong> {b.date}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text)' }}>
                        <strong>⏰ Time:</strong> {b.timeSlot}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)' }}>
                        <strong>💡 Topic:</strong> {b.sessionType || b.topic}
                      </div>
                      {b.topic && b.topic !== (b.sessionType || '') && (
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', fontStyle: 'italic' }}>
                          Note: "{b.topic}"
                        </div>
                      )}
                    </div>

                    <a
                      href={b.meetingLink || 'https://meet.google.com/nexthire-live'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ display: 'block', textAlign: 'center', background: b.mentorColor || '#6366f1', color: 'white', padding: '0.75rem', borderRadius: '10px', fontWeight: 700, textDecoration: 'none' }}
                    >
                      📹 Join Live Video Call
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="academy-section-head">
              <h2>Our Expert Mentors</h2>
              <p>Handpicked professionals from top tech companies ready to guide you</p>
            </div>

            {/* Topic filter pills */}
            <div className="academy-filter-row">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  className={`category-pill ${filter === t ? 'academy-pill-active' : ''}`}
                  onClick={() => setFilter(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="mentor-grid">
              {filteredMentors.map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  onBook={setBookingMentor}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── TESTIMONIALS ─────────────────────────── */}
      <div style={{ background: 'var(--bg)', padding: '4rem 0' }}>
        <div className="container">
          <div className="academy-section-head">
            <h2>What Our Learners Say</h2>
            <p>Real results from real students who got mentored on our platform</p>
          </div>
          <div className="testimonials-grid">
            {[
              { quote: 'My mock interviews with Priya were transformational. I went from freezing up to confidently solving DP problems. Got hired at Amazon 3 months later!', name: 'Rohan D.', role: 'SDE @ Amazon', avatar: 'RD', bg: '#6366f1' },
              { quote: 'Arjun helped me understand distributed systems in a way no book could. His architectural diagrams were crystal clear. Recommended for anyone targeting Microsoft or Flipkart.', name: 'Ananya K.', role: 'Backend Engineer @ Microsoft', avatar: 'AK', bg: '#10b981' },
              { quote: 'I changed careers from marketing to data science. Sneha designed a custom 3-month study plan for me. Best investment I have ever made.', name: 'Divya M.', role: 'Data Scientist @ Flipkart', avatar: 'DM', bg: '#f59e0b' },
            ].map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">"{t.quote}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: t.bg }}>{t.avatar}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA BANNER ──────────────────────────── */}
      <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
        <div className="cta-banner" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }}>
          <div className="cta-glow" />
          <h2>Your Mentor is Waiting for You</h2>
          <p>Join hundreds of learners who unlocked their potential through personalised guidance.</p>
          <div className="cta-btns">
            <button
              className="cta-btn-primary"
              onClick={() => document.getElementById('mentor-list').scrollIntoView({ behavior: 'smooth' })}
            >
              Find a Mentor Now
            </button>
          </div>
        </div>
      </div>

      {/* ── BOOKING MODAL ───────────────────────── */}
      {bookingMentor && (
        <BookingModal
          mentor={bookingMentor}
          onClose={() => setBookingMentor(null)}
          onSuccess={() => setSuccessCount(c => c + 1)}
        />
      )}
    </div>
  );
};

export default Mentorship;
