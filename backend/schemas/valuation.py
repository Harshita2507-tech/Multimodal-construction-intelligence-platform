from typing import List, Optional
from pydantic import BaseModel, Field

class ValuationInput(BaseModel):
    property_name: str = Field(default="Greenwood Executive Tower")
    property_type: str = Field(default="Residential Apartment")
    location_tier: str = Field(default="Tier 1 Prime / Metro CBD")
    land_area_sqft: float = Field(default=3500.0, ge=0.0)
    built_up_area_sqft: float = Field(default=2200.0, ge=100.0)
    property_age_years: int = Field(default=4, ge=0)
    construction_quality: str = Field(default="Premium / Grade B+")
    condition_state: str = Field(default="Excellent")
    amenities: List[str] = Field(default_factory=lambda: ["Basement Parking", "24/7 Security", "Power Backup", "Clubhouse & Gym", "Solar Water Heating"])

class ComparableSale(BaseModel):
    property_title: str
    distance_km: float
    sale_price_sqft: float
    sale_date: str

class ValuationReport(BaseModel):
    valuation_id: str
    generated_at: str
    estimated_market_value: float
    confidence_range_low: float
    confidence_range_high: float
    rate_per_sqft: float
    land_value_component: float
    construction_replacement_cost: float
    depreciation_amount: float
    depreciation_rate_percentage: float
    curb_appeal_factor: str
    comparable_sales: List[ComparableSale]
    rental_yield_percentage: float
    estimated_monthly_rent: float
    five_year_appreciation_forecast_percentage: float
    investment_score: int = Field(..., ge=0, le=100)
    investment_rating: str = Field(..., description="Strong Buy, Moderate Buy, Hold, or High Risk")
    valuation_rationale: str
