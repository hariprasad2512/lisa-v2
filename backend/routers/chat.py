from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict
from services.llm_service import get_llm_response

router = APIRouter(tags=["Brain (LLM)"])

class ChatRequest(BaseModel):
    text: str
    location: Optional[Dict[str, float]] = None

@router.post("/chat")
async def chat_with_lisa(request: ChatRequest):
    response_text = await get_llm_response(request.text, request.location)
    return {"response": response_text}