import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('App error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Something went wrong
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-center max-w-md">
            Please refresh the page. If the problem persists, the backend API may not be connected.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl bg-primary-700 text-white font-medium hover:bg-primary-600"
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
