import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { z } from 'zod';
import { BentukWakaf, MetodeBayar, WaqfOrderStatus, Prisma } from '@/app/generated/prisma/client';

const createOfflineWaqfOrderSchema = z.object({
  waqfProgramId: z.string().min(1, 'waqfProgramId wajib diisi'),
  namaWakif: z.string().min(1, 'Nama wakif wajib diisi'),
  teleponWakif: z.string().optional(),
  noTelepon: z.string().optional(),
  alamat: z.string().optional(),
  atasNamaWakif: z.string().optional(),
  isAnonymous: z.boolean().optional().default(false),
  bentukWakafEnum: z.enum(['UANG', 'BARANG']).optional(),
  bentukWakaf: z.enum(['UANG', 'BARANG']).optional(),
  nominal: z.number().optional(),
  deskripsiBarang: z.string().optional(),
  namaBarang: z.string().optional(),
  jumlahSatuan: z.number().int().optional(),
  estimasiNilaiBarang: z.number().optional(),
  nilaiTaksiranRupiah: z.number().optional(),
  nomorAIW: z.string().optional(),
  nomorIkrarWakaf: z.string().optional(),
  dokumenAiwUrl: z.string().optional(),
  metodePembayaran: z.enum(['TUNAI', 'TRANSFER_MANUAL', 'TRANSFER', 'QRIS', 'VA']),
});

async function generateNomorKwitansi(tx: Prisma.TransactionClient) {
  const year = new Date().getFullYear();
  const prefix = `WKF-OFF-${year}-`;

  const lastOrder = await tx.waqfOrder.findFirst({
    where: {
      nomorKwitansi: {
        startsWith: prefix,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      nomorKwitansi: true,
    },
  });

  let nextSeq = 1;
  if (lastOrder && lastOrder.nomorKwitansi) {
    const parts = lastOrder.nomorKwitansi.split('-');
    const lastNumStr = parts[parts.length - 1];
    const lastNum = parseInt(lastNumStr, 10);
    if (!isNaN(lastNum)) {
      nextSeq = lastNum + 1;
    }
  }

  const seqFormatted = String(nextSeq).padStart(4, '0');
  return `${prefix}${seqFormatted}`;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Auth & Guard Check (ADMIN atau PETUGAS_LAPANGAN / Amil)
    const headerUserId = req.headers.get('x-user-id');
    const headerUserRole = req.headers.get('x-user-role');

    let userId = headerUserId;
    let userRole = headerUserRole;

    if (!userId || !userRole) {
      const session = await getSession();
      if (session) {
        userId = session.userId;
        userRole = session.role;
      }
    }

    if (!userId || !userRole || (userRole !== 'ADMIN' && userRole !== 'PETUGAS_LAPANGAN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse & Validasi Input
    const body = await req.json();
    const parsed = createOfflineWaqfOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const bentuk = data.bentukWakafEnum || data.bentukWakaf;
    if (!bentuk) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: {
            bentukWakafEnum: { _errors: ['bentukWakafEnum wajib diisi (\'UANG\' atau \'BARANG\')'] },
          },
        },
        { status: 400 }
      );
    }

    const namaWakif = data.namaWakif.trim();
    if (!namaWakif) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: { namaWakif: { _errors: ['Nama wakif wajib diisi'] } },
        },
        { status: 400 }
      );
    }

    const noTelepon = data.teleponWakif || data.noTelepon || null;
    const namaBarang = data.deskripsiBarang || data.namaBarang || null;
    const nilaiTaksiran = data.estimasiNilaiBarang ?? data.nilaiTaksiranRupiah ?? null;
    const nomorAIW = data.nomorAIW || data.nomorIkrarWakaf || null;

    // Rule Validasi Khusus berdasarkan Bentuk Wakaf
    if (bentuk === 'BARANG') {
      if (!namaBarang || nilaiTaksiran === null || nilaiTaksiran === undefined || !nomorAIW) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: {
              barang: {
                _errors: [
                  'Untuk wakaf BARANG, deskripsiBarang, estimasiNilaiBarang, dan nomorAIW (Akta Ikrar Wakaf BWI) wajib diisi',
                ],
              },
            },
          },
          { status: 400 }
        );
      }
    } else if (bentuk === 'UANG') {
      if (!data.nominal || data.nominal <= 0) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: {
              nominal: {
                _errors: ['Nominal wajib diisi dan bernilai positif untuk wakaf UANG'],
              },
            },
          },
          { status: 400 }
        );
      }
    }

    // 3. Cek Keberadaan WaqfProgram
    const program = await prisma.waqfProgram.findUnique({
      where: { id: data.waqfProgramId },
    });

    if (!program) {
      return NextResponse.json(
        { error: 'Program wakaf tidak ditemukan' },
        { status: 404 }
      );
    }

    // 4. Penentuan Status & Pemetaan Enum Pembayaran
    let metodeEnum: MetodeBayar = MetodeBayar.TUNAI;
    if (data.metodePembayaran === 'TRANSFER_MANUAL' || data.metodePembayaran === 'TRANSFER') {
      metodeEnum = MetodeBayar.TRANSFER;
    } else if (data.metodePembayaran === 'QRIS') {
      metodeEnum = MetodeBayar.QRIS;
    } else if (data.metodePembayaran === 'VA') {
      metodeEnum = MetodeBayar.VA;
    }

    const orderStatus: WaqfOrderStatus =
      data.metodePembayaran === 'TUNAI'
        ? WaqfOrderStatus.TERVERIFIKASI
        : WaqfOrderStatus.MENUNGGU_VERIFIKASI;

    // 5. Eksekusi Pembuatan Order & Update Ledger dalam $transaction
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const nomorKwitansi = await generateNomorKwitansi(tx);

      const order = await tx.waqfOrder.create({
        data: {
          nomorKwitansi,
          waqfProgramId: data.waqfProgramId,
          namaWakif: namaWakif, // Tetap disimpan di DB untuk pencatatan administratif meskipun isAnonymous = true
          noTelepon,
          alamat: data.alamat || null,
          atasNamaWakif: data.atasNamaWakif || null,
          isAnonymous: data.isAnonymous ?? false,
          bentukWakaf: bentuk as BentukWakaf,
          nominal: bentuk === 'UANG' ? data.nominal : null,
          namaBarang: bentuk === 'BARANG' ? namaBarang : null,
          jumlahSatuan: data.jumlahSatuan || 1,
          nilaiTaksiranRupiah: bentuk === 'BARANG' ? nilaiTaksiran : null,
          metodePembayaran: metodeEnum,
          status: orderStatus,
          enteredByAmilId: userId,
          nomorIkrarWakaf: bentuk === 'BARANG' ? nomorAIW : null,
          dokumenAiwUrl: data.dokumenAiwUrl || null,
        },
      });

      // Jika status langsung TERVERIFIKASI (misal TUNAI), update WaqfPrincipalLedger
      if (orderStatus === WaqfOrderStatus.TERVERIFIKASI) {
        const amountToAdd = bentuk === 'UANG' ? data.nominal || 0 : nilaiTaksiran || 0;

        await tx.waqfPrincipalLedger.upsert({
          where: { waqfProgramId: data.waqfProgramId },
          create: {
            waqfProgramId: data.waqfProgramId,
            pokokDanaTerkumpul: amountToAdd,
            hasilInvestasiTersalurkan: 0,
          },
          update: {
            pokokDanaTerkumpul: { increment: amountToAdd },
          },
        });
      }

      return order;
    });

    return NextResponse.json(
      {
        message: 'Order wakaf offline berhasil dibuat',
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error POST /api/admin/wakaf/orders:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}
