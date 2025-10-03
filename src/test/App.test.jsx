import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '@/App'

test('renders the app with migration success message', () => {
  render(<App />)
  expect(screen.getByText(/M0 Ticker Redux - Atomic Design System/i)).toBeInTheDocument()
  expect(screen.getByText(/Migration completed successfully/i)).toBeInTheDocument()
})