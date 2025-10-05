import { Component, useEffect, useCallback } from 'react';
import './ErrorBoundary.css';

function ErrorFallback({ error, resetErrorBoundary, retryCount }) {
  const handleCopyDetails = useCallback(async () => {
    const errorDetails = {
      message: error?.message,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryCount
    };
    
    const formattedDetails = `ERROR REPORT
Time: ${errorDetails.timestamp}
URL: ${errorDetails.url}
Retries: ${errorDetails.retryCount}

Message: ${errorDetails.message}

Stack Trace:
${errorDetails.stack}

User Agent: ${errorDetails.userAgent}`;

    try {
      await navigator.clipboard.writeText(formattedDetails);
      // Brief visual feedback
      const button = document.querySelector('.copy-btn');
      if (button) {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => button.textContent = originalText, 1000);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }, [error, retryCount]);

  // Keyboard shortcuts for quick recovery
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetErrorBoundary();
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        handleCopyDetails();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [resetErrorBoundary, handleCopyDetails]);

  return (
    <div role="alert" className="error-overlay">
      <div className="error-content">
        <h2>System Error</h2>
        <div className="error-summary">
          <strong>Error:</strong> {error?.message || 'Unknown error occurred'}
        </div>
        <pre className="error-message">{error?.stack || error?.message || 'No details available'}</pre>
        <div className="error-meta">
          <span>Retry #{retryCount + 1}</span>
          <span>Press R to retry, C to copy</span>
        </div>
        <div className="error-actions">
          <button onClick={resetErrorBoundary} className="retry-btn">
            Try Again (R)
          </button>
          <button onClick={handleCopyDetails} className="copy-btn">
            Copy Details (C)
          </button>
        </div>
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
          retryCount={this.state.retryCount}
        />
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };