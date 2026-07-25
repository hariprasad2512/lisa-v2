import os
import edge_tts

async def generate_speech_service(text: str, output_file: str = "lisa_response.mp3") -> str:
    voice = "en-US-AvaNeural"
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_file)
    return output_file