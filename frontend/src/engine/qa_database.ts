export const QA_DATABASE = [
  // Greeting & Basics
  {
    keywords: ["hello", "hi", "hey", "greetings", "good morning", "good evening", "what's up", "namaste"],
    answer: "Hello! Welcome to FanFlow AI. I am your smart stadium assistant. How can I help you enjoy your matchday experience today?"
  },
  {
    keywords: ["thanks", "thank you", "appreciate", "awesome", "great"],
    answer: "You're very welcome! Let me know if you need anything else. Enjoy the game!"
  },
  {
    keywords: ["who are you", "what are you", "what do you do"],
    answer: "I am FanFlow AI, your offline smart stadium assistant. I can help you with wayfinding, food options, emergency procedures, accessible routes, and live stadium information!"
  },
  
  // Ticketing & Entry
  {
    keywords: ["ticket", "transfer", "lost", "re-entry", "qr code", "scan"],
    answer: "All tickets are digital via the official app. If your phone died or you lost your ticket, please visit the Box Office near Gate A with a valid photo ID. Please note: Re-entry is strictly prohibited once you exit the stadium."
  },
  {
    keywords: ["gate", "open", "time", "when", "early"],
    answer: "Stadium gates open exactly 2 hours before the scheduled kickoff. We recommend arriving at least 45 minutes early to allow time for security screening."
  },
  {
    keywords: ["bag", "purse", "backpack", "clear bag", "policy", "allowed"],
    answer: "We enforce a strict Clear Bag Policy. Only clear plastic, vinyl, or PVC bags not exceeding 12\" x 6\" x 12\" are allowed. Small clutch bags (4.5\" x 6.5\") are permitted. Backpacks are not allowed."
  },

  // Navigation & Seats
  {
    keywords: ["seat", "section 112", "find my seat", "where am i", "how to go"],
    answer: "To find your seat in Section 112, enter through Gate A. Walk straight for about 100 meters, then turn left at the main concourse. You'll see signs for sections 110-115. Section 112 will be on your right."
  },
  {
    keywords: ["bathroom", "restroom", "toilet", "washroom", "pee", "poop"],
    answer: "Restrooms are located every 50 meters along all main concourses. The nearest restroom from the main entrance is just past the team store on your right. Family and gender-neutral restrooms are also available at every corner of the stadium."
  },
  {
    keywords: ["elevator", "lift", "escalator", "stairs"],
    answer: "Elevators are located near Gates A, C, and E, specifically reserved for guests with disabilities and VIP pass holders. Escalators are available in the central atrium to take you to the upper decks."
  },

  // Accessibility
  {
    keywords: ["accessible", "step-free", "wheelchair", "route", "nearest gate", "disabled"],
    answer: "All main gates offer step-free access. For the quickest accessible route, please use the dedicated Accessibility Entrance located at Gate B. From there, flat pathways and designated elevators are clearly marked in blue to take you to all seating levels."
  },
  {
    keywords: ["sensory", "quiet room", "loud", "noise", "autism"],
    answer: "We offer Sensory Rooms for guests who need a quiet space away from the noise and crowd. These are located on Level 2, near Section 205. You can also request sensory bags (containing noise-canceling headphones and fidget tools) at any Guest Services desk."
  },

  // Emergency & Medical
  {
    keywords: ["first-aid", "first aid", "emergency", "exit", "medical", "doctor", "hurt", "injured", "sick"],
    answer: "The nearest first-aid station is located on the main concourse near Gate C, next to the guest services desk. In case of an emergency, please look for the illuminated green 'EXIT' signs above all stairwells and main gates. Staff in high-visibility vests can also assist you immediately."
  },
  {
    keywords: ["police", "security", "fight", "unsafe", "danger", "report"],
    answer: "If you feel unsafe or need to report an incident, immediately notify the nearest security guard in a yellow jacket, or text 'SECURITY' along with your section number to 555-888 for immediate dispatch."
  },
  {
    keywords: ["lost child", "missing person", "found", "kid"],
    answer: "If you have lost a child or separated from your party, please notify the nearest stadium staff or security immediately. Our central reunification point is the Guest Services desk at Gate A."
  },

  // Transit & Parking
  {
    keywords: ["transit", "downtown", "cheapest", "greenest", "transport", "bus", "train", "subway", "metro"],
    answer: "The greenest and most cost-effective way to get back downtown is by using the local metro/light rail system. The station is a 5-minute walk from the South Gate. Trains run every 10 minutes post-match, and the ride to the city center takes about 15 minutes."
  },
  {
    keywords: ["park", "parking", "car", "vehicle", "garage"],
    answer: "General parking is available in Lots 1, 2, and 3. Premium and VIP parking is in the South Garage. If you didn't pre-purchase a parking pass, we highly recommend using ride-share or public transit as lots fill up fast."
  },
  {
    keywords: ["uber", "lyft", "ride", "taxi", "cab"],
    answer: "The designated rideshare (Uber/Lyft) pickup and drop-off zone is located at the East Plaza, outside Gate D. Please follow the signs for 'Rideshare' once you exit."
  },

  // Weather & Environment
  {
    keywords: ["rain", "weather", "air-conditioned", "climate", "temperature", "cold", "hot", "sun"],
    answer: "We are expecting clear skies today with no rain during the match. The stadium is fully enclosed and air-conditioned, maintaining a comfortable 72°F (22°C) inside, regardless of the outside weather."
  },

  // Food & Beverage
  {
    keywords: ["food", "eat", "hungry", "snack", "dine"],
    answer: "There are numerous food options available! The main food court is on Level 1 near Gate A, offering burgers, tacos, and pizza. For premium dining, check out the Club Level."
  },
  {
    keywords: ["drink", "beer", "alcohol", "water", "thirsty", "coke", "soda"],
    answer: "Water fountains are available outside every restroom. Alcoholic beverages (beer, wine, cocktails) are sold at concession stands until the 75th minute of the match. Please have your ID ready!"
  },
  {
    keywords: ["vegan", "vegetarian", "gluten", "halal", "kosher", "allergy"],
    answer: "We offer diverse dietary options. Vegan and gluten-free meals are available at the 'Green Bowl' stand near Section 120. Halal and Kosher certified options can be found at the specialty carts near Gate C."
  },

  // Amenities & Merchandise
  {
    keywords: ["merchandise", "store", "jersey", "shop", "buy", "shirt", "hat", "souvenir"],
    answer: "Official merchandise, including jerseys, scarves, and memorabilia, can be purchased at the Team Store located near Gate A on Level 1. There are also smaller pop-up shops located throughout all concourses."
  },
  {
    keywords: ["wifi", "internet", "connection", "network", "password"],
    answer: "Free high-speed Wi-Fi is available throughout the stadium! Connect to the network 'FanFlow_Guest_WiFi'. No password is required, simply accept the terms and conditions on the popup page."
  },
  {
    keywords: ["battery", "charge", "phone", "dead"],
    answer: "Phone charging stations are available in the central atrium and the Club Level lounges. You can also rent portable power banks from the kiosks located near Gates B and D."
  },
  {
    keywords: ["smoke", "vape", "smoking", "cigarette"],
    answer: "This is a strictly smoke-free and vape-free facility. Smoking is not allowed anywhere inside the stadium walls. Violators will be subject to ejection."
  }
];
