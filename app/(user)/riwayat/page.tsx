import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { RiwayatView, RiwayatTransactionItem } from '@/components/user/riwayat-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Riwayat Wakaf & Transaksi Syariah | Amwal',
  description: 'Daftar riwayat transaksi wakaf terverifikasi dan unduh sertifikat resmi BWI & YMI ITS.',
};

export default async function RiwayatPage() {
  const session = await getSession();
  const userId = session?.userId;

  // Fetch transactions: if user is logged in, fetch their transactions;
  // otherwise fetch all recent transactions (e.g. for guest / demo)
  const transactions = await prisma.transaction.findMany({
    where: userId
      ? { wakifId: userId }
      : {},
    include: {
      waqfOrder: {
        include: {
          waqfProgram: true,
        },
      },
      certificate: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 30,
  });

  const formattedItems: RiwayatTransactionItem[] = transactions.map((tx) => ({
    id: tx.id,
    orderId: tx.waqfOrder?.id,
    nomorKwitansi: tx.waqfOrder?.nomorKwitansi || `AMW-${tx.id.slice(0, 8).toUpperCase()}`,
    programTitle: tx.waqfOrder?.waqfProgram?.judul || 'Wakaf Terpadu Yayasan Manarul Ilmi ITS',
    nominal: Number(tx.amount),
    status: tx.waqfOrder?.status || tx.statusPembayaran,
    tanggal: tx.createdAt.toISOString(),
    jenisTransaksi: tx.jenisTransaksi || 'WAKAF',
    metodePembayaran: tx.paymentGatewayRef?.includes('QRIS') ? 'QRIS' : 'Transfer Bank (VA)',
  }));

  return <RiwayatView transactions={formattedItems} />;
}
