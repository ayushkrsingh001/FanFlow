import type { Message } from '../../types/chat';
import venuesData from '../../data/venues.json';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export class AIService {
  private static getApiKey(): string {
    const key = import.meta.env.VITE_AI_API_KEY;
    if (!key) {
      throw new Error("Missing VITE_AI_API_KEY in environment variables.");
    }
    return key;
  }

  private static getSystemPrompt(venueId: string): string {
    const venue = venuesData.find((v: any) => v.venue_id === venueId);
    let venueContext = "No specific venue selected.";
    if (venue) {
      venueContext = `
Venue Name: ${venue.name}
City: ${venue.city}
Operating Hours: ${JSON.stringify(venue.operating_hours)}
VIP Areas: ${venue.vip_areas?.join(', ')}
Fan Zone: ${JSON.stringify(venue.fan_zone)}
WiFi: ${JSON.stringify(venue.wifi)}
Charging Stations: ${venue.charging_stations?.join(', ')}
ATMs: ${venue.atm?.join(', ')}
Merchandise: ${venue.merchandise_stores?.join(', ')}
Prayer Room: ${venue.prayer_room}
Baby Care: ${venue.baby_care}
      `;
    }

    return `You are FanFlow Stadium Assistant. You are a helpful, factual, and concise assistant for the FIFA World Cup 2026.
Your task is to answer only stadium-related questions.
Topics include: Navigation, Tickets, Matches, Parking, Transport, Emergency, Accessibility, Security, Food Courts, Medical, Lost & Found, Weather, Fan Tips.
If users ask unrelated questions, politely redirect them to stadium-related topics.
Do NOT verify external links or tickets. Direct users to official FIFA channels only.
Use the following VENUE FACTS as your primary source of information. For dynamic information like today's weather or real-time transit, use Google Search to find the answer. Do not say you don't know unless you've tried searching.

VENUE FACTS:
${venueContext}
`;
  }

  static async generateResponse(history: Message[], userMessage: string, venueId: string): Promise<string> {
    const apiKey = this.getApiKey();
    const systemInstruction = this.getSystemPrompt(venueId);

    const contents = history.filter(m => m.role !== 'system').map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const body = {
      system_instruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: contents,
      tools: [{ googleSearch: {} }],
      generationConfig: {
        temperature: 0.2,
      }
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (response.status === 500) {
        throw new Error('Server error occurred on the AI provider. Please try again.');
      } else if (response.status === 400 || response.status === 403) {
        throw new Error('Invalid API Key or Bad Request. Please check your configuration.');
      }
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    }
    
    throw new Error('Empty response from AI.');
  }
}
