import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import {
  TransactionPaymentStatus,
  WaqfOrderStatus,
  ZakatOrderStatus,
  QurbanPaymentStatus,
  SlotStatus,
  Prisma,
} from '@/app/generated/prisma/client';
import { incrementFundPool } from '@/lib/fund-pool';
import { sendWhatsAppNotification } from '@/lib/whatsapp.service';
import {
  waqfThankYouMessage,
  zakatThankYouMessage,
  qurbanThankYouMessage,
} from '@/lib/notification-templates';

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || process.env.PAYMENT_WEBHOOK_SECRET || '';

/**
 * Verifikasi signature Midtrans (SHA-512) atau Callback Token Xendit/Header.
 * SHA-512 Formula: SHA512(order_id + status_code + gross_amount + ServerKey)
 */
function verifyMidtransSignature(req: NextRequest, body: any): boolean {
  // 1. Direct header token verification (X-Callback-Token / Authorization)
  const headerToken =
    req.headers.get('x-callback-token') ||
    req.headers.get('x-signature') ||
    req.headers.get('authorization');

  if (headerToken && SERVER_KEY) {
    const tokenValue = headerToken.replace(/^Bearer\s+/i, '').trim();
    if (tokenValue === SERVER_KEY) {
      return true;
    }
  }

  // 2. Real Midtrans SHA-512 signature_key verification
  if (body && body.signature_key && body.order_id && body.status_code && body.gross_amount) {
    if (!SERVER_KEY) {
      console.warn('[Webhook] MIDTRANS_SERVER_KEY not configured in environment');
      return false;
    }
    const rawString = `${body.order_id}${body.status_code}${body.gross_amount}${SERVER_KEY}`;
    const calculatedSignature = crypto.createHash('sha512').update(rawString).digest('hex');
    return body.signature_key.toLowerCase() === calculatedSignature.toLowerCase();
  }

  // 3. Fallback signature field
  if (body && body.signature && SERVER_KEY && body.signature === SERVER_KEY) {
    return true;
  }

  return false;
}

