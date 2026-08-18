# Design System — Amwal V.1

**Sumber:** Figma "HETI Amwal / Tokens" (71 Variables, 9 Text Styles, Font: Plus Jakarta Sans)

> ⚠️ **Status Verifikasi**: Token tipografi, spacing, radius, breakpoint, dan
> aturan grid di dokumen ini adalah **nilai EKSAK** dari Design Guideline resmi.
> Token **warna (hex)** adalah **estimasi visual** dari swatch — belum ada
> hex code presisi yang tertulis eksplisit di sumber. **WAJIB** di-color-pick
> langsung dari file Figma sebelum dipakai di build staging final. Semua
> nilai estimasi ditandai `⚠️` di `globals.css`.

## 1. Prinsip Inti

Semua komponen **WAJIB** mengikat fill/stroke ke Variables **semantic**
(`bg/*`, `text/*`, `brand/*`, `status/*`), **BUKAN** primitive langsung
(`color/green/500`). Semua teks **WAJIB** pakai Text Style yang sudah
didefinisikan, bukan ukuran manual. Ikon dari Material Symbols/library,
**BUKAN** digambar manual. Kalau warna/nilai yang dibutuhkan belum ada
tokennya — buat token baru, **JANGAN hardcode**.

## 2. Color Tokens — Semantic

### Background & Surface
| Token | Kegunaan |
|---|---|
| `bg/default` | Latar utama (putih) |
| `bg/surface` | Latar kartu/section |
| `bg/surface-alt` | Latar alternatif (tabel baris genap, dsb.) |
| `bg/cream` | Latar aksen hangat (banner edukasi, dsb.) |
| `bg/green-tint` | Latar aksen sukses/positif ringan |
| `bg/red-tint` | Latar aksen peringatan/error ringan |
| `bg/blue-tint` | Latar aksen info ringan |

### Brand & Accent
| Token | Kegunaan |
|---|---|
| `brand/primary` | Warna utama brand (hijau) — tombol utama, ikon aktif |
| `brand/primary-hover` | State hover/pressed dari `brand/primary` |
| `brand/primary-soft` | Varian lembut brand — background badge/chip aktif |
| `accent/amber` | Aksen sekunder (badge, highlight) |
| `accent/red` | Aksen peringatan/destructive |
| `color/amber/50` | Primitive amber paling terang, dasar `bg/cream`-adjacent |

### Text
| Token | Kegunaan |
|---|---|
| `text/primary` | Teks utama (judul, body penting) |
| `text/secondary` | Teks sekunder (caption, deskripsi, metadata) |
| `text/on-brand` | Teks di atas background brand (putih di atas tombol hijau) |

### Border
| Token | Kegunaan |
|---|---|
| `border/default` | Border standar (input, card) |
| `border/subtle` | Border tipis/samar (divider) |

### Icon
| Token | Kegunaan |
|---|---|
| `icon/brand` | Ikon dengan makna brand/aktif |
| `icon/amber` | Ikon aksen sekunder |
| `icon/red` | Ikon peringatan/error |
| `icon/info` | Ikon informasi |

### Status
| Token | Kegunaan |
|---|---|
| `status/error` | Pesan error, validasi gagal |
| `status/warning` | Peringatan (mis. `isStale` harga emas) |
| `status/info` | Info netral |
| `status/success` | Konfirmasi sukses (pembayaran LUNAS, dsb.) |

**Implementasi Tailwind**: lihat `globals.css` — semua token di atas sudah
terdaftar sebagai CSS variable `--color-*` di `@theme`, dipakai via class
`bg-bg-surface`, `text-text-primary`, `border-border-default`, dst.

## 3. Tipografi — Plus Jakarta Sans

| Text Style | Ukuran | Weight | Line-Height | Contoh Pemakaian |
|---|---|---|---|---|
| `Display/XL` | 32px | ExtraBold | 38px | Judul halaman utama, angka besar dashboard |
| `Heading/L` | 24px | Bold | 30px | Judul section utama |
| `Heading/M` | 20px | SemiBold | 26px | Judul card/program |
| `Title/S` | 16px | SemiBold | 22px | Sub-judul, label kartu |
| `Body/Base` | 14px | Regular | 20px | Paragraf/teks umum |
| `Body/Medium` | 14px | Medium | 20px | Teks dengan sedikit penekanan |
| `Label/Button` | 14px | SemiBold | 18px | Teks di dalam tombol |
| `Label/Caption` | 12px | Medium | 16px | Label field, metadata singkat |
| `Caption/Mini` | 10px | Regular | 14px | Timestamp, teks bantu terkecil |

**Implementasi Tailwind**: pakai class utility `.text-display-xl`,
`.text-heading-l`, dst. (didefinisikan di `globals.css` `@layer utilities`)
— JANGAN susun manual (`text-[32px] font-extrabold`) di komponen.

## 4. Spacing & Radius

### Spacing Scale
`space/2` = 2px · `space/4` = 4px · `space/8` = 8px · `space/12` = 12px ·
`space/16` = 16px · `space/24` = 24px · `space/32` = 32px · `space/48` = 48px

Pakai untuk padding, gap, dan margin. Tailwind: `p-[--spacing-16]` atau
extend via `p-4` dst. jika sudah dipetakan ke skala Tailwind default —
**rekomendasi**: pakai token custom (`--spacing-16`) langsung supaya nama
tetap konsisten dengan Figma.

