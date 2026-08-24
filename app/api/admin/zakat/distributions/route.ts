import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Prisma, ZakatType, ZakatDistributionStatus } from '@/app/generated/prisma/client';
import { fundPoolKodeByZakat } from '@/lib/fund-pool';
import { BERAS_PER_JIWA_KG } from '@/lib/zakat.service';

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
      select: { id: true, kategoriAsnaf: true },
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
      const result = await prisma.$transaction(async (tx) => {
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
          select: {
            id: true,
            mustahiqId: true,
            jenisZakat: true,
            nominal: true,
            beratBerasKg: true,
            status: true,
            createdAt: true,
          },
        });
      });

      return NextResponse.json(
        { message: 'Distribusi zakat berhasil dicatat', data: result },
        { status: 201 }
      );
    } catch (error) {
      if (error instanceof Error && error.message === 'Saldo pool tidak mencukupi') {
        return NextResponse.json({ error: 'Saldo pool tidak mencukupi' }, { status: 400 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Create zakat distribution error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
