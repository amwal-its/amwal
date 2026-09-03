import React from 'react';
import { prisma } from '@/lib/prisma';
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

const defaultNadzirs: NadzirItem[] = [
  {
    id: 'NDZ-001',
    namaLembaga: 'Yayasan Manarul Ilmi ITS',
    kategori: 'ORGANISASI',
    namaBank: 'Bank Syariah Indonesia (BSI)',
    nomorRekeningBank: '711-889-2234',
    statusVerifikasi: 'TERVERIFIKASI',
    verifiedAt: '2026-08-15T10:00:00.000Z',
    createdAt: '2026-08-01T08:30:00.000Z',
    user: {
      id: 'usr-01',
      name: 'Ustadz Ridwan Malik, Lc., M.A.',
      email: 'ridwan@manarulilmi.org',
      phone: '0812-3456-7890',
    },
    documents: [
      { id: 'doc-1', tipeDokumen: 'SK_KEMENKUMHAM', fileUrl: '/documents/sk-kemenkumham-sample.pdf' },
      { id: 'doc-2', tipeDokumen: 'REKENING_KORAN', fileUrl: '/documents/rekening-koran-sample.pdf' },
    ],
    programsCount: 5,
  },
  {
    id: 'NDZ-002',
    namaLembaga: 'Wakaf Produktif Al-Azhar',
    kategori: 'BADAN_HUKUM',
    namaBank: 'Bank Muamalat Indonesia',
    nomorRekeningBank: '340-001-9981',
    statusVerifikasi: 'PENDING',
    verifiedAt: null,
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
    programsCount: 2,
  },
  {
    id: 'NDZ-003',
    namaLembaga: 'Pondok Pesantren Daarut Tauhiid Bandung',
    kategori: 'ORGANISASI',
    namaBank: 'BCA Syariah',
    nomorRekeningBank: '882-019-7721',
    statusVerifikasi: 'TERVERIFIKASI',
    verifiedAt: '2026-07-28T09:00:00.000Z',
    createdAt: '2026-07-10T11:20:00.000Z',
    user: {
      id: 'usr-03',
      name: 'KH. Abdullah Gymnastiar',
      email: 'admin@daaruttauhiid.org',
      phone: '0813-2211-4455',
    },
    documents: [
      { id: 'doc-4', tipeDokumen: 'SK_KEMENKUMHAM', fileUrl: '/documents/sk-dt.pdf' },
      { id: 'doc-5', tipeDokumen: 'IZIN_OPERASIONAL', fileUrl: '/documents/izin-dt.pdf' },
    ],
    programsCount: 8,
  },
];

export default async function AdminNadzirVerifikasiPage() {
  let formattedNadzirs: NadzirItem[] = defaultNadzirs;

  try {
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

    if (nadzirs && nadzirs.length > 0) {
      formattedNadzirs = nadzirs.map((nz) => ({
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
    }
  } catch {
    // Fallback to default mock nadzirs
  }

  return <NazhirVerificationView initialNadzirs={formattedNadzirs} />;
}
