from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict
from services.llm_service import get_llm_response
from services.music_service import get_top_youtube_video
import json

router = APIRouter(tags=["Brain (LLM)"])

class ChatRequest(BaseModel):
    text: str
    location: Optional[Dict[str, float]] = None

@router.post("/chat")
async def chat_with_lisa(request: ChatRequest):
    response_text = await get_llm_response(request.text, request.location)
    # Check if LLM returned a JSON structured action for music playback
    try:
        data = json.loads(response_text)
        if isinstance(data, dict) and data.get("action") == "play_music":
            song_query = data.get("query", "")
            
            # Fetch direct YouTube watch link using yt-dlp
            direct_url = get_top_youtube_video(song_query)
            data["url"] = direct_url
            
            # Return JSON object with action, speak text, and direct video URL
            return data
    except json.JSONDecodeError:
        # Standard text response for normal conversation
        pass

    return {"response": response_text}