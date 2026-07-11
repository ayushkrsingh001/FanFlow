/**
 * Tests for the StadiumMap component.
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import StadiumMap from '../../components/StadiumMap'
import { useAppStore } from '../../store/useAppStore'

describe('StadiumMap', () => {
  it('renders without crashing', () => {
    useAppStore.setState({ selectedVenue: 'atl-mbs' })
    const { container } = render(<StadiumMap />)
    
    // Check if the SVG or main container is rendered
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('displays a route when provided in state', () => {
    useAppStore.setState({ selectedVenue: 'atl-mbs' })
    const { container } = render(<StadiumMap route={['Gate A', 'Section 112']} />)
    
    // We expect text elements representing the route
    expect(screen.getByText('Gate A')).toBeInTheDocument()
    expect(screen.getByText('Section 112')).toBeInTheDocument()
  })

  it('displays step-free accessibility badge if stepFree route is passed', () => {
    useAppStore.setState({ selectedVenue: 'atl-mbs' })
    render(<StadiumMap route={['Gate B', 'Section 115']} stepFree={true} />)
    
    expect(screen.getByText('Step-Free Route')).toBeInTheDocument()
  })
})
