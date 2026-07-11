# PRD — FanFlow AI
### A GenAI Stadium Companion for FIFA World Cup 2026™
**Prepared for:** Hack2Skill PromptWars — "Build with AI" Challenge
**Vertical chosen:** Stadium Operations & Fan Experience (Navigation + Crowd Management + Multilingual Assistance + Accessibility + Real-Time Decision Support)
**Version:** 1.0 · July 2026

---

## 1. Why This, Why Now (Grounded Context)

FIFA World Cup 2026 is the largest edition in history: **48 teams, 104 matches, 16 stadiums across 3 countries (USA, Mexico, Canada)**, spread over Western, Central and Eastern regional clusters. This scale creates operational problems no single prior World Cup has faced:

- **Cross-border, cross-language fans.** Fans from 48 countries, moving between cities like Mexico City, Toronto, Miami, Seattle and Dallas, need help in real time — not just translation, but *context-aware* guidance (gates, transit, culture, currency).
- **Heat and safety complexity.** FIFA has introduced **mandatory 3-minute hydration breaks around the 22nd minute of each half** for this tournament, and only 3 of the 16 venues (Atlanta, Dallas, Houston) are fully climate-controlled — the rest are open-air, so heat-risk guidance varies stadium to stadium.
- **Security and scam exposure.** Cybersecurity research around this tournament has flagged **1,100+ fraudulent World Cup domains and 1,700+ fake social profiles** impersonating tickets, transport and hospitality — fans need a trusted, single point of truth inside the stadium ecosystem rather than relying on random links.
- **Massive, uneven venues.** Capacities range from ~43,000 (BMO Field, Toronto) to 94,000 (AT&T Stadium, Dallas), each with different gate layouts, accessibility provisions and transit links — a one-size-fits-all printed guide cannot keep up with 104 live matches.

**FanFlow AI** is a GenAI-native assistant that sits at the intersection of *fan-facing help* and *operations-facing intelligence*, so the same underlying model serves two personas from one system.

---

## 2. Problem Statement (as issued)

> Build a GenAI-enabled solution that enhances stadium operations and the overall tournament experience for fans, organizers, volunteers, or venue staff — improving navigation, crowd management, accessibility, transportation, sustainability, multilingual assistance, operational intelligence, or real-time decision support during FIFA World Cup 2026.

---

## 3. Chosen Vertical & Primary Persona

Per the rules, one vertical/persona anchors the design logic. **FanFlow AI anchors on the Fan (match-day attendee)** as primary persona, with a lightweight **Volunteer/Staff Ops Console** as a secondary, connected surface — because in real stadium operations, fan questions *are* the operational signal (a spike in "where's the nearest exit" queries near Gate C *is* a crowd-management event). This linkage is the project's core logical differentiator.

| Persona | Need | Where FanFlow AI helps |
|---|---|---|
| **Fan (primary)** | Navigate an unfamiliar 60–90k capacity stadium in a foreign country, in their own language, safely and quickly | Conversational wayfinding, multilingual chat, accessibility routing, transit + sustainability tips |
| **Volunteer/Staff (secondary)** | Answer the same 20 questions all day, spot crowd bottlenecks before they become dangerous | Auto-drafted FAQ answers, live "heat-map of questions" as an early-warning signal, shift briefings generated from live data |

---

## 4. Goals & Success Metrics

| Goal | Metric (demo-able) |
|---|---|
| Reduce fan confusion at gates/concourses | # of navigation queries resolved without human escalation (simulated) |
| Support non-English speakers | # of languages the assistant fluently handles in demo (target: 6+) |
| Surface crowd risk before it's critical | Time-to-detect a simulated "surge" pattern from query clustering |
| Improve accessibility coverage | 100% of core flows usable via screen reader + step-free routing option |
| Demonstrate responsible AI | No hallucinated gate/seat data — all facts served from a structured venue dataset, not model memory |

---

## 5. User Stories

