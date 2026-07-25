from fastapi import APIRouter, UploadFile, File
from services.stt_service import transcribe_audio_service

router = APIRouter(tags=["Ears (STT)"])

@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    text = await transcribe_audio_service(file)
    return {"status": "success", "text": text}