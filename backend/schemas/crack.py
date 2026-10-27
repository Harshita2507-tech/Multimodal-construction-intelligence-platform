from typing import List, Optional
from pydantic import BaseModel, Field

class CrackMeasurement(BaseModel):
    estimated_width_mm: float = Field(..., ge=0.0)
    estimated_length_cm: float = Field(..., ge=0.0)
    orientation: str = Field(..., description="Horizontal, Vertical, Diagonal, Stepped / Map pattern")
    depth_characteristic: str = Field(..., description="Surface only, Sub-surface, Deep through-thickness")

class CrackAnalysisReport(BaseModel):
    analysis_id: str
    timestamp: str
    element_inspected: str = Field(..., description="Beam, Column, Slab, Wall, Foundation, etc.")
    crack_type: str = Field(..., description="Hairline, Structural Shear, Settlement, Shrinkage, Spalling, etc.")
    severity_grade: str = Field(..., description="Minor, Moderate, Severe, or Critical")
    severity_score: int = Field(..., ge=0, le=100, description="0 (trivial) to 100 (critical structural failure)")
    structural_integrity_risk: str
    propagation_likelihood: str = Field(..., description="Low, Medium, or High")
    measurements: CrackMeasurement
    root_causes: List[str]
    remediation_methods: List[str]
    urgency_level: str = Field(..., description="Routine, Scheduled, Urgent, or Immediate")
    inspection_code_standards: List[str]
    technical_summary: str
