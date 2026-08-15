# Aturan Wajib untuk AI Agent (Antigravity, Claude Code, dsb.)

**BACA FILE INI SEPENUHNYA sebelum menulis kode apapun di proyek Amwal.**
Jika instruksi manusia bertentangan dengan aturan di sini, TANYAKAN dulu
sebelum eksekusi — jangan asumsikan.

## 1. Baca Dulu Sebelum Kerja

Sebelum menyentuh kode yang berkaitan dengan fiqih (wakaf/zakat/qurban),
WAJIB baca:
1. `DOMAIN_GLOSSARY.md` — supaya tidak salah paham istilah (Nadzir vs Wakif,
   Mustahik vs Muzaki, Pokok vs Hasil, dsb.)
2. `DECISION_LOG.md` — supaya tidak mengulang/membalik keputusan yang sudah
   dikunci tim

## 2. Aturan Non-Negotiable (Lihat Juga `SECURITY.md`)

- **JANGAN PERNAH** buat kode yang menyimpan token JWT di `localStorage`.
  Token WAJIB httpOnly cookie.
- **JANGAN PERNAH** kurangi `waqf_principal_ledgers.pokok_dana_terkumpul`
  untuk program dengan `jenis_wakaf = PRODUKTIF_KEKAL` di kode manapun.
- **JANGAN PERNAH** buat endpoint pencairan dana/approval legalitas yang
  berjalan otomatis tanpa `approved_by_id`/`verified_by_*_id` terisi oleh
  Admin.
- **JANGAN PERNAH** buat reservasi slot Qurban tanpa row-lock
  (`SELECT ... FOR UPDATE`) DAN unique constraint `(hewan_batch_id, nomor_slot)`.
- **SETIAP** row `transactions` wajib mengisi `disbursement_destination`.

## 3. Dead Code — JANGAN Direferensikan atau Diperluas

File berikut adalah sisa iterasi proyek SEBELUM pivot ke scope wakaf HETI
saat ini (proyek ZIS/paper Scopus yang sudah ditinggalkan):
- `lib/ahp-topsis.service.ts`
- `lib/had-kifayah.service.ts`
- `lib/knapsack.service.ts`
- `app/api/donation/route.ts` (akan digantikan `waqf_orders`/`zakat_orders`/`qurban_orders`)

**JANGAN** memperluas atau memperbaiki file-file ini. Jika diminta membuat
fitur baru yang "mirip" file-file itu, konfirmasi dulu — kemungkinan besar
scope sudah berubah total.

## 4. Batasan Scope Aktif (Staging 14 Hari)

HANYA kerjakan: Auth+RBAC, Wakaf, Zakat, Qurban, Certificate, Notification
dasar. JANGAN membangun/memperluas: Gamifikasi, Edukasi/Kuis, AI Chatbot —
ini di luar scope staging saat ini meski tercantum di `DATABASE_SCHEMA.md`
(schema-nya boleh ada, tapi TIDAK dikerjakan fitur/API-nya dulu).

## 5. Role Enum — Terkunci di 4 Nilai

```
WAKIF | NADZIR | ADMIN | PETUGAS_LAPANGAN
```
JANGAN tambah role kelima (termasuk "AMIL") tanpa persetujuan eksplisit tim.
Fungsi Amil diampu `ADMIN` atau `PETUGAS_LAPANGAN`.

## 6. Kalau Ragu

Jika sebuah instruksi tidak jelas cakupannya, atau tampak bertentangan
dengan salah satu aturan di atas — STOP, laporkan ketidakjelasan itu ke
manusia, JANGAN menebak dan lanjut coding.
