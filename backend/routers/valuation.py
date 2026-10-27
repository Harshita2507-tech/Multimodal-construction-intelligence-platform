from fastapi import APIRouter, Header
from typing import Optional
from ..schemas.valuation import ValuationInput, ValuationReport
from ..services.valuation_service import valuation_service

router = APIRouter(prefix="/api/valuation", tags=["Real Estate Valuation"])

@router.post("/estimate", response_model=ValuationReport)
async def estimate_valuation(
    val_input: ValuationInput,
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-API-Key")
):
    return valuation_service.estimate_valuation(
        input_data=val_input,
        api_key=x_gemini_api_key
    )
