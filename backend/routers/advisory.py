from fastapi import APIRouter, Header
from typing import Optional
from ..schemas.advisory import WeatherInput, WeatherSiteAdvisoryReport
from ..services.advisory_service import advisory_service

router = APIRouter(prefix="/api/advisory", tags=["Daily Site Assistance & Weather Advisory"])

@router.post("/daily-weather", response_model=WeatherSiteAdvisoryReport)
async def get_weather_advisory(
    weather_input: WeatherInput,
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-API-Key")
):
    return advisory_service.generate_weather_advisory(
        input_data=weather_input,
        api_key=x_gemini_api_key
    )
