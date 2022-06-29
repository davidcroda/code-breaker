import { render, screen } from '@testing-library/react'
import App from './components'

test('renders app title', () => {
  render(<App />)
  const titleElement = screen.getByText(/Code Breaker/i)
  expect(titleElement).toBeInTheDocument()
})