### Radius Scale
`radius/sm` = 8px · `radius/md` = 12px · `radius/lg` = 16px (card default) ·
`radius/full` = 999px (pill/badge/avatar bulat)

## 5. Elevation / Shadow

| Token | Kegunaan |
|---|---|
| `Card` | Shadow default kartu diam |
| `Card Hover` | Shadow saat kartu di-hover/pressed |
| `Floating` | Shadow elemen mengambang (modal, FAB, dropdown) |

⚠️ Nilai blur/spread/opacity tidak tertulis eksak di sumber — `globals.css`
berisi estimasi standar Material-like shadow (`.shadow-card`,
`.shadow-card-hover`, `.shadow-floating`). Sesuaikan jika Figma punya nilai presisi berbeda.

## 6. Grid & Layout

### Mobile (Target Utama — iPhone 14/15 Pro Max)
| Properti | Nilai |
|---|---|
| Breakpoint | < 600px |
| Artboard | 430 × 932 px |
| Kolom | 4 |
| Margin tepi | 16px (`space/16`) |
| Gutter | 16px (`space/16`) |
| Lebar konten | 398px |
| Tap target minimum | ≥ 44px |

### Tablet
600–1023px · 8 kolom · margin 24px · gutter 24px

### Desktop
≥1024px · 12 kolom · margin 24px · gutter 24px · container maks 1200px
(center-aligned) · lebar kolom ≈76px · sidebar opsional 240–280px

### Wide
≥1440px · 12 kolom (container tetap maks 1200px, auto-center)

**Implementasi Tailwind**: breakpoint custom `tablet:`, `desktop:`, `wide:`
sudah terdaftar di `globals.css` (`--breakpoint-tablet: 600px`, dst.) —
otomatis menghasilkan variant Tailwind sesuai nama (Tailwind v4).

### Pola Grid Umum (dari "Contoh Penggunaan Grid")
- **Mobile**: Hero full-width (span 4) → 2 kartu setengah (span 2 + span 2)
  → section list full-width (span 4)
- **Tablet**: Header full-width (span 8) → Sidebar (span 2) + Konten Utama (span 6)
- **Desktop**: Top bar (span 12) → 3 kartu statistik (span 4 tiap) → Chart
  besar (span 8) + Panel (span 4)
- **Baseline grid 8px**: tinggi elemen & jarak vertikal sebaiknya kelipatan 8px

## 7. Konvensi Penamaan Token

| Kategori | Format | Contoh |
|---|---|---|
| Warna primitive | `color/{hue}/{scale}` | `color/green/500` |
| Warna semantic | `{peran}/{varian}` | `bg/surface`, `text/primary` |
| Brand | `brand/{varian}` | `brand/primary-hover` |
| Status | `status/{jenis}` | `status/error` |
| Spacing | `space/{px}` | `space/16` |
| Radius | `radius/{ukuran}` | `radius/lg` |
| Text Style | `{Grup}/{Ukuran}` | `Heading/L` |
| Icon | `icon/{peran}` | `icon/brand` |

## 8. Aturan Pakai (Do & Don't)

**✅ Lakukan:**
- Ikat semua fill/stroke ke Variables semantic
- Pakai Text Style untuk semua teks (Heading/Body/Label)
- Pakai `space/*` & `radius/*` untuk padding, gap, dan sudut
- Ikon dari Material Symbols/library — bukan gambar manual
- Buat token baru jika warna/nilai belum ada, jangan hardcode

**❌ Hindari:**
- Hardcode hex, ukuran font, atau angka radius/spacing
- Pakai primitive (`color/green/500`) langsung di komponen — pakai `brand/primary`
- Menggambar ikon dengan vector path manual
- Membuat ukuran teks di luar skala Text Style
- Menyalin komponen tanpa mengikat ulang ke token

## 9. Komponen Dasar Existing (Referensi Codebase)

`components/ui/button.tsx` sudah punya pola variant/size yang sejalan
dengan sistem ini:
```typescript
variant: "default" | "outline" | "ghost" | "link"
size: "default" | "sm" | "lg" | "icon"
```
Komponen baru (Card, Input, Badge, Modal, Table) **WAJIB** mengikuti pola
`forwardRef` + `cn()` (`lib/utils.ts`) + variant/size props yang sama, dan
memakai token dari dokumen ini — bukan nilai bebas.

## 10. Komponen Baru yang Perlu Dibuat (Prioritas Sprint Aktif)

| Komponen | Dipakai di |
|---|---|
| `StatusBadge` | Status order (MENUNGGU_VERIFIKASI/TERVERIFIKASI/DITOLAK, dsb.) — warna dari `status/*` |
| `ProgressBar` | Persentase fisik program wakaf |
| `AmountInput` | Input nominal Rupiah dengan format ribuan otomatis |
| `FileUploadDropzone` | Upload KTP, kuitansi, bukti transfer, bukti cash |
| `SlotPicker` | Pilih slot kambing/sapi kolektif (Qurban) — grid visual 1-7 |
| `ConfirmationModal` | Modal review sebelum submit (reuse untuk entri offline Wakaf/Zakat/Qurban & akad wakalah) |
| `RoleGuardWrapper` | Client component pembungkus, redirect kalau role tidak sesuai |

## 11. Referensi Visual

Rujuk mockup Hi-Fi (`Amwal_Hi-Fi.png`, `Admin.png`, `User.png`) dan Figma
untuk detail final tiap halaman — dokumen ini adalah kerangka token,
bukan pengganti desain visual lengkap per screen.