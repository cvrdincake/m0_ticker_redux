import { Component } from 'react';
import './ErrorBoundary.css';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="error-overlay">
      <h2>Something went wrong</h2>
      <pre className="error-message">{error?.message}</pre>
      <div className="error-actions">
        <button onClick={resetErrorBoundary}>Try again</button>
        <button onClick={() => navigator.clipboard?.writeText(String(error?.stack || error))}>
          Copy details
        </button>
      </div>
    </div>
  );
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      console.error('ErrorBoundary caught error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback 
          error={this.state.error}
          resetErrorBoundary={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };