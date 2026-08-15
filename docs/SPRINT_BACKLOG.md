# Sprint Backlog — Amwal V.1 (Target Staging 14 Hari)

**Tim:** Bara (Wakaf), Awan (Zakat), Naufal (Qurban + Auth)
**Model kerja:** Fullstack-per-modul, Micro-Sprint 2 hari

## Micro-Sprint 1 (Hari 1-2) — Fondasi

- [ ] **[Blocker]** Fix 5 bug kritis Auth/RBAC (lihat prompt Antigravity terpisah) — SEMUA developer terblokir sampai ini selesai
- [ ] Naufal: Extend Auth — RefreshToken table + rotating flow, proxy.ts RBAC direvisi ke 4 role final
- [ ] Bara: Migrasi full DBML → schema.prisma bertahap (lihat urutan di `DATABASE_SCHEMA.md`), seed dasar
- [ ] Awan: Setup Supabase Storage bucket + policy, susun draft `DOMAIN_GLOSSARY.md`/`DECISION_LOG.md`

## Micro-Sprint 2 (Hari 3-4) — Skeleton API Digital

- [ ] Bara: CRUD `waqf_programs`, submit `NadzirProfile`+`NadzirDocument` + OCR PoC
- [ ] Awan: Kalkulator zakat per `zakat_type_enum`, `zakat_orders` creation (digital)
- [ ] Naufal: `hewan_batches`+`qurban_animal_slots` row-lock, `qurban_orders` creation (digital)

## Micro-Sprint 3 (Hari 5-6) — Offline Flow + Payment Gateway

- [ ] Bara: `waqf_orders` offline entry + field AIW, webhook PG → update status
- [ ] Awan: `zakat_orders` offline entry (tunai/beras), webhook PG → update status
- [ ] Naufal: `qurban_orders` offline + `petugas_lapangan_profiles`+`setoran_petugas_lapangan`, webhook PG dgn logic DP

## Micro-Sprint 4 (Hari 7-8) — Approval & Distribusi

- [ ] Bara: `FundWithdrawalRequest` flow + enforce ledger pokok/hasil, `mauquf_alaih_distributions`
- [ ] Awan: `mustahiq_profiles`+`zakat_distributions`, verifikasi Admin zakat_orders
- [ ] Naufal: `permohonan_penyaluran_institusional`+`qurban_distribution_allocations`, verifikasi setoran

## Micro-Sprint 5 (Hari 9-10) — Frontend per Modul

- [ ] Bara: UI eksplorasi/detail program, form donasi, dashboard Nadzir
- [ ] Awan: UI kalkulator, form bayar, form entri Amil
- [ ] Naufal: UI katalog hewan, pilih slot, form order, form entri Petugas Lapangan

## Micro-Sprint 6 (Hari 11-12) — Cross-Cutting

- [ ] Bara: Certificate generation lintas 3 modul + field manual BWI di Admin
- [ ] Awan: Notifikasi FCM event kunci
- [ ] Naufal: Dashboard Admin overview lintas modul + integration testing

## Micro-Sprint 7 (Hari 13-14) — Hardening & Deploy

- [ ] Hari 13: Bug bash bersama + audit security/fiqih final (Claude)
- [ ] Hari 14: Deploy staging (Vercel + Supabase staging), smoke test 4 role, update `RUNBOOK.md`

## Eksplisit DI LUAR Scope 14 Hari Ini

- [ ] ~~Gamifikasi~~ — ditunda
- [ ] ~~Edukasi & Kuis~~ — ditunda
- [ ] ~~AI Chatbot~~ — ditunda
