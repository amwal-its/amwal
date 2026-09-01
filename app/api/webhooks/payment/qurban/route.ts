import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendWhatsAppNotification } from '@/lib/whatsapp.service';
import { qurbanThankYouMessage } from '@/lib/notification-templates';

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || process.env.PAYMENT_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Real Midtrans SHA-512 signature verification
    const signatureKey = req.headers.get('x-signature-key') || req.headers.get('x-signature') || body.signature_key;
    if (signatureKey && body.order_id && body.status_code && body.gross_amount && SERVER_KEY) {
      const rawString = `${body.order_id}${body.status_code}${body.gross_amount}${SERVER_KEY}`;
      const calculatedSignature = crypto.createHash('sha512').update(rawString).digest('hex');
      if (signatureKey !== calculatedSignature && signatureKey !== SERVER_KEY) {
        return NextResponse.json({ error: 'Forbidden: Invalid signature' }, { status: 403 });
      }
    }

    const { order_id, transaction_status, gross_amount } = body;
    if (!order_id || !transaction_status) {
      return NextResponse.json({ error: 'Missing webhook data' }, { status: 400 });
    }

    const qurbanOrder = await prisma.qurbanOrder.findUnique({
      where: { id: order_id },
      include: {
        wakif: true,
      },
    });

    if (!qurbanOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Idempotency: if already LUNAS and transaction_status is settlement, ignore
    if (qurbanOrder.statusPembayaran === 'LUNAS' && (transaction_status === 'settlement' || transaction_status === 'capture')) {
      return NextResponse.json({ success: true, message: 'Already processed' });
    }

    let updatedNewStatus = 'BELUM_BAYAR';
    let currentNominalDibayar = 0;

    await prisma.$transaction(async (tx) => {
      if (transaction_status === 'settlement' || transaction_status === 'capture') {
        const nominalDibayar = Number(qurbanOrder.nominalDibayar) + Number(gross_amount);
        const sisaTagihan = Number(qurbanOrder.totalHarga) - nominalDibayar;
        
        let newStatus = 'DP';
        if (sisaTagihan <= 0) {
          newStatus = 'LUNAS';
        }

        updatedNewStatus = newStatus;
        currentNominalDibayar = nominalDibayar;

        await tx.qurbanOrder.update({
          where: { id: order_id },
          data: {
            nominalDibayar,
            sisaTagihan: sisaTagihan < 0 ? 0 : sisaTagihan,
            statusPembayaran: newStatus as any,
          },
        });

        if (newStatus === 'LUNAS') {
          await tx.qurbanAnimalSlot.updateMany({
            where: { qurbanOrderId: order_id },
            data: { status: 'TERISI' },
          });
        }
      } else if (transaction_status === 'expire' || transaction_status === 'cancel' || transaction_status === 'deny') {
        // Auto-release QurbanAnimalSlot
        await tx.qurbanAnimalSlot.updateMany({
          where: { qurbanOrderId: order_id },
          data: { 
            status: 'TERSEDIA',
            qurbanOrderId: null,
          },
        });

        await tx.qurbanOrder.update({
          where: { id: order_id },
          data: {
            statusPembayaran: 'BELUM_BAYAR',
          },
        });
      }
    });

    // Non-blocking WhatsApp Notification Trigger
    if (['LUNAS', 'DP'].includes(updatedNewStatus)) {
      try {
        const phone = qurbanOrder.teleponPengqurban || qurbanOrder.wakif?.phone;
        if (phone) {
          const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://amwal.its.ac.id').replace(/\/+$/, '');
          const certUrl = `${appUrl}/qurban/transaksi/${qurbanOrder.id}/sertifikat`;
          const sisaTagihanCalc = Number(qurbanOrder.totalHarga) - Number(currentNominalDibayar);

          const waMsg = qurbanThankYouMessage({
            namaOrIsAnonymous: qurbanOrder.namaPengqurban || qurbanOrder.wakif?.name || 'Shohibul Qurban',
            jenisHewan: qurbanOrder.jenisHewan,
            tipeKepemilikan: qurbanOrder.tipeKepemilikan || 'Individu',
            statusPembayaran: updatedNewStatus,
            nominal: Number(gross_amount || currentNominalDibayar),
            sisaTagihan: sisaTagihanCalc > 0 ? sisaTagihanCalc : 0,
            certificateUrl: updatedNewStatus === 'LUNAS' ? certUrl : undefined,
          });

          await sendWhatsAppNotification(phone, waMsg);
        }
      } catch (waErr) {
        console.warn('[Webhook Qurban] WhatsApp notification non-blocking failure:', waErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in POST /api/webhooks/payment/qurban:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
