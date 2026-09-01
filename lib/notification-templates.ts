/**
 * Reusable WhatsApp Notification Templates for Amwal HETI ITS
 * 
 * Centralized notification message generators for Waqf, Zakat, and Qurban transactions.
 */

export function waqfThankYouMessage(params: {
  namaOrIsAnonymous: string;
  judulProgram: string;
  nominal: number;
  certificateUrl: string;
}): string {
  const formattedNominal = params.nominal.toLocaleString('id-ID');
  return `Assalamu'alaikum ${params.namaOrIsAnonymous},\n\nJazakumullahu khairan atas wakaf Anda untuk program "${params.judulProgram}" sebesar Rp${formattedNominal}.\n\nSertifikat wakaf digital Anda: ${params.certificateUrl}\n\n- Yayasan Manarul Ilmi ITS`;
}

export function zakatThankYouMessage(params: {
  namaOrIsAnonymous: string;
  jenisZakat: string;
  nominal: number;
  certificateUrl: string;
}): string {
  const formattedNominal = params.nominal.toLocaleString('id-ID');
  return `Assalamu'alaikum ${params.namaOrIsAnonymous},\n\nAlhamdulillah, pembayaran zakat ${params.jenisZakat} Anda sebesar Rp${formattedNominal} telah berhasil diverifikasi dan masuk ke kas asnaf mustahiq.\n\nSertifikat & bukti setor zakat Anda: ${params.certificateUrl}\n\nSemoga Allah mensucikan harta dan memberkahi rezeki Anda sekeluarga.\n\n- Yayasan Manarul Ilmi ITS`;
}

export function qurbanThankYouMessage(params: {
  namaOrIsAnonymous: string;
  jenisHewan: string;
  tipeKepemilikan: string;
  statusPembayaran: string; // 'DP' | 'LUNAS' | string
  nominal: number;
  sisaTagihan?: number;
  certificateUrl?: string;
}): string {
  const formattedNominal = params.nominal.toLocaleString('id-ID');
  const isLunas = params.statusPembayaran === 'LUNAS';

  if (isLunas) {
    const certText = params.certificateUrl ? `\n\nSertifikat shohibul qurban digital Anda: ${params.certificateUrl}` : '';
    return `Assalamu'alaikum ${params.namaOrIsAnonymous},\n\nAlhamdulillah, pembayaran qurban ${params.jenisHewan} (${params.tipeKepemilikan}) Anda sebesar Rp${formattedNominal} telah LUNAS.\n\nAkad wakalah qurban Anda telah sah tercatat.${certText}\n\nSemoga menjadi amal ibadah yang diterima di sisi Allah SWT.\n\n- Yayasan Manarul Ilmi ITS`;
  } else {
    const sisa = (params.sisaTagihan || 0).toLocaleString('id-ID');
    return `Assalamu'alaikum ${params.namaOrIsAnonymous},\n\nTerima kasih, pembayaran uang muka (DP) qurban ${params.jenisHewan} (${params.tipeKepemilikan}) Anda sebesar Rp${formattedNominal} telah kami terima.\n\nSisa tagihan qurban Anda: Rp${sisa}.\nMohon lakukan pelunasan sebelum batas waktu penyembelihan.\n\n- Yayasan Manarul Ilmi ITS`;
  }
}
