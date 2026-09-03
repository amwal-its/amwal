'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Building2,
  Layers,
  Receipt,
  PlusCircle,
  Upload,
  Edit3,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  Sparkles,
  Eye,
  Check,
  X,
  PackageCheck,
  Landmark,
  Image as ImageIcon,
  Sliders,
  FileSpreadsheet,
  Download,
  Search,
  ExternalLink,
  ShieldCheck,
  Send,
  RefreshCw,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface NazhirDashboardProps {
  onNavigateTab?: (tab: string) => void;
  defaultView?: 'create' | 'manage' | 'receipts';
}

export interface WaqfProgram {
  id: string;
  name: string;
  description: string;
  bannerImage: string;
  supportingDoc: string;
  targetAmount: number;
  collectedAmount: number;
  durationStart: string;
  durationEnd: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  province: string;
  city: string;
  addressDetail: string;
  jenisWakaf: 'Wakaf Uang' | 'Wakaf Melalui Uang';
  kategori: string;
  progressFisik: number;
  status: 'Aktif' | 'Selesai' | 'Draf';
  receipts: ReceiptItem[];
}

export interface ReceiptItem {
  id: string;
  title: string;
  vendor: string;
  amount: number;
  date: string;
  fileName: string;
  status: 'Menunggu Verifikasi DPS' | 'Terverifikasi DPS' | 'Perlu Perbaikan';
  ocrDetected?: boolean;
}

