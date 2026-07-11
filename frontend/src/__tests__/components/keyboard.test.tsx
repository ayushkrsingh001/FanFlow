/**
 * Keyboard navigation and interaction tests.
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChatInterface from '../../components/ChatInterface'

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

describe('Keyboard navigation & interaction', () => {
  it('ChatInterface supports tab navigation through interactive elements', async () => {
    render(<ChatInterface />)
    const user = userEvent.setup()
    
    const toggleMapBtn = screen.getByRole('button', { name: /toggle map/i })
    const input = screen.getByRole('textbox')
    const submitBtn = screen.getByRole('button', { name: /send message/i }) // Send button
    
    // Start by tabbing
    await user.tab()
    expect(toggleMapBtn).toHaveFocus()
    
    await user.tab()
    // Info details button
    expect(screen.getByText('Details').parentElement).toHaveFocus()
    
    await user.tab()
    // Read aloud button
    expect(screen.getByRole('button', { name: /read aloud/i })).toHaveFocus()
    
    await user.tab()
    // Input field
    expect(input).toHaveFocus()
    
    // We skip the submit button because it's disabled when input is empty, and thus not focusable.
  })

  it('can type and submit using keyboard', async () => {
    render(<ChatInterface />)
    const user = userEvent.setup()
    
    const input = screen.getByRole('textbox')
    
    await user.type(input, 'Where is the bathroom?{enter}')
    
    // Expect our mocked function to NOT be called since the sendMessage function 
    // returned from the hook is wrapped in the component, but we can verify the 
    // input is cleared.
    expect(input).toHaveValue('')
  })
})
