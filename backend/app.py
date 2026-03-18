from datetime import datetime, timedelta
from typing import Dict, List
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


class Token(BaseModel):
    access_token: str
    token_type: str
    role: str


class SignalControlRequest(BaseModel):
    junction_id: str
    action: str


JUNCTIONS = [
    {
        "id": "j1",
        "name": "Anna Salai Command Junction",
        "lat": 13.0604,
        "lng": 80.2496,
        "zone": "Central Business District",
        "priority_class": "Critical",
        "nearby_asset": "Government Hospital",
        "base_density": 0.88,
        "base_speed": 16,
        "pedestrian_load": "High",
        "transit_priority": True,
        "emergency_ready": True,
    },
    {
        "id": "j2",
        "name": "Koyambedu Interchange",
        "lat": 13.0713,
        "lng": 80.1946,
        "zone": "Intercity Gateway",
        "priority_class": "High",
        "nearby_asset": "Mofussil Bus Terminus",
        "base_density": 0.72,
        "base_speed": 24,
        "pedestrian_load": "Medium",
        "transit_priority": True,
        "emergency_ready": True,
    },
    {
        "id": "j3",
        "name": "T. Nagar Smart Cross",
        "lat": 13.0418,
        "lng": 80.2341,
        "zone": "Retail District",
        "priority_class": "Critical",
        "nearby_asset": "Commercial Market",
        "base_density": 0.91,
        "base_speed": 14,
        "pedestrian_load": "High",
        "transit_priority": False,
        "emergency_ready": False,
    },
    {
        "id": "j4",
        "name": "Vadapalani Junction",
        "lat": 13.0528,
        "lng": 80.2121,
        "zone": "Residential Connector",
        "priority_class": "Medium",
        "nearby_asset": "Metro Access",
        "base_density": 0.54,
        "base_speed": 29,
        "pedestrian_load": "Medium",
        "transit_priority": True,
        "emergency_ready": True,
    },
    {
        "id": "j5",
        "name": "Guindy Industrial Corridor",
        "lat": 13.0069,
        "lng": 80.2206,
        "zone": "Industrial Zone",
        "priority_class": "High",
        "nearby_asset": "SIDCO Estate",
        "base_density": 0.69,
        "base_speed": 22,
        "pedestrian_load": "Low",
        "transit_priority": False,
        "emergency_ready": True,
    },
]

DIRECTIONS = ["North", "East", "South", "West"]


def _junction_by_id(junction_id: str) -> Dict:
    for junction in JUNCTIONS:
        if junction["id"] == junction_id:
            return junction
    raise HTTPException(status_code=404, detail="Junction not found")


def _level_from_score(score: float) -> str:
    if score >= 0.8:
        return "Red"
    if score >= 0.55:
        return "Yellow"
    return "Green"


def _density_label(score: float) -> str:
    if score >= 0.8:
        return "High"
    if score >= 0.55:
        return "Medium"
    return "Low"


def _simulate_junction_traffic(junction: Dict) -> Dict:
    base_density = junction["base_density"] + random.uniform(-0.06, 0.06)
    density = min(max(base_density, 0.2), 0.98)
    avg_speed = max(8, int(junction["base_speed"] + random.uniform(-5, 4)))
    total_vehicles = int(90 + density * 260 + random.randint(-12, 18))
    avg_wait = int(22 + density * 78 + random.randint(-4, 8))
    congestion_level = _level_from_score(density)

    lanes: List[Dict] = []
    green_direction = random.choice([1, 3])
    for index, direction in enumerate(DIRECTIONS):
        lane_density = min(max(density + random.uniform(-0.12, 0.12), 0.08), 0.99)
        signal_state = "Green" if index == green_direction else "Red"
        if lane_density > 0.7 and signal_state == "Red" and random.random() > 0.7:
            signal_state = "Yellow"
        remaining_time = random.randint(18, 52) if signal_state == "Red" else random.randint(10, 28)
        lanes.append(
            {
                "direction": direction,
                "vehicle_count": int(12 + lane_density * 40 + random.randint(-3, 4)),
                "density_value": round(lane_density, 2),
                "queue_length": int(3 + lane_density * 26 + random.randint(0, 5)),
                "signal_state": signal_state,
                "remaining_time": remaining_time,
            }
        )

    return {
        "junction_id": junction["id"],
        "name": junction["name"],
        "zone": junction["zone"],
        "priority_class": junction["priority_class"],
        "nearby_asset": junction["nearby_asset"],
        "lanes": lanes,
        "metrics": {
            "total_vehicles": total_vehicles,
            "avg_waiting_time": avg_wait,
            "avg_speed": avg_speed,
            "overall_congestion": round(density, 2),
            "pedestrian_load": junction["pedestrian_load"],
            "transit_priority": junction["transit_priority"],
            "emergency_ready": junction["emergency_ready"],
        },
    }


