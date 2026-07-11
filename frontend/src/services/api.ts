import { getOfflineResponse } from '../engine/chatEngine';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const chatWithAssistant = async (message: string, venueId: string) => {
  // Simulate slight network delay for realism (optional, but requested instant response so we use 500ms which feels natural)
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const responseText = getOfflineResponse(message, venueId);
  return { response: responseText };
};

export const getPulseData = async (venueId: string) => {
  const response = await fetch(`${API_BASE_URL}/pulse/${venueId}`);
  if (!response.ok) throw new Error('Pulse API error');
  return response.json();
};

export const generateBriefing = async (venueId: string) => {
  const response = await fetch(`${API_BASE_URL}/briefing`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ venue_id: venueId }),
  });
  if (!response.ok) throw new Error('Briefing API error');
  return response.json();
};

export const getVenues = async () => {
  const response = await fetch(`${API_BASE_URL}/venues`);
  if (!response.ok) throw new Error('Venues API error');
  return response.json();
};
