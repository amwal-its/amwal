import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { z } from 'zod';

const updateBwiSchema = z.object({
  bwiRegistrationNumber: z
    .string({ message: 'Nomor registrasi BWI wajib diisi' })
    .min(3, 'Nomor registrasi BWI minimal 3 karakter'),
});

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    let userId = req.headers.get('x-user-id');
    let userRole = req.headers.get('x-user-role');

    if (!userId || !userRole) {
      try {
        const session = await getSession();
        if (session) {
          userId = session.userId;
          userRole = session.role;
        }
      } catch {
        // cookies() outside request context
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized: Autentikasi diperlukan.' },
        { status: 401 }
      );
    }

    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Akses ditolak. Hanya peran ADMIN yang dapat mengupdate nomor registrasi BWI.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const certId = String(id).trim();

    // 1. Search Certificate
    const certificate = await prisma.certificate.findFirst({
      where: {
        OR: [
          { id: certId },
          { nomorInternalAmwal: certId },
          { transactionId: certId },
        ],
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { error: `Sertifikat tidak ditemukan untuk identifier: ${certId}` },
        { status: 404 }
      );
    }

    const body = await req.json();
    const parsed = updateBwiSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { bwiRegistrationNumber } = parsed.data;

    // 2. Update BWI Registration Number
    const updatedCert = await prisma.certificate.update({
      where: { id: certificate.id },
      data: {
        nomorRegistrasiBwi: bwiRegistrationNumber.trim(),
      },
    });

    return NextResponse.json(
      {
        message: 'Nomor registrasi BWI berhasil diperbarui pada sertifikat',
        data: updatedCert,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating BWI number:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error saat mengupdate nomor BWI' },
      { status: 500 }
    );
  }
}