def _junction_snapshot(junction: Dict) -> Dict:
    traffic = _simulate_junction_traffic(junction)
    overall_congestion = traffic["metrics"]["overall_congestion"]
    predicted_congestion = min(max(overall_congestion + random.uniform(-0.04, 0.12), 0.15), 0.99)
    risk_score = min(
        100,
        int(
            overall_congestion * 55
            + (traffic["metrics"]["avg_waiting_time"] / 120) * 20
            + (1 if junction["priority_class"] == "Critical" else 0.6 if junction["priority_class"] == "High" else 0.35) * 15
            + (0 if junction["emergency_ready"] else 8)
        ),
    )
    ai_action = (
        "Extend east-west green by 18s and suppress right-turn overlap"
        if traffic["metrics"]["avg_waiting_time"] > 70
        else "Hold current cycle and rebalance pedestrian window"
        if junction["pedestrian_load"] == "High"
        else "Maintain adaptive cycle and monitor inflow"
    )

    return {
        "id": junction["id"],
        "name": junction["name"],
        "lat": junction["lat"],
        "lng": junction["lng"],
        "zone": junction["zone"],
        "density": _density_label(overall_congestion),
        "congestion_level": _level_from_score(overall_congestion),
        "signal_phase": f"{random.choice(['North-South', 'East-West'])} Green",
        "risk_score": risk_score,
        "predicted_congestion": round(predicted_congestion, 2),
        "ai_action": ai_action,
        "clearance_eta_min": max(3, int(6 + overall_congestion * 9 + random.randint(-1, 2))),
        "emergency_ready": junction["emergency_ready"],
    }


def _authority_insights() -> Dict:
    snapshots = [_junction_snapshot(junction) for junction in JUNCTIONS]
    ranked = sorted(snapshots, key=lambda item: item["risk_score"], reverse=True)

    hotspots = [
        {
            "junction_id": item["id"],
            "junction_name": item["name"],
            "zone": item["zone"],
            "risk_score": item["risk_score"],
            "current_level": item["congestion_level"],
            "predicted_level": _level_from_score(item["predicted_congestion"]),
            "recommended_action": item["ai_action"],
            "clearance_eta_min": item["clearance_eta_min"],
        }
        for item in ranked[:3]
    ]

    corridors = [
        {
            "id": "med-1",
            "name": "Hospital Priority Corridor",
            "route": ["j5", "j1"],
            "status": "Ready",
            "current_eta_min": 14,
            "optimized_eta_min": 9,
            "time_saved_min": 5,
            "confidence": 0.94,
        },
        {
            "id": "fire-2",
            "name": "Fire Response Corridor",
            "route": ["j2", "j4", "j5"],
            "status": "Monitoring",
            "current_eta_min": 18,
            "optimized_eta_min": 12,
            "time_saved_min": 6,
            "confidence": 0.89,
        },
    ]

    sensor_health = [
        {
            "junction_id": item["id"],
            "junction_name": item["name"],
            "camera_health": random.choice(["Healthy", "Healthy", "Occlusion Risk"]),
            "radar_health": random.choice(["Healthy", "Healthy", "Latency Drift"]),
            "last_sync_sec": random.randint(4, 18),
        }
        for item in snapshots
    ]

    actions = [
        {
            "title": "Deploy adaptive peak-hour pattern",
            "impact": "Expected 11-14% drop in average waiting time across top 3 junctions",
            "priority": "High",
        },
        {
            "title": "Reserve ambulance green wave on Guindy to Anna Salai corridor",
            "impact": "Reduce emergency ETA by up to 5 minutes during present congestion state",
            "priority": "Critical",
        },
        {
            "title": "Schedule camera maintenance at T. Nagar Smart Cross",
            "impact": "Improves evidence confidence for enforcement and anomaly detection",
            "priority": "Medium",
        },
    ]

    return {
        "timestamp": datetime.now().isoformat(),
        "network_score": 100 - int(sum(item["risk_score"] for item in snapshots) / len(snapshots) * 0.62),
        "critical_alerts": len([item for item in hotspots if item["risk_score"] >= 75]),
        "active_hotspots": hotspots,
        "recommended_actions": actions,
        "emergency_corridors": corridors,
        "sensor_health": sensor_health,
    }


