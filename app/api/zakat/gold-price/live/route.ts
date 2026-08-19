import { NextRequest, NextResponse } from 'next/server';
import {
  getActiveGoldPrice,
  GoldPriceUnavailableError,
} from '../../../../../lib/gold-price.service';

/**
 * GET /api/zakat/gold-price/live
 * Authenticated (dipanggil internal oleh kalkulator).
 * Cache 6 jam: jika row terbaru < 6 jam langsung return, hemat rate-limit.
 * Jika fetch live gagal: return cache terakhir dengan { isStale: true }.
 * Jika tidak ada cache sama sekali & fetch gagal: 503.
 */
export async function GET(_req: NextRequest) {
  try {
    const price = await getActiveGoldPrice();
    return NextResponse.json(
      {
        message: 'Sukses',
        data: {
          pricePerGram: price.pricePerGram.toString(),
          isStale: price.isStale,
          fetchedAt: price.fetchedAt.toISOString(),
          source: price.source,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof GoldPriceUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error('Get live gold price error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
