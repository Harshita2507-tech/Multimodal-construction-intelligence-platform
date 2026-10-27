from typing import List
from pydantic import BaseModel, Field

class WeatherInput(BaseModel):
    location: str = Field(default="Metro Central Construction Site - Sector 12")
    temperature_c: float = Field(default=33.5)
    condition: str = Field(default="Sunny / Clear")
    wind_speed_kmh: float = Field(default=18.0)
    humidity_percentage: float = Field(default=62.0)
    precipitation_chance: float = Field(default=15.0)
    forecast_next_24h: str = Field(default="Increasing cloud cover with 40% chance of evening thunderstorms and gusty winds up to 35 km/h.")

class SiteOperationImpact(BaseModel):
    activity_name: str = Field(..., description="Concrete Pouring, Crane Lifting, Trenching, External Plastering, Roofing")
    status: str = Field(..., description="Safe to Proceed, Proceed with Caution, or Halt Operation")
    advisory_notes: str
    risk_factors: List[str]

class DailyChecklistItem(BaseModel):
    task_id: str
    category: str = Field(..., description="Safety, Quality Control, Weather Defense, Equipment")
    item: str
    assigned_role: str = Field(..., description="Site Engineer, Safety Officer, Crane Operator, Masonry Foreman")
    priority: str = Field(..., description="High, Medium, or Low")

class WeatherSiteAdvisoryReport(BaseModel):
    report_id: str
    timestamp: str
    weather_summary: str
    overall_site_risk: str = Field(..., description="Low, Medium, High, or Critical / Site Shutdown")
    delay_probability_percentage: int = Field(..., ge=0, le=100)
    concrete_curing_advisory: str
    crane_lifting_advisory: str
    excavation_safety_advisory: str
    material_handling_guidelines: List[str]
    operations_impact: List[SiteOperationImpact]
    daily_supervisor_checklist: List[DailyChecklistItem]
    contingency_recommendations: List[str]
