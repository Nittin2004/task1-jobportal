import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PlayCircle, CheckCircle, Circle, ChevronLeft, Award, Clock, FileText, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import './CoursePlayer.css';

import { MOCK_COURSES } from '../data/mockCourses';

const CoursePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(null);
  
  // Track completed lessons by ID
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem(`course_progress_${id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Track expanded modules
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    // In a real scenario, fetch from /api/courses/:id
    // For now, we simulate network delay and use Mock Data if API fails or isn't connected
    setTimeout(() => {
      const selectedCourse = MOCK_COURSES[id];
      if (selectedCourse) {
        setCourse(selectedCourse);
        if (selectedCourse.modules.length > 0 && selectedCourse.modules[0].lessons.length > 0) {
          setActiveLesson(selectedCourse.modules[0].lessons[0]);
          setExpandedModules({ [selectedCourse.modules[0]._id]: true });
        }
      } else {
        setCourse(null);
      }
      setLoading(false);
    }, 600);
  }, [id]);

  useEffect(() => {
    if (course) {
      localStorage.setItem(`course_progress_${id}`, JSON.stringify(completedLessons));
    }
  }, [completedLessons, id, course]);

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(99, 102, 241, 0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  if (!course) {
    return <div className="page container"><h2>Course not found.</h2></div>;
  }

  // Progress Calculation
  const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const completedCount = Object.values(completedLessons).filter(Boolean).length;
  const progressPercent = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const handleLessonSelect = (lesson, moduleId) => {
    setActiveLesson(lesson);
    // Ensure module is expanded
    setExpandedModules(prev => ({ ...prev, [moduleId]: true }));
  };

  const toggleCompletion = (lessonId, e) => {
    e.stopPropagation();
    setCompletedLessons(prev => {
      const newState = { ...prev, [lessonId]: !prev[lessonId] };
      if (newState[lessonId]) {
        toast.success("Lesson completed! 🎉");
      }
      return newState;
    });
  };

  return (
    <div className="course-player-layout fade-in-up visible">
      {/* ── Navbar Area (Overrides standard navbar for focus mode) ── */}
      <div className="course-player-nav">
        <div className="course-nav-left">
          <button onClick={() => navigate('/academy')} className="back-to-academy">
            <ChevronLeft size={20} /> Back to Academy
          </button>
          <div className="course-title-separator">|</div>
          <h1 className="course-nav-title">{course.title}</h1>
        </div>
        <div className="course-nav-right">
          <div className="course-progress-container">
            <div className="course-progress-text">
              <span><Award size={16} color="#f59e0b" /> Your Progress</span>
              <span style={{ fontWeight: '600' }}>{progressPercent}%</span>
            </div>
            <div className="course-progress-bar-bg">
              <div className="course-progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div className="course-progress-stats">
              {completedCount} of {totalLessons} lessons completed
            </div>
          </div>
        </div>
      </div>

      <div className="course-player-body">
        {/* ── Left Column: Video & Content ── */}
        <div className="course-video-section">
          {activeLesson ? (
            <>
              <div className="video-container">
                <iframe
                  src={activeLesson.videoUrl}
                  title={activeLesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              
              <div className="lesson-details">
                <div className="lesson-details-header">
                  <h2>{activeLesson.title}</h2>
                  <button 
                    className={`btn-mark-complete ${completedLessons[activeLesson._id] ? 'completed' : ''}`}
                    onClick={(e) => toggleCompletion(activeLesson._id, e)}
                  >
                    {completedLessons[activeLesson._id] ? (
                      <><CheckCircle size={18} /> Completed</>
                    ) : (
                      <><Circle size={18} /> Mark as Complete</>
                    )}
                  </button>
                </div>
                
                <div className="lesson-meta-pills">
                  <span className="lesson-meta-pill"><Clock size={16} /> {activeLesson.durationMinutes} mins</span>
                  <span className="lesson-meta-pill"><FileText size={16} /> Standard Definition</span>
                </div>

                <div className="lesson-tabs">
                  <button className="lesson-tab active">Overview</button>
                  <button className="lesson-tab">Q&A</button>
                  <button className="lesson-tab">Notes</button>
                  <button className="lesson-tab">Resources</button>
                </div>

                <div className="lesson-content-area">
                  <h3>About this lesson</h3>
                  <p>In this lesson, we will cover the fundamental concepts required to master this topic. Make sure to watch the entire video and attempt any accompanying exercises before moving on to the next module.</p>
                  
                  <div className="lesson-resources">
                    <h4><Download size={18} /> Downloadable Resources</h4>
                    <ul>
                      <li><a href="#">Presentation_Slides.pdf</a> (1.2 MB)</li>
                      <li><a href="#">Source_Code.zip</a> (450 KB)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="no-lesson-selected">
              <h3>Select a lesson from the curriculum to start learning.</h3>
            </div>
          )}
        </div>

        {/* ── Right Column: Curriculum Sidebar ── */}
        <div className="course-curriculum-sidebar">
          <div className="curriculum-header">
            <h3>Course Content</h3>
          </div>
          
          <div className="modules-list">
            {course.modules.map((mod, mIdx) => {
              const isExpanded = expandedModules[mod._id];
              const moduleLessonsCount = mod.lessons.length;
              const moduleCompletedCount = mod.lessons.filter(l => completedLessons[l._id]).length;
              
              return (
                <div key={mod._id} className="module-accordion">
                  <div 
                    className="module-accordion-header" 
                    onClick={() => toggleModule(mod._id)}
                  >
                    <div className="module-accordion-title">
                      <h4>Section {mIdx + 1}: {mod.title}</h4>
                      <span className="module-stats">
                        {moduleCompletedCount} / {moduleLessonsCount} | {mod.lessons.reduce((acc, l) => acc + l.durationMinutes, 0)} min
                      </span>
                    </div>
                    <div className="module-accordion-icon">
                      {isExpanded ? '−' : '+'}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="module-accordion-body">
                      {mod.lessons.map((lesson, lIdx) => {
                        const isActive = activeLesson?._id === lesson._id;
                        const isCompleted = !!completedLessons[lesson._id];
                        
                        return (
                          <div 
                            key={lesson._id} 
                            className={`lesson-item ${isActive ? 'active' : ''}`}
                            onClick={() => handleLessonSelect(lesson, mod._id)}
                          >
                            <div className="lesson-item-left">
                              <div 
                                className="lesson-checkbox"
                                onClick={(e) => toggleCompletion(lesson._id, e)}
                              >
                                {isCompleted ? <CheckCircle size={16} className="text-green-500" /> : <Circle size={16} className="text-gray-400" />}
                              </div>
                              <div className="lesson-item-info">
                                <span className="lesson-item-title">{lIdx + 1}. {lesson.title}</span>
                                <span className="lesson-item-duration">
                                  <PlayCircle size={12} style={{marginRight: '4px', display: 'inline'}} />
                                  {lesson.durationMinutes} min
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
