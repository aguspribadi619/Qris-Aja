import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import * as DocumentPicker from "expo-document-picker";

const BACKEND = process.env.EXPO_PUBLIC_BACKEND_URL;

const satuan = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];

export function terbilang(input: number): string {
  const n = Math.floor(Math.abs(input));
  if (n === 0) return "nol";
  if (n < 12) return satuan[n];
  if (n < 20) return terbilang(n - 10) + " belas";
  if (n < 100) return terbilang(Math.floor(n / 10)) + " puluh" + (n % 10 ? " " + terbilang(n % 10) : "");
  if (n < 200) return "seratus" + (n - 100 ? " " + terbilang(n - 100) : "");
  if (n < 1000) return terbilang(Math.floor(n / 100)) + " ratus" + (n % 100 ? " " + terbilang(n % 100) : "");
  if (n < 2000) return "seribu" + (n - 1000 ? " " + terbilang(n - 1000) : "");
  if (n < 1000000) return terbilang(Math.floor(n / 1000)) + " ribu" + (n % 1000 ? " " + terbilang(n % 1000) : "");
  if (n < 1000000000) return terbilang(Math.floor(n / 1000000)) + " juta" + (n % 1000000 ? " " + terbilang(n % 1000000) : "");
  return terbilang(Math.floor(n / 1000000000)) + " miliar" + (n % 1000000000 ? " " + terbilang(n % 1000000000) : "");
}

// Voice characters for nominal announcement (mapped to distinct voices on backend).
export const VOICE_CHARS = [
  { id: "lilis", name: "Teh Lilis", desc: "Logat Sunda · ramah & hangat" },
  { id: "parjo", name: "Mas Parjo", desc: "Logat Jawa · santai & familiar" },
  { id: "bagas", name: "Kak Bagas", desc: "Indonesia · muda & energik" },
  { id: "putri", name: "Kak Putri", desc: "Indonesia · jelas & ramah" },
];

const ttsCache: Record<string, string> = {};

async function generateTts(text: string, voice: string): Promise<string | null> {
  const cacheKey = `${voice}|${text}`;
  if (ttsCache[cacheKey]) return ttsCache[cacheKey];
  try {
    const res = await fetch(`${BACKEND}/api/tts/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice }),
    });
    const data = await res.json();
    if (data && data.url) {
      const full = `${BACKEND}${data.url}`;
      ttsCache[cacheKey] = full;
      return full;
    }
  } catch {}
  return null;
}

// Play a single audio segment. Resolves on natural finish (didJustFinish) OR when maxMs cap
// is reached (so 3s/5s custom clips never force extra silence). A tiny gap keeps it natural.
function playSegment(uri: string, maxMs: number, volume: number, gapMs = 140): Promise<void> {
  return new Promise((resolve) => {
    let player: any;
    let done = false;
    let sub: any;
    const finish = () => {
      if (done) return;
      done = true;
      try { sub && sub.remove(); } catch {}
      try { player && player.remove(); } catch {}
      setTimeout(resolve, gapMs);
    };
    try {
      player = createAudioPlayer({ uri });
      try { player.volume = volume; } catch {}
    } catch {
      resolve();
      return;
    }
    sub = player.addListener("playbackStatusUpdate", (st: any) => {
      if (st && st.didJustFinish) finish();
    });
    try { player.play(); } catch {}
    setTimeout(finish, maxMs);
  });
}

export type AnnounceOpts = {
  amount: number;
  voiceChar?: string;
  intro?: { uri: string; max: number } | null; // custom intro clip, else default TTS "Sukses"
  outro?: { uri: string; max: number } | null; // custom outro clip, else default TTS "Terima kasih"
  volume?: number;
  repeat?: boolean;
};

// Modular announcement: INTRO -> NOMINAL -> OUTRO with minimal gap.
// TTS segments are fetched in parallel up-front (and cached) for low latency; playback is
// strictly sequential so segments never overlap or get cut off. Failed segments are skipped.
export async function announcePayment(opts: AnnounceOpts) {
  const voiceChar = opts.voiceChar || "putri";
  const volume = opts.volume ?? 1;
  const useIntroTts = !opts.intro;
  const useOutroTts = !opts.outro;
  const nominalText = `${terbilang(opts.amount)} rupiah`;

  await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false });

  const [introUrl, nominalUrl, outroUrl] = await Promise.all([
    useIntroTts ? generateTts("Sukses", voiceChar) : Promise.resolve(null),
    generateTts(nominalText, voiceChar),
    useOutroTts ? generateTts("Terima kasih", voiceChar) : Promise.resolve(null),
  ]);

  // INTRO
  if (opts.intro && opts.intro.uri) await playSegment(opts.intro.uri, opts.intro.max || 5000, volume);
  else if (introUrl) await playSegment(introUrl, 8000, volume);

  // NOMINAL (dynamic, optionally repeated)
  const times = opts.repeat ? 2 : 1;
  for (let i = 0; i < times; i++) { if (nominalUrl) await playSegment(nominalUrl, 15000, volume); }

  // OUTRO
  if (opts.outro && opts.outro.uri) await playSegment(opts.outro.uri, opts.outro.max || 5000, volume);
  else if (outroUrl) await playSegment(outroUrl, 8000, volume);
}

export async function previewAnnouncement(opts: Omit<AnnounceOpts, "amount">) {
  await announcePayment({ ...opts, amount: 50000 });
}

export async function pickIntroAudio(): Promise<{ uri: string; name: string; duration: number } | null> {
  const result = await DocumentPicker.getDocumentAsync({ type: "audio/*", copyToCacheDirectory: true, multiple: false });
  if (result.canceled || !result.assets || !result.assets[0]) return null;
  const asset = result.assets[0];
  const duration = await getDuration(asset.uri);
  return { uri: asset.uri, name: asset.name || "audio.mp3", duration };
}

function getDuration(uri: string): Promise<number> {
  return new Promise((resolve) => {
    let player: any;
    let done = false;
    let sub: any;
    const finish = (d: number) => {
      if (done) return;
      done = true;
      try { sub && sub.remove(); } catch {}
      try { player && player.remove(); } catch {}
      resolve(d);
    };
    try {
      player = createAudioPlayer({ uri });
    } catch {
      resolve(0);
      return;
    }
    sub = player.addListener("playbackStatusUpdate", (st: any) => {
      if (st && st.isLoaded && st.duration && st.duration > 0) finish(st.duration);
    });
    setTimeout(() => finish(0), 4000);
  });
}
