import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { Prisma } from '@/app/generated/prisma/client';
import {
  SuperAdminApprovalView,
  PendingApprovalsData,
} from '@/components/admin/super-admin-approval-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Pusat Persetujuan & Verifikasi | Super Admin Amwal',
  description: 'Antrean verifikasi pendaftaran lembaga nadzir, penarikan termin wakaf, permohonan penyaluran zakat, dan bukti kuitansi belanja.',
};

export default async function AdminApprovalsPage() {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    redirect('/login?redirect=/admin/approvals');
  }

  // 1. Pending Nadzir Verification
  const pendingNadzir = await prisma.nadzirProfile.findMany({
    where: { statusVerifikasi: 'PENDING' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      documents: {
        select: {
          id: true,
          tipeDokumen: true,
          fileUrl: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // 2. Pending Fund Withdrawal Requests (Waqf)
  const pendingWithdrawals = await prisma.fundWithdrawalRequest.findMany({
    where: { status: 'PENDING' },
    include: {
      waqfProgram: {
        select: {
          id: true,
          judul: true,
          kategori: true,
          targetDana: true,
          jenisWakaf: true,
        },
      },
      requestedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // 3. Pending Permohonan Penyaluran Institusional
  const pendingPermohonan = await prisma.permohonanPenyaluranInstitusional.findMany({
    where: { status: 'DIAJUKAN' },
    orderBy: { createdAt: 'desc' },
  });

  // 4. Pending Progress Reports with Receipts
  const pendingProgressReports = await prisma.programProgressReport.findMany({
    where: {
      kuitansiUrls: {
        not: Prisma.JsonNull,
      },
    },
    take: 10,
    include: {
      waqfProgram: {
        select: {
          id: true,
          judul: true,
          kategori: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const approvalsData: PendingApprovalsData = {
    counts: {
      nadzir: pendingNadzir.length,
      withdrawals: pendingWithdrawals.length,
      permohonan: pendingPermohonan.length,
      receipts: pendingProgressReports.length,
      total:
        pendingNadzir.length +
        pendingWithdrawals.length +
        pendingPermohonan.length +
        pendingProgressReports.length,
    },
    pendingNadzir: pendingNadzir.map((nz) => ({
      id: nz.id,
      namaLembaga: nz.namaLembaga,
      kategori: nz.kategori,
      namaBank: nz.namaBank,
      nomorRekeningBank: nz.nomorRekeningBank,
      statusVerifikasi: nz.statusVerifikasi,
      createdAt: nz.createdAt.toISOString(),
      user: {
        id: nz.user.id,
        name: nz.user.name,
        email: nz.user.email,
        phone: nz.user.phone,
      },
      documents: nz.documents.map((d) => ({
        id: d.id,
        tipeDokumen: String(d.tipeDokumen),
        fileUrl: d.fileUrl,
      })),
    })),
    pendingWithdrawals: pendingWithdrawals.map((w) => ({
      id: w.id,
      amount: Number(w.amount),
      peruntukan: w.peruntukan,
      rekeningTujuan: w.rekeningTujuan,
      adminNotes: w.adminNotes,
      status: w.status,
      createdAt: w.createdAt.toISOString(),
      waqfProgram: {
        id: w.waqfProgram.id,
        judul: w.waqfProgram.judul,
        kategori: w.waqfProgram.kategori,
        targetDana: Number(w.waqfProgram.targetDana),
        jenisWakaf: String(w.waqfProgram.jenisWakaf),
      },
      requestedBy: {
        id: w.requestedBy.id,
        name: w.requestedBy.name,
        email: w.requestedBy.email,
      },
    })),
    pendingPermohonan: pendingPermohonan.map((p) => ({
      id: p.id,
      namaPemohon: p.namaPemohon,
      namaLembaga: p.namaLembaga,
      alamatPemohon: p.alamatPemohon,
      nomorSuratPermohonan: p.nomorSuratPermohonan,
      kontak: p.kontak,
      penanggungJawab: p.penanggungJawab,
      nomorRekeningPemohon: p.nomorRekeningPemohon,
      namaBank: p.namaBank,
      status: String(p.status),
      alokasiDagingDisetujuiKg: p.alokasiDagingDisetujuiKg ? Number(p.alokasiDagingDisetujuiKg) : null,
      createdAt: p.createdAt.toISOString(),
    })),
    pendingProgressReports: pendingProgressReports.map((r) => ({
      id: r.id,
      persentaseFisik: r.persentaseFisik ? Number(r.persentaseFisik) : null,
      deskripsi: r.deskripsi,
      kuitansiUrls: r.kuitansiUrls,
      createdAt: r.createdAt.toISOString(),
      waqfProgram: {
        id: r.waqfProgram.id,
        judul: r.waqfProgram.judul,
        kategori: r.waqfProgram.kategori,
      },
      createdBy: {
        id: r.createdBy.id,
        name: r.createdBy.name,
      },
    })),
  };

  return <SuperAdminApprovalView initialData={approvalsData} />;
}
