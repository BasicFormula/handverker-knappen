import os
from app.env import Mode, mode

def get_api_base_url():
    """Returns the backend API base URL based on environment."""
    custom = os.environ.get("API_BASE_URL")
    if custom:
        return custom.rstrip("/")
    if mode == Mode.DEV:
        return "http://localhost:8000"
    return os.environ.get("API_BASE_URL_PROD", "http://localhost:8000")

def get_frontend_base_url():
    """Returns the frontend base URL based on environment."""
    custom = os.environ.get("FRONTEND_URL")
    if custom:
        return custom.rstrip("/")
    if mode == Mode.DEV:
        return "http://localhost:5173"
    return os.environ.get("FRONTEND_URL_PROD", "http://localhost:5173")
