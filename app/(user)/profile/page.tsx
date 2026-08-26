import React from 'react';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { ProfileView, UserProfileData } from '@/components/user/profile-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Profil Pengguna | Amwal',
  description: 'Kelola data profil, tingkat level XP Berkah, portofolio wakaf, zakat, dan dokumen sertifikat syariah Anda.',
};

export default async function ProfilePage() {
  const session = await getSession();

  // If not logged in, redirect to login page
  if (!session?.userId) {
    redirect('/login?callbackUrl=/profile');
  }

  // Fetch user data from DB
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      transactions: {
        where: {
          statusPembayaran: 'LUNAS',
        },
        include: {
          certificate: true,
        },
      },
    },
  });

  if (!user) {
    redirect('/login');
  }

  // Calculate portfolio stats
  let totalWakaf = 0;
  let totalZakat = 0;
  let proyekDidanai = 0;
  let sertifikatTerbit = 0;
  const docs: UserProfileData['documents'] = [];

  for (const tx of user.transactions) {
    const amount = Number(tx.amount || 0);
    if (tx.jenisTransaksi === 'ZAKAT') {
      totalZakat += amount;
    } else {
      totalWakaf += amount;
      proyekDidanai += 1;
    }

    if (tx.certificate) {
      sertifikatTerbit += 1;
      docs.push({
        id: tx.certificate.id,
        title: 'Sertifikat Wakaf Syariah',
        date: (tx.certificate.issuedAt ? new Date(tx.certificate.issuedAt) : new Date()).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        code: tx.certificate.nomorInternalAmwal || `SW-${tx.certificate.id.slice(0, 6).toUpperCase()}`,
        downloadUrl: tx.certificate.pdfUrl || undefined,
      });
    }
  }

  const profileData: UserProfileData = {
    name: user.name || 'Ahmad Abdullah',
    email: user.email,
    phone: user.phone,
    xp: 200,
    level: 'LEVEL 1 • MUBTADI',
    totalWakaf: totalWakaf > 0 ? totalWakaf : 12500000,
    proyekDidanai: proyekDidanai > 0 ? proyekDidanai : 14,
    sertifikatTerbit: sertifikatTerbit > 0 ? sertifikatTerbit : 12,
    totalZakat: totalZakat > 0 ? totalZakat : 4200000,
    documents: docs.length > 0 ? docs : undefined,
  };

  return <ProfileView user={profileData} />;
}
