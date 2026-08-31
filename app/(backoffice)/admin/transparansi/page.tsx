import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import {
  TransparencyLogsView,
  TransparencyTransactionItem,
} from '@/components/admin/transparency-logs-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Log Transparansi Transaksi & Audit | Admin Amwal',
  description: 'Rekam jejak transparansi seluruh transaksi masuk wakaf, zakat, dan qurban yang terverifikasi.',
};

export default async function AdminTransparansiPage() {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    redirect('/login?redirect=/admin/transparansi');
  }

  // Query real transactions from PostgreSQL via Prisma
  const transactions = await prisma.transaction.findMany({
    take: 100,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      wakif: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      waqfOrder: {
        include: {
          waqfProgram: {
            select: {
              judul: true,
            },
          },
        },
      },
      zakatOrder: true,
      qurbanOrder: true,
      certificate: {
        select: {
          nomorInternalAmwal: true,
          nomorRegistrasiBwi: true,
          pdfUrl: true,
        },
      },
    },
  });

  let totalVolume = 0;
  let totalLunasCount = 0;
  let wakafVolume = 0;
  let zakatVolume = 0;
  let qurbanVolume = 0;

  const formattedTransactions: TransparencyTransactionItem[] = transactions.map((t) => {
    const amountNum = Number(t.amount);
    const isLunas = t.statusPembayaran === 'LUNAS';

    if (isLunas) {
      totalVolume += amountNum;
      totalLunasCount += 1;

      if (t.jenisTransaksi === 'WAKAF') wakafVolume += amountNum;
      else if (t.jenisTransaksi === 'ZAKAT') zakatVolume += amountNum;
      else if (t.jenisTransaksi === 'QURBAN') qurbanVolume += amountNum;
    }

    let nomorKwitansi = t.id.slice(0, 8).toUpperCase();
    let donorName = t.wakif?.name || 'Donatur';
    let isAnonymous = false;
    let programTitle = 'Donasi Umum';

    if (t.waqfOrder) {
      nomorKwitansi = t.waqfOrder.nomorKwitansi || nomorKwitansi;
      donorName = t.waqfOrder.namaWakif || donorName;
      isAnonymous = t.waqfOrder.isAnonymous;
      programTitle = t.waqfOrder.waqfProgram?.judul || 'Program Wakaf';
    } else if (t.zakatOrder) {
      nomorKwitansi = t.zakatOrder.nomorKwitansi || nomorKwitansi;
      donorName = t.zakatOrder.namaMuzakki || donorName;
      isAnonymous = t.zakatOrder.isAnonymous;
      programTitle = `Zakat ${t.zakatOrder.jenisZakat}`;
    } else if (t.qurbanOrder) {
      nomorKwitansi = `QRB-${t.qurbanOrder.id.slice(0, 6).toUpperCase()}`;
      donorName = t.qurbanOrder.namaPengqurban || donorName;
      programTitle = `Qurban ${t.qurbanOrder.jenisHewan}`;
    }

    return {
      id: t.id,
      nomorKwitansi,
      jenisTransaksi: String(t.jenisTransaksi),
      donorName,
      isAnonymous,
      programTitle,
      amount: amountNum,
      paymentMethod: t.paymentMethod || 'QRIS / VA',
      statusPembayaran: String(t.statusPembayaran),
      createdAt: t.createdAt.toISOString(),
      certificate: t.certificate
        ? {
            nomorInternalAmwal: t.certificate.nomorInternalAmwal,
            nomorRegistrasiBwi: t.certificate.nomorRegistrasiBwi,
            pdfUrl: t.certificate.pdfUrl,
          }
        : null,
    };
  });

  return (
    <TransparencyLogsView
      transactions={formattedTransactions}
      summary={{
        totalVolume,
        totalLunasCount,
        wakafVolume,
        zakatVolume,
        qurbanVolume,
      }}
    />
  );
}
