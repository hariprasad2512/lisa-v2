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

async def get_llm_response(user_text: str, location: dict = None) -> str:
    location_context = ""
    if location:
        location_context = f"\nUser's Current Coordinates: Latitude {location.get('latitude')}, Longitude {location.get('longitude')}."

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
    
    return completion.choices[0].message.content