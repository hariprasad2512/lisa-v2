import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import shutil
from dotenv import load_dotenv


# Initialize the FastAPI app
app = FastAPI(title="Lisa Voice Assistant API")

# Load the .env file to our Server
load_dotenv()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Initialize Groq Client 
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

@app.get("/")
async def root():
    return {"message": "Hello from Lisa! The FastAPI backend is running perfectly."}


# --- THE EARS: Speech-to-Text ---
@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    temp_file_path = f"temp_{file.filename}"
    try:
        # 1. Save the uploaded audio file temporarily
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # 2. Send the file to Groq's Whisper API
        with open(temp_file_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                file=audio_file,
                model="whisper-large-v3-turbo",
                response_format="json"
            )
        
        # 3. Clean up the temporary file
        os.remove(temp_file_path)
        
        # 4. Return the transcribed text to the frontend
        return {"status": "success", "text": transcription.text}

    except Exception as e:
        # Safety net: Ensure the file gets deleted even if the API call fails
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail=str(e))