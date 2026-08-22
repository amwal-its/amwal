import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      namaPemohon, namaLembaga, alamatPemohon, nomorSuratPermohonan,
      kontak, penanggungJawab, nomorRekeningPemohon, namaBank
    } = body;

    if (!namaPemohon) {
      return NextResponse.json({ error: 'namaPemohon is required' }, { status: 400 });
    }

    const permohonan = await prisma.permohonanPenyaluranInstitusional.create({
      data: {
        namaPemohon,
        namaLembaga,
        alamatPemohon,
        nomorSuratPermohonan,
        kontak,
        penanggungJawab,
        nomorRekeningPemohon,
        namaBank,
        status: 'DIAJUKAN'
      }
    });

    return NextResponse.json({ success: true, data: permohonan });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
