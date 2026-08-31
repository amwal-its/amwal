import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import {
  NewsManagementView,
  NewsItem,
} from '@/components/admin/news-management-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Manajemen Berita & Publikasi Penyaluran | Admin Amwal',
  description: 'Publikasi artikel transparansi program, dokumentasi penyaluran donasi mustahiq, dan berita kegiatan lembaga.',
};

export default async function AdminBeritaPage() {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    redirect('/login?redirect=/admin/berita');
  }

  // Fetch education/articles from database
  const contents = await prisma.educationContent.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
  });

  const newsList: NewsItem[] = contents.map((c) => ({
    id: c.id,
    title: c.judul,
    category: c.kategori || 'Edukasi Syariah',
    summary: 'Modul literasi dan fiqih wakaf/zakat resmi terverifikasi Dewan Syariah.',
    author: 'Dewan Syariah Amwal',
    imageUrl: c.kontenUrl || '/assets/images/wakaf/wakaf-pembangunan-masjid-al-furqon.png',
    publishedAt: c.createdAt.toISOString(),
    status: 'PUBLISHED',
  }));

  // Initial rich items for transparency news
  if (newsList.length === 0) {
    newsList.push(
      {
        id: 'news-1',
        title: 'Penyaluran Termin II Pembangunan Klinik Air Bersih Al-Azhar',
        category: 'Kabar Penyaluran',
        summary: 'Alhamdulillah, dana termin kedua sebesar Rp 50.000.000 telah resmi disalurkan dan dibelanjakan untuk instalasi pipa desalinasi.',
        author: 'Super Admin Amwal',
        imageUrl: '/assets/images/wakaf/wakaf-klinik-kesehatan-air-bersih.png',
        publishedAt: new Date().toISOString(),
        status: 'PUBLISHED',
      },
      {
        id: 'news-2',
        title: 'Audit Tahunan BWI: Yayasan Manarul Ilmi Pertahankan Predikat A',
        category: 'Berita Utama',
        summary: 'Badan Wakaf Indonesia (BWI) menetapkan tata kelola wakaf produktif YMI ITS memenuhi standar transparansi digital tertinggi.',
        author: 'Super Admin Amwal',
        imageUrl: '/assets/images/wakaf/wakaf-pembangunan-masjid-al-furqon.png',
        publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: 'PUBLISHED',
      }
    );
  }

  return <NewsManagementView initialNews={newsList} />;
}