1. *As a fan from Morocco at Mercedes-Benz Stadium (Atlanta), I ask in Arabic "where's the nearest accessible restroom to Section 112?" and get step-free directions.*
2. *As a fan, I ask "will it rain during the match?" and "is this stadium air-conditioned?" and get venue-specific, factual answers (Atlanta = climate-controlled; Seattle = open-air).*
3. *As a fan waiting for kickoff, I ask "what happens at the hydration break?" and get an explanation of FIFA's 22nd-minute cooling break rule.*
4. *As a volunteer at Gate C, I open the Ops Console and see that 40% of the last 10 minutes of fan questions mention "long line," prompting a proactive staff reroute suggestion.*
5. *As a fan, I ask "cheapest and greenest way back to downtown" and get a transit-first, sustainability-aware answer instead of a default rideshare suggestion.*
6. *As a fan worried about scams, I ask "is this ticket link real?" and the assistant explains it can't verify external links and directs me to official FIFA channels only — never fabricating a verdict.*

---

## 6. Core Features (mapped to the challenge's improvement areas)

### 6.1 Multilingual Conversational Concierge *(Multilingual assistance)*
- Chat interface, auto-detects input language, responds in-kind (target demo languages: English, Spanish, French, Arabic, Portuguese, Hindi — reflecting the 48-nation field).
- Tone and formality adapt lightly to locale (e.g., more formal register in some cultures) — a prompt-engineering layer, not a hardcoded translation table.

### 6.2 Contextual Wayfinding *(Navigation + Accessibility)*
- Structured JSON "venue graph" per stadium (gates, sections, amenities, accessible routes) is the **source of truth**; the LLM's job is to *reason over* this data and phrase the answer — never invent a gate number.
- Every route has a step-free alternative flagged explicitly, and every answer states distance/time.

### 6.3 Crowd Pulse (Operational Intelligence + Real-Time Decision Support)
- The assistant logs the *intent category* of every fan query (navigation / restroom / food / transit / safety) with a location tag.
- A lightweight dashboard aggregates this into a live "question heat-map" per zone — a genuinely novel use of GenAI output as an operational sensor, not just a fan-facing chatbot.
- When one zone's queries spike (e.g., "line," "crowded," "stuck") past a threshold, the Ops Console highlights it for volunteer attention — this is the project's signature idea.

### 6.4 Transit & Sustainability Advisor *(Transportation + Sustainability)*
- Recommends public transit / shuttle / walking first; rideshare last — with a simple "CO₂ saved" framing versus a solo car trip, using each host city's known transit options (e.g., MetLife Stadium's NJ Transit rail, BC Place/Vancouver's SkyTrain).

### 6.5 Trust & Safety Guardrail *(Responsible AI, directly answers a real 2026 risk)*
- Given the documented rise in fake ticket/streaming domains and impersonation accounts around this World Cup, the assistant is explicitly prompted to **never validate external links, tickets, or deals**, and always redirects to official FIFA channels — turned into a visible, demoable safety feature rather than an afterthought.

### 6.6 Volunteer Shift Briefing Generator *(Organizers/volunteers)*
- One click generates a plain-language shift summary ("Gate C, 2–4pm: high query volume around restroom location; recommend signage refresh") from the same aggregated data — showing GenAI doing real operational writing, not just chat.

---

## 7. System Architecture

```
┌─────────────────────────┐        ┌──────────────────────────┐
│   Fan Web App (PWA)     │        │  Volunteer/Ops Console    │
│  React + Tailwind        │        │  React dashboard          │
│  Chat + Map UI            │        │  Query heat-map + briefing│
└───────────┬──────────────┘        └────────────┬─────────────┘
            │  REST/JSON                          │
            ▼                                     ▼
┌─────────────────────────────────────────────────────────────┐
│                     Node.js / Express API                    │
│  - /chat        → builds grounded prompt + calls LLM          │
│  - /venue-data  → serves structured venue JSON (ground truth) │
│  - /log-intent  → tags & stores query intent + zone            │
│  - /pulse       → aggregates intents into zone heat-map        │
│  - /briefing    → summarizes pulse data via LLM                │
└───────────┬───────────────────────────────┬──────────────────┘
            │                               │
            ▼                               ▼
   ┌──────────────────┐           ┌───────────────────────┐
   │ Anthropic Claude  │           │  Local JSON "DB"       │
   │ API (chat + brief)│           │  venues, gates, FAQs,  │
   │ Prompt = system   │           │  logged intents        │
   │ instructions +    │           └───────────────────────┘
   │ retrieved venue   │
   │ facts (RAG-lite)  │
   └──────────────────┘
```

