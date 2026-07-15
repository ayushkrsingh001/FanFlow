/**
 * Accessibility automated tests using vitest-axe.
 * Runs accessibility checks on key components.
 */
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import * as matchers from 'vitest-axe/matchers'
import ChatInterface from '../../components/ChatInterface'
import HeatMapPanel from '../../components/HeatMapPanel'
import MetricCard from '../../components/MetricCard'

expect.extend(matchers)

vi.mock('../../hooks/useChat', () => ({
  useChat: () => ({
    messages: [
      { id: '1', role: 'assistant', content: 'Hello' }
    ],
    isLoading: false,
    sendMessage: vi.fn(),
    resetLoading: vi.fn()
  })
}))

describe('Accessibility tests (axe-core)', () => {
  it('ChatInterface has no accessibility violations', async () => {
    const { container } = render(<ChatInterface />)
    const results = await axe(container)
    // @ts-ignore
    expect(results).toHaveNoViolations()
  })

  it('HeatMapPanel has no accessibility violations', async () => {
    const { container } = render(
      <HeatMapPanel 
        title="Test Panel" 
        zones={[{ zone: 'Gate A', density: 50, label: '50%' }]} 
      />
    )
    const results = await axe(container)
    // @ts-ignore
    expect(results).toHaveNoViolations()
  })

  it('MetricCard has no accessibility violations', async () => {
    const { container } = render(
      <MetricCard label="Test Metric" value="123" subtitle="Test Subtitle" />
    )
    const results = await axe(container)
    // @ts-ignore
    expect(results).toHaveNoViolations()
  })
})
