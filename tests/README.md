# FanFlow AI Test Suite

This directory contains the testing infrastructure for the FanFlow AI platform. We enforce strict testing requirements to ensure performance, code quality, and problem alignment as specified in PRD Section 12.

## Structure
The tests are split into frontend and backend suites.

### Frontend Tests (`frontend/src/__tests__/`)
Uses **Vitest**, **React Testing Library**, and **vitest-axe** for accessibility.
- `engine/`: Core logic tests for chat routing, offline classification, and the simulation engine.
- `components/`: UI interaction tests, snapshots, accessibility checks (`a11y.test.tsx`), and keyboard navigation checks.
- `hooks/`: Tests for React hooks (e.g., `useChat.test.ts`).
- `store/`: Tests for Zustand global state.

### Backend Tests (`backend/tests/`)
Uses **Pytest** and **HTTPX** via FastAPI TestClient.
- `test_routes.py`: Verifies endpoints, intent detection accuracy, grounding constraints, and data leakage (ensuring Anthropic API keys aren't exposed). Includes a load-shape simulation test to confirm high-volume queries trigger the pulse dashboard.

## Running Tests

From the repository root, you can run:

### Frontend
```bash
cd frontend
npm test
```
To run with coverage:
```bash
npm run test:coverage
```

### Backend
```bash
cd backend
# Make sure your virtual environment is activated
pytest
```
To run with coverage:
```bash
pytest --cov=.
```

## Problem Statement Alignment
Our testing suite guarantees parity with the PRD claims:
- **Trust & Safety Guardrails**: Tested in `chatEngine.test.ts` to ensure the AI never confirms unofficial links.
- **Accessibility**: Tested via automated axe-core violations in `a11y.test.tsx`.
- **RAG-lite Grounding**: Tested to ensure we fallback for non-existent venue zones without hallucinating.
- **Operational Data Pulse**: Tested via load shape simulations that blast 100 queries to a zone and verify the system flags it correctly.
