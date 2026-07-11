from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import chat, pulse
import json

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
    with open("data/venues.json", "r") as f:
        venues = json.load(f)
    return venues
