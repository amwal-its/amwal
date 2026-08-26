import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateCertificatePdf, CertificateData } from '@/lib/certificate-generator';

interface RouteContext {
  params: Promise<{ transactionId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { transactionId } = await params;
    const cleanId = String(transactionId).trim();

    // 1. Find Transaction (or by WaqfOrder id / receipt number)
    let transaction = await prisma.transaction.findFirst({
      where: {
        OR: [
          { id: cleanId },
          { waqfOrder: { id: cleanId } },
          { waqfOrder: { nomorKwitansi: cleanId } },
          { paymentGatewayRef: cleanId },
        ],
      },
      include: {
        wakif: true,
        waqfOrder: {
          include: {
            waqfProgram: {
              include: {
                nadzirProfile: true,
              },
            },
          },
        },
        certificate: true,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: `Transaksi tidak ditemukan untuk identifier: ${cleanId}` },
        { status: 404 }
      );
    }

    // 2. Validate Settlement / Verification
    const isLunas =
      transaction.statusPembayaran === 'LUNAS' ||
      transaction.waqfOrder?.status === 'TERVERIFIKASI';

    if (!isLunas) {
      return NextResponse.json(
        {
          error:
            'Sertifikat digital hanya dapat diterbitkan untuk transaksi yang telah berstatus TERVERIFIKASI / LUNAS.',
          currentStatus: transaction.statusPembayaran,
          orderStatus: transaction.waqfOrder?.status,
        },
        { status: 400 }
      );
    }

    // 3. Upsert Certificate Record in DB
    let certificate = transaction.certificate;
    if (!certificate) {
      const year = new Date().getFullYear();
      const count = await prisma.certificate.count();
      const nomorInternalAmwal = `CERT-AMW-${year}-${String(count + 1).padStart(4, '0')}`;

      certificate = await prisma.certificate.create({
        data: {
          transactionId: transaction.id,
          jenisSertifikat: transaction.jenisTransaksi || 'WAKAF',
          nomorInternalAmwal,
          nomorRegistrasiBwi: null,
          issuedAt: new Date(),
        },
      });
    }

    // 4. Extract data for PDF rendering
    const waqfOrder = transaction.waqfOrder;
    const programTitle =
      waqfOrder?.waqfProgram?.judul ||
      transaction.jenisTransaksi + ' Terpadu Amwal';
    const namaLembaga =
      waqfOrder?.waqfProgram?.nadzirProfile?.namaLembaga ||
      'Yayasan Manarul Ilmi ITS';
    const isAnonymous = waqfOrder?.isAnonymous ?? false;
    const namaDonatur =
      waqfOrder?.namaWakif || transaction.wakif?.name || 'Wakif Dermawan';
    const nominal = Number(transaction.amount);

    const certData: CertificateData = {
      certificateId: certificate.id,
      nomorInternalAmwal: certificate.nomorInternalAmwal,
      nomorRegistrasiBwi: certificate.nomorRegistrasiBwi,
      jenisTransaksi: transaction.jenisTransaksi || 'WAKAF',
      namaDonatur,
      nominal,
      programTitle,
      tanggalTransaksi: transaction.createdAt,
      namaLembaga,
      nomorKwitansi: waqfOrder?.nomorKwitansi,
      isAnonymous,
    };

    // If client asks for JSON metadata
    const url = new URL(req.url, 'http://localhost:3000');
    const format = url.searchParams.get('format');
    if (format === 'json') {
      return NextResponse.json({
        success: true,
        data: {
          certificate,
          details: certData,
        },
      });
    }

    // 5. Generate PDF
    const pdfBuffer = await generateCertificatePdf(certData);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Sertifikat-${certificate.nomorInternalAmwal}.pdf"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    console.error('Error generating certificate:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error saat generate sertifikat' },
      { status: 500 }
    );
  }
}
