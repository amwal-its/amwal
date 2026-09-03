import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { WakafProgramsView } from '@/components/admin/wakaf-programs-view';
import { WaqfType } from '@/app/generated/prisma/client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Manajemen & Pengawasan Program Wakaf | Super Admin Amwal',
  description:
    'Pusat manajemen program wakaf, pemantauan slider progres fisik, audit kuitansi belanja digital, dan tata kelola termin escrow BSI.',
};

export default async function AdminWakafPage() {
  const session = await getSession();
  if (process.env.NODE_ENV === 'production' && (!session || session.role !== 'ADMIN')) {
    redirect('/login');
  }

  try {
    const rawPrograms = await prisma.waqfProgram.findMany({
    include: {
      principalLedger: true,
      nadzirProfile: {
        select: {
          id: true,
          namaLembaga: true,
          namaBank: true,
          nomorRekeningBank: true,
          kategori: true,
          statusVerifikasi: true,
        },
      },
      progressReports: {
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: {
            select: {
              name: true,
              role: true,
            },
          },
        },
      },
      withdrawalRequests: {
        orderBy: { createdAt: 'desc' },
        include: {
          requestedBy: {
            select: {
              name: true,
              phone: true,
            },
          },
          approvedBy: {
            select: {
              name: true,
            },
          },
        },
      },
      yieldEntries: {
        orderBy: { recordedAt: 'desc' },
      },
      waqfOrders: {
        where: {
          status: 'TERVERIFIKASI',
        },
        include: {
          wakif: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
          transaction: {
            include: {
              certificate: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const nadzirProfiles = await prisma.nadzirProfile.findMany({
    select: {
      id: true,
      namaLembaga: true,
      namaBank: true,
      nomorRekeningBank: true,
    },
  });

  // Map to clean client props
  const initialPrograms = rawPrograms.map((p) => {
    // Extract receipts from all progress reports
    const receiptsList: any[] = [];
    p.progressReports.forEach((pr) => {
      if (Array.isArray(pr.kuitansiUrls)) {
        pr.kuitansiUrls.forEach((k: any) => {
          if (k && typeof k === 'object') {
            receiptsList.push({
              id: k.id || `RCP-${Math.random().toString(36).slice(2, 8)}`,
              title: k.title || 'Kuitansi Pengadaan',
              vendor: k.vendor || 'Vendor Mitra',
              amount: Number(k.amount || 0),
              fileName: k.fileName || 'Kuitansi_Belanja.pdf',
              date: k.date || pr.createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
              status: k.status || 'Terverifikasi Super Admin',
              ocrDetected: k.ocrDetected ?? true,
              notes: k.notes || pr.deskripsi || '',
            });
          }
        });
      }
    });

    const latestProgress = p.progressReports[0]?.persentaseFisik
      ? Number(p.progressReports[0].persentaseFisik)
      : 0;

    const collectedPokok = p.principalLedger
      ? Number(p.principalLedger.pokokDanaTerkumpul)
      : 0;

    const availableYield = p.principalLedger
      ? Number(p.principalLedger.totalHasilAvailable)
      : 0;

    const distributedYield = p.principalLedger
      ? Number(p.principalLedger.hasilInvestasiTersalurkan)
      : 0;

    const mappedStatus =
      p.status === 'LIVE'
        ? 'Aktif'
        : p.status === 'DRAFT'
        ? 'Draft'
        : p.status === 'SELESAI'
        ? 'Selesai'
        : 'Menunggu Persetujuan Super Admin';

    const mappedAkad = p.jenisWakaf === WaqfType.PRODUKTIF_KEKAL ? 'Wakaf Uang' : 'Wakaf Melalui Uang';

    const terminList = p.withdrawalRequests.map((wr) => ({
      id: wr.id,
      programId: p.id,
      terminKe: wr.peruntukan || 'Pencairan Termin Operasional',
      nominal: Number(wr.amount),
      targetRekening: wr.rekeningTujuan || `${p.nadzirProfile?.namaBank || 'BSI'} - ${p.nadzirProfile?.nomorRekeningBank || 'Rekening Escrow'}`,
      status: wr.status === 'APPROVED' ? 'Selesai Dicairkan' : wr.status === 'REJECTED' ? 'Ditolak' : 'Menunggu Verifikasi DPS',
      rawStatus: wr.status,
      adminNotes: wr.adminNotes || '',
      tanggalPengajuan: wr.createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      dokumen: 'BAP_Pengajuan_Termin.pdf',
      requestedBy: wr.requestedBy?.name || 'Nadzir',
      approvedBy: wr.approvedBy?.name || null,
    }));

    const yieldList = p.yieldEntries.map((ye) => ({
      id: ye.id,
      programId: p.id,
      nominal: Number(ye.amount),
      sourceDescription: ye.sourceDescription,
      recordedAt: ye.recordedAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    }));

    const wakifList = p.waqfOrders.map((wo) => ({
      id: wo.id,
      orderId: wo.id,
      programId: p.id,
      name: wo.isAnonymous ? 'Hamba Allah (Anonim)' : wo.namaWakif || wo.wakif?.name || 'Donatur Wakaf',
      phone: wo.noTelepon || wo.wakif?.phone || '-',
      nominal: Number(wo.nominal || wo.nilaiTaksiranRupiah || 0),
      tanggal: wo.createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      akad: mappedAkad,
      sertifikatNo: wo.transaction?.certificate?.nomorInternalAmwal || wo.nomorIkrarWakaf || 'Belum Terbit',
      nomorRegistrasiBwi: wo.transaction?.certificate?.nomorRegistrasiBwi || null,
      statusSertifikat: wo.transaction?.certificate?.nomorRegistrasiBwi
        ? 'Terbit & Terverifikasi BWI'
        : wo.transaction?.certificate
        ? 'Sertifikat Digital Amwal'
        : 'Menunggu Penerbitan',
    }));

    return {
      id: p.id,
      name: p.judul,
      akad: mappedAkad as 'Wakaf Uang' | 'Wakaf Melalui Uang',
      kategori: p.kategori || 'Infrastruktur & Sosial',
      targetAmount: Number(p.targetDana),
      collectedAmount: collectedPokok,
      availableYield,
      distributedYield,
      description: p.deskripsi || '',
      status: mappedStatus as 'Aktif' | 'Menunggu Persetujuan Super Admin' | 'Butuh Revisi' | 'Ditolak' | 'Selesai' | 'Draft',
      rawStatus: p.status,
      bannerUrl: p.bannerUrl || '/assets/images/wakaf/wakaf-pembangunan-masjid-al-furqon.png',
      supportingDoc: p.rabDocumentUrl || p.dokumenLegalitasUrl || 'Dokumen_Legalitas_RAB.pdf',
      durationStart: p.createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      durationEnd: `${p.durasiHari || 60} Hari Kedepan`,
      duration: `${p.durasiHari || 60} Hari`,
      bankName: p.nadzirProfile?.namaBank || 'Bank Syariah Indonesia (BSI)',
      bankAccountNumber: p.nadzirProfile?.nomorRekeningBank || '711-889-2234',
      bankAccountHolder: p.nadzirProfile?.namaLembaga || 'Yayasan Manarul Ilmi ITS (YMI ITS)',
      bankAccount: `${p.nadzirProfile?.namaBank || 'BSI'} - ${p.nadzirProfile?.nomorRekeningBank || '711-889-2234'}`,
      province: 'Jawa Timur',
      city: 'Surabaya',
      locationDetail: 'Kampus Sukolilo ITS Surabaya',
      jenisWakaf: mappedAkad as 'Wakaf Uang' | 'Wakaf Melalui Uang',
      rawJenisWakaf: p.jenisWakaf,
      menerimaWakafBarang: 'Ya' as 'Ya' | 'Tidak',
      progressFisik: latestProgress,
      submitterName: p.nadzirProfile?.namaLembaga || 'YMI ITS Surabaya',
      submitterRole: 'Nadzir Resmi Terverifikasi',
      receipts: receiptsList,
      terminList,
      yieldList,
      wakifList,
    };
  });

    return (
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-800" />
          </div>
        }
      >
        <WakafProgramsView initialPrograms={initialPrograms} nadzirProfiles={nadzirProfiles} />
      </Suspense>
    );
  } catch (error) {
    return (
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-800" />
          </div>
        }
      >
        <WakafProgramsView initialPrograms={[]} nadzirProfiles={[]} />
      </Suspense>
    );
  }
}
