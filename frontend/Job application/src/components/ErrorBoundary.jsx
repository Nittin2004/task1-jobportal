import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Log to console with full details
    console.group('%c🚨 Runtime Error Caught by ErrorBoundary', 'color: red; font-weight: bold; font-size: 14px;');
    console.error('Error:', error);
    console.error('Message:', error?.message);
    console.error('Stack:', error?.stack);
    console.error('Component Stack:', errorInfo?.componentStack);
    console.groupEnd();
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      const errorLines = error?.stack?.split('\n') || [];

      return (
        <div style={{
          minHeight: '100vh',
          background: '#0f0f12',
          color: '#e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'monospace',
        }}>
          <div style={{
            background: '#1a1a24',
            border: '1px solid #ef444460',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '860px',
            width: '100%',
            boxShadow: '0 0 40px #ef444420',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '2rem' }}>🚨</span>
              <div>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ef4444', margin: 0 }}>
                  Runtime Error
                </h1>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                  An error occurred while rendering this component
                </p>
              </div>
            </div>

            {/* Error Message */}
            <div style={{
              background: '#ef444415',
              border: '1px solid #ef444430',
              borderRadius: '8px',
              padding: '1rem 1.2rem',
              marginBottom: '1.2rem',
            }}>
              <p style={{ margin: 0, color: '#fca5a5', fontWeight: 600, fontSize: '1rem' }}>
                {error?.name}: <span style={{ color: '#fecaca' }}>{error?.message}</span>
              </p>
            </div>

            {/* Stack Trace */}
            {errorLines.length > 0 && (
              <div style={{ marginBottom: '1.2rem' }}>
                <p style={{ color: '#64748b', fontSize: '0.78rem', marginBottom: '0.5rem', fontFamily: 'sans-serif' }}>
                  📍 STACK TRACE
                </p>
                <div style={{
                  background: '#0d0d14',
                  borderRadius: '8px',
                  padding: '1rem',
                  overflowX: 'auto',
                  maxHeight: '220px',
                  overflowY: 'auto',
                  border: '1px solid #1e1e2e',
                }}>
                  {errorLines.map((line, i) => (
                    <div key={i} style={{
                      fontSize: '0.78rem',
                      color: i === 0 ? '#f87171' : '#64748b',
                      lineHeight: '1.7',
                      whiteSpace: 'pre',
                    }}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Component Stack */}
            {errorInfo?.componentStack && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ color: '#64748b', fontSize: '0.78rem', marginBottom: '0.5rem', fontFamily: 'sans-serif' }}>
                  🧩 COMPONENT STACK
                </p>
                <div style={{
                  background: '#0d0d14',
                  borderRadius: '8px',
                  padding: '1rem',
                  overflowX: 'auto',
                  maxHeight: '160px',
                  overflowY: 'auto',
                  border: '1px solid #1e1e2e',
                }}>
                  <pre style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, whiteSpace: 'pre-wrap' }}>
                    {errorInfo.componentStack}
                  </pre>
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={this.handleReset}
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.6rem 1.4rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontFamily: 'sans-serif',
                }}
              >
                🔄 Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: 'transparent',
                  color: '#94a3b8',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '0.6rem 1.4rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontFamily: 'sans-serif',
                }}
              >
                ↺ Reload Page
              </button>
            </div>

            <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '1.2rem', fontFamily: 'sans-serif' }}>
              💡 Tip: Open browser DevTools (F12) → Console tab to see the full error details
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
