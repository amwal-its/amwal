'use client';

import React from 'react';
import {
  Award,
  X,
  QrCode,
  Download,
  Printer,
  Plus,
  Check,
  Send,
  Sparkles,
  Play,
} from 'lucide-react';
import { ZakatTransaction, ShohibulOrder, InfaqProgram } from '@/types/ziswaf';

export interface ZiswafModalsProps {
  // 1. BSZ Modal
  selectedBszMuzakki: ZakatTransaction | null;
  onCloseBsz: () => void;

  // 2. Qurban Cert Modal
  selectedQurbanCert: ShohibulOrder | null;
  onCloseQurbanCert: () => void;

  // 3. QRIS Modal
  isQrisGeneratorOpen: boolean;
  onCloseQris: () => void;
  qrisGenAmount: string;
  setQrisGenAmount: (v: string) => void;
  qrisGenNote: string;
  setQrisGenNote: (v: string) => void;

  // 4. Create Infaq Program Modal
  isCreateInfaqOpen: boolean;
  onCloseCreateInfaq: () => void;
  infaqFormName: string;
  setInfaqFormName: (v: string) => void;
  infaqFormCategory: string;
  setInfaqFormCategory: (v: string) => void;
  infaqFormTarget: string;
  setInfaqFormTarget: (v: string) => void;
  infaqFormNoTarget: boolean;
  setInfaqFormNoTarget: (v: boolean) => void;
  infaqFormDesc: string;
  setInfaqFormDesc: (v: string) => void;
  onSubmitCreateInfaq: () => void;

  // 5. Manual Infaq Modal
  isManualInfaqOpen: boolean;
  onCloseManualInfaq: () => void;
  infaqManualDonor: string;
  setInfaqManualDonor: (v: string) => void;
  infaqManualAmount: string;
  setInfaqManualAmount: (v: string) => void;
  infaqManualProgram: string;
  setInfaqManualProgram: (v: string) => void;
  infaqManualMethod: string;
  setInfaqManualMethod: (v: string) => void;
  infaqPrograms: InfaqProgram[];
  onSubmitManualInfaq: () => void;

  // 6. Record Zakat Modal
  isRecordZakatOpen: boolean;
  onCloseRecordZakat: () => void;
  zakatMuzakkiName: string;
  setZakatMuzakkiName: (v: string) => void;
  zakatMuzakkiPhone: string;
  setZakatMuzakkiPhone: (v: string) => void;
  zakatMuzakkiNpwp: string;
  setZakatMuzakkiNpwp: (v: string) => void;
  zakatTypeSelected: string;
  setZakatTypeSelected: (v: string) => void;
  zakatNominalInput: string;
  setZakatNominalInput: (v: string) => void;
  zakatCalcNote: string;
  setZakatCalcNote: (v: string) => void;
  onSubmitRecordZakat: () => void;

  // 7. Distribute Asnaf Modal
  isDistributeAsnafOpen: boolean;
  onCloseDistributeAsnaf: () => void;
  selectedAsnafTarget: string;
  setSelectedAsnafTarget: (v: string) => void;
  distributeNominal: string;
  setDistributeNominal: (v: string) => void;
  distributeBeneficiaryCount: string;
  setDistributeBeneficiaryCount: (v: string) => void;
  distributeNotes: string;
  setDistributeNotes: (v: string) => void;
  onSubmitDistributeAsnaf: () => void;

  // 8. Add Shohibul Modal
  isAddShohibulOpen: boolean;
  onCloseAddShohibul: () => void;
  shohibulBuyerName: string;
  setShohibulBuyerName: (v: string) => void;
  shohibulQurbanName: string;
  setShohibulQurbanName: (v: string) => void;
  shohibulAnimalChoice: string;
  setShohibulAnimalChoice: (v: string) => void;
  shohibulDistOption: string;
  setShohibulDistOption: (v: string) => void;
  onSubmitAddShohibul: () => void;

  // 9. RPH Stream Modal
  selectedRphStream: ShohibulOrder | null;
  onCloseRphStream: () => void;

  // 10. Shohibul WA Report Modal
  selectedShohibulReport: ShohibulOrder | null;
  onCloseShohibulReport: () => void;

  onShowToast: (params: { title: string; description: string; type?: 'success' | 'error' | 'info' }) => void;
}

