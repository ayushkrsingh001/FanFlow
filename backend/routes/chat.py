from fastapi import APIRouter, HTTPException, BackgroundTasks
from models import ChatMessage, ChatResponse
from services.firebase import get_db
from datetime import datetime
import json

router = APIRouter()

def log_intent_to_db(venue_id: str, metadata: dict):
    """
    Background task to log intent to mock DB or Firestore.
    """
    db = get_db()
    log_data = {
        "ts": datetime.utcnow().isoformat() + "Z",
        "zone": metadata.get("zone"),
        "intent": metadata.get("intent"),
        "lang": metadata.get("language"),
        "venue_id": venue_id
    }
    
    if db:
        # Save to real Firestore
        try:
            db.collection("intent_logs").add(log_data)
        except Exception as e:
            print(f"Error logging to firestore: {e}")
    else:
        # Local file logging for demo if firebase fails
        with open("data/intent_log.json", "a") as f:
            f.write(json.dumps(log_data) + "\n")

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(chat_msg: ChatMessage, background_tasks: BackgroundTasks):
    """
    Chat endpoint — now used only for logging intents to the Pulse Dashboard.
    The actual chat response is generated client-side by the offline knowledge engine.
    This endpoint receives the message and logs metadata for analytics.
    """
    try:
        # Simple keyword-based intent detection for logging purposes only
        message_lower = chat_msg.message.lower()
        intent = "general"
        zone = None

        # Detect intent from keywords
        if any(w in message_lower for w in ["where", "find", "navigate", "direction", "route", "gate", "seat", "section"]):
            intent = "navigation"
        elif any(w in message_lower for w in ["food", "restaurant", "eat", "drink", "menu", "halal", "vegan"]):
            intent = "amenity"
        elif any(w in message_lower for w in ["bus", "train", "metro", "taxi", "uber", "transit", "shuttle", "parking"]):
            intent = "transit"
        elif any(w in message_lower for w in ["emergency", "medical", "first aid", "help", "safety", "fire", "ambulance"]):
            intent = "safety"

        # Detect zone mentions
        import re
        gate_match = re.search(r'gate\s*([a-z0-9]+)', message_lower)
        section_match = re.search(r'section\s*(\d+)', message_lower)
        if gate_match:
            zone = f"Gate {gate_match.group(1).upper()}"
        elif section_match:
            zone = f"Section {section_match.group(1)}"

        metadata = {"intent": intent, "zone": zone, "language": "en"}

        # Log intent for Pulse Dashboard analytics
        background_tasks.add_task(log_intent_to_db, chat_msg.venue_id, metadata)
        
        return ChatResponse(
            response="Message logged successfully. Chat is handled client-side.",
            intent=intent,
            zone=zone,
            language="en"
        )
    except Exception as e:
        import traceback
        print("EXCEPTION IN CHAT ENDPOINT:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
