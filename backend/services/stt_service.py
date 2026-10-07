import os
import shutil

from groq import Groq
from fastapi import UploadFile, HTTPException
from dotenv import load_dotenv


load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))


def convert_to_english(text: str) -> str:
    """
    Convert any non-English speech transcript into English.

    If the transcript is already English, keep it in English.
    """

    if not text:
        return text

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are the English language normalization layer "
                        "of Lisa, an AI voice assistant.\n\n"
                        "Convert the user's text into clear natural English.\n"
                        "The input may be Hindi, Marathi, Bengali, Telugu, "
                        "Tamil, Punjabi, Gujarati, Kannada, Malayalam, "
                        "Urdu, Arabic, Spanish, or another language.\n\n"
                        "If the input is already English, return it unchanged.\n"
                        "If the input is written using Roman/Latin characters "
                        "but represents another language, translate its meaning "
                        "into English instead of merely transliterating it.\n\n"
                        "Do not explain the translation.\n"
                        "Do not add quotes.\n"
                        "Do not add labels.\n"
                        "Return ONLY the final English sentence."
                    )
                },
                {
                    "role": "user",
                    "content": text
                }
            ],
            temperature=0.0
        )

        english_text = response.choices[0].message.content.strip()

        return english_text or text

    except Exception:
        # Keep the original transcription if the translation layer fails.
        return text


async def transcribe_audio_service(file: UploadFile) -> str:
    temp_file_path = f"temp_{file.filename}"

    try:
        # ---------------------------------------------------------
        # Save uploaded audio temporarily
        # ---------------------------------------------------------
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # ---------------------------------------------------------
        # PASS 1: Convert multilingual speech to text
        # ---------------------------------------------------------
        with open(temp_file_path, "rb") as audio_file:
            translation = client.audio.translations.create(
                file=audio_file,
                model="whisper-large-v3",
                response_format="json",
                temperature=0.0
            )

        text = translation.text.strip()

        # ---------------------------------------------------------
        # PASS 2: Ensure the final text is English
        # ---------------------------------------------------------
        text = convert_to_english(text)

        return text

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Speech translation failed: {str(e)}"
        )

    finally:
        # Always remove temporary audio file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)