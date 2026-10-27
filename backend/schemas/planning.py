from typing import List
from pydantic import BaseModel, Field

class ProjectPlanningInput(BaseModel):
    project_name: str = Field(default="Skyline Residences")
    project_type: str = Field(default="Residential Multi-Storey")
    built_up_area_sqft: float = Field(default=25000.0, ge=100.0)
    floors_count: int = Field(default=4, ge=1)
    target_budget_usd: float = Field(default=1250000.0, ge=1000.0)
    target_duration_months: int = Field(default=14, ge=1)
    location_climate: str = Field(default="Subtropical / Moderate")

class Milestone(BaseModel):
    phase_number: int
    phase_name: str
    duration_weeks: int
    start_week: int
    end_week: int
    estimated_cost: float
    deliverables: List[str]
    critical_path: bool = False

class CostItem(BaseModel):
    category: str = Field(..., description="Civil/Structural, MEP Services, Finishes, Contingency, Equipment, Labor")
    amount: float
    percentage: float
    description: str

class ResourceRequirement(BaseModel):
    trade: str = Field(..., description="Civil Engineers, Masons, Electricians, Plumbers, Helpers, Operators")
    peak_headcount: int
    average_daily_rate: float
    total_man_days: int

class ProjectPlanReport(BaseModel):
    plan_id: str
    generated_at: str
    project_summary: str
    total_estimated_cost: float
    budget_variance_percentage: float
    contingency_fund: float
    total_duration_weeks: int
    milestones: List[Milestone]
    cost_breakdown: List[CostItem]
    resource_schedule: List[ResourceRequirement]
    risk_factors: List[str]
    efficiency_recommendations: List[str]
