<!-- /docs/PRD.md -->

# Product Requirements Document — Amwal V.1

**Nama Produk:** Amwal — Aplikasi Manajemen Wakaf, Zakat, Infaq & Qurban
**Program:** HETI Project - ADB Loan ITS
**Pilot Project / Living Lab:** Masjid Manarul Ilmi ITS (YMI / itsedekah.id)
**Status:** Baseline V.1, target Staging Deployment 14 hari (revisi Putaran 6)

## 1. Tujuan Produk

Mendigitalisasi tata kelola wakaf, zakat, infaq, dan qurban secara transparan,
akuntabel, dan sesuai prinsip syariat Islam, dengan Masjid Manarul Ilmi ITS
sebagai pilot project.

## 2. Aktor Sistem (4 Role — Final, Terkunci)

| Role | Deskripsi |
|---|---|
| `WAKIF` | Pengguna umum: wakif/muzaki/pengqurban — memberi wakaf, zakat, infaq, qurban |
| `NADZIR` | Pengelola program wakaf terverifikasi |
| `ADMIN` | Verifikasi Nadzir/dokumen, approval pencairan dana, moderasi platform |
| `PETUGAS_LAPANGAN` | Entri transaksi offline (tunai), verifikasi fisik lapangan (khusus Qurban) |

> Fungsi "Amil" (entri transaksi offline Zakat/Wakaf) diampu oleh role
> `ADMIN` atau `PETUGAS_LAPANGAN` — TIDAK ada role ke-5 terpisah.

## 3. Modul & Prioritas

### Scope Staging 14 Hari (AKTIF)
1. **Auth & RBAC** (fondasi wajib) — termasuk **OAuth Google** (baru, Putaran 6)
2. **Wakaf** — hybrid uang/barang, digital/offline
3. **Zakat** — hybrid tunai/transfer/beras, kalkulator + penyaluran mustahiq, harga emas via live API + fallback
4. **Qurban** — kompleksitas operasional penuh (digital, tunai, cicilan, petugas lapangan, permohonan institusional), termasuk akad wakalah digital
5. **Certificate** — nomor internal otomatis, nomor BWI manual
6. **Notification** — dasar (FCM untuk event kunci)

### DIKELUARKAN dari Scope Staging 14 Hari (Ditunda Post-Staging)
- Gamifikasi (poin/XP/quiz harian)
- Edukasi & Kuis Interaktif
- AI Chatbot / RAG Assistant (schema `chatbot_messages` + `userFeedback` disiapkan, fitur/API TIDAK dikerjakan)
- **Infaq/Sedekah** — dikonfirmasi ditunda Putaran 6, meski sudah ada mockup UI
- **Dashboard Analitik RFMD/Segmentasi Donatur/Prediksi Churn** — dikonfirmasi ditunda Putaran 6, murni riset lanjutan (terkait Thesis S2 Najwan), TIDAK dibangun sebagian pun di staging ini
- **Facebook OAuth** — hanya Google OAuth yang masuk scope 14 hari

### Di Luar Scope V.1 Sama Sekali
- Pembagian Warisan (Faraid) — roadmap jangka panjang
- Integrasi API real-time BWI/Kemenag — sinkronisasi manual
- Migrasi data historis `itsedekah.id` — benchmarking terpisah, bukan bagian Sprint produk

## 4. Prinsip Arsitektur Kunci (Mengikat, Non-Negotiable)

1. **Non-Custodial Mutlak** — Amwal tidak pernah menampung dana publik. Payment Gateway wajib split/disbursement langsung ke rekening Nadzir/mitra.
2. **Pemisahan Pokok vs Hasil (Fiqih Wakaf)** — `WaqfPrincipalLedger.pokok_dana_terkumpul` untuk wakaf `PRODUKTIF_KEKAL` tidak boleh berkurang oleh proses apapun kecuali koreksi manual ber-audit.
3. **Human-in-the-Loop** — tidak ada pencairan dana atau approval legalitas Nadzir yang otomatis tanpa persetujuan eksplisit Admin.
4. **Hybrid Digital-Offline** — setiap modul transaksi (Wakaf/Zakat/Qurban) punya tabel `*_orders` sendiri yang mendukung entri online (via `transaction_id`) maupun offline (tunai/beras, `transaction_id` NULL).
5. **Single Source of Truth Sesi (Baru)** — SATU sistem auth (JWT custom + rotating refresh token), termasuk untuk login via OAuth. TIDAK ADA library manajemen sesi pihak ketiga (NextAuth/Supabase Auth penuh) yang berjalan paralel.
6. **Akad Wakalah Eksplisit (Baru)** — transaksi Qurban wajib mencatat persetujuan akad wakalah digital sebelum pembayaran diproses.

## 5. Referensi Dokumen Terkait

Dokumen ini adalah ringkasan eksekutif. Untuk detail teknis, lihat:
- `ARCHITECTURE.md` — stack & pola implementasi
- `DATABASE_SCHEMA.md` — DBML lengkap & mapping ke Prisma
- `SECURITY.md` — checklist keamanan non-negotiable
- `DECISION_LOG.md` — histori seluruh keputusan scope/teknis
- `DOMAIN_GLOSSARY.md` — istilah fiqih yang dipakai di seluruh sistem