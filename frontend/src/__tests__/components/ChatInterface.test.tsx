/**
 * Unit tests for ChatInterface component.
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import ChatInterface from '../../components/ChatInterface'
import { useChat } from '../../hooks/useChat'

vi.mock('../../hooks/useChat', () => ({
  useChat: vi.fn()
}))

describe('ChatInterface', () => {
  it('displays the correct language in the UI', () => {
    vi.mocked(useChat).mockReturnValue({
      messages: [
        { id: '1', role: 'user', content: '¿Dónde está el baño?' },
        { id: '2', role: 'assistant', content: 'El baño está cerca de la puerta A.' }
      ],
      isLoading: false,
      sendMessage: vi.fn(),
      resetLoading: vi.fn()
    })

    render(<ChatInterface />)

    // The component should render the Spanish response
    expect(screen.getByText('¿Dónde está el baño?')).toBeInTheDocument()
    expect(screen.getByText('El baño está cerca de la puerta A.')).toBeInTheDocument()
  })

  it('renders a loading state when AI is thinking', () => {
    vi.mocked(useChat).mockReturnValue({
      messages: [
        { id: '1', role: 'user', content: 'Where is my seat?' }
      ],
      isLoading: true,
      sendMessage: vi.fn(),
      resetLoading: vi.fn()
    })

    const { container } = render(<ChatInterface />)
    
    // Look for the typing indicator dots
    expect(container.querySelector('.bg-\\[\\#94A3B8\\]')).toBeInTheDocument()
  })
})
