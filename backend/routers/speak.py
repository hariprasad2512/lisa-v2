from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from services.tts_service import generate_speech_service

router = APIRouter(tags=["Voice (TTS)"])

class SpeakRequest(BaseModel):
    text: str

@router.post("/speak")
async def speak_text(request: SpeakRequest):
    try:
        output_file = await generate_speech_service(request.text)
        return FileResponse(output_file, media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))