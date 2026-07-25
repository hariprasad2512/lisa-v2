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
    try:
        # 1. Save the uploaded audio file temporarily
        temp_file_path = f"temp_{file.filename}"
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # 2. (Placeholder) Send to Groq Whisper for transcription
        # We will add the actual Groq API call here in a second!
        simulated_text = "This is a simulated transcription of your voice."
        
        # 3. Clean up the temporary file
        os.remove(temp_file_path)
        
        # 4. Return the transcribed text to the frontend
        return {"status": "success", "text": simulated_text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))