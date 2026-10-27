import pytest
from backend.services.safety_service import safety_service
from backend.services.crack_service import crack_service
from backend.services.planning_service import planning_service
from backend.services.valuation_service import valuation_service
from backend.services.advisory_service import advisory_service
from backend.services.assistant_service import assistant_service
from backend.schemas.planning import ProjectPlanningInput
from backend.schemas.valuation import ValuationInput
from backend.schemas.advisory import WeatherInput
from backend.schemas.assistant import ChatRequest, ChatMessage
from backend.routers.projects import health_check, get_project_stats, get_sample_presets

def test_health():
    res = health_check()
    assert res["status"] == "healthy"
    assert "version" in res

def test_project_stats():
    res = get_project_stats()
    assert res["total_epics"] == 9
    assert res["total_tasks"] == 18
    assert len(res["recent_alerts"]) > 0

def test_sample_presets():
    res = get_sample_presets()
    assert "safety" in res
    assert "crack" in res
    assert len(res["safety"]) >= 3
    assert len(res["crack"]) >= 3

def test_safety_service_compliant():
    report = safety_service.analyze_site_image(b"mock_bytes", "site_safe_crew.jpg")
    assert report.analysis_id.startswith("SAF-")
    assert report.overall_safety_score == 94
    assert report.risk_level == "Low Risk"
    assert len(report.ppe_compliance) == 5

def test_safety_service_excavation_hazard():
    report = safety_service.analyze_site_image(b"mock_bytes", "excavation_trench.jpg")
    assert report.risk_level == "High Risk"
    assert any("Cave-in" in h.hazard_type for h in report.hazards_detected)

def test_crack_service_shear_beam():
    report = crack_service.analyze_crack_image(b"mock_bytes", "shear_beam.jpg")
    assert report.analysis_id.startswith("CRK-")
    assert "Shear" in report.crack_type
    assert report.measurements.estimated_width_mm > 0.0

def test_crack_service_spall_column():
    report = crack_service.analyze_crack_image(b"mock_bytes", "column_spall.jpg")
    assert report.severity_grade == "Critical / Imminent Hazard"
    assert "Spall" in report.crack_type

def test_planning_service():
    inp = ProjectPlanningInput(
        project_name="Metropolis Commercial Plaza",
        project_type="Commercial Complex",
        built_up_area_sqft=45000.0,
        floors_count=6,
        target_budget_usd=3200000.0,
        target_duration_months=18
    )
    plan = planning_service.generate_project_plan(inp)
    assert plan.plan_id.startswith("PLN-")
    assert len(plan.milestones) == 6
    assert len(plan.cost_breakdown) == 6
    assert plan.total_estimated_cost > 0

def test_valuation_service():
    inp = ValuationInput(
        property_name="Aura Sky Villas",
        property_type="Independent Villa",
        location_tier="Tier 1 Prime / Metro CBD",
        land_area_sqft=5000.0,
        built_up_area_sqft=3800.0,
        property_age_years=2,
        construction_quality="Luxury / Grade A"
    )
    val = valuation_service.estimate_valuation(inp)
    assert val.valuation_id.startswith("VAL-")
    assert val.estimated_market_value > 0
    assert val.investment_score >= 80

def test_advisory_service():
    inp = WeatherInput(
        location="Harbor Logistics Dock",
        temperature_c=28.0,
        condition="Heavy Rain / Thunderstorm",
        wind_speed_kmh=42.0,
        humidity_percentage=92.0,
        precipitation_chance=85.0
    )
    adv = advisory_service.generate_weather_advisory(inp)
    assert adv.report_id.startswith("ADV-")
    assert adv.overall_site_risk in ["High", "Critical / Site Shutdown"]
    assert any(op.status == "Halt Operation" for op in adv.operations_impact)

def test_assistant_service():
    req = ChatRequest(
        messages=[
            ChatMessage(role="user", content="What are OSHA trench shoring rules?")
        ]
    )
    resp = assistant_service.answer_query(req)
    assert "OSHA" in resp.reply
    assert len(resp.references) > 0
