import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { enrollInCourse } from '../services/api';

// ──────────────────────────────────────────────────────────────────────────────
// Static course catalogue (displayed even before backend data seeds)
// ──────────────────────────────────────────────────────────────────────────────
const COURSES = [
  {
    id: 'fullstack',
    emoji: '🌐',
    title: 'Full Stack Web Development',
    subtitle: 'React · Node.js · MongoDB',
    difficulty: 'Beginner',
    difficultyClass: 'badge-shortlisted',
    duration: '9 Months',
    modules: 12,
    students: '8,200+',
    rating: 4.9,
    color: '#6366f1',
    colorBg: 'rgba(99,102,241,0.08)',
    description: 'Go from zero to full-stack engineer. Build real-world projects using React, Node.js, Express and MongoDB — the exact stack top companies hire for.',
    skills: ['React', 'Node.js', 'MongoDB', 'REST APIs', 'Git', 'Deployment'],
    highlights: ['Live interactive classes', 'Build 5 capstone projects', 'Career coaching included', 'Certificate on completion'],
  },
  {
    id: 'dsa',
    emoji: '🌳',
    title: 'Data Structures & Algorithms',
    subtitle: 'Crack FAANG Interviews',
    difficulty: 'Intermediate',
    difficultyClass: 'badge-reviewed',
    duration: '5 Months',
    modules: 10,
    students: '12,500+',
    rating: 4.8,
    color: '#10b981',
    colorBg: 'rgba(16,185,129,0.08)',
    description: 'Master arrays, trees, graphs, dynamic programming and system design patterns. Crack coding rounds at Google, Amazon, Microsoft and more.',
    skills: ['Arrays & Strings', 'Linked Lists', 'Trees & Graphs', 'DP', 'System Design', 'LLD'],
    highlights: ['500+ curated problems', 'Mock FAANG interviews', 'Company-specific prep', 'Weekly leaderboard'],
  },
  {
    id: 'datascience',
    emoji: '📊',
    title: 'Data Science & Machine Learning',
    subtitle: 'Python · Pandas · Scikit-learn',
    difficulty: 'Intermediate',
    difficultyClass: 'badge-reviewed',
    duration: '7 Months',
    modules: 11,
    students: '5,400+',
    rating: 4.7,
    color: '#f59e0b',
    colorBg: 'rgba(245,158,11,0.08)',
    description: 'Learn data wrangling, visualization, ML algorithms and model deployment. Build a portfolio of end-to-end ML projects that impress employers.',
    skills: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'SQL'],
    highlights: ['Real-world datasets', 'Kaggle competition prep', 'Capstone ML project', 'Industry mentors'],
  },
  {
    id: 'backend',
    emoji: '⚙️',
    title: 'Backend Engineering',
    subtitle: 'Node.js · Databases · DevOps',
    difficulty: 'Advanced',
    difficultyClass: 'badge-rejected',
    duration: '6 Months',
    modules: 9,
    students: '3,100+',
    rating: 4.9,
    color: '#8b5cf6',
    colorBg: 'rgba(139,92,246,0.08)',
    description: 'Deep dive into scalable backend systems — microservices, message queues, caching, CI/CD pipelines, Dockerisation and cloud deployment.',
    skills: ['Node.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'Kafka'],
    highlights: ['Architect production systems', 'Real startup codebase', 'DevOps track included', 'Placement guarantee*'],
  },
  {
    id: 'devops',
    emoji: '☁️',
    title: 'DevOps & Cloud Engineering',
    subtitle: 'AWS · Docker · Kubernetes',
    difficulty: 'Advanced',
    difficultyClass: 'badge-rejected',
    duration: '4 Months',
    modules: 8,
    students: '2,000+',
    rating: 4.6,
    color: '#ec4899',
    colorBg: 'rgba(236,72,153,0.08)',
    description: 'Master CI/CD, containerisation, orchestration and cloud infrastructure. Become the DevOps engineer every startup desperately needs.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Monitoring'],
    highlights: ['Hands-on AWS labs', 'Deploy to production', 'Infrastructure as Code', 'Cloud certifications prep'],
  },
  {
    id: 'systemdesign',
    emoji: '🏗️',
    title: 'System Design Masterclass',
    subtitle: 'HLD · LLD · Scalability',
    difficulty: 'Advanced',
    difficultyClass: 'badge-rejected',
    duration: '3 Months',
    modules: 7,
    students: '6,800+',
    rating: 5.0,
    color: '#0ea5e9',
    colorBg: 'rgba(14,165,233,0.08)',
    description: 'Design WhatsApp, Netflix, Uber and Instagram at scale. Master high-level and low-level design concepts to crack senior engineering interviews.',
    skills: ['HLD', 'LLD', 'Load Balancing', 'CAP Theorem', 'SQL vs NoSQL', 'Caching'],
    highlights: ['10+ real case studies', 'Design review sessions', 'Interview-ready in weeks', 'Top 1% mentors'],
  },
];

