# Decision Log — Amwal V.1

Living document — histori seluruh keputusan scope, teknis, dan bisnis
proyek Amwal. Tambahkan entri baru di bagian bawah, JANGAN edit/hapus
entri lama (append-only, untuk audit trail).

## Putaran 1 — 14 Keputusan Scope & Arsitektur Dasar

| # | Topik | Keputusan |
|---|---|---|
| 1 | Scope Produk | Wakaf, Zakat, Infaq, Qurban, Gamifikasi, AI Chatbot — prioritas Wakaf → Zakat → lainnya |
| 2 | Pembagian Warisan | Dikeluarkan dari scope V.1, roadmap jangka panjang |
| 3 | Fiqih Wakaf Uang | Wajib pisah pokok vs hasil (`WaqfPrincipalLedger`) |
| 4 | Model Kustodian | Non-custodial mutlak |
| 5 | E-Sertifikat BWI | Nomor internal otomatis, nomor BWI sinkron manual |
| 6 | Migrasi itsedekah.id | Greenfield murni untuk V.1, benchmarking terpisah |
| 7 | Tech Stack | Next.js 16 Web/PWA, Flutter dibatalkan |
| 8 | Privasi NIK/KTP | Enkripsi + kebijakan retensi (detail Putaran 2) |
| 9 | Domain RAG Chatbot | Wakaf produktif saja untuk V.1 |
| 10 | Labeling Verifikasi Nadzir | UI wajib bedakan "Terverifikasi Amwal" vs "Terdaftar BWI" |
| 11 | Gamifikasi | Dipertahankan (scope), ditinjau PKH ITS |
| 12 | Refresh Token | Ditambahkan (detail strategi Putaran 2) |
| 13 | Row-Locking Qurban | Wajib, mencegah oversell |
| 14 | Firewall Biaya Sertifikasi | Biaya administrasi terpisah dari keputusan legalitas |

## Putaran 2 — 8 Keputusan Blocking Issues

| # | Topik | Keputusan |
|---|---|---|
| 1 | Payment Gateway | Midtrans / Xendit (skema disbursement) |
| 2 | Retensi KTP Mentah | 30 hari pasca-verifikasi, lalu dihapus otomatis |
| 3 | Provider OCR | Google Cloud Vision API (PoC prioritas) |
| 4 | Scope Qurban | Kompleksitas operasional penuh (tunai, cicilan, permohonan institusional) |
| 5 | Role Petugas Lapangan | Dimasukkan resmi sebagai role ke-4 |
| 6 | File Storage | Supabase Storage, 100% |
| 7 | UI Sinkronisasi BWI | Field manual di Dashboard Admin, detail Sertifikat |
| 8 | Strategi Refresh Token | Rotating refresh token |

## Putaran 3 — Redesain Zakat & Wakaf Hybrid

| # | Topik | Keputusan |
|---|---|---|
| 1 | Model Transaksi | Tambah `zakat_orders`/`waqf_orders` (mirip `qurban_orders`), `transactions` jadi anchor Payment Gateway murni |
| 2 | Zakat Hybrid | Dukung metode TUNAI/TRANSFER/BERAS, tambah `mustahiq_profiles`+`zakat_distributions` |
| 3 | Wakaf Hybrid | Dukung `bentuk_wakaf` UANG/BARANG, tambah `mauquf_alaih_distributions`, field AIW (`nomor_ikrar_wakaf`, `dokumen_aiw_url`) |

## Putaran 4 — Klarifikasi Role & Relasi Transaksi

| # | Topik | Keputusan |
|---|---|---|
| 1 | Role "Amil" | TIDAK jadi role ke-5. Fungsi entri offline diampu `ADMIN`/`PETUGAS_LAPANGAN`. `entered_by_amil_id` tetap FK ke `users.id` |
| 2 | 1 Order = 1 Transaction | Sudah sesuai scope — Wakaf & Zakat bersifat sekali pelunasan (non-cicilan), berbeda dari Qurban yang mendukung DP/cicilan |

## Putaran 5 — Struktur Dokumentasi & Sprint

| # | Topik | Keputusan |
|---|---|---|
| 1 | Struktur `/docs` | 12 file: PRD, ARCHITECTURE, AI_RULES, CODING_CONVENTIONS, DATABASE_SCHEMA, API_CONTRACTS, DESIGN_SYSTEM, RUNBOOK, SPRINT_BACKLOG, DOMAIN_GLOSSARY, DECISION_LOG, SECURITY |
| 2 | Scope 14 Hari Staging | Gamifikasi, Edukasi/Kuis, AI Chatbot DIKELUARKAN dari target staging (tetap di scope V.1 jangka menengah, hanya ditunda urutan pengerjaan) |
| 3 | Alokasi Tim | Fullstack-per-modul: Bara=Wakaf, Awan=Zakat, Naufal=Qurban+Auth |
| 4 | Bug Kritis Auth/RBAC | 5 bug ditemukan (cookie tidak ter-set, JWT tanpa role, `proxy.ts` route lama, dead code) — diperbaiki sebagai blocker Micro-Sprint 1 Hari 1 sebelum modul lain dikerjakan |
