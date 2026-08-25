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
| 5 | Access Token Lifetime | Diperbaiki ke 20 menit (dari sempat 7 hari) sesuai `SECURITY.md`, ditambah silent refresh client-side dengan mutex dedup |
| 6 | Branch Konsolidasi | Branch `bara` dikonfirmasi = branch kerja resmi (setara/sudah merge dengan `feature/v2-superapp-base` sebelumnya) |
| 7 | Pembersihan Halaman Legacy | Seluruh halaman frontend peninggalan iterasi lama (`/wakaf`, `/zakat`, `/qurban`, `/nazhir`, `/infaq`, `/catalog`, `/ai-chat`, `/dashboard/*` lama) dihapus via `git rm -r` sebelum Micro-Sprint 2 dimulai, untuk menghindari tabrakan nama route dengan modul baru |

## Putaran 6 — Gap Analysis IA Diagram & UI Design, Update Scope Final

Berdasarkan diagram Arsitektur Informasi (IA) lengkap PoV User & Admin, serta
mockup UI Hi-Fi dari tim UI/UX, dilakukan gap analysis menyeluruh terhadap
`/docs` dan `SPRINT_BACKLOG.md`. Berikut keputusan final:

### A. Keputusan Scope

| # | Topik | Keputusan |
|---|---|---|
| 1 | Dashboard Analitik RFMD/Segmentasi/Prediksi Churn | **EXCLUDE** dari scope 14 hari staging. Murni riset lanjutan pasca-MVP (terkait Thesis S2 Najwan) — TIDAK dibangun sebagian pun, meski muncul lengkap di mockup UI Admin |
| 2 | Modul Infaq/Sedekah | **POSTPONE** — fokus penuh 3 modul utama: Wakaf, Zakat, Qurban. Meski sudah ada mockup UI lengkap, tidak ada task Infaq di `SPRINT_BACKLOG.md` |
| 3 | Harga Emas untuk Kalkulator Zakat | **Live API Fetching** via `GET /api/zakat/gold-price/live`, dengan **caching 6 jam** (mengurangi rate-limit/biaya provider) dan fallback ke tabel `zakat_gold_price_history` (cache terakhir) jika fetch gagal, plus opsi override manual Admin sebagai fallback kedua |
| 4 | OAuth Login | **Google OAuth masuk Sprint 2** (assigned Bara) — diimplementasikan **manual** (bukan NextAuth/Supabase Auth penuh), menukar Google ID token dengan JWT+Refresh Token sistem kita sendiri, demi menjaga satu sumber kebenaran sesi. **Facebook OAuth ditunda** ke Post-Staging |

### B. Keputusan UI Petugas Lapangan (Baru Dikonfirmasi ke Tim UI/UX)

| # | Screen | Cakupan |
|---|---|---|
| 1 | Dashboard Rekap Cash di Tangan | Total tunai diterima dikurangi total sudah disetor & terverifikasi |
| 2 | Form Entri Transaksi Offline | Nama, HP, Nominal, Jenis Akad, Upload Bukti Cash |
| 3 | Form Setoran ke Admin | Multi-select order, Upload Bukti Transfer/Handover |
| 4 | Form Verifikasi Penyaluran | Upload Foto/Video, Koordinat GPS, Jumlah Penerima |

### C. Penambahan Field Skema (Gap Analysis, Diterima 100%)

| # | Gap | Field Ditambahkan |
|---|---|---|
| A | Donasi Anonim ("Hamba Allah") | `waqf_orders.is_anonymous`, `zakat_orders.is_anonymous` |
| B | Akad Wakalah Digital Qurban | `qurban_orders.akad_wakalah_text`, `akad_wakalah_accepted_at` — WAJIB `true` sebelum pembayaran diproses |
| C | Detail `HewanBatch` | `ras`, `kelas_grade`, `estimasi_berat_kg`, `jenis_kelamin`, `wilayah_penyaluran`, `target_penerima_manfaat`, `tanggal_penyembelihan_estimasi`, `galeri_foto_urls` |
| D | Config Zakat Fitrah | Tabel baru `zakat_fitrah_config` (varian beras, konversi harga per jiwa, referensi SK) — kalkulator FITRAH wajib ambil dari sini, bukan hardcode |
| H | Alasan Penolakan Admin | `fund_withdrawal_requests.admin_notes`, `permohonan_penyaluran_institusional.admin_notes` — wajib diisi saat status REJECTED/DITOLAK |
| I | Verifikasi Penyaluran Qurban (turunan dari keputusan B UI Petugas Lapangan) | `qurban_distribution_reports`: tambah `lokasi_lat`, `lokasi_lng`, `jumlah_penerima`, `video_url` |
| — | OAuth Google | `users.password_hash` jadi nullable, tambah `oauth_provider`, `oauth_id` (unique gabungan) |
| — | Feedback Chatbot | `chatbot_messages.user_feedback` (enum UP/DOWN, nullable) — schema disiapkan meski fitur chatbot sendiri masih ditunda (tidak menambah task Sprint) |

### D. Item yang Perlu Ditindaklanjuti (Belum Final, Dicatat sebagai Open Item)

