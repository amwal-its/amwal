import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { Prisma } from '@/app/generated/prisma/client';
import { z } from 'zod';

const fitrahConfigSchema = z.object({
  jenisBeras: z.string().min(2, 'Jenis beras wajib diisi'),
  konversiHargaPerJiwa: z.number().positive('Konversi harga per jiwa wajib lebih dari 0'),
  referensiSk: z.string().optional(),
  tahunBerlaku: z.string().optional(),
});

/**
 * POST /api/admin/zakat-fitrah-config (ADMIN)
 * Tambah/update varian beras. Config lama untuk jenisBeras yang sama di-set
 * isActive=false (histori, tidak dihapus).
 */
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = fitrahConfigSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { jenisBeras, konversiHargaPerJiwa, referensiSk, tahunBerlaku } = parsed.data;

    const config = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.zakatFitrahConfig.updateMany({
        where: { jenisBeras, isActive: true },
        data: { isActive: false },
      });
      return tx.zakatFitrahConfig.create({
        data: { jenisBeras, konversiHargaPerJiwa, referensiSk, tahunBerlaku },
      });
    });

    return NextResponse.json(
      { message: 'Konfigurasi zakat fitrah tersimpan', data: config },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create zakat fitrah config error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
