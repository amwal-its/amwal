import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { WakafDonateForm } from '@/components/wakaf/wakaf-donate-form';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const program = await prisma.waqfProgram.findUnique({
    where: { id },
    select: { judul: true },
  });

  if (!program) {
    return { title: 'Donasi Wakaf - Amwal' };
  }

  return {
    title: `Donasi Wakaf: ${program.judul} | Amwal`,
    description: `Tunaikan donasi wakaf untuk program ${program.judul} secara aman, amanah dan transparan di Amwal.`,
  };
}

export default async function WakafDonatePage({ params }: PageProps) {
  const { id } = await params;

  const program = await prisma.waqfProgram.findUnique({
    where: { id },
    include: {
      nadzirProfile: {
        select: {
          namaLembaga: true,
        },
      },
    },
  });

  if (!program) {
    notFound();
  }

  const session = await getSession();
  let currentUser = null;

  if (session?.userId) {
    currentUser = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        name: true,
        email: true,
        phone: true,
      },
    });
  }

  return (
    <WakafDonateForm
      program={{
        id: program.id,
        judul: program.judul,
        kategori: program.kategori,
        bannerUrl: program.bannerUrl,
        nadzirProfile: program.nadzirProfile,
      }}
      currentUser={currentUser}
    />
  );
}
