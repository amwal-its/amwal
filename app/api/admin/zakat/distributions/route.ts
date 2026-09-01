import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Prisma, ZakatType, ZakatDistributionStatus } from '@/app/generated/prisma/client';
import { fundPoolKodeByZakat } from '@/lib/fund-pool';
import { BERAS_PER_JIWA_KG } from '@/lib/zakat.service';

const ALLOWED_ROLES = ['ADMIN', 'PETUGAS_LAPANGAN'];

const distributionSchema = z
  .object({
    mustahiqId: z.string().uuid('mustahiqId tidak valid'),
    jenisZakat: z.nativeEnum(ZakatType, { message: 'Jenis zakat tidak valid' }),
    bentukBantuan: z.enum(['UANG', 'BERAS'], { message: 'Bentuk bantuan harus UANG atau BERAS' }),
    // UANG
    nominalRp: z.number().positive().optional(),
    // BERAS
    jumlahBerasKg: z.number().positive().optional(),
    konversiHargaPerKg: z.number().positive().optional(),
    jenisBeras: z.string().optional(),
    buktiFotoUrl: z.string().url('URL bukti tidak valid').optional().or(z.literal('')),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.bentukBantuan === 'UANG' && !data.nominalRp) {
      ctx.addIssue({ code: 'custom', path: ['nominalRp'], message: 'Nominal Rp wajib diisi untuk bentuk bantuan UANG' });
    }
    if (data.bentukBantuan === 'BERAS' && !data.jumlahBerasKg) {
      ctx.addIssue({ code: 'custom', path: ['jumlahBerasKg'], message: 'Jumlah beras (kg) wajib diisi untuk bentuk bantuan BERAS' });
    }
  });

/**
 * GET /api/admin/zakat/distributions — List distribution logs
 */
export async function GET(req: NextRequest) {
  try {
    const userRole = req.headers.get('x-user-role');
    if (!userRole) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!ALLOWED_ROLES.includes(userRole)) {
      return NextResponse.json({ error: 'Akses ditolak. Peran ADMIN atau PETUGAS_LAPANGAN diperlukan.' }, { status: 403 });
    }

    const { searchParams } = req.nextUrl;
    const mustahiqId = searchParams.get('mustahiqId')?.trim();
    const jenisZakat = searchParams.get('jenisZakat')?.trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
    const skip = (page - 1) * limit;

    const whereClause: Prisma.ZakatDistributionWhereInput = {};

    if (mustahiqId) {
      whereClause.mustahiqId = mustahiqId;
    }
    if (jenisZakat && Object.values(ZakatType).includes(jenisZakat as ZakatType)) {
      whereClause.jenisZakat = jenisZakat as ZakatType;
    }

    const [distributions, totalCount, stats] = await Promise.all([
      prisma.zakatDistribution.findMany({
        where: whereClause,
        include: {
          mustahiq: {
            select: {
              id: true,
              namaMustahiq: true,
              kategoriAsnaf: true,
              alamat: true,
              statusVerifikasi: true,
            },
          },
          distributedByAmil: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.zakatDistribution.count({ where: whereClause }),
      prisma.zakatDistribution.aggregate({
        where: whereClause,
        _sum: {
          nominal: true,
          beratBerasKg: true,
        },
      }),
    ]);

    return NextResponse.json({
      message: 'Berhasil mengambil data distribusi zakat',
      data: distributions,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
      summary: {
        totalNominalDisalurkan: Number(stats._sum.nominal || 0),
        totalBerasKgDisalurkan: Number(stats._sum.beratBerasKg || 0),
      },
    });
  } catch (error) {
    console.error('List zakat distribution error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/zakat/distributions — Salurkan zakat ke mustahik (ADMIN only)
 */
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');
    if (!userId || !userRole) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses ditolak. Peran ADMIN diperlukan.' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = distributionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { mustahiqId, jenisZakat, bentukBantuan, nominalRp, jumlahBerasKg, konversiHargaPerKg, jenisBeras, buktiFotoUrl, notes } = parsed.data;

    const mustahiq = await prisma.mustahiqProfile.findUnique({
      where: { id: mustahiqId },
      select: { id: true, kategoriAsnaf: true, namaMustahiq: true },
    });
    if (!mustahiq) {
      return NextResponse.json({ error: 'Mustahik tidak ditemukan' }, { status: 404 });
    }

    let nominal: Prisma.Decimal;
    let beratBerasKg: Prisma.Decimal | null = null;

    if (bentukBantuan === 'UANG') {
      nominal = new Prisma.Decimal(nominalRp!);
    } else {
      let hargaPerKg = konversiHargaPerKg ? new Prisma.Decimal(konversiHargaPerKg) : null;
      if (!hargaPerKg) {
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
    }

    const poolKode = fundPoolKodeByZakat(jenisZakat);

    try {
      const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Ensure pool row exists first
        await tx.fundPool.upsert({
          where: { kode: poolKode },
          create: {
            kode: poolKode,
            nama: poolKode === 'ZAKAT_FITRAH' ? 'Pool Zakat Fitrah' : 'Pool Zakat Maal',
            balance: new Prisma.Decimal(0),
            totalDistributed: new Prisma.Decimal(0),
          },
          update: {},
        });

        // Guard atomik: update hanya jika saldo >= nominal. count===0 → saldo kurang.
        const updated = await tx.fundPool.updateMany({
          where: { kode: poolKode, balance: { gte: nominal } },
          data: {
            balance: { decrement: nominal },
            totalDistributed: { increment: nominal },
          },
        });

        if (updated.count === 0) {
          throw new Error('Saldo pool tidak mencukupi');
        }

        return tx.zakatDistribution.create({
          data: {
            mustahiqId,
            jenisZakat,
            nominal,
            beratBerasKg,
            buktiPenerimaanUrl: buktiFotoUrl || null,
            status: ZakatDistributionStatus.TERSALURKAN,
            notes,
            distributedByAmilId: userId,
          },
          include: {
            mustahiq: {
              select: {
                id: true,
                namaMustahiq: true,
                kategoriAsnaf: true,
              },
            },
          },
        });
      });

      return NextResponse.json(
        { message: `Zakat berhasil disalurkan kepada ${mustahiq.namaMustahiq}`, data: result },
        { status: 201 }
      );
    } catch (error) {
      if (error instanceof Error && error.message === 'Saldo pool tidak mencukupi') {
        return NextResponse.json({ error: 'Saldo pool tidak mencukupi untuk penyaluran ini' }, { status: 400 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Create zakat distribution error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
