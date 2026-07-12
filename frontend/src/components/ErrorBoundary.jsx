import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🔥 REACT UI CRASH CAUGHT:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
          <div className="bg-surface border border-red-500/30 p-8 rounded-2xl max-w-lg w-full text-center shadow-xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-main mb-4">Something went wrong</h1>
            <p className="text-secondary mb-8">
              We caught an unexpected error in the application. Don't worry, your data is safe!
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
