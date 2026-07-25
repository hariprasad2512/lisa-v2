from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Initialize the FastAPI app
app = FastAPI(title="Lisa Voice Assistant API")

# Configure CORS so the React frontend can communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, you'd replace "*" with your React app's URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# A simple root endpoint to test if the server is running
@app.get("/")
async def root():
    return {"message": "Hello from Lisa! The FastAPI backend is running perfectly.","text": "All good ...Let's go"}