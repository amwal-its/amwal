# API Contracts — Amwal V.1

Status: Draft awal, endpoint akan bertambah/berubah minor selama Sprint.
Format response mengikuti `CODING_CONVENTIONS.md`: sukses `{message, data?}`,
error `{error, details?}`.

## Auth

| Method | Path | Role | Body |
|---|---|---|---|
| POST | `/api/auth/register` | Publik | `{ name, password, email?, phone?, role? }` (role hanya WAKIF/NADZIR) |
| POST | `/api/auth/login` | Publik | `{ identifier, password }` |
| POST | `/api/auth/refresh` | Publik (butuh cookie refresh) | — |
| POST | `/api/auth/logout` | Authenticated | — |

## Wakaf (Nadzir & Program)

| Method | Path | Role | Deskripsi |
|---|---|---|---|
| POST | `/api/nadzir/profile` | NADZIR | Submit profil Nadzir (kategori, rekening) |
| POST | `/api/nadzir/documents` | NADZIR | Upload KTP/Sertifikat BWI → trigger OCR |
| GET | `/api/admin/nadzir?status=PENDING` | ADMIN | List profil Nadzir untuk verifikasi |
| PATCH | `/api/admin/nadzir/:id/verify` | ADMIN | `{ status: VERIFIED\|REJECTED }` |
| POST | `/api/wakaf/programs` | NADZIR (verified) | Buat `WaqfProgram` baru |
| GET | `/api/wakaf/programs` | Publik | List program (search, filter kategori) |
| GET | `/api/wakaf/programs/:id` | Publik | Detail program + `WaqfPrincipalLedger` |
| PATCH | `/api/wakaf/programs/:id/publish` | NADZIR (owner) | Ubah status DRAFT → LIVE (mengunci `jenisWakaf`) |
| POST | `/api/wakaf/programs/:id/progress` | NADZIR (owner) | Submit `ProgramProgressReport` |
| POST | `/api/admin/wakaf/programs/:id/yield-entries` | ADMIN | Catat `WaqfYieldEntry` (inflow hasil investasi wakaf produktif) & increment `totalHasilAvailable` |
| GET | `/api/wakaf/programs/:id/yield-entries` | ADMIN / NADZIR (owner) | List riwayat hasil investasi wakaf produktif (`recordedAt DESC`) + `ledgerSummary` |
| POST | `/api/wakaf/orders` | WAKIF / ADMIN (offline) | Buat `WaqfOrder` (uang/barang, digital/offline) |
| GET | `/api/wakaf/orders/:id` | WAKIF (owner) / ADMIN | Detail order |
| PATCH | `/api/admin/wakaf/orders/:id/verify` | ADMIN | `{ status: TERVERIFIKASI\|DITOLAK }` |
| POST | `/api/wakaf/programs/:id/withdrawal-requests` | NADZIR (owner) | Ajukan `FundWithdrawalRequest` |
| PATCH | `/api/admin/withdrawal-requests/:id` | ADMIN | `{ status: APPROVED\|REJECTED }` — validasi ledger pokok/hasil di server |
| POST | `/api/admin/wakaf/programs/:id/mauquf-alaih` | ADMIN / NADZIR | Catat `MauqufAlaihDistribution` |

## Zakat

| Method | Path | Role | Deskripsi |
|---|---|---|---|
| POST | `/api/zakat/calculate` | WAKIF | `{ jenisZakat, ...inputSpesifik }` → hasil kalkulasi (preview, belum bayar) |
| POST | `/api/zakat/orders` | WAKIF / ADMIN / PETUGAS_LAPANGAN | Buat `ZakatOrder` (digital/tunai/beras) |
| GET | `/api/zakat/orders/:id` | WAKIF (owner) / ADMIN | Detail order |
| PATCH | `/api/admin/zakat/orders/:id/verify` | ADMIN | `{ status: TERVERIFIKASI\|DITOLAK }` |
| POST | `/api/admin/mustahiq` | ADMIN / PETUGAS_LAPANGAN | Buat/list `MustahiqProfile` |
| POST | `/api/admin/zakat/distributions` | ADMIN | Catat `ZakatDistribution` ke mustahik |

## Qurban

| Method | Path | Role | Deskripsi |
|---|---|---|---|
| GET | `/api/qurban/hewan-batches` | Publik | Katalog hewan tersedia |
| POST | `/api/qurban/orders` | WAKIF / PETUGAS_LAPANGAN | Buat `QurbanOrder` — WAJIB row-lock reservasi slot di dalam `prisma.$transaction` |
| GET | `/api/qurban/orders/:id` | WAKIF (owner) / ADMIN / PETUGAS_LAPANGAN | Detail order |
| PATCH | `/api/qurban/orders/:id/pay` | WAKIF / PETUGAS_LAPANGAN | Update pembayaran (DP/LUNAS) |
| POST | `/api/petugas/setoran` | PETUGAS_LAPANGAN | Buat `SetoranPetugasLapangan` + link `QurbanOrder` terkait |
| PATCH | `/api/admin/setoran/:id/verify` | ADMIN | Verifikasi setoran tunai |
| POST | `/api/admin/permohonan-institusional` | Publik/ADMIN (entri manual) | Buat pengajuan lembaga eksternal |
| PATCH | `/api/admin/permohonan-institusional/:id` | ADMIN | `{ status: DISETUJUI\|DITOLAK }` |
| POST | `/api/admin/qurban/distribution-allocations` | ADMIN | Alokasi daging ke permohonan/individu |
| POST | `/api/qurban/orders/:id/distribution-report` | PETUGAS_LAPANGAN / ADMIN | Bukti foto penyaluran |

## Payment Gateway Webhook

| Method | Path | Role | Deskripsi |
|---|---|---|---|
| POST | `/api/webhooks/payment` | Signature-verified (bukan JWT) | Terima notifikasi Midtrans/Xendit, update `Transaction.statusPembayaran`, cascade update `*_orders` terkait |

## Certificate & Notification

| Method | Path | Role | Deskripsi |
|---|---|---|---|
| GET | `/api/certificates/:transactionId` | Owner / ADMIN | Ambil sertifikat |
| PATCH | `/api/admin/certificates/:id/bwi-number` | ADMIN | Input manual nomor registrasi BWI |
| GET | `/api/notifications` | Authenticated | List notifikasi user login |
| PATCH | `/api/notifications/:id/read` | Authenticated (owner) | Tandai sudah dibaca |

## Contoh Format Response

**Sukses:**
```json
{
  "message": "Wakaf order created successfully",
  "data": { "id": "uuid", "nomorKwitansi": "WKF-2026-0001", "status": "MENUNGGU_VERIFIKASI" }
}
```

**Error validasi:**
```json
{
  "error": "Validation failed",
  "details": { "nominal": { "_errors": ["Nominal wajib diisi untuk bentuk_wakaf UANG"] } }
}
```

**Response `GET /api/wakaf/programs/:id/yield-entries` (200 OK):**
```json
{
  "data": [
    {
      "id": "3489bccb-6758-432e-9f65-00d3c53e66ae",
      "waqfProgramId": "d4bece54-16ea-45f3-8c42-4ae4c7af0827",
      "amount": "5000000.00",
      "sourceDescription": "Bagi hasil sewa toko kuartal 1",
      "recordedByAdminId": "d5735d9c-22c0-4319-86b6-446721019524",
      "recordedAt": "2026-08-25T06:00:00.000Z"
    }
  ],
  "ledgerSummary": {
    "pokokDanaTerkumpul": "50000000.00",
    "totalHasilAvailable": "5000000.00",
    "hasilInvestasiTersalurkan": "0.00"
  }
}
```
