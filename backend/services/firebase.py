import os

_firebase_available = False

try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    
    if not firebase_admin._apps:
        try:
            cred = credentials.ApplicationDefault()
            firebase_admin.initialize_app(cred)
            # Test that we can actually get a client
            _test_client = firestore.client()
            _firebase_available = True
            print("Firebase Firestore initialized successfully.")
        except Exception as e:
            print(f"Warning: Firebase could not be initialized. Error: {e}")
            print("Using local file fallback for data storage.")
except ImportError:
    print("firebase_admin not installed. Using local file fallback.")

def get_db():
    """Returns a Firestore client if available, otherwise None."""
    if _firebase_available:
        try:
            return firestore.client()
        except Exception:
            return None
    return None
