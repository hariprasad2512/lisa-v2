import edge_tts
from edge_tts import communicate
from edge_tts.constants import TRUSTED_CLIENT_TOKEN

# edge-tts 7.2.8 still targets Microsoft's retired synthesis host.
communicate.WSS_URL = (
    "wss://api.msedgeservices.com/tts/cognitiveservices/websocket/v1"
    f"?Ocp-Apim-Subscription-Key={TRUSTED_CLIENT_TOKEN}"
)

async def generate_speech_service(text: str, output_file: str = "lisa_response.mp3") -> str:
    voice = "en-US-AvaNeural"
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_file)
    return output_file