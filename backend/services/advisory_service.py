import uuid
import datetime
from typing import Optional
from ..schemas.advisory import (
    WeatherInput, WeatherSiteAdvisoryReport,
    SiteOperationImpact, DailyChecklistItem
)
from .gemini_service import gemini_service

class AdvisoryService:
    @staticmethod
    def generate_weather_advisory(input_data: WeatherInput, api_key: Optional[str] = None) -> WeatherSiteAdvisoryReport:
        if gemini_service.is_live_available(api_key):
            prompt = f"""
Act as a Principal Construction Safety Manager and Civil Works Superintendent.
Analyze the following environmental and meteorological conditions for active job site operations:
Site Location: {input_data.location}
Temperature: {input_data.temperature_c}°C
Condition: {input_data.condition}
Wind Speed: {input_data.wind_speed_kmh} km/h
Humidity: {input_data.humidity_percentage}%
Precipitation Probability: {input_data.precipitation_chance}%
24h Forecast: {input_data.forecast_next_24h}

Return strict JSON matching this schema:
{{
  "report_id": "string",
  "timestamp": "ISO 8601 string",
  "weather_summary": "Comprehensive site meteorological briefing",
  "overall_site_risk": "Low" | "Medium" | "High" | "Critical / Site Shutdown",
  "delay_probability_percentage": 0-100 integer,
  "concrete_curing_advisory": "string",
  "crane_lifting_advisory": "string",
  "excavation_safety_advisory": "string",
  "material_handling_guidelines": ["Guideline 1", "Guideline 2", "Guideline 3"],
  "operations_impact": [
    {{
      "activity_name": "Concrete Pouring & Curing" | "Tower Crane Lifting" | "Deep Trench Excavation" | "External Facade Plastering" | "Hot Works & Roofing",
      "status": "Safe to Proceed" | "Proceed with Caution" | "Halt Operation",
      "advisory_notes": "string",
      "risk_factors": ["Risk 1", "Risk 2"]
    }}
  ],
  "daily_supervisor_checklist": [
    {{
      "task_id": "CHK-01",
      "category": "Safety" | "Quality Control" | "Weather Defense" | "Equipment",
      "item": "Specific actionable inspection task",
      "assigned_role": "Site Engineer" | "Safety Officer" | "Crane Operator" | "Masonry Foreman",
      "priority": "High" | "Medium" | "Low"
    }}
  ],
  "contingency_recommendations": ["Contingency action 1", "Contingency action 2"]
}}
"""
            live_data = gemini_service.generate_json_response(prompt=prompt, override_key=api_key)
            if live_data:
                try:
                    if "report_id" not in live_data or not live_data["report_id"]:
                        live_data["report_id"] = f"ADV-{uuid.uuid4().hex[:8].upper()}"
                    if "timestamp" not in live_data:
                        live_data["timestamp"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
                    return WeatherSiteAdvisoryReport(**live_data)
                except Exception:
                    pass

        # Intelligent Heuristic Engineering Engine
        cond_lower = input_data.condition.lower()
        is_rain = "rain" in cond_lower or "storm" in cond_lower or input_data.precipitation_chance > 45
        is_windy = input_data.wind_speed_kmh > 35.0
        is_hot = input_data.temperature_c > 35.0
        is_freezing = input_data.temperature_c < 5.0

        risk_level = "Critical / Site Shutdown" if (input_data.wind_speed_kmh > 55 or "thunder" in cond_lower) else \
                     "High" if (is_rain or is_windy) else \
                     "Medium" if (is_hot or is_freezing or input_data.humidity_percentage > 85) else "Low"

        delay_prob = 85 if risk_level == "Critical / Site Shutdown" else 65 if risk_level == "High" else 30 if risk_level == "Medium" else 10

        # Concrete advisory
        if is_rain:
            concrete_status = "Halt Operation"
            concrete_notes = "Rain will dilute cement paste water-cement ratio, degrading compressive strength and causing surface scaling."
        elif is_hot:
            concrete_status = "Proceed with Caution"
            concrete_notes = f"High ambient temperature ({input_data.temperature_c}°C) accelerates hydration, leading to slump loss and plastic shrinkage cracks. Use chilled batch water and apply curing membranes immediately."
        else:
            concrete_status = "Safe to Proceed"
            concrete_notes = "Optimal environmental conditions for placing and hydration. Maintain standard 7-day wet burlap curing regimen."

        # Crane advisory
        if input_data.wind_speed_kmh > 38.0:
            crane_status = "Halt Operation"
            crane_notes = f"Wind gusts ({input_data.wind_speed_kmh} km/h) exceed OSHA 1926.1431 and manufacturer limits (>38 km/h / 20 knots). Boom must be weathervaned and hoists locked."
        elif input_data.wind_speed_kmh > 25.0:
            crane_status = "Proceed with Caution"
            crane_notes = "Moderate breeze. Avoid broad-surface panel lifts; use tagline guides on all loads."
        else:
            crane_status = "Safe to Proceed"
            crane_notes = "Calm wind profiles. Normal tandem and critical pick schedules authorized."

        # Trenching advisory
        if is_rain:
            trench_status = "Halt Operation"
            trench_notes = "Pore water pressure accumulation severely increases slope shear failure and mudslide risk. Keep trench pumps staged and workers clear."
        else:
            trench_status = "Safe to Proceed"
            trench_notes = "Soil moisture within normal range. Maintain daily competent person inspection before entry."

        operations = [
            SiteOperationImpact(
                activity_name="Ready-Mix Concrete Pouring & Slab Finishing",
                status=concrete_status,
                advisory_notes=concrete_notes,
                risk_factors=["Water-cement ratio dilution", "Plastic shrinkage micro-cracking", "Premature set under thermal stress"]
            ),
            SiteOperationImpact(
                activity_name="Tower Crane & Mobile Boom Heavy Lifting",
                status=crane_status,
                advisory_notes=crane_notes,
                risk_factors=["Aerodynamic drag on suspended loads", "Crane outrigger ground bearing instability", "Sudden thermal downdrafts"]
            ),
            SiteOperationImpact(
                activity_name="Deep Trenching & Subgrade Excavation",
                status=trench_status,
                advisory_notes=trench_notes,
                risk_factors=["Hydraulic liquefaction of trench sidewalls", "Water pooling causing foundation sub-base softening"]
            ),
            SiteOperationImpact(
                activity_name="External Facade Painting & Waterproofing",
                status="Halt Operation" if is_rain or input_data.humidity_percentage > 85 else "Safe to Proceed",
                advisory_notes="Moisture barriers and exterior acrylic coatings require dry substrate (<15% moisture content) for adhesive curing.",
                risk_factors=["Coating blister formation", "Adhesion shear failure", "Wash-off by precipitation"]
            )
        ]

        checklist = [
            DailyChecklistItem(task_id="CHK-01", category="Safety", item="Conduct morning 'Toolbox Talk' emphasizing wet weather traction and 100% harness tie-off.", assigned_role="Safety Officer", priority="High"),
            DailyChecklistItem(task_id="CHK-02", category="Equipment", item="Test ground fault circuit interrupters (GFCI) on all portable distribution boards.", assigned_role="Electrical Lead", priority="High"),
            DailyChecklistItem(task_id="CHK-03", category="Weather Defense", item="Inspect dewatering sump pumps and verify discharge channels are free of sediment blockages.", assigned_role="Site Engineer", priority="High" if is_rain else "Medium"),
            DailyChecklistItem(task_id="CHK-04", category="Quality Control", item="Perform concrete slump and temperature test on first transit mixer batch upon site entry.", assigned_role="QA/QC Inspector", priority="Medium"),
            DailyChecklistItem(task_id="CHK-05", category="Equipment", item="Verify anemometer calibration on tower crane cabin and review wind cutoff limits.", assigned_role="Crane Operator", priority="High" if is_windy else "Low"),
            DailyChecklistItem(task_id="CHK-06", category="Weather Defense", item="Anchor high-density tarpaulins over raw aggregate stock and exposed cement warehouses.", assigned_role="Logistics Foreman", priority="High" if is_rain else "Medium")
        ]

        return WeatherSiteAdvisoryReport(
            report_id=f"ADV-{uuid.uuid4().hex[:8].upper()}",
            timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat(),
            weather_summary=f"Site monitoring at {input_data.location}: {input_data.temperature_c}°C with {input_data.condition.lower()} conditions, wind speed of {input_data.wind_speed_kmh} km/h, and {input_data.humidity_percentage}% relative humidity.",
            overall_site_risk=risk_level,
            delay_probability_percentage=delay_prob,
            concrete_curing_advisory=concrete_notes,
            crane_lifting_advisory=crane_notes,
            excavation_safety_advisory=trench_notes,
            material_handling_guidelines=[
                "Store Portland cement bags on elevated timber pallets at least 150mm above ground level inside watertight enclosures.",
                "Cover high-yield TMT reinforcing steel bundles with breathable geotextile sheets to prevent flash surface rust from atmospheric condensation.",
                "Ensure volatile bonding chemicals, epoxy adhesives, and expansion joint sealants are stored between 15°C and 25°C away from direct sunlight.",
                "Secure loose sheet metal, plywood formwork boards, and perimeter safety signage against wind gusts."
            ],
            operations_impact=operations,
            daily_supervisor_checklist=checklist,
            contingency_recommendations=[
                "Stage standby diesel-powered dewatering pumps near basement lift pits.",
                "Reallocate exterior masonry crews to interior dry-walling and conduit chasing if precipitation begins.",
                "Coordinate with ready-mix concrete batching plant to adjust retarder dosage based on midday temperature peaks."
            ]
        )

advisory_service = AdvisoryService()