const STATS = [
  { value: '38,000+', label: 'Active Learners' },
  { value: '94%', label: 'Placement Rate' },
  { value: '6 LPA+', label: 'Avg. Salary Hike' },
  { value: '200+', label: 'Hiring Partners' },
];

const HOW_IT_WORKS = [
  { step: '01', icon: '📝', title: 'Take the Entrance Test', desc: 'A quick 30-min skill assessment helps us place you in the right batch — Beginner, Intermediate or Advanced.' },
  { step: '02', icon: '🎓', title: 'Follow Your Track', desc: 'Learn through live classes, recorded lectures, hands-on coding labs and weekly assignments guided by industry experts.' },
  { step: '03', icon: '🏆', title: 'Get Hired', desc: 'Build your portfolio, clear mock interviews, earn verified badges and get placed through our network of 200+ hiring partners.' },
];

// ──────────────────────────────────────────────────────────────────────────────

const StarRating = ({ rating }) => (
  <span className="academy-stars">
    {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
    <span className="academy-rating-num"> {rating}</span>
  </span>
);

const CourseCard = ({ course, onEnroll, onViewCourse }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="academy-course-card" style={{ '--course-color': course.color, '--course-bg': course.colorBg }}>
      <div className="academy-card-header">
        <div className="academy-card-emoji" style={{ background: course.colorBg, color: course.color }}>
          {course.emoji}
        </div>
        <span className={`badge ${course.difficultyClass}`}>{course.difficulty}</span>
      </div>

      <h3 className="academy-card-title">{course.title}</h3>
      <p className="academy-card-subtitle">{course.subtitle}</p>

      <div className="academy-card-meta">
        <span>🕐 {course.duration}</span>
        <span>📚 {course.modules} Modules</span>
        <span>👥 {course.students} enrolled</span>
      </div>

      <p className="academy-card-desc">{course.description}</p>

      <div className="academy-skills">
        {course.skills.map((s) => <span key={s} className="academy-skill-tag">{s}</span>)}
      </div>

      {expanded && (
        <ul className="academy-highlights">
          {course.highlights.map((h) => (
            <li key={h}><span className="academy-check">✓</span> {h}</li>
          ))}
        </ul>
      )}

      <div className="academy-card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <StarRating rating={course.rating} />
          <button
            className="academy-details-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Less ▲' : 'Details ▼'}
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {course.enrolled ? (
            <button
              className="btn-primary academy-enroll-btn"
              onClick={() => onViewCourse(course)}
              style={{ background: '#10b981', color: '#fff', border: 'none', flex: 1, padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Start Learning ▶
            </button>
          ) : (
            <>
              <button
                className="btn-primary academy-enroll-btn"
                style={{ background: course.color, flex: 1 }}
                onClick={() => onEnroll(course)}
              >
                Enroll Free
              </button>
              <button
                className="btn-secondary academy-enroll-btn"
                onClick={() => onViewCourse(course)}
                style={{ border: `1px solid ${course.color}`, color: course.color, background: 'transparent', flex: 1, padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                View Course
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
const AcademyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [enrolledIds, setEnrolledIds] = useState([]);

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filtered = filter === 'All'
    ? COURSES
    : COURSES.filter(c => c.difficulty === filter);

  const handleEnroll = async (course) => {
    if (!user) {
      toast.error('Please login to enroll in a track');
      return navigate('/login');
    }
    if (enrolledIds.includes(course.id)) {
      toast('Already enrolled!', { icon: 'ℹ️' });
      return;
    }
    try {
      // Optimistic UI
      setEnrolledIds(prev => [...prev, course.id]);
      toast.success(`🎉 Enrolled in ${course.title}!`);
      // Try backend (optional — won't break if course isn't in DB yet)
      await enrollInCourse(course.id).catch(() => {});
    } catch {
      toast.error('Enrollment failed');
    }
  };

  const handleViewCourse = (course) => {
    if (!user) {
      toast.error('Please login to view courses');
      return navigate('/login');
    }
    if (!enrolledIds.includes(course.id)) {
      toast.error('You must enroll in this course first!');
      return;
    }
    navigate(`/academy/course/${course.id}`);
  };

  return (
    <div className="academy-page">
      {/* ── HERO ────────────────────────────────── */}
      <div className="academy-hero">
        <div className="academy-hero-glow" />
        <div className="container">
          <div className="academy-badge-pill">🎓 Tech Upskilling Platform · Career Accelerator</div>
          <h1 className="academy-hero-title">
            Structured Paths to<br />
            <span className="hero-highlight">Your Dream Tech Job</span>
          </h1>
          <p className="academy-hero-sub">
            Master in-demand skills with live classes, industry mentors, hands-on projects and a placement network trusted by 38,000+ learners.
          </p>
          <div className="academy-hero-btns">
            <button className="cta-btn-primary" onClick={() => document.getElementById('academy-courses').scrollIntoView({ behavior: 'smooth' })}>
              Explore Tracks ↓
            </button>
            <Link to="/mentors">
              <button className="cta-btn-secondary">Book a Free Session</button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── STATS BAND ──────────────────────────── */}
      <div className="stats-section">
        <div className="container">
          <div className="stats-band">
            {STATS.map((s, i) => (
              <div key={i} className="stat-item">
                <div className="stat-big">{s.value}</div>
                <div className="stat-desc">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ─────────────────────────── */}
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="academy-section-head">
          <h2>How It Works</h2>
          <p>From enrollment to placement in 3 simple steps</p>
        </div>
        <div className="how-grid">
          {HOW_IT_WORKS.map((h) => (
            <div key={h.step} className="how-card">
              <div className="how-step-number">STEP {h.step}</div>
              <div className="how-icon">{h.icon}</div>
              <h3>{h.title}</h3>
              <p>{h.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── COURSES ──────────────────────────────── */}
      <div className="container" style={{ paddingBottom: '4rem' }} id="academy-courses">
        <div className="academy-section-head">
          <h2>Choose Your Track</h2>
          <p>Vetted curriculum built with industry leaders at top tech companies</p>
        </div>

        {/* Difficulty filter pills */}
        <div className="academy-filter-row">
          {difficulties.map((d) => (
            <button
              key={d}
              className={`category-pill ${filter === d ? 'academy-pill-active' : ''}`}
              onClick={() => setFilter(d)}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="academy-courses-grid">
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={{ ...course, enrolled: enrolledIds.includes(course.id) }}
              onEnroll={handleEnroll}
              onViewCourse={handleViewCourse}
            />
          ))}
        </div>
      </div>

      {/* ── CTA BANNER ──────────────────────────── */}
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <div className="cta-banner">
          <div className="cta-glow" />
          <h2>Ready to Accelerate Your Career?</h2>
          <p>Join 38,000+ learners who upskilled and got hired through our structured programs.</p>
          <div className="cta-btns">
            {user ? (
              <button className="cta-btn-primary" onClick={() => document.getElementById('academy-courses').scrollIntoView({ behavior: 'smooth' })}>
                Start Learning Now
              </button>
            ) : (
              <Link to="/register/candidate">
                <button className="cta-btn-primary">Sign Up for Free</button>
              </Link>
            )}
            <Link to="/mentors">
              <button className="cta-btn-secondary">Talk to a Mentor</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademyDashboard;
