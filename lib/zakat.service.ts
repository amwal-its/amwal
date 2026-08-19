import { Prisma } from '../app/generated/prisma/client';
import type { ZakatType } from '../app/generated/prisma/enums';

// Konstanta fiqih zakat (mengikuti SK BAZNAS umum)
export const NISAB_EMAS_GRAM = new Prisma.Decimal(85);
export const NISAB_PERTANIAN_KG = new Prisma.Decimal(653); // 5 wasaq
export const BERAS_PER_JIWA_KG = new Prisma.Decimal('2.5');
export const ZAKAT_RATE = new Prisma.Decimal('0.025'); // 2.5%
export const RATE_PERTANIAN_IRIGASI = new Prisma.Decimal('0.05'); // 5%, biaya irigasi
export const RATE_PERTANIAN_TADAH_HUJAN = new Prisma.Decimal('0.10'); // 10%, tanpa biaya irigasi

export type ZakatJenis = ZakatType;

export type SistemIrigasi = 'IRIGASI' | 'TADAH_HUJAN';

// Harga acuan sistem (bukan input bebas client untuk hasil final):
// - goldPricePerGram dari ZakatGoldPriceHistory (row terbaru)
// - fitrahPricePerJiwa dari ZakatFitrahConfig (aktif)
// - hargaBerasPerKg default turunan config fitrah (untuk FIDYAH/KAFARAT)
export interface ZakatReferencePrices {
  goldPricePerGram?: Prisma.Decimal | number | string;
  fitrahPricePerJiwa?: Prisma.Decimal | number | string;
  hargaBerasPerKg?: Prisma.Decimal | number | string;
}

export interface ZakatCalculationInput {
  jenisZakat: ZakatJenis;
  // FITRAH
  jumlahJiwa?: number;
  // MAAL_PENGHASILAN
  penghasilanPerBulan?: number;
  penghasilanLain?: number;
  // EMAS
  beratEmasGram?: number;
  // PERUSAHAAN
  aktivaLancar?: number;
  pasivaLancar?: number;
  // PERTANIAN
  hasilPanenKg?: number;
  sistemIrigasi?: SistemIrigasi;
  // FIDYAH / KAFARAT
  jumlahHari?: number;
  hargaBerasPerKg?: number; // override preview saja, default ambil dari config sistem
}

export interface ZakatCalculationResult {
  nisabDigunakan: Prisma.Decimal | null;
  hasilKewajiban: Prisma.Decimal;
  mencapaiNisab: boolean;
}

function toDecimal(v: number | string | Prisma.Decimal): Prisma.Decimal {
  return v instanceof Prisma.Decimal ? v : new Prisma.Decimal(v);
}

function requiredDecimal(
  value: Prisma.Decimal | number | string | undefined,
  label: string
): Prisma.Decimal {
  if (value === undefined) {
    throw new Error(`Referensi harga tidak tersedia: ${label}`);
  }
  return toDecimal(value);
}

/**
 * Pure function kalkulasi zakat per jenis. Semua harga acuan datang dari
 * sistem (dibawa caller), bukan di-hardcode di sini.
 */
export function calculateZakat(
  input: ZakatCalculationInput,
  refs: ZakatReferencePrices
): ZakatCalculationResult {
  switch (input.jenisZakat) {
    case 'FITRAH': {
      const pricePerJiwa = requiredDecimal(refs.fitrahPricePerJiwa, 'fitrahPricePerJiwa');
      const jumlahJiwa = toDecimal(input.jumlahJiwa ?? 0);
      return {
        nisabDigunakan: pricePerJiwa.toDecimalPlaces(2),
        hasilKewajiban: pricePerJiwa.times(jumlahJiwa).toDecimalPlaces(2),
        mencapaiNisab: true, // fitrah wajib tanpa ambang nisab
      };
    }

    case 'EMAS': {
      const goldPrice = requiredDecimal(refs.goldPricePerGram, 'goldPricePerGram');
      const beratGram = toDecimal(input.beratEmasGram ?? 0);
      const nisab = NISAB_EMAS_GRAM.times(goldPrice);
      const nilaiEmas = beratGram.times(goldPrice);
      const mencapaiNisab = beratGram.gte(NISAB_EMAS_GRAM);
      return {
        nisabDigunakan: nisab.toDecimalPlaces(2),
        hasilKewajiban: (mencapaiNisab ? nilaiEmas.times(ZAKAT_RATE) : new Prisma.Decimal(0)).toDecimalPlaces(2),
        mencapaiNisab,
      };
    }

    case 'MAAL_PENGHASILAN': {
      const goldPrice = requiredDecimal(refs.goldPricePerGram, 'goldPricePerGram');
      const bulanan = toDecimal(input.penghasilanPerBulan ?? 0).plus(input.penghasilanLain ?? 0);
      const tahunan = bulanan.times(12);
      const nisab = NISAB_EMAS_GRAM.times(goldPrice);
      const mencapaiNisab = tahunan.gte(nisab);
      return {
        nisabDigunakan: nisab.toDecimalPlaces(2),
        hasilKewajiban: (mencapaiNisab ? bulanan.times(ZAKAT_RATE) : new Prisma.Decimal(0)).toDecimalPlaces(2),
        mencapaiNisab,
      };
    }

    case 'PERUSAHAAN': {
      // TIDAK pakai revenue — pakai aktiva lancar dikurangi pasiva lancar
      const goldPrice = requiredDecimal(refs.goldPricePerGram, 'goldPricePerGram');
      const net = toDecimal(input.aktivaLancar ?? 0).minus(input.pasivaLancar ?? 0);
      const netNonNegative = net.isNegative() ? new Prisma.Decimal(0) : net;
      const nisab = NISAB_EMAS_GRAM.times(goldPrice);
      const mencapaiNisab = netNonNegative.gte(nisab);
      return {
        nisabDigunakan: nisab.toDecimalPlaces(2),
        hasilKewajiban: (mencapaiNisab ? netNonNegative.times(ZAKAT_RATE) : new Prisma.Decimal(0)).toDecimalPlaces(2),
        mencapaiNisab,
      };
    }

    case 'PERTANIAN': {
      const hasilKg = toDecimal(input.hasilPanenKg ?? 0);
      const rate = input.sistemIrigasi === 'TADAH_HUJAN' ? RATE_PERTANIAN_TADAH_HUJAN : RATE_PERTANIAN_IRIGASI;
      const mencapaiNisab = hasilKg.gte(NISAB_PERTANIAN_KG);
      return {
        nisabDigunakan: null, // nisab pertanian dalam kg, bukan nilai uang
        hasilKewajiban: (mencapaiNisab ? hasilKg.times(rate) : new Prisma.Decimal(0)).toDecimalPlaces(2),
        mencapaiNisab,
      };
    }

    case 'FIDYAH':
    case 'KAFARAT': {
      const hargaPerKg = requiredDecimal(refs.hargaBerasPerKg, 'hargaBerasPerKg');
      const jumlahHari = toDecimal(input.jumlahHari ?? 0);
      return {
        nisabDigunakan: null, // kewajiban tanpa ambang nisab
        hasilKewajiban: hargaPerKg.times(jumlahHari).toDecimalPlaces(2),
        mencapaiNisab: true,
      };
    }

    default:
      throw new Error(`Jenis zakat tidak didukung: ${String(input.jenisZakat)}`);
  }
}
