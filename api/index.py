from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import chat, pulse
import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = FastAPI(title="FanFlow AI API")

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api")
app.include_router(pulse.router, prefix="/api")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "FanFlow AI API is running"}

@app.get("/api/venues")
def get_venues():
    """
    Returns list of venues.
    """
    venues_path = os.path.join(BASE_DIR, "data", "venues.json")
    with open(venues_path, "r") as f:
        venues = json.load(f)
    return venues
