import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

/* ── Intersection observer hook ── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  /* Section refs for scroll animations */
  const [statsRef, statsInView] = useInView();
  const [featuresRef, featuresInView] = useInView();
  const [howRef, howInView] = useInView();
  const [companiesRef, companiesInView] = useInView();
  const [testimonialsRef, testimonialsInView] = useInView();
  const [ctaRef, ctaInView] = useInView();
  const [categoriesRef, categoriesInView] = useInView();

  /* Animated counters */
  const jobs = useCountUp(50000, 1800, statsInView);
  const candidates = useCountUp(1200000, 1800, statsInView);
  const companies = useCountUp(8500, 1800, statsInView);
  const placements = useCountUp(95, 1800, statsInView);

  const slides = ['/slide1.png', '/slide2.png', '/slide3.png', '/slide4.png'];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (searchLocation) params.set('location', searchLocation);
    navigate(`/jobs?${params.toString()}`);
  };

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
    {
      stars: 5,
      text: '"JobPortal completely changed my career trajectory. I uploaded my resume and within a week, I had three interviews lined up. I\'m now working at my dream company!"',
      name: 'Sarah Jenkins',
      role: 'Frontend Developer',
      initials: 'SJ',
      color: '#6366f1',
    },
    {
      stars: 5,
      text: '"As a hiring manager, the quality of candidates we get from this platform is unmatched. The application tracking system is also super intuitive and saves us hours every week."',
      name: 'Michael Chen',
      role: 'HR Director, TechFlow',
      initials: 'MC',
      color: '#10b981',
    },
    {
      stars: 5,
      text: '"I had been job hunting for months. JobPortal\'s smart filters helped me find the perfect role in just 10 days. Absolutely love this platform!"',
      name: 'Priya Sharma',
      role: 'Data Analyst',
      initials: 'PS',
      color: '#f59e0b',
    },
  ];

  const trustedBy = ['TechFlow', 'FinEdge', 'MediCore', 'StartupX', 'CloudBase', 'NovaTech'];

  return (
    <div>
      {/* ═══════════ HERO ═══════════ */}
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">✅ 2,400 new jobs added this week</div>
          <h1>
            Find Your <span className="hero-highlight">Dream Job</span><br />Today
          </h1>
          <p>Connect with top companies and kickstart your career journey. Explore thousands of hand-picked listings across every industry.</p>

          {/* Hero Search Bar */}
          <form className="hero-search" onSubmit={handleSearch}>
            <div className="hero-search-field">
              <span className="hero-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Job title, skills, or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="hero-search-divider" />
            <div className="hero-search-field">
              <span className="hero-search-icon">📍</span>
              <input
                type="text"
                placeholder="City or Remote"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
            <button type="submit" className="hero-search-btn">Search Jobs</button>
          </form>

          <div className="hero-btns" style={{ marginTop: '1.5rem' }}>
            <Link to="/jobs"><button className="btn-white">Browse All Jobs</button></Link>
            {!user && (
              <Link to="/register/candidate"><button className="btn-outline">Get Started Free</button></Link>
            )}
          </div>
        </div>

        <div className="hero-slider">
          <div className="slider-wrapper">
            {slides.map((slide, index) => (
              <img
                key={index}
                src={slide}
                alt={`Job Portal Slide ${index + 1}`}
                className={`slide-img ${index === activeSlide ? 'active' : ''}`}
              />
            ))}
          </div>
          <div className="slider-dots">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === activeSlide ? 'active' : ''}`}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ TRUSTED BY ═══════════ */}
      <div className="trusted-bar">
        <span className="trusted-label">Trusted by teams at</span>
        <div className="trusted-logos">
          {trustedBy.map((name) => (
            <span key={name} className="trusted-name">{name}</span>
          ))}
        </div>
      </div>

      {/* ═══════════ ANIMATED STATS ═══════════ */}
      <div ref={statsRef} className={`stats-section fade-in-up ${statsInView ? 'visible' : ''}`}>
        <div className="container">
          <div className="stats-band">
            <div className="stat-item">
              <div className="stat-big">{jobs.toLocaleString()}+</div>
              <div className="stat-desc">Jobs Posted</div>
            </div>
            <div className="stat-sep" />
            <div className="stat-item">
              <div className="stat-big">{(candidates / 1000000).toFixed(1)}M+</div>
              <div className="stat-desc">Registered Candidates</div>
            </div>
            <div className="stat-sep" />
            <div className="stat-item">
              <div className="stat-big">{companies.toLocaleString()}+</div>
              <div className="stat-desc">Companies Hiring</div>
            </div>
            <div className="stat-sep" />
            <div className="stat-item">
              <div className="stat-big">{placements}%</div>
              <div className="stat-desc">Placement Success</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">

        {/* ═══════════ CATEGORY PILLS ═══════════ */}
        <div ref={categoriesRef} className={`section fade-in-up ${categoriesInView ? 'visible' : ''}`} style={{ marginTop: '3.5rem' }}>
          <div className="text-center" style={{ marginBottom: '1.75rem' }}>
            <h2 className="section-title">Explore by Category</h2>
            <p style={{ color: 'var(--text-muted)' }}>Click a category to instantly find matching jobs</p>
          </div>
          <div className="category-pills">
            {categories.map((cat) => (
              <button
                key={cat.value}
                className="category-pill"
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.value)}`)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ═══════════ FEATURES ═══════════ */}
        <div ref={featuresRef} className={`fade-in-up ${featuresInView ? 'visible' : ''}`}>
          <div className="text-center" style={{ marginBottom: '1.75rem', marginTop: '3.5rem' }}>
            <h2 className="section-title">Everything You Need</h2>
            <p style={{ color: 'var(--text-muted)' }}>One platform for every step of your job search</p>
          </div>
          <div className="features">
            {[
              { icon: '🔍', title: 'Smart Search', desc: 'Browse thousands of jobs with powerful filters across all industries' },
              { icon: '📄', title: 'Upload Resume', desc: 'Upload your resume and let top employers discover you effortlessly' },
              { icon: '🏢', title: 'Top Companies', desc: 'Apply to verified companies with real, actively open positions' },
              { icon: '📊', title: 'Track Applications', desc: 'Monitor all your applications and statuses in one clean dashboard' },
              { icon: '🔔', title: 'Instant Alerts', desc: 'Get notified the moment your application status changes' },
              { icon: '❤️', title: 'Save Jobs', desc: 'Bookmark interesting roles and apply whenever you feel ready' },
            ].map((f) => (
              <div key={f.title} className="feature-card feature-card-hover">
                <div className="feature-icon feature-icon-animated">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════ HOW IT WORKS ═══════════ */}
        <div ref={howRef} className={`section fade-in-up ${howInView ? 'visible' : ''}`} style={{ marginTop: '4rem' }}>
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            <h2 className="section-title">How It Works</h2>
            <p style={{ color: 'var(--text-muted)' }}>Get your dream job in 3 simple steps</p>
          </div>
          <div className="how-grid">
            {[
              { step: '01', title: 'Create an Account', desc: 'Sign up as a candidate and complete your profile in minutes.', icon: '👤' },
              { step: '02', title: 'Upload Your Resume', desc: 'Add your resume, skills, certifications, and past experience.', icon: '📄' },
              { step: '03', title: 'Apply for Jobs', desc: 'Find the perfect role and apply with a single click.', icon: '🚀' },
            ].map((item, i) => (
              <div key={item.step} className="how-card" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="how-step-number">{item.step}</div>
                <div className="how-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                {i < 2 && <div className="how-connector" />}
              </div>
            ))}
          </div>
        </div>

        <div className="divider" />

        {/* ═══════════ TOP COMPANIES HIRING ═══════════ */}
        <div ref={companiesRef} className={`section fade-in-up ${companiesInView ? 'visible' : ''}`} style={{ marginTop: '3rem' }}>
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            <h2 className="section-title">Top Industries Hiring Now</h2>
            <p style={{ color: 'var(--text-muted)' }}>Explore active opportunities across every sector</p>
          </div>
          <div className="hiring-grid">
            {[
              { name: 'MNCs', count: '2.3K+ actively hiring' },
              { name: 'Fintech', count: '150 actively hiring' },
              { name: 'FMCG & Retail', count: '189 actively hiring' },
              { name: 'Startups', count: '810 actively hiring' },
              { name: 'Edtech', count: '174 actively hiring' },
              { name: 'Healthcare', count: '725 actively hiring' },
              { name: 'Unicorns', count: '102 actively hiring' },
              { name: 'B2C', count: '2.5K+ actively hiring' },
              { name: 'Internet', count: '235 actively hiring' },
              { name: 'Manufacturing', count: '1.3K+ actively hiring' },
              { name: 'Fortune 500', count: '120 actively hiring' },
              { name: 'Product', count: '1.3K+ actively hiring' },
              { name: 'Banking & Finance', count: '443 actively hiring' },
              { name: 'Hospitality', count: '157 actively hiring' },
            ].map((cat) => (
              <div key={cat.name} className="hiring-card" onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.name)}`)}>
                <div className="hiring-card-content">
                  <span className="hiring-card-name">{cat.name}</span>
                  <span className="hiring-card-count">{cat.count}</span>
                </div>
                <div className="hiring-arrow">→</div>
              </div>
            ))}
          </div>
        </div>

        <div className="divider" />

        {/* ═══════════ TESTIMONIALS ═══════════ */}
        <div ref={testimonialsRef} className={`section fade-in-up ${testimonialsInView ? 'visible' : ''}`} style={{ marginTop: '3rem', marginBottom: '4rem' }}>
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            <h2 className="section-title">What Our Users Say</h2>
            <p style={{ color: 'var(--text-muted)' }}>Real stories from real candidates and companies</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="testimonial-quote">"</div>
                <div className="testimonial-stars">{'★'.repeat(t.stars)}</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: t.color }}>{t.initials}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════ CTA BANNER ═══════════ */}
        {!user && (
          <div ref={ctaRef} className={`cta-banner fade-in-up ${ctaInView ? 'visible' : ''}`} style={{ marginBottom: '4rem' }}>
            <div className="cta-glow" />
            <h2>Ready to Land Your Dream Job?</h2>
            <p>Join over 1.2 million candidates and 8,500+ companies on JobPortal today. It's completely free to get started.</p>
            <div className="cta-btns">
              <Link to="/register/candidate">
                <button className="cta-btn-primary">👤 Register as Candidate</button>
              </Link>
              <Link to="/register/company">
                <button className="cta-btn-secondary">🏢 Register as Company</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
