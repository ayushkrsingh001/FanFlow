from fastapi import APIRouter, HTTPException
from models import BriefingRequest
from services.knowledge_engine import generate_shift_briefing
from services.firebase import get_db
import json
import os

router = APIRouter()

def get_recent_pulse_data(venue_id: str):
    """
    Fetch recent pulse data from Firestore or local fallback.
    """
    db = get_db()
    logs = []
    if db:
        try:
            # Simplified for hackathon: getting latest 50 logs for venue
            docs = db.collection("intent_logs").where("venue_id", "==", venue_id).order_by("ts", direction="DESCENDING").limit(50).stream()
            for doc in docs:
                logs.append(doc.to_dict())
            return logs
        except Exception:
            pass
            
    # Local fallback
    log_path = "/tmp/intent_log.json" if os.environ.get("VERCEL") else "data/intent_log.json"
    if os.path.exists(log_path):
        with open(log_path, "r") as f:
            for line in f.readlines():
                if line.strip():
                    log = json.loads(line)
                    if log.get("venue_id") == venue_id:
                        logs.append(log)
    # Return last 50
    return logs[-50:]

@router.get("/pulse/{venue_id}")
async def get_pulse(venue_id: str):
    """
    Returns aggregated heat-map data of intents for the Ops console.
    """
    logs = get_recent_pulse_data(venue_id)
    
    # Aggregate by zone
    heat_map = {}
    for log in logs:
        zone = log.get("zone")
        if not zone:
            continue
        if zone not in heat_map:
            heat_map[zone] = {"count": 0, "intents": {}}
        
        heat_map[zone]["count"] += 1
        intent = log.get("intent", "general")
        heat_map[zone]["intents"][intent] = heat_map[zone]["intents"].get(intent, 0) + 1
        
    return {"venue_id": venue_id, "heat_map": heat_map}

@router.post("/briefing")
async def create_briefing(req: BriefingRequest):
    """
    Generates a shift briefing based on recent pulse data.
    Uses rule-based analysis (no external AI).
    """
    logs = get_recent_pulse_data(req.venue_id)
    if not logs:
        return {"briefing": "No recent fan queries available to generate a briefing."}
        
    try:
        briefing = generate_shift_briefing(logs)
        return {"briefing": briefing}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
