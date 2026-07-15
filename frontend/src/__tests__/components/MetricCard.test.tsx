/**
 * Tests for the MetricCard component.
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MetricCard from '../../components/MetricCard'

describe('MetricCard', () => {
  it('renders label and value', () => {
    render(<MetricCard label="Attendance" value="65,432" />)
    expect(screen.getByText('Attendance')).toBeInTheDocument()
    expect(screen.getByText('65,432')).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    render(<MetricCard label="Attendance" value="65,432" subtitle="of 71,000" />)
    expect(screen.getByText('of 71,000')).toBeInTheDocument()
  })

  it('renders trend info when provided', () => {
    const { container } = render(<MetricCard label="Attendance" value="65,432" trend="+5.2%" trendUp={true} />)
    const card = container.firstChild as HTMLElement
    expect(card).toHaveTextContent('+5.2%')
  })

  it('applies critical styling when critical is true', () => {
    render(<MetricCard label="Medical" value="12" critical={true} />)
    // The value should have red text
    const valueEl = screen.getByText('12')
    expect(valueEl.className).toContain('text-[#EF4444]')
  })

  it('applies warning styling when warning is true', () => {
    const { container } = render(<MetricCard label="Queue" value="85" warning={true} />)
    // The container should have yellow border
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('border-[#FDE68A]')
  })
})
