import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import crypto from 'crypto';
import { z } from 'zod';
import { ZakatType, ZakatPaymentMethod } from '../../../../app/generated/prisma/enums';

const createOrderSchema = z
  .object({
    tahunHijriah: z.string().optional(),
    jenisZakat: z.nativeEnum(ZakatType),
    metodePembayaran: z.nativeEnum(ZakatPaymentMethod),
    namaMuzakki: z.string().min(2, 'Nama muzakki wajib diisi'),
    namaDizakatkan: z.string().optional(),
    noTelepon: z.string().optional(),
    alamat: z.string().optional(),
    nominal: z.number().positive().optional(),
    beratBerasKg: z.number().positive().optional(),
    jumlahJiwa: z.number().int().positive().optional(),
    buktiTransferUrl: z.string().url('Bukti transfer harus berupa URL valid').optional(),
    // "Hamba Allah" — hanya soal tampilan publik, namaMuzakki tetap wajib diisi untuk audit
    isAnonymous: z.boolean().default(false),
  })
  .refine((data) => {
    if (data.metodePembayaran === 'BERAS') return !!data.beratBerasKg;
    return !!data.nominal;
  }, {
    message: 'Nominal wajib diisi untuk metode selain BERAS (untuk BERAS wajib beratBerasKg)',
    path: ['nominal'],
  });

function generateNomorKwitansi(): string {
  return `ZKT-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

/**
 * POST /api/zakat/orders — pembuatan ZakatOrder (flow digital/offline hybrid).
 * Role WAKIF: muzakki = user login. Role ADMIN/PETUGAS_LAPANGAN: entri offline, enteredByAmilId = user login.
 */
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');
    if (!userId || !userRole) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const isWakif = userRole === 'WAKIF';
    const order = await prisma.zakatOrder.create({
      data: {
        nomorKwitansi: generateNomorKwitansi(),
        tahunHijriah: parsed.data.tahunHijriah,
        jenisZakat: parsed.data.jenisZakat,
        metodePembayaran: parsed.data.metodePembayaran,
        namaMuzakki: parsed.data.namaMuzakki,
        namaDizakatkan: parsed.data.namaDizakatkan,
        noTelepon: parsed.data.noTelepon,
        alamat: parsed.data.alamat,
        isAnonymous: parsed.data.isAnonymous,
        nominal: parsed.data.nominal,
        beratBerasKg: parsed.data.beratBerasKg,
        jumlahJiwa: parsed.data.jumlahJiwa,
        buktiTransferUrl: parsed.data.buktiTransferUrl,
        muzakkiId: isWakif ? userId : null,
        enteredByAmilId: isWakif ? null : userId,
      },
      select: {
        id: true,
        nomorKwitansi: true,
        isAnonymous: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: 'Zakat order berhasil dibuat', data: order },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create zakat order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
