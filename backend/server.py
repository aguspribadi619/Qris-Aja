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
from emergentintegrations.llm.openai import OpenAITextToSpeech


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

# Text-to-Speech engine (Emergent managed OpenAI TTS)
tts_engine = OpenAITextToSpeech(api_key=os.environ.get('EMERGENT_LLM_KEY'))
VOICE_MAP = {"pria": "onyx", "wanita": "nova"}


class TTSRequest(BaseModel):
    text: str
    voice: str = "wanita"


@api_router.post("/tts/generate")
async def generate_tts(req: TTSRequest):
    voice = VOICE_MAP.get(req.voice, "nova")
    text = (req.text or "").strip()[:500]
    if not text:
        raise HTTPException(status_code=400, detail="text is required")
    key = hashlib.sha256(f"{text}|{voice}|tts-1".encode()).hexdigest()
    existing = await db.tts_audio.find_one({"key": key})
    if not existing:
        audio_bytes = await tts_engine.generate_speech(text=text, model="tts-1", voice=voice)
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
