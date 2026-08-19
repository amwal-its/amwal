import { prisma } from './prisma';
import { Prisma } from '../app/generated/prisma/client';

// Provider eksternal (bisa diganti via env tanpa ubah kode):
// gold-api.com: { price: <USD/troy-ounce>, symbol: 'XAU' } — tanpa API key
// open.er-api.com: { rates: { IDR: ... } } — kurs USD-IDR tanpa API key
const GOLD_PRICE_API_URL = process.env.GOLD_PRICE_API_URL || 'https://api.gold-api.com/price/XAU';
const USD_RATE_API_URL = process.env.USD_RATE_API_URL || 'https://open.er-api.com/v6/latest/USD';

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 jam
const GRAM_PER_TROY_OUNCE = 31.1035;
const FETCH_TIMEOUT_MS = 10_000;

export class GoldPriceUnavailableError extends Error {}

export interface ActiveGoldPrice {
  pricePerGram: Prisma.Decimal;
  isStale: boolean;
  fetchedAt: Date;
  source: 'LIVE_API' | 'MANUAL_FALLBACK';
}

async function fetchJson(url: string): Promise<Record<string, unknown>> {
  const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!res.ok) {
    throw new Error(`Gold price API respond ${res.status}`);
  }
  return res.json();
}

/** Ambil harga emas live lalu konversi ke IDR/gram: (USD/troy-oz / 31.1035) * kurs USD-IDR */
export async function fetchLiveGoldPricePerGram(): Promise<Prisma.Decimal> {
  const gold = await fetchJson(GOLD_PRICE_API_URL);
  const usdPerTroyOz = Number(gold.price);
  if (!Number.isFinite(usdPerTroyOz) || usdPerTroyOz <= 0) {
    throw new Error('Payload harga emas tidak valid');
  }

  const fx = await fetchJson(USD_RATE_API_URL);
  const idrPerUsd = Number((fx.rates as Record<string, unknown> | undefined)?.IDR);
  if (!Number.isFinite(idrPerUsd) || idrPerUsd <= 0) {
    throw new Error('Payload kurs USD-IDR tidak valid');
  }

  return new Prisma.Decimal(usdPerTroyOz).dividedBy(GRAM_PER_TROY_OUNCE).times(idrPerUsd);
}

/**
 * Harga emas aktif:
 * 1. cache < 6 jam  -> return langsung (hemat rate-limit)
 * 2. cache basi     -> fetch live; sukses simpan row baru; gagal return cache basi { isStale: true }
 * 3. tanpa cache    -> fetch live; gagal throw GoldPriceUnavailableError (route -> 503)
 */
export async function getActiveGoldPrice(): Promise<ActiveGoldPrice> {
  const latest = await prisma.zakatGoldPriceHistory.findFirst({
    orderBy: { fetchedAt: 'desc' },
  });

  const isFresh = latest !== null && Date.now() - latest.fetchedAt.getTime() < CACHE_TTL_MS;
  if (latest && isFresh) {
    return {
      pricePerGram: latest.pricePerGram,
      isStale: false,
      fetchedAt: latest.fetchedAt,
      source: latest.source,
    };
  }

  try {
    const pricePerGram = (await fetchLiveGoldPricePerGram()).toDecimalPlaces(2);
    const row = await prisma.zakatGoldPriceHistory.create({
      data: { pricePerGram, source: 'LIVE_API' },
    });
    return { pricePerGram: row.pricePerGram, isStale: false, fetchedAt: row.fetchedAt, source: 'LIVE_API' };
  } catch {
    if (latest) {
      return { pricePerGram: latest.pricePerGram, isStale: true, fetchedAt: latest.fetchedAt, source: latest.source };
    }
    throw new GoldPriceUnavailableError('Harga emas belum tersedia, hubungi Admin untuk input manual');
  }
}
