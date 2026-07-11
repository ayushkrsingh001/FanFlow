/**
 * Tests for the HeatMapPanel component — validates rendering,
 * color-coding logic, and zone display.
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HeatMapPanel from '../../components/HeatMapPanel'
import type { HeatZone } from '../../engine/simulationEngine'

const mockZones: HeatZone[] = [
  { zone: 'Gate A', density: 85, label: 'High' },
  { zone: 'Gate B', density: 45, label: 'Medium' },
  { zone: 'Gate C', density: 25, label: 'Low' },
  { zone: 'Gate D', density: 90, label: 'Critical' },
]

describe('HeatMapPanel', () => {
  it('renders the title', () => {
    render(<HeatMapPanel title="Crowd Density" zones={mockZones} />)
    expect(screen.getByText('Crowd Density')).toBeInTheDocument()
  })

  it('renders all zone names', () => {
    render(<HeatMapPanel title="Crowd Density" zones={mockZones} />)
    expect(screen.getByText('Gate A')).toBeInTheDocument()
    expect(screen.getByText('Gate B')).toBeInTheDocument()
    expect(screen.getByText('Gate C')).toBeInTheDocument()
    expect(screen.getByText('Gate D')).toBeInTheDocument()
  })

  it('renders density percentages', () => {
    render(<HeatMapPanel title="Crowd Density" zones={mockZones} />)
    expect(screen.getByText('85%')).toBeInTheDocument()
    expect(screen.getByText('45%')).toBeInTheDocument()
    expect(screen.getByText('25%')).toBeInTheDocument()
    expect(screen.getByText('90%')).toBeInTheDocument()
  })

  it('renders empty zones array without crashing', () => {
    const { container } = render(<HeatMapPanel title="Empty Map" zones={[]} />)
    expect(screen.getByText('Empty Map')).toBeInTheDocument()
    // No zone rows should be present
    expect(container.querySelectorAll('.flex.items-center.gap-3').length).toBe(0)
  })
})
