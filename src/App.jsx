import { Box } from '@/design-system/primitives/Box'

function App() {
  return (
    <Box p="6" bg="surface">
      <h1 style={{ color: 'var(--ink)', fontSize: 'var(--text-2xl)' }}>
        M0 Ticker Redux - Atomic Design System
      </h1>
      <p style={{ color: 'var(--ink-muted)', fontSize: 'var(--text-md)' }}>
        Migration completed successfully! Design system is now active.
      </p>
    </Box>
  )
}

export default App