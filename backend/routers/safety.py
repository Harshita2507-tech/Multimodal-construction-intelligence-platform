from fastapi import APIRouter, UploadFile, File, Form, Header
from typing import Optional
from ..schemas.safety import SafetyReport
from ..services.safety_service import safety_service

router = APIRouter(prefix="/api/safety", tags=["Site Safety Monitoring"])

@router.post("/analyze", response_model=SafetyReport)
async def analyze_site_safety(
    file: Optional[UploadFile] = File(None),
    preset: Optional[str] = Form(None),
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-API-Key")
):
    image_bytes = b""
    filename = "upload.jpg"
    
    if file and file.filename:
        filename = file.filename
        image_bytes = await file.read()
    elif preset:
        filename = f"{preset}.jpg"
        image_bytes = b"preset_dummy_data"
    
    return safety_service.analyze_site_image(
        image_bytes=image_bytes,
        filename=filename,
        api_key=x_gemini_api_key
    )
