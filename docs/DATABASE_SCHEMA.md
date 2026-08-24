<!-- /docs/DATABASE_SCHEMA.md -->

# Skema Basis Data — Amwal V.1 (Revisi Putaran 6)

## Perubahan dari Versi Sebelumnya

- `users`: `password_hash` jadi nullable, tambah `oauth_provider`/`oauth_id` (Google OAuth)
- `waqf_orders`, `zakat_orders`: tambah `is_anonymous` ("Hamba Allah")
- `qurban_orders`: tambah `akad_wakalah_text`, `akad_wakalah_accepted_at`
- `hewan_batches`: tambah 8 field detail (ras, kelas, estimasi berat, dst.)
- `qurban_distribution_reports`: tambah GPS (`lokasi_lat`/`lokasi_lng`), `jumlah_penerima`, `video_url`
- **BARU**: `zakat_fitrah_config` (konfigurasi varian beras & konversi harga)
- **BARU**: `zakat_gold_price_history` (cache/fallback harga emas live API)
- `fund_withdrawal_requests`, `permohonan_penyaluran_institusional`: tambah `admin_notes`
- `chatbot_messages`: tambah `user_feedback` (UP/DOWN)
- Modul **Infaq TETAP TIDAK ADA** tabel `infaq_orders` — dikonfirmasi ditunda Putaran 6

## DBML Final (Sumber Kebenaran — Import ke dbdiagram.io untuk Visual)

