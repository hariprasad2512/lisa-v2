# 🎙️ Lisa Voice Assistant

> **A modern, AI-powered full-stack voice assistant built for 2026.**  
> Lisa combines real-time speech recognition, intelligent LLM responses, live web search, browser geolocation, cloud memory, and natural neural voice synthesis into a seamless conversational experience.

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/AI-Groq%20LLMs-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase" />
  <img src="https://img.shields.io/badge/Deployment-Vercel%20%7C%20Render-black?style=for-the-badge" />
</p>

---

## 🚀 Live Demo

### 🌐 Frontend
**https://lisa-voice-assistant.vercel.app**

### ⚙️ Backend API
**https://lisa-backend.onrender.com**

---

# 📖 Overview

Lisa is a next-generation AI voice assistant designed with a modern decoupled architecture.

Unlike traditional assistants that rely on predefined responses, Lisa leverages open-source Large Language Models, real-time web retrieval, speech recognition, browser geolocation, and persistent cloud memory to create a truly conversational AI experience.

The project emphasizes:

- ⚡ Low latency voice conversations
- 🧠 Agentic reasoning with live web search
- 🎤 Natural speech recognition
- 🔊 Neural text-to-speech
- ☁️ Persistent cloud memory
- 📍 Hyper-local context awareness
- 🔐 Secure authentication

---

# ✨ Features

## 🎤 Natural Voice Conversations

- Speak naturally using your microphone
- High-speed speech transcription
- AI-generated conversational responses
- Neural voice playback

---

## 🌍 Real-Time Web Search

Lisa performs live internet searches whenever required, enabling responses beyond the LLM training cutoff.

**Benefits**

- Current news
- Live events
- Weather
- Sports
- Technology updates
- General internet knowledge

---

## 📍 Browser Geolocation

Lisa can automatically access browser location (with permission).

This enables:

- Nearby recommendations
- Local weather
- Restaurants
- Travel information
- Location-aware AI responses

---

## 🧠 Persistent Cloud Memory

Users can immediately start chatting without creating an account.

### Guest Mode

- Stores chat history locally
- Uses browser localStorage
- No login required

### Google Sign-In

Once users authenticate via Supabase:

- Local conversations automatically migrate
- Chat history is securely stored
- Conversations persist across devices

---

## 🔐 Secure Authentication

Powered by Supabase Authentication.

Supports:

- Google OAuth
- Secure session management
- PostgreSQL cloud storage

---

## 🎨 Modern UI/UX

Features include:

- Smooth animations
- Responsive layout
- Audio-reactive microphone controls
- Beautiful chat interface
- AI speech interruption
- Mobile-friendly experience

---

# 🏗️ System Architecture

```text
                  React + Vite Frontend
                           │
      Audio Blob + Geolocation + User Input
                           │
                           ▼
                FastAPI Backend (Python)
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
   Whisper STT        Groq LLM        DuckDuckGo Search
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
                  Edge-TTS Neural Voice
                           │
                           ▼
                    Audio Playback
```

---

# ⚙️ Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- Lucide Icons
- Supabase JS Client

---

## Backend

- Python
- FastAPI
- Uvicorn
- Pydantic

---

## AI & Services

- Groq API
- Whisper Speech-to-Text
- Llama 3.3 70B Versatile
- Edge-TTS
- DuckDuckGo Search
- Supabase Authentication
- PostgreSQL

---

## Cloud Deployment

- Vercel
- Render

---

# 📂 Project Structure

```text
lisa-v2/
│
├── backend/
│   ├── routers/
│   │   ├── chat.py
│   │   ├── speak.py
│   │   └── transcribe.py
│   │
│   ├── services/
│   │   ├── llm_service.py
│   │   ├── stt_service.py
│   │   └── tts_service.py
│   │
│   ├── main.py
│   ├── requirements.txt
│   ├── Procfile
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AuthButton.jsx
    │   │   ├── ChatWindow.jsx
    │   │   ├── Header.jsx
    │   │   └── MicrophoneControls.jsx
    │   │
    │   ├── hooks/
    │   │   ├── useAudioRecorder.js
    │   │   ├── useAuth.js
    │   │   └── useGeolocation.js
    │   │
    │   ├── App.jsx
    │   ├── chatService.js
    │   ├── supabaseClient.js
    │   └── index.css
    │
    ├── index.html
    ├── package.json
    └── .env
```

---

# 🚀 Installation

## Prerequisites

Install the following before getting started.

- Python 3.10+
- Node.js
- npm
- Git
- Groq API Key
- Supabase Project

---

# 🔧 Backend Setup

Clone the repository.

```bash
git clone https://github.com/your-username/lisa-voice-assistant.git

cd lisa-voice-assistant
```

Navigate to the backend.

```bash
cd backend
```

Create a virtual environment.

```bash
python -m venv venv
```

Activate it.

### macOS / Linux

```bash
source venv/bin/activate
```

### Windows

```bash
venv\Scripts\activate
```

Install dependencies.

```bash
pip install -r requirements.txt
```

Create a `.env` file.

```env
GROQ_API_KEY=your_groq_api_key
```

Run the FastAPI server.

```bash
uvicorn main:app --reload
```

Backend URL

```
http://127.0.0.1:8000
```

---

# 💻 Frontend Setup

Open another terminal.

```bash
cd frontend
```

Install packages.

```bash
npm install
```

Create a `.env` file.

```env
VITE_SUPABASE_URL=your_supabase_project_url

VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

VITE_BACKEND_URL=http://127.0.0.1:8000
```

Run the development server.

```bash
npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

# ☁️ Deployment

## Backend (Render)

### Build Command

```bash
pip install -r requirements.txt
```

### Start Command

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

---

## Frontend (Vercel)

Framework

```
Vite
```

Build Command

```bash
npm run build
```

Output Directory

```text
dist
```

---

# 🔄 Application Flow

```text
User speaks
      │
      ▼
Browser records audio
      │
      ▼
FastAPI receives audio
      │
      ▼
Whisper converts Speech → Text
      │
      ▼
Groq LLM processes prompt
      │
      ├────────► DuckDuckGo Search (if required)
      │
      ▼
LLM generates response
      │
      ▼
Edge-TTS converts Text → Speech
      │
      ▼
Frontend plays audio
```

---

# 🌟 Why Lisa?

- Modern 2026 architecture
- Fully decoupled frontend & backend
- Real-time web retrieval
- Voice-first interaction
- Secure cloud memory
- Guest-to-user migration
- Fast AI inference using Groq
- Beautiful UI
- Easy deployment
- Open-source stack

---

# 🔮 Future Improvements

- Streaming AI responses
- Multiple LLM provider support
- Conversation summarization
- Vision (image understanding)
- File uploads
- Calendar integration
- Reminder system
- Multi-language conversations
- Voice customization
- Offline mode

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Hariprasad Anuganti**

Full Stack Developer | AI Enthusiast | Flutter Developer

- GitHub: https://github.com/hariprasad2512
- LinkedIn: https://linkedin.com/in/hariprasad-anuganti

---

<p align="center">
Built with ❤️ using React, FastAPI, Groq, Supabase & Edge-TTS
</p>