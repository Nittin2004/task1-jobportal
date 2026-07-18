import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const ModernScrollEffects = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 25,
    restDelta: 0.001
  });

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const percent = totalHeight > 0 ? Math.round((scrollPos / totalHeight) * 100) : 0;
      setScrollPercent(percent);
      setShowScrollTop(scrollPos > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Circular ring calculation
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollPercent / 100) * circumference;

  return (
    <>
      {/* ── Fixed Top Reading Progress Gradient Bar ── */}
      <motion.div
        style={{
          scaleX,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #6366f1 0%, #38bdf8 33%, #10b981 66%, #f59e0b 100%)',
          transformOrigin: '0%',
          zIndex: 99999,
          boxShadow: '0 0 12px rgba(99, 102, 241, 0.7)'
        }}
      />

      {/* ── Interactive Floating Back-to-Top with Scroll Meter Ring ── */}
      <motion.button
        type="button"
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0.5, y: 30 }}
        animate={showScrollTop ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.5, y: 30 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          pointerEvents: showScrollTop ? 'auto' : 'none',
          position: 'fixed',
          bottom: '2.2rem',
          right: '2.2rem',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--surface, #ffffff)',
          border: '1px solid var(--border, #e2e8f0)',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.25), 0 0 15px rgba(99,102,241,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10000,
          color: 'var(--primary, #6366f1)',
          fontSize: '1.35rem',
          fontWeight: 800,
          padding: 0
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.06)';
          e.currentTarget.style.boxShadow = '0 15px 30px -5px rgba(99,102,241,0.45)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.25), 0 0 15px rgba(99,102,241,0.2)';
        }}
        title="Back to Top"
        aria-label="Back to Top"
      >
        {/* SVG Circle Progress Ring */}
        <svg
          width="56"
          height="56"
          viewBox="0 0 56 56"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'rotate(-90deg)'
          }}
        >
          <circle
            cx="28"
            cy="28"
            r={radius}
            stroke="var(--border, #e2e8f0)"
            strokeWidth="3.5"
            fill="transparent"
            opacity="0.3"
          />
          <circle
            cx="28"
            cy="28"
            r={radius}
            stroke="url(#scrollGradient)"
            strokeWidth="3.5"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.1s linear' }}
          />
          <defs>
            <linearGradient id="scrollGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
        </svg>

        <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          ↑
        </span>
      </motion.button>
    </>
  );
};

export default ModernScrollEffects;
