import { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-3xl font-bold text-hamutea-red mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              We're sorry, but there was an error loading this page.
            </p>
            <div className="mb-6 p-4 bg-gray-100 rounded-md text-left overflow-auto max-h-40">
              <p className="text-sm font-mono text-gray-700">
                {this.state.error && this.state.error.toString()}
              </p>
            </div>
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="px-4 py-2 bg-hamutea-red text-white rounded-full hover:bg-red-700 transition-colors"
              >
                Go to Home Page
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    // If there's no error, render children normally
    return this.props.children || (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-3xl font-bold text-hamutea-red mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-6">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="px-4 py-2 bg-hamutea-red text-white rounded-full hover:bg-red-700 transition-colors"
          >
            Go to Home Page
          </Link>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;