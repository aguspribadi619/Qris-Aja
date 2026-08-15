# QRIS Aja — Product Requirements

## Problem statement
Prototipe aplikasi mobile merchant QRIS untuk UMKM yang membantu pemilik toko memantau saldo, membuat QRIS statis/dinamis, melihat transaksi, memahami analisa performa, dan mengelola pegawai dengan alur yang mudah serta konsisten.

## Architecture
- Expo SDK 54 / React Native frontend dengan Expo Router.
- State lokal React untuk prototipe; transaksi, saldo, analisa, notifikasi, outlet, dan pegawai adalah data dummy sesuai brief.
- Backend FastAPI/MongoDB starter tetap tersedia, tetapi tidak dipakai karena scope meminta prototipe tanpa backend nyata.

## User personas
- Pemilik UMKM/merchant yang membutuhkan akses QRIS cepat saat operasional.
- Supervisor toko yang memantau omzet dan mengatur pegawai lintas outlet.

## Core requirements (static)
- Beranda fokus pada saldo, QRIS, transaksi terakhir, outlet, dan quick actions.
- FAB QRIS membuka pilihan QRIS Statis dan QRIS Dinamis.
- Riwayat dengan filter status.
- Analisa dengan insight, statistik, chart jam ramai, dan outlet teratas.
- Profil dan Kelola Pegawai dengan tambah, edit, hapus, outlet, role, dan validasi nama.
- Notifikasi in-app berbahasa Indonesia dan panduan suara pembayaran.
- Tidak ada Kasir sebagai modul transaksi dan tidak ada PPOB.

## Implemented (2026-08-15)
- Dashboard QRIS Aja dengan tema navy/teal/gold, saldo hide/show, selector outlet, quick actions, promo carousel, dan transaksi terakhir.
- Navigasi Beranda, Riwayat, Analisa, Profil, serta FAB QRIS.
- Modal QRIS statis/dinamis dan panel notifikasi Bahasa Indonesia.
- Filter Riwayat Semua/Berhasil/Menunggu.
- Analisa dengan insight, stat cards, bar chart, dan outlet paling ramai.
- Profil merchant dan Kelola Pegawai CRUD lokal dengan validasi dan role.
- Bottom-sheet QRIS dan pegawai sudah dibatasi tinggi serta dapat di-scroll pada layar kecil.
- Lint dan verifikasi preview berhasil.

## Prioritized backlog
- P0: Integrasi provider QRIS nyata dan status pembayaran real-time.
- P1: Push notification native dengan pengaturan suara per outlet.
- P1: Persistensi akun, outlet, dan pegawai melalui backend.
- P2: Export laporan transaksi nyata dan filter tanggal.
- P2: Onboarding merchant dan pengujian usability dengan merchant UMKM.

## Next tasks
1. Validasi desain dengan beberapa pemilik UMKM.
2. Tentukan provider QRIS dan kontrak status transaksi.
3. Ganti state dummy dengan endpoint aman setelah model data disepakati.