import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export interface CertificateData {
  certificateId: string;
  nomorInternalAmwal: string;
  nomorRegistrasiBwi?: string | null;
  jenisTransaksi: 'WAKAF' | 'ZAKAT' | 'INFAQ' | 'QURBAN' | string;
  namaDonatur: string;
  nominal: number;
  programTitle: string;
  tanggalTransaksi: Date | string;
  namaLembaga?: string;
  nomorKwitansi?: string;
  isAnonymous?: boolean;
}

/**
 * Utility to generate an official digital certificate PDF
 * for Amwal Islamic Social Finance (YMI ITS & BWI accredited).
 */
export async function generateCertificatePdf(data: CertificateData): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4', // 210 x 297 mm
  });

  const width = 210;
  const height = 297;

  // 1. Background & Islamic Geometric Borders
  doc.setFillColor(252, 253, 252); // soft off-white
  doc.rect(0, 0, width, height, 'F');

  // Outer Border (Dark Emerald)
  doc.setDrawColor(27, 94, 32); // #1B5E20
  doc.setLineWidth(1.8);
  doc.rect(10, 10, width - 20, height - 20);

  // Inner Border (Gold / Amber Accent)
  doc.setDrawColor(217, 119, 6); // #D97706
  doc.setLineWidth(0.6);
  doc.rect(13, 13, width - 26, height - 26);

  // Corner Ornaments
  const cornerSize = 10;
  doc.setDrawColor(27, 94, 32);
  doc.setLineWidth(0.8);
  // Top-left
  doc.line(13, 13 + cornerSize, 13 + cornerSize, 13);
  // Top-right
  doc.line(width - 13 - cornerSize, 13, width - 13, 13 + cornerSize);
  // Bottom-left
  doc.line(13, height - 13 - cornerSize, 13 + cornerSize, height - 13);
  // Bottom-right
  doc.line(width - 13 - cornerSize, height - 13, width - 13, height - 13 - cornerSize);

  // 2. Header Section
  doc.setTextColor(27, 94, 32); // #1B5E20
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('YAYASAN MANARUL ILMI ITS', width / 2, 26, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99); // #4B5563
  doc.text('LEMBAGA PENGELOLA WAKAF UANG YAYASAN MANARUL ILMI ITS', width / 2, 31, { align: 'center' });
  doc.text('Gedung Pusat Riset Manarul Ilmi ITS, Kampus ITS Sukolilo, Surabaya 60111', width / 2, 35, { align: 'center' });

  // Divider Line
  doc.setDrawColor(209, 213, 219);
  doc.setLineWidth(0.4);
  doc.line(22, 39, width - 22, 39);

  // 3. Certificate Title
  doc.setTextColor(27, 94, 32);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  const certType = data.jenisTransaksi === 'WAKAF' ? 'SERTIFIKAT WAKAF UANG DIGITAL' : `SERTIFIKAT ${data.jenisTransaksi} DIGITAL`;
  doc.text(certType, width / 2, 50, { align: 'center' });

  // Subtitle / Certificate Number
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9); // Gold-amber
  doc.text(`Nomor: ${data.nomorInternalAmwal}`, width / 2, 56, { align: 'center' });

  // 4. Opening Statement
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(55, 65, 81);
  doc.text(
    'Dengan memohon rahmat dan ridho Allah Subhanahu wa Ta\'ala, sertifikat ini diberikan sebagai bukti atas penerimaan dan pengikatan komitmen:',
    width / 2,
    66,
    { align: 'center', maxWidth: 160 }
  );

  // 5. Donor Main Card Box
  doc.setFillColor(248, 250, 252); // #F8FAFC
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.roundedRect(22, 74, width - 44, 48, 3, 3, 'FD');

  const displayName = data.isAnonymous ? 'Hamba Allah (Anonim)' : data.namaDonatur;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('NAMA WAKIF / DONATUR:', width / 2, 83, { align: 'center' });

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(displayName, width / 2, 91, { align: 'center' });

  // Nominal Box inside card
  doc.setFillColor(236, 253, 245); // #ECFDF5
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(30, 97, width - 60, 18, 2, 2, 'FD');

  const formattedNominal = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(data.nominal);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(4, 120, 87); // #047857
  doc.text('JUMLAH NOMINAL DITERIMA:', width / 2, 103, { align: 'center' });

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(27, 94, 32);
  doc.text(formattedNominal, width / 2, 110, { align: 'center' });

  // 6. Program Allocation Details Table
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(55, 65, 81);

  const startY = 130;
  const col1 = 26;
  const col2 = 68;

  // Row 1: Program Tujuan
  doc.setFont('helvetica', 'bold');
  doc.text('Program Penyaluran', col1, startY);
  doc.text(':', col2 - 3, startY);
  doc.setFont('helvetica', 'normal');
  doc.text(data.programTitle, col2, startY, { maxWidth: 115 });

  // Row 2: Pengelola / Nazhir
  const row2Y = startY + 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Nazhir Pengelola', col1, row2Y);
  doc.text(':', col2 - 3, row2Y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.namaLembaga || 'Yayasan Manarul Ilmi ITS (YMI ITS)', col2, row2Y);

  // Row 3: Tanggal Transaksi
  const row3Y = row2Y + 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Tanggal Transaksi', col1, row3Y);
  doc.text(':', col2 - 3, row3Y);
  doc.setFont('helvetica', 'normal');
  const dateObj = new Date(data.tanggalTransaksi);
  const formattedDate = dateObj.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.text(formattedDate, col2, row3Y);

  // Row 4: Status Akad & Transaksi
  const row4Y = row3Y + 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Status Fiqih / Akad', col1, row4Y);
  doc.text(':', col2 - 3, row4Y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(4, 120, 87);
  doc.text('TERVERIFIKASI SAH & AKAD IJAB QOBUL SELESAI', col2, row4Y);

  // 7. BWI Registration Box (Requirement DoD)
  const bwiBoxY = 168;
  doc.setFillColor(254, 243, 199); // #FEF3C7 (amber-100)
  doc.setDrawColor(245, 158, 11); // #F59E0B
  doc.setLineWidth(0.7);
  doc.roundedRect(22, bwiBoxY, width - 44, 22, 2.5, 2.5, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(146, 64, 14); // amber-800
  doc.text('NOMOR REGISTRASI BADAN WAKAF INDONESIA (BWI)', width / 2, bwiBoxY + 7, { align: 'center' });

  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  const bwiText = data.nomorRegistrasiBwi && data.nomorRegistrasiBwi.trim() !== ''
    ? data.nomorRegistrasiBwi.toUpperCase()
    : 'Menunggu Proses Registrasi BWI';
  doc.setTextColor(180, 83, 9);
  doc.text(bwiText, width / 2, bwiBoxY + 15, { align: 'center' });

  // 8. Fiqih Statement / Prayer
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(75, 85, 99);
  const doaText =
    '“Semoga Allah Subhanahu wa Ta\'ala menerima amal jariyah ini, melipatgandakan pahala kebaikan yang abadi, serta menjadikan manfaatnya mengalir tiada henti bagi kemaslahatan umat.”';
  doc.text(doaText, width / 2, 198, { align: 'center', maxWidth: 160 });

  // 9. QR Code Generation for Integrity Verification
  const verifyUrl = `https://amwal.id/verify-cert/${data.nomorInternalAmwal}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 1,
    width: 200,
    color: {
      dark: '#1B5E20',
      light: '#FFFFFF',
    },
  });

  doc.addImage(qrDataUrl, 'PNG', 26, 212, 28, 28);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text('Pindai untuk verifikasi', 40, 243, { align: 'center' });
  doc.text('keabsahan sertifikat', 40, 246, { align: 'center' });

  // 10. Signature & Official Stamp Section
  const sigX = 135;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 65, 81);
  doc.text(`Surabaya, ${formattedDate}`, sigX, 215, { align: 'center' });
  doc.text('Pengurus Yayasan Manarul Ilmi ITS', sigX, 219, { align: 'center' });

  // Digital Signature Seal
  doc.setDrawColor(27, 94, 32);
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(sigX - 30, 223, 60, 14, 1.5, 1.5, 'FD');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(27, 94, 32);
  doc.text('TERTANDATANGANI SECARA ELEKTRONIK', sigX, 229, { align: 'center' });
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.text('YMI ITS • AMWAL SYSTEM v2.8', sigX, 234, { align: 'center' });

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('Prof. Dr. Ir. Mochamad Ashari, M.Eng.', sigX, 244, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text('Ketua Dewan Pembina YMI ITS', sigX, 248, { align: 'center' });

  // 11. Bottom Security Footer
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.4);
  doc.line(15, 276, width - 15, 276);

  doc.setFontSize(7);
  doc.setTextColor(156, 163, 175);
  doc.text(
    'Sertifikat ini diterbitkan secara otomatis oleh Platform AMWAL dan diakui secara sah sesuai Undang-Undang No. 41 Tahun 2004 tentang Wakaf.',
    width / 2,
    281,
    { align: 'center' }
  );

  // Return PDF ArrayBuffer as Buffer
  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}
