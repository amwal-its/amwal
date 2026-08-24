import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { VerificationStatus } from '@/app/generated/prisma/client';

const ALLOWED_ROLES = ['ADMIN', 'PETUGAS_LAPANGAN'];

const verifySchema = z.object({
  status: z.nativeEnum(VerificationStatus, {
    message: 'Status verifikasi tidak valid (PENDING, VERIFIED, REJECTED)',
  }),
  adminNotes: z.string().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');
    if (!userId || !userRole) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!ALLOWED_ROLES.includes(userRole)) {
      return NextResponse.json({ error: 'Akses ditolak. Peran ADMIN atau PETUGAS_LAPANGAN diperlukan.' }, { status: 403 });
    }

    const { id } = await params;

    const body = await req.json();
    const parsed = verifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { status, adminNotes } = parsed.data;
    if (status === VerificationStatus.REJECTED && !adminNotes?.trim()) {
      return NextResponse.json({ error: 'Alasan penolakan (adminNotes) wajib diisi' }, { status: 400 });
    }

    const existing = await prisma.mustahiqProfile.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return NextResponse.json({ error: 'Mustahik tidak ditemukan' }, { status: 404 });
    }

    const mustahiq = await prisma.mustahiqProfile.update({
      where: { id },
      data: { statusVerifikasi: status, adminNotes },
      select: {
        id: true,
        namaMustahiq: true,
        kategoriAsnaf: true,
        alamat: true,
        noTelepon: true,
        statusVerifikasi: true,
        adminNotes: true,
      },
    });

    return NextResponse.json({ message: 'Status verifikasi mustahik diperbarui', data: mustahiq }, { status: 200 });
  } catch (error) {
    console.error('Verify mustahiq error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
