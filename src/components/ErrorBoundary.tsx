import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('🔴 ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              minHeight: '50vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '16px',
              backgroundColor: 'var(--body-bg)',
              color: 'var(--text-primary)',
              fontFamily: 'Vazirmatn, sans-serif',
            }}
          >
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              ⚠️ مشکلی پیش اومد
            </p>
            <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>
              {this.state.error?.message}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              style={{
                padding: '10px 24px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold',
              }}
            >
              تلاش مجدد
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
