from fastapi import APIRouter, UploadFile, File, Form, Header
from typing import Optional
from ..schemas.crack import CrackAnalysisReport
from ..services.crack_service import crack_service

router = APIRouter(prefix="/api/crack", tags=["Structural Crack Analysis"])

@router.post("/analyze", response_model=CrackAnalysisReport)
async def analyze_structural_crack(
    file: Optional[UploadFile] = File(None),
    preset: Optional[str] = Form(None),
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-API-Key")
):
    image_bytes = b""
    filename = "crack.jpg"
    
    if file and file.filename:
        filename = file.filename
        image_bytes = await file.read()
    elif preset:
        filename = f"{preset}.jpg"
        image_bytes = b"preset_dummy_data"
        
    return crack_service.analyze_crack_image(
        image_bytes=image_bytes,
        filename=filename,
        api_key=x_gemini_api_key
    )
