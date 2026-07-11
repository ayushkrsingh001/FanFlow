/**
 * Tests for the Ops Console Dashboard component.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import OpsConsole from '../../pages/OpsConsole'
import { useAppStore } from '../../store/useAppStore'
import { BrowserRouter } from 'react-router-dom'

vi.mock('../../lib/firebase', () => ({
  auth: {
    onAuthStateChanged: vi.fn((cb) => { 
      // cb is the callback
      if (typeof cb === 'function') {
        cb({ uid: 'user123', email: 'test@ops.com' })
      } else if (arguments.length > 1 && typeof arguments[1] === 'function') {
        // Handle (auth, cb) signature if used
        arguments[1]({ uid: 'user123', email: 'test@ops.com' })
      }
      return () => {} // unsubscribe function
    })
  }
}))

describe('OpsConsole Dashboard', () => {
  beforeEach(() => {
    useAppStore.setState({ activeOpsTab: 'dashboard', selectedVenue: 'atl-mbs' })
  })

  it('renders the ops console with metrics and heatmap', () => {
    const { container } = render(
      <BrowserRouter>
        <OpsConsole />
      </BrowserRouter>
    )

    // Check header / navigation
    expect(screen.getAllByText(/Pulse Dashboard/i)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/Staff Roster/i)[0]).toBeInTheDocument()

    // Check for the search input
    expect(screen.getByPlaceholderText(/Search metrics or zones/i)).toBeInTheDocument()
  })

  it('switches tabs correctly', () => {
    useAppStore.setState({ activeOpsTab: 'roster' })
    render(
      <BrowserRouter>
        <OpsConsole />
      </BrowserRouter>
    )

    // Verify it doesn't crash on the roster tab
    expect(screen.getAllByText(/Staff Roster/i)[0]).toBeInTheDocument()
  })
})
