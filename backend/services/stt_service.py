import os
import shutil
from groq import Groq
from fastapi import UploadFile, HTTPException
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

async def transcribe_audio_service(file: UploadFile) -> str:
    temp_file_path = f"temp_{file.filename}"
    indian_context_prompt = (
                "The user is an Indian speaker talking to Lisa, an AI Voice Assistant. "
            )
    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        with open(temp_file_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                file=audio_file,
                model="whisper-large-v3",
                response_format="json",
                language="en",                   # <--- ADD THIS PARAMETER
                prompt=indian_context_prompt,
                temperature=0.0
            )
        
        os.remove(temp_file_path)
        return transcription.text

    except Exception as e:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail=str(e))

