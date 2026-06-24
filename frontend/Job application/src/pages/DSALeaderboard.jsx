import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MOCK_LEADERBOARD = [
  { id: 1, name: 'Alex Chen', rank: 1, xp: 4850, avatar: 'A', color: '#f59e0b', bg: '#fef3c7' },
  { id: 2, name: 'Priya Sharma', rank: 2, xp: 4620, avatar: 'P', color: '#94a3b8', bg: '#f1f5f9' },
  { id: 3, name: 'David Kim', rank: 3, xp: 4510, avatar: 'D', color: '#b45309', bg: '#ffedd5' },
  { id: 4, name: 'Sarah Jenkins', rank: 4, xp: 4200, avatar: 'S', color: '#6366f1', bg: '#e0e7ff' },
  { id: 5, name: 'Rahul Verma', rank: 5, xp: 3950, avatar: 'R', color: '#10b981', bg: '#dcfce7' },
  { id: 6, name: 'Emily White', rank: 6, xp: 3800, avatar: 'E', color: '#ec4899', bg: '#fce7f3' },
  { id: 7, name: 'Omar Farooq', rank: 7, xp: 3650, avatar: 'O', color: '#8b5cf6', bg: '#ede9fe' },
];

const DSALeaderboard = () => {
  const { user } = useAuth();
  const [userXP, setUserXP] = useState(0);
  const [userSolved, setUserSolved] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dsa_solved');
      if (saved) {
        const parsed = JSON.parse(saved);
        const solvedCount = Object.values(parsed).filter(Boolean).length;
        setUserSolved(solvedCount);
        // Calculate XP: Assume average 15 XP per question (Easy=10, Med=20, Hard=30)
        setUserXP(solvedCount * 15);
      }
    } catch {}
  }, []);

  // Determine user's rank relative to the mock leaderboard
  const userRank = MOCK_LEADERBOARD.filter(m => m.xp > userXP).length + 1;

  return (
    <div className="leaderboard-page">
      <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1000px' }}>
        
        {/* Header */}
        <div className="lb-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>🏆 Global Leaderboard</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Solve DSA questions, earn XP, and climb the ranks to get noticed by top recruiters.</p>
        </div>

        <div className="lb-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
          
          {/* LEFT: Leaderboard Table */}
          <div className="lb-main">
            <div className="ds-section-card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)' }}>Rank</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)' }}>Candidate</th>
                    <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-muted)' }}>Total XP</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_LEADERBOARD.map((lb) => (
                    <tr key={lb.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="lb-row-hover">
                      <td style={{ padding: '1rem' }}>
                        {lb.rank === 1 ? '🥇' : lb.rank === 2 ? '🥈' : lb.rank === 3 ? '🥉' : <span style={{ fontWeight: 600, color: 'var(--text-muted)', marginLeft: '0.5rem' }}>#{lb.rank}</span>}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: lb.bg, color: lb.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                            {lb.avatar}
                          </div>
                          <span style={{ fontWeight: 600 }}>{lb.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700, color: 'var(--primary)' }}>
                        {lb.xp.toLocaleString()} XP
                      </td>
                    </tr>
                  ))}
                  
                  {/* Current User Row if rank > 7 */}
                  {userRank > 7 && (
                    <>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td colSpan={3} style={{ textAlign: 'center', padding: '0.5rem', color: 'var(--text-muted)', background: '#f8fafc' }}>...</td>
                      </tr>
                      <tr style={{ background: '#eff6ff' }}>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ fontWeight: 600, color: '#3b82f6', marginLeft: '0.5rem' }}>#{userRank}</span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                              {(user?.name || 'Y')[0].toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 700, color: '#1e3a8a' }}>{user?.name || 'You'} (You)</span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700, color: '#2563eb' }}>
                          {userXP.toLocaleString()} XP
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT: User Stats & Contests */}
          <div className="lb-sidebar">
            {/* User Stat Card */}
            <div className="ds-section-card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1rem' }}>
                {(user?.name || 'Y')[0].toUpperCase()}
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{user?.name || 'Guest User'}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Current Rank: <strong>#{userRank}</strong></p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>{userXP}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total XP</p>
                </div>
                <div>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', lineHeight: 1 }}>{userSolved}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Solved</p>
                </div>
              </div>
              
              <Link to="/preparation/dsa"><button className="btn-primary" style={{ width: '100%' }}>Earn More XP</button></Link>
            </div>

            {/* Weekly Contest Card */}
            <div className="ds-section-card" style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ color: 'white', margin: 0 }}>🔥 Weekly Contest</h3>
                <span style={{ background: '#ef4444', color: 'white', padding: '0.2rem 0.5rem', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700 }}>LIVE</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.5rem' }}>Compete with thousands of developers and win 500 bonus XP.</p>
              
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: 8, textAlign: 'center', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>Time Remaining</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 700 }}>
                  <span>14<sub style={{ fontSize: '0.65rem', fontWeight: 400 }}>h</sub></span> :
                  <span>22<sub style={{ fontSize: '0.65rem', fontWeight: 400 }}>m</sub></span> :
                  <span style={{ color: '#f87171' }}>45<sub style={{ fontSize: '0.65rem', fontWeight: 400 }}>s</sub></span>
                </div>
              </div>

              <button className="btn-primary" style={{ width: '100%', background: 'white', color: '#0f172a' }}>Join Contest</button>
            </div>
          </div>

        </div>
      </div>
      <style>{`
        .lb-row-hover:hover { background: #f8fafc; cursor: default; }
        @media (max-width: 768px) {
          .lb-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default DSALeaderboard;
