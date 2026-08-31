import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import {
  AdminOverviewView,
  OverviewMetrics,
} from '@/components/admin/admin-overview-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Executive Overview Dashboard | Super Admin Amwal',
  description: 'Ringkasan eksekutif tata kelola multi-akad syariah, penghimpunan wakaf produktif, zakat, qurban, dan status persetujuan regulasi.',
};

export default async function AdminOverviewPage() {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    redirect('/login?redirect=/admin');
  }

  // 1. Fetch all completed/lunas transactions for exact financial aggregation
  const lunasTransactions = await prisma.transaction.findMany({
    where: {
      statusPembayaran: 'LUNAS',
    },
    select: {
      id: true,
      amount: true,
      jenisTransaksi: true,
      createdAt: true,
      wakifId: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // 2. Fetch pending counts for Super Admin Approval Center
  const [
    pendingNadzirCount,
    pendingWithdrawalsCount,
    pendingPermohonanCount,
    totalProgramLive,
    totalProgramAll,
  ] = await Promise.all([
    prisma.nadzirProfile.count({ where: { statusVerifikasi: 'PENDING' } }),
    prisma.fundWithdrawalRequest.count({ where: { status: 'PENDING' } }),
    prisma.permohonanPenyaluranInstitusional.count({ where: { status: 'DIAJUKAN' } }),
    prisma.waqfProgram.count({ where: { status: 'LIVE' } }),
    prisma.waqfProgram.count(),
  ]);

  // 3. Fetch top 5 active waqf programs with ledger & latest physical progress
  const activePrograms = await prisma.waqfProgram.findMany({
    where: {
      status: 'LIVE',
    },
    take: 5,
    include: {
      principalLedger: true,
      nadzirProfile: {
        select: {
          namaLembaga: true,
        },
      },
      progressReports: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
        select: {
          persentaseFisik: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // 4. Fetch 6 latest live transactions for the recent activity ledger
  const recentTransactionsRaw = await prisma.transaction.findMany({
    take: 6,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      wakif: {
        select: {
          name: true,
          email: true,
        },
      },
      waqfOrder: {
        select: {
          namaWakif: true,
          isAnonymous: true,
          nomorKwitansi: true,
          waqfProgram: {
            select: {
              judul: true,
            },
          },
        },
      },
      zakatOrder: {
        select: {
          namaMuzakki: true,
          isAnonymous: true,
          nomorKwitansi: true,
          jenisZakat: true,
        },
      },
      qurbanOrder: {
        select: {
          id: true,
          namaPengqurban: true,
          jenisHewan: true,
        },
      },
    },
  });

  // Financial calculations
  let totalDanaTerkumpul = 0;
  let wakafVolume = 0;
  let zakatVolume = 0;
  let qurbanVolume = 0;
  const uniqueWakifIds = new Set<string>();

  lunasTransactions.forEach((tx) => {
    const amt = Number(tx.amount);
    totalDanaTerkumpul += amt;
    if (tx.wakifId) uniqueWakifIds.add(tx.wakifId);

    if (tx.jenisTransaksi === 'WAKAF') wakafVolume += amt;
    else if (tx.jenisTransaksi === 'ZAKAT') zakatVolume += amt;
    else if (tx.jenisTransaksi === 'QURBAN') qurbanVolume += amt;
  });

  // Monthly Time-Series Aggregation
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
  const trendMap = new Map<string, { period: string; wakaf: number; zakat: number; qurban: number; total: number }>();

  // Ensure last 6 months are initialized even if zero
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    trendMap.set(key, { period: label, wakaf: 0, zakat: 0, qurban: 0, total: 0 });
  }

  lunasTransactions.forEach((tx) => {
    const d = new Date(tx.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const amt = Number(tx.amount);

    if (trendMap.has(key)) {
      const item = trendMap.get(key)!;
      item.total += amt;
      if (tx.jenisTransaksi === 'WAKAF') item.wakaf += amt;
      else if (tx.jenisTransaksi === 'ZAKAT') item.zakat += amt;
      else if (tx.jenisTransaksi === 'QURBAN') item.qurban += amt;
    }
  });

  const trendData = Array.from(trendMap.values());

  // Module distribution with percentage
  const totalBase = totalDanaTerkumpul > 0 ? totalDanaTerkumpul : 1;
  const moduleDistribution = [
    {
      name: 'Wakaf Uang & Properti',
      value: wakafVolume,
      color: '#1B5E20',
      percentage: Math.round((wakafVolume / totalBase) * 100),
    },
    {
      name: 'Zakat Fitrah & Maal',
      value: zakatVolume,
      color: '#1E88E5',
      percentage: Math.round((zakatVolume / totalBase) * 100),
    },
    {
      name: 'Qurban Terpadu',
      value: qurbanVolume,
      color: '#D97706',
      percentage: Math.round((qurbanVolume / totalBase) * 100),
    },
  ];

  // Map recent transactions
  const recentTransactions = recentTransactionsRaw.map((tx) => {
    let nomorKwitansi = tx.id.slice(0, 8).toUpperCase();
    let donorName = tx.wakif?.name || 'Donatur';
    let isAnonymous = false;
    let programTitle = 'Donasi Platform';

    if (tx.waqfOrder) {
      nomorKwitansi = tx.waqfOrder.nomorKwitansi || nomorKwitansi;
      donorName = tx.waqfOrder.namaWakif || donorName;
      isAnonymous = tx.waqfOrder.isAnonymous;
      programTitle = tx.waqfOrder.waqfProgram?.judul || 'Program Wakaf';
    } else if (tx.zakatOrder) {
      nomorKwitansi = tx.zakatOrder.nomorKwitansi || nomorKwitansi;
      donorName = tx.zakatOrder.namaMuzakki || donorName;
      isAnonymous = tx.zakatOrder.isAnonymous;
      programTitle = `Zakat ${tx.zakatOrder.jenisZakat}`;
    } else if (tx.qurbanOrder) {
      nomorKwitansi = `QRB-${tx.qurbanOrder.id.slice(0, 6).toUpperCase()}`;
      donorName = tx.qurbanOrder.namaPengqurban || donorName;
      programTitle = `Qurban ${tx.qurbanOrder.jenisHewan}`;
    }

    return {
      id: tx.id,
      nomorKwitansi,
      jenisTransaksi: String(tx.jenisTransaksi),
      donorName,
      isAnonymous,
      programTitle,
      amount: Number(tx.amount),
      statusPembayaran: String(tx.statusPembayaran),
      createdAt: tx.createdAt.toISOString(),
    };
  });

  // Map top programs
  const topPrograms = activePrograms.map((p) => {
    const target = Number(p.targetDana) || 1;
    const collected = Number(p.principalLedger?.pokokDanaTerkumpul) || 0;
    const persentaseDana = Math.min(100, Math.round((collected / target) * 100));
    const persentaseFisik = p.progressReports[0]?.persentaseFisik
      ? Number(p.progressReports[0].persentaseFisik)
      : null;

    return {
      id: p.id,
      judul: p.judul,
      kategori: p.kategori || 'Wakaf',
      jenisWakaf: String(p.jenisWakaf),
      namaLembaga: p.nadzirProfile?.namaLembaga || 'Yayasan Manarul Ilmi ITS',
      targetDana: target,
      pokokDanaTerkumpul: collected,
      persentaseDana,
      persentaseFisik,
    };
  });

  const overviewData: OverviewMetrics = {
    totalDanaTerkumpul,
    wakafVolume,
    zakatVolume,
    qurbanVolume,
    totalProgramLive,
    totalProgramAll,
    totalDonaturUnik: uniqueWakifIds.size,
    totalTransactionsCount: lunasTransactions.length,
    pendingApprovals: {
      nadzir: pendingNadzirCount,
      withdrawals: pendingWithdrawalsCount,
      permohonan: pendingPermohonanCount,
      total: pendingNadzirCount + pendingWithdrawalsCount + pendingPermohonanCount,
    },
    trendData,
    moduleDistribution,
    recentTransactions,
    topPrograms,
  };

  return <AdminOverviewView data={overviewData} />;
}
