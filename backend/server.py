from fastapi import FastAPI, APIRouter, HTTPException, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import hashlib
import base64
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime, timezone
from elevenlabs import ElevenLabs, VoiceSettings


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Text-to-Speech engine — ElevenLabs (natural Indonesian via eleven_multilingual_v2).
# Each persona maps to a distinct ElevenLabs voice so characters sound different.
el_client = ElevenLabs(api_key=os.environ.get('ELEVENLABS_API_KEY'))
EL_MODEL = "eleven_multilingual_v2"
EL_VOICE_MAP = {
    "lilis": "EXAVITQu4vr4xnSDxMaL",   # Sarah  - warm, reassuring female
    "parjo": "JBFqnCBsd6RMkjVDRZzb",   # George - warm, mature male storyteller
    "bagas": "TX3LPaxmHKxFdv7VOQHJ",   # Liam   - energetic young male
    "putri": "Xb7hH8MSUJpSbSDYk0k2",   # Alice  - clear, engaging female
    # legacy aliases
    "pria": "JBFqnCBsd6RMkjVDRZzb",
    "wanita": "Xb7hH8MSUJpSbSDYk0k2",
}
EL_DEFAULT_VOICE = "Xb7hH8MSUJpSbSDYk0k2"
# Per-persona speaking speed (ElevenLabs range ~0.7 slow .. 1.2 fast). Slower = clearer.
EL_SPEED = {"lilis": 0.80, "parjo": 0.86, "bagas": 0.90, "putri": 0.88,
            "pria": 0.86, "wanita": 0.88}
EL_DEFAULT_SPEED = 0.88


class TTSRequest(BaseModel):
    text: str
    voice: str = "putri"


@api_router.post("/tts/generate")
async def generate_tts(req: TTSRequest):
    voice_id = EL_VOICE_MAP.get(req.voice, EL_DEFAULT_VOICE)
    speed = EL_SPEED.get(req.voice, EL_DEFAULT_SPEED)
    text = (req.text or "").strip()[:500]
    if not text:
        raise HTTPException(status_code=400, detail="text is required")
    key = hashlib.sha256(f"{text}|{voice_id}|{EL_MODEL}|{speed}".encode()).hexdigest()
    existing = await db.tts_audio.find_one({"key": key})
    if not existing:
        audio_stream = el_client.text_to_speech.convert(
            text=text,
            voice_id=voice_id,
            model_id=EL_MODEL,
            output_format="mp3_44100_128",
            voice_settings=VoiceSettings(
                stability=0.5,
                similarity_boost=0.75,
                style=0.0,
                use_speaker_boost=True,
                speed=speed,
            ),
        )
        audio_bytes = b"".join(audio_stream)
        await db.tts_audio.insert_one({
            "key": key,
            "b64": base64.b64encode(audio_bytes).decode(),
            "created": datetime.now(timezone.utc).isoformat(),
        })
    return {"url": f"/api/tts/{key}.mp3"}


@api_router.get("/tts/{key}.mp3")
async def get_tts(key: str):
    doc = await db.tts_audio.find_one({"key": key})
    if not doc:
        raise HTTPException(status_code=404, detail="audio not found")
    return Response(
        content=base64.b64decode(doc["b64"]),
        media_type="audio/mpeg",
        headers={"Cache-Control": "public, max-age=31536000"},
    )


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