export function NazhirDashboardView({ onNavigateTab, defaultView = 'manage' }: NazhirDashboardProps = {}) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'detail' | 'receipts'>(defaultView);

  // Filters for Receipts Page
  const [receiptFilterProgram, setReceiptFilterProgram] = useState<string>('all');
  const [receiptFilterStatus, setReceiptFilterStatus] = useState<string>('all');
  const [receiptSearchTerm, setReceiptSearchTerm] = useState<string>('');

  // Selected Receipt for detailed modal preview (with OCR & DPS audit notes)
  const [selectedReceiptForPreview, setSelectedReceiptForPreview] = useState<(ReceiptItem & { programName?: string; programId?: string }) | null>(null);

  // Initial Programs State
  const [programs, setPrograms] = useState<WaqfProgram[]>([
    {
      id: 'PROG-WK-001',
      name: 'Waqf Pembangunan Klinik Air Bersih & RS Gratis Al-Azhar',
      description: 'Pembangunan fasilitas klinik air bersih, sanitasi modern, dan poliklinik dhuafa terpadu berkapasitas 50 tempat tidur untuk masyarakat prasejahtera di Jawa Barat.',
      bannerImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80',
      supportingDoc: 'Surat_Ikrar_Wakaf_Tanah_dan_RAB_Klinik.pdf',
      targetAmount: 2500000000,
      collectedAmount: 1750000000,
      durationStart: '01 Jan 2026',
      durationEnd: '31 Des 2026',
      bankName: 'Bank Syariah Indonesia (BSI)',
      bankAccountNumber: '711-889-2234',
      bankAccountHolder: 'Yayasan Waqf Al-Kautsar Nusantara',
      province: 'Jawa Barat',
      city: 'Kabupaten Sukabumi',
      addressDetail: 'Jl. Raya Pelabuhan Ratu Km 12, Kec. Cikembar',
      jenisWakaf: 'Wakaf Uang',
      kategori: 'Kesehatan & Sanitasi',
      progressFisik: 65,
      status: 'Aktif',
      receipts: [
        {
          id: 'RCP-001',
          title: 'Pengadaan Pipa Galvanis 3 Inch & Pompa Submersible 3 HP',
          vendor: 'PT Mandiri Teknik Utama Jaya',
          amount: 18500000,
          date: '10 Agt 2026',
          fileName: 'Kuitansi_Pipa_02.png',
          status: 'Terverifikasi DPS',
          ocrDetected: true,
        },
        {
          id: 'RCP-002',
          title: 'Pengadaan Semen Tiga Roda 60 Sak & Pasir Cor',
          vendor: 'TB Berkah Bangunan Sukabumi',
          amount: 5550000,
          date: '01 Agt 2026',
          fileName: 'Kuitansi_Material_Semen.jpg',
          status: 'Terverifikasi DPS',
          ocrDetected: true,
        },
      ],
    },
    {
      id: 'PROG-WK-002',
      name: 'Waqf Renovasi Gedung Sekolah Tahfidz & Asrama Yatim',
      description: 'Revitalisasi gedung asrama 3 lantai bagi 120 santri tahfidz penghafal Al-Qur’an yatim dhuafa dengan standar kenyamanan dan ketahanan gempa.',
      bannerImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&auto=format&fit=crop&q=80',
      supportingDoc: 'Proposal_Renovasi_Asrama_Yatim_2026.pdf',
      targetAmount: 850000000,
      collectedAmount: 620000000,
      durationStart: '15 Feb 2026',
      durationEnd: '30 Okt 2026',
      bankName: 'Bank Muamalat Indonesia',
      bankAccountNumber: '340-001-9981',
      bankAccountHolder: 'Yayasan Waqf Al-Kautsar Nusantara',
      province: 'DKI Jakarta',
      city: 'Kota Jakarta Selatan',
      addressDetail: 'Jl. Tebet Barat Raya No. 44, Kec. Tebet',
      jenisWakaf: 'Wakaf Melalui Uang',
      kategori: 'Pendidikan & Ibadah',
      progressFisik: 42,
      status: 'Aktif',
      receipts: [
        {
          id: 'RCP-003',
          title: 'Pembelian Keramik Lantai Granit 60x60 (100 Dus)',
          vendor: 'Depo Bangunan Lenteng Agung',
          amount: 21000000,
          date: '05 Agt 2026',
          fileName: 'Nota_Granit_Asrama.pdf',
          status: 'Menunggu Verifikasi DPS',
          ocrDetected: true,
        },
      ],
    },
    {
      id: 'PROG-WK-003',
      name: 'Wakaf Produktif Lahan Perkebunan Kurma & Hidroponik Santri',
      description: 'Pemberdayaan ekonomi umat berbasis perkebunan kurma tropis dan 20 modul greenhouse hidroponik bernilai ekonomis tinggi untuk kemandirian pesantren.',
      bannerImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&auto=format&fit=crop&q=80',
      supportingDoc: 'Sertifikat_Lahan_dan_Feasibility_Study.pdf',
      targetAmount: 1200000000,
      collectedAmount: 980000000,
      durationStart: '01 Mar 2026',
      durationEnd: '15 Nov 2026',
      bankName: 'Bank Syariah Indonesia (BSI)',
      bankAccountNumber: '711-889-4411',
      bankAccountHolder: 'Yayasan Waqf Al-Kautsar Nusantara',
      province: 'Jawa Barat',
      city: 'Kabupaten Bogor',
      addressDetail: 'Kawasan Agrowisata Cijeruk, Kec. Cijeruk',
      jenisWakaf: 'Wakaf Uang',
      kategori: 'Ekonomi / Produktif',
      progressFisik: 80,
      status: 'Aktif',
      receipts: [
        {
          id: 'RCP-004',
          title: 'Pengadaan Bibit Kurma Kultur Jaringan Barhee (50 Batang)',
          vendor: 'PT Agro Nusantara Sejahtera',
          amount: 45000000,
          date: '28 Jul 2026',
          fileName: 'Invoice_Bibit_Kurma.jpg',
          status: 'Terverifikasi DPS',
          ocrDetected: true,
        },
      ],
    },
  ]);

  // Form State for "Buat Program"
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formBannerImage, setFormBannerImage] = useState('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80');
  const [formSupportingDoc, setFormSupportingDoc] = useState('Dokumen_RAB_Proposal_Program.pdf');
  const [formTargetAmount, setFormTargetAmount] = useState('500000000');
  const [formDurationStart, setFormDurationStart] = useState('2026-09-01');
  const [formDurationEnd, setFormDurationEnd] = useState('2027-08-31');
  const [formBankName, setFormBankName] = useState('Bank Syariah Indonesia (BSI)');
  const [formAccountNumber, setFormAccountNumber] = useState('711-889-9900');
  const [formAccountHolder, setFormAccountHolder] = useState('Yayasan Waqf Al-Kautsar Nusantara');
  const [formProvince, setFormProvince] = useState('Jawa Barat');
  const [formCity, setFormCity] = useState('Kota Bandung');
  const [formAddressDetail, setFormAddressDetail] = useState('Jl. Soekarno Hatta No. 580, Kec. Rancasari');
  const [formJenisWakaf, setFormJenisWakaf] = useState<'Wakaf Uang' | 'Wakaf Melalui Uang'>('Wakaf Uang');
  const [formKategori, setFormKategori] = useState('Pendidikan & Ibadah');

  // Selected Program for Detailed Management (Slider + Receipt Upload)
  const [selectedProgramId, setSelectedProgramId] = useState<string>('PROG-WK-001');
  const selectedProgram = programs.find((p) => p.id === selectedProgramId) || programs[0];

  // Sub-tabs in Program Detail Workbench
  const [workbenchTab, setWorkbenchTab] = useState<'receipts' | 'termin' | 'wakif' | 'bwi'>('receipts');

  // Termin Disbursements State
  const [terminList, setTerminList] = useState([
    {
      id: 'TRM-01',
      programId: 'PROG-WK-001',
      terminKe: 'Termin 1 (DP & Land Clearing)',
      nominal: 500000000,
      tanggalPengajuan: '10 Jan 2026',
      tanggalCair: '15 Jan 2026',
      status: 'Selesai Dicairkan',
      targetRekening: 'BSI 711-889-2234',
      dokumen: 'SPK_Pekerjaan_LandClearing.pdf',
    },
    {
      id: 'TRM-02',
      programId: 'PROG-WK-001',
      terminKe: 'Termin 2 (Struktur Bangunan & Sanitasi 50%)',
      nominal: 600000000,
      tanggalPengajuan: '05 Mei 2026',
      tanggalCair: '12 Mei 2026',
      status: 'Selesai Dicairkan',
      targetRekening: 'BSI 711-889-2234',
      dokumen: 'BAP_Progres_Fisik_50Pct.pdf',
    },
    {
      id: 'TRM-03',
      programId: 'PROG-WK-001',
      terminKe: 'Termin 3 (Pipa Air, Pompa & Finishing 65%)',
      nominal: 300000000,
      tanggalPengajuan: '18 Agt 2026',
      tanggalCair: '-',
      status: 'Menunggu Persetujuan Super Admin / DPS',
      targetRekening: 'BSI 711-889-2234',
      dokumen: 'BAP_Progres_Fisik_65Pct.pdf',
    },
  ]);

  // Modal for Ajukan Pencairan Termin Baru
  const [showDisburseModal, setShowDisburseModal] = useState(false);
  const [disburseNominal, setDisburseNominal] = useState('');
  const [disburseTerminKe, setDisburseTerminKe] = useState('Termin 4 (Instalasi Interior & Poliklinik)');
  const [disburseNote, setDisburseNote] = useState('');

  // Wakif / Donatur List per Program
  const [wakifList, setWakifList] = useState([
    {
      id: 'WKF-01',
      programId: 'PROG-WK-001',
      name: 'H. Bambang Soediro, S.E.',
      phone: '0812-8877-6655',
      nominal: 250000000,
      tanggal: '05 Jan 2026',
      akad: 'Wakaf Uang Abadi',
      sertifikatNo: 'AIW-BWI/2026/00189',
      statusSertifikat: 'Terbit & Terverifikasi BWI',
      kategoriDonor: 'Champion',
    },
    {
      id: 'WKF-02',
      programId: 'PROG-WK-001',
      name: 'Ibu Hj. Ratna Juwita',
      phone: '0813-2233-4455',
      nominal: 100000000,
      tanggal: '12 Feb 2026',
      akad: 'Wakaf Uang Abadi',
      sertifikatNo: 'AIW-BWI/2026/00234',
      statusSertifikat: 'Terbit & Terverifikasi BWI',
      kategoriDonor: 'Champion',
    },
    {
      id: 'WKF-03',
      programId: 'PROG-WK-001',
      name: 'PT Telkom Syariah (Wakaf Korporat CSR)',
      phone: '0811-9988-7711',
      nominal: 500000000,
      tanggal: '01 Mar 2026',
      akad: 'Wakaf Melalui Uang',
      sertifikatNo: 'AIW-BWI/2026/00312',
      statusSertifikat: 'Terbit & Terverifikasi BWI',
      kategoriDonor: 'Champion',
    },
    {
      id: 'WKF-04',
      programId: 'PROG-WK-001',
      name: 'dr. Sarah Ramadhani, Sp.A',
      phone: '0817-4433-2211',
      nominal: 25000000,
      tanggal: '20 Apr 2026',
      akad: 'Wakaf Uang Abadi',
      sertifikatNo: 'AIW-BWI/2026/00455',
      statusSertifikat: 'Terbit & Terverifikasi BWI',
      kategoriDonor: 'Loyal',
    },
    {
      id: 'WKF-05',
      programId: 'PROG-WK-001',
      name: 'Bpk. Ahmad Fauzi & Keluarga',
      phone: '0858-1122-3344',
      nominal: 15000000,
      tanggal: '10 Jun 2026',
      akad: 'Wakaf Uang Abadi',
      sertifikatNo: 'AIW-BWI/2026/00512',
      statusSertifikat: 'Terbit & Terverifikasi BWI',
      kategoriDonor: 'Loyal',
    },
  ]);

  // Modal State for WhatsApp Update broadcast & AIW
  const [selectedWakifForWa, setSelectedWakifForWa] = useState<typeof wakifList[0] | null>(null);
  const [selectedWakifForAiw, setSelectedWakifForAiw] = useState<typeof wakifList[0] | null>(null);
  const [showBwiReportModal, setShowBwiReportModal] = useState(false);

  // Upload Receipt Modal State
  const [showAddReceiptModal, setShowAddReceiptModal] = useState(false);
  const [receiptTitle, setReceiptTitle] = useState('');
  const [receiptVendor, setReceiptVendor] = useState('');
  const [receiptAmount, setReceiptAmount] = useState('');
  const [receiptDate, setReceiptDate] = useState('2026-08-21');
  const [isScanningOcr, setIsScanningOcr] = useState(false);
  const [ocrDetected, setOcrDetected] = useState(false);

  // Handle Form Submission for Creating New Program
  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formTargetAmount) {
      showToast({
        title: 'Formulir Belum Lengkap',
        description: 'Mohon lengkapi nama program dan target dana sebelum menerbitkan program.',
        type: 'error',
      });
      return;
    }

    const newProg: WaqfProgram = {
      id: `PROG-WK-00${programs.length + 1}`,
      name: formName,
      description: formDescription,
      bannerImage: formBannerImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80',
      supportingDoc: formSupportingDoc,
      targetAmount: parseFloat(formTargetAmount),
      collectedAmount: 0,
      durationStart: formDurationStart,
      durationEnd: formDurationEnd,
      bankName: formBankName,
      bankAccountNumber: formAccountNumber,
      bankAccountHolder: formAccountHolder,
      province: formProvince,
      city: formCity,
      addressDetail: formAddressDetail,
      jenisWakaf: formJenisWakaf,
      kategori: formKategori,
      progressFisik: 0,
      status: 'Aktif',
      receipts: [],
    };

    setPrograms([newProg, ...programs]);
    setSelectedProgramId(newProg.id);
    showToast({
      title: 'Program Wakaf Diterbitkan',
      description: `Program "${formName}" berhasil dibuat dan siap menerima donasi wakaf.`,
      type: 'success',
    });
    setActiveTab('manage');
  };

  // Handle Slider Change
  const handleUpdateProgressFisik = (newVal: number) => {
    setPrograms((prev) =>
      prev.map((p) => (p.id === selectedProgramId ? { ...p, progressFisik: newVal } : p))
    );
    showToast({
      title: `Progres Fisik Diperbarui: ${newVal}%`,
      description: `Data progres fisik program ${selectedProgram.name} tersimpan ke log transparansi.`,
      type: 'info',
    });
  };

  // Handle Simulated AI OCR Scan
  const handleSimulateOcr = () => {
    setIsScanningOcr(true);
    setOcrDetected(false);
    setTimeout(() => {
      setIsScanningOcr(false);
      setReceiptTitle('Nota Pengadaan Pipa Besi & Pipa Galvanis 3 Inch');
      setReceiptVendor('PT Sinar Bangunan Sukabumi Mandiri');
      setReceiptAmount('18500000');
      setReceiptDate('2026-08-20');
      setOcrDetected(true);
    }, 1000);
  };

  // Handle Save Receipt
  const handleSaveReceipt = () => {
    if (!receiptTitle || !receiptAmount) {
      showToast({
        title: 'Form Belum Lengkap',
        description: 'Mohon isi judul kuitansi dan nominal transaksi belanja.',
        type: 'error',
      });
      return;
    }

    const newRcp: ReceiptItem = {
      id: `RCP-00${Math.floor(Math.random() * 900) + 100}`,
      title: receiptTitle,
      vendor: receiptVendor || 'Vendor Terdaftar',
      amount: parseFloat(receiptAmount),
      date: receiptDate,
      fileName: `Kuitansi_${receiptTitle.slice(0, 15).replace(/\s+/g, '_')}.jpg`,
      status: 'Menunggu Verifikasi DPS',
      ocrDetected: ocrDetected,
    };

    setPrograms((prev) =>
      prev.map((p) => {
        if (p.id === selectedProgramId) {
          return {
            ...p,
            receipts: [newRcp, ...p.receipts],
          };
        }
        return p;
      })
    );

    setShowAddReceiptModal(false);
    setReceiptTitle('');
    setReceiptVendor('');
    setReceiptAmount('');
    setOcrDetected(false);
    showToast({
      title: 'Kuitansi Berhasil Diunggah',
      description: `Nota belanja diajukan ke Dewan Pengawas Syariah (DPS) untuk verifikasi audit.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Navigation */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 flex items-center justify-center font-bold shadow-2xs shrink-0">
              <Building2 className="w-6 h-6 text-[#1B5E20]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Portal Manajemen Nazhir
                </h2>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Yayasan Waqf Al-Kautsar Nusantara • No. Izin BWI: <strong className="text-slate-800 font-mono">BWI.3.1.0028/2024</strong>
              </p>
            </div>
          </div>

          {/* Dynamic Switch Button: '+ Buat Program Baru' when in Manage mode, 'Manajemen Program' when in Create or Detail mode */}
          <div className="flex items-center gap-2.5">
            {activeTab === 'create' || activeTab === 'detail' ? (
              <button
                onClick={() => setActiveTab('manage')}
                className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 shadow-2xs hover:shadow-xs"
              >
                <Layers className="w-4 h-4 text-[#1B5E20]" />
                <span>Manajemen Program</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('create')}
                className="px-4 py-2.5 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 shadow-2xs hover:shadow-xs group"
              >
                <div className="p-0.5 rounded-full bg-white/20 text-white">
                  <PlusCircle className="w-3.5 h-3.5" />
                </div>
                <span>Buat Program Baru</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2.a. BUAT PROGRAM (FORMULIR INPUT PROGRAM BARU LENGKAP)                  */}
      {/* ========================================================================= */}
      {activeTab === 'create' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('manage')}
                  className="text-xs text-slate-500 hover:text-[#1B5E20] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  ← Kembali ke Manajemen Program
                </button>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Formulir Pendaftaran Program Wakaf Baru
              </h3>
              <p className="text-xs text-slate-500">
                Lengkapi seluruh isian wajib sesuai standar kepatuhan BWI dan Dewan Pengawas Syariah.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 self-start sm:self-auto">
              Formulir Terstandar BWI
            </span>
          </div>

          <form onSubmit={handleCreateProgram} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama Program */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  1. Nama Program Wakaf <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Waqf Pembangunan RS Gratis & Klinik Air Bersih Dhuafa"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              {/* Deskripsi Lengkap */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  2. Deskripsi Lengkap Program <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Tuliskan latar belakang, urgensi, mauquf alaih (penerima manfaat), dan rencana pemanfaatan wakaf..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              {/* Gambar / Banner (Ukuran 1200x630) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>3. Gambar / Banner Program (Ukuran 1200x630) <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-slate-400 font-mono">1200x630 px</span>
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formBannerImage}
                    onChange={(e) => setFormBannerImage(e.target.value)}
                    placeholder="URL gambar atau pilih unggah file banner"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFormBannerImage('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80');
                        showToast({
                          title: 'Banner Berhasil Dipilih',
                          description: 'Banner program standar 1200x630 berhasil disematkan ke formulir.',
                          type: 'success',
                        });
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Pilih Berkas Banner
                    </button>
                    <span className="text-[11px] text-slate-500">Format: JPG, PNG (Maks. 5MB)</span>
                  </div>
                </div>
              </div>

              {/* Upload Dokumen Pendukung */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  4. Upload Dokumen Pendukung Program <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-700" />
                      <div>
                        <div className="text-xs font-bold text-slate-800">{formSupportingDoc}</div>
                        <div className="text-[10px] text-slate-500">Proposal RAB & Surat Ikrar Wakaf (PDF)</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormSupportingDoc('Dokumen_Legalitas_RAB_Ikrar_Wakaf_Final.pdf');
                        showToast({
                          title: 'Dokumen Pendukung Diperbarui',
                          description: 'Berkas Dokumen_Legalitas_RAB_Ikrar_Wakaf_Final.pdf berhasil dilampirkan.',
                          type: 'info',
                        });
                      }}
                      className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Ganti Berkas
                    </button>
                  </div>
                </div>
              </div>

              {/* Target Dana (Rp) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  5. Target Dana (Rp) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-bold text-xs">
                    Rp
                  </div>
                  <input
                    type="number"
                    required
                    value={formTargetAmount}
                    onChange={(e) => setFormTargetAmount(e.target.value)}
                    placeholder="Contoh: 1000000000"
                    className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                  />
                </div>
              </div>

              {/* Durasi Program */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  6. Durasi Program (Mulai & Selesai) <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    required
                    value={formDurationStart}
                    onChange={(e) => setFormDurationStart(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1B5E20]"
                  />
                  <input
                    type="date"
                    required
                    value={formDurationEnd}
                    onChange={(e) => setFormDurationEnd(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1B5E20]"
                  />
                </div>
              </div>

              {/* Rekening Bank */}
              <div className="md:col-span-2 p-4 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-3">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-[#1B5E20]" />
                  7. Rekening Bank Penerimaan Wakaf
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Nama Bank</label>
                    <select
                      value={formBankName}
                      onChange={(e) => setFormBankName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1B5E20]"
                    >
                      <option value="Bank Syariah Indonesia (BSI)">Bank Syariah Indonesia (BSI)</option>
                      <option value="Bank Muamalat Indonesia">Bank Muamalat Indonesia</option>
                      <option value="BCA Syariah">BCA Syariah</option>
                      <option value="Bank Mega Syariah">Bank Mega Syariah</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Nomor Rekening</label>
                    <input
                      type="text"
                      required
                      value={formAccountNumber}
                      onChange={(e) => setFormAccountNumber(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-[#1B5E20]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Atas Nama Rekening</label>
                    <input
                      type="text"
                      required
                      value={formAccountHolder}
                      onChange={(e) => setFormAccountHolder(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1B5E20]"
                    />
                  </div>
                </div>
              </div>

              {/* Lokasi Program */}
              <div className="md:col-span-2 p-4 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-3">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#1B5E20]" />
                  8. Lokasi Program Fisik Wakaf
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Provinsi</label>
                    <input
                      type="text"
                      required
                      value={formProvince}
                      onChange={(e) => setFormProvince(e.target.value)}
                      placeholder="Jawa Barat"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1B5E20]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Kabupaten / Kota</label>
                    <input
                      type="text"
                      required
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      placeholder="Kabupaten Sukabumi"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1B5E20]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Detail Alamat / Kecamatan</label>
                    <input
                      type="text"
                      required
                      value={formAddressDetail}
                      onChange={(e) => setFormAddressDetail(e.target.value)}
                      placeholder="Jl. Raya Pelabuhan Ratu Km 12"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1B5E20]"
                    />
                  </div>
                </div>
              </div>

              {/* Klasifikasi Program */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  9. Jenis Wakaf <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formJenisWakaf}
                  onChange={(e) => setFormJenisWakaf(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                >
                  <option value="Wakaf Uang">Wakaf Uang (Pokok Diinvestasikan)</option>
                  <option value="Wakaf Melalui Uang">Wakaf Melalui Uang (Untuk Aset Fisik Langsung)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  10. Kategori Program <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formKategori}
                  onChange={(e) => setFormKategori(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                >
                  <option value="Pendidikan & Ibadah">Pendidikan & Ibadah (Masjid / Pesantren)</option>
                  <option value="Kesehatan & Sanitasi">Kesehatan & Sanitasi (RS / Klinik / Air Bersih)</option>
                  <option value="Ekonomi / Produktif">Ekonomi / Produktif (Perkebunan / Ruko / Usaha Santri)</option>
                  <option value="Sosial & Lingkungan">Sosial & Lingkungan (Ambulans / Kebencanaan)</option>
                </select>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('manage')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Simpan & Terbitkan Program Wakaf
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2.b. DAFTAR PROGRAM WAKAF (LIST CARD VIEW)                                */}
      {/* ========================================================================= */}
      {activeTab === 'manage' && (
        <div className="space-y-6">
          {/* List Card Program (Header Section) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#1B5E20]" />
                Daftar Program Wakaf Terkelola ({programs.length} Program)
              </h3>
            </div>

            {/* List Cards displaying: nama, banner, dokumen pendukung, Target Dana, Durasi, Rekening Bank, Lokasi, Klasifikasi */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {programs.map((prog) => {
                const percentCollected = Math.min(100, Math.round((prog.collectedAmount / prog.targetAmount) * 100));

                return (
                  <div
                    key={prog.id}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden p-4 transition flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-slate-300"
                  >
                    <div>
                      {/* Banner Image Display */}
                      <div className="relative h-36 w-full rounded-xl overflow-hidden mb-3 bg-slate-100 border border-slate-200">
                        <Image
                          src={prog.bannerImage}
                          alt={prog.name}
                          fill
                          className="object-cover"
                          unoptimized
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                          {prog.jenisWakaf}
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-800/90 text-white backdrop-blur-xs">
                          Fisik: {prog.progressFisik}%
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mb-1.5 leading-snug">
                        {prog.name}
                      </h4>

                      {/* Info Highlights */}
                      <div className="space-y-1.5 text-[11px] text-slate-600 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Target Dana:</span>
                          <strong className="text-slate-900">Rp {prog.targetAmount.toLocaleString('id-ID')}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Terkumpul:</span>
                          <span className="font-semibold text-emerald-800">
                            Rp {prog.collectedAmount.toLocaleString('id-ID')} ({percentCollected}%)
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Durasi:</span>
                          <span className="text-slate-700">{prog.durationStart} - {prog.durationEnd}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Lokasi:</span>
                          <span className="text-slate-700 truncate max-w-[140px]">{prog.city}, {prog.province}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Rekening:</span>
                          <span className="font-mono text-[10px] text-slate-700">{prog.bankName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px]">
                      <span className="text-slate-500 flex items-center gap-1 truncate max-w-[130px]" title={prog.supportingDoc}>
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{prog.supportingDoc}</span>
                      </span>
                      <button
                        onClick={() => {
                          setSelectedProgramId(prog.id);
                          setActiveTab('detail');
                        }}
                        className="px-3.5 py-1.5 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-2xs hover:shadow-xs"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        Kelola Program
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2.c. DETAIL / WORKBENCH KELOLA PROGRAM WAKAF (HALAMAN TERSENDIRI)         */}
      {/* ========================================================================= */}
      {activeTab === 'detail' && (
        <div className="space-y-6">
          {/* Breadcrumb / Back to List Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('manage')}
                className="text-xs text-slate-600 hover:text-[#1B5E20] font-bold flex items-center gap-1.5 cursor-pointer"
              >
                ← Kembali ke Daftar Program
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-semibold text-slate-900 truncate max-w-[260px] sm:max-w-md">
                {selectedProgram.name}
              </span>
            </div>
          </div>

          {/* Workbench: Kelola Per Program Terpilih */}
          <div className="bg-white border-2 border-emerald-800/30 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Program Aktif Terpilih
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedProgram.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ID: {selectedProgram.id} • {selectedProgram.city}, {selectedProgram.province} • {selectedProgram.jenisWakaf} • Rekening: {selectedProgram.bankName} ({selectedProgram.bankAccountNumber})
                </p>
              </div>

              <button
                onClick={() => setShowAddReceiptModal(true)}
                className="px-4 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                Unggah Kuitansi / Nota Belanja
              </button>
            </div>

            {/* Slider Progres Fisik Pembangunan Proyek (0% - 100%) */}
            <div className="p-5 bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-slate-50 border border-emerald-200/80 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#1B5E20]" />
                  <span className="text-xs font-bold text-slate-900">
                    Slider Progres Fisik Pembangunan Proyek (0% - 100%)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold text-[#1B5E20] font-mono">
                    {selectedProgram.progressFisik}%
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-800 text-white font-bold">
                    {selectedProgram.progressFisik >= 80 ? 'Tahap Akhir' : selectedProgram.progressFisik >= 50 ? 'Konstruksi Berjalan' : 'Fondasi & Awal'}
                  </span>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={selectedProgram.progressFisik}
                onChange={(e) => handleUpdateProgressFisik(parseInt(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1B5E20]"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                <span>0% (Tahap Pengadaan/Perizinan)</span>
                <span>50% (Pengerjaan Struktur)</span>
                <span>100% (Serah Terima / Rampung)</span>
              </div>
            </div>

            {/* Sub-Tab Navigation Bar in Program Detail */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
              <button
                onClick={() => setWorkbenchTab('receipts')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  workbenchTab === 'receipts'
                    ? 'bg-[#1B5E20] text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Kuitansi Belanja Digital ({selectedProgram.receipts.length})</span>
              </button>

              <button
                onClick={() => setWorkbenchTab('termin')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  workbenchTab === 'termin'
                    ? 'bg-[#1B5E20] text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Landmark className="w-3.5 h-3.5" />
                <span>Pencairan Termin Penyaluran ({terminList.filter((t) => t.programId === selectedProgram.id).length})</span>
              </button>

              <button
                onClick={() => setWorkbenchTab('wakif')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  workbenchTab === 'wakif'
                    ? 'bg-[#1B5E20] text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Daftar Wakif & Kabar Progres WA ({wakifList.filter((w) => w.programId === selectedProgram.id).length})</span>
              </button>

              <button
                onClick={() => setWorkbenchTab('bwi')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  workbenchTab === 'bwi'
                    ? 'bg-[#1B5E20] text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Laporan Semester BWI (UU 41/2004)</span>
              </button>
            </div>

            {/* SUB-TAB 1: KUITANSI BELANJA DIGITAL */}
            {workbenchTab === 'receipts' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-slate-600" />
                    Daftar Kuitansi & Nota Belanja Digital Terunggah ({selectedProgram.receipts.length} Berkas)
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Total Terverifikasi: <strong>Rp {selectedProgram.receipts.reduce((acc, r) => acc + r.amount, 0).toLocaleString('id-ID')}</strong>
                  </span>
                </div>

                {selectedProgram.receipts.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs">
                    Belum ada kuitansi yang diunggah untuk program ini. Klik tombol &quot;Unggah Kuitansi&quot; di atas.
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Judul Pengeluaran / Nota</th>
                          <th className="py-3 px-4">Nama Vendor / Toko</th>
                          <th className="py-3 px-4">Tanggal Nota</th>
                          <th className="py-3 px-4">Nominal (Rp)</th>
                          <th className="py-3 px-4">Berkas Lampiran</th>
                          <th className="py-3 px-4 text-center">Status Verifikasi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {selectedProgram.receipts.map((rcp) => (
                          <tr key={rcp.id} className="hover:bg-slate-50/70 transition">
                            <td className="py-3 px-4 font-bold text-slate-900">
                              {rcp.title}
                            </td>
                            <td className="py-3 px-4 text-slate-600">{rcp.vendor}</td>
                            <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">{rcp.date}</td>
                            <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                              Rp {rcp.amount.toLocaleString('id-ID')}
                            </td>
                            <td className="py-3 px-4 text-blue-700 font-mono text-[11px]">
                              <button
                                onClick={() => setSelectedReceiptForPreview({ ...rcp, programName: selectedProgram.name, programId: selectedProgram.id })}
                                className="hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <Receipt className="w-3 h-3 text-blue-600" />
                                {rcp.fileName}
                              </button>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                rcp.status === 'Terverifikasi DPS'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                  : 'bg-amber-100 text-amber-800 border-amber-200'
                              }`}>
                                {rcp.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* SUB-TAB 2: PENCAIRAN TERMIN PENYALURAN */}
            {workbenchTab === 'termin' && (
              <div className="space-y-5">
                {/* Ringkasan Arus Kas Dana Wakaf */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Wakaf Terhimpun</span>
                    <span className="text-sm font-extrabold text-slate-900 font-mono block mt-1">
                      Rp {selectedProgram.collectedAmount.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
                      Target: Rp {selectedProgram.targetAmount.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Dana Telah Dicairkan</span>
                    <span className="text-sm font-extrabold text-emerald-950 font-mono block mt-1">
                      Rp 1.100.000.000
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
                      2 Termin Selesai Terverifikasi
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                    <span className="text-[10px] font-bold text-blue-800 uppercase block">Sisa Saldo Dana Program</span>
                    <span className="text-sm font-extrabold text-blue-950 font-mono block mt-1">
                      Rp 650.000.000
                    </span>
                    <span className="text-[10px] text-blue-700 font-semibold mt-0.5 block">
                      Siap dicairkan sesuai termin progres
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="text-[10px] font-bold text-amber-800 uppercase block">Realisasi Belanja Kuitansi</span>
                    <span className="text-sm font-extrabold text-amber-950 font-mono block mt-1">
                      Rp {selectedProgram.receipts.reduce((acc, r) => acc + r.amount, 0).toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold mt-0.5 block">
                      Tervalidasi Dewan Pengawas Syariah
                    </span>
                  </div>
                </div>

                {/* Header & Button Ajukan Termin */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Landmark className="w-4 h-4 text-[#1B5E20]" />
                      Riwayat Pengajuan & Termin Pencairan Dana Proyek
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Pencairan dana dilakukan bertahap sesuai Surat Perjanjian Kerja (SPK) & Berita Acara Progres Fisik.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowDisburseModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-[#1B5E20] hover:bg-[#144716] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0 self-start sm:self-auto"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Ajukan Pencairan Termin Baru
                  </button>
                </div>

                {/* Tabel Termin */}
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Tahap / Termin</th>
                        <th className="py-3 px-4">Nominal Pencairan</th>
                        <th className="py-3 px-4">Rekening Tujuan</th>
                        <th className="py-3 px-4">Dokumen SPK/BAP</th>
                        <th className="py-3 px-4">Tgl Pengajuan</th>
                        <th className="py-3 px-4 text-center">Status Audit & Pencairan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {terminList
                        .filter((t) => t.programId === selectedProgram.id)
                        .map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50/70 transition">
                            <td className="py-3 px-4 font-bold text-slate-900">
                              {t.terminKe}
                              <span className="block text-[10px] text-slate-400 font-mono font-normal">ID: {t.id}</span>
                            </td>
                            <td className="py-3 px-4 font-extrabold text-slate-900 font-mono">
                              Rp {t.nominal.toLocaleString('id-ID')}
                            </td>
                            <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{t.targetRekening}</td>
                            <td className="py-3 px-4 text-blue-700 font-mono text-[11px]">
                              <button
                                onClick={() =>
                                  showToast({
                                    title: 'Pratinjau Dokumen BAP',
                                    description: `Membuka berkas ${t.dokumen}...`,
                                    type: 'info',
                                  })
                                }
                                className="hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <FileText className="w-3 h-3 text-blue-600" />
                                {t.dokumen}
                              </button>
                            </td>
                            <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">{t.tanggalPengajuan}</td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-block ${
                                  t.status.includes('Selesai')
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                    : 'bg-amber-100 text-amber-800 border-amber-200 animate-pulse'
                                }`}
                              >
                                {t.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-TAB 3: DAFTAR WAKIF & KABAR PROGRES WA */}
            {workbenchTab === 'wakif' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Send className="w-4 h-4 text-[#1B5E20]" />
                      Daftar Wakif & Layanan Silaturahmi Progres Pembangunan
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Kirim update laporan progres pembangunan {selectedProgram.progressFisik}% langsung ke WhatsApp Wakif dan cetak Akta Ikrar Wakaf (AIW).
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      showToast({
                        title: 'Siarkan Progres ke Semua Wakif',
                        description: `Notifikasi WhatsApp update progres fisik ${selectedProgram.progressFisik}% telah dijadwalkan ke ${wakifList.filter((w) => w.programId === selectedProgram.id).length} wakif.`,
                        type: 'success',
                      });
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0 self-start sm:self-auto"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-700" />
                    Siarkan Update WA ({selectedProgram.progressFisik}%)
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Nama Wakif / Donatur</th>
                        <th className="py-3 px-4">Nominal Wakaf</th>
                        <th className="py-3 px-4">Akad Wakaf</th>
                        <th className="py-3 px-4">No. Sertifikat AIW</th>
                        <th className="py-3 px-4">Status Sertifikat</th>
                        <th className="py-3 px-4 text-center">Aksi Silaturahmi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {wakifList
                        .filter((w) => w.programId === selectedProgram.id)
                        .map((w) => (
                          <tr key={w.id} className="hover:bg-slate-50/70 transition">
                            <td className="py-3 px-4">
                              <span className="font-bold text-slate-900 block">{w.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono">{w.phone} • Tgl: {w.tanggal}</span>
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                              Rp {w.nominal.toLocaleString('id-ID')}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                {w.akad}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px] text-slate-600">{w.sertifikatNo}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                {w.statusSertifikat}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => setSelectedWakifForWa(w)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition shadow-2xs"
                                >
                                  <Send className="w-3 h-3" />
                                  Kabar WA
                                </button>
                                <button
                                  onClick={() => setSelectedWakifForAiw(w)}
                                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition"
                                >
                                  <FileText className="w-3 h-3 text-slate-500" />
                                  Cetak AIW
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-TAB 4: LAPORAN SEMESTER BWI */}
            {workbenchTab === 'bwi' && (
              <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#1B5E20]" />
                      Format Pelaporan Berkala Semesteran Badan Wakaf Indonesia (BWI)
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Kewajiban pelaporan berkala 6 bulan sekali sesuai amanat UU No. 41 Tahun 2004 & Peraturan BWI No. 4 Tahun 2010.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowBwiReportModal(true)}
                    className="px-4 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs shrink-0 self-start sm:self-auto"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Unduh Dokumen Laporan BWI (PDF)
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block">Status Nazhir Terdaftar</span>
                    <span className="font-bold text-slate-900 block mt-0.5">Yayasan Waqf Al-Kautsar Nusantara</span>
                    <span className="text-[10px] font-mono text-emerald-700">No. Registrasi: BWI.3.1.0028/2024</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block">Periode Pelaporan</span>
                    <span className="font-bold text-slate-900 block mt-0.5">Semester I - 2026 (Jan - Jun 2026)</span>
                    <span className="text-[10px] text-slate-500">Status: Lengkap & Siap Submit</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block">Pemeriksaan Dewan Pengawas Syariah</span>
                    <span className="font-bold text-emerald-800 block mt-0.5">Opini Syariah Terpenuhi (WTP)</span>
                    <span className="text-[10px] text-slate-500">DPS: Dr. H. Anwar Sadat, M.Ag.</span>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block text-xs">Komponen Rekapitulasi Pelaporan:</span>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
                    <li>Daftar seluruh penghimpunan wakaf uang & wakaf melalui uang: <strong>Rp {selectedProgram.collectedAmount.toLocaleString('id-ID')}</strong></li>
                    <li>Realisasi belanja operasional dan fisik proyek: <strong>Rp {selectedProgram.receipts.reduce((acc, r) => acc + r.amount, 0).toLocaleString('id-ID')}</strong></li>
                    <li>Progres capaian fisik konstruksi: <strong>{selectedProgram.progressFisik}%</strong></li>
                    <li>Sertifikat Akta Ikrar Wakaf (AIW) terbit: <strong>{wakifList.filter((w) => w.programId === selectedProgram.id).length} Lembar Resmi</strong></li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2.d. HALAMAN DAFTAR KUITANSI KESELURUHAN (SEMUA PROGRAM WAKAF)            */}
      {/* ========================================================================= */}
      {activeTab === 'receipts' && (() => {
        // Collect all receipts across all programs
        const allReceiptsWithProgram = programs.flatMap((prog) =>
          prog.receipts.map((rcp) => ({
            ...rcp,
            programId: prog.id,
            programName: prog.name,
            programCategory: prog.kategori,
          }))
        );

        // Filtered receipts
        const filteredReceipts = allReceiptsWithProgram.filter((rcp) => {
          const matchProg = receiptFilterProgram === 'all' || rcp.programId === receiptFilterProgram;
          const matchStatus = receiptFilterStatus === 'all' || rcp.status === receiptFilterStatus;
          const matchSearch =
            receiptSearchTerm === '' ||
            rcp.title.toLowerCase().includes(receiptSearchTerm.toLowerCase()) ||
            rcp.vendor.toLowerCase().includes(receiptSearchTerm.toLowerCase()) ||
            rcp.programName.toLowerCase().includes(receiptSearchTerm.toLowerCase()) ||
            rcp.id.toLowerCase().includes(receiptSearchTerm.toLowerCase());
          return matchProg && matchStatus && matchSearch;
        });

        const totalNominal = allReceiptsWithProgram.reduce((sum, r) => sum + r.amount, 0);
        const verifiedNominal = allReceiptsWithProgram
          .filter((r) => r.status === 'Terverifikasi DPS')
          .reduce((sum, r) => sum + r.amount, 0);
        const pendingCount = allReceiptsWithProgram.filter((r) => r.status === 'Menunggu Verifikasi DPS').length;

        return (
          <div className="space-y-6">
            {/* Header & KPI Summary for Receipts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                  <span>Total Kuitansi Masuk</span>
                  <Receipt className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {allReceiptsWithProgram.length}
                </div>
                <span className="text-[11px] text-slate-500">Dari {programs.length} Program Wakaf Aktif</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                  <span>Total Realisasi Belanja</span>
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  Rp {totalNominal.toLocaleString('id-ID')}
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold">100% Tercatat Digital</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                  <span>Terverifikasi DPS</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-800 font-mono">
                  Rp {verifiedNominal.toLocaleString('id-ID')}
                </div>
                <span className="text-[11px] text-slate-500">
                  {allReceiptsWithProgram.filter((r) => r.status === 'Terverifikasi DPS').length} berkas lolos audit
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                  <span>Menunggu Verifikasi</span>
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-black text-amber-700 font-mono">
                  {pendingCount} Berkas
                </div>
                <span className="text-[11px] text-amber-700 font-semibold">Menunggu Audit DPS</span>
              </div>
            </div>

            {/* Main Receipts Ledger Container */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      Seluruh Kuitansi & Bukti Belanja Program Wakaf
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Daftar konsolidasi seluruh kuitansi, nota toko, dan faktur belanja material dari semua program binaan Nazhir.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      // Default to first program or selected program for uploading
                      setShowAddReceiptModal(true);
                    }}
                    className="px-4 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Unggah Kuitansi Baru</span>
                  </button>
                </div>
              </div>

              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="flex flex-wrap items-center gap-2.5 flex-1">
                  {/* Program Filter */}
                  <div className="flex items-center gap-1.5">
                    <label className="text-[11px] font-bold text-slate-600 whitespace-nowrap">Program:</label>
                    <select
                      value={receiptFilterProgram}
                      onChange={(e) => setReceiptFilterProgram(e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#1B5E20]"
                    >
                      <option value="all">Semua Program ({programs.length})</option>
                      {programs.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name.length > 35 ? p.name.substring(0, 35) + '...' : p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-1.5">
                    <label className="text-[11px] font-bold text-slate-600 whitespace-nowrap">Status DPS:</label>
                    <select
                      value={receiptFilterStatus}
                      onChange={(e) => setReceiptFilterStatus(e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#1B5E20]"
                    >
                      <option value="all">Semua Status</option>
                      <option value="Terverifikasi DPS">Terverifikasi DPS</option>
                      <option value="Menunggu Verifikasi DPS">Menunggu Verifikasi DPS</option>
                      <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                    </select>
                  </div>
                </div>

                {/* Search Input */}
                <div className="relative min-w-[220px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={receiptSearchTerm}
                    onChange={(e) => setReceiptSearchTerm(e.target.value)}
                    placeholder="Cari nota, vendor, atau program..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1B5E20]"
                  />
                </div>
              </div>

              {/* Table of All Receipts */}
              {filteredReceipts.length === 0 ? (
                <div className="p-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs">
                  Tidak ada kuitansi yang sesuai dengan filter pencarian.
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Program Wakaf Asal</th>
                        <th className="py-3 px-4">Judul Pengeluaran / Nota</th>
                        <th className="py-3 px-4">Nama Toko / Vendor</th>
                        <th className="py-3 px-4">Tanggal Nota</th>
                        <th className="py-3 px-4">Nominal (Rp)</th>
                        <th className="py-3 px-4">Berkas Lampiran</th>
                        <th className="py-3 px-4 text-center">Status DPS</th>
                        <th className="py-3 px-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredReceipts.map((rcp) => (
                        <tr key={rcp.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 max-w-[200px] truncate" title={rcp.programName}>
                              {rcp.programName}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {rcp.programId} • {rcp.programCategory}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              {rcp.title}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">{rcp.id}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-medium">{rcp.vendor}</td>
                          <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">{rcp.date}</td>
                          <td className="py-3 px-4 font-bold text-slate-900 font-mono text-[13px]">
                            Rp {rcp.amount.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-4 text-blue-700 font-mono text-[11px]">
                            <button
                              onClick={() => setSelectedReceiptForPreview(rcp)}
                              className="hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Receipt className="w-3 h-3 text-blue-600" />
                              <span className="truncate max-w-[130px]">{rcp.fileName}</span>
                            </button>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              rcp.status === 'Terverifikasi DPS'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                : 'bg-amber-100 text-amber-800 border-amber-200'
                            }`}>
                              {rcp.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => {
                                setSelectedProgramId(rcp.programId);
                                setActiveTab('detail');
                              }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-[#1B5E20] hover:text-white text-slate-700 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1 mx-auto"
                              title="Buka workbench kelola program ini"
                            >
                              <Sliders className="w-3 h-3" />
                              <span>Kelola</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* MODAL: Unggah Kuitansi Belanja Digital */}
      {showAddReceiptModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Unggah Kuitansi / Nota Belanja Digital
                </h3>
                <p className="text-xs text-slate-500">
                  Program: <strong>{selectedProgram.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setShowAddReceiptModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Program Wakaf Tujuan
                </label>
                <select
                  value={selectedProgramId}
                  onChange={(e) => setSelectedProgramId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-[#1B5E20]"
                >
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Pengeluaran / Item Belanja
                </label>
                <input
                  type="text"
                  value={receiptTitle}
                  onChange={(e) => setReceiptTitle(e.target.value)}
                  placeholder="Contoh: Pengadaan Pipa Galvanis 3 Inch & Sambungan"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Toko / Vendor Penyedia
                </label>
                <input
                  type="text"
                  value={receiptVendor}
                  onChange={(e) => setReceiptVendor(e.target.value)}
                  placeholder="Contoh: TB Berkah Bangunan Sukabumi"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1B5E20]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nominal Nota (Rp)
                  </label>
                  <input
                    type="number"
                    value={receiptAmount}
                    onChange={(e) => setReceiptAmount(e.target.value)}
                    placeholder="18500000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-[#1B5E20]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Nota
                  </label>
                  <input
                    type="date"
                    value={receiptDate}
                    onChange={(e) => setReceiptDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1B5E20]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddReceiptModal(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveReceipt}
                className="px-4 py-1.5 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Simpan & Ajukan Kuitansi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Pratinjau Kuitansi Digital & Hasil Verifikasi DPS */}
      {selectedReceiptForPreview && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Pratinjau Kuitansi Digital & Hasil Verifikasi DPS
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    ID: {selectedReceiptForPreview.id} • {selectedReceiptForPreview.fileName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReceiptForPreview(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid 2 Kolom: Pratinjau Gambar / Scan + Detail Dokumen */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Kolom Kiri: Visual Scan Mock */}
              <div className="p-4 bg-slate-900 text-slate-100 rounded-xl flex flex-col justify-between space-y-4 font-mono text-xs border border-slate-700">
                <div className="border-b border-slate-700 pb-2 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    BUKTI TRANSAKSI FISIK
                  </span>
                  <span className="text-[10px] text-slate-400">Scan 300 DPI</span>
                </div>
                <div className="space-y-1.5 text-slate-300 text-[11px]">
                  <div className="font-bold text-white text-xs">{selectedReceiptForPreview.vendor}</div>
                  <div>Item: {selectedReceiptForPreview.title}</div>
                  <div>Tgl: {selectedReceiptForPreview.date}</div>
                  <div className="text-emerald-400 font-bold text-sm pt-2">
                    TOTAL: Rp {selectedReceiptForPreview.amount.toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Cap Stempel Lunas: ADA</span>
                  <span>TTD Penerima: SAH</span>
                </div>
              </div>

              {/* Kolom Kanan: Detail Verifikasi */}
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      Verifikasi Dokumen Valid
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold">
                      Terverifikasi
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Nilai nominal, tanggal faktur, dan entitas vendor cocok dengan invoice fisik.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Program Wakaf:</span>
                    <span className="font-semibold text-slate-900 text-right truncate max-w-[180px]">
                      {selectedReceiptForPreview.programName || selectedProgram.name}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Status Syariah DPS:</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      selectedReceiptForPreview.status === 'Terverifikasi DPS'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}>
                      {selectedReceiptForPreview.status}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Kepatuhan Standar:</span>
                    <span className="font-semibold text-emerald-800 font-mono">BWI-PSAK 112 Syariah</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  showToast({
                    title: 'Unduh Berkas Kuitansi',
                    description: `Mengunduh berkas ${selectedReceiptForPreview.fileName} (PDF/JPG)...`,
                    type: 'info',
                  });
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh Berkas
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    showToast({
                      title: 'Pengajuan Ulang DPS',
                      description: `Kuitansi ${selectedReceiptForPreview.id} telah dikirim ulang ke antrean audit Dewan Pengawas Syariah.`,
                      type: 'success',
                    });
                    setSelectedReceiptForPreview(null);
                  }}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Kirim Ulang ke DPS
                </button>
                <button
                  onClick={() => setSelectedReceiptForPreview(null)}
                  className="px-4 py-1.5 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Tutup Pratinjau
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Ajukan Pencairan Termin Baru */}
      {showDisburseModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Ajukan Pencairan Termin Progres Proyek
                  </h3>
                  <p className="text-xs text-slate-500">
                    Program: {selectedProgram.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDisburseModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!disburseNominal) {
                  showToast({
                    title: 'Nominal Wajib Diisi',
                    description: 'Mohon masukkan nominal pencairan dana termin yang diajukan.',
                    type: 'error',
                  });
                  return;
                }
                const newTermin = {
                  id: `TRM-0${terminList.length + 1}`,
                  programId: selectedProgram.id,
                  terminKe: disburseTerminKe,
                  nominal: parseFloat(disburseNominal),
                  tanggalPengajuan: '21 Agt 2026',
                  tanggalCair: '-',
                  status: 'Menunggu Persetujuan Super Admin / DPS',
                  targetRekening: `${selectedProgram.bankName} ${selectedProgram.bankAccountNumber}`,
                  dokumen: 'BAP_Progres_Fisik_Terbaru.pdf',
                };
                setTerminList([...terminList, newTermin]);
                setShowDisburseModal(false);
                setDisburseNominal('');
                showToast({
                  title: 'Pengajuan Termin Terkirim',
                  description: `Pengajuan pencairan ${disburseTerminKe} senilai Rp ${parseFloat(disburseNominal).toLocaleString('id-ID')} berhasil diajukan ke Dewan Pengawas Syariah & Super Admin.`,
                  type: 'success',
                });
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama / Tahap Termin <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={disburseTerminKe}
                  onChange={(e) => setDisburseTerminKe(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nominal Pengajuan (Rp) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 250000000"
                  value={disburseNominal}
                  onChange={(e) => setDisburseNominal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Rekening Tujuan Pencairan
                </label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800">
                  {selectedProgram.bankName} • {selectedProgram.bankAccountNumber} ({selectedProgram.bankAccountHolder})
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Lampiran Berita Acara Progres Fisik (BAP / SPK)
                </label>
                <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <span>BAP_Progres_Fisik_Terbaru.pdf</span>
                  </div>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                    Terlampir
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDisburseModal(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl font-bold cursor-pointer shadow-xs"
                >
                  Ajukan Termin Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Kirim Update WhatsApp ke Wakif */}
      {selectedWakifForWa && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Kirim Pesan Progres Pembangunan ke Wakif
                  </h3>
                  <p className="text-xs text-slate-500">
                    Wakif: {selectedWakifForWa.name} ({selectedWakifForWa.phone})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedWakifForWa(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-slate-800 font-sans leading-relaxed">
                <p className="font-bold text-emerald-950">
                  Assalamu&apos;alaikum Wr. Wb. Yth. Bapak/Ibu {selectedWakifForWa.name},
                </p>
                <p>
                  Alhamdulillah, kami Nazhir <strong>Yayasan Waqf Al-Kautsar Nusantara</strong> menyampaikan kabar perkembangan program wakaf Anda: <strong>{selectedProgram.name}</strong>.
                </p>
                <div className="p-2.5 bg-white rounded-lg border border-emerald-100 font-mono text-[11px] space-y-1">
                  <div>• Progres Fisik: <strong className="text-emerald-800">{selectedProgram.progressFisik}%</strong></div>
                  <div>• Akad: <strong>{selectedWakifForWa.akad}</strong></div>
                  <div>• No. AIW: <strong>{selectedWakifForWa.sertifikatNo}</strong></div>
                  <div>• Lokasi: <strong>{selectedProgram.city}, {selectedProgram.province}</strong></div>
                </div>
                <p className="text-[11px] text-slate-600 italic">
                  Jazakumullahu khairan katsiran atas amanah wakaf jariyah yang terus mengalirkan pahala abadi.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedWakifForWa(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  showToast({
                    title: 'Pesan WhatsApp Terkirim',
                    description: `Pesan update progres fisik ${selectedProgram.progressFisik}% berhasil dikirim ke ${selectedWakifForWa.name} (${selectedWakifForWa.phone}).`,
                    type: 'success',
                  });
                  setSelectedWakifForWa(null);
                }}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                Kirim via WhatsApp API Gateway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Cetak & Pratinjau Akta Ikrar Wakaf (AIW) */}
      {selectedWakifForAiw && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Akta Ikrar Wakaf (AIW) Resmi BWI
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    No. Register: {selectedWakifForAiw.sertifikatNo}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedWakifForAiw(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sertifikat Visual Mock */}
            <div className="p-6 bg-amber-50/40 border-2 border-dashed border-amber-300 rounded-2xl space-y-3 text-center text-xs">
              <div className="text-[10px] font-bold text-amber-900 tracking-widest uppercase">
                BADAN WAKAF INDONESIA (BWI) & KEMENTERIAN AGAMA RI
              </div>
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">
                AKTA IKRAR WAKAF (AIW)
              </h2>
              <p className="text-slate-600 font-mono text-[11px]">
                Nomor: {selectedWakifForAiw.sertifikatNo}
              </p>

              <div className="py-2 text-left space-y-1.5 border-t border-b border-amber-200 text-slate-800 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Wakif:</span>
                  <span className="font-bold">{selectedWakifForAiw.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nominal Wakaf:</span>
                  <span className="font-bold text-emerald-800 font-mono">Rp {selectedWakifForAiw.nominal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Program Penyaluran:</span>
                  <span className="font-semibold text-right">{selectedProgram.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nazhir Penerima:</span>
                  <span className="font-semibold">Yayasan Waqf Al-Kautsar Nusantara</span>
                </div>
              </div>

              <div className="pt-2 flex justify-between text-[10px] text-slate-500">
                <span>Tertanda Pejabat PPAIW</span>
                <span className="text-emerald-700 font-bold">Terdaftar BWI Digital Signature</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  showToast({
                    title: 'Unduh AIW PDF',
                    description: `Mengunduh sertifikat ${selectedWakifForAiw.sertifikatNo} berformat PDF...`,
                    type: 'success',
                  });
                }}
                className="px-3 py-1.5 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh PDF Resmi
              </button>

              <button
                onClick={() => setSelectedWakifForAiw(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Laporan Semester BWI */}
      {showBwiReportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Dokumen Laporan Semesteran Badan Wakaf Indonesia
                  </h3>
                  <p className="text-xs text-slate-500">
                    Format Standar UU 41/2004 & Peraturan BWI
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBwiReportModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-700">
              <div className="font-bold text-slate-900">Isi Ringkasan Berkas Pelaporan BWI:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                <li>Identitas Lembaga Nazhir & SK BWI Aktif</li>
                <li>Laporan Posisi Keuangan & Arus Kas Rekening Penampung Bank Syariah</li>
                <li>Daftar Realisasi Belanja & Bukti Kuitansi Sah</li>
                <li>Laporan Monitoring Progres Fisik Konstruksi ({selectedProgram.progressFisik}%)</li>
                <li>Surat Pernyataan Dewan Pengawas Syariah (DPS) Terverifikasi</li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowBwiReportModal(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  showToast({
                    title: 'Unduh Laporan BWI Selesai',
                    description: 'Dokumen Laporan_Semester_BWI_2026_Yayasan_Alkautsar.pdf berhasil diunduh.',
                    type: 'success',
                  });
                  setShowBwiReportModal(false);
                }}
                className="px-4 py-1.5 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh PDF Laporan BWI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
