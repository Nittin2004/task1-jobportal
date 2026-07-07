import { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';

// Use the local worker file processed by Vite
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const ACTION_VERBS = ['developed', 'managed', 'created', 'led', 'designed', 'built', 'improved', 'increased', 'decreased', 'resolved', 'implemented', 'optimized', 'achieved', 'spearheaded', 'orchestrated'];
const STANDARD_SECTIONS = ['experience', 'education', 'skills', 'projects', 'summary', 'objective'];

const extractPdfText = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const typedArray = new Uint8Array(arrayBuffer);
  const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + ' ';
  }
  return fullText;
};

const extractTextFromFile = async (file) => {
  if (file.type === 'application/pdf') {
    return await extractPdfText(file);
  } else {
    return await file.text(); // works for .txt
  }
};

const analyzeResume = (text) => {
  const t = text.toLowerCase();
  
  // 1. Contact Info
  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(t);
  const hasPhone = /(?:\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/.test(t);
  const hasLinkedIn = /linkedin\.com/i.test(t);
  
  // 2. Sections
  const foundSections = STANDARD_SECTIONS.filter(sec => t.includes(sec));
  
  // 3. Word Count (Approx)
  const wordCount = text.split(/\s+/).length;
  const isGoodLength = wordCount > 250 && wordCount < 900; 

  // 4. Action Verbs
  const verbsFound = ACTION_VERBS.filter(v => t.includes(v));

  // Score calculation (Out of 100)
  let score = 0;
  score += hasEmail ? 10 : 0;
  score += hasPhone ? 10 : 0;
  score += hasLinkedIn ? 10 : 0;
  score += Math.min(30, foundSections.length * 10); // max 30 for sections
  score += isGoodLength ? 15 : 0;
  score += Math.min(25, verbsFound.length * 5); // max 25 for verbs

  const radarData = [
    { subject: 'Contact Info', score: (hasEmail + hasPhone + hasLinkedIn) * 3.33, fullMark: 10 },
    { subject: 'Sections', score: Math.min(10, foundSections.length * 3.33), fullMark: 10 },
    { subject: 'Formatting/Length', score: isGoodLength ? 10 : 5, fullMark: 10 },
    { subject: 'Action Verbs', score: Math.min(10, verbsFound.length * 2), fullMark: 10 },
    { subject: 'Readability', score: 9, fullMark: 10 } // Assumed basic readable if parsable
  ];

  return {
    score,
    hasEmail, hasPhone, hasLinkedIn,
    foundSections, missingSections: STANDARD_SECTIONS.filter(s => !foundSections.includes(s)),
    wordCount, isGoodLength,
    verbsFound,
    radarData
  };
};

const ResumeScanner = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (file && (file.type === 'application/pdf' || file.type === 'text/plain')) {
      setResumeFile(file);
    } else {
      alert("Please upload a PDF or TXT file.");
    }
  };

  const handleScan = async () => {
    if (!resumeFile) return;
    setIsScanning(true);
    
    try {
      const resumeText = await extractTextFromFile(resumeFile);
      
      // Simulate scanning delay for UX
      setTimeout(() => {
        const analysis = analyzeResume(resumeText);
        setResults(analysis);
        setIsScanning(false);
      }, 1000);
      
    } catch (err) {
      console.error(err);
      alert("Failed to parse the file. It might be an image-based PDF. Please upload a text-selectable PDF.");
      setIsScanning(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; 
    if (score >= 50) return '#f59e0b'; 
    return '#ef4444'; 
  };

  return (
    <div className="ats-page">
      <div className="container">
        <div className="ats-header">
          <h1>🤖 ATS Resume Checker</h1>
          <p>Check if your resume is readable by Applicant Tracking Systems and follows industry standards.</p>
        </div>

        <div className="ats-grid" style={{ gridTemplateColumns: '1fr 1.5fr' }}>
          {/* LEFT: Inputs */}
          <div className="ats-input-pane">
            <div className="ats-card">
              <h3>📄 Upload Your Resume</h3>
              <div 
                className={`ats-upload-zone ${dragActive ? 'active' : ''}`}
                onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
                onClick={() => fileInputRef.current.click()}
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept=".pdf,.txt" 
                  style={{ display: 'none' }} 
                  onChange={(e) => handleFile(e.target.files[0])}
                />
                <div className="ats-upload-content">
                  <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem', color: resumeFile ? '#10b981' : '#cbd5e1' }}>
                    {resumeFile ? '📑' : '📥'}
                  </span>
                  {resumeFile ? (
                    <div>
                      <strong style={{ color: '#0f172a' }}>{resumeFile.name}</strong>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>Click or drag to replace</p>
                    </div>
                  ) : (
                    <div>
                      <strong>Drag & drop your resume here</strong>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>Supports PDF or TXT files</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <button 
              className="btn-primary ats-scan-btn" 
              onClick={handleScan}
              disabled={isScanning || !resumeFile}
            >
              {isScanning ? '🔍 Checking ATS Format...' : 'Check ATS Compatibility →'}
            </button>
          </div>

          {/* RIGHT: Results */}
          <div className="ats-result-pane">
            {!results && !isScanning && (
              <div className="ats-empty">
                <div className="ats-empty-icon">📝</div>
                <h3>Awaiting Resume</h3>
                <p>Upload your resume to instantly see your ATS parse score, section detection, and format compatibility.</p>
              </div>
            )}

            {isScanning && (
              <div className="ats-loading">
                <div className="ds-spinner" style={{ width: '50px', height: '50px', borderWidth: '4px' }}></div>
                <p>Parsing document structure and elements...</p>
              </div>
            )}

            {results && !isScanning && (
              <div className="ats-report">
                <div className="ats-score-card" style={{ borderColor: getScoreColor(results.score) }}>
                  <div className="ats-score-circle" style={{ color: getScoreColor(results.score), border: `6px solid ${getScoreColor(results.score)}` }}>
                    {results.score}%
                  </div>
                  <div className="ats-score-text">
                    <h2>ATS Parse Score</h2>
                    <p>{results.score >= 80 ? 'Excellent! Your resume is highly ATS friendly.' : results.score >= 50 ? 'Average. You are missing some standard sections or contact details.' : 'Poor. An ATS will struggle to read your resume properly.'}</p>
                  </div>
                </div>

                <div className="ats-keywords-grid mt-1">
                  {/* Basic Checks */}
                  <div className="ats-card">
                    <h3 style={{ marginBottom: '1rem' }}>📌 Basic Information</h3>
                    <ul style={{ listStyle: 'none', padding: 0, lineHeight: 1.8 }}>
                      <li>{results.hasEmail ? '✅' : '❌'} Email Address</li>
                      <li>{results.hasPhone ? '✅' : '❌'} Phone Number</li>
                      <li>{results.hasLinkedIn ? '✅' : '❌'} LinkedIn Profile</li>
                      <li>{results.isGoodLength ? '✅' : '⚠️'} Word Count ({results.wordCount} words)</li>
                    </ul>
                  </div>

                  {/* Sections */}
                  <div className="ats-card">
                    <h3 style={{ marginBottom: '1rem' }}>📑 Standard Sections</h3>
                    <div className="tag-list">
                      {results.foundSections.map(s => <span key={s} className="tag tag-success" style={{textTransform:'capitalize'}}>{s}</span>)}
                      {results.missingSections.map(s => <span key={s} className="tag tag-danger" style={{textTransform:'capitalize'}}>{s}</span>)}
                    </div>
                  </div>
                </div>

                <div className="ats-keywords-grid mt-1">
                  {/* Radar Chart */}
                  <div className="ats-card" style={{ padding: 0 }}>
                    <h3 style={{ padding: '1.5rem 1.5rem 0' }}>🕸️ Quality Radar</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <RadarChart cx="50%" cy="50%" outerRadius="60%" data={results.radarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                        <Radar name="Your Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Action Verbs */}
                  <div className="ats-card">
                    <h3 style={{ marginBottom: '1rem' }}>⚡ Action Verbs Found</h3>
                    <div className="tag-list">
                      {results.verbsFound.length > 0 
                        ? results.verbsFound.map(v => <span key={v} className="tag" style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', textTransform: 'capitalize' }}>{v}</span>)
                        : <p className="text-muted">No strong action verbs detected. Try using words like "managed", "developed", or "improved".</p>
                      }
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeScanner;
