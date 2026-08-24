import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Prisma, ZakatType, ZakatOrderStatus } from '@/app/generated/prisma/client';
import { incrementFundPool } from '@/lib/fund-pool';
import { BERAS_PER_JIWA_KG } from '@/lib/zakat.service';

const ALLOWED_ROLES = ['ADMIN', 'PETUGAS_LAPANGAN'];

const offlineOrderSchema = z
  .object({
    jenisZakat: z.nativeEnum(ZakatType),
    namaMuzakki: z.string().min(2, 'Nama muzakki wajib diisi'),
    teleponMuzakki: z.string().optional(),
    isAnonymous: z.boolean().default(false),
    bentukZakat: z.enum(['UANG', 'BERAS']),
    // UANG
    nominalRp: z.number().positive().optional(),
    // BERAS
    jumlahBerasKg: z.number().positive().optional(),
    konversiHargaPerKg: z.number().positive().optional(),
    jenisBeras: z.string().optional(),
    tahunHijriah: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.bentukZakat === 'UANG' && !data.nominalRp) {
      ctx.addIssue({ code: 'custom', path: ['nominalRp'], message: 'Nominal Rp wajib diisi untuk zakat bentuk UANG' });
    }
    if (data.bentukZakat === 'BERAS' && !data.jumlahBerasKg) {
      ctx.addIssue({ code: 'custom', path: ['jumlahBerasKg'], message: 'Jumlah beras (kg) wajib diisi untuk zakat bentuk BERAS' });
    }
  });

function generateNomorKwitansi(seq: number): string {
  const year = new Date().getFullYear();
  return `ZKT-OFF-${year}-${String(seq).padStart(4, '0')}`;
}

/**
 * POST /api/admin/zakat/orders — entri zakat offline (ADMIN/PETUGAS_LAPANGAN).
 * UANG → nominal. BERAS → berat kg + konversi harga (dari ZakatFitrahConfig).
 * Langsung berstatus TERVERIFIKASI dan saldo FundPool ter-increment atomically.
 */
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');
    if (!userId || !userRole) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!ALLOWED_ROLES.includes(userRole)) {
      return NextResponse.json({ error: 'Akses ditolak. Peran ADMIN atau PETUGAS_LAPANGAN diperlukan.' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = offlineOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { jenisZakat, namaMuzakki, teleponMuzakki, isAnonymous, bentukZakat, nominalRp, jumlahBerasKg, konversiHargaPerKg, jenisBeras, tahunHijriah, notes } = parsed.data;

    let nominal: Prisma.Decimal;
    let beratBerasKg: Prisma.Decimal | null = null;
    let metodePembayaran: 'TUNAI' | 'BERAS';

    if (bentukZakat === 'UANG') {
      nominal = new Prisma.Decimal(nominalRp!);
      metodePembayaran = 'TUNAI';
    } else {
      let hargaPerKg = konversiHargaPerKg ? new Prisma.Decimal(konversiHargaPerKg) : null;
      if (!hargaPerKg) {
        // Konversi harga diambil dari ZakatFitrahConfig aktif (bukan input bebas client)
        const config = await prisma.zakatFitrahConfig.findFirst({
          where: jenisBeras ? { jenisBeras, isActive: true } : { isActive: true },
          orderBy: { updatedAt: 'desc' },
        });
        if (config) {
          hargaPerKg = config.konversiHargaPerJiwa.dividedBy(BERAS_PER_JIWA_KG);
        }
      }
      if (!hargaPerKg) {
        return NextResponse.json(
          { error: 'Konfigurasi zakat fitrah belum tersedia. Kirim konversiHargaPerKg atau hubungi Admin.' },
          { status: 400 }
        );
      }
      beratBerasKg = new Prisma.Decimal(jumlahBerasKg!);
      nominal = beratBerasKg.times(hargaPerKg).toDecimalPlaces(2);
      metodePembayaran = 'BERAS';
    }

    // Nomor kwitansi berurutan per tahun: ZKT-OFF-YYYY-XXXX
    const year = new Date().getFullYear();
    const prefix = `ZKT-OFF-${year}-`;
    const seq = (await prisma.zakatOrder.count({ where: { nomorKwitansi: { startsWith: prefix } } })) + 1;

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const order = await tx.zakatOrder.create({
        data: {
          nomorKwitansi: generateNomorKwitansi(seq),
          tahunHijriah,
          jenisZakat,
          metodePembayaran,
          namaMuzakki,
          noTelepon: teleponMuzakki,
          isAnonymous,
          nominal,
          beratBerasKg,
          jumlahJiwa: bentukZakat === 'BERAS' && beratBerasKg ? Math.floor(Number(beratBerasKg.dividedBy(BERAS_PER_JIWA_KG))) : null,
          status: ZakatOrderStatus.TERVERIFIKASI,
          notes,
          enteredByAmilId: userId,
        },
        select: {
          id: true,
          nomorKwitansi: true,
          jenisZakat: true,
          nominal: true,
          beratBerasKg: true,
          isAnonymous: true,
          status: true,
          createdAt: true,
        },
      });

      await incrementFundPool(tx, jenisZakat, nominal);

      return order;
    });

    return NextResponse.json(
      { message: 'Zakat order offline berhasil dicatat dan terverifikasi', data: result },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create offline zakat order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
