import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { VerificationStatus } from '@/app/generated/prisma/client';
import { z } from 'zod';

const verifyNadzirSchema = z.object({
  status: z.enum(['VERIFIED', 'REJECTED', 'PENDING'], {
    message: 'Status wajib diisi dengan VERIFIED, REJECTED, atau PENDING',
  }),
  nomorRegistrasiBwi: z.string().optional(),
  adminNotes: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    let userId = req.headers.get('x-user-id');
    let userRole = req.headers.get('x-user-role');

    if (!userId || !userRole) {
      const session = await getSession();
      if (session) {
        userId = session.userId;
        userRole = session.role;
      }
    }

    if (!userId || userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Akses khusus Super Admin' },
        { status: 401 }
      );
    }

    const { id: nadzirProfileId } = await params;
    const body = await req.json();
    const validation = verifyNadzirSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Input tidak valid' },
        { status: 400 }
      );
    }

    const { status, nomorRegistrasiBwi } = validation.data;

    const existing = await prisma.nadzirProfile.findUnique({
      where: { id: nadzirProfileId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Profil Nadzir tidak ditemukan' },
        { status: 404 }
      );
    }

    const updated = await prisma.nadzirProfile.update({
      where: { id: nadzirProfileId },
      data: {
        statusVerifikasi: status as VerificationStatus,
        verifiedById: userId,
        verifiedAt: status === 'VERIFIED' ? new Date() : null,
      },
    });

    return NextResponse.json({
      message: `Status verifikasi Nadzir berhasil diperbarui menjadi ${status}`,
      data: updated,
    });
  } catch (error) {
    console.error('Error verifying Nadzir profile:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
