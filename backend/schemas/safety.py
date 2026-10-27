from typing import List, Optional
from pydantic import BaseModel, Field

class PPEItem(BaseModel):
    item_name: str = Field(..., description="e.g. Hardhat / Helmet, Hi-Vis Vest, Safety Boots, Gloves, Eye Protection, Harness")
    status: str = Field(..., description="Compliant, Non-Compliant, or Not Observed")
    confidence: float = Field(default=0.95, ge=0.0, le=1.0)
    count: int = Field(default=1, ge=0)
    details: str = Field(..., description="Observation description")

class HazardItem(BaseModel):
    hazard_type: str = Field(..., description="Scaffolding, Fall Hazard, Electrical, Trip/Slip, Equipment Proximity, etc.")
    severity: str = Field(..., description="Low, Medium, High, or Critical")
    location: str = Field(..., description="Approximate region or object in frame")
    description: str = Field(...)
    remediation: str = Field(..., description="Immediate mitigation action required")
    bounding_box: Optional[List[float]] = Field(default=None, description="[ymin, xmin, ymax, xmax] normalized 0-1000")

class SafetyReport(BaseModel):
    analysis_id: str
    timestamp: str
    site_context: str
    workers_detected: int
    overall_safety_score: int = Field(..., ge=0, le=100, description="0 to 100 safety index")
    risk_level: str = Field(..., description="Low Risk, Moderate Risk, High Risk, or Critical Risk")
    ppe_compliance: List[PPEItem]
    hazards_detected: List[HazardItem]
    priority_corrective_actions: List[str]
    osha_references: List[str]
    summary: str
