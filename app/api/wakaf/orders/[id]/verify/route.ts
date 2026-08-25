import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { WaqfOrderStatus, TransactionPaymentStatus, Prisma } from '@/app/generated/prisma/client';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const orderIdStr = String(id).trim();

    // 1. Find the Waqf Order
    const waqfOrder = await prisma.waqfOrder.findFirst({
      where: {
        OR: [
          { id: orderIdStr },
          { nomorKwitansi: orderIdStr },
          { transactionId: orderIdStr },
        ],
      },
      include: {
        transaction: true,
        waqfProgram: true,
      },
    });

    if (!waqfOrder) {
      return NextResponse.json(
        { error: `Order wakaf tidak ditemukan untuk identifier: ${orderIdStr}` },
        { status: 404 }
      );
    }

    // 2. Idempotency Check
    if (waqfOrder.status === WaqfOrderStatus.TERVERIFIKASI) {
      return NextResponse.json(
        {
          message: 'Order wakaf sudah berstatus TERVERIFIKASI',
          data: {
            orderId: waqfOrder.id,
            nomorKwitansi: waqfOrder.nomorKwitansi,
            status: waqfOrder.status,
            waqfProgramId: waqfOrder.waqfProgramId,
          },
        },
        { status: 200 }
      );
    }

    const transaction = waqfOrder.transaction;
    const nominalVal = waqfOrder.nominal
      ? Number(waqfOrder.nominal)
      : transaction
      ? Number(transaction.amount)
      : 0;

    // 3. Atomic Database Update ($transaction)
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // a. Update linked Transaction to LUNAS
      if (transaction) {
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            statusPembayaran: TransactionPaymentStatus.LUNAS,
          },
        });
      }

      // b. Update Waqf Order to TERVERIFIKASI
      const updatedOrder = await tx.waqfOrder.update({
        where: { id: waqfOrder.id },
        data: {
          status: WaqfOrderStatus.TERVERIFIKASI,
        },
      });

      // c. Increment WaqfPrincipalLedger.pokokDanaTerkumpul
      if (nominalVal > 0) {
        await tx.waqfPrincipalLedger.upsert({
          where: { waqfProgramId: waqfOrder.waqfProgramId },
          create: {
            waqfProgramId: waqfOrder.waqfProgramId,
            pokokDanaTerkumpul: new Prisma.Decimal(nominalVal),
            totalHasilAvailable: new Prisma.Decimal(0),
            hasilInvestasiTersalurkan: new Prisma.Decimal(0),
          },
          update: {
            pokokDanaTerkumpul: { increment: new Prisma.Decimal(nominalVal) },
          },
        });
      }

      return updatedOrder;
    });

    return NextResponse.json(
      {
        message: 'Simulasi pembayaran sukses: Order wakaf berhasil diverifikasi',
        data: {
          orderId: result.id,
          nomorKwitansi: result.nomorKwitansi,
          status: result.status,
          nominal: nominalVal,
          waqfProgramId: result.waqfProgramId,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error verifying waqf order:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error saat verifikasi order' },
      { status: 500 }
    );
  }
}
