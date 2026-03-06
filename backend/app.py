from datetime import datetime
import random

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


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


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str


class SignalControlRequest(BaseModel):
    junction_id: str
    action: str


USERS = {
    "admin": {"password": "admin", "role": "Super Admin"},
    "engineer": {"password": "engineer", "role": "Traffic Engineer"},
    "operator": {"password": "operator", "role": "Traffic Operator"},
    "emergency": {"password": "emergency", "role": "Emergency Authority"},
}


JUNCTIONS = [
    {
        "id": "j1",
        "name": "Downtown Central",
        "lat": 40.7128,
        "lng": -74.0060,
        "density": "High",
        "congestion_level": "Red",
        "signal_phase": "North-South Green",
    },
    {
        "id": "j2",
        "name": "Westside Avenue",
        "lat": 40.7148,
        "lng": -74.0160,
        "density": "Medium",
        "congestion_level": "Yellow",
        "signal_phase": "East-West Green",
    },
    {
        "id": "j3",
        "name": "East River Cross",
        "lat": 40.7088,
        "lng": -73.9960,
        "density": "Low",
        "congestion_level": "Green",
        "signal_phase": "North-South Green",
    },
]


@app.get("/")
async def root():
    return {"message": "Traffix backend is running"}


@app.post("/api/auth/login", response_model=TokenResponse)
async def login(req: LoginRequest):
    user = USERS.get(req.username)
    if not user or user["password"] != req.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "access_token": f"dummy_{req.username}_token",
        "token_type": "bearer",
        "role": user["role"],
    }


@app.post("/api/auth/logout")
async def logout():
    return {"message": "Logged out successfully"}


@app.get("/api/junctions")
async def get_junctions():
    return JUNCTIONS


@app.get("/api/junction/{junction_id}/traffic")
async def get_junction_traffic(junction_id: str):
    if not any(j["id"] == junction_id for j in JUNCTIONS):
        raise HTTPException(status_code=404, detail="Junction not found")

    return {
        "junction_id": junction_id,
        "lanes": [
            {
                "direction": "North",
                "vehicle_count": random.randint(5, 50),
                "density_value": round(random.uniform(0.1, 0.9), 2),
                "queue_length": random.randint(0, 20),
                "signal_state": "Red",
                "remaining_time": 45,
            },
            {
                "direction": "East",
                "vehicle_count": random.randint(5, 50),
                "density_value": round(random.uniform(0.1, 0.9), 2),
                "queue_length": random.randint(0, 20),
                "signal_state": "Green",
                "remaining_time": 15,
            },
            {
                "direction": "South",
                "vehicle_count": random.randint(5, 50),
                "density_value": round(random.uniform(0.1, 0.9), 2),
                "queue_length": random.randint(0, 20),
                "signal_state": "Red",
                "remaining_time": 45,
            },
            {
                "direction": "West",
                "vehicle_count": random.randint(5, 50),
                "density_value": round(random.uniform(0.1, 0.9), 2),
                "queue_length": random.randint(0, 20),
                "signal_state": "Green",
                "remaining_time": 15,
            },
        ],
        "metrics": {
            "total_vehicles": random.randint(50, 200),
            "avg_waiting_time": random.randint(10, 120),
            "avg_speed": random.randint(5, 45),
            "overall_congestion": round(random.uniform(0.1, 1.0), 2),
        },
    }


@app.get("/api/junction/{junction_id}/history")
async def get_junction_history(junction_id: str, time_range: str = "last_hour"):
    return [
        {
            "junction_id": junction_id,
            "time_range": time_range,
            "timestamp": datetime.now().isoformat(),
            "total_vehicles": random.randint(50, 200),
            "congestion_score": round(random.uniform(0.1, 1.0), 2),
        }
    ]


@app.get("/api/junction/{junction_id}/prediction")
async def get_junction_prediction(junction_id: str):
    return {
        "junction_id": junction_id,
        "next_30m": {"vehicle_density": "High", "waiting_time": 85},
        "next_1h": {"vehicle_density": "Medium", "waiting_time": 45},
        "next_6h": {"vehicle_density": "Low", "waiting_time": 15},
    }


@app.post("/api/signal/control")
async def control_signal(req: SignalControlRequest):
    return {"message": f"Signal overridden: {req.action} at {req.junction_id}"}


@app.get("/api/events")
async def get_events():
    return [
        {
            "timestamp": datetime.now().isoformat(),
            "description": "Signal phase changed to North-South Green at Downtown Central",
        },
        {
            "timestamp": datetime.now().isoformat(),
            "description": "Traffic optimization calculated for Westside Avenue",
        },
    ]


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
