import os
import shutil
from groq import Groq
from fastapi import UploadFile, HTTPException
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))


# Whisper may return language names such as "Hindi" or "English",
# while the API expects ISO-639-1 language codes such as "hi" or "en".
LANGUAGE_CODES = {
    "hindi": "hi",
    "english": "en",
    "marathi": "mr",
    "tamil": "ta",
    "telugu": "te",
    "bengali": "bn",
    "gujarati": "gu",
    "kannada": "kn",
    "malayalam": "ml",
    "punjabi": "pa",
    "urdu": "ur",
    "odia": "or",
    "assamese": "as",
    "nepali": "ne",
}


def needs_transliteration(text: str) -> bool:
    """Return True when the text contains non-Latin characters."""
    return any(ord(char) > 127 for char in text)


def transliterate_to_roman(text: str) -> str:
    """
    Convert Indian-language text into Roman/Latin characters.

    This is transliteration, not translation.
    Example:
    'काकडीचा बांधा तुझा मिरचीचा तोरा'
    -> 'Kakdicha bandha tujha mirchicha tora'
    """

    if not text or not needs_transliteration(text):
        return text

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a transliteration engine for an Indian voice assistant. "
                        "Convert the given Indian-language text from its native Unicode "
                        "script into Roman/Latin English characters based on pronunciation. "
                        "DO NOT translate the meaning into English. "
                        "Preserve the original words and pronunciation as closely as possible. "
                        "English words already written in Latin script must remain unchanged. "
                        "Return ONLY the transliterated text. "
                        "Do not add explanations, quotes, labels, or commentary."
                    )
                },
                {
                    "role": "user",
                    "content": text
                }
            ],
            temperature=0.0
        )

        transliterated_text = response.choices[0].message.content.strip()

        return transliterated_text or text

    except Exception:
        # If transliteration fails, return the original transcription
        # instead of failing the entire speech request.
        return text


async def transcribe_audio_service(file: UploadFile) -> str:
    temp_file_path = f"temp_{file.filename}"

    try:
        # Save the uploaded audio temporarily
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # ---------------------------------------------------------
        # PASS 1: Detect the language
        # ---------------------------------------------------------
        with open(temp_file_path, "rb") as audio_file:
            language_detection = client.audio.transcriptions.create(
                file=audio_file,
                model="whisper-large-v3",
                response_format="verbose_json",
                temperature=0.0
            )

        detected_language = getattr(
            language_detection,
            "language",
            None
        )

        # Convert language name to ISO-639-1 code
        language_code = None

        if detected_language:
            language_code = LANGUAGE_CODES.get(
                detected_language.lower()
            )

        # ---------------------------------------------------------
        # PASS 2: Transcribe using the detected language
        # ---------------------------------------------------------
        with open(temp_file_path, "rb") as audio_file:

            transcription_options = {
                "file": audio_file,
                "model": "whisper-large-v3",
                "response_format": "json",
                "temperature": 0.0
            }

            # Only provide language when we successfully detected it.
            if language_code:
                transcription_options["language"] = language_code

            transcription = client.audio.transcriptions.create(
                **transcription_options
            )

        text = transcription.text.strip()

        # ---------------------------------------------------------
        # PASS 3: Transliterate local-language Unicode to Roman
        # ---------------------------------------------------------
        text = transliterate_to_roman(text)

        return text

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Speech transcription failed: {str(e)}"
        )

    finally:
        # Always remove the temporary audio file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)