**Why this architecture wins on the evaluation criteria:**
- **Security:** No user PII stored; API keys server-side only, never exposed to frontend; all external "facts" pass through a structured dataset filter, reducing hallucination risk.
- **Efficiency:** Repo stays lean (<10MB) — no bundled ML models, no large media; venue data is a handful of small JSON files; LLM calls are the only "heavy" dependency, made via API.
- **Testing:** Includes a small test suite (see §12) validating that the assistant never contradicts the structured venue data.
- **Accessibility:** Semantic HTML, ARIA labels, keyboard navigation, and a high-contrast mode toggle built into the base UI, not bolted on.

---

## 8. GenAI Prompt Design (RAG-lite, Grounded Generation)

The system does **not** let the LLM freely answer factual venue questions. Pattern:

1. User message received → lightweight intent classifier (keyword + LLM function-call) tags: `{intent: navigation|amenity|transit|safety|general, zone: string|null, language: detected}`
2. Relevant facts are pulled from the venue JSON (e.g., nearest accessible restroom to Section 112).
3. A system prompt instructs the model:
   - "Answer only using the FACTS block below. If the answer isn't in FACTS, say you don't have that detail and suggest asking a steward — never invent stadium specifics."
   - "Respond in the user's detected language: {language}."
   - "If the question concerns tickets, deals, or external links, do not verify them — direct the user to official FIFA channels only."
4. Model generates the natural-language response; the intent tag is logged to the Pulse aggregator regardless of the chat outcome.

This keeps the **judging focus on logic and grounding**, not just "wrapped a chatbot around GPT."

---

## 9. UX/UI Direction

- **Fan App:** Conversational-first, map-second. Chat bubble is the hero; a collapsible mini-map shows the resolved route. Big tap targets, high contrast, works one-handed in a loud stadium.
- **Ops Console:** Dashboard-first. A stadium bowl diagram divided into zones, color-coded by live query intensity (green → amber → red), with a side panel of the top 5 live questions per zone and a "Generate briefing" button.
- **Visual identity:** Night-match energy — deep pitch-navy background, floodlight-white text, turf-green and floodlight-gold accents, with a single signature motif: a pulsing radial "stadium heartbeat" ring that visualizes live crowd-query intensity. Typography pairs a condensed, stadium-scoreboard display face for headers with a clean grotesque for body/data, so it reads as *sport operations*, not generic SaaS.

*(An interactive HTML prototype implementing this direction is provided alongside this PRD.)*

---

## 10. Data Model (minimal, demo-ready)

```json
// venues.json (excerpt)
{
  "venue_id": "atl-mbs",
  "name": "Mercedes-Benz Stadium",
  "city": "Atlanta",
  "roof": "retractable/climate-controlled",
  "capacity": 71000,
  "gates": ["A","B","C","D"],
  "zones": [
    {
      "zone_id": "C-lower",
      "amenities": ["restroom","accessible-restroom","food-halal","first-aid"],
      "accessible_route_from_gate": {"C": "step-free ramp, 3 min"}
    }
  ],
  "transit": ["MARTA rail to GWCC/CNN Center station", "shuttle from Vine City"]
}
```

```json
// intent_log.json (streamed, aggregated for Pulse)
{ "ts": "2026-07-06T18:42:00Z", "zone": "C-lower", "intent": "navigation", "lang": "es" }
```

---

## 11. Security & Responsible AI

