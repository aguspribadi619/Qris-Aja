"""Backend TTS API tests for QRIS Aja payment sound feature.

Covers:
- POST /api/tts/generate with each of 4 voices (putri, lilis, parjo, bagas)
- Returned URL serves a valid audio/mpeg via GET /api/tts/{key}.mp3
- Distinct voices map to distinct cache keys
- Idempotent caching: same text+voice returns same URL
- 404 on unknown key
- 400 on empty text
"""
import os
import re
import pytest
import requests

BASE_URL = (os.environ.get("EXPO_PUBLIC_BACKEND_URL") or os.environ.get("EXPO_BACKEND_URL") or "https://mobile-app-builder-2902.preview.emergentagent.com").rstrip("/")

VOICES = ["putri", "lilis", "parjo", "bagas"]
SAMPLE_TEXT = "lima puluh ribu rupiah"


@pytest.fixture(scope="module")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


def _extract_key(url: str) -> str:
    m = re.match(r"^/api/tts/([a-f0-9]{64})\.mp3$", url)
    assert m, f"URL not in expected form: {url}"
    return m.group(1)


class TestTTSGenerate:
    """POST /api/tts/generate — voice matrix + caching"""

    @pytest.mark.parametrize("voice", VOICES)
    def test_generate_returns_valid_url_and_audio(self, api_client, voice):
        resp = api_client.post(f"{BASE_URL}/api/tts/generate", json={"text": SAMPLE_TEXT, "voice": voice}, timeout=60)
        assert resp.status_code == 200, f"[{voice}] status={resp.status_code} body={resp.text}"
        data = resp.json()
        assert "url" in data, f"[{voice}] missing url"
        key = _extract_key(data["url"])

        # Fetch audio bytes
        audio = api_client.get(f"{BASE_URL}{data['url']}", timeout=60)
        assert audio.status_code == 200, f"[{voice}] audio status={audio.status_code}"
        assert audio.headers.get("content-type", "").startswith("audio/mpeg"), f"[{voice}] content-type={audio.headers.get('content-type')}"
        assert len(audio.content) > 500, f"[{voice}] audio too small: {len(audio.content)} bytes"

    def test_distinct_voices_produce_distinct_keys(self, api_client):
        keys = {}
        for v in VOICES:
            resp = api_client.post(f"{BASE_URL}/api/tts/generate", json={"text": SAMPLE_TEXT, "voice": v}, timeout=60)
            assert resp.status_code == 200
            keys[v] = _extract_key(resp.json()["url"])
        # ElevenLabs voice_ids: lilis=EXAVITQu4vr4xnSDxMaL, parjo=JBFqnCBsd6RMkjVDRZzb,
        # bagas=TX3LPaxmHKxFdv7VOQHJ, putri=Xb7hH8MSUJpSbSDYk0k2 — all distinct
        assert len(set(keys.values())) == len(VOICES), f"non-distinct keys per voice: {keys}"

    @pytest.mark.parametrize("voice", VOICES)
    def test_long_sentence_generates_successfully(self, api_client, voice):
        text = "Pembayaran lima puluh ribu rupiah berhasil, terima kasih"
        resp = api_client.post(f"{BASE_URL}/api/tts/generate", json={"text": text, "voice": voice}, timeout=90)
        assert resp.status_code == 200, f"[{voice}] status={resp.status_code} body={resp.text}"
        url = resp.json().get("url")
        assert url and re.match(r"^/api/tts/[a-f0-9]{64}\.mp3$", url)
        audio = api_client.get(f"{BASE_URL}{url}", timeout=60)
        assert audio.status_code == 200
        assert audio.headers.get("content-type", "").startswith("audio/mpeg")
        assert len(audio.content) > 500


class TestTTSGreetings:
    """Character signature greetings (per-character 'Tes' button)"""

    def test_lilis_greeting_generates_playable_mp3(self, api_client):
        text = "Sampurasun, abdi Teh Lilis. Kumaha damang?"
        resp = api_client.post(f"{BASE_URL}/api/tts/generate", json={"text": text, "voice": "lilis"}, timeout=60)
        assert resp.status_code == 200, resp.text
        url = resp.json().get("url")
        assert url and re.match(r"^/api/tts/[a-f0-9]{64}\.mp3$", url)
        audio = api_client.get(f"{BASE_URL}{url}", timeout=60)
        assert audio.status_code == 200
        assert audio.headers.get("content-type", "").startswith("audio/mpeg")
        assert len(audio.content) > 500

    def test_caching_idempotent_same_text_voice(self, api_client):
        payload = {"text": "cache probe", "voice": "putri"}
        r1 = api_client.post(f"{BASE_URL}/api/tts/generate", json=payload, timeout=60)
        r2 = api_client.post(f"{BASE_URL}/api/tts/generate", json=payload, timeout=60)
        assert r1.status_code == 200 and r2.status_code == 200
        assert r1.json()["url"] == r2.json()["url"], "cache mismatch on repeat call"


class TestTTSErrors:
    """Error handling paths"""

    def test_get_unknown_key_returns_404(self, api_client):
        fake_key = "0" * 64
        resp = api_client.get(f"{BASE_URL}/api/tts/{fake_key}.mp3", timeout=30)
        assert resp.status_code == 404

    def test_empty_text_returns_400(self, api_client):
        resp = api_client.post(f"{BASE_URL}/api/tts/generate", json={"text": "", "voice": "putri"}, timeout=30)
        assert resp.status_code == 400

    def test_whitespace_text_returns_400(self, api_client):
        resp = api_client.post(f"{BASE_URL}/api/tts/generate", json={"text": "   ", "voice": "putri"}, timeout=30)
        assert resp.status_code == 400
