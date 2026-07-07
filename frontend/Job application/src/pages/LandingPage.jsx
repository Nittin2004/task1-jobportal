import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Animation Variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }
  })
};

/* ── Animated counter hook ── */
function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [statsStarted, setStatsStarted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

  const jobs = useCountUp(50000, 1800, statsStarted);
  const candidates = useCountUp(1200000, 1800, statsStarted);
  const companies = useCountUp(8500, 1800, statsStarted);
  const placements = useCountUp(95, 1800, statsStarted);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (searchLocation) params.set('location', searchLocation);
    navigate(`/jobs?${params.toString()}`);
  };

  /* ── Platform Features data ── */
  const platformFeatures = [
    {
      id: 0,
      icon: '🎯',
      badge: 'PREPARATION HUB',
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      title: 'Master Every Interview Round',
      subtitle: 'From DSA to HR — prepare smarter, not harder',
      description: 'Access curated question banks for Aptitude, Core CS (DBMS, OS, CN), DSA, and HR rounds. Track your mastery with visual progress bars and intelligent spaced repetition.',
      bullets: ['500+ DSA problems with solutions', 'Topic-wise progress tracking', 'DSA Cheat Sheet & Visual Guides', 'Difficulty filters: Easy → Hard'],
      cta: 'Start Preparing',
      ctaLink: '/preparation',
      preview: [
        { label: 'DSA Progress', val: 72 },
        { label: 'Aptitude', val: 88 },
        { label: 'System Design', val: 55 },
      ],
    },
    {
      id: 1,
      icon: '📄',
      badge: 'ATS SCANNER',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      title: 'Beat the ATS, Get More Interviews',
      subtitle: 'AI-powered resume analysis in seconds',
      description: 'Upload your resume and get an instant ATS score out of 100. Discover missing keywords, weak sections, and formatting issues — with actionable tips to fix them.',
      bullets: ['Instant ATS score (0–100)', 'Keyword gap analysis', 'Radar chart skill visualization', 'Action verb & length suggestions'],
      cta: 'Scan My Resume',
      ctaLink: '/ats-scanner',
      preview: [
        { label: 'Overall ATS Score', val: 78 },
        { label: 'Keyword Match', val: 65 },
        { label: 'Formatting', val: 90 },
      ],
    },
    {
      id: 2,
      icon: '🎓',
      badge: 'ACADEMY',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      title: 'Learn In-Demand Tech Skills',
      subtitle: '6 expert-crafted courses from beginner to advanced',
      description: 'Enroll in structured courses built by industry experts. From Full Stack Web Dev to AI/ML — each course includes live projects, mentorship, and a verified certificate.',
      bullets: ['Full Stack, DSA, Data Science & more', '29,000+ students enrolled', '⭐ 4.8 avg rating across courses', 'Certificate on completion'],
      cta: 'Explore Courses',
      ctaLink: '/academy',
      preview: [
        { label: 'Course Completion', val: 84 },
        { label: 'Projects Done', val: 60 },
        { label: 'Mentor Rating', val: 96 },
      ],
    },
    {
      id: 3,
      icon: '🧑‍💼',
      badge: 'MENTORSHIP',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      title: '1-on-1 Sessions with Industry Experts',
      subtitle: 'Get personalized career guidance from top engineers',
      description: 'Connect with senior engineers from Google, Microsoft, Flipkart and more. Book mock interviews, resume reviews, and career planning sessions tailored just for you.',
      bullets: ['Mentors from FAANG & top startups', 'Mock interview + feedback', 'Resume & portfolio review', 'Flexible weekly scheduling'],
      cta: 'Find a Mentor',
      ctaLink: '/mentors',
      preview: [
        { label: 'Sessions Conducted', val: 90 },
        { label: 'Mentor Satisfaction', val: 97 },
        { label: 'Placements Helped', val: 75 },
      ],
    },
  ];

  const categories = [
    { label: '💻 Technology', value: 'Technology' },
    { label: '📐 Design / UX', value: 'Design' },
    { label: '📈 Marketing', value: 'Marketing' },
    { label: '💰 Finance', value: 'Finance' },
    { label: '🏥 Healthcare', value: 'Healthcare' },
    { label: '🌐 Remote', value: 'Remote' },
    { label: '⚡ Startups', value: 'Startups' },
    { label: '🎓 Fresher', value: 'Fresher' },
  ];

  const testimonials = [
    { stars: 5, text: '"NextHire completely changed my career trajectory. I uploaded my resume and within a week, I had three interviews lined up. Now I\'m working at my dream company!"', name: 'Sarah Jenkins', role: 'Frontend Developer', initials: 'SJ', color: '#6366f1' },
    { stars: 5, text: '"The ATS Scanner showed me exactly why my resume wasn\'t getting callbacks. Fixed the issues, and my response rate jumped from 5% to 40% in two weeks!"', name: 'Rahul Verma', role: 'Software Engineer', initials: 'RV', color: '#10b981' },
    { stars: 5, text: '"The Academy DSA course and mentorship sessions helped me crack Amazon\'s interview. Went from zero offers to 3 competing offers!"', name: 'Priya Sharma', role: 'SDE @ Amazon', initials: 'PS', color: '#f59e0b' },
  ];

  const trustedBy = ['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Razorpay', 'Zepto', 'Swiggy', 'Meesho'];

  const faqs = [
    {
      question: "Is NextHire completely free for job seekers?",
      answer: "Yes! Creating a candidate profile, practicing DSA problems, scanning your resume with our AI ATS scanner, and applying to unlimited jobs is 100% free forever."
    },
    {
      question: "How does the AI ATS Resume Scanner work?",
      answer: "Our scanner evaluates your resume against industry-standard ATS algorithms. It provides an instant score out of 100, identifies missing critical keywords, and highlights formatting gaps so you can optimize your resume before submitting."
    },
    {
      question: "Can companies post jobs and scout talent directly?",
      answer: "Absolutely. Verified companies can register, post job openings, manage applications through a dedicated company dashboard, and filter candidates based on verified preparation scores."
    },
    {
      question: "How accurate are the DSA preparation tracks?",
      answer: "Our question banks are curated from real interview rounds of top tech companies (MAANG, startups, and unicorns). Questions are categorized by topic and difficulty, equipped with detailed solutions and visual cheat sheets."
    },
    {
      question: "How do mentorship sessions work?",
      answer: "You can browse verified industry mentors from leading tech giants, check their availability, and book 1-on-1 mock interviews, resume reviews, or career guidance sessions directly through the platform."
    }
  ];

  const activeFeature = platformFeatures[activeTab];

  return (
    <div className="lp-root">

      {/* ═══════════ HERO ═══════════ */}
      <section className="lp-hero">
        {/* Animated background blobs */}
        <div className="lp-blob lp-blob-1" />
        <div className="lp-blob lp-blob-2" />
        <div className="lp-blob lp-blob-3" />

        <div className="lp-hero-inner">
          <motion.div
            className="lp-hero-content"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="lp-badge">
              <span className="lp-badge-dot" />
              ✅ &nbsp;2,400 new jobs added this week
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="lp-h1">
              Find Your{' '}
              <span className="lp-h1-gradient">Dream Job</span>
              <br />& Level Up Your Career
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="lp-hero-sub">
              The <strong>all-in-one career platform</strong> — job search, interview prep, resume scoring, courses, and mentorship — all in one place.
            </motion.p>

            {/* Search Bar */}
            <motion.form variants={fadeUp} custom={3} className="lp-search" onSubmit={handleSearch}>
              <div className="lp-search-field">
                <span>🔍</span>
                <input
                  type="text"
                  placeholder="Job title, skills, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="lp-search-sep" />
              <div className="lp-search-field">
                <span>📍</span>
                <input
                  type="text"
                  placeholder="City or Remote"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
              <button type="submit" className="lp-search-btn">Search Jobs</button>
            </motion.form>

            <motion.div variants={fadeUp} custom={4} className="lp-hero-btns">
              <Link to="/jobs"><button className="lp-btn-white">Browse All Jobs</button></Link>
              {!user && <Link to="/register/candidate"><button className="lp-btn-outline">Get Started Free →</button></Link>}
            </motion.div>

            {/* Quick-access feature chips */}
            <motion.div variants={fadeUp} custom={5} className="lp-quick-chips">
              <span className="lp-chip" onClick={() => navigate('/preparation')}>🎯 Prep Hub</span>
              <span className="lp-chip" onClick={() => navigate('/ats-scanner')}>📄 ATS Scanner</span>
              <span className="lp-chip" onClick={() => navigate('/academy')}>🎓 Academy</span>
              <span className="lp-chip" onClick={() => navigate('/mentors')}>🧑‍💼 Mentors</span>
              <span className="lp-chip" onClick={() => navigate('/dsa')}>💻 DSA Sheet</span>
            </motion.div>
          </motion.div>

          {/* Hero Right — Floating Cards */}
          <motion.div
            className="lp-hero-cards"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div className="lp-float-card lp-fc-1" animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}>
              <div className="lp-fc-icon">🎯</div>
              <div>
                <div className="lp-fc-title">Prep Hub</div>
                <div className="lp-fc-sub">500+ DSA problems</div>
              </div>
            </motion.div>
            <motion.div className="lp-float-card lp-fc-2" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut', delay: 0.5 }}>
              <div className="lp-fc-icon">📊</div>
              <div>
                <div className="lp-fc-title">ATS Score</div>
                <div className="lp-fc-sub">Resume: 87/100</div>
              </div>
            </motion.div>
            <motion.div className="lp-float-card lp-fc-3" animate={{ y: [0, -14, 0] }} transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut', delay: 1 }}>
              <div className="lp-fc-icon">🎓</div>
              <div>
                <div className="lp-fc-title">Academy</div>
                <div className="lp-fc-sub">6 expert courses</div>
              </div>
            </motion.div>
            <motion.div className="lp-float-card lp-fc-4" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut', delay: 0.8 }}>
              <div className="lp-fc-icon">🧑‍💼</div>
              <div>
                <div className="lp-fc-title">Mentors</div>
                <div className="lp-fc-sub">From Google & FAANG</div>
              </div>
            </motion.div>
            {/* Central glow card */}
            <div className="lp-center-card">
              <div className="lp-cc-num">50K+</div>
              <div className="lp-cc-label">Live Jobs</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ TRUSTED BY ═══════════ */}
      <div className="lp-trusted">
        <span className="lp-trusted-label">Trusted by engineers at</span>
        <div className="lp-trusted-scroll">
          {[...trustedBy, ...trustedBy].map((name, i) => (
            <span key={i} className="lp-trusted-name">{name}</span>
          ))}
        </div>
      </div>

      {/* ═══════════ ANIMATED STATS ═══════════ */}
      <motion.section
        className="lp-stats"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        onViewportEnter={() => setStatsStarted(true)}
        variants={staggerContainer}
      >
        {[
          { val: `${jobs.toLocaleString()}+`, label: 'Jobs Posted', icon: '💼' },
          { val: `${(candidates / 1000000).toFixed(1)}M+`, label: 'Candidates', icon: '👥' },
          { val: `${companies.toLocaleString()}+`, label: 'Companies Hiring', icon: '🏢' },
          { val: `${placements}%`, label: 'Placement Success', icon: '🚀' },
        ].map((s, i) => (
          <motion.div key={s.label} variants={scaleIn} custom={i} className="lp-stat-item">
            <div className="lp-stat-icon">{s.icon}</div>
            <div className="lp-stat-num">{s.val}</div>
            <div className="lp-stat-label">{s.label}</div>
          </motion.div>
        ))}
      </motion.section>

      <div className="lp-container">

        {/* ═══════════ PLATFORM FEATURES — INTERACTIVE TABS ═══════════ */}
        <motion.section
          className="lp-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="lp-section-header">
            <div className="lp-section-kicker">🚀 Everything You Need</div>
            <h2 className="lp-section-title">One Platform, Infinite Career Growth</h2>
            <p className="lp-section-sub">From your first job search to cracking FAANG — NextHire has every tool you need.</p>
          </motion.div>

          {/* Tab Selector */}
          <motion.div variants={fadeUp} custom={1} className="lp-feature-tabs">
            {platformFeatures.map((f, i) => (
              <button
                key={f.id}
                className={`lp-feature-tab ${activeTab === i ? 'active' : ''}`}
                style={activeTab === i ? { '--tab-color': f.color } : {}}
                onClick={() => setActiveTab(i)}
              >
                <span className="lp-ft-icon">{f.icon}</span>
                <span>{f.badge}</span>
              </button>
            ))}
          </motion.div>

          {/* Feature Detail Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="lp-feature-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="lp-fp-left">
                <div className="lp-fp-badge" style={{ background: activeFeature.gradient }}>
                  {activeFeature.badge}
                </div>
                <h3 className="lp-fp-title">{activeFeature.title}</h3>
                <p className="lp-fp-subtitle">{activeFeature.subtitle}</p>
                <p className="lp-fp-desc">{activeFeature.description}</p>
                <ul className="lp-fp-bullets">
                  {activeFeature.bullets.map((b, i) => (
                    <li key={i}>
                      <span className="lp-fp-check" style={{ color: activeFeature.color }}>✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <Link to={activeFeature.ctaLink}>
                  <button className="lp-fp-cta" style={{ background: activeFeature.gradient }}>
                    {activeFeature.cta} →
                  </button>
                </Link>
              </div>

              {/* Preview bars */}
              <div className="lp-fp-right">
                <div className="lp-fp-preview-card" style={{ borderTop: `4px solid ${activeFeature.color}` }}>
                  <div className="lp-fp-preview-header">
                    <span style={{ fontSize: '2rem' }}>{activeFeature.icon}</span>
                    <div>
                      <div className="lp-fp-preview-title">{activeFeature.title}</div>
                      <div className="lp-fp-preview-sub">{activeFeature.subtitle}</div>
                    </div>
                  </div>
                  {activeFeature.preview.map((p, i) => (
                    <div key={i} className="lp-fp-bar-row">
                      <div className="lp-fp-bar-label">
                        <span>{p.label}</span>
                        <span style={{ color: activeFeature.color, fontWeight: 700 }}>{p.val}%</span>
                      </div>
                      <div className="lp-fp-bar-bg">
                        <motion.div
                          className="lp-fp-bar-fill"
                          style={{ background: activeFeature.gradient }}
                          initial={{ width: 0 }}
                          animate={{ width: `${p.val}%` }}
                          transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </div>
                  ))}
                  <Link to={activeFeature.ctaLink} style={{ display: 'block', marginTop: '1.25rem' }}>
                    <button className="lp-fp-preview-btn" style={{ borderColor: activeFeature.color, color: activeFeature.color }}>
                      {activeFeature.cta} →
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.section>

        {/* ═══════════ FEATURE CARDS GRID ═══════════ */}
        <motion.section
          className="lp-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="lp-section-header">
            <div className="lp-section-kicker">🛠 Tools & Features</div>
            <h2 className="lp-section-title">Everything You Need to Land the Job</h2>
          </motion.div>

          <div className="lp-feat-grid">
            {[
              { icon: '🔍', title: 'Smart Job Search', desc: 'Filter thousands of jobs by role, salary, location and skills with powerful search tools.', link: '/jobs', color: '#6366f1' },
              { icon: '🎯', title: 'Preparation Hub', desc: 'Master Aptitude, DBMS, OS, CN, DSA and HR rounds with topic-wise question banks.', link: '/preparation', color: '#8b5cf6' },
              { icon: '📄', title: 'ATS Resume Scanner', desc: 'Get an instant resume score and learn exactly what to fix to beat the ATS filters.', link: '/ats-scanner', color: '#10b981' },
              { icon: '🎓', title: 'Academy Courses', desc: '6 structured courses — Full Stack, DSA, Data Science, DevOps and more with certificates.', link: '/academy', color: '#f59e0b' },
              { icon: '🧑‍💼', title: '1-on-1 Mentorship', desc: 'Book sessions with senior engineers from Google, Microsoft and top startups.', link: '/mentors', color: '#ef4444' },
              { icon: '💻', title: 'DSA Cheat Sheet', desc: 'The ultimate visual reference — all algorithms, complexities, and patterns in one page.', link: '/dsa', color: '#06b6d4' },
              { icon: '📊', title: 'Application Tracker', desc: 'Monitor all your applications and their status in a clean, unified dashboard.', link: '/candidate-dashboard', color: '#84cc16' },
              { icon: '🏆', title: 'DSA Leaderboard', desc: 'Compete with peers, track your rank, and see how you stack up globally.', link: '/preparation/leaderboard', color: '#f97316' },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                className="lp-feat-card"
                variants={scaleIn}
                custom={i}
                whileHover={{ y: -6, boxShadow: `0 20px 40px ${f.color}20` }}
                onClick={() => navigate(f.link)}
              >
                <div className="lp-feat-card-icon" style={{ background: `${f.color}15`, color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="lp-feat-card-title">{f.title}</h3>
                <p className="lp-feat-card-desc">{f.desc}</p>
                <span className="lp-feat-card-arrow" style={{ color: f.color }}>→</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══════════ HOW IT WORKS ═══════════ */}
        <motion.section
          className="lp-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="lp-section-header">
            <div className="lp-section-kicker">📖 How It Works</div>
            <h2 className="lp-section-title">Get Hired in 4 Simple Steps</h2>
            <p className="lp-section-sub">Everything is designed to get you from zero to offer letter as fast as possible.</p>
          </motion.div>

          <div className="lp-steps-grid">
            {[
              { step: '01', icon: '👤', title: 'Create Your Profile', desc: 'Sign up in 60 seconds. Add your resume, skills, and the roles you\'re targeting.' },
              { step: '02', icon: '📄', title: 'Scan & Improve Resume', desc: 'Run your resume through the ATS Scanner and fix the issues holding you back.' },
              { step: '03', icon: '🎯', title: 'Prepare with Confidence', desc: 'Use the Prep Hub, DSA sheet, and mock mentorship sessions to ace every round.' },
              { step: '04', icon: '🚀', title: 'Apply & Get Hired', desc: 'Apply to matching jobs with one click and track all your applications in real time.' },
            ].map((item, i) => (
              <motion.div key={item.step} variants={fadeUp} custom={i} className="lp-step-card">
                <div className="lp-step-num">{item.step}</div>
                <div className="lp-step-icon">{item.icon}</div>
                <h3 className="lp-step-title">{item.title}</h3>
                <p className="lp-step-desc">{item.desc}</p>
                {i < 3 && <div className="lp-step-connector" />}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══════════ CATEGORY PILLS ═══════════ */}
        <motion.section
          className="lp-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="lp-section-header">
            <div className="lp-section-kicker">🗂 Job Categories</div>
            <h2 className="lp-section-title">Explore by Category</h2>
            <p className="lp-section-sub">Click a category to instantly find matching jobs</p>
          </motion.div>
          <motion.div variants={fadeUp} custom={1} className="lp-category-pills">
            {categories.map((cat) => (
              <motion.button
                key={cat.value}
                className="lp-cat-pill"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.value)}`)}
              >
                {cat.label}
              </motion.button>
            ))}
          </motion.div>
        </motion.section>

        {/* ═══════════ INDUSTRIES HIRING ═══════════ */}
        <motion.section
          className="lp-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="lp-section-header">
            <div className="lp-section-kicker">🏭 Industries</div>
            <h2 className="lp-section-title">Top Industries Hiring Now</h2>
            <p className="lp-section-sub">Explore active opportunities across every sector</p>
          </motion.div>
          <motion.div className="lp-industries-grid" variants={staggerContainer}>
            {[
              { name: 'MNCs', count: '2.3K+ actively hiring', icon: '🌐' },
              { name: 'Fintech', count: '150 actively hiring', icon: '💳' },
              { name: 'FMCG & Retail', count: '189 actively hiring', icon: '🛒' },
              { name: 'Startups', count: '810 actively hiring', icon: '🚀' },
              { name: 'Edtech', count: '174 actively hiring', icon: '📚' },
              { name: 'Healthcare', count: '725 actively hiring', icon: '🏥' },
              { name: 'Unicorns', count: '102 actively hiring', icon: '🦄' },
              { name: 'B2C Products', count: '2.5K+ actively hiring', icon: '📱' },
              { name: 'Internet', count: '235 actively hiring', icon: '🌍' },
              { name: 'Manufacturing', count: '1.3K+ actively hiring', icon: '🏭' },
              { name: 'Fortune 500', count: '120 actively hiring', icon: '🏆' },
              { name: 'Banking & Finance', count: '443 actively hiring', icon: '🏦' },
            ].map((cat, i) => (
              <motion.div
                key={cat.name}
                variants={scaleIn}
                custom={i}
                className="lp-industry-card"
                whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(99,102,241,0.12)' }}
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.name)}`)}
              >
                <div className="lp-ind-icon">{cat.icon}</div>
                <div className="lp-ind-info">
                  <span className="lp-ind-name">{cat.name}</span>
                  <span className="lp-ind-count">{cat.count}</span>
                </div>
                <span className="lp-ind-arrow">→</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ═══════════ TESTIMONIALS ═══════════ */}
        <motion.section
          className="lp-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="lp-section-header">
            <div className="lp-section-kicker">💬 Success Stories</div>
            <h2 className="lp-section-title">What Our Users Say</h2>
            <p className="lp-section-sub">Real stories from real candidates and companies</p>
          </motion.div>
          <div className="lp-testimonials-grid">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="lp-testimonial-card"
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6 }}
              >
                <div className="lp-t-quote">"</div>
                <div className="lp-t-stars">{'★'.repeat(t.stars)}</div>
                <p className="lp-t-text">{t.text}</p>
                <div className="lp-t-author">
                  <div className="lp-t-avatar" style={{ background: t.color }}>{t.initials}</div>
                  <div>
                    <div className="lp-t-name">{t.name}</div>
                    <div className="lp-t-role">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══════════ MEET THE FOUNDER V4 (Neon Flashy) ═══════════ */}
        <motion.section
          className="lp-section lp-neon-founder"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="lp-nf-container">
            <motion.div className="lp-nf-card" variants={fadeUp} whileHover={{ y: -5 }}>
              <div className="lp-nf-glow-bg"></div>
              <div className="lp-nf-content">
                
                <div className="lp-nf-left">
                  <div className="lp-nf-img-box">
                    <img src="/nittin.jpeg" alt="Nittin Sharma" className="lp-nf-img" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=400&q=80"; }} />
                    <div className="lp-nf-floating-badge">👑 FOUNDER</div>
                  </div>
                </div>

                <div className="lp-nf-right">
                  <div className="lp-nf-greeting">👋 Hello World, I'm</div>
                  <h2 className="lp-nf-name">Nittin Sharma</h2>
                  <h3 className="lp-nf-role">Software Engineer & Founder</h3>
                  
                  <div className="lp-nf-details-grid">
                    <div className="lp-nf-detail-item">
                      <span className="lp-nf-icon">🎓</span>
                      <div className="lp-nf-detail-text">
                        <span className="lp-nf-label">Education</span>
                        <span className="lp-nf-value">B.Tech / Computer Science</span>
                      </div>
                    </div>
                    <div className="lp-nf-detail-item">
                      <span className="lp-nf-icon">💼</span>
                      <div className="lp-nf-detail-text">
                        <span className="lp-nf-label">Profession</span>
                        <span className="lp-nf-value">Full Stack Developer</span>
                      </div>
                    </div>
                  </div>

                  <p className="lp-nf-bio">
                    Welcome to my brainchild, <strong>NextHire</strong>. I designed this platform to bridge the gap between learning DSA and cracking the interview. No more switching tabs—everything you need is right here.
                  </p>

                  <div className="lp-nf-skills-wrap">
                    <span className="lp-nf-skills-title">Technical Skills:</span>
                    <div className="lp-nf-tech-stack" style={{marginBottom: 0}}>
                      <span>⚡ MERN Stack</span>
                      <span>🎨 UI/UX</span>
                      <span>💻 Competitive Coding</span>
                      <span>🚀 Next.js</span>
                    </div>
                  </div>

                  <div className="lp-nf-buttons">
                    <a href="https://linkedin.com/in/" target="_blank" rel="noreferrer" className="lp-nf-btn primary">
                      Connect on LinkedIn 🚀
                    </a>
                    <a href="https://github.com/Nittin2004" target="_blank" rel="noreferrer" className="lp-nf-btn secondary">
                      View GitHub
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ═══════════ PREMIUM PRICING PLANS ═══════════ */}
        <motion.section
          className="lp-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="lp-section-header">
            <div className="lp-section-kicker">⚡ LEVEL UP YOUR CAREER</div>
            <h2 className="lp-section-title">Choose Your Preparation Tier</h2>
            <p className="lp-section-sub">Flexible column-wise premium options for DSA & Academy Courses</p>
          </motion.div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem', maxWidth: '1150px', margin: '3.5rem auto 0', padding: '0 1rem'
          }}>
            {/* LITE PLAN */}
            <motion.div variants={fadeUp} custom={0} style={{
              background: 'var(--card-bg, rgba(30, 41, 59, 0.7))',
              backdropFilter: 'blur(16px)', borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)', padding: '2.5rem 2rem',
              display: 'flex', flexDirection: 'column', position: 'relative',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)', transition: 'all 0.3s ease'
            }} whileHover={{ y: -8, borderColor: 'rgba(99, 102, 241, 0.4)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Lite</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', margin: '1rem 0 0.5rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>₹499</span>
                <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>/month</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', minHeight: '44px', marginBottom: '2rem', lineHeight: 1.5 }}>
                Essential tools for beginners starting their DSA journey.
              </p>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '2rem' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, marginBottom: '2.5rem' }}>
                {['100+ Core DSA Questions', 'Judge0 Code Sandbox Access', 'Community Forum Support', 'Standard Course Access'].map(feat => (
                  <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#cbd5e1', fontSize: '0.95rem' }}>
                    <span style={{ color: '#6366f1', fontWeight: 'bold' }}>✓</span> {feat}
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/preparation')} style={{
                width: '100%', padding: '0.9rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)',
                background: 'transparent', color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                transition: 'all 0.2s'
              }}>Get Started Lite</button>
            </motion.div>

            {/* PRO PLAN (RECOMMENDED / GLOW) */}
            <motion.div variants={fadeUp} custom={1} style={{
              background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
              backdropFilter: 'blur(20px)', borderRadius: '24px',
              border: '2px solid #6366f1', padding: '2.5rem 2rem',
              display: 'flex', flexDirection: 'column', position: 'relative',
              boxShadow: '0 0 40px rgba(99, 102, 241, 0.25)', transform: 'scale(1.03)', zIndex: 2
            }} whileHover={{ y: -8, boxShadow: '0 0 60px rgba(99, 102, 241, 0.4)' }}>
              <div style={{
                position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff',
                padding: '0.35rem 1.2rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800,
                letterSpacing: '0.08em', boxShadow: '0 4px 12px rgba(99,102,241,0.5)'
              }}>⭐ MOST POPULAR</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pro</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', margin: '1rem 0 0.5rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>₹999</span>
                <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>/month</span>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.92rem', minHeight: '44px', marginBottom: '2rem', lineHeight: 1.5 }}>
                Complete DSA mastery + full Academy course unlock.
              </p>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.12)', marginBottom: '2rem' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, marginBottom: '2.5rem' }}>
                {[
                  'All 500+ Premium DSA Problems',
                  'Unlimited Lightning Code Compiles',
                  'All Academy Courses & Video Solutions',
                  'Company-Specific Interview Mocks',
                  'AI Resume & Cover Letter Scanner'
                ].map(feat => (
                  <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fff', fontSize: '0.95rem', fontWeight: 500 }}>
                    <span style={{ color: '#818cf8', fontWeight: 'bold' }}>✓</span> {feat}
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/preparation')} style={{
                width: '100%', padding: '1rem', borderRadius: '12px', border: 'none',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: '#fff',
                fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)', transition: 'all 0.2s'
              }}>Upgrade to Pro 🚀</button>
            </motion.div>

            {/* ULTRA PLAN */}
            <motion.div variants={fadeUp} custom={2} style={{
              background: 'var(--card-bg, rgba(30, 41, 59, 0.7))',
              backdropFilter: 'blur(16px)', borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)', padding: '2.5rem 2rem',
              display: 'flex', flexDirection: 'column', position: 'relative',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)', transition: 'all 0.3s ease'
            }} whileHover={{ y: -8, borderColor: 'rgba(236, 72, 153, 0.4)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f472b6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ultra</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', margin: '1rem 0 0.5rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>₹1,999</span>
                <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>/month</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', minHeight: '44px', marginBottom: '2rem', lineHeight: 1.5 }}>
                VIP treatment with 1-on-1 mentorship & job referrals.
              </p>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '2rem' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, marginBottom: '2.5rem' }}>
                {[
                  'Everything included in Pro Plan',
                  '1-on-1 Mentorship Call with Founder',
                  'Direct Job Referrals to Top MNCs',
                  '24/7 Dedicated Mentorship Chat',
                  'Verified Certificate of Excellence'
                ].map(feat => (
                  <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#cbd5e1', fontSize: '0.95rem' }}>
                    <span style={{ color: '#ec4899', fontWeight: 'bold' }}>✓</span> {feat}
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/mentors')} style={{
                width: '100%', padding: '0.9rem', borderRadius: '12px', border: '1px solid rgba(236, 72, 153, 0.4)',
                background: 'rgba(236, 72, 153, 0.1)', color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                transition: 'all 0.2s'
              }}>Go Ultra VIP ⭐</button>
            </motion.div>
          </div>
        </motion.section>

        {/* ═══════════ FREQUENTLY ASKED QUESTIONS ═══════════ */}
        <motion.section
          className="lp-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="lp-section-header">
            <div className="lp-section-kicker">❓ Got Questions?</div>
            <h2 className="lp-section-title">Frequently Asked Questions</h2>
            <p className="lp-section-sub">Everything you need to know about NextHire</p>
          </motion.div>
          <div className="lp-faq-list">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className={`lp-faq-card ${openFaq === i ? 'open' : ''}`}
              >
                <button
                  type="button"
                  className="lp-faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.question}</span>
                  <span className="lp-faq-icon">↓</span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="lp-faq-answer-wrap"
                    >
                      <p className="lp-faq-answer">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══════════ CTA BANNER ═══════════ */}
        {!user && (
          <motion.section
            className="lp-cta-banner"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="lp-cta-glow" />
            <motion.h2 animate={{ scale: [1, 1.01, 1] }} transition={{ repeat: Infinity, duration: 3 }}>
              Ready to Land Your Dream Job?
            </motion.h2>
            <p>Join over 1.2 million candidates and 8,500+ companies on NextHire today. It's completely free to get started.</p>
            <div className="lp-cta-btns">
              <Link to="/register/candidate">
                <motion.button className="lp-cta-btn-primary" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  👤 Register as Candidate
                </motion.button>
              </Link>
              <Link to="/register/company">
                <motion.button className="lp-cta-btn-secondary" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  🏢 Post Jobs as Company
                </motion.button>
              </Link>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
