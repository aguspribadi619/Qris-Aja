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

function playSource(uri: string, maxMs = 15000, volume = 1): Promise<void> {
  return new Promise((resolve) => {
    let player: any;
    let done = false;
    let sub: any;
    const finish = () => {
      if (done) return;
      done = true;
      try { sub && sub.remove(); } catch {}
      try { player && player.remove(); } catch {}
      resolve();
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

export async function previewIntro(uri: string, volume = 1) {
  await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false });
  await playSource(uri, 6000, volume);
}

export async function playPaymentSound(opts: { amount: number; voice: string; introUri?: string | null; volume?: number; repeat?: boolean }) {
  const vol = opts.volume ?? 1;
  await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false });
  if (opts.introUri) await playSource(opts.introUri, 6000, vol);
  const text = `Pembayaran ${terbilang(opts.amount)} rupiah diterima`;
  try {
    const res = await fetch(`${BACKEND}/api/tts/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice: opts.voice }),
    });
    const data = await res.json();
    if (data && data.url) {
      const times = opts.repeat ? 2 : 1;
      for (let i = 0; i < times; i++) await playSource(`${BACKEND}${data.url}`, 15000, vol);
    }
  } catch {}
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

export async function pickIntroAudio(): Promise<{ uri: string; name: string; duration: number } | null> {
  const result = await DocumentPicker.getDocumentAsync({ type: "audio/*", copyToCacheDirectory: true, multiple: false });
  if (result.canceled || !result.assets || !result.assets[0]) return null;
  const asset = result.assets[0];
  const duration = await getDuration(asset.uri);
  return { uri: asset.uri, name: asset.name || "intro.mp3", duration };
}
