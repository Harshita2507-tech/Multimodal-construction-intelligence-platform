from typing import List, Optional
from pydantic import BaseModel, Field

class ChatMessage(BaseModel):
    role: str = Field(..., description="user, assistant, or system")
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    context_module: Optional[str] = Field(default=None, description="Optional current screen context (safety, crack, planning, etc.)")

class ChatResponse(BaseModel):
    reply: str
    references: List[str] = Field(default_factory=list, description="Relevant building codes, standard operating procedures, formulas")
    suggested_followups: List[str] = Field(default_factory=list)
