import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { z } from 'zod';

const goldPriceSchema = z.object({
  pricePerGram: z.number().positive('Harga per gram wajib lebih dari 0'),
});

/**
 * PATCH /api/admin/zakat/gold-price (ADMIN)
 * Override manual sebagai fallback saat API eksternal mati lama.
 * Insert row `MANUAL_FALLBACK` -> menjadi cache/harga aktif berikutnya.
 */
export async function PATCH(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = goldPriceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const row = await prisma.zakatGoldPriceHistory.create({
      data: { pricePerGram: parsed.data.pricePerGram, source: 'MANUAL_FALLBACK' },
    });

    return NextResponse.json(
      {
        message: 'Harga emas manual tersimpan',
        data: { pricePerGram: row.pricePerGram.toString(), source: row.source, fetchedAt: row.fetchedAt.toISOString() },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Patch gold price error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
