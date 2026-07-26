from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Import our modular routers
from routers import transcribe, chat, speak

# Load environment variables
load_dotenv()

# Initialize the FastAPI app
app = FastAPI(title="Lisa Voice Assistant API", version="2.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Include the routers
app.include_router(transcribe.router)
app.include_router(chat.router)
app.include_router(speak.router)

@app.get("/")
async def root():
    return {"message": "Hello from Lisa! FastAPI backend is running perfectly."}