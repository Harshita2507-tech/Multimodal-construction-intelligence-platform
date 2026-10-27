from fastapi import APIRouter, Header
from typing import Optional
from ..schemas.assistant import ChatRequest, ChatResponse
from ..services.assistant_service import assistant_service

router = APIRouter(prefix="/api/assistant", tags=["Construction Knowledge Assistant"])

@router.post("/chat", response_model=ChatResponse)
async def chat_assistant(
    chat_request: ChatRequest,
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-API-Key")
):
    return assistant_service.answer_query(
        request=chat_request,
        api_key=x_gemini_api_key
    )
