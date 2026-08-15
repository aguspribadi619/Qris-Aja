# PRD — QRIS Aja (Prototype)

## Problem Statement
Aplikasi mobile "QRIS Aja" — prototipe manajemen merchant & pembayaran QRIS untuk UMKM Indonesia. Semua data dummy/hardcoded, tanpa backend/database. Fokus pada spacing rapi, radius/warna konsisten, transisi mulus, dan usability merchant.

## Architecture
- Frontend: Expo (React Native) + Expo Router, single-file app di `/app/frontend/app/index.tsx`.
- State lokal (useState/useMemo). Tanpa backend/DB (sesuai permintaan prototype).
- Design tokens: `/app/design_guidelines.json`.

## User Persona
- Pemilik/manajer merchant UMKM (mis. Agus, KSM Management) mengelola beberapa outlet warkop.

## Core Requirements (static)
- Data dummy sepenuhnya.
- Bahasa Indonesia di seluruh UI.
- UI polish: spacing, warna, ikon "hidup".

## Implemented (with dates)
- 2026-06: MVP — Dashboard, Riwayat, Analisa, Profil (4 tab + FAB QRIS).
- 2026-06: Employee CRUD (tambah/edit/hapus, role Kasir/Supervisor).
- 2026-06: Modal QRIS statis/dinamis, notifikasi, pemilih outlet, toggle saldo.
- 2026-06: Perbaikan viewport bottom-sheet untuk layar kecil.
- 2026-06: Hapus label "3M: Membantu Mudah".
- 2026-08: Ikon berwarna + desain "hidup" (badge terisi, bayangan lembut, aksen spark). Fix style `badgeInner`/`badgeSpark` yang sebelumnya belum didefinisikan.
- 2026-08: Pakai logo resmi "QRIS Aja" (webp) di hero via expo-image; ikon akses cepat diubah ke gaya kartu putih + ikon berwarna vibrant + aksen titik (mengikuti referensi kompetitor).
- 2026-08: Ikon akses cepat diganti jadi ilustrasi SVG multi-warna custom (react-native-svg) di `src/components/QuickIcons.tsx` — gaya ilustrasi berwarna seperti app pembanding (netzme).
- 2026-08: Hero/header diubah ke gradien mint terang; logo tampil tanpa background putih agar navy+kuning jelas; pill outlet & teks welcome disesuaikan jadi navy.
- 2026-08: Ikon ilustrasi berwarna diperluas ke Profil (kelola pegawai, outlet, notifikasi, pengaturan), Analisa (transaksi, dompet, trofi), dan modal QRIS (QR code, uang tunai) via `QuickIcons.tsx` agar seragam & hidup.
- 2026-08: Pusat notifikasi memakai ilustrasi berwarna (sukses/centang hijau, tips/bohlam, suara/speaker).
- 2026-08: Logo hero diperbesar (174x44). Badge jumlah notifikasi belum dibaca (merah, angka) di ikon lonceng Beranda & menu Notifikasi Profil; badge hilang (jadi 0) setelah pusat notifikasi dibuka.
- 2026-08: 4 fitur baru — (1) Ringkasan harian (omzet & jumlah transaksi hari ini) di atas dashboard; (2) Ekspor CSV riwayat (tombol + toast konfirmasi); (3) Kartu QRIS statis siap cetak (QrisPrintModal, tombol Cetak/Bagikan) dibuka dari opsi QRIS Statis; (4) Tandai notifikasi dibaca per-item + "Tandai semua", badge unread kini derivatif dari state notifications. Tambah komponen Toast global.
- 2026-08: Header (hero) diperpendek (minHeight 156) & logo dibuat mepet kiri (paddingHorizontal 16, marginLeft -2).
- 2026-08: Filter tanggal (Periode: Hari ini/Minggu ini/Bulan ini) + label Status di Riwayat. Alur QRIS Dinamis (QrisDynamicModal): input nominal + chip cepat → tampil QR dengan nominal, tombol Tandai lunas & Ubah nominal.
- 2026-08: Grafik perbandingan omzet antar outlet (bar horizontal) di halaman Analisa.
- 2026-08: Fitur suara notifikasi pembayaran. Backend: `/api/tts/generate` + `/api/tts/{key}.mp3` pakai Emergent OpenAI TTS (emergentintegrations, tts-1, voice nova/onyx = wanita/pria), cache Mongo `tts_audio`, EMERGENT_LLM_KEY di backend/.env. Frontend: `src/audio/paymentSound.ts` (terbilang + playback sekuensial intro→TTS via expo-audio, upload intro via expo-document-picker, validasi maks 5 dtk). Halaman "Suara pembayaran" di Profil + tombol "Test pembayaran masuk" di Beranda & Pengaturan. Audio/upload paling andal di perangkat (Expo Go).
- 2026-08: Transaksi jadi state live (`txs`). Test/auto pembayaran menambah transaksi ke Riwayat & memutar suara otomatis. Pengaturan volume (Pelan/Sedang/Keras) + toggle "Ulangi nominal 2×" + toggle "Auto-simulasi pembayaran" (interval 15dtk). Rekam intro langsung di app via expo-audio recorder (izin mikrofon, auto-stop 5dtk) selain upload. Dua menu link eksternal di Beranda (Pencatatan Pengeluaran, Absensi Karyawan) via expo-web-browser. app.json: NSMicrophoneUsageDescription + RECORD_AUDIO.

## Backlog
- P1: Riwayat — export CSV simulasi, filter tanggal, search.
- P2: Pecah file monolitik `index.tsx` menjadi komponen atomik bila app diperbesar.
- P2: State kosong/error/retry lebih lengkap di tiap tab.

## Next Tasks
- Menunggu feedback user atas polish ikon terbaru.
