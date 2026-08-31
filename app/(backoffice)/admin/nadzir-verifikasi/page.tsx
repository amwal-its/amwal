import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import {
  NazhirVerificationView,
  NadzirItem,
} from '@/components/admin/nazhir-verification-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Verifikasi Nadzir & Legalitas BWI | Super Admin Amwal',
  description: 'Verifikasi badan hukum lembaga nadzir, validasi berkas LKS-PWU, dan input nomor registrasi BWI resmi.',
};

export default async function AdminNadzirVerifikasiPage() {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    redirect('/login?redirect=/admin/nadzir-verifikasi');
  }

  const nadzirs = await prisma.nadzirProfile.findMany({
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
      _count: {
        select: {
          waqfPrograms: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedNadzirs: NadzirItem[] = nadzirs.map((nz) => ({
    id: nz.id,
    namaLembaga: nz.namaLembaga,
    kategori: String(nz.kategori),
    namaBank: nz.namaBank,
    nomorRekeningBank: nz.nomorRekeningBank,
    statusVerifikasi: String(nz.statusVerifikasi),
    verifiedAt: nz.verifiedAt ? nz.verifiedAt.toISOString() : null,
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
    programsCount: nz._count.waqfPrograms,
  }));

  return <NazhirVerificationView initialNadzirs={formattedNadzirs} />;
}