- Provider gold price API spesifik belum ditentukan final (Awan riset saat eksekusi Task 2.9, prioritas provider yang quote langsung IDR/gram)
- Kebijakan account linking (user yang sudah punya akun password lalu coba login Google dengan email sama) ditunda ke Post-Staging — V.1 cukup tolak dengan pesan jelas
- Field `buktiCashUrl` di form entri offline Qurban (Task 5.8) masih opsional, perlu keputusan tim apakah dijadikan wajib untuk akuntabilitas lebih ketat

## Putaran 7 — Keputusan Teknis & Arsitektur Sprint 3 & 4

| # | Topik | Keputusan & Catatan Teknis |
|---|---|---|
| 1 | Model `WaqfYieldEntry` & Fiqih Wakaf Produktif vs Habis Pakai | Fiqih wakaf uang: Pada wakaf produktif (`PRODUKTIF_KEKAL`), pokok dana (`pokokDanaTerkumpul`) bersifat abadi dan tidak boleh berkurang. Ditambahkan entitas `WaqfYieldEntry` (POST `/api/admin/wakaf/programs/[id]/yield-entries`) untuk mencatat inflow hasil investasi ke `totalHasilAvailable`. Percabangan eksplisit diterapkan pada withdrawal: `HABIS_PAKAI` mendecement `pokokDanaTerkumpul`, sedangkan `PRODUKTIF_KEKAL` mendecement `totalHasilAvailable` dan mengincrement `hasilInvestasiTersalurkan` (pokok tetap utuh 100%). |
| 2 | Slot Release vs DP Qurban Terbayar (Known Limitation) | Pada webhook PG event `expire`/`cancel`/`deny`, rilis otomatis slot qurban ke `TERSEDIA` saat ini belum mengecek `nominalDibayar > 0`. Ditandai sebagai known limitation: untuk order berstatus DP yang expired di pelunasan, penanganan follow-up/refund dilakukan manual oleh Admin di V.1 sebelum penambahan status/grace period otomatis di V.2. |
| 3 | Konsolidasi Webhook Payment Gateway | Endpoint tunggal `POST /api/webhooks/payment` difungsikan sebagai entry point utama untuk kompatibilitas 1-URL webhook dashboard Midtrans/Xendit, me-route secara internal ke modul Wakaf, Zakat, atau Qurban. |

## Putaran 8 — Frontend Zakat UI & Flow Entri Amil (Sprint 5)

| # | Topik | Keputusan & Catatan Teknis |
|---|---|---|
| 1 | Integrasi Live Gold Price di Kalkulator | Interface `/zakat/kalkulator` memanfaatkan `GET /api/zakat/gold-price/live` secara dinamis. Jika `isStale: true`, badge peringatan visual ditampilkan secara transparan kepada pengguna. |
| 2 | Modal Konfirmasi Entri Offline Amil | Modal konfirmasi ringkasan data transaksi pada `/amil/zakat-entri` bersifat unbypassable untuk mencegah kesalahan entri kasir/amil offline sebelum dikirim ke `POST /api/admin/zakat/orders`. |
| 3 | Privasi Donatur ("Hamba Allah") | Checkbox `isAnonymous: true` pada form bayar digital & entri amil menandai pesanan untuk disembunyikan di tampilan publik tanpa mengurangi data audit internal. |

## Putaran 9 — System Notifikasi Real-time & Event Triggers (Sprint 6)

| # | Topik | Keputusan & Catatan Teknis |
|---|---|---|
| 1 | Centralized Notification Service | Dibuat helper `createNotification()` di `lib/notification.service.ts` yang menyimpan record `Notification` di DB dan mengeksekusi trigger FCM push notification secara graceful (fallback tanpa error jika credential FCM belum dikonfigurasi). |
| 2 | Endpoints & UI Notifikasi | `GET /api/notifications` dan `PATCH /api/notifications/[id]/read` disediakan untuk mengelola notifikasi pengguna. Komponen UI `NotificationCenter` menampilkan jumlah belum dibaca dan daftar notifikasi real-time. |
| 3 | Integrasi Event Triggers | Event penting seperti penolakan penarikan dana Nadzir (`/api/admin/withdrawal-requests/[id]`) dan verifikasi setoran petugas (`/api/admin/setoran/[id]/verify`) telah terhubung otomatis untuk mengirim notifikasi ke user target. |

## Putaran 10 — Hardening & Staging Readiness Final (Sprint 7)

| # | Topik | Keputusan & Catatan Teknis |
|---|---|---|
| 1 | Audit Keamanan & Fiqih | Seluruh audit keamanan (AES-256 NIK, Cookie `HttpOnly`/`SameSite=Lax`, JWT rotation) dan fiqih (ledger abadi Wakaf Produktif, Akad Wakalah Qurban, Nisab Emas 85g) dinyatakan **Lolos 100%**. |
| 2 | Verifikasi Scope Putaran 6 | Dipastikan 100% tidak ada route / UI component aktif yang mengekspos fitur yang ditunda (Dashboard RFMD Analytics, Infaq/Sedekah, Facebook OAuth). |
| 3 | Dokumentasi & Deployment Runbook | `RUNBOOK.md` diperbarui lengkap dengan checklist environment variables, langkah deployment Vercel/Supabase, serta skenario Smoke Testing untuk 4 role (`WAKIF`, `NADZIR`, `PETUGAS_LAPANGAN`, `ADMIN`). |


