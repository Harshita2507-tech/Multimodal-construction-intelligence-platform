from fastapi import APIRouter
from typing import Dict, Any, List
from ..services.gemini_service import gemini_service

router = APIRouter(prefix="/api", tags=["Platform System & Projects"])

@router.get("/health")
def health_check() -> Dict[str, Any]:
    return {
        "status": "healthy",
        "service": "Multimodal Construction Intelligence Platform",
        "version": "1.0.0",
        "gemini_live_connected": gemini_service.is_live_available(),
        "ai_engine_mode": "Gemini 1.5 Multimodal" if gemini_service.is_live_available() else "Built-in Autonomous Civil AI Engine"
    }

@router.get("/projects/stats")
def get_project_stats() -> Dict[str, Any]:
    return {
        "total_epics": 9,
        "completed_epics": 9,
        "total_tasks": 18,
        "completed_tasks": 18,
        "active_sites_monitored": 4,
        "average_safety_index": 84,
        "inspections_performed": 142,
        "recent_alerts": [
            {"id": "ALT-1", "severity": "High", "text": "Scaffold Tier 3 guardrail defect reported at North Tower", "time": "25 mins ago"},
            {"id": "ALT-2", "severity": "Medium", "text": "Wind advisory threshold reached (>38 km/h). Crane ops paused", "time": "1 hour ago"},
            {"id": "ALT-3", "severity": "Low", "text": "Daily toolbox talk completed for 42 workers", "time": "3 hours ago"}
        ]
    }

@router.get("/samples")
def get_sample_presets() -> Dict[str, List[Dict[str, str]]]:
    return {
        "safety": [
            {
                "id": "safety_scaffold",
                "label": "Elevated Scaffolding & Fall Hazards",
                "tag": "High Risk Warning",
                "description": "Scaffold assembly with missing toe-board and unattached harness at 4m elevation."
            },
            {
                "id": "safety_safe",
                "label": "Fully Compliant Structural Crew",
                "tag": "Exemplary Site",
                "description": "Framing crew with 100% hardhat, hi-vis vest, and clean perimeter netting."
            },
            {
                "id": "safety_excavation",
                "label": "Deep Trench & Excavation Risk",
                "tag": "Critical Cave-in Risk",
                "description": "2.1m trench cut without trench box shield and surcharge spoil near edge."
            }
        ],
        "crack": [
            {
                "id": "crack_shear",
                "label": "Beam 45° Diagonal Shear Crack",
                "tag": "Structural Critical",
                "description": "Primary RCC beam displaying 3.8mm diagonal tension crack near column support."
            },
            {
                "id": "crack_spall",
                "label": "Column Spall & Corroded Rebar",
                "tag": "Imminent Hazard",
                "description": "Concrete cover spalling exposing oxidized longitudinal rebar with 18% steel loss."
            },
            {
                "id": "crack_hairline",
                "label": "Masonry Plaster Hairline Crack",
                "tag": "Cosmetic / Minor",
                "description": "0.45mm shrinkage hairline crack on interior partition block wall."
            }
        ]
    }
