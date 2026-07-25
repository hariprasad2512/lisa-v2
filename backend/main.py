import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import shutil
from dotenv import load_dotenv
import edge_tts
from fastapi.responses import FileResponse
from typing import Optional, Dict
from ddgs import DDGS
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

# Data model for the chat endpoint
class ChatRequest(BaseModel):
    text: str
    location: Optional[Dict[str, float]] = None

class SpeakRequest(BaseModel):
    text: str

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

def search_web(query: str) -> str:
    try:
        with DDGS() as ddgs:
            # Fetch top 3 results
            results = [r['body'] for r in ddgs.text(query, max_results=3)]
            if results:
                return " ".join(results)
    except Exception as e:
        print(f"Web search error: {e}")
    return "No live search results found."



# --- THE BRAIN: LLM Routing & Processing ---
@app.post("/chat")
async def chat_with_lisa(request: ChatRequest):
    user_text = request.text
    location_context = ""
    if request.location:
        location_context = f"\nUser's Current Coordinates: Latitude {request.location.get('latitude')}, Longitude {request.location.get('longitude')}."

    # Check if the query implies needing live information
    live_info = ""
    search_keywords = ["latest", "today", "news", "price", "current", "weather", "who won", "stock"]
    if any(keyword in user_text.lower() for keyword in search_keywords):
        search_snippet = search_web(user_text)
        live_info = f"\nLive Web Search Results for Context: {search_snippet}"

    system_prompt = (
        "You are Lisa, a friendly, modern, and concise voice assistant. "
        "Keep your answers short, conversational, and direct, as they will be spoken out loud. "
        f"{location_context}"
        f"{live_info}"
    )

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_text}
        ]
    )
    
    return {"response": completion.choices[0].message.content}

# --- THE VOICE: Text-to-Speech ---
@app.post("/speak")
async def speak_text(request: ChatRequest):
    try:
        # 1. Define the voice and the temporary file name
        # "en-US-AriaNeural" is a highly realistic, natural-sounding female voice
        voice = "en-US-AvaNeural" 
        output_file = "lisa_response.mp3"
        
        # 2. Generate the audio using edge-tts
        communicate = edge_tts.Communicate(request.text, voice)
        await communicate.save(output_file)
        
        # 3. Return the audio file directly to the frontend
        return FileResponse(output_file, media_type="audio/mpeg")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))