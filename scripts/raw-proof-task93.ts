import {
  waqfThankYouMessage,
  zakatThankYouMessage,
  qurbanThankYouMessage,
} from '../lib/notification-templates';

async function main() {
  console.log('=== RAW PROOF TASK 9.3: NOTIFICATION TEMPLATES GENERATOR ===\n');

  // A. WAKAF (Lunas + Link Sertifikat)
  const wakafMsg = waqfThankYouMessage({
    namaOrIsAnonymous: 'Ahmad Fauzi',
    judulProgram: 'Program Wakaf Sumur Air Bersih Nurul Amanah',
    nominal: 500000,
    certificateUrl: 'https://amwal.its.ac.id/wakaf/transaksi/WKF-20260902-001/sertifikat',
  });
  console.log('[OUTPUT A - WAKAF LUNAS + SERTIFIKAT]:');
  console.log('--------------------------------------------------');
  console.log(wakafMsg);
  console.log('--------------------------------------------------\n');

  // B. ZAKAT (Lunas + Nomor BSZ / Bukti Setor Zakat)
  const zakatMsg = zakatThankYouMessage({
    namaOrIsAnonymous: 'Siti Nurhaliza',
    jenisZakat: 'Zakat Maal Penghasilan',
    nominal: 1250000,
    certificateUrl: 'https://amwal.its.ac.id/zakat/transaksi/ZKT-20260902-002/sertifikat',
  });
  console.log('[OUTPUT B - ZAKAT LUNAS + BUKTI SETOR ZAKAT]:');
  console.log('--------------------------------------------------');
  console.log(zakatMsg);
  console.log('--------------------------------------------------\n');

  // C. QURBAN LUNAS
  const qurbanLunasMsg = qurbanThankYouMessage({
    namaOrIsAnonymous: 'Dr. Ir. Hendro Prasetyo',
    jenisHewan: 'Sapi Patungan 1/7',
    tipeKepemilikan: 'Kolektif',
    statusPembayaran: 'LUNAS',
    nominal: 3500000,
    certificateUrl: 'https://amwal.its.ac.id/qurban/transaksi/QRB-20260902-003/sertifikat',
  });
  console.log('[OUTPUT C1 - QURBAN LUNAS + SERTIFIKAT SHOHIBUL QURBAN]:');
  console.log('--------------------------------------------------');
  console.log(qurbanLunasMsg);
  console.log('--------------------------------------------------\n');

  // D. QURBAN STATUS DP (Harus terlihat teks sisa pelunasannya)
  const qurbanDpMsg = qurbanThankYouMessage({
    namaOrIsAnonymous: 'Bambang Sudibyo',
    jenisHewan: 'Kambing Tipe A',
    tipeKepemilikan: 'Individu',
    statusPembayaran: 'DP',
    nominal: 1000000,
    sisaTagihan: 2000000,
  });
  console.log('[OUTPUT C2 - QURBAN STATUS DP DENGAN SISA PELUNASAN]:');
  console.log('--------------------------------------------------');
  console.log(qurbanDpMsg);
  console.log('--------------------------------------------------\n');
}

main().catch(console.error);
