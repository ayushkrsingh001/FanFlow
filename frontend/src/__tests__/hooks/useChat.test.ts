/**
 * Tests for the useChat hook.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useChat } from '../../hooks/useChat'
import { AIService } from '../../services/ai/AIService'
import { useAppStore } from '../../store/useAppStore'

// Mock the AIService to avoid real API calls during tests
vi.mock('../../services/ai/AIService', () => ({
  AIService: {
    generateResponse: vi.fn(),
  }
}))

describe('useChat hook', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useAppStore.setState({ selectedVenue: 'atl-mbs' })
    vi.mocked(AIService.generateResponse).mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes with a welcome message', () => {
    const { result } = renderHook(() => useChat())
    expect(result.current.messages).toHaveLength(1)
    expect(result.current.messages[0].role).toBe('assistant')
    expect(result.current.messages[0].content).toContain('Welcome to FanFlow AI')
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('adds user message and sets loading state on sendMessage', async () => {
    // We'll resolve the promise manually to test the loading state
    let resolveAiPromise: (value: string) => void
    const aiPromise = new Promise<string>((resolve) => {
      resolveAiPromise = resolve
    })
    
    vi.mocked(AIService.generateResponse).mockReturnValue(aiPromise)

    const { result } = renderHook(() => useChat())

    await act(async () => {
      result.current.sendMessage('Where is my seat?')
    })

    // User message should be added immediately
    expect(result.current.messages).toHaveLength(2)
    expect(result.current.messages[1].role).toBe('user')
    expect(result.current.messages[1].content).toBe('Where is my seat?')
    expect(result.current.isLoading).toBe(true)

    // Resolve the AI response
    await act(async () => {
      resolveAiPromise!('Your seat is in section 112.')
    })

    // Assistant message should be added and loading false
    expect(result.current.messages).toHaveLength(3)
    expect(result.current.messages[2].role).toBe('assistant')
    expect(result.current.messages[2].content).toBe('Your seat is in section 112.')
    expect(result.current.isLoading).toBe(false)
  })

  it('handles empty messages by doing nothing', async () => {
    const { result } = renderHook(() => useChat())

    await act(async () => {
      result.current.sendMessage('   ')
    })

    expect(result.current.messages).toHaveLength(1)
    expect(result.current.isLoading).toBe(false)
    expect(AIService.generateResponse).not.toHaveBeenCalled()
  })

  it('handles API errors gracefully', async () => {
    vi.mocked(AIService.generateResponse).mockRejectedValue(new Error('API Rate Limit'))

    const { result } = renderHook(() => useChat())

    await act(async () => {
      result.current.sendMessage('Test error')
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe('API Rate Limit')
    
    // Should add an error message to chat
    const lastMsg = result.current.messages[result.current.messages.length - 1]
    expect(lastMsg.role).toBe('assistant')
    expect(lastMsg.content).toBe('API Rate Limit')
  })

  it('handles timeouts correctly', async () => {
    // Create a promise that never resolves
    vi.mocked(AIService.generateResponse).mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useChat())

    await act(async () => {
      result.current.sendMessage('Test timeout')
    })

    expect(result.current.isLoading).toBe(true)

    // Advance timer by 15001ms (just over the 15s timeout)
    await act(async () => {
      vi.advanceTimersByTime(15001)
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toContain('timed out')
  })
})
