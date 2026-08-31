import os
from groq import Groq
from ddgs import DDGS
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def search_web(query: str) -> str:
    try:
        with DDGS() as ddgs:
            results = [r['body'] for r in ddgs.text(query, max_results=3)]
            if results:
                return " ".join(results)
    except Exception as e:
        print(f"Web search error: {e}")
    return "No live search results found."

async def get_llm_response(user_text: str, location: dict = None, history: list = None) -> str:
    location_context = ""

    # Keywords that explicitly request location-based information
    location_keywords = [
        "location", "where am i", "weather", "temperature", "forecast", 
        "rain", "nearby", "near me", "local", "city", "place", "places",
        "restaurant", "restaurants", "hotel", "hotels", "traffic", "here"
    ]

    # ONLY attach location coordinates if the user's query contains a location keyword
    if location and location.get('latitude') and location.get('longitude'):
        if any(keyword in user_text.lower() for keyword in location_keywords):
            location_context = (
                f"\nUser's Current Coordinates: Latitude {location.get('latitude')}, "
                f"Longitude {location.get('longitude')}."
            )

    live_info = ""
    search_keywords = ["latest", "today", "news", "price", "current", "weather", "who won", "stock"]
    if any(keyword in user_text.lower() for keyword in search_keywords):
        search_snippet = search_web(user_text)
        live_info = f"\nLive Web Search Results for Context: {search_snippet}"

    system_prompt = (
        "You are Lisa, a friendly, modern, and concise voice assistant. "
        "Keep your answers short, conversational, and direct, as they will be spoken out loud."
        "If the user asks to play music or a video (e.g., 'play Shape of You', 'play some songs')," 
        "you MUST respond strictly in valid JSON format:"
        '{"action": "play_music","query": "<song or video name>","speak": "Playing <song or video name> on YouTube"}'
        
        "For all other general conversations, respond normally as text and keep it short, as they will be spoken out loud."
        "You are an Indian. Use INR whenever required "
        f"{location_context}"
        f"{live_info}"
    )

    messages = [{"role": "system", "content": system_prompt}]

    if history:
        for msg in history[-15:]:
            role = msg.role if hasattr(msg, "role") else msg.get("role")
            content = msg.content if hasattr(msg, "content") else msg.get("content")
            if role in ("user", "assistant") and content:
                messages.append({"role": role, "content": content})

    messages.append({"role": "user", "content": user_text})

    completion = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=messages
    )
    
    return completion.choices[0].message.content