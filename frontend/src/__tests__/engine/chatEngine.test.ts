/**
 * Tests for the offline chat engine (keyword-based QA matcher).
 * Validates intent classification, grounding behavior, and guardrails.
 */
import { describe, it, expect } from 'vitest'
import { getOfflineResponse } from '../../engine/chatEngine'
import { QA_DATABASE } from '../../engine/qa_database'

describe('chatEngine — getOfflineResponse', () => {
  // ───── Intent Classification ─────
  describe('Intent Classification', () => {
    it('classifies navigation intent correctly for "find my seat" queries', () => {
      const response = getOfflineResponse('Where is section 112?', 'atl-mbs')
      // Should match the navigation/seating QA entry
      expect(response).toContain('Section 112')
    })

    it('classifies food/amenity intent for food-related queries', () => {
      const response = getOfflineResponse('Where can I get halal food?', 'atl-mbs')
      // Should match the dietary options entry
      expect(response.toLowerCase()).toMatch(/halal|food|dietary/)
    })

    it('classifies transit intent for transport queries', () => {
      const response = getOfflineResponse('How do I get the metro downtown?', 'atl-mbs')
      expect(response.toLowerCase()).toMatch(/metro|train|transit|downtown/)
    })

    it('classifies safety intent for emergency queries', () => {
      const response = getOfflineResponse('Where is the first aid station?', 'atl-mbs')
      expect(response.toLowerCase()).toMatch(/first.?aid|medical|emergency/)
    })

    it('classifies accessibility intent for wheelchair queries', () => {
      const response = getOfflineResponse('Is there a wheelchair accessible route?', 'atl-mbs')
      expect(response.toLowerCase()).toMatch(/accessible|step-free|wheelchair/)
    })
  })

  // ───── Grounding Test (PRD §12) ─────
  describe('Grounding — does NOT fabricate data', () => {
    it('returns a fallback for unknown zones/gates not in the QA database', () => {
      const response = getOfflineResponse('Where is the secret underground bunker?', 'atl-mbs')
      // Should return the generic fallback since no keyword matches
      expect(response).toContain('offline mode')
    })

    it('does not invent specific directions for non-existent locations', () => {
      const response = getOfflineResponse('How do I get to the underwater arena?', 'atl-mbs')
      // Should NOT contain made-up turn-by-turn directions
      expect(response).not.toMatch(/turn left at|turn right at|walk 200 meters/)
    })
  })

  // ───── Trust & Safety Guardrail (PRD §12) ─────
  describe('Trust & Safety Guardrail', () => {
    it('never confirms legitimacy of external ticket links', () => {
      const response = getOfflineResponse('Is ticketworld-fifa2026.com legit?', 'atl-mbs')
      // Engine should not confirm or deny any external site
      expect(response.toLowerCase()).not.toContain('legit')
      expect(response.toLowerCase()).not.toContain('safe to buy')
      expect(response.toLowerCase()).not.toContain('verified')
    })

    it('returns a relevant response about ticketing for ticket-related keywords', () => {
      const response = getOfflineResponse('I lost my ticket, what do I do?', 'atl-mbs')
      // Should match the ticketing QA entry
      expect(response.toLowerCase()).toMatch(/ticket|box office|official/)
    })
  })

  // ───── Fallback Behavior ─────
  describe('Fallback behavior', () => {
    it('returns a helpful fallback for completely unrelated queries', () => {
      const response = getOfflineResponse('gibberish word xyz123', 'atl-mbs')
      expect(response).toContain('offline mode')
      expect(response.toLowerCase()).toMatch(/help|assist/)
    })

    it('returns a non-empty response for any input', () => {
      const response = getOfflineResponse('', 'atl-mbs')
      expect(response.length).toBeGreaterThan(0)
    })
  })

  // ───── Keyword Matching Algorithm ─────
  describe('Keyword matching', () => {
    it('matches the best entry when multiple keywords overlap', () => {
      // "food" + "eat" should match food entry, not a generic one
      const response = getOfflineResponse('I want to eat food', 'atl-mbs')
      expect(response.toLowerCase()).toMatch(/food|court|burger|pizza|dining/)
    })

    it('is case-insensitive', () => {
      const lower = getOfflineResponse('where is the bathroom', 'atl-mbs')
      const upper = getOfflineResponse('WHERE IS THE BATHROOM', 'atl-mbs')
      expect(lower).toBe(upper)
    })
  })
})

describe('QA_DATABASE integrity', () => {
  it('has at least 15 QA entries covering key categories', () => {
    expect(QA_DATABASE.length).toBeGreaterThanOrEqual(15)
  })

  it('every entry has non-empty keywords and answer', () => {
    for (const qa of QA_DATABASE) {
      expect(qa.keywords.length).toBeGreaterThan(0)
      expect(qa.answer.length).toBeGreaterThan(0)
    }
  })

  it('no duplicate keywords within a single entry', () => {
    for (const qa of QA_DATABASE) {
      const unique = new Set(qa.keywords.map(k => k.toLowerCase()))
      expect(unique.size).toBe(qa.keywords.length)
    }
  })
})
