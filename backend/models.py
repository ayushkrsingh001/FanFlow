from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ChatMessage(BaseModel):
    message: str
    venue_id: str

class ChatResponse(BaseModel):
    response: str
    intent: str
    zone: Optional[str] = None
    language: str

class PulseLog(BaseModel):
    ts: str
    zone: Optional[str]
    intent: str
    lang: str
    venue_id: str

class BriefingRequest(BaseModel):
    venue_id: str
    time_window_minutes: int = 60
