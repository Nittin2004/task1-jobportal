import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Search, CheckCircle2, Circle, BookOpen, 
  Code2, Database, Network, ChevronDown, 
  ChevronUp, Award, Sparkles, Check
} from 'lucide-react';
import { preparationData } from '../data/preparationData';

const Preparation = () => {
  const { module } = useParams();
  const navigate = useNavigate();

  // If no module is specified in the URL, default to aptitude
  const activeModuleKey = module && preparationData[module] ? module : 'aptitude';
  const activeModule = preparationData[activeModuleKey];

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [masteredQuestions, setMasteredQuestions] = useState(() => {
    try {
      const saved = localStorage.getItem('jobportal_mastered_questions');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Persist mastered questions to localStorage
  useEffect(() => {
    localStorage.setItem('jobportal_mastered_questions', JSON.stringify(masteredQuestions));
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
      const qList = preparationData[key].questions || [];
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
            </select>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="prep-content">
          <div className="prep-module-intro">
            <h2>{activeModule.title}</h2>
            <p>{activeModule.description}</p>
          </div>

          {/* Filters Bar */}
          <div className="prep-filters-bar">
            {/* Search Input */}
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

            {/* Difficulty Selector */}
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
                    {/* Header: Clickable to expand */}
                    <div 
                      className="prep-question-header"
                      onClick={() => toggleExpand(q.id)}
                    >
                      <div className="prep-question-header-left">
                        {/* Checkbox button */}
                        <button
                          className={`prep-checkbox ${isMastered ? 'checked' : ''}`}
                          onClick={(e) => toggleMastery(q.id, e)}
                          title={isMastered ? "Mark as unmastered" : "Mark as mastered"}
                          aria-label="Toggle mastery"
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

                    {/* Question Statement */}
                    <div className="prep-question-body">
                      <p className="prep-question-text">{q.question}</p>
                    </div>

                    {/* Answer content (conditionally visible) */}
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
                <button 
                  className="btn-primary" 
                  onClick={() => { setSearchQuery(''); setSelectedDifficulty('All'); }}
                  style={{ marginTop: '1rem' }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preparation;
