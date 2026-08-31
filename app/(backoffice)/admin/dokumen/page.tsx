import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { DocumentsView, DocumentItem } from '@/components/admin/documents-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Manajemen Dokumen & Arsip Resmi | Super Admin Amwal',
  description: 'Pusat arsip berkas legalitas lembaga, sertifikat digital wakaf, RAB proyek, dan template resmi BWI.',
};

export default async function AdminDokumenPage() {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    redirect('/login?redirect=/admin/dokumen');
  }

  // 1. Fetch Nadzir Legal Documents
  const nadzirDocs = await prisma.nadzirDocument.findMany({
    take: 30,
    include: {
      nadzirProfile: {
        select: {
          namaLembaga: true,
          user: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // 2. Fetch Certificates
  const certificates = await prisma.certificate.findMany({
    take: 30,
    orderBy: { issuedAt: 'desc' },
  });

  // 3. Fetch Waqf Program RAB Documents
  const waqfRabs = await prisma.waqfProgram.findMany({
    where: {
      rabDocumentUrl: { not: null },
    },
    take: 20,
    select: {
      id: true,
      judul: true,
      rabDocumentUrl: true,
      createdAt: true,
      nadzirProfile: {
        select: { namaLembaga: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const docsList: DocumentItem[] = [];

  // Map Nadzir Docs
  nadzirDocs.forEach((doc) => {
    if (doc.fileUrl) {
      docsList.push({
        id: doc.id,
        title: `Dokumen Legalitas: ${doc.tipeDokumen}`,
        category: 'LEGALITAS',
        issuer: doc.nadzirProfile.namaLembaga || doc.nadzirProfile.user.name,
        fileUrl: doc.fileUrl,
        createdAt: doc.createdAt.toISOString(),
        badgeText: doc.reviewedManually ? 'Ditinjau' : 'Menunggu Review',
      });
    }
  });

  // Map Certificates
  certificates.forEach((cert) => {
    if (cert.pdfUrl) {
      docsList.push({
        id: cert.id,
        title: `Sertifikat Wakaf #${cert.nomorInternalAmwal}`,
        category: 'SERTIFIKAT',
        issuer: 'BWI & Manarul Ilmi ITS',
        fileUrl: cert.pdfUrl,
        createdAt: cert.issuedAt.toISOString(),
        badgeText: cert.nomorRegistrasiBwi ? 'BWI Registered' : 'Internal',
      });
    }
  });

  // Map RABs
  waqfRabs.forEach((rab) => {
    if (rab.rabDocumentUrl) {
      docsList.push({
        id: rab.id,
        title: `RAB Proyek: ${rab.judul}`,
        category: 'RAB_PROYEK',
        issuer: rab.nadzirProfile?.namaLembaga || 'Nadzir',
        fileUrl: rab.rabDocumentUrl,
        createdAt: rab.createdAt.toISOString(),
        badgeText: 'RAB Terlampir',
      });
    }
  });

  // Standard Templates (Official BWI / Amwal)
  docsList.push(
    {
      id: 'tmpl-aiw',
      title: 'Formulir Standar Akta Ikrar Wakaf (AIW) Uang',
      category: 'TEMPLATE',
      issuer: 'Badan Wakaf Indonesia (BWI)',
      fileUrl: '/documents/template-aiw-bwi.pdf',
      createdAt: new Date().toISOString(),
      badgeText: 'Formulir Resmi',
    },
    {
      id: 'tmpl-mou',
      title: 'Format Perjanjian Pengelolaan Wakaf Produktif (MoU Nadzir)',
      category: 'TEMPLATE',
      issuer: 'Yayasan Manarul Ilmi ITS',
      fileUrl: '/documents/template-mou-nadzir.pdf',
      createdAt: new Date().toISOString(),
      badgeText: 'Format Baku',
    }
  );

  return <DocumentsView documents={docsList} />;
}