/**
 * POST /api/webhooks/payment
 * Unified Midtrans Payment Webhook Handler (Hardened, Anti-Tampering, Atomic & Best-Effort WA)
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    let body: any = {};
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    // 1. VERIFIKASI SIGNATURE (WAJIB ANTI-TAMPERING)
    const isSignatureValid = verifyMidtransSignature(req, body);
    if (!isSignatureValid) {
      console.warn('[Webhook] Invalid signature or unauthorized token received:', {
        orderId: body.order_id,
        signatureKey: body.signature_key,
      });
      return NextResponse.json(
        { error: 'Forbidden: Invalid Midtrans signature_key or authorization token' },
        { status: 403 }
      );
    }

    // 2. MAPPING STATUS MIDTRANS
    const orderId = String(body.order_id || body.orderId || body.transactionId || body.id || '').trim();
    if (!orderId) {
      return NextResponse.json({ error: 'Missing order_id in payload' }, { status: 400 });
    }

    const rawStatus = String(body.transaction_status || body.status || '').toLowerCase();
    const fraudStatus = String(body.fraud_status || '').toLowerCase();
    const grossAmount = Number(body.gross_amount || body.amount || 0);

    let paymentOutcome: 'LUNAS' | 'PENDING' | 'GAGAL' = 'PENDING';

    if (
      (rawStatus === 'settlement' || rawStatus === 'capture' || rawStatus === 'success' || rawStatus === 'lunas') &&
      (!fraudStatus || fraudStatus === 'accept')
    ) {
      paymentOutcome = 'LUNAS';
    } else if (rawStatus === 'pending') {
      paymentOutcome = 'PENDING';
    } else if (
      rawStatus === 'deny' ||
      rawStatus === 'cancel' ||
      rawStatus === 'expire' ||
      rawStatus === 'failure' ||
      rawStatus === 'gagal' ||
      fraudStatus === 'deny' ||
      fraudStatus === 'challenge'
    ) {
      paymentOutcome = 'GAGAL';
    }

    // 3. CARI DATA TRANSAKSI & DOMAIN ORDER TERKAIT
    // Cek domain Wakaf
    let waqfOrder = await prisma.waqfOrder.findFirst({
      where: {
        OR: [{ id: orderId }, { nomorKwitansi: orderId }, { transactionId: orderId }],
      },
      include: {
        transaction: { include: { certificate: true } },
        waqfProgram: true,
      },
    });

    // Cek domain Zakat
    let zakatOrder = !waqfOrder
      ? await prisma.zakatOrder.findFirst({
          where: {
            OR: [{ id: orderId }, { nomorKwitansi: orderId }, { transactionId: orderId }],
          },
          include: {
            transaction: true,
          },
        })
      : null;

    // Cek domain Qurban
    let qurbanOrder = !waqfOrder && !zakatOrder
      ? await prisma.qurbanOrder.findFirst({
          where: {
            OR: [{ id: orderId }, { transactionId: orderId }],
          },
          include: {
            wakif: true,
            transaction: true,
          },
        })
      : null;

    // Cek via Transaction langsung jika belum ditemukan
    let baseTransaction = null;
    if (!waqfOrder && !zakatOrder && !qurbanOrder) {
      baseTransaction = await prisma.transaction.findFirst({
        where: {
          OR: [{ id: orderId }, { paymentGatewayRef: orderId }],
        },
        include: {
          waqfOrder: { include: { waqfProgram: true } },
          zakatOrder: true,
          qurbanOrder: { include: { wakif: true } },
          certificate: true,
        },
      });

      if (baseTransaction) {
        if (baseTransaction.waqfOrder) waqfOrder = baseTransaction.waqfOrder as any;
        if (baseTransaction.zakatOrder) zakatOrder = baseTransaction.zakatOrder as any;
        if (baseTransaction.qurbanOrder) qurbanOrder = baseTransaction.qurbanOrder as any;
      }
    }

    if (!waqfOrder && !zakatOrder && !qurbanOrder && !baseTransaction) {
      console.warn(`[Webhook] No order found matching identifier: ${orderId}`);
      return NextResponse.json({ error: `Order not found for identifier: ${orderId}` }, { status: 404 });
    }

    // 4. EKSEKUSI TRANSAKSI ATOMIK ($transaction)
    let domainType: 'WAKAF' | 'ZAKAT' | 'QURBAN' = 'WAKAF';
    let targetPhone: string | null = null;
    let notificationPayload: any = null;

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const now = new Date();

      // ==========================================
      // A. MODUL WAKAF
      // ==========================================
      if (waqfOrder) {
        domainType = 'WAKAF';
        const txId = waqfOrder.transactionId || (waqfOrder.transaction ? waqfOrder.transaction.id : null);

        if (paymentOutcome === 'LUNAS') {
          // Idempotensi
          if (waqfOrder.status !== WaqfOrderStatus.TERVERIFIKASI) {
            if (txId) {
              await tx.transaction.update({
                where: { id: txId },
                data: {
                  statusPembayaran: TransactionPaymentStatus.LUNAS,
                  paymentGatewayRef: body.transaction_id || body.paymentGatewayRef || body.order_id,
                },
              });
            }

            await tx.waqfOrder.update({
              where: { id: waqfOrder.id },
              data: { status: WaqfOrderStatus.TERVERIFIKASI },
            });

            const nominalVal = waqfOrder.nominal
              ? Number(waqfOrder.nominal)
              : waqfOrder.nilaiTaksiranRupiah
              ? Number(waqfOrder.nilaiTaksiranRupiah)
              : grossAmount || 0;

            // Increment WaqfPrincipalLedger
            await tx.waqfPrincipalLedger.upsert({
              where: { waqfProgramId: waqfOrder.waqfProgramId },
              create: {
                waqfProgramId: waqfOrder.waqfProgramId,
                pokokDanaTerkumpul: nominalVal,
                hasilInvestasiTersalurkan: 0,
              },
              update: {
                pokokDanaTerkumpul: { increment: nominalVal },
              },
            });

            targetPhone = waqfOrder.noTelepon;
            notificationPayload = {
              namaOrIsAnonymous: waqfOrder.isAnonymous ? 'Hamba Allah' : (waqfOrder.namaWakif || 'Donatur'),
              judulProgram: waqfOrder.waqfProgram?.judul || 'Program Wakaf',
              nominal: nominalVal,
              certificateUrl:
                waqfOrder.transaction?.certificate?.pdfUrl ||
                `${(process.env.NEXT_PUBLIC_APP_URL || 'https://amwal.its.ac.id').replace(/\/+$/, '')}/wakaf/transaksi/${waqfOrder.id}/sertifikat`,
            };
          }
        } else if (paymentOutcome === 'GAGAL') {
          if (txId) {
            await tx.transaction.update({
              where: { id: txId },
              data: { statusPembayaran: TransactionPaymentStatus.GAGAL },
            });
          }
          await tx.waqfOrder.update({
            where: { id: waqfOrder.id },
            data: { status: WaqfOrderStatus.DITOLAK },
          });
        }
      }

      // ==========================================
      // B. MODUL ZAKAT
      // ==========================================
      else if (zakatOrder) {
        domainType = 'ZAKAT';
        const txId = zakatOrder.transactionId || (zakatOrder.transaction ? zakatOrder.transaction.id : null);

        if (paymentOutcome === 'LUNAS') {
          // Idempotensi
          if (zakatOrder.status !== ZakatOrderStatus.TERVERIFIKASI) {
            if (txId) {
              await tx.transaction.update({
                where: { id: txId },
                data: {
                  statusPembayaran: TransactionPaymentStatus.LUNAS,
                  paymentGatewayRef: body.transaction_id || body.paymentGatewayRef || body.order_id,
                },
              });
            }

            await tx.zakatOrder.update({
              where: { id: zakatOrder.id },
              data: { status: ZakatOrderStatus.TERVERIFIKASI },
            });

            const nominalVal = zakatOrder.nominal
              ? Number(zakatOrder.nominal)
              : grossAmount || 0;

            // Saldo FundPool
            await incrementFundPool(tx, zakatOrder.jenisZakat, new Prisma.Decimal(nominalVal));

            targetPhone = zakatOrder.noTelepon;
            notificationPayload = {
              namaOrIsAnonymous: zakatOrder.isAnonymous ? 'Hamba Allah' : (zakatOrder.namaMuzakki || 'Muzakki'),
              jenisZakat: zakatOrder.jenisZakat,
              nominal: nominalVal,
              certificateUrl: `${(process.env.NEXT_PUBLIC_APP_URL || 'https://amwal.its.ac.id').replace(/\/+$/, '')}/zakat/transaksi/${zakatOrder.id}/sertifikat`,
            };
          }
        } else if (paymentOutcome === 'GAGAL') {
          if (txId) {
            await tx.transaction.update({
              where: { id: txId },
              data: { statusPembayaran: TransactionPaymentStatus.GAGAL },
            });
          }
          await tx.zakatOrder.update({
            where: { id: zakatOrder.id },
            data: { status: ZakatOrderStatus.DITOLAK },
          });
        }
      }

      // ==========================================
      // C. MODUL QURBAN
      // ==========================================
      else if (qurbanOrder) {
        domainType = 'QURBAN';
        const txId = qurbanOrder.transactionId || (qurbanOrder.transaction ? qurbanOrder.transaction.id : null);

        if (paymentOutcome === 'LUNAS') {
          const nominalDibayar = Number(qurbanOrder.nominalDibayar) + (grossAmount || Number(qurbanOrder.totalHarga));
          const sisaTagihan = Number(qurbanOrder.totalHarga) - nominalDibayar;
          const newStatus = sisaTagihan <= 0 ? QurbanPaymentStatus.LUNAS : QurbanPaymentStatus.DP;

          if (txId) {
            await tx.transaction.update({
              where: { id: txId },
              data: {
                statusPembayaran: TransactionPaymentStatus.LUNAS,
                paymentGatewayRef: body.transaction_id || body.paymentGatewayRef || body.order_id,
              },
            });
          }

          await tx.qurbanOrder.update({
            where: { id: qurbanOrder.id },
            data: {
              nominalDibayar,
              sisaTagihan: sisaTagihan < 0 ? 0 : sisaTagihan,
              statusPembayaran: newStatus,
            },
          });

          // Kunci slot hewan
          if (newStatus === QurbanPaymentStatus.LUNAS) {
            await tx.qurbanAnimalSlot.updateMany({
              where: { qurbanOrderId: qurbanOrder.id },
              data: { status: SlotStatus.TERISI },
            });
          }

          targetPhone = qurbanOrder.teleponPengqurban || qurbanOrder.wakif?.phone || null;
          notificationPayload = {
            namaOrIsAnonymous: qurbanOrder.namaPengqurban || qurbanOrder.wakif?.name || 'Shohibul Qurban',
            jenisHewan: qurbanOrder.jenisHewan,
            tipeKepemilikan: qurbanOrder.tipeKepemilikan || 'Individu',
            statusPembayaran: newStatus,
            nominal: grossAmount || nominalDibayar,
            sisaTagihan: sisaTagihan > 0 ? sisaTagihan : 0,
            certificateUrl:
              newStatus === QurbanPaymentStatus.LUNAS
                ? `${(process.env.NEXT_PUBLIC_APP_URL || 'https://amwal.its.ac.id').replace(/\/+$/, '')}/qurban/transaksi/${qurbanOrder.id}/sertifikat`
                : undefined,
          };
        } else if (paymentOutcome === 'GAGAL') {
          if (txId) {
            await tx.transaction.update({
              where: { id: txId },
              data: { statusPembayaran: TransactionPaymentStatus.GAGAL },
            });
          }

          // Release slot hewan agar bisa diambil donatur lain
          await tx.qurbanAnimalSlot.updateMany({
            where: { qurbanOrderId: qurbanOrder.id },
            data: {
              status: SlotStatus.TERSEDIA,
              qurbanOrderId: null,
            },
          });

          await tx.qurbanOrder.update({
            where: { id: qurbanOrder.id },
            data: { statusPembayaran: QurbanPaymentStatus.BELUM_BAYAR },
          });
        }
      }
    });

    // 5. DISPATCH NOTIFIKASI WHATSAPP BEST-EFFORT (TERPISAH DARI DB TRANSACTION)
    if (paymentOutcome === 'LUNAS' && targetPhone && notificationPayload) {
      try {
        let messageText = '';
        if (domainType === 'WAKAF') {
          messageText = waqfThankYouMessage(notificationPayload);
        } else if (domainType === 'ZAKAT') {
          messageText = zakatThankYouMessage(notificationPayload);
        } else if (domainType === 'QURBAN') {
          messageText = qurbanThankYouMessage(notificationPayload);
        }

        if (messageText) {
          await sendWhatsAppNotification(targetPhone, messageText);
          console.log(`[Webhook] WhatsApp notification sent to ${targetPhone} for order ${orderId}`);
        }
      } catch (waErr) {
        // Best-effort: Log warning without failing Midtrans response
        console.warn(`[Webhook] WhatsApp notification failed for ${targetPhone} (Non-blocking):`, waErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Webhook processed successfully (Domain: ${domainType}, Status: ${paymentOutcome})`,
        orderId,
        paymentOutcome,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Webhook] Error processing payment webhook:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
