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

// Short characteristic greeting per persona (used by the per-character "Test" button).
export const VOICE_GREETINGS: Record<string, string> = {
  lilis: "Sampurasun, abdi Teh Lilis. Kumaha damang? Wilujeng sumping!",
  parjo: "Sugeng rawuh, kula Mas Parjo. Piye kabare? Monggo mampir!",
  bagas: "Halo, aku Bagas! Siap bantu transaksinya, Kak. Semangat!",
  putri: "Halo, saya Putri. Selamat datang di QRIS Aja!",
};

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

// Create a player and wait until the audio is actually loaded (buffered) so playback
// starts instantly. Resolves the player (or null on failure).
function loadPlayer(uri: string, timeoutMs = 8000): Promise<any | null> {
  return new Promise((resolve) => {
    let player: any;
    let done = false;
    let sub: any;
    const finish = (p: any) => { if (done) return; done = true; try { sub && sub.remove(); } catch {} resolve(p); };
    try { player = createAudioPlayer({ uri }); } catch { resolve(null); return; }
    sub = player.addListener("playbackStatusUpdate", (st: any) => { if (st && st.isLoaded) finish(player); });
    setTimeout(() => finish(player), timeoutMs); // fallback: play() still works even if event missed
  });
}

// Play an already-loaded player to natural finish (didJustFinish) or a maxMs cap.
function playPlayer(player: any, volume: number, maxMs: number, gapMs = 60): Promise<void> {
  return new Promise((resolve) => {
    if (!player) { resolve(); return; }
    let done = false;
    let sub: any;
    const finish = () => {
      if (done) return;
      done = true;
      try { sub && sub.remove(); } catch {}
      try { player.remove(); } catch {}
      setTimeout(resolve, gapMs);
    };
    try { player.volume = volume; } catch {}
    sub = player.addListener("playbackStatusUpdate", (st: any) => { if (st && st.didJustFinish) finish(); });
    try { player.seekTo(0); } catch {}
    try { player.play(); } catch {}
    setTimeout(finish, maxMs);
  });
}

// One-shot helper (load then play) used for single-clip playback like the voice preview.
async function playSegment(uri: string, maxMs: number, volume: number, gapMs = 60): Promise<void> {
  const p = await loadPlayer(uri);
  await playPlayer(p, volume, maxMs, gapMs);
}

export type AnnounceOpts = {
  amount: number;
  voiceChar?: string;
  intro?: { uri: string; max: number } | null; // custom intro clip, else default TTS "Sukses"
  outro?: { uri: string; max: number } | null; // custom outro clip, else default TTS "Terima kasih"
  volume?: number;
  repeat?: boolean;
};

// Announcement: [custom intro clip] -> [combined TTS] -> [custom outro clip].
// To avoid the ~1-2s gaps that came from stitching 3 separate remote clips, all the
// TTS parts (default "Sukses", the nominal, default "Terima kasih") are merged into ONE
// utterance so the common case (no custom clips) plays completely gapless.
export async function announcePayment(opts: AnnounceOpts) {
  const voiceChar = opts.voiceChar || "putri";
  const volume = opts.volume ?? 1;
  const useIntroTts = !opts.intro;   // no custom intro -> fold "Sukses" into the combined text
  const useOutroTts = !opts.outro;   // no custom outro -> fold "Terima kasih" into the combined text
  const nominalText = `${terbilang(opts.amount)} rupiah`;
  const times = opts.repeat ? 2 : 1;

  await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false });

  const parts: string[] = [];
  if (useIntroTts) parts.push("Sukses");
  for (let i = 0; i < times; i++) parts.push(nominalText);
  if (useOutroTts) parts.push("Terima kasih");
  const combinedText = parts.join(". ") + ".";
  const combinedUrl = await generateTts(combinedText, voiceChar);

  const segs: { uri: string; max: number; vol: number }[] = [];
  // Custom clips play a touch softer so the (louder-normalized) nominal is never buried.
  if (opts.intro && opts.intro.uri) segs.push({ uri: opts.intro.uri, max: opts.intro.max || 3500, vol: volume * 0.8 });
  if (combinedUrl) segs.push({ uri: combinedUrl, max: 25000, vol: volume });
  if (opts.outro && opts.outro.uri) segs.push({ uri: opts.outro.uri, max: opts.outro.max || 3500, vol: volume * 0.8 });

  // Load each segment right before playing it (not all up-front): a preloaded remote
  // player can get released while it sits idle during the intro clip, which made the
  // nominal go silent. Loading just-in-time keeps every segment reliably audible.
  for (const s of segs) { await playSegment(s.uri, s.max, s.vol); }
}

export async function previewAnnouncement(opts: Omit<AnnounceOpts, "amount">) {
  await announcePayment({ ...opts, amount: 50000 });
}

// Play just the character's signature greeting so the user can audition each voice.
export async function previewVoice(voiceChar: string, volume = 1) {
  await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false });
  const text = VOICE_GREETINGS[voiceChar] || "Halo, selamat datang di QRIS Aja!";
  const url = await generateTts(text, voiceChar);
  if (url) await playSegment(url, 20000, volume);
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
