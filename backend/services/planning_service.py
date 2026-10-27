import uuid
import datetime
from typing import Optional
from ..schemas.planning import (
    ProjectPlanningInput, ProjectPlanReport,
    Milestone, CostItem, ResourceRequirement
)
from .gemini_service import gemini_service

class PlanningService:
    @staticmethod
    def generate_project_plan(input_data: ProjectPlanningInput, api_key: Optional[str] = None) -> ProjectPlanReport:
        if gemini_service.is_live_available(api_key):
            prompt = f"""
Act as a Senior Construction Project Director and Certified Cost Estimator (AACE).
Generate a comprehensive construction project plan for the following project:
Project Name: {input_data.project_name}
Type: {input_data.project_type}
Built-up Area: {input_data.built_up_area_sqft} sq ft
Floors Count: {input_data.floors_count}
Target Budget: ${input_data.target_budget_usd}
Target Duration: {input_data.target_duration_months} months
Location Climate: {input_data.location_climate}

Return strict JSON adhering to:
{{
  "plan_id": "string",
  "generated_at": "ISO 8601 string",
  "project_summary": "Comprehensive executive summary",
  "total_estimated_cost": float,
  "budget_variance_percentage": float (-5 to +15),
  "contingency_fund": float (approx 10-12% of total),
  "total_duration_weeks": integer,
  "milestones": [
    {{
      "phase_number": 1,
      "phase_name": "Phase 1: Pre-Construction, Permitting & Site Mobilization",
      "duration_weeks": integer,
      "start_week": 1,
      "end_week": integer,
      "estimated_cost": float,
      "deliverables": ["Deliverable 1", "Deliverable 2"],
      "critical_path": true
    }}
  ],
  "cost_breakdown": [
    {{
      "category": "Civil & Structural Works",
      "amount": float,
      "percentage": float,
      "description": "Foundations, columns, slabs, rebar and concrete framing"
    }}
  ],
  "resource_schedule": [
    {{
      "trade": "Civil Engineers & Site Supervisors",
      "peak_headcount": integer,
      "average_daily_rate": float,
      "total_man_days": integer
    }}
  ],
  "risk_factors": ["Risk 1", "Risk 2"],
  "efficiency_recommendations": ["Recommendation 1", "Recommendation 2"]
}}
"""
            live_data = gemini_service.generate_json_response(prompt=prompt, override_key=api_key)
            if live_data:
                try:
                    if "plan_id" not in live_data or not live_data["plan_id"]:
                        live_data["plan_id"] = f"PLN-{uuid.uuid4().hex[:8].upper()}"
                    if "generated_at" not in live_data:
                        live_data["generated_at"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
                    return ProjectPlanReport(**live_data)
                except Exception:
                    pass

        # Intelligent Dynamic Calculation Engine
        total_weeks = input_data.target_duration_months * 4
        base_rate_sqft = 52.0 if "Industrial" in input_data.project_type else 68.0 if "Residential" in input_data.project_type else 84.0
        calculated_base_cost = input_data.built_up_area_sqft * base_rate_sqft * (1.0 + (input_data.floors_count * 0.04))
        
        # Balance realistic estimation with user target budget
        blended_total = round((calculated_base_cost * 0.55) + (input_data.target_budget_usd * 0.45), 2)
        contingency = round(blended_total * 0.10, 2)
        variance = round(((blended_total - input_data.target_budget_usd) / input_data.target_budget_usd) * 100.0, 1)

        # Milestone breakdown
        p1_w = max(4, int(total_weeks * 0.12))
        p2_w = max(6, int(total_weeks * 0.20))
        p3_w = max(8, int(total_weeks * 0.30))
        p4_w = max(6, int(total_weeks * 0.18))
        p5_w = max(5, int(total_weeks * 0.14))
        p6_w = max(3, total_weeks - (p1_w + p2_w + p3_w + p4_w + p5_w))

        milestones = [
            Milestone(
                phase_number=1,
                phase_name="Pre-Construction, Geotechnical Survey & Permitting",
                duration_weeks=p1_w,
                start_week=1,
                end_week=p1_w,
                estimated_cost=round(blended_total * 0.08, 2),
                deliverables=["Soil bore log reports", "Municipal building plan sanctions", "Temporary utilities & site perimeter hoarding", "Safety logistics layout"],
                critical_path=True
            ),
            Milestone(
                phase_number=2,
                phase_name="Substructure, Earthwork & Foundation Casting",
                duration_weeks=p2_w,
                start_week=p1_w + 1,
                end_week=p1_w + p2_w,
                estimated_cost=round(blended_total * 0.22, 2),
                deliverables=["Bulk excavation & dewatering", "PCC bed installation", "Raft/Footing reinforcement steel tying", "Substructure waterproofing & backfilling"],
                critical_path=True
            ),
            Milestone(
                phase_number=3,
                phase_name="Superstructure RCC Framing & Floor Slabs",
                duration_weeks=p3_w,
                start_week=p1_w + p2_w + 1,
                end_week=p1_w + p2_w + p3_w,
                estimated_cost=round(blended_total * 0.32, 2),
                deliverables=[f"Cast {input_data.floors_count} tier vertical column pours", "Post-tensioned suspended slab cycles", "Stairwell cores & perimeter shear walls", "Core cube compression tests (28-day verification)"],
                critical_path=True
            ),
            Milestone(
                phase_number=4,
                phase_name="MEP Infrastructure (HVAC, Electrical, Plumbing)",
                duration_weeks=p4_w,
                start_week=p1_w + p2_w + int(p3_w * 0.6),
                end_week=p1_w + p2_w + p3_w + int(p4_w * 0.5),
                estimated_cost=round(blended_total * 0.18, 2),
                deliverables=["Concealed conduit & busbar riser installation", "Primary water supply & sanitary drainage stacks", "HVAC ducting & chilled water piping", "Fire sprinkler riser distribution"],
                critical_path=False
            ),
            Milestone(
                phase_number=5,
                phase_name="Building Envelope, Masonry & Architectural Finishes",
                duration_weeks=p5_w,
                start_week=p1_w + p2_w + p3_w + 1,
                end_week=total_weeks - p6_w,
                estimated_cost=round(blended_total * 0.14, 2),
                deliverables=["Exterior glazing / curtain wall panels", "AAC blockwork masonry & internal gypsum plaster", "Vitrified tile flooring & acoustic false ceilings", "Door frames & architectural ironmongery"],
                critical_path=True
            ),
            Milestone(
                phase_number=6,
                phase_name="Testing, Commissioning, Snagging & Handover",
                duration_weeks=p6_w,
                start_week=total_weeks - p6_w + 1,
                end_week=total_weeks,
                estimated_cost=round(blended_total * 0.06, 2),
                deliverables=["MEP pressure testing & electrical load balancing", "Fire life safety authority final inspection", "Comprehensive punch list / snagging closeout", "Occupancy certificate (OC) issuance"],
                critical_path=True
            )
        ]

        cost_breakdown = [
            CostItem(category="Civil & Structural Works", amount=round(blended_total * 0.38, 2), percentage=38.0, description="Excavation, ready-mix concrete, TMT Fe550D rebar, formwork, and masonry."),
            CostItem(category="MEP Services (Mechanical, Electrical, Plumbing)", amount=round(blended_total * 0.22, 2), percentage=22.0, description="Cables, switchgear, distribution boards, piping, plumbing fixtures, and HVAC units."),
            CostItem(category="Architectural Finishes & Envelope", amount=round(blended_total * 0.18, 2), percentage=18.0, description="Flooring, wall finishes, structural glazing, joinery, and false ceilings."),
            CostItem(category="Equipment, Plant & Heavy Machinery", amount=round(blended_total * 0.08, 2), percentage=8.0, description="Tower crane, transit mixers, concrete boom pumps, hoists, and scaffolding."),
            CostItem(category="Labor & Supervision Payroll", amount=round(blended_total * 0.04, 2), percentage=4.0, description="Skilled trade payroll, QA/QC inspectors, and site safety management."),
            CostItem(category="Contingency & Escalation Buffer", amount=contingency, percentage=10.0, description="Hedging for commodity price fluctuations, adverse weather delays, and minor scope changes.")
        ]

        resource_schedule = [
            ResourceRequirement(trade="Civil & Structural Site Engineers", peak_headcount=4, average_daily_rate=120.0, total_man_days=int(total_weeks * 7 * 2.8)),
            ResourceRequirement(trade="Certified Safety Officers (HSE)", peak_headcount=2, average_daily_rate=95.0, total_man_days=int(total_weeks * 6 * 1.5)),
            ResourceRequirement(trade="Masons & Tile Layers", peak_headcount=18, average_daily_rate=55.0, total_man_days=int(total_weeks * 6 * 11.0)),
            ResourceRequirement(trade="Bar Benders & Steel Fixers", peak_headcount=14, average_daily_rate=52.0, total_man_days=int(total_weeks * 6 * 8.5)),
            ResourceRequirement(trade="Licensed Electricians & Plumbers", peak_headcount=12, average_daily_rate=65.0, total_man_days=int(total_weeks * 6 * 7.2)),
            ResourceRequirement(trade="Heavy Equipment & Crane Operators", peak_headcount=3, average_daily_rate=85.0, total_man_days=int(total_weeks * 6 * 2.2))
        ]

        return ProjectPlanReport(
            plan_id=f"PLN-{uuid.uuid4().hex[:8].upper()}",
            generated_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
            project_summary=f"Optimized WBS execution plan for {input_data.project_name} ({input_data.project_type}) spanning {input_data.built_up_area_sqft:,.0f} sq.ft across {input_data.floors_count} levels. Scheduled across {total_weeks} weeks with 6 synchronized construction work packages.",
            total_estimated_cost=blended_total,
            budget_variance_percentage=variance,
            contingency_fund=contingency,
            total_duration_weeks=total_weeks,
            milestones=milestones,
            cost_breakdown=cost_breakdown,
            resource_schedule=resource_schedule,
            risk_factors=[
                "Supply chain volatility in structural steel and Portland cement procurement.",
                "Subsurface water table fluctuations during deep basement excavation.",
                "Weather disruption during exterior envelope glazing and monsoon cycles.",
                "Critical path dependency between Phase 3 concrete curing and MEP riser release."
            ],
            efficiency_recommendations=[
                "Implement aluminum modular formwork (Mivan system) to reduce floor-to-floor cycle time from 14 to 7 days.",
                "Deploy prefabricated MEP bathroom pods to compress Phase 4 duration by 20%.",
                "Execute building information modeling (BIM) 3D clash detection prior to service conduit installation.",
                "Establish on-site rebar bend-and-cut yard to reduce scrap wastage from standard 8% down to 2.5%."
            ]
        )

planning_service = PlanningService()