```dbml
// ============================================================
// AMWAL V.1 — Database Markup Language (DBML)
// HETI Project - ADB Loan ITS | Pilot: Masjid Manarul Ilmi ITS
// Revisi Putaran 6
// ============================================================

Enum role_enum {
  WAKIF
  NADZIR
  ADMIN
  PETUGAS_LAPANGAN
}

Enum oauth_provider_enum {
  GOOGLE
  FACEBOOK
}

Enum nadzir_kategori_enum {
  PERSEORANGAN
  ORGANISASI
  BADAN_HUKUM
}

Enum verification_status_enum {
  PENDING
  VERIFIED
  REJECTED
}

Enum nadzir_document_type_enum {
  KTP
  SERTIFIKAT_BWI
}

Enum waqf_type_enum {
  HABIS_PAKAI
  PRODUKTIF_KEKAL
}

Enum waqf_status_enum {
  DRAFT
  LIVE
  SELESAI
}

Enum withdrawal_status_enum {
  PENDING
  APPROVED
  REJECTED
  DISBURSED
}

Enum transaction_type_enum {
  WAKAF
  ZAKAT
  INFAQ
  QURBAN
}

Enum transaction_payment_status_enum {
  PENDING
  DP
  LUNAS
  GAGAL
}

Enum hewan_type_enum {
  SAPI
  KAMBING
}

Enum hewan_batch_status_enum {
  TERSEDIA
  PENUH
  SELESAI
}

Enum slot_status_enum {
  TERSEDIA
  TERISI
  DIBATALKAN
}

Enum kepemilikan_enum {
  INDIVIDU
  KOLEKTIF
}

Enum opsi_pesan_enum {
  PASRAH
  AMBIL_SENDIRI
}

Enum metode_bayar_enum {
  TUNAI
  TRANSFER
  QRIS
  VA
}

Enum qurban_payment_status_enum {
  BELUM_BAYAR
  DP
  LUNAS
}

Enum permohonan_status_enum {
  DIAJUKAN
  DISETUJUI
  DITOLAK
  DISALURKAN
}

Enum education_type_enum {
  ARTIKEL
  VIDEO
}

Enum chatbot_role_enum {
  USER
  ASSISTANT
}

Enum chatbot_domain_enum {
  WAKAF_PRODUKTIF
}

Enum chatbot_feedback_enum {
  UP
  DOWN
}

Enum zakat_type_enum {
  FITRAH
  MAAL_PENGHASILAN
  FIDYAH
  KAFARAT
  EMAS
  PERUSAHAAN
  PERTANIAN
}

Enum zakat_payment_method_enum {
  TUNAI
  TRANSFER
  BERAS
}

Enum zakat_order_status_enum {
  MENUNGGU_VERIFIKASI
  TERVERIFIKASI
  DITOLAK
}

Enum asnaf_enum {
  FAKIR
  MISKIN
  AMIL
  MUALLAF
  RIQAB
  GHARIMIN
  FISABILILLAH
  IBNU_SABIL
}

Enum zakat_distribution_status_enum {
  TERSALURKAN
  DIBATALKAN
}

Enum gold_price_source_enum {
  LIVE_API
  MANUAL_FALLBACK
}

Enum bentuk_wakaf_enum {
  UANG
  BARANG
}

Enum waqf_order_status_enum {
  MENUNGGU_VERIFIKASI
  TERVERIFIKASI
  DITOLAK
}

// ------------------------------------------------------------
// AUTH & USER
// ------------------------------------------------------------

Table users {
  id uuid [pk, default: `gen_random_uuid()`]
  email varchar(255) [unique]
  phone varchar(20) [unique]
  password_hash varchar(255)
  name varchar(255) [not null]
  role role_enum [not null]
  oauth_provider oauth_provider_enum
  oauth_id varchar(255)
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null]

  indexes {
    (oauth_provider, oauth_id) [unique]
  }

  Note: '''
  password_hash NULLABLE — akun OAuth (Google) tidak punya password.
  Validasi aplikasi: JIKA password_hash NULL, endpoint login email/password
  WAJIB menolak dengan pesan jelas ("Akun ini terdaftar via Google, silakan
  login dengan Google") — JANGAN biarkan bcrypt.compare(password, null) 
  dieksekusi (akan throw error, bukan graceful reject).
  '''
}

Table refresh_tokens {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  token_hash varchar(255) [not null, unique]
  expires_at timestamp [not null]
  revoked_at timestamp
  created_at timestamp [not null, default: `now()`]
}

Ref: refresh_tokens.user_id > users.id

// ------------------------------------------------------------
// NADZIR & VERIFIKASI
// ------------------------------------------------------------

Table nadzir_profiles {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null, unique]
  kategori nadzir_kategori_enum [not null]
  nama_lembaga varchar(255)
  nomor_rekening_bank varchar(50)
  nama_bank varchar(100)
  status_verifikasi verification_status_enum [not null, default: 'PENDING']
  verified_by_id uuid
  verified_at timestamp
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null]
}

Ref: nadzir_profiles.user_id > users.id
Ref: nadzir_profiles.verified_by_id > users.id

Table nadzir_documents {
  id uuid [pk, default: `gen_random_uuid()`]
  nadzir_profile_id uuid [not null]
  tipe_dokumen nadzir_document_type_enum [not null]
  file_url varchar(500)
  file_deleted_at timestamp
  ocr_extracted_nik varchar(255)
  ocr_extracted_nama varchar(255)
  ocr_confidence_score decimal(5,2)
  reviewed_manually boolean [not null, default: false]
  created_at timestamp [not null, default: `now()`]
}

Ref: nadzir_documents.nadzir_profile_id > nadzir_profiles.id

// ------------------------------------------------------------
// WAKAF
// ------------------------------------------------------------

Table waqf_programs {
  id uuid [pk, default: `gen_random_uuid()`]
  nadzir_profile_id uuid [not null]
  judul varchar(255) [not null]
  kategori varchar(100)
  deskripsi text
  target_dana decimal(18,2) [not null]
  durasi_hari int
  banner_url varchar(500)
  jenis_wakaf waqf_type_enum [not null]
  status waqf_status_enum [not null, default: 'DRAFT']
  rab_document_url varchar(500)
  dokumen_legalitas_url varchar(500)
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null]
}

Ref: waqf_programs.nadzir_profile_id > nadzir_profiles.id

Table waqf_principal_ledgers {
  id uuid [pk, default: `gen_random_uuid()`]
  waqf_program_id uuid [not null, unique]
  pokok_dana_terkumpul decimal(18,2) [not null, default: 0]
  hasil_investasi_tersalurkan decimal(18,2) [not null, default: 0]
  updated_at timestamp [not null]
}

Ref: waqf_principal_ledgers.waqf_program_id - waqf_programs.id

Table program_progress_reports {
  id uuid [pk, default: `gen_random_uuid()`]
  waqf_program_id uuid [not null]
  persentase_fisik decimal(5,2)
  deskripsi text
  kuitansi_urls json
  created_by_id uuid [not null]
  created_at timestamp [not null, default: `now()`]
}

Ref: program_progress_reports.waqf_program_id > waqf_programs.id
Ref: program_progress_reports.created_by_id > users.id

Table fund_withdrawal_requests {
  id uuid [pk, default: `gen_random_uuid()`]
  waqf_program_id uuid [not null]
  amount decimal(18,2) [not null]
  requested_by_id uuid [not null]
  approved_by_id uuid
  status withdrawal_status_enum [not null, default: 'PENDING']
  admin_notes text
  created_at timestamp [not null, default: `now()`]

  Note: 'admin_notes: alasan approve/reject, wajib diisi Admin saat status=REJECTED (validasi di application layer)'
}

Ref: fund_withdrawal_requests.waqf_program_id > waqf_programs.id
Ref: fund_withdrawal_requests.requested_by_id > users.id
Ref: fund_withdrawal_requests.approved_by_id > users.id

Table waqf_orders {
  id uuid [pk, default: `gen_random_uuid()`]
  nomor_kwitansi varchar(100) [not null, unique]
  waqf_program_id uuid [not null]
  wakif_id uuid
  nama_wakif varchar(255) [not null]
  no_telepon varchar(20)
  alamat text
  atas_nama_wakif text
  is_anonymous boolean [not null, default: false]
  bentuk_wakaf bentuk_wakaf_enum [not null]
  nominal decimal(18,2)
  nama_barang varchar(255)
  jumlah_satuan int
  nilai_taksiran_rupiah decimal(18,2)
  metode_pembayaran metode_bayar_enum
  status waqf_order_status_enum [not null, default: 'MENUNGGU_VERIFIKASI']
  entered_by_amil_id uuid
  transaction_id uuid
  nomor_ikrar_wakaf varchar(100)
  dokumen_aiw_url varchar(500)
  created_at timestamp [not null, default: `now()`]

  Note: '''
  is_anonymous=true: UI publik WAJIB sembunyikan nama_wakif (tampilkan
  "Hamba Allah"), tapi DATA nama_wakif TETAP tersimpan di DB untuk audit
  internal/legal — TIDAK PERNAH dikosongkan.
  '''
}

Ref: waqf_orders.waqf_program_id > waqf_programs.id
Ref: waqf_orders.wakif_id > users.id
Ref: waqf_orders.entered_by_amil_id > users.id
Ref: waqf_orders.transaction_id - transactions.id

Table mauquf_alaih_distributions {
  id uuid [pk, default: `gen_random_uuid()`]
  waqf_program_id uuid [not null]
  withdrawal_request_id uuid
  nama_penerima_manfaat varchar(255) [not null]
  kategori_penerima varchar(100)
  nominal_disalurkan decimal(18,2)
  barang_disalurkan varchar(255)
  tanggal_penyaluran date
  bukti_penyaluran_url varchar(500)
  notes text
}

Ref: mauquf_alaih_distributions.waqf_program_id > waqf_programs.id
Ref: mauquf_alaih_distributions.withdrawal_request_id > fund_withdrawal_requests.id

// ------------------------------------------------------------
// TRANSAKSI GENERIK (ANCHOR PAYMENT GATEWAY)
// ------------------------------------------------------------

Table transactions {
  id uuid [pk, default: `gen_random_uuid()`]
  wakif_id uuid [not null]
  jenis_transaksi transaction_type_enum [not null]
  amount decimal(18,2) [not null]
  payment_method varchar(50)
  payment_gateway_ref varchar(255)
  status_pembayaran transaction_payment_status_enum [not null, default: 'PENDING']
  disbursement_destination varchar(255) [not null]
  created_at timestamp [not null, default: `now()`]
}

Ref: transactions.wakif_id > users.id

// ------------------------------------------------------------
// ZAKAT
// ------------------------------------------------------------

Table zakat_calculations {
  id uuid [pk, default: `gen_random_uuid()`]
  wakif_id uuid [not null]
  jenis_zakat zakat_type_enum [not null]
  input_snapshot json [not null]
  nisab_digunakan decimal(18,2)
  hasil_kewajiban decimal(18,2)
  zakat_order_id uuid
  created_at timestamp [not null, default: `now()`]
}

Ref: zakat_calculations.wakif_id > users.id
Ref: zakat_calculations.zakat_order_id > zakat_orders.id

Table zakat_orders {
  id uuid [pk, default: `gen_random_uuid()`]
  tahun_hijriah varchar(10)
  nomor_kwitansi varchar(100) [not null, unique]
  muzakki_id uuid
  nama_muzakki varchar(255) [not null]
  nama_dizakatkan varchar(255)
  no_telepon varchar(20)
  alamat text
  is_anonymous boolean [not null, default: false]
  jenis_zakat zakat_type_enum [not null]
  metode_pembayaran zakat_payment_method_enum [not null]
  nominal decimal(18,2)
  berat_beras_kg decimal(10,2)
  jumlah_jiwa int
  bukti_transfer_url varchar(500)
  status zakat_order_status_enum [not null, default: 'MENUNGGU_VERIFIKASI']
  notes text
  entered_by_amil_id uuid
  transaction_id uuid
  created_at timestamp [not null, default: `now()`]
}

Ref: zakat_orders.muzakki_id > users.id
Ref: zakat_orders.entered_by_amil_id > users.id
Ref: zakat_orders.transaction_id - transactions.id

Table mustahiq_profiles {
  id uuid [pk, default: `gen_random_uuid()`]
  nama_mustahiq varchar(255) [not null]
  nik varchar(255) // tersimpan terenkripsi AES-256
  kategori_asnaf asnaf_enum [not null]
  alamat text
  no_telepon varchar(20)
  status_verifikasi verification_status_enum [not null, default: 'PENDING']
  admin_notes text
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null]
}

Table zakat_distributions {
  id uuid [pk, default: `gen_random_uuid()`]
  mustahiq_id uuid [not null]
  jenis_zakat zakat_type_enum [not null]
  nominal decimal(18,2)
  berat_beras_kg decimal(10,2)
  bukti_penerimaan_url varchar(500)
  status zakat_distribution_status_enum [not null, default: 'TERSALURKAN']
  notes text
  distributed_by_amil_id uuid [not null]
  created_at timestamp [not null, default: `now()`]
}

Ref: zakat_distributions.mustahiq_id > mustahiq_profiles.id
Ref: zakat_distributions.distributed_by_amil_id > users.id

Table zakat_fitrah_config {
  id uuid [pk, default: `gen_random_uuid()`]
  jenis_beras varchar(50) [not null]
  konversi_harga_per_jiwa decimal(18,2) [not null]
  referensi_sk varchar(255)
  tahun_berlaku varchar(10)
  is_active boolean [not null, default: true]
  updated_at timestamp [not null]

  Note: 'Dikelola Admin, dipakai kalkulator zakat FITRAH sebagai sumber harga dinamis (bukan hardcode)'
}

Table zakat_gold_price_history {
  id uuid [pk, default: `gen_random_uuid()`]
  price_per_gram decimal(18,2) [not null]
  source gold_price_source_enum [not null]
  fetched_at timestamp [not null, default: `now()`]

  Note: '''
  Log setiap fetch harga emas (live API sukses ATAU input manual Admin
  sebagai fallback). Row TERBARU (ORDER BY fetched_at DESC LIMIT 1) dipakai
  sebagai harga acuan aktif. Cache disarankan 6 jam — endpoint live tidak
  perlu fetch ulang API eksternal tiap request, cukup baca row ini jika
  fetched_at < 6 jam lalu.
  '''
}

// ------------------------------------------------------------
// QURBAN — KOMPLEKSITAS OPERASIONAL PENUH
// ------------------------------------------------------------

Table hewan_batches {
  id uuid [pk, default: `gen_random_uuid()`]
  jenis_hewan hewan_type_enum [not null]
  ras varchar(100)
  kelas_grade varchar(50)
  estimasi_berat_kg decimal(6,2)
  jenis_kelamin varchar(20)
  wilayah_penyaluran varchar(255)
  target_penerima_manfaat int
  tanggal_penyembelihan_estimasi date
  galeri_foto_urls json
  total_slot int [not null, default: 1]
  harga_per_slot decimal(18,2) [not null]
  status hewan_batch_status_enum [not null, default: 'TERSEDIA']
  created_at timestamp [not null, default: `now()`]
}

Table qurban_animal_slots {
  id uuid [pk, default: `gen_random_uuid()`]
  hewan_batch_id uuid [not null]
  nomor_slot int [not null]
  qurban_order_id uuid
  status slot_status_enum [not null, default: 'TERSEDIA']

  indexes {
    (hewan_batch_id, nomor_slot) [unique]
  }
}

Ref: qurban_animal_slots.hewan_batch_id > hewan_batches.id
Ref: qurban_animal_slots.qurban_order_id > qurban_orders.id

Table qurban_orders {
  id uuid [pk, default: `gen_random_uuid()`]
  wakif_id uuid
  nama_pengqurban varchar(255) [not null]
  telepon_pengqurban varchar(20)
  alamat_pengqurban text
  jenis_hewan hewan_type_enum [not null]
  tipe_kepemilikan kepemilikan_enum [not null]
  opsi_pesan opsi_pesan_enum [not null, default: 'PASRAH']
  metode_pembayaran metode_bayar_enum [not null]
  status_pembayaran qurban_payment_status_enum [not null, default: 'BELUM_BAYAR']
  total_harga decimal(18,2) [not null]
  sisa_tagihan decimal(18,2) [not null, default: 0]
  akad_wakalah_text text
  akad_wakalah_accepted_at timestamp
  entered_by_petugas_id uuid
  transaction_id uuid
  created_at timestamp [not null, default: `now()`]

  Note: '''
  akad_wakalah_accepted_at WAJIB terisi sebelum status_pembayaran boleh
  berubah dari BELUM_BAYAR — representasikan persetujuan wakalah 
  penyembelihan ke panitia. Validasi di application layer (Task 2.6).
  '''
}

Ref: qurban_orders.wakif_id > users.id
Ref: qurban_orders.entered_by_petugas_id > petugas_lapangan_profiles.id
Ref: qurban_orders.transaction_id - transactions.id

Table qurban_distribution_reports {
  id uuid [pk, default: `gen_random_uuid()`]
  qurban_order_id uuid [not null]
  bukti_foto_url varchar(500)
  video_url varchar(500)
  lokasi_penyaluran varchar(255)
  lokasi_lat decimal(9,6)
  lokasi_lng decimal(9,6)
  jumlah_penerima int
  created_at timestamp [not null, default: `now()`]
}

Ref: qurban_distribution_reports.qurban_order_id > qurban_orders.id

Table petugas_lapangan_profiles {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null, unique]
  wilayah_tugas varchar(255)
  no_hp varchar(20)
  created_at timestamp [not null, default: `now()`]
}

Ref: petugas_lapangan_profiles.user_id > users.id

Table setoran_petugas_lapangan {
  id uuid [pk, default: `gen_random_uuid()`]
  petugas_id uuid [not null]
  nomor_urut int
  tanggal date [not null]
  jumlah_setor decimal(18,2) [not null]
  bukti_setor_url varchar(500)
  keterangan text
  verified_by_admin_id uuid
  verified_at timestamp
  created_at timestamp [not null, default: `now()`]
}

Ref: setoran_petugas_lapangan.petugas_id > petugas_lapangan_profiles.id
Ref: setoran_petugas_lapangan.verified_by_admin_id > users.id

Table setoran_qurban_order_links {
  id uuid [pk, default: `gen_random_uuid()`]
  setoran_id uuid [not null]
  qurban_order_id uuid [not null]

  indexes {
    (setoran_id, qurban_order_id) [unique]
  }
}

Ref: setoran_qurban_order_links.setoran_id > setoran_petugas_lapangan.id
Ref: setoran_qurban_order_links.qurban_order_id > qurban_orders.id

Table permohonan_penyaluran_institusional {
  id uuid [pk, default: `gen_random_uuid()`]
  nama_pemohon varchar(255) [not null]
  nama_lembaga varchar(255)
  alamat_pemohon text
  nomor_surat_permohonan varchar(100)
  kontak varchar(50)
  penanggung_jawab varchar(255)
  nomor_rekening_pemohon varchar(50)
  nama_bank varchar(100)
  status permohonan_status_enum [not null, default: 'DIAJUKAN']
  admin_notes text
  approved_by_admin_id uuid
  created_at timestamp [not null, default: `now()`]
}

Ref: permohonan_penyaluran_institusional.approved_by_admin_id > users.id

Table qurban_distribution_allocations {
  id uuid [pk, default: `gen_random_uuid()`]
  permohonan_id uuid
  qurban_order_id uuid
  jumlah_bagian decimal(10,2)
  tanggal_salur date
  bukti_foto_url varchar(500)
  created_at timestamp [not null, default: `now()`]
}

Ref: qurban_distribution_allocations.permohonan_id > permohonan_penyaluran_institusional.id
Ref: qurban_distribution_allocations.qurban_order_id > qurban_orders.id

// ------------------------------------------------------------
// SERTIFIKAT
// ------------------------------------------------------------

Table certificates {
  id uuid [pk, default: `gen_random_uuid()`]
  transaction_id uuid [not null]
  jenis_sertifikat varchar(100)
  nomor_internal_amwal varchar(100) [not null, unique]
  nomor_registrasi_bwi varchar(100)
  pdf_url varchar(500)
  issued_at timestamp [not null, default: `now()`]
}

Ref: certificates.transaction_id > transactions.id

// ------------------------------------------------------------
// EDUKASI, GAMIFIKASI, CHATBOT (schema siap, fitur ditunda)
// ------------------------------------------------------------

Table education_contents {
  id uuid [pk, default: `gen_random_uuid()`]
  judul varchar(255) [not null]
  tipe education_type_enum [not null]
  konten_url varchar(500)
  kategori varchar(100)
  created_at timestamp [not null, default: `now()`]
}

Table quizzes {
  id uuid [pk, default: `gen_random_uuid()`]
  education_content_id uuid
  judul varchar(255) [not null]
  created_at timestamp [not null, default: `now()`]
}

Ref: quizzes.education_content_id > education_contents.id

Table quiz_questions {
  id uuid [pk, default: `gen_random_uuid()`]
  quiz_id uuid [not null]
  pertanyaan text [not null]
  opsi_jawaban json [not null]
  jawaban_benar varchar(10) [not null]
}

Ref: quiz_questions.quiz_id > quizzes.id

Table quiz_attempts {
  id uuid [pk, default: `gen_random_uuid()`]
  quiz_id uuid [not null]
  user_id uuid [not null]
  skor decimal(5,2)
  created_at timestamp [not null, default: `now()`]
}

Ref: quiz_attempts.quiz_id > quizzes.id
Ref: quiz_attempts.user_id > users.id

Table gamification_point_ledgers {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  activity_type varchar(100) [not null]
  points_earned int [not null]
  created_at timestamp [not null, default: `now()`]
}

Ref: gamification_point_ledgers.user_id > users.id

Table chatbot_conversations {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  domain_scope chatbot_domain_enum [not null, default: 'WAKAF_PRODUKTIF']
  created_at timestamp [not null, default: `now()`]
}

Ref: chatbot_conversations.user_id > users.id

Table chatbot_messages {
  id uuid [pk, default: `gen_random_uuid()`]
  conversation_id uuid [not null]
  role chatbot_role_enum [not null]
  content text [not null]
  cited_sources json
  user_feedback chatbot_feedback_enum
  created_at timestamp [not null, default: `now()`]

  Note: 'user_feedback nullable — user tidak wajib memberi feedback. Dipakai mengukur kualitas RAG/LLM.'
}

Ref: chatbot_messages.conversation_id > chatbot_conversations.id

// ------------------------------------------------------------
// NOTIFIKASI
// ------------------------------------------------------------

Table notifications {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null]
  type varchar(100) [not null]
  title varchar(255) [not null]
  body text
  is_read boolean [not null, default: false]
  related_entity_id uuid
  created_at timestamp [not null, default: `now()`]
}

Ref: notifications.user_id > users.id
```

## Instruksi Konversi DBML → `schema.prisma` (Tetap Berlaku)

Ikuti pola konversi yang sudah ditetapkan sebelumnya (naming, decimal, json, uuid, relasi).
**Tambahan khusus Putaran 6:**

```prisma
model User {
  id           String    @id @default(uuid())
  email        String?   @unique
  phone        String?   @unique
  passwordHash String?   // NULLABLE sekarang — akun OAuth tidak punya password
  name         String
  role         Role
  oauthProvider OAuthProvider?
  oauthId      String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  @@unique([oauthProvider, oauthId])
}

enum OAuthProvider {
  GOOGLE
  FACEBOOK
}
```

**Peringatan migrasi**: mengubah `passwordHash` dari `required` ke `optional` adalah
perubahan **non-destructive** (kolom existing tetap terisi untuk user lama),
tapi **WAJIB update logic** di `login/route.ts` — cek `user.passwordHash === null`
SEBELUM memanggil `bcrypt.compare()`, karena `bcrypt.compare(x, null)` akan
throw error, bukan return `false` secara graceful.