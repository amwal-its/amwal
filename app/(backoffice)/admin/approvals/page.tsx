import React from 'react';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/app/generated/prisma/client';
import {
  SuperAdminApprovalView,
  PendingApprovalsData,
} from '@/components/admin/super-admin-approval-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Pusat Persetujuan & Verifikasi | Super Admin Amwal',
  description:
    'Antrean verifikasi pendaftaran lembaga nadzir, penarikan termin wakaf, permohonan penyaluran zakat, dan bukti kuitansi belanja.',
};

const defaultApprovalsData: PendingApprovalsData = {
  counts: {
    nadzir: 1,
    withdrawals: 1,
    permohonan: 1,
    receipts: 1,
    total: 4,
  },
  pendingNadzir: [
    {
      id: 'NDZ-002',
      namaLembaga: 'Wakaf Produktif Al-Azhar',
      kategori: 'BADAN_HUKUM',
      namaBank: 'Bank Muamalat Indonesia',
      nomorRekeningBank: '340-001-9981',
      statusVerifikasi: 'PENDING',
      createdAt: '2026-08-20T14:15:00.000Z',
      user: {
        id: 'usr-02',
        name: 'H. Danang Wijaya, M.M.',
        email: 'danang@alazhar-wakaf.id',
        phone: '0811-9876-5432',
      },
      documents: [
        { id: 'doc-3', tipeDokumen: 'AKTA_NOTARIS', fileUrl: '/documents/akta-notaris-sample.pdf' },
      ],
    },
  ],
  pendingWithdrawals: [
    {
      id: 'WD-001',
      amount: 150000000,
      peruntukan: 'Pencairan Termin II Konstruksi Struktur Baja Klinik Air Bersih Al-Azhar',
      rekeningTujuan: 'BSI 711-889-2234 a.n. Yayasan Manarul Ilmi',
      adminNotes: null,
      status: 'PENDING',
      createdAt: '2026-08-22T09:00:00.000Z',
      waqfProgram: {
        id: 'PROG-WK-001',
        judul: 'Waqf Pembangunan Klinik Air Bersih & RS Gratis Al-Azhar',
        kategori: 'KESEHATAN',
        targetDana: 2500000000,
        jenisWakaf: 'WAKAF_UANG',
      },
      requestedBy: {
        id: 'usr-01',
        name: 'Ustadz Ridwan Malik, Lc.',
        email: 'ridwan@manarulilmi.org',
      },
    },
  ],
  pendingPermohonan: [
    {
      id: 'PMH-001',
      namaPemohon: 'Ustadz Hasan Basri',
      namaLembaga: 'Panti Asuhan Yatim Dhuafa Baitul Qur\'an Sukabumi',
      alamatPemohon: 'Jl. Raya Pelabuhan Ratu KM 12, Sukabumi',
      nomorSuratPermohonan: '012/BQ-SKB/VIII/2026',
      kontak: '0813-8877-6655',
      penanggungJawab: 'Drs. H. Mulyadi',
      nomorRekeningPemohon: '719-002-1144',
      namaBank: 'BSI',
      status: 'DIAJUKAN',
      alokasiDagingDisetujuiKg: 250,
      createdAt: '2026-08-21T16:30:00.000Z',
    },
  ],
  pendingProgressReports: [
    {
      id: 'REP-001',
      persentaseFisik: 65,
      deskripsi: 'Penyelesaian pengecoran lantai 2 dan instalasi perpipaan desalinasi air bersih.',
      kuitansiUrls: ['/receipts/kuitansi-semen-baja.pdf'],
      createdAt: '2026-08-22T11:00:00.000Z',
      waqfProgram: {
        id: 'PROG-WK-001',
        judul: 'Waqf Pembangunan Klinik Air Bersih & RS Gratis Al-Azhar',
        kategori: 'KESEHATAN',
      },
      createdBy: {
        id: 'usr-01',
        name: 'Ustadz Ridwan Malik, Lc.',
      },
    },
  ],
};

export default async function AdminApprovalsPage() {
  let approvalsData: PendingApprovalsData = defaultApprovalsData;

  try {
    const pendingNadzir = await prisma.nadzirProfile.findMany({
      where: { statusVerifikasi: 'PENDING' },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        documents: { select: { id: true, tipeDokumen: true, fileUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const pendingWithdrawals = await prisma.fundWithdrawalRequest.findMany({
      where: { status: 'PENDING' },
      include: {
        waqfProgram: { select: { id: true, judul: true, kategori: true, targetDana: true, jenisWakaf: true } },
        requestedBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const pendingPermohonan = await prisma.permohonanPenyaluranInstitusional.findMany({
      where: { status: 'DIAJUKAN' },
      orderBy: { createdAt: 'desc' },
    });

    const pendingProgressReports = await prisma.programProgressReport.findMany({
      where: { kuitansiUrls: { not: Prisma.JsonNull } },
      take: 10,
      include: {
        waqfProgram: { select: { id: true, judul: true, kategori: true } },
        createdBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (
      pendingNadzir.length > 0 ||
      pendingWithdrawals.length > 0 ||
      pendingPermohonan.length > 0 ||
      pendingProgressReports.length > 0
    ) {
      approvalsData = {
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
    }
  } catch {
    // Fallback to default mock data
  }

  return <SuperAdminApprovalView initialData={approvalsData} />;
}
