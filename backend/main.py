from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import asyncio
import random

app = FastAPI(title="Traffix Traffic Management System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

@app.post("/api/auth/login", response_model=Token)
async def login(req: LoginRequest):
    # Dummy auth for now
    if req.username == "admin" and req.password == "admin":
        return {"access_token": "dummy_admin_token", "token_type": "bearer", "role": "Super Admin"}
    elif req.username == "engineer" and req.password == "engineer":
        return {"access_token": "dummy_engineer_token", "token_type": "bearer", "role": "Traffic Engineer"}
    elif req.username == "operator" and req.password == "operator":
        return {"access_token": "dummy_operator_token", "token_type": "bearer", "role": "Traffic Operator"}
    elif req.username == "emergency" and req.password == "emergency":
        return {"access_token": "dummy_emergency_token", "token_type": "bearer", "role": "Emergency Authority"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/auth/logout")
async def logout():
    return {"message": "Logged out successfully"}

@app.get("/api/junctions")
async def get_junctions():
    return [
        {"id": "j1", "name": "Downtown Central", "lat": 40.7128, "lng": -74.0060, "density": "High", "congestion_level": "Red", "signal_phase": "North-South Green"},
        {"id": "j2", "name": "Westside Avenue", "lat": 40.7148, "lng": -74.0160, "density": "Medium", "congestion_level": "Yellow", "signal_phase": "East-West Green"},
        {"id": "j3", "name": "East River Cross", "lat": 40.7088, "lng": -73.9960, "density": "Low", "congestion_level": "Green", "signal_phase": "North-South Green"}
    ]

@app.get("/api/junction/{id}/traffic")
async def get_junction_traffic(id: str):
    return {
        "junction_id": id,
        "lanes": [
            {"direction": "North", "vehicle_count": random.randint(5, 50), "density_value": random.uniform(0.1, 0.9), "queue_length": random.randint(0, 20), "signal_state": "Red", "remaining_time": 45},
            {"direction": "East", "vehicle_count": random.randint(5, 50), "density_value": random.uniform(0.1, 0.9), "queue_length": random.randint(0, 20), "signal_state": "Green", "remaining_time": 15},
            {"direction": "South", "vehicle_count": random.randint(5, 50), "density_value": random.uniform(0.1, 0.9), "queue_length": random.randint(0, 20), "signal_state": "Red", "remaining_time": 45},
            {"direction": "West", "vehicle_count": random.randint(5, 50), "density_value": random.uniform(0.1, 0.9), "queue_length": random.randint(0, 20), "signal_state": "Green", "remaining_time": 15}
        ],
        "metrics": {
            "total_vehicles": random.randint(50, 200),
            "avg_waiting_time": random.randint(10, 120),
            "avg_speed": random.randint(5, 45),
            "overall_congestion": random.uniform(0.1, 1.0)
        }
    }

@app.get("/api/junction/{id}/history")
async def get_junction_history(id: str, time_range: str = "last_hour"):
    # Dummy mock
    return [
        {"timestamp": datetime.now().isoformat(), "total_vehicles": random.randint(50, 200), "congestion_score": random.uniform(0.1, 1.0)}
    ]

@app.get("/api/junction/{id}/prediction")
async def get_junction_prediction(id: str):
    return {
        "next_30m": {"vehicle_density": "High", "waiting_time": 85},
        "next_1h": {"vehicle_density": "Medium", "waiting_time": 45},
        "next_6h": {"vehicle_density": "Low", "waiting_time": 15}
    }

class SignalControlRequest(BaseModel):
    junction_id: str
    action: str # "Force Green North", etc.

@app.post("/api/signal/control")
async def control_signal(req: SignalControlRequest):
    return {"message": f"Signal overridden: {req.action} at {req.junction_id}"}

@app.get("/api/events")
async def get_events():
    return [
        {"timestamp": datetime.now().isoformat(), "description": "Signal phase changed to North-South Green at Downtown Central"},
        {"timestamp": datetime.now().isoformat(), "description": "Traffic optimization calculated for Westside Avenue"}
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
