from fastapi import APIRouter, Header
from typing import Optional
from ..schemas.planning import ProjectPlanningInput, ProjectPlanReport
from ..services.planning_service import planning_service

router = APIRouter(prefix="/api/planning", tags=["Construction Project Planning"])

@router.post("/generate", response_model=ProjectPlanReport)
async def generate_project_plan(
    plan_input: ProjectPlanningInput,
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-API-Key")
):
    return planning_service.generate_project_plan(
        input_data=plan_input,
        api_key=x_gemini_api_key
    )
