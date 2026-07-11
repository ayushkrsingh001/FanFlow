import { QA_DATABASE } from './qa_database';

export function getOfflineResponse(message: string, _venueId: string): string {
  const lowerMessage = message.toLowerCase();

  // Simple keyword matching algorithm
  let bestMatch = null;
  let maxScore = 0;

  for (const qa of QA_DATABASE) {
    let score = 0;
    for (const keyword of qa.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        score++;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = qa;
    }
  }

  // If we found a decent match
  if (bestMatch && maxScore > 0) {
    return bestMatch.answer;
  }

  // Fallback response
  return "I'm currently operating in offline mode. I can help you with finding your seat, accessible routes, emergency information, transit options, and stadium amenities. Could you try rephrasing your question?";
}
