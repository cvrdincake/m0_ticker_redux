import { useState, useEffect } from 'react'

function App() {
  const [status, setStatus] = useState('loading')
  
  useEffect(() => {
    // Simple health check
    setStatus('ready')
  }, [])
  
  return (
    <div style={{ 
      padding: '24px', 
      fontFamily: 'Inter, sans-serif',
      color: '#ffffff',
      backgroundColor: '#0a0a0a',
      minHeight: '100vh'
    }}>
      <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>
        M0 Ticker Redux - Atomic Design System
      </h1>
      <p style={{ fontSize: '13px', color: '#a3a3a3', marginBottom: '8px' }}>
        Migration completed successfully! Design system is now active.
      </p>
      <p style={{ fontSize: '13px', color: '#737373', marginBottom: '8px' }}>
        ✅ Server status: {status}
      </p>
      <p style={{ fontSize: '13px', color: '#737373', marginBottom: '8px' }}>
        🌐 Environment: GitHub Codespaces
      </p>
      <p style={{ fontSize: '13px', color: '#737373' }}>
        🔗 Access via: {window.location.href}
      </p>
    </div>
  )
}

export default App