import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Search, CheckCircle2, Circle, BookOpen, 
  Code2, Database, Network, ChevronDown, 
  ChevronUp, Award, Sparkles, Check
} from 'lucide-react';
import { preparationData } from '../data/preparationData';
import { aptitudeTheory } from '../data/aptitudeTheory';
import DSACheatSheet from './DSACheatSheet';

const Preparation = () => {
  const { module } = useParams();
  const navigate = useNavigate();

  // If no module is specified in URL, default to aptitude.
  // 'dsasheet' is a special key that renders the DSA Cheat Sheet.
  const isDSASheet = module === 'dsasheet';
  const activeModuleKey = (!isDSASheet && module && preparationData[module]) ? module : (isDSASheet ? 'dsasheet' : 'aptitude');
  const activeModule = isDSASheet ? null : preparationData[activeModuleKey];

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [masteredQuestions, setMasteredQuestions] = useState(() => {
    try {
      const saved = localStorage.getItem('nexthire_mastered_questions');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Persist mastered questions to localStorage
  useEffect(() => {
    localStorage.setItem('nexthire_mastered_questions', JSON.stringify(masteredQuestions));
  }, [masteredQuestions]);

  // Reset search and difficulty filter when module changes
  useEffect(() => {
    setSearchQuery('');
    setSelectedDifficulty('All');
    setExpandedQuestions({});
  }, [activeModuleKey]);

  // Toggle question expansion
  const toggleExpand = (id) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Toggle mastery status
  const toggleMastery = (id, e) => {
    e.stopPropagation(); // Prevent toggling accordion when checking the box
    setMasteredQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Calculate progress stats
  const stats = useMemo(() => {
    let totalQuestionsCount = 0;
    let totalMasteredCount = 0;
    const moduleStats = {};

    Object.keys(preparationData).forEach(key => {
      let qList = preparationData[key].questions || [];
      if (preparationData[key].isTheory && key === 'aptitude') {
        qList = aptitudeTheory;
      }
      
      const mCount = qList.filter(q => masteredQuestions[q.id]).length;
      
      moduleStats[key] = {
        total: qList.length,
        mastered: mCount,
        percent: qList.length > 0 ? Math.round((mCount / qList.length) * 100) : 0
      };

      totalQuestionsCount += qList.length;
      totalMasteredCount += mCount;
    });

    const overallPercent = totalQuestionsCount > 0 
      ? Math.round((totalMasteredCount / totalQuestionsCount) * 100) 
      : 0;

    return {
      total: totalQuestionsCount,
      mastered: totalMasteredCount,
      percent: overallPercent,
      modules: moduleStats
    };
  }, [masteredQuestions]);

  // Filtered questions for the active module
  const filteredQuestions = useMemo(() => {
    if (!activeModule || !activeModule.questions) return [];
    
    return activeModule.questions.filter(q => {
      const matchesSearch = 
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.tag.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDifficulty = 
        selectedDifficulty === 'All' || 
        q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

      return matchesSearch && matchesDifficulty;
    });
  }, [activeModule, searchQuery, selectedDifficulty]);

  // Helper to map module icons
  const getModuleIcon = (key) => {
    switch (key) {
      case 'aptitude': return <Award className="prep-sidebar-icon" />;
      case 'dsa': return <Code2 className="prep-sidebar-icon" />;
      case 'oops': return <Code2 className="prep-sidebar-icon" style={{ transform: 'rotate(90deg)' }} />;
      case 'dbms': return <Database className="prep-sidebar-icon" />;
      case 'computernetwork': return <Network className="prep-sidebar-icon" />;
      case 'sql': return <Database className="prep-sidebar-icon" style={{ opacity: 0.8 }} />;
      default: return <BookOpen className="prep-sidebar-icon" />;
    }
  };

  // Parser helper to render questions text with code blocks and bold formatting
  const renderExplanation = (text) => {
    if (!text) return null;
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const language = match ? match[1] : '';
        const code = match ? match[2] : part.slice(3, -3);
        return (
          <div key={index} className="prep-code-container">
            {language && <span className="prep-code-lang">{language}</span>}
            <pre className="prep-code-pre">
              <code>{code.trim()}</code>
            </pre>
          </div>
        );
      }
      
      return (
        <div key={index} className="prep-text-content">
          {part.split('\n').map((line, lIdx) => {
            let cleanLine = line;
            let isBullet = false;
            if (line.trim().startsWith('- ')) {
              cleanLine = line.trim().substring(2);
              isBullet = true;
            }
            
            const boldParts = cleanLine.split(/(\*\*.*?\*\*)/g);
            const renderedLine = boldParts.map((bp, bpIdx) => {
              if (bp.startsWith('**') && bp.endsWith('**')) {
                return <strong key={bpIdx}>{bp.slice(2, -2)}</strong>;
              }
              return bp;
            });

            if (isBullet) {
              return <li key={lIdx} className="prep-bullet-item">{renderedLine}</li>;
            }
            // For equations, keep them neat
            if (line.includes('$$')) {
              const eqParts = line.split('$$');
              return (
                <p key={lIdx} className="prep-equation-paragraph">
                  {eqParts.map((ep, epIdx) => epIdx % 2 === 1 ? <code key={epIdx} className="prep-inline-math">{ep}</code> : ep)}
                </p>
              );
            }
            if (line.includes('$')) {
              const eqParts = line.split('$');
              return (
                <p key={lIdx} className="prep-paragraph">
                  {eqParts.map((ep, epIdx) => epIdx % 2 === 1 ? <code key={epIdx} className="prep-inline-math">{ep}</code> : ep)}
                </p>
              );
            }
            return line.trim() === '' ? <div key={lIdx} className="prep-spacing" /> : <p key={lIdx} className="prep-paragraph">{renderedLine}</p>;
          })}
        </div>
      );
    });
  };

  return (
    <>
      {isDSASheet ? (
        <DSACheatSheet />
      ) : (
        <div className="container page fade-in-up visible">
          {/* Header section */}
          <div className="prep-header-card">
            <div className="prep-header-text">
              <div className="prep-badge">
                <Sparkles size={14} /> Interview Preparation
              </div>
              <h1>Placement & Interview Preparation</h1>
              <p>Supercharge your preparation with our handpicked collection of standard conceptual questions and code snippets.</p>
            </div>

            {/* Global Progress Bar */}
            <div className="prep-global-progress-card">
              <div className="prep-progress-header">
                <span>Overall Preparation Progress</span>
                <span className="prep-progress-score">{stats.mastered} of {stats.total} Mastered</span>
              </div>
              <div className="prep-progress-bar-container">
                <div 
                  className="prep-progress-bar-fill" 
                  style={{ width: `${stats.percent}%` }}
                />
              </div>
              <div className="prep-progress-footer">
                <span>{stats.percent}% Complete</span>
                <span>{stats.total - stats.mastered} remaining</span>
              </div>
            </div>
          </div>

          <div className="prep-layout">
            {/* Left Sidebar (Desktop) / Dropdown Selector (Mobile) */}
            <div className="prep-sidebar">
              <h3 className="prep-sidebar-title">Modules</h3>
              <div className="prep-sidebar-links">
                {Object.keys(preparationData).map(key => {
                  const isActive = key === activeModuleKey;
                  const moduleStat = stats.modules[key];
                  return (
                    <button
                      key={key}
                      className={`prep-sidebar-btn ${isActive ? 'active' : ''}`}
                      onClick={() => navigate(`/preparation/${key}`)}
                    >
                      <div className="prep-sidebar-btn-left">
                        {getModuleIcon(key)}
                        <span>{preparationData[key].title}</span>
                      </div>
                      <div className="prep-sidebar-btn-right">
                        <span className="prep-module-pill">
                          {moduleStat.mastered}/{moduleStat.total}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Mobile Select dropdown for small screens */}
              <div className="prep-mobile-select-wrapper">
                <label htmlFor="module-select">Choose Module:</label>
                <select
                  id="module-select"
                  value={activeModuleKey}
                  onChange={(e) => navigate(`/preparation/${e.target.value}`)}
                  className="prep-mobile-select"
                >
                  {Object.keys(preparationData).map(key => (
                    <option key={key} value={key}>
                      {preparationData[key].title} ({stats.modules[key].mastered}/{stats.modules[key].total})
                    </option>
                  ))}
                  <option value="dsasheet">💡 DSA Cheat Sheet (400 Q)</option>
                </select>
              </div>

              {/* ── DSA Cheat Sheet special button ── */}
              <div style={{ padding: '0.75rem 0.5rem 0' }}>
                <div style={{ height: 1, background: 'var(--border)', marginBottom: '0.75rem' }} />
                <button
                  className={`prep-sidebar-btn ${isDSASheet ? 'active' : ''}`}
                  style={{ borderLeft: `3px solid ${isDSASheet ? '#6366f1' : 'transparent'}`, background: isDSASheet ? 'rgba(99,102,241,0.1)' : undefined }}
                  onClick={() => navigate('/preparation/dsasheet')}
                >
                  <div className="prep-sidebar-btn-left">
                    <span style={{ fontSize: '1.1rem' }}>💡</span>
                    <span style={{ fontWeight: 700, color: isDSASheet ? '#6366f1' : 'var(--text-main)' }}>DSA Master Sheet (400 Q)</span>
                  </div>
                  <div className="prep-sidebar-btn-right">
                    <span className="prep-module-pill" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>400 Q</span>
                  </div>
                </button>

                {/* ── Global Leaderboard ── */}
                <button
                  className="prep-sidebar-btn"
                  style={{ marginTop: '0.25rem' }}
                  onClick={() => navigate('/preparation/leaderboard')}
                >
                  <div className="prep-sidebar-btn-left">
                    <span style={{ fontSize: '1.1rem' }}>🏆</span>
                    <span style={{ fontWeight: 700, color: '#f59e0b' }}>Global Leaderboard</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="prep-content">
              <div className="prep-module-intro">
                <h2>{activeModule.title}</h2>
                <p>{activeModule.description}</p>
              </div>

              {activeModule.isTheory ? (
                /* ── THEORY MODE ── */
                <>
                  <div className="prep-filters-bar">
                    <div className="prep-difficulty-pills" style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', overflowX: 'auto', paddingBottom: '5px' }}>
                      {['Quantitative', 'Logical', 'Verbal'].map(cat => (
                        <button
                          key={cat}
                          className={`prep-difficulty-pill ${selectedDifficulty === cat ? 'active' : ''}`}
                          onClick={() => setSelectedDifficulty(cat)}
                          style={{ minWidth: 'fit-content' }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="prep-questions-list">
                    {/* Render Theory Cards */}
                    {aptitudeTheory
                      .filter(t => selectedDifficulty === 'All' ? t.category === 'Quantitative' : t.category === selectedDifficulty)
                      .map((topic, idx) => {
                        const isExpanded = expandedQuestions[topic.id] !== false; // Default expanded
                        const isMastered = !!masteredQuestions[topic.id];
                        
                        return (
                          <div key={topic.id} className={`prep-question-card ${isExpanded ? 'expanded' : ''} ${isMastered ? 'mastered' : ''}`} style={{ padding: 0, overflow: 'hidden' }}>
                            {/* Theory Header */}
                            <div className="prep-question-header" style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)', padding: '1rem 1.25rem' }} onClick={() => toggleExpand(topic.id)}>
                              <div className="prep-question-header-left">
                                <button className={`prep-checkbox ${isMastered ? 'checked' : ''}`} onClick={(e) => toggleMastery(topic.id, e)}>
                                  {isMastered && <Check size={12} strokeWidth={3} />}
                                </button>
                                <div className="prep-question-title-group">
                                  <h3 className="prep-question-title" style={{ fontSize: '1.1rem', color: '#0f172a' }}>{topic.topic}</h3>
                                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem', fontWeight: 500 }}>{topic.subtopics}</p>
                                </div>
                              </div>
                              <div className="prep-question-header-right">
                                <span className="prep-badge-tag" style={{ background: '#e0e7ff', color: '#4338ca' }}>{topic.category}</span>
                                <div className="prep-chevron-icon">
                                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </div>
                              </div>
                            </div>

                            {/* Theory Body */}
                            {isExpanded && (
                              <div className="prep-theory-body" style={{ padding: '1.25rem' }}>
                                {/* Theory Block */}
                                <div className="prep-theory-content" style={{ background: '#fefefe', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #6366f1', marginBottom: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                  <h4 style={{ color: '#6366f1', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <BookOpen size={16} /> Concept & Theory
                                  </h4>
                                  <div className="prep-text-content" style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#334155' }}>
                                    {renderExplanation(topic.theory)}
                                  </div>
                                </div>
                                
                                {/* Example Block */}
                                <div className="prep-example-content" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                  <h4 style={{ color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Sparkles size={16} color="#f59e0b" /> Worked Example
                                  </h4>
                                  <div className="prep-text-content" style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#1e293b' }}>
                                    {renderExplanation(topic.example)}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                    })}
                  </div>
                </>
              ) : (
                /* ── STANDARD QUESTIONS MODE ── */
                <>
                  {/* Filters Bar */}
                  <div className="prep-filters-bar">
                    <div className="prep-search-input-wrapper">
                      <Search className="prep-search-icon" size={18} />
                      <input
                        type="text"
                        placeholder="Search questions or topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="prep-search-input"
                      />
                    </div>
                    <div className="prep-difficulty-pills">
                      {['All', 'Easy', 'Medium', 'Hard'].map(diff => (
                        <button
                          key={diff}
                          className={`prep-difficulty-pill ${selectedDifficulty === diff ? 'active' : ''}`}
                          onClick={() => setSelectedDifficulty(diff)}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Questions Accordion List */}
                  <div className="prep-questions-list">
                    {filteredQuestions.length > 0 ? (
                      filteredQuestions.map((q, idx) => {
                        const isExpanded = !!expandedQuestions[q.id];
                        const isMastered = !!masteredQuestions[q.id];
                        
                        return (
                          <div 
                            key={q.id} 
                            className={`prep-question-card ${isExpanded ? 'expanded' : ''} ${isMastered ? 'mastered' : ''}`}
                          >
                            <div className="prep-question-header" onClick={() => toggleExpand(q.id)}>
                              <div className="prep-question-header-left">
                                <button
                                  className={`prep-checkbox ${isMastered ? 'checked' : ''}`}
                                  onClick={(e) => toggleMastery(q.id, e)}
                                >
                                  {isMastered && <Check size={12} strokeWidth={3} />}
                                </button>
                                <div className="prep-question-title-group">
                                  <span className="prep-question-number">Q{idx + 1}.</span>
                                  <h3 className="prep-question-title">{q.title}</h3>
                                </div>
                              </div>
                              <div className="prep-question-header-right">
                                <span className={`prep-badge-difficulty ${q.difficulty.toLowerCase()}`}>
                                  {q.difficulty}
                                </span>
                                <span className="prep-badge-tag">
                                  {q.tag}
                                </span>
                                <div className="prep-chevron-icon">
                                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </div>
                              </div>
                            </div>
                            <div className="prep-question-body">
                              <p className="prep-question-text">{q.question}</p>
                            </div>
                            {isExpanded && (
                              <div className="prep-answer-container">
                                <div className="prep-answer-label">
                                  <span>💡 Answer & Detailed Explanation</span>
                                </div>
                                <div className="prep-answer-content">
                                  {renderExplanation(q.explanation)}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="prep-empty-state">
                        <BookOpen size={48} className="prep-empty-icon" />
                        <h3>No questions found</h3>
                        <p>Try refining your search query or choosing another difficulty filter.</p>
                        <button className="btn-primary" onClick={() => { setSearchQuery(''); setSelectedDifficulty('All'); }} style={{ marginTop: '1rem' }}>
                          Reset Filters
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Preparation;
