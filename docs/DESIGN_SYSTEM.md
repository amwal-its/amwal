# Design System — Amwal V.1

> **Catatan:** nilai token warna/spacing di bawah adalah PLACEHOLDER
> berdasarkan pola umum yang terlihat di wireframe Hi-Fi (dominan hijau
> tema Islami). Tim WAJIB mengambil nilai HEX presisi langsung dari file
> Figma (`AMWAL - HETI ADB` — link ada di slide Monev) sebelum dipakai di
> produksi. Jangan hardcode angka di dokumen ini sebagai sumber kebenaran
> final tanpa verifikasi ke Figma.

## 1. Prinsip Desain

- Nuansa Islami-modern: hijau sebagai warna primer, elemen geometris
  arabesque untuk aksen (lihat pola border di slide Monev)
- Mobile-first / PWA — komponen harus nyaman di layar sempit (~375-420px)
- Aksesibilitas kontras warna minimal WCAG AA untuk teks di atas hijau primer

## 2. Struktur Token (Tailwind v4)

```css
/* globals.css — sesuaikan value dengan Figma final */
@theme {
  --color-amwal-primary: #1B5E3A;      /* TODO: verifikasi hex dari Figma */
  --color-amwal-primary-dark: #123D26; /* TODO */
  --color-amwal-secondary-teal: #284a4c; /* sudah dipakai di button.tsx existing */
  --color-amwal-gold-accent: #C9A227;  /* TODO — aksen emas khas islami */
  --color-amwal-neutral-light: #F7F7F5;
  --color-amwal-neutral-dark: #1F1F1F;
  --color-amwal-danger: #DC2626;
  --color-amwal-success: #16A34A;
  --color-amwal-warning: #D97706;

  --font-jakarta: 'Plus Jakarta Sans', sans-serif; /* sudah dipakai di button.tsx */
}
```

## 3. Komponen Dasar (Sudah Ada — Pertahankan Pola)

`components/ui/button.tsx` sudah punya pola variant/size yang baik:
```typescript
variant: "default" | "outline" | "ghost" | "link"
size: "default" | "sm" | "lg" | "icon"
```
Komponen baru (Card, Input, Badge, Modal, Table) WAJIB mengikuti pola
`forwardRef` + `cn()` (dari `lib/utils.ts`) + variant/size props yang sama.

## 4. Komponen Baru yang Perlu Dibuat (Prioritas Modul Wakaf/Zakat/Qurban)

| Komponen | Dipakai di |
|---|---|
| `StatusBadge` | Status order (MENUNGGU_VERIFIKASI/TERVERIFIKASI/DITOLAK, dsb.) — warna dinamis per status |
| `ProgressBar` | Persentase fisik program wakaf |
| `AmountInput` | Input nominal Rupiah dengan format ribuan otomatis |
| `FileUploadDropzone` | Upload KTP, kuitansi, bukti transfer — dengan preview |
| `SlotPicker` | Pilih slot kambing/sapi kolektif (Qurban) — visual grid 1-7 |
| `RoleGuardWrapper` | Client component pembungkus, redirect kalau role tidak sesuai (pelengkap `proxy.ts`, BUKAN pengganti) |

## 5. Layout Pattern

- Dashboard per role (`/dashboard/admin`, `/dashboard/nadzir`,
  `/dashboard/petugas`) pakai shared layout dengan sidebar/bottom-nav
  sesuai role
- Halaman publik (katalog program, detail) pakai layout terpisah tanpa
  dashboard chrome

## 6. Referensi Visual

Rujuk mockup Hi-Fi (`Amwal_Hi-Fi.png`) dan Figma untuk detail spacing,
tipografi, dan komponen per halaman — dokumen ini hanya kerangka token,
bukan pengganti desain visual lengkap.