export function ZiswafModals(props: ZiswafModalsProps) {
  const {
    selectedBszMuzakki,
    onCloseBsz,
    selectedQurbanCert,
    onCloseQurbanCert,
    isQrisGeneratorOpen,
    onCloseQris,
    qrisGenAmount,
    setQrisGenAmount,
    qrisGenNote,
    setQrisGenNote,
    isCreateInfaqOpen,
    onCloseCreateInfaq,
    infaqFormName,
    setInfaqFormName,
    infaqFormCategory,
    setInfaqFormCategory,
    infaqFormTarget,
    setInfaqFormTarget,
    infaqFormNoTarget,
    setInfaqFormNoTarget,
    infaqFormDesc,
    setInfaqFormDesc,
    onSubmitCreateInfaq,
    isManualInfaqOpen,
    onCloseManualInfaq,
    infaqManualDonor,
    setInfaqManualDonor,
    infaqManualAmount,
    setInfaqManualAmount,
    infaqManualProgram,
    setInfaqManualProgram,
    infaqManualMethod,
    setInfaqManualMethod,
    infaqPrograms,
    onSubmitManualInfaq,
    isRecordZakatOpen,
    onCloseRecordZakat,
    zakatMuzakkiName,
    setZakatMuzakkiName,
    zakatMuzakkiPhone,
    setZakatMuzakkiPhone,
    zakatMuzakkiNpwp,
    setZakatMuzakkiNpwp,
    zakatTypeSelected,
    setZakatTypeSelected,
    zakatNominalInput,
    setZakatNominalInput,
    zakatCalcNote,
    setZakatCalcNote,
    onSubmitRecordZakat,
    isDistributeAsnafOpen,
    onCloseDistributeAsnaf,
    selectedAsnafTarget,
    setSelectedAsnafTarget,
    distributeNominal,
    setDistributeNominal,
    distributeBeneficiaryCount,
    setDistributeBeneficiaryCount,
    distributeNotes,
    setDistributeNotes,
    onSubmitDistributeAsnaf,
    isAddShohibulOpen,
    onCloseAddShohibul,
    shohibulBuyerName,
    setShohibulBuyerName,
    shohibulQurbanName,
    setShohibulQurbanName,
    shohibulAnimalChoice,
    setShohibulAnimalChoice,
    shohibulDistOption,
    setShohibulDistOption,
    onSubmitAddShohibul,
    selectedRphStream,
    onCloseRphStream,
    selectedShohibulReport,
    onCloseShohibulReport,
    onShowToast,
  } = props;

  return (
    <>
      {/* 1. MODAL: BUKTI SETOR ZAKAT (BSZ) */}
      {selectedBszMuzakki && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Bukti Setor Zakat (BSZ) Resmi</h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedBszMuzakki.bszNumber}</p>
                </div>
              </div>
              <button onClick={onCloseBsz} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Certificate Card */}
            <div className="p-5 bg-gradient-to-b from-amber-50/40 via-white to-emerald-50/30 border-2 border-emerald-700/30 rounded-xl space-y-4 relative overflow-hidden">
              <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                <div>
                  <div className="text-[11px] font-bold tracking-wider text-[#1B5E20] uppercase font-serif">
                    LEMBAGA AMIL ZAKAT INFAQ SHADAQAH AMWAL
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Izin Kemenag RI No. 892/2023 • Teraudit BAZNAS RI
                  </div>
                </div>
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg p-1 flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-slate-900" />
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                  <span className="text-slate-500">Nama Muzakki:</span>
                  <span className="font-bold text-slate-900">{selectedBszMuzakki.muzakkiName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                  <span className="text-slate-500">Kategori Zakat:</span>
                  <span className="font-semibold text-teal-800">{selectedBszMuzakki.type}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                  <span className="text-slate-500">Rincian Perhitungan:</span>
                  <span className="font-mono text-slate-700 text-right">{selectedBszMuzakki.calculation}</span>
                </div>
                <div className="flex justify-between py-2 border-y-2 border-emerald-600 bg-emerald-50/50 px-2 rounded-lg">
                  <span className="font-bold text-slate-800">JUMLAH ZAKAT:</span>
                  <span className="font-extrabold text-emerald-900 font-mono text-sm">
                    Rp {selectedBszMuzakki.amount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-lg text-[10px] text-amber-900 leading-relaxed">
                <strong>Legalitas Fiskal:</strong> Bukti Setor Zakat ini sah sebagai pengurang Penghasilan Bruto dalam perhitungan SPT Tahunan Pajak Penghasilan (PPh) sesuai Pasal 22 UU No. 23 Tahun 2011 &amp; Peraturan Dirjen Pajak No. PER-06/PJ/2011.
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  onShowToast({
                    title: 'Unduh BSZ PDF',
                    description: `Mengunduh berkas ${selectedBszMuzakki.bszNumber}.pdf...`,
                    type: 'success',
                  });
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh PDF
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onShowToast({
                      title: 'Mencetak BSZ',
                      description: `Mengirim perintah cetak untuk ${selectedBszMuzakki.muzakkiName}...`,
                      type: 'info',
                    });
                  }}
                  className="px-3 py-1.5 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak Dokumen
                </button>
                <button
                  onClick={onCloseBsz}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL: SERTIFIKAT QURBAN DIGITAL */}
      {selectedQurbanCert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Sertifikat Qurban Digital 1447 H</h3>
                  <p className="text-xs text-slate-500 font-mono">ID: {selectedQurbanCert.id}</p>
                </div>
              </div>
              <button onClick={onCloseQurbanCert} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-gradient-to-b from-amber-50/60 via-white to-emerald-50/40 border-2 border-emerald-700/40 rounded-xl space-y-4 text-center relative overflow-hidden">
              <div className="text-[11px] font-bold tracking-widest text-[#1B5E20] uppercase font-serif">
                LEMBAGA AMIL ZISWAF AMWAL INDONESIA
              </div>
              <h2 className="text-base font-extrabold text-slate-900 font-serif uppercase tracking-wide">
                SERTIFIKAT IBADAH QURBAN
              </h2>
              <p className="text-xs text-slate-600">Diberikan sebagai bukti sah pelaksanaan ibadah qurban atas nama:</p>

              <div className="py-2 px-4 bg-emerald-50 border-y border-emerald-300 rounded-lg">
                <div className="text-sm font-extrabold text-emerald-950 font-serif">{selectedQurbanCert.qurbanNames}</div>
                <div className="text-xs text-slate-600 font-mono mt-0.5">{selectedQurbanCert.animalType}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-left text-[11px] pt-2 border-t border-dashed border-slate-200">
                <div>
                  <span className="text-slate-500 block">Shohibul / Pemesan:</span>
                  <strong>{selectedQurbanCert.buyerName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Distribusi Daging:</span>
                  <strong>{selectedQurbanCert.distributionOption}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Waktu Sembelih:</span>
                  <strong>10 Dzulhijjah 1447 H</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Juru Sembelih Halal:</span>
                  <strong>Juleha Sertifikasi MUI</strong>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-200">
                <div className="text-left text-[10px] text-slate-500 font-mono">
                  <div>Tagging QR: #HALAL-{selectedQurbanCert.id}</div>
                  <div>Verifikasi: amwal.id/verify/{selectedQurbanCert.id}</div>
                </div>
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg p-1 flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-slate-900" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  onShowToast({
                    title: 'Unduh Sertifikat PDF',
                    description: `Mengunduh sertifikat ${selectedQurbanCert.id}.pdf...`,
                    type: 'success',
                  });
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh PDF
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onShowToast({
                      title: 'Mencetak Sertifikat',
                      description: `Mengirim sertifikat qurban ${selectedQurbanCert.qurbanNames} ke printer...`,
                      type: 'info',
                    });
                  }}
                  className="px-3.5 py-1.5 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak Sertifikat
                </button>
                <button onClick={onCloseQurbanCert} className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer">
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MODAL: QRIS GENERATOR */}
      {isQrisGeneratorOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-200 text-center">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-left">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#1B5E20]" />
                <h3 className="text-sm font-bold text-slate-900">QRIS Dinamis Instan</h3>
              </div>
              <button onClick={onCloseQris} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-left">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nominal Custom (Rp)</label>
                <input
                  type="number"
                  value={qrisGenAmount}
                  onChange={(e) => setQrisGenAmount(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-center font-bold text-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Akad</label>
                <input
                  type="text"
                  value={qrisGenNote}
                  onChange={(e) => setQrisGenNote(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                ZISWAF AMWAL NUSANTARA
              </div>
              <div className="w-44 h-44 mx-auto bg-white p-3 rounded-lg border border-slate-300 shadow-xs flex items-center justify-center">
                <QrCode className="w-36 h-36 text-slate-900" />
              </div>
              <div className="font-mono text-base font-extrabold text-emerald-900">
                Rp {Number(qrisGenAmount || 0).toLocaleString('id-ID')}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                ID1020039281920 • Standar QRIS BI &amp; ASPI
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={() => {
                  onShowToast({
                    title: 'Unduh Stiker QRIS',
                    description: 'Mengunduh format PNG siap cetak resolusi tinggi...',
                    type: 'success',
                  });
                }}
                className="w-1/2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh PNG
              </button>
              <button
                onClick={() => {
                  onShowToast({
                    title: 'Cetak Display Kasir',
                    description: 'Mengirim dokumen ke printer kasir/thermal...',
                    type: 'info',
                  });
                }}
                className="w-1/2 px-3 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak Stiker
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL: BUAT PROGRAM INFAQ */}
      {isCreateInfaqOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Inisiasi Program Akad Infaq Baru</h3>
                  <p className="text-xs text-slate-500">Buat program penghimpunan infaq/sedekah tematik</p>
                </div>
              </div>
              <button onClick={onCloseCreateInfaq} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Program Infaq *</label>
                <input
                  type="text"
                  placeholder="Contoh: Sedekah Paket Nutrisi Balita Dhuafa"
                  value={infaqFormName}
                  onChange={(e) => setInfaqFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori Akad *</label>
                  <select
                    value={infaqFormCategory}
                    onChange={(e) => setInfaqFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] transition"
                  >
                    <option value="Infaq Subuh">Infaq Subuh</option>
                    <option value="Infaq Yatim & Dhuafa">Infaq Yatim &amp; Dhuafa</option>
                    <option value="Sedekah Jariyah">Sedekah Jariyah</option>
                    <option value="Infaq Masjid & Sarana">Infaq Masjid &amp; Sarana</option>
                    <option value="Infaq Tanggap Bencana">Infaq Tanggap Bencana</option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-slate-700">
                      Target Penghimpunan (Rp) {!infaqFormNoTarget && '*'}
                    </label>
                    <label className="flex items-center gap-1.5 text-[11px] text-[#1B5E20] font-semibold cursor-pointer select-none bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 hover:bg-emerald-100 transition">
                      <input
                        type="checkbox"
                        checked={infaqFormNoTarget}
                        onChange={(e) => {
                          setInfaqFormNoTarget(e.target.checked);
                          if (e.target.checked) setInfaqFormTarget('');
                        }}
                        className="rounded text-[#1B5E20] focus:ring-[#1B5E20] w-3.5 h-3.5 cursor-pointer accent-[#1B5E20]"
                      />
                      <span>Tanpa Target</span>
                    </label>
                  </div>
                  {infaqFormNoTarget ? (
                    <div className="w-full px-3 py-2 bg-emerald-50/90 border border-emerald-300 rounded-lg text-xs text-[#1B5E20] font-semibold flex items-center gap-1.5 h-[38px]">
                      <Sparkles className="w-3.5 h-3.5 text-[#1B5E20] shrink-0" />
                      <span className="truncate">Program Terbuka &amp; Berkelanjutan (Tanpa Batas)</span>
                    </div>
                  ) : (
                    <input
                      type="number"
                      placeholder="Contoh: 100000000"
                      value={infaqFormTarget}
                      onChange={(e) => setInfaqFormTarget(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] transition font-mono h-[38px]"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi &amp; Peruntukan Manfaat</label>
                <textarea
                  rows={2}
                  placeholder="Rincian penyaluran bantuan dan kelompok penerima manfaat..."
                  value={infaqFormDesc}
                  onChange={(e) => setInfaqFormDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] transition"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button onClick={onCloseCreateInfaq} className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer">
                Batal
              </button>
              <button
                onClick={onSubmitCreateInfaq}
                className="px-4 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                Simpan &amp; Terbitkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: INPUT INFAQ MANUAL */}
      {isManualInfaqOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Pencatatan Donasi Infaq / Sedekah</h3>
                  <p className="text-xs text-slate-500">Catat donasi tunai langsung atau konfirmasi transfer kasir</p>
                </div>
              </div>
              <button onClick={onCloseManualInfaq} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Donatur / Pembayar *</label>
                <input
                  type="text"
                  placeholder="Contoh: Hamba Allah / H. Fajarudin"
                  value={infaqManualDonor}
                  onChange={(e) => setInfaqManualDonor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nominal Donasi (Rp) *</label>
                  <input
                    type="number"
                    placeholder="Contoh: 100000"
                    value={infaqManualAmount}
                    onChange={(e) => setInfaqManualAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] transition font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Metode Penerimaan *</label>
                  <select
                    value={infaqManualMethod}
                    onChange={(e) => setInfaqManualMethod(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] transition"
                  >
                    <option value="Kasir Tunai / Kotak Infaq">Kasir Tunai / Kotak Infaq</option>
                    <option value="QRIS Syariah (BSI)">QRIS Syariah (BSI)</option>
                    <option value="BSI Virtual Account">BSI Virtual Account</option>
                    <option value="Transfer Bank Muamalat">Transfer Bank Muamalat</option>
                    <option value="BCA Syariah">BCA Syariah</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alokasi Program Infaq</label>
                <select
                  value={infaqManualProgram}
                  onChange={(e) => setInfaqManualProgram(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] transition"
                >
                  {infaqPrograms.map((p) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button onClick={onCloseManualInfaq} className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer">
                Batal
              </button>
              <button
                onClick={onSubmitManualInfaq}
                className="px-4 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                Catat Transaksi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: CATAT ZAKAT & BSZ */}
      {isRecordZakatOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Pencatatan Setoran Zakat &amp; BSZ</h3>
                  <p className="text-xs text-slate-500">Penerbitan Bukti Setor Zakat Standar BAZNAS RI</p>
                </div>
              </div>
              <button onClick={onCloseRecordZakat} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Muzakki *</label>
                  <input
                    type="text"
                    placeholder="Contoh: H. Ahmad Subardjo"
                    value={zakatMuzakkiName}
                    onChange={(e) => setZakatMuzakkiName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] transition"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. HP / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="0812xxxxxxxx"
                    value={zakatMuzakkiPhone}
                    onChange={(e) => setZakatMuzakkiPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] transition font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NPWP Muzakki (Pengurang Pajak)</label>
                  <input
                    type="text"
                    placeholder="00.000.000.0-000.000"
                    value={zakatMuzakkiNpwp}
                    onChange={(e) => setZakatMuzakkiNpwp(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] transition font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Zakat *</label>
                  <select
                    value={zakatTypeSelected}
                    onChange={(e) => setZakatTypeSelected(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] transition"
                  >
                    <option value="Zakat Maal - Penghasilan">Zakat Maal - Penghasilan</option>
                    <option value="Zakat Fitrah">Zakat Fitrah</option>
                    <option value="Zakat Maal - Emas/Tabungan">Zakat Maal - Emas/Tabungan</option>
                    <option value="Zakat Maal - Perdagangan">Zakat Maal - Perdagangan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nominal Zakat (Rp) *</label>
                  <input
                    type="number"
                    placeholder="Contoh: 1500000"
                    value={zakatNominalInput}
                    onChange={(e) => setZakatNominalInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] transition font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Keterangan / Dasar Hitung</label>
                  <input
                    type="text"
                    placeholder="Gaji bruto x 2.5% atau Jumlah Jiwa"
                    value={zakatCalcNote}
                    onChange={(e) => setZakatCalcNote(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] transition"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button onClick={onCloseRecordZakat} className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer">
                Batal
              </button>
              <button
                onClick={onSubmitRecordZakat}
                className="px-4 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                Simpan &amp; Terbitkan BSZ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL: DISTRIBUSI ASNAF */}
      {isDistributeAsnafOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Pencatatan Distribusi Penyaluran Asnaf</h3>
                  <p className="text-xs text-slate-500">Pencatatan realisasi penyaluran dana zakat ke 8 Asnaf</p>
                </div>
              </div>
              <button onClick={onCloseDistributeAsnaf} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Golongan Asnaf Penerima *</label>
                <select
                  value={selectedAsnafTarget}
                  onChange={(e) => setSelectedAsnafTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] transition"
                >
                  <option value="Fakir">Asnaf Fakir (Santunan Tunai &amp; Pangan)</option>
                  <option value="Miskin">Asnaf Miskin (Pemberdayaan Usaha &amp; Nutrisi)</option>
                  <option value="Amil">Asnaf Amil (Hak Operasional Pengelola)</option>
                  <option value="Muallaf">Asnaf Muallaf (Penguatan Aqidah &amp; Modal)</option>
                  <option value="Riqab">Asnaf Riqab (Advokasi Buruh &amp; Kemanusiaan)</option>
                  <option value="Gharimin">Asnaf Gharimin (Pelunasan Hutang Darurat)</option>
                  <option value="Fisabilillah">Asnaf Fisabilillah (Dai &amp; Santri Pedalaman)</option>
                  <option value="Ibnu Sabil">Asnaf Ibnu Sabil (Bantuan Musafir)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nominal Tersalurkan (Rp) *</label>
                  <input
                    type="number"
                    placeholder="Contoh: 15000000"
                    value={distributeNominal}
                    onChange={(e) => setDistributeNominal(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] transition font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jumlah Penerima Manfaat (Jiwa/KK) *</label>
                  <input
                    type="number"
                    placeholder="Contoh: 50"
                    value={distributeBeneficiaryCount}
                    onChange={(e) => setDistributeBeneficiaryCount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] transition font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Program &amp; Lokasi Penyaluran</label>
                <textarea
                  rows={2}
                  placeholder="Wilayah penyaluran, dokumentasi serah terima, dan nama koordinator lapangan..."
                  value={distributeNotes}
                  onChange={(e) => setDistributeNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] transition"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button onClick={onCloseDistributeAsnaf} className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer">
                Batal
              </button>
              <button
                onClick={onSubmitDistributeAsnaf}
                className="px-4 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                Bukukan Penyaluran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL: DAFTAR SHOHIBUL QURBAN */}
      {isAddShohibulOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Pendaftaran Shohibul Qurban 1447 H</h3>
                  <p className="text-xs text-slate-500">Pencatatan akad wakalah dan alokasi slot kelompok sapi</p>
                </div>
              </div>
              <button onClick={onCloseAddShohibul} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Pemesan / Penanggung Jawab *</label>
                  <input
                    type="text"
                    placeholder="Contoh: H. Danang Wijaya"
                    value={shohibulBuyerName}
                    onChange={(e) => setShohibulBuyerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] transition"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lafazh Nama Shohibul Qurban (bin/binti) *</label>
                  <input
                    type="text"
                    placeholder="Contoh: Danang Wijaya bin H. Wijaya"
                    value={shohibulQurbanName}
                    onChange={(e) => setShohibulQurbanName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pilihan Hewan / Slot *</label>
                  <select
                    value={shohibulAnimalChoice}
                    onChange={(e) => setShohibulAnimalChoice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] transition"
                  >
                    <option value="Slot 1/7 Sapi (Sapi 02)">Slot 1/7 Sapi (Sapi 02 - Tersisa 2 Slot)</option>
                    <option value="Slot 1/7 Sapi (Sapi 03)">Slot 1/7 Sapi (Sapi 03 - Tersisa 5 Slot)</option>
                    <option value="Kambing / Domba Standar Grade B">Kambing / Domba Standar Grade B (Rp 2.450.000)</option>
                    <option value="Sapi Utuh Simental Super">Sapi Utuh Simental Super (Rp 24.500.000)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Opsi Distribusi Daging *</label>
                  <select
                    value={shohibulDistOption}
                    onChange={(e) => setShohibulDistOption(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] transition"
                  >
                    <option value="Disalurkan 100% (Pelosok 3T)">Disalurkan 100% (Pelosok 3T &amp; Dhuafa)</option>
                    <option value="Hak 1/3 Bagian Diambil (Diantar ke Rumah)">Hak 1/3 Bagian Diambil (Diantar ke Rumah)</option>
                    <option value="Olahan Kaleng Kornet (Bantuan Bencana)">Olahan Kaleng Kornet (Bantuan Bencana)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-slate-800">
                <span className="font-bold text-emerald-950 block mb-1">Iqrar Akad Wakalah Qurban:</span>
                <p className="italic text-[11px] font-serif text-emerald-900 leading-relaxed">
                  &quot;Saya mewakilkan dan menyerahkan sepenuhnya pembelian, penyembelihan secara syar&apos;i, dan pendistribusian hewan qurban ini kepada Lembaga Amil Amwal lillahi ta&apos;ala.&quot;
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button onClick={onCloseAddShohibul} className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer">
                Batal
              </button>
              <button
                onClick={onSubmitAddShohibul}
                className="px-4 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                Daftarkan &amp; Cetak Akad
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. MODAL: RPH LIVE STREAM */}
      {selectedRphStream && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <Play className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Dokumentasi Video RPH Terpadu</h3>
                  <p className="text-xs text-slate-500">Shohibul: {selectedRphStream.qurbanNames}</p>
                </div>
              </div>
              <button onClick={onCloseRphStream} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-56 bg-slate-950 rounded-xl relative overflow-hidden flex flex-col justify-between p-3 text-white border border-slate-800">
              <div className="flex items-center justify-between text-[11px]">
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  REKAMAN RPH TERAKREDITASI
                </span>
                <span className="font-mono text-slate-300">10 Dzulhijjah • 08:42:15 WIB</span>
              </div>

              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto hover:scale-105 transition cursor-pointer">
                  <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                </div>
                <div className="text-xs font-bold text-emerald-300">
                  {selectedRphStream.qurbanNames} ({selectedRphStream.animalType})
                </div>
                <p className="text-[10px] text-slate-400">Juru Sembelih Halal membacakan basmalah &amp; lafazh qurban</p>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-white/10 pt-1">
                <span>Kamera 02 - Area Penyembelihan Halal</span>
                <span className="font-mono">Resolusi 1080p HD</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-700">
              <div className="font-semibold text-slate-900 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Status Syar&apos;i Terverifikasi
              </div>
              <p className="text-[11px] text-slate-600">
                Penyembelihan dilakukan oleh Juleha tersertifikasi dengan pemotongan 3 saluran (hulqum, mari&apos;, dan wadajayn) dalam satu gerakan terpadu.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => {
                  onShowToast({
                    title: 'Unduh Video Dokumentasi',
                    description: 'Memulai pengunduhan video penyembelihan MP4 HD (48 MB)...',
                    type: 'success',
                  });
                }}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh Video MP4
              </button>
              <button onClick={onCloseRphStream} className="px-4 py-1.5 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-lg text-xs font-bold cursor-pointer">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. MODAL: WA REPORT BLAST */}
      {selectedShohibulReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Kirim Laporan Qurban via WhatsApp</h3>
                  <p className="text-xs text-slate-500">Shohibul: <strong>{selectedShohibulReport.buyerName}</strong></p>
                </div>
              </div>
              <button onClick={onCloseShohibulReport} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                Pratinjau Pesan WhatsApp Otomatis:
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-800 font-mono text-[11px] leading-relaxed whitespace-pre-line shadow-xs">
                {`Assalamu'alaikum Wr. Wb. Bapak/Ibu ${selectedShohibulReport.buyerName},
Alhamdulillah hewan qurban atas nama:
✨ ${selectedShohibulReport.qurbanNames} (${selectedShohibulReport.animalType})

Telah disembelih secara syar'i oleh Tim Juru Sembelih Halal (Juleha) Amwal pada Hari Raya Idul Adha di RPH Terpadu.

📹 Tonton Video Dokumentasi Penyembelihan:
https://amwal.id/qurban/stream/${selectedShohibulReport.id}

📜 Unduh Sertifikat Qurban Resmi:
https://amwal.id/cert/${selectedShohibulReport.id}.pdf

Jazakumullah Khairan Katsiran.`}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button onClick={onCloseShohibulReport} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer">
                Batal
              </button>
              <button
                onClick={() => {
                  onShowToast({
                    title: 'Laporan WhatsApp Terkirim',
                    description: `Pesan dan link video penyembelihan berhasil dikirim ke nomor WhatsApp ${selectedShohibulReport.buyerName}.`,
                    type: 'success',
                  });
                  onCloseShohibulReport();
                }}
                className="px-4 py-1.5 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                Kirim Blast WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
