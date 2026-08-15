"""
Warm-up / pre-generate TTS cache so common announcements are served from MongoDB
cache (FREE, no ElevenLabs API call) at runtime.

Run:  python warmup_tts.py
It calls the same /api/tts/generate logic (via HTTP) so the cache keys match exactly
what the frontend requests. Safe to re-run; already-cached items are skipped by the
backend automatically (no extra API cost).
"""
import os
import sys
import requests

BACKEND = os.environ.get("WARMUP_BACKEND", "http://localhost:8001")

VOICES = ["lilis", "parjo", "bagas", "putri"]

# ---- terbilang (mirror of frontend src/audio/paymentSound.ts) ----
SATUAN = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh",
          "delapan", "sembilan", "sepuluh", "sebelas"]


def terbilang(x: int) -> str:
    n = abs(int(x))
    if n == 0:
        return "nol"
    if n < 12:
        return SATUAN[n]
    if n < 20:
        return terbilang(n - 10) + " belas"
    if n < 100:
        return terbilang(n // 10) + " puluh" + ((" " + terbilang(n % 10)) if n % 10 else "")
    if n < 200:
        return "seratus" + ((" " + terbilang(n - 100)) if n - 100 else "")
    if n < 1000:
        return terbilang(n // 100) + " ratus" + ((" " + terbilang(n % 100)) if n % 100 else "")
    if n < 2000:
        return "seribu" + ((" " + terbilang(n - 1000)) if n - 1000 else "")
    if n < 1_000_000:
        return terbilang(n // 1000) + " ribu" + ((" " + terbilang(n % 1000)) if n % 1000 else "")
    if n < 1_000_000_000:
        return terbilang(n // 1_000_000) + " juta" + ((" " + terbilang(n % 1_000_000)) if n % 1_000_000 else "")
    return terbilang(n // 1_000_000_000) + " miliar" + ((" " + terbilang(n % 1_000_000_000)) if n % 1_000_000_000 else "")


def combined_default(amount: int) -> str:
    """Matches the frontend default flow: intro + nominal + outro in ONE utterance."""
    return f"Sukses. {terbilang(amount)} rupiah. Terima kasih."


# Common warkop / UMKM nominal values + the prototype's demo amounts.
COMMON_AMOUNTS = [
    5000, 8000, 10000, 12000, 15000, 18000, 20000, 25000, 30000, 35000,
    40000, 42500, 50000, 60000, 75000, 86000, 100000, 125000, 150000, 200000,
]

GREETINGS = {
    "lilis": "Sampurasun, abdi Teh Lilis. Kumaha damang? Wilujeng sumping!",
    "parjo": "Sugeng rawuh, kula Mas Parjo. Piye kabare? Monggo mampir!",
    "bagas": "Halo, aku Bagas! Siap bantu transaksinya, Kak. Semangat!",
    "putri": "Halo, saya Putri. Selamat datang di QRIS Aja!",
}


def gen(text: str, voice: str) -> bool:
    try:
        r = requests.post(f"{BACKEND}/api/tts/generate",
                          json={"text": text, "voice": voice}, timeout=60)
        return r.status_code == 200
    except Exception as e:
        print("  ! error:", e)
        return False


def main():
    voices = sys.argv[1].split(",") if len(sys.argv) > 1 else VOICES
    ok = fail = 0
    print(f"Warming up voices: {voices}")

    # Greetings (per-character Test button)
    for v in voices:
        if gen(GREETINGS[v], v):
            ok += 1
            print(f"[greeting] {v} ✓")
        else:
            fail += 1

    # Combined default announcements for common amounts
    for v in voices:
        for amt in COMMON_AMOUNTS:
            if gen(combined_default(amt), v):
                ok += 1
            else:
                fail += 1
        print(f"[amounts] {v} done ({len(COMMON_AMOUNTS)})")

    print(f"\nDone. cached/generated OK={ok} FAIL={fail}")


if __name__ == "__main__":
    main()
