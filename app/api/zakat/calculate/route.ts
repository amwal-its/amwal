import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { z } from 'zod';
import { Prisma } from '../../../../app/generated/prisma/client';
import { ZakatType } from '../../../../app/generated/prisma/enums';
import {
  calculateZakat,
  BERAS_PER_JIWA_KG,
  type ZakatCalculationInput,
} from '../../../../lib/zakat.service';
import {
  getActiveGoldPrice,
  GoldPriceUnavailableError,
} from '../../../../lib/gold-price.service';

const GOLD_BASED_TYPES = new Set<ZakatType>(['EMAS', 'MAAL_PENGHASILAN', 'PERUSAHAAN']);
const BERAS_BASED_DAY_TYPES = new Set<ZakatType>(['FIDYAH', 'KAFARAT']);

const calculateSchema = z.object({
  jenisZakat: z.nativeEnum(ZakatType),
  // FITRAH
  jumlahJiwa: z.number().int().positive().optional(),
  jenisBeras: z.string().optional(),
  // MAAL_PENGHASILAN
  penghasilanPerBulan: z.number().nonnegative().optional(),
  penghasilanLain: z.number().nonnegative().optional(),
  // EMAS
  beratEmasGram: z.number().nonnegative().optional(),
  // PERUSAHAAN
  aktivaLancar: z.number().nonnegative().optional(),
  pasivaLancar: z.number().nonnegative().optional(),
  // PERTANIAN
  hasilPanenKg: z.number().nonnegative().optional(),
  sistemIrigasi: z.enum(['IRIGASI', 'TADAH_HUJAN']).optional(),
  // FIDYAH / KAFARAT
  jumlahHari: z.number().int().positive().optional(),
  hargaBerasPerKg: z.number().positive().optional(),
  // Diterima untuk simulasi/preview client, hasil FINAL tetap pakai harga sistem
  goldPricePerGram: z.number().positive().optional(),
});

async function resolveFitrahConfig(jenisBeras?: string) {
  return prisma.zakatFitrahConfig.findFirst({
    where: jenisBeras ? { jenisBeras, isActive: true } : { isActive: true },
    orderBy: { updatedAt: 'desc' },
  });
}

/**
 * POST /api/zakat/calculate — kalkulator zakat (preview, belum bayar).
 * Harga acuan sistem: emas dari ZakatGoldPriceHistory, beras dari ZakatFitrahConfig.
 * Menyimpan hasil ke ZakatCalculation.
 */
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = calculateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { jenisZakat } = parsed.data;

    let goldPrice: Prisma.Decimal | undefined;
    let fitrahPricePerJiwa: Prisma.Decimal | undefined;
    let hargaBerasPerKg: Prisma.Decimal | undefined;

    if (GOLD_BASED_TYPES.has(jenisZakat)) {
      try {
        const active = await getActiveGoldPrice();
        goldPrice = active.pricePerGram;
      } catch (error) {
        if (error instanceof GoldPriceUnavailableError) {
          return NextResponse.json({ error: error.message }, { status: 503 });
        }
        throw error;
      }
    }

    if (jenisZakat === 'FITRAH') {
      const config = await resolveFitrahConfig(parsed.data.jenisBeras);
      if (!config) {
        return NextResponse.json(
          { error: 'Konfigurasi zakat fitrah untuk varian beras tersebut belum tersedia' },
          { status: 400 }
        );
      }
      fitrahPricePerJiwa = config.konversiHargaPerJiwa;
    }

    if (BERAS_BASED_DAY_TYPES.has(jenisZakat)) {
      // default harga per kg dari config fitrah aktif (per jiwa = 2.5 kg beras)
      hargaBerasPerKg = parsed.data.hargaBerasPerKg
        ? new Prisma.Decimal(parsed.data.hargaBerasPerKg)
        : undefined;
      if (!hargaBerasPerKg) {
        const config = await resolveFitrahConfig();
        if (config) {
          hargaBerasPerKg = config.konversiHargaPerJiwa.dividedBy(BERAS_PER_JIWA_KG);
        }
      }
      if (!hargaBerasPerKg) {
        return NextResponse.json(
          { error: 'Konfigurasi zakat fitrah belum tersedia, hubungi Admin untuk mengisi harga beras' },
          { status: 400 }
        );
      }
    }

    const input: ZakatCalculationInput = {
      jenisZakat,
      jumlahJiwa: parsed.data.jumlahJiwa,
      penghasilanPerBulan: parsed.data.penghasilanPerBulan,
      penghasilanLain: parsed.data.penghasilanLain,
      beratEmasGram: parsed.data.beratEmasGram,
      aktivaLancar: parsed.data.aktivaLancar,
      pasivaLancar: parsed.data.pasivaLancar,
      hasilPanenKg: parsed.data.hasilPanenKg,
      sistemIrigasi: parsed.data.sistemIrigasi,
      jumlahHari: parsed.data.jumlahHari,
      hargaBerasPerKg: parsed.data.hargaBerasPerKg,
    };

    const result = calculateZakat(input, { goldPricePerGram: goldPrice, fitrahPricePerJiwa, hargaBerasPerKg });

    const calc = await prisma.zakatCalculation.create({
      data: {
        wakifId: userId,
        jenisZakat,
        inputSnapshot: parsed.data as unknown as Prisma.InputJsonValue,
        nisabDigunakan: result.nisabDigunakan,
        hasilKewajiban: result.hasilKewajiban,
      },
    });

    return NextResponse.json(
      {
        message: 'Kalkulasi zakat berhasil',
        data: {
          id: calc.id,
          jenisZakat,
          mencapaiNisab: result.mencapaiNisab,
          nisabDigunakan: result.nisabDigunakan?.toString() ?? null,
          hasilKewajiban: result.hasilKewajiban.toString(),
          hargaAcuan: {
            goldPricePerGram: goldPrice?.toString(),
            fitrahPricePerJiwa: fitrahPricePerJiwa?.toString(),
            hargaBerasPerKg: hargaBerasPerKg?.toString(),
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Calculate zakat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
