import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const level = searchParams.get('level');
    const provinsiKode = searchParams.get('provinsiKode');
    const search = searchParams.get('search');

    if (provinsiKode) {
      // Fetch Kabupaten / Kota in specific province (kode format: 'XX.__')
      const sanitizedProv = provinsiKode.trim().slice(0, 2);
      const kabKota = await prisma.$queryRaw<{ kode: string; nama: string }[]>`
        SELECT kode, nama 
        FROM wilayah 
        WHERE kode LIKE ${sanitizedProv + '.__'}
        ORDER BY kode ASC
      `;
      return NextResponse.json({
        data: kabKota,
      });
    }

    if (level === 'kabupaten' || level === 'kota') {
      // Fetch all Kabupaten/Kota (length = 5)
      const kabKota = await prisma.$queryRaw<{ kode: string; nama: string }[]>`
        SELECT kode, nama 
        FROM wilayah 
        WHERE LENGTH(kode) = 5
        ORDER BY nama ASC
      `;
      return NextResponse.json({
        data: kabKota,
      });
    }

    // Default or level === 'provinsi': Fetch 38 Provinces (length = 2)
    const provinces = await prisma.$queryRaw<{ kode: string; nama: string }[]>`
      SELECT kode, nama 
      FROM wilayah 
      WHERE LENGTH(kode) = 2
      ORDER BY kode ASC
    `;

    return NextResponse.json({
      data: provinces,
    });
  } catch (error: any) {
    console.error('API Wilayah Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data wilayah' },
      { status: 500 }
    );
  }
}
