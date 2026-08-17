import React, { useState } from "react";
import { ActivityIndicator, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { useAudioRecorder, RecordingPresets, AudioModule, setAudioModeAsync } from "expo-audio";
import * as FileSystem from "expo-file-system/legacy";
import { C, CHAR_IMG, styles } from "@/src/theme";
import { VOICE_CHARS, pickIntroAudio } from "@/src/audio/paymentSound";
import { Icon } from "@/src/components/Icon";
import { Header } from "@/src/components/Header";
import { Toggle } from "@/src/components/Toggle";

export function SoundSettings({ onBack, voice, onVoice, onTestVoice, intro, onIntro, outro, onOutro, onToast, onTest, onPreview, volume, onVolume, repeat, onRepeat, autoSim, onAutoSim }: any) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [recTarget, setRecTarget] = useState<string | null>(null);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const doTestVoice = async (id: string) => { if (playingVoice) return; setPlayingVoice(id); try { await onTestVoice(id); } catch {} setPlayingVoice(null); };
  const recTimer = React.useRef<any>(null);
  const holdingRef = React.useRef(false);
  const recTargetRef = React.useRef<string | null>(null);
  const setFor = (t: string) => (t === "intro" ? onIntro : onOutro);
  const label = (t: string) => (t === "intro" ? "Intro" : "Outro");
  const pick = async (t: string) => { try { const res = await pickIntroAudio(); if (!res) return; if (res.duration && res.duration > 3.5) { onToast(`Audio ${label(t).toLowerCase()} maksimal 3 detik`); return; } setFor(t)({ uri: res.uri, name: res.name }); onToast(`Audio ${label(t).toLowerCase()} tersimpan`); } catch { onToast("Gagal memilih audio"); } };
  const stopRec = async () => { holdingRef.current = false; const t = recTargetRef.current; if (recTimer.current) { clearTimeout(recTimer.current); recTimer.current = null; } if (!t) return; recTargetRef.current = null; try { await recorder.stop(); } catch {} try { await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true }); } catch {} setRecTarget(null); let uri = recorder.uri; if (uri) { try { const dest = `${FileSystem.cacheDirectory}qa_${t}_${Date.now()}.m4a`; await FileSystem.copyAsync({ from: uri, to: dest }); uri = dest; } catch {} setFor(t)({ uri, name: `Rekaman ${label(t).toLowerCase()}` }); onToast(`${label(t)} rekaman tersimpan`); } };
  const startRec = async (t: string) => { holdingRef.current = true; try { const perm = await AudioModule.requestRecordingPermissionsAsync(); if (!perm.granted) { onToast("Izin mikrofon diperlukan untuk merekam"); if (perm.canAskAgain === false) Linking.openSettings(); return; } await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true }); await recorder.prepareToRecordAsync(); if (!holdingRef.current) { try { await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true }); } catch {} return; } recorder.record(); recTargetRef.current = t; setRecTarget(t); recTimer.current = setTimeout(() => { stopRec(); }, 3000); } catch { onToast("Gagal merekam audio"); recTargetRef.current = null; setRecTarget(null); } };
  const vols = [{ k: "Pelan", v: 0.3 }, { k: "Sedang", v: 0.6 }, { k: "Keras", v: 1 }];
  const clip = (t: string) => (t === "intro" ? intro : outro);
  const defWord = (t: string) => (t === "intro" ? "Sukses" : "Terima Kasih");
  const audioSection = (t: string) => <View style={styles.introCard}><View style={styles.introRow}><View style={styles.testPayIcon}><Icon name="musical-notes" color="#fff" size={18} /></View><View style={styles.transactionMain}><Text style={styles.menuLabel} numberOfLines={1}>{clip(t) ? clip(t).name : `Default — "${defWord(t)}"`}</Text><Text style={styles.muted}>{clip(t) ? `${label(t)} custom aktif` : `Upload atau rekam ${label(t).toLowerCase()} sendiri`}</Text></View></View><View style={styles.introBtns}><Pressable testID={`pick-${t}`} onPress={() => pick(t)} style={({ pressed }) => [styles.introBtn, pressed && styles.pressed]}><Icon name="cloud-upload-outline" color={C.navy} size={16} /><Text style={styles.introBtnText}>{clip(t) ? "Ganti" : "Pilih file"}</Text></Pressable><Pressable testID={`record-${t}`} onPressIn={() => startRec(t)} onPressOut={() => stopRec()} style={({ pressed }) => [styles.introBtn, recTarget === t && styles.recActive, pressed && styles.pressed]}><Icon name={recTarget === t ? "radio-button-on" : "mic-outline"} color={recTarget === t ? "#fff" : C.red} size={16} /><Text style={[styles.introBtnText, recTarget === t && { color: "#fff" }]}>{recTarget === t ? "Merekam…" : "Tahan untuk rekam"}</Text></Pressable>{clip(t) ? <Pressable testID={`remove-${t}`} onPress={() => { setFor(t)(null); onToast(`${label(t)} dihapus`); }} style={({ pressed }) => [styles.introBtn, pressed && styles.pressed]}><Icon name="trash-outline" color={C.red} size={16} /><Text style={[styles.introBtnText, { color: C.red }]}>Hapus</Text></Pressable> : null}</View></View>;
  return <View style={styles.flex}><Header title="Suara pembayaran" onBack={onBack} /><ScrollView contentContainerStyle={styles.page}>
    <Text style={styles.pageIntro}>Saat pembayaran berhasil: intro diputar dulu, lalu nominal disebut otomatis, ditutup outro.</Text>
    <Text style={styles.filterLabel}>Suara penyebutan nominal</Text>
    {VOICE_CHARS.map((vc) => <Pressable testID={`voice-${vc.id}`} key={vc.id} onPress={() => onVoice(vc.id)} style={[styles.voiceCard, voice === vc.id && styles.voiceCardActive]}><Image source={CHAR_IMG[vc.id]} style={[styles.voiceAvatarImg, voice === vc.id && styles.voiceAvatarImgActive]} contentFit="cover" /><View style={styles.transactionMain}><Text style={styles.menuLabel}>{vc.name}{vc.id === "putri" ? "  · Default" : ""}</Text><Text style={styles.muted}>{vc.desc}</Text></View><Pressable testID={`test-voice-${vc.id}`} onPress={() => doTestVoice(vc.id)} style={({ pressed }) => [styles.voiceTestBtn, playingVoice === vc.id && styles.voiceTestBtnActive, pressed && styles.pressed]}>{playingVoice === vc.id ? <ActivityIndicator size="small" color="#fff" /> : <Icon name="play" color={C.navy} size={14} />}<Text style={[styles.voiceTestText, playingVoice === vc.id && { color: "#fff" }]}>{playingVoice === vc.id ? "Memutar" : "Tes"}</Text></Pressable>{voice === vc.id ? <Icon name="checkmark-circle" color={C.teal} size={22} /> : <View style={styles.voiceRadio} />}</Pressable>)}
    <Text style={styles.filterLabel}>Volume suara</Text>
    <View style={styles.segment}>{vols.map((o) => <Pressable testID={`vol-${o.k}`} key={o.k} onPress={() => onVolume(o.v)} style={[styles.segmentItem, Math.abs(volume - o.v) < 0.01 && styles.segmentActive]}><Text style={[styles.segmentText, Math.abs(volume - o.v) < 0.01 && styles.segmentTextActive]}>{o.k}</Text></Pressable>)}</View>
    <View style={styles.toggleRow}><View style={styles.transactionMain}><Text style={styles.menuLabel}>Ulangi nominal 2×</Text><Text style={styles.muted}>Nominal disebut dua kali berturut-turut</Text></View><Toggle testID="toggle-repeat" value={repeat} onValue={onRepeat} /></View>
    <View style={styles.toggleRow}><View style={styles.transactionMain}><Text style={styles.menuLabel}>Auto-simulasi pembayaran</Text><Text style={styles.muted}>Buat pembayaran masuk otomatis tiap 15 dtk</Text></View><Toggle testID="toggle-autosim" value={autoSim} onValue={onAutoSim} /></View>
    <Text style={styles.filterLabel}>Audio intro (maks 3 detik)</Text>
    {audioSection("intro")}
    <Text style={styles.filterLabel}>Audio outro (maks 3 detik)</Text>
    {audioSection("outro")}
    <Pressable testID="preview-sound" onPress={onPreview} style={({ pressed }) => [styles.dynBtn, pressed && styles.pressed]}><Icon name="play" color={C.navy} size={18} /><Text style={styles.dynBtnText}>Preview Suara</Text></Pressable>
    <Pressable testID="test-payment-settings" onPress={onTest} style={({ pressed }) => [styles.introBtnWide, pressed && styles.pressed]}><Icon name="notifications-outline" color={C.navy} size={17} /><Text style={styles.introBtnText}>Test pembayaran (masuk ke Riwayat)</Text></Pressable>
    <Text style={styles.soundNote}>Urutan: Intro → Nominal → Outro dengan jeda minimal agar terdengar natural. Volume relatif terhadap volume perangkat (Pelan 30% · Sedang 60% · Keras 100%) — aplikasi tidak bisa melebihi volume HP. Suara memakai ElevenLabs (multilingual) — natural & fasih Bahasa Indonesia, tiap karakter punya suara berbeda. Intro/outro custom (rekam/upload) maksimal 3 detik. Audio paling andal diputar di perangkat lewat Expo Go.</Text>
  </ScrollView></View>;
}