@app.post("/api/auth/login", response_model=Token)
async def login(req: LoginRequest):
    if req.username == "admin" and req.password == "admin":
        return {"access_token": "dummy_admin_token", "token_type": "bearer", "role": "Super Admin"}
    if req.username == "engineer" and req.password == "engineer":
        return {"access_token": "dummy_engineer_token", "token_type": "bearer", "role": "Traffic Engineer"}
    if req.username == "operator" and req.password == "operator":
        return {"access_token": "dummy_operator_token", "token_type": "bearer", "role": "Traffic Operator"}
    if req.username == "emergency" and req.password == "emergency":
        return {"access_token": "dummy_emergency_token", "token_type": "bearer", "role": "Emergency Authority"}
    raise HTTPException(status_code=401, detail="Invalid credentials")


@app.post("/api/auth/logout")
async def logout():
    return {"message": "Logged out successfully"}


@app.get("/api/junctions")
async def get_junctions():
    return [_junction_snapshot(junction) for junction in JUNCTIONS]


@app.get("/api/junction/{junction_id}/traffic")
async def get_junction_traffic(junction_id: str):
    junction = _junction_by_id(junction_id)
    traffic = _simulate_junction_traffic(junction)
    priority_lane = max(traffic["lanes"], key=lambda lane: lane["queue_length"])
    return {
        **traffic,
        "advisory": {
            "priority_lane": priority_lane["direction"],
            "recommended_action": f"Extend {priority_lane['direction']} green by 12s",
            "confidence": round(random.uniform(0.84, 0.97), 2),
            "reason": f"Queue build-up near {junction['nearby_asset']}",
        },
    }


@app.get("/api/junction/{junction_id}/history")
async def get_junction_history(junction_id: str, time_range: str = "last_hour"):
    _junction_by_id(junction_id)
    points = {"last_hour": 6, "today": 8, "week": 7}.get(time_range, 6)
    now = datetime.now()
    history = []
    for index in range(points):
        history.append(
            {
                "timestamp": (now - timedelta(minutes=(points - index) * 10)).isoformat(),
                "total_vehicles": random.randint(140, 340),
                "congestion_score": round(random.uniform(0.32, 0.91), 2),
            }
        )
    return history


@app.get("/api/junction/{junction_id}/prediction")
async def get_junction_prediction(junction_id: str):
    junction = _junction_by_id(junction_id)
    return {
        "junction_id": junction_id,
        "next_30m": {"vehicle_density": "High", "waiting_time": 82, "recommended_mode": "Peak Protection"},
        "next_1h": {"vehicle_density": "Medium", "waiting_time": 51, "recommended_mode": "Balanced Flow"},
        "next_6h": {"vehicle_density": "Low", "waiting_time": 18, "recommended_mode": "Off-Peak Recovery"},
        "special_risk": f"Pedestrian spillover expected near {junction['nearby_asset']}",
    }


@app.post("/api/signal/control")
async def control_signal(req: SignalControlRequest):
    _junction_by_id(req.junction_id)
    return {"message": f"Signal overridden: {req.action} at {req.junction_id}"}


@app.get("/api/events")
async def get_events():
    return [
        {"timestamp": datetime.now().isoformat(), "description": "Adaptive green extension deployed on Anna Salai Command Junction"},
        {"timestamp": datetime.now().isoformat(), "description": "Emergency corridor simulation reduced ambulance ETA by 5 minutes"},
        {"timestamp": datetime.now().isoformat(), "description": "Sensor occlusion risk flagged at T. Nagar Smart Cross"},
    ]


@app.get("/api/authority/insights")
async def get_authority_insights():
    return _authority_insights()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
