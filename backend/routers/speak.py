from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel
from services.tts_service import generate_speech_service
import os

router = APIRouter(tags=["Voice (TTS)"])

class SpeakRequest(BaseModel):
    text: str

def cleanup_file(file_path: str):
    """Helper function to delete the temporary mp3 file."""
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            print(f"Cleaned up temporary audio file: {file_path}")
        except Exception as e:
            print(f"Error deleting file: {e}")

@router.post("/speak")
async def speak_text(request: SpeakRequest, background_tasks: BackgroundTasks):
    try:
        output_file = await generate_speech_service(request.text)
        
        # Tell FastAPI to delete the file in the background right after sending it
        background_tasks.add_task(cleanup_file, output_file)
        
        return FileResponse(output_file, media_type="audio/mpeg")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))