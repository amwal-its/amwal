import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { z } from 'zod';
import { BentukWakaf, MetodeBayar, WaqfOrderStatus, TransactionType, TransactionPaymentStatus, Prisma } from '@/app/generated/prisma/client';

const createWaqfDonationSchema = z.object({
  waqfProgramId: z.string().min(1, 'ID Program Wakaf wajib diisi'),
  nominal: z.number().positive('Nominal wakaf harus lebih besar dari 0'),
  namaWakif: z.string().min(1, 'Nama wakif wajib diisi'),
  noTelepon: z.string().optional(),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  isAnonymous: z.boolean().optional().default(false),
  pesanDoa: z.string().optional(),
  metodePembayaran: z.enum(['QRIS', 'TRANSFER', 'VA', 'TUNAI']).default('QRIS'),
});

async function generateKwitansiNumber(tx: Prisma.TransactionClient) {
  const year = new Date().getFullYear();
  const prefix = `AMW-${year}-`;

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
    const body = await req.json();
    const parsed = createWaqfDonationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validasi form gagal', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      waqfProgramId,
      nominal,
      namaWakif,
      noTelepon,
      email,
      isAnonymous,
      pesanDoa,
      metodePembayaran,
    } = parsed.data;

    // Check program existence
    const program = await prisma.waqfProgram.findUnique({
      where: { id: waqfProgramId },
      include: {
        principalLedger: true,
        nadzirProfile: true,
      },
    });

    if (!program) {
      return NextResponse.json(
        { error: 'Program wakaf tidak ditemukan' },
        { status: 404 }
      );
    }

    const session = await getSession();
    const sessionUserId = session?.userId || null;

    // Execute creation in atomic transaction
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const nomorKwitansi = await generateKwitansiNumber(tx);

      // Resolve wakifId for Transaction foreign key
      let effectiveWakifId = sessionUserId;
      if (!effectiveWakifId) {
        let existingUser = null;
        const cleanEmail = email && email.trim() !== '' ? email.trim() : null;
        const cleanPhone = noTelepon && noTelepon.trim() !== '' ? noTelepon.trim() : null;

        // 1. Check if user already exists by email
        if (cleanEmail) {
          existingUser = await tx.user.findUnique({ where: { email: cleanEmail } });
        }

        // 2. If not found by email, check if user exists by phone
        if (!existingUser && cleanPhone) {
          existingUser = await tx.user.findUnique({ where: { phone: cleanPhone } });
        }

        if (existingUser) {
          effectiveWakifId = existingUser.id;
        } else {
          // 3. Create or upsert a new guest user safely
          const fallbackEmail =
            cleanEmail ||
            (cleanPhone
              ? `guest-${cleanPhone.replace(/\D/g, '')}@amwal.id`
              : `guest-${Date.now()}-${Math.floor(Math.random() * 10000)}@amwal.id`);

          // Check if the phone is already taken by another user
          let phoneToAssign = cleanPhone;
          if (phoneToAssign) {
            const phoneOwner = await tx.user.findUnique({ where: { phone: phoneToAssign } });
            if (phoneOwner) {
              phoneToAssign = null; // Avoid duplicate phone unique constraint crash
            }
          }

          const guestUser = await tx.user.upsert({
            where: { email: fallbackEmail },
            update: {
              name: isAnonymous ? 'Hamba Allah' : namaWakif,
              ...(phoneToAssign ? { phone: phoneToAssign } : {}),
            },
            create: {
              name: isAnonymous ? 'Hamba Allah' : namaWakif,
              email: fallbackEmail,
              phone: phoneToAssign,
              role: 'WAKIF',
            },
          });
          effectiveWakifId = guestUser.id;
        }
      }

      // 1. Create Transaction Ledger Entry
      const transaction = await tx.transaction.create({
        data: {
          wakifId: effectiveWakifId,
          jenisTransaksi: TransactionType.WAKAF,
          amount: new Prisma.Decimal(nominal),
          paymentMethod: metodePembayaran,
          statusPembayaran: TransactionPaymentStatus.PENDING,
          disbursementDestination: program.nadzirProfile?.namaLembaga || 'Badan Pengelola Wakaf',
          paymentGatewayRef: `PG-WKF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        },
      });

      // 2. Create Waqf Order
      const displayNama = isAnonymous ? 'Hamba Allah' : namaWakif;
      const order = await tx.waqfOrder.create({
        data: {
          nomorKwitansi,
          waqfProgramId,
          wakifId: effectiveWakifId,
          namaWakif: displayNama,
          noTelepon: noTelepon || null,
          alamat: email || null,
          atasNamaWakif: displayNama,
          isAnonymous,
          bentukWakaf: BentukWakaf.UANG,
          nominal: new Prisma.Decimal(nominal),
          metodePembayaran: metodePembayaran as MetodeBayar,
          status: WaqfOrderStatus.MENUNGGU_VERIFIKASI,
          transactionId: transaction.id,
        },
      });

      return { order, transaction };
    });

    return NextResponse.json(
      {
        message: 'Order donasi wakaf berhasil dibuat',
        data: {
          orderId: result.order.id,
          nomorKwitansi: result.order.nomorKwitansi,
          nominal,
          status: result.order.status,
          transactionId: result.transaction.id,
          programTitle: program.judul,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating waqf donation order:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
