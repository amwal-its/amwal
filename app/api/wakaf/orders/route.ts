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

export const SYSTEM_ANONYMOUS_USER_ID = '00000000-0000-0000-0000-000000000001';
export const SYSTEM_ANONYMOUS_EMAIL = 'hamba.allah@amwal.internal';

async function ensureSystemAnonymousUser(tx: Prisma.TransactionClient): Promise<string> {
  const existing = await tx.user.findUnique({
    where: { id: SYSTEM_ANONYMOUS_USER_ID },
  });
  if (existing) {
    return existing.id;
  }

  const user = await tx.user.upsert({
    where: { id: SYSTEM_ANONYMOUS_USER_ID },
    update: {},
    create: {
      id: SYSTEM_ANONYMOUS_USER_ID,
      name: 'Hamba Allah (Sistem)',
      email: SYSTEM_ANONYMOUS_EMAIL,
      role: 'WAKIF',
    },
  });
  return user.id;
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
        const cleanEmail = email && email.trim() !== '' ? email.trim() : null;
        const cleanPhone = noTelepon && noTelepon.trim() !== '' ? noTelepon.trim() : null;

        // Opsi C: Pure Anonymous (Hamba Allah tanpa kontak personal) -> Single Shared Anonymous User
        if (isAnonymous && !cleanEmail && !cleanPhone) {
          effectiveWakifId = await ensureSystemAnonymousUser(tx);
        } else if (!cleanEmail && !cleanPhone) {
          // No contact provided even if not marked isAnonymous
          effectiveWakifId = await ensureSystemAnonymousUser(tx);
        } else {
          // Opsi B: Guest Donor with Contact Info
          // Security Guard: WAJIB membatasi pencarian existing user HANYA ke akun guest (passwordHash=null & oauthProvider=null)
          let existingGuestUser = null;

          if (cleanEmail) {
            existingGuestUser = await tx.user.findFirst({
              where: {
                email: cleanEmail,
                passwordHash: null,
                oauthProvider: null,
              },
            });
          }

          if (!existingGuestUser && cleanPhone) {
            existingGuestUser = await tx.user.findFirst({
              where: {
                phone: cleanPhone,
                passwordHash: null,
                oauthProvider: null,
              },
            });
          }

          if (existingGuestUser) {
            effectiveWakifId = existingGuestUser.id;
          } else {
            // Check if cleanEmail is already owned by a registered/authenticated user
            let isEmailRegistered = false;
            if (cleanEmail) {
              const regUser = await tx.user.findUnique({ where: { email: cleanEmail } });
              if (regUser) {
                isEmailRegistered = true;
              }
            }

            // Check if cleanPhone is already owned by any user
            let phoneToAssign = cleanPhone;
            if (phoneToAssign) {
              const phoneOwner = await tx.user.findUnique({ where: { phone: phoneToAssign } });
              if (phoneOwner) {
                phoneToAssign = null; // Do not collide with existing phone
              }
            }

            // Generate safe unique guest email
            const fallbackEmail = isEmailRegistered || !cleanEmail
              ? `guest-${Date.now()}-${Math.floor(Math.random() * 10000)}@amwal.internal`
              : cleanEmail;

            const newGuestUser = await tx.user.create({
              data: {
                name: isAnonymous ? 'Hamba Allah' : namaWakif,
                email: fallbackEmail,
                phone: phoneToAssign,
                role: 'WAKIF',
              },
            });
            effectiveWakifId = newGuestUser.id;
          }
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
