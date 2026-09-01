/**
 * Notification Message Templates
 * Reusable WhatsApp and SMS notification templates for Zakat, Waqf, and Qurban modules.
 */

export interface WaqfNotificationParams {
  namaOrIsAnonymous: string;
  judulProgram: string;
  nominal: number;
  certificateUrl?: string;
}

export interface ZakatNotificationParams {
  namaOrIsAnonymous: string;
  jenisZakat: string;
  nominal?: number;
  beratBerasKg?: number;
  nomorKwitansi: string;
  certificateUrl?: string;
}

export interface QurbanNotificationParams {
  namaOrIsAnonymous: string;
  jenisHewan: string;
  tipeKepemilikan?: string;
  statusPembayaran: string;
  nominal: number;
  sisaTagihan?: number;
  certificateUrl?: string;
}

/**
 * Format currency to Indonesian Rupiah
 */
function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Waqf Thank-You Message Template
 */
export function waqfThankYouMessage(params: WaqfNotificationParams): string {
  const { namaOrIsAnonymous, judulProgram, nominal, certificateUrl } = params;
  const formattedNominal = formatRupiah(nominal);

  let msg = `*Jazakallahu khairan, ${namaOrIsAnonymous}!*\n\n`;
  msg += `Alhamdulillah, wakaf Anda untuk program *${judulProgram}* sebesar *${formattedNominal}* telah kami terima dan tercatat di sistem AMWAL.\n\n`;
  msg += `Semoga Allah SWT melipatgandakan pahala jariyah Anda dan memberkahi harta keluarga. Aamiin ya Rabbal 'Alamin.\n`;

  if (certificateUrl) {
    msg += `\n📄 *Sertifikat Wakaf Digital:*\n${certificateUrl}\n`;
  }

  msg += `\n_Layanan Resmi AMWAL - Yayasan Manarul Ilmi ITS_`;
  return msg.trim();
}

/**
 * Zakat Thank-You Message Template
 */
export function zakatThankYouMessage(params: ZakatNotificationParams): string {
  const { namaOrIsAnonymous, jenisZakat, nominal, beratBerasKg, nomorKwitansi, certificateUrl } = params;

  let rincianZakat = '';
  if (nominal && nominal > 0) {
    rincianZakat = formatRupiah(nominal);
  }
  if (beratBerasKg && beratBerasKg > 0) {
    rincianZakat = rincianZakat
      ? `${rincianZakat} (${beratBerasKg} kg beras)`
      : `${beratBerasKg} kg beras`;
  }

  let msg = `*Assalamu'alaikum Warahmatullahi Wabarakatuh*\n\n`;
  msg += `*Jazakallahu khairan katsiran, ${namaOrIsAnonymous}!*\n\n`;
  msg += `Pembayaran *Zakat ${jenisZakat.replace(/_/g, ' ')}* Anda telah berhasil diverifikasi dan masuk ke kas penyaluran Asnaf AMWAL.\n\n`;
  msg += `📋 *Rincian Penerimaan:*\n`;
  msg += `• No. Kwitansi: *${nomorKwitansi}*\n`;
  msg += `• Jumlah: *${rincianZakat || '-'}*\n`;
  msg += `• Status: *TERVERIFIKASI / LUNAS*\n\n`;
  msg += `_“Ambillah zakat dari sebagian harta mereka, dengan zakat itu kamu membersihkan dan menyucikan mereka...” (QS. At-Taubah: 103)_\n\n`;
  msg += `Semoga Allah SWT menyucikan jiwa dan melipatgandakan keberkahan rezeki Anda sekeluarga. Aamiin.\n`;

  if (certificateUrl) {
    msg += `\n📄 *Bukti Setor Zakat / Sertifikat:*\n${certificateUrl}\n`;
  }

  msg += `\n_Layanan Resmi Zakat AMWAL - Yayasan Manarul Ilmi ITS_`;
  return msg.trim();
}

/**
 * Qurban Thank-You Message Template
 */
export function qurbanThankYouMessage(params: QurbanNotificationParams): string {
  const { namaOrIsAnonymous, jenisHewan, tipeKepemilikan, statusPembayaran, nominal, sisaTagihan, certificateUrl } = params;
  const formattedNominal = formatRupiah(nominal);

  let msg = `*Assalamu'alaikum Warahmatullahi Wabarakatuh*\n\n`;
  msg += `*Jazakallahu khairan, ${namaOrIsAnonymous}!*\n\n`;
  msg += `Pembayaran amanah Qurban *${jenisHewan}* (${tipeKepemilikan || 'Individu'}) sebesar *${formattedNominal}* telah kami terima.\n\n`;
  msg += `📋 *Status Pembayaran:* *${statusPembayaran}*\n`;

  if (sisaTagihan && sisaTagihan > 0) {
    msg += `• Sisa Tagihan Pelunasan: *${formatRupiah(sisaTagihan)}*\n`;
  }

  msg += `\nSemoga ibadah qurban ini diterima di sisi Allah SWT dan membawa keberkahan bagi para mustahiq penerima manfaat. Aamiin.\n`;

  if (certificateUrl && statusPembayaran === 'LUNAS') {
    msg += `\n📄 *Sertifikat Qurban Digital:*\n${certificateUrl}\n`;
  }

  msg += `\n_Layanan Qurban AMWAL - Yayasan Manarul Ilmi ITS_`;
  return msg.trim();
}
