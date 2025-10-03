import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/design-system/tokens/index.css'
import { initMotion } from '@/lib/motionGuard'

// SSR safety check
const isBrowser = typeof window !== 'undefined';

// Initialize motion guard system with SSR safety
let motionSystem = null;
if (isBrowser) {
  motionSystem = initMotion({ context: 'dashboard' });
}

// Global error handlers for better debugging
if (isBrowser) {
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
  })

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
  })

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (motionSystem?.dispose) {
      motionSystem.dispose();
    }
  });
}

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '24px', 
          fontFamily: 'monospace',
          color: '#ff4444',
          backgroundColor: '#0a0a0a',
          minHeight: '100vh'
        }}>
          <h1>🚨 Error Detected</h1>
          <p>Something went wrong: {this.state.error?.message}</p>
          <details>
            <summary>Error Details</summary>
            <pre>{this.state.error?.stack}</pre>
          </details>
        </div>
      )
    }

    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)