- No login/PII required for the fan demo (use a session-only nickname); Ops Console is role-gated (mock auth).
- LLM API key stored server-side via environment variable, never shipped in the repo or frontend bundle.
- Explicit refusal behavior for ticket/scam validation requests (see §6.5) — directly mitigates the real fraud patterns documented around this tournament.
- All venue facts are dataset-grounded to prevent hallucinated stadium details, which would be actively dangerous in a real safety context (e.g., wrong exit direction).

---

## 12. Testing Plan

| Test type | Example |
|---|---|
| Grounding test | Ask about a gate/zone not in the dataset → assistant must decline, not invent |
| Multilingual test | Same question asked in 4+ languages → correct language detection & response |
| Guardrail test | "Is ticketworld-fifa2026.com legit?" → assistant refuses to verify, redirects to official source |
| Accessibility test | Full flow completable via keyboard-only + screen reader (axe-core automated check) |
| Load-shape test | Simulate 100 queries clustering in one zone → Pulse dashboard flags it within the demo's time window |

---

## 13. Accessibility Commitments

- WCAG 2.1 AA color contrast across both apps.
- All interactive elements reachable and operable via keyboard; visible focus states.
- Every navigation answer includes an explicit step-free/accessible alternative, not as a separate mode but as a default part of the answer.
- Text scaling and a high-contrast toggle ship in v1, not backlogged.

---

## 14. Sustainability Angle

- Transit-first recommendation logic (public transit/shuttle/walk ranked above rideshare/drive).
- Simple relative CO₂-saved framing per suggested option, using publicly known transit links per host city (e.g., rail options in New York/New Jersey, Vancouver, Toronto).
- No physical print materials implied by the design — the whole point is a living, on-device guide replacing paper maps/programs.

---

## 15. Assumptions

- Judges will evaluate via a local run or short demo video, not live production traffic — so mocked/simulated crowd data is acceptable if clearly labeled as simulated.
- One LLM provider (Anthropic Claude API) is sufficient to demonstrate the concept; no requirement to integrate a real stadium's live IoT feeds for a hackathon MVP.
- "Volunteer/Ops Console" is a secondary demo surface, not the primary judged persona — Fan experience is the anchor vertical.
- Repository must stay under 10MB: no bundled model weights, no large image/video assets — venue data and UI assets are hand-authored, lightweight JSON/SVG.

---

## 16. Repository & Submission Plan (aligned to the rules)

```
fanflow-ai/
├── README.md                # vertical, approach, logic, assumptions (required)
├── frontend/                # React fan app + ops console
├── backend/                 # Express API, prompt templates, venue data
├── data/                    # venues.json, faqs.json (small, <1MB total)
├── tests/                   # grounding, guardrail, accessibility checks
└── docs/                    # this PRD, architecture diagram
```

- Single branch (`main`), regular small commits during build.
- Public repo, no secrets committed (`.env.example` only).
- README explicitly states: chosen vertical, approach/logic, how it works, assumptions — matching the stated submission requirement.

---

## 17. Mapping to Evaluation Tiers

| Tier | What this PRD delivers against it |
|---|---|
| **High Impact** — likely: does it solve a real problem with sound logic, working demo, clear GenAI use | Grounded (non-hallucinating) multilingual assistant + novel Crowd Pulse signal derived from real GenAI output, tied to real 2026 tournament facts |
| **Medium Impact** — likely: architecture, security, efficiency | Clean small-footprint architecture, server-side keys, structured data grounding, lean repo |
| **Low Impact** — likely: polish, UI, docs | Distinctive stadium-themed UI/UX (see prototype), thorough README, tests folder |

*(Exact weighting is set by Hack2Skill and not published in detail; this mapping is a best-effort alignment based on the stated rubric categories.)*

---

## 18. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| LLM hallucinates stadium facts | Hard grounding rule + refusal fallback (§8) |
| Repo exceeds 10MB | No media assets, no node_modules committed, `.gitignore` enforced |
| Judges can't run it live | Include a scripted demo flow + short GIF/recording in README |
| Over-scoping in 1 attempt | MVP scope locked to: chat + wayfinding + Pulse dashboard + briefing generator — cut anything else |

---

*End of PRD.*
