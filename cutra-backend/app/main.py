from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Dict, Set
import uuid
from datetime import datetime, timedelta
import os

app = FastAPI(title="Cutra Backend API")

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

active_sessions: Dict[str, dict] = {}
pending_device_confirmations: Set[str] = set()
confirmed_devices: Set[str] = set()

BACKEND_USERNAME = "muhammadihoji"
BACKEND_PASSWORD = "Hojiev08"

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    message: str
    session_token: str = None

class DeviceConfirmationRequest(BaseModel):
    device_id: str
    frontend_session_token: str

class DeviceConfirmationResponse(BaseModel):
    success: bool
    message: str
    confirmed: bool = False

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.get("/admin", response_class=HTMLResponse)
async def admin_page():
    """Backend admin interface"""
    html_path = os.path.join(os.path.dirname(__file__), "..", "templates", "admin.html")
    try:
        with open(html_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    except FileNotFoundError:
        return HTMLResponse(content="<h1>Admin page not found</h1>", status_code=404)

@app.post("/api/backend/login", response_model=LoginResponse)
async def backend_login(login_data: LoginRequest):
    """Backend admin login endpoint"""
    if login_data.username == BACKEND_USERNAME and login_data.password == BACKEND_PASSWORD:
        session_token = str(uuid.uuid4())
        active_sessions[session_token] = {
            "username": login_data.username,
            "login_time": datetime.now(),
            "expires_at": datetime.now() + timedelta(hours=24)
        }
        return LoginResponse(
            success=True,
            message=f"Привет {login_data.username} добро пожаловать в админ панель cutra",
            session_token=session_token
        )
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/device/request-confirmation", response_model=DeviceConfirmationResponse)
async def request_device_confirmation(request: DeviceConfirmationRequest):
    """Frontend requests device confirmation from backend"""
    device_id = request.device_id
    pending_device_confirmations.add(device_id)
    
    return DeviceConfirmationResponse(
        success=True,
        message="Device confirmation requested. Waiting for backend approval.",
        confirmed=False
    )

@app.post("/api/device/confirm/{device_id}")
async def confirm_device(device_id: str, session_token: str):
    """Backend admin confirms a device"""
    if session_token not in active_sessions:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    session = active_sessions[session_token]
    if datetime.now() > session["expires_at"]:
        del active_sessions[session_token]
        raise HTTPException(status_code=401, detail="Session expired")
    
    if device_id in pending_device_confirmations:
        pending_device_confirmations.remove(device_id)
        confirmed_devices.add(device_id)
        return {"success": True, "message": f"Device {device_id} confirmed"}
    else:
        raise HTTPException(status_code=404, detail="Device confirmation request not found")

@app.get("/api/device/status/{device_id}")
async def check_device_status(device_id: str):
    """Check if a device has been confirmed"""
    if device_id in confirmed_devices:
        return {"confirmed": True, "message": "Device confirmed"}
    elif device_id in pending_device_confirmations:
        return {"confirmed": False, "message": "Device confirmation pending"}
    else:
        return {"confirmed": False, "message": "Device not found"}

@app.get("/api/backend/pending-devices")
async def get_pending_devices(session_token: str):
    """Get list of pending device confirmations for backend admin"""
    if session_token not in active_sessions:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    session = active_sessions[session_token]
    if datetime.now() > session["expires_at"]:
        del active_sessions[session_token]
        raise HTTPException(status_code=401, detail="Session expired")
    
    return {"pending_devices": list(pending_device_confirmations)}
