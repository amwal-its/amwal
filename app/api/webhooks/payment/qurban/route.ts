import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // In a real scenario, you'd verify signature using the Server Key
    // e.g. using SHA512 of orderId + statusCode + grossAmount + serverKey
    const signatureKey = req.headers.get('x-signature-key') || body.signature_key;
    if (!signatureKey && process.env.NODE_ENV === 'production') {
       return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { order_id, transaction_status, gross_amount } = body;
    if (!order_id || !transaction_status) {
      return NextResponse.json({ error: 'Missing webhook data' }, { status: 400 });
    }

    const qurbanOrder = await prisma.qurbanOrder.findUnique({
      where: { id: order_id }
    });

    if (!qurbanOrder) {
      // Could be order_id maps to Transaction.id, but let's assume QurbanOrder.id here
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Idempotency: if already LUNAS and transaction_status is settlement, ignore
    if (qurbanOrder.statusPembayaran === 'LUNAS' && (transaction_status === 'settlement' || transaction_status === 'capture')) {
      return NextResponse.json({ success: true, message: 'Already processed' });
    }

    await prisma.$transaction(async (tx) => {
      if (transaction_status === 'settlement' || transaction_status === 'capture') {
        const nominalDibayar = Number(qurbanOrder.nominalDibayar) + Number(gross_amount);
        const sisaTagihan = Number(qurbanOrder.totalHarga) - nominalDibayar;
        
        let newStatus = 'DP';
        if (sisaTagihan <= 0) {
          newStatus = 'LUNAS';
        }

        await tx.qurbanOrder.update({
          where: { id: order_id },
          data: {
            nominalDibayar,
            sisaTagihan: sisaTagihan < 0 ? 0 : sisaTagihan,
            statusPembayaran: newStatus as any
          }
        });

        if (newStatus === 'LUNAS') {
          await tx.qurbanAnimalSlot.updateMany({
            where: { qurbanOrderId: order_id },
            data: { status: 'TERISI' }
          });
        }
      } else if (transaction_status === 'expire' || transaction_status === 'cancel' || transaction_status === 'deny') {
        // Auto-release QurbanAnimalSlot
        await tx.qurbanAnimalSlot.updateMany({
          where: { qurbanOrderId: order_id },
          data: { 
            status: 'TERSEDIA',
            qurbanOrderId: null 
          }
        });

        await tx.qurbanOrder.update({
          where: { id: order_id },
          data: {
            statusPembayaran: 'BELUM_BAYAR' // or GAGAL if we add to Enum
          }
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
