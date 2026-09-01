import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { decryptAES256 } from '@/lib/crypto';
import {
  AdminZakatView,
  ZakatOrderItem,
  MustahiqItem,
  ZakatDistributionItem,
  FundPoolStats,
} from '@/components/admin/admin-zakat-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Manajemen Zakat & 8 Asnaf | Admin Amwal',
  description:
    'Tata kelola penerimaan Zakat Maal & Fitrah, alokasi saldo Fund Pool, transparansi distribusi 8 Asnaf, dan audit mustahik terenkripsi.',
};

export default async function AdminZakatPage() {
  const session = await getSession();

  if (!session || (session.role !== 'ADMIN' && session.role !== 'PETUGAS_LAPANGAN')) {
    redirect('/login?callbackUrl=/admin/zakat');
  }

  const userRole = session.role || 'ADMIN';
  const userName = session.email || 'Super Admin';

  // 1. Fetch initial zakat orders
  const ordersRaw = await prisma.zakatOrder.findMany({
    take: 50,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      muzakki: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      enteredByAmil: {
        select: {
          id: true,
          name: true,
        },
      },
      transaction: {
        select: {
          id: true,
          statusPembayaran: true,
          paymentMethod: true,
          amount: true,
        },
      },
    },
  });

  // 2. Fetch initial mustahiq profiles
  const mustahiqsRaw = await prisma.mustahiqProfile.findMany({
    take: 100,
    orderBy: {
      createdAt: 'desc',
    },
  });

  // 3. Fetch initial distributions
  const distributionsRaw = await prisma.zakatDistribution.findMany({
    take: 50,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      mustahiq: {
        select: {
          id: true,
          namaMustahiq: true,
          kategoriAsnaf: true,
          alamat: true,
        },
      },
      distributedByAmil: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // 4. Fetch FundPool balances
  const fundPoolsRaw = await prisma.fundPool.findMany();

  // Format orders
  const formattedOrders: ZakatOrderItem[] = ordersRaw.map((o) => ({
    id: o.id,
    nomorKwitansi: o.nomorKwitansi,
    namaMuzakki: o.namaMuzakki,
    isAnonymous: o.isAnonymous,
    noTelepon: o.noTelepon,
    jenisZakat: o.jenisZakat,
    metodePembayaran: o.metodePembayaran,
    nominal: o.nominal ? Number(o.nominal) : null,
    beratBerasKg: o.beratBerasKg ? Number(o.beratBerasKg) : null,
    jumlahJiwa: o.jumlahJiwa,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
    notes: o.notes,
    transaction: o.transaction
      ? {
          id: o.transaction.id,
          statusPembayaran: o.transaction.statusPembayaran,
          paymentMethod: o.transaction.paymentMethod,
          amount: o.transaction.amount ? Number(o.transaction.amount) : null,
        }
      : null,
    muzakki: o.muzakki,
    enteredByAmil: o.enteredByAmil,
  }));

  // Format mustahiqs (decrypt NIK with AES-256 for Admin viewing)
  const formattedMustahiqs: MustahiqItem[] = mustahiqsRaw.map((m) => ({
    id: m.id,
    namaMustahiq: m.namaMustahiq,
    nik: decryptAES256(m.nik || '') || null,
    kategoriAsnaf: m.kategoriAsnaf,
    alamat: m.alamat,
    noTelepon: m.noTelepon,
    statusVerifikasi: m.statusVerifikasi,
    createdAt: m.createdAt.toISOString(),
  }));

  // Format distributions
  const formattedDistributions: ZakatDistributionItem[] = distributionsRaw.map((d) => ({
    id: d.id,
    mustahiqId: d.mustahiqId,
    jenisZakat: d.jenisZakat,
    nominal: d.nominal ? Number(d.nominal) : null,
    beratBerasKg: d.beratBerasKg ? Number(d.beratBerasKg) : null,
    buktiPenerimaanUrl: d.buktiPenerimaanUrl,
    status: d.status,
    notes: d.notes,
    createdAt: d.createdAt.toISOString(),
    mustahiq: d.mustahiq,
    distributedByAmil: d.distributedByAmil,
  }));

  // Format fund pools
  const maalPool = fundPoolsRaw.find((p) => p.kode === 'ZAKAT_MAAL');
  const fitrahPool = fundPoolsRaw.find((p) => p.kode === 'ZAKAT_FITRAH');

  const fundPoolStats: FundPoolStats = {
    maal: {
      balance: Number(maalPool?.balance || 0),
      totalDistributed: Number(maalPool?.totalDistributed || 0),
    },
    fitrah: {
      balance: Number(fitrahPool?.balance || 0),
      totalDistributed: Number(fitrahPool?.totalDistributed || 0),
    },
  };

  return (
    <AdminZakatView
      initialOrders={formattedOrders}
      initialMustahiqs={formattedMustahiqs}
      initialDistributions={formattedDistributions}
      initialFundPools={fundPoolStats}
      userRole={userRole}
      userName={userName}
    />
  );
}
