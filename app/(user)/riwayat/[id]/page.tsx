import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { RiwayatDetailView, RiwayatDetailData } from '@/components/user/riwayat-detail-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `Detail Transaksi ${id} | Amwal Wakaf`,
    description: 'Rincian transaksi wakaf, status verifikasi bank, dan unduh sertifikat digital.',
  };
}

export default async function RiwayatDetailPage({ params }: PageProps) {
  const { id } = await params;
  const cleanId = String(id).trim();

  // Find transaction by transaction ID, waqfOrder ID, or receipt number
  const transaction = await prisma.transaction.findFirst({
    where: {
      OR: [
        { id: cleanId },
        { waqfOrder: { id: cleanId } },
        { waqfOrder: { nomorKwitansi: cleanId } },
      ],
    },
    include: {
      wakif: true,
      waqfOrder: {
        include: {
          waqfProgram: {
            include: {
              nadzirProfile: true,
            },
          },
        },
      },
      certificate: true,
    },
  });

  if (!transaction) {
    notFound();
  }

  const waqfOrder = transaction.waqfOrder;
  const program = waqfOrder?.waqfProgram;

  const detailData: RiwayatDetailData = {
    id: transaction.id,
    orderId: waqfOrder?.id,
    nomorKwitansi: waqfOrder?.nomorKwitansi || `AMW-${transaction.id.slice(0, 8).toUpperCase()}`,
    programTitle: program?.judul || 'Wakaf Terpadu Yayasan Manarul Ilmi ITS',
    programKategori: program?.kategori ? `Wakaf ${program.kategori}` : 'Wakaf Terpadu',
    programDeskripsi: program?.deskripsi || 'Bantu anak yatim & kemaslahatan umat',
    namaLembaga: program?.nadzirProfile?.namaLembaga || 'Yayasan Manarul Ilmi ITS',
    nominal: Number(transaction.amount),
    status: waqfOrder?.status || transaction.statusPembayaran,
    tanggal: transaction.createdAt.toISOString(),
    jenisTransaksi: transaction.jenisTransaksi || 'WAKAF',
    metodePembayaran: transaction.paymentGatewayRef?.includes('QRIS') ? 'QRIS' : 'Transfer Bank (VA)',
    isAnonymous: waqfOrder?.isAnonymous || false,
    namaWakif: waqfOrder?.namaWakif || transaction.wakif?.name || 'Hamba Allah',
    certificateNumber: transaction.certificate?.nomorInternalAmwal,
    bwiRegistrationNumber: transaction.certificate?.nomorRegistrasiBwi,
    programId: program?.id,
  };

  return <RiwayatDetailView transaction={detailData} />;
}
