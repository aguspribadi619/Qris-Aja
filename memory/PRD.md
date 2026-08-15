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

## Backlog
- P1: Riwayat — export CSV simulasi, filter tanggal, search.
- P2: Pecah file monolitik `index.tsx` menjadi komponen atomik bila app diperbesar.
- P2: State kosong/error/retry lebih lengkap di tiap tab.

## Next Tasks
- Menunggu feedback user atas polish ikon terbaru.
