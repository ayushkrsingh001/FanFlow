import pytest
from fastapi.testclient import TestClient
from main import app
import json
import os

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_teardown():
    # Setup: Ensure test temp dir or mock firebase
    yield
    # Teardown: Clean up any temp log files created during test
    if os.path.exists("data/intent_log.json"):
        # Not deleting to avoid breaking demo, just ensuring it's available
        pass

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "FanFlow AI API is running"}

def test_get_venues():
    response = client.get("/api/venues")
    assert response.status_code == 200
    venues = response.json()
    assert isinstance(venues, list)
    assert len(venues) > 0
    assert "venue_id" in venues[0]
    assert "name" in venues[0]

def test_chat_endpoint_success():
    payload = {
        "message": "Where is Gate C?",
        "venue_id": "atl-mbs"
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert "response" in data
    assert data["intent"] == "navigation"
    assert "Gate C" in data["zone"]
    assert data["language"] == "en"
    
    # Assert Anthropic API Key is NEVER present in the response
    response_str = json.dumps(data).lower()
    assert "sk-ant" not in response_str
    assert "api_key" not in response_str

def test_chat_endpoint_malformed():
    # Missing venue_id
    payload = {
        "message": "Where is Gate C?"
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 422 # FastAPI validation error

def test_chat_endpoint_intent_detection():
    # Test amenity intent
    response = client.post("/api/chat", json={"message": "I need some food", "venue_id": "atl-mbs"})
    assert response.json()["intent"] == "amenity"

    # Test safety intent
    response = client.post("/api/chat", json={"message": "medical emergency", "venue_id": "atl-mbs"})
    assert response.json()["intent"] == "safety"

    # Test transit intent
    response = client.post("/api/chat", json={"message": "how to get to the metro", "venue_id": "atl-mbs"})
    assert response.json()["intent"] == "transit"
    
    # Test section detection
    response = client.post("/api/chat", json={"message": "where is section 112", "venue_id": "atl-mbs"})
    assert "Section 112" in response.json()["zone"]

def test_pulse_endpoint():
    # Seed a chat message to ensure pulse data exists
    client.post("/api/chat", json={"message": "Where is Gate C?", "venue_id": "test-venue-pulse"})
    
    response = client.get("/api/pulse/test-venue-pulse")
    assert response.status_code == 200
    data = response.json()
    assert data["venue_id"] == "test-venue-pulse"
    assert "heat_map" in data

def test_briefing_endpoint():
    # Seed data
    for _ in range(10):
        client.post("/api/chat", json={"message": "Where is Gate A?", "venue_id": "test-venue-briefing"})
    
    response = client.post("/api/briefing", json={"venue_id": "test-venue-briefing", "time_window_minutes": 60})
    assert response.status_code == 200
    data = response.json()
    assert "briefing" in data
    assert "queries" in data["briefing"]
    assert "Gate A" in data["briefing"]

def test_briefing_endpoint_empty():
    response = client.post("/api/briefing", json={"venue_id": "empty-venue-xyz", "time_window_minutes": 60})
    assert response.status_code == 200
    data = response.json()
    assert "No recent fan queries" in data["briefing"]

def test_load_shape_pulse_simulation():
    # PRD Section 12 test: Simulate 100 queries clustering in one zone
    import time
    venue = "test-venue-load"
    
    # Fire 100 queries about Gate B
    for _ in range(100):
        client.post("/api/chat", json={
            "message": "Where is Gate B? It's so crowded.", 
            "venue_id": venue
        })
    
    # Wait briefly for background tasks to flush (in FastAPI testclient, background tasks run synchronously, but we add a tiny sleep just in case)
    time.sleep(0.1)
    
    # Assert pulse endpoint reflects the spike
    response = client.get(f"/api/pulse/{venue}")
    data = response.json()
    heat_map = data.get("heat_map", {})
    
    # We expect "Gate B" to be flagged with a high count
    assert "Gate B" in heat_map
    gate_b_stats = heat_map["Gate B"]
    # We sent 100 queries, our backend currently caps reading at the last 50 for performance
    # But it should be clearly flagged (at least 50 if capped, or 100 if uncapped)
    assert gate_b_stats["count"] >= 50
    assert "navigation" in gate_b_stats["intents"]
