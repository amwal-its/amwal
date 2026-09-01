'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Layers,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  FileText,
  Upload,
  MapPin,
  Building2,
  CreditCard,
  Calendar,
  ArrowUpRight,
  ArrowLeft,
  Receipt,
  DollarSign,
  Tag,
  Eye,
  RefreshCw,
  Landmark,
  Send,
  Download,
  PlusCircle,
  Sliders,
  ShieldCheck,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export interface ReceiptItem {
  id: string;
  title: string;
  vendor?: string;
  amount: number;
  fileName: string;
  date: string;
  status?: string;
  ocrDetected?: boolean;
  notes?: string;
}

export interface WaqfProgramItem {
  id: string;
  name: string;
  akad: 'Wakaf Uang' | 'Wakaf Melalui Uang';
  kategori: string;
  targetAmount: number;
  collectedAmount: number;
  description: string;
  status: 'Aktif' | 'Menunggu Persetujuan Super Admin' | 'Butuh Revisi' | 'Ditolak' | 'Selesai' | 'Draft';
  bannerUrl: string;
  supportingDoc?: string;
  durationStart?: string;
  durationEnd?: string;
  duration?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountHolder?: string;
  bankAccount?: string;
  province: string;
  city: string;
  locationDetail?: string;
  jenisWakaf: 'Wakaf Uang' | 'Wakaf Melalui Uang';
  menerimaWakafBarang: 'Ya' | 'Tidak';
  progressFisik: number;
  receipts: ReceiptItem[];
  submitterName?: string;
  submitterRole?: string;
}

const INITIAL_PROGRAMS: WaqfProgramItem[] = [
  {
    id: 'PROG-WK-001',
    name: 'Waqf Pembangunan Klinik Air Bersih & RS Gratis Al-Azhar',
    akad: 'Wakaf Uang',
    kategori: 'Kesehatan & Sanitasi',
    targetAmount: 2500000000,
    collectedAmount: 1750000000,
    description:
      'Pembangunan fasilitas klinik air bersih, sanitasi modern, dan poliklinik dhuafa terpadu berkapasitas 50 tempat tidur untuk masyarakat prasejahtera di Jawa Barat.',
    status: 'Aktif',
    bannerUrl:
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80',
    supportingDoc: 'Surat_Ikrar_Wakaf_Tanah_dan_RAB_Klinik.pdf',
    durationStart: '01 Jan 2026',
    durationEnd: '31 Des 2026',
    duration: '01 Jan 2026 - 31 Des 2026',
    bankName: 'Bank Syariah Indonesia (BSI)',
    bankAccountNumber: '711-889-2234',
    bankAccountHolder: 'Yayasan Waqf Al-Kautsar Nusantara',
    bankAccount: 'Bank Syariah Indonesia (BSI)',
    province: 'Jawa Barat',
    city: 'Kabupaten Sukabumi',
    locationDetail: 'Jl. Raya Pelabuhan Ratu Km 12, Kec. Cikembar',
    jenisWakaf: 'Wakaf Uang',
    menerimaWakafBarang: 'Ya',
    progressFisik: 65,
    submitterName: 'Ustadz Ridwan Malik (Nazhir)',
    submitterRole: 'nazhir',
    receipts: [
      {
        id: 'RCP-001',
        title: 'Pengadaan Pipa Galvanis 3 Inch & Pompa Submersible 3 HP',
        vendor: 'PT Mandiri Teknik Utama Jaya',
        amount: 18500000,
        date: '10 Agt 2026',
        fileName: 'Kuitansi_Pipa_02.png',
        status: 'Terverifikasi Super Admin',
        ocrDetected: true,
        notes: 'Kesesuaian fisik dan harga pasar telah diverifikasi Super Admin.',
      },
      {
        id: 'RCP-002',
        title: 'Pengadaan Semen Tiga Roda 60 Sak & Pasir Cor',
        vendor: 'TB Berkah Bangunan Sukabumi',
        amount: 5550000,
        date: '01 Agt 2026',
        fileName: 'Kuitansi_Material_Semen.jpg',
        status: 'Terverifikasi Super Admin',
        ocrDetected: true,
        notes: 'Audit lapangan cocok dengan progres konstruksi pengecoran lantai 2.',
      },
      {
        id: 'RCP-003',
        title: 'Pembelian Tangki Filter Air Karbon Aktif 2000L',
        vendor: 'CV Water Filtration Nusantara',
        amount: 12800000,
        date: '22 Agt 2026',
        fileName: 'Nota_WaterFilter_2000L.pdf',
        status: 'Menunggu Verifikasi Super Admin',
        ocrDetected: true,
      },
    ],
  },
  {
    id: 'PROG-WK-002',
    name: 'Waqf Renovasi Gedung Sekolah Tahfidz & Asrama Yatim',
    akad: 'Wakaf Melalui Uang',
    kategori: 'Pendidikan & Ibadah',
    targetAmount: 850000000,
    collectedAmount: 620000000,
    description:
      'Revitalisasi gedung asrama 3 lantai bagi 120 santri tahfidz penghafal Al-Qur’an yatim dhuafa dengan standar kenyamanan dan ketahanan gempa.',
    status: 'Aktif',
    bannerUrl:
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&auto=format&fit=crop&q=80',
    supportingDoc: 'Proposal_Renovasi_Asrama_Yatim_2026.pdf',
    durationStart: '15 Feb 2026',
    durationEnd: '30 Okt 2026',
    duration: '15 Feb 2026 - 30 Okt 2026',
    bankName: 'Bank Muamalat Indonesia',
    bankAccountNumber: '340-001-9981',
    bankAccountHolder: 'Yayasan Waqf Al-Kautsar Nusantara',
    bankAccount: 'Bank Muamalat Indonesia',
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    locationDetail: 'Jl. Tebet Barat Dalam Raya No. 45',
    jenisWakaf: 'Wakaf Melalui Uang',
    menerimaWakafBarang: 'Tidak',
    progressFisik: 40,
    submitterName: 'Ustadz Ridwan Malik (Nazhir)',
    submitterRole: 'nazhir',
    receipts: [
      {
        id: 'RCP-004',
        title: 'Baja Ringan & Genteng Metal Asrama Lantai 3',
        vendor: 'PT Graha Truss Nusantara',
        amount: 42000000,
        date: '14 Agt 2026',
        fileName: 'Faktur_Baja_Ringan_08.pdf',
        status: 'Terverifikasi Super Admin',
        ocrDetected: true,
      },
    ],
  },
  {
    id: 'PROG-WK-003',
    name: 'Wakaf Produktif Kebun Hidroponik Modern Santri Dhuafa',
    akad: 'Wakaf Uang',
    kategori: 'Pemberdayaan Ekonomi',
    targetAmount: 500000000,
    collectedAmount: 210000000,
    description:
      'Pengadaan greenhouse instalasi hidroponik NFT 500m2 untuk kemandirian ekonomi pesantren dan beasiswa pangan bergizi santri.',
    status: 'Menunggu Persetujuan Super Admin',
    bannerUrl:
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&auto=format&fit=crop&q=80',
    supportingDoc: 'Masterplan_Hidroponik_Greenhouse_2026.pdf',
    durationStart: '01 Sep 2026',
    durationEnd: '31 Des 2026',
    duration: '01 Sep 2026 - 31 Des 2026',
    bankName: 'Bank Syariah Indonesia (BSI)',
    bankAccountNumber: '711-889-2234',
    bankAccountHolder: 'Yayasan Waqf Al-Kautsar Nusantara',
    province: 'Jawa Barat',
    city: 'Kabupaten Bogor',
    locationDetail: 'Kecamatan Cisarua Puncak',
    jenisWakaf: 'Wakaf Uang',
    menerimaWakafBarang: 'Ya',
    progressFisik: 0,
    submitterName: 'Ustadz Ridwan Malik (Nazhir)',
    submitterRole: 'nazhir',
    receipts: [],
  },
  {
    id: 'PROG-WK-004',
    name: 'Wakaf Pengadaan Mobil Ambulans Jenazah & Medis Dhuafa',
    akad: 'Wakaf Melalui Uang',
    kategori: 'Kesehatan & Sanitasi',
    targetAmount: 350000000,
    collectedAmount: 180000000,
    description:
      'Pengadaan 1 unit armada ambulans medis dilengkapi tabung oksigen dan sirine untuk layanan antar jemput pasien dhuafa 24 jam bebas biaya.',
    status: 'Menunggu Persetujuan Super Admin',
    bannerUrl:
      'https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=1200&auto=format&fit=crop&q=80',
    supportingDoc: 'Penawaran_Karoseri_Ambulans_2026.pdf',
    durationStart: '10 Agt 2026',
    durationEnd: '30 Nov 2026',
    duration: '10 Agt 2026 - 30 Nov 2026',
    bankName: 'Bank Muamalat Indonesia',
    bankAccountNumber: '340-001-9981',
    bankAccountHolder: 'Yayasan Waqf Al-Kautsar Nusantara',
    province: 'DKI Jakarta',
    city: 'Jakarta Timur',
    locationDetail: 'Jl. Pemuda No. 12, Rawamangun',
    jenisWakaf: 'Wakaf Melalui Uang',
    menerimaWakafBarang: 'Tidak',
    progressFisik: 0,
    submitterName: 'Lembaga Wakaf Al-Azhar Peduli Ummat',
    submitterRole: 'nazhir',
    receipts: [],
  },
];

export function WakafProgramsView() {
  const { showToast } = useToast();
  const searchParams = useSearchParams();

  const [programs, setPrograms] = useState<WaqfProgramItem[]>(INITIAL_PROGRAMS);
  const [activeView, setActiveView] = useState<'main' | 'detail'>('main');
  const [selectedProgId, setSelectedProgId] = useState<string>('PROG-WK-001');
  const [workbenchTab, setWorkbenchTab] = useState<'receipts' | 'termin' | 'wakif' | 'bwi'>('receipts');
  const [searchProgramQuery, setSearchProgramQuery] = useState('');
  const [filterAkad, setFilterAkad] = useState<string>('SEMUA');

  // Handle URL query parameters for direct tab navigation
  useEffect(() => {
    const viewParam = searchParams.get('view');
    const tabParam = searchParams.get('tab');
    if (viewParam === 'receipts' || tabParam === 'kuitansi' || tabParam === 'audit') {
      setActiveView('detail');
      setWorkbenchTab('receipts');
    } else if (viewParam === 'create') {
      handleOpenAddModal();
    }
  }, [searchParams]);

  // Termin list
  const [terminList] = useState([
    {
      id: 'TRM-01',
      programId: 'PROG-WK-001',
      terminKe: 'Termin I (Uang Muka & Pengadaan Awal)',
      nominal: 500000000,
      targetRekening: 'BSI Escrow - 711-889-2234',
      status: 'Selesai Dicairkan',
      tanggalPengajuan: '15 Jan 2026',
      dokumen: 'SPK_Pembangunan_Klinik_Tahap1.pdf',
    },
    {
      id: 'TRM-02',
      programId: 'PROG-WK-001',
      terminKe: 'Termin II (Pengerjaan Struktur & Sanitasi)',
      nominal: 600000000,
      targetRekening: 'BSI Escrow - 711-889-2234',
      status: 'Selesai Dicairkan',
      tanggalPengajuan: '20 Mei 2026',
      dokumen: 'BAP_Progres_Fisik_50_Persen.pdf',
    },
    {
      id: 'TRM-03',
      programId: 'PROG-WK-001',
      terminKe: 'Termin III (Finishing & Instalasi Air)',
      nominal: 650000000,
      targetRekening: 'BSI Escrow - 711-889-2234',
      status: 'Menunggu Verifikasi DPS',
      tanggalPengajuan: '10 Agt 2026',
      dokumen: 'BAP_Progres_Fisik_65_Persen.pdf',
    },
    {
      id: 'TRM-04',
      programId: 'PROG-WK-002',
      terminKe: 'Termin I (Bahan Bangunan & Tukang)',
      nominal: 350000000,
      targetRekening: 'Muamalat - 340-001-9981',
      status: 'Selesai Dicairkan',
      tanggalPengajuan: '01 Mar 2026',
      dokumen: 'SPK_Renovasi_Asrama.pdf',
    },
  ]);

  // Wakif list
  const [wakifList] = useState([
    {
      id: 'WKF-001',
      programId: 'PROG-WK-001',
      name: 'H. Muhammad Arifin',
      phone: '+62 812-9876-5432',
      nominal: 50000000,
      tanggal: '12 Jan 2026',
      akad: 'Wakaf Uang',
      sertifikatNo: 'AIW/BWI-JB/2026/0018',
      statusSertifikat: 'Terbit & Terverifikasi BWI',
    },
    {
      id: 'WKF-002',
      programId: 'PROG-WK-001',
      name: 'Hj. Siti Aminah, S.E.',
      phone: '+62 811-2233-4455',
      nominal: 25000000,
      tanggal: '18 Feb 2026',
      akad: 'Wakaf Uang',
      sertifikatNo: 'AIW/BWI-JB/2026/0042',
      statusSertifikat: 'Terbit & Terverifikasi BWI',
    },
    {
      id: 'WKF-003',
      programId: 'PROG-WK-001',
      name: 'Ir. Hendra Kusuma',
      phone: '+62 813-1002-8877',
      nominal: 10000000,
      tanggal: '05 Mar 2026',
      akad: 'Wakaf Uang',
      sertifikatNo: 'AIW/BWI-JB/2026/0089',
      statusSertifikat: 'Terbit & Terverifikasi BWI',
    },
    {
      id: 'WKF-004',
      programId: 'PROG-WK-002',
      name: 'Keluarga Besar Alm. H. Abdullah',
      phone: '+62 856-7788-9900',
      nominal: 75000000,
      tanggal: '20 Feb 2026',
      akad: 'Wakaf Melalui Uang',
      sertifikatNo: 'AIW/BWI-DKI/2026/0112',
      statusSertifikat: 'Terbit & Terverifikasi BWI',
    },
  ]);

  // Modal / Form state for Add / Edit Program
  const [showModal, setShowModal] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);

  // State for Disbursement Request Modal
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawNote, setWithdrawNote] = useState('');

  // State for Adding Receipt
  const [newReceiptTitle, setNewReceiptTitle] = useState('');
  const [newReceiptAmount, setNewReceiptAmount] = useState('');
  const [newReceiptFile, setNewReceiptFile] = useState<string>('Nota_Belanja_Baru.jpg');
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState<string | null>(null);

  // File Input Refs
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const receiptFileInputRef = useRef<HTMLInputElement>(null);

  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    bannerUrl: 'https://picsum.photos/seed/program/800/400',
    targetAmount: '',
    duration: '60 Hari',
    bankAccount: 'BSI - 7182938475 a.n. Amwal Waqf',
    province: 'Jawa Barat',
    city: 'Kab. Sukabumi',
    locationDetail: '',
    jenisWakaf: 'Wakaf Uang' as 'Wakaf Uang' | 'Wakaf Melalui Uang',
    kategori: 'Sekolah',
    menerimaWakafBarang: 'Ya' as 'Ya' | 'Tidak',
  });

  const handleBannerFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({
            ...prev,
            bannerUrl: event.target!.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReceiptFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewReceiptFile(file.name);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setReceiptPreviewUrl(event.target!.result as string);
          }
        };
        reader.readAsDataURL(file);
      } else {
        setReceiptPreviewUrl(null);
      }
    }
  };

  const handleOpenAddModal = () => {
    setEditingProgramId(null);
    setFormData({
      name: '',
      description: '',
      bannerUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80',
      targetAmount: '',
      duration: '60 Hari',
      bankAccount: 'BSI - 7182938475 a.n. Amwal Waqf',
      province: 'Jawa Barat',
      city: 'Kab. Sukabumi',
      locationDetail: '',
      jenisWakaf: 'Wakaf Uang',
      kategori: 'Sekolah',
      menerimaWakafBarang: 'Ya',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (prog: WaqfProgramItem) => {
    setEditingProgramId(prog.id);
    setFormData({
      name: prog.name || '',
      description: prog.description || '',
      bannerUrl: prog.bannerUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80',
      targetAmount: (prog.targetAmount || 0).toString(),
      duration: prog.duration || '60 Hari',
      bankAccount: prog.bankAccount || prog.bankName || 'BSI - 7182938475 a.n. Amwal Waqf',
      province: prog.province || 'Jawa Barat',
      city: prog.city || 'Kab. Sukabumi',
      locationDetail: prog.locationDetail || '',
      jenisWakaf: prog.jenisWakaf || 'Wakaf Uang',
      kategori: prog.kategori || 'Sekolah',
      menerimaWakafBarang: prog.menerimaWakafBarang || 'Ya',
    });
    setShowModal(true);
  };

  const handleBadgeClick = (badge: string) => {
    if (!formData.name) {
      setFormData((prev) => ({
        ...prev,
        name: `Program Waqf ${badge}`,
        kategori: badge,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        kategori: badge,
        description: prev.description
          ? `${prev.description} (Kategori: ${badge})`
          : `Program berfokus pada pengembangan ${badge.toLowerCase()}.`,
      }));
    }
  };

  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingProgramId) {
      setPrograms((prev) =>
        prev.map((p) =>
          p.id === editingProgramId
            ? {
                ...p,
                name: formData.name,
                description: formData.description,
                bannerUrl: formData.bannerUrl,
                targetAmount: parseFloat(formData.targetAmount) || 0,
                duration: formData.duration,
                bankAccount: formData.bankAccount,
                province: formData.province,
                city: formData.city,
                locationDetail: formData.locationDetail,
                jenisWakaf: formData.jenisWakaf,
                kategori: formData.kategori,
                menerimaWakafBarang: formData.menerimaWakafBarang,
                akad: formData.jenisWakaf,
              }
            : p
        )
      );
      showToast({
        title: 'Program Berhasil Diperbarui',
        description: `Data program "${formData.name}" berhasil disimpan.`,
        type: 'success',
      });
    } else {
      const newId = `PROG-WK-${Date.now().toString().slice(-3)}`;
      const newProg: WaqfProgramItem = {
        id: newId,
        name: formData.name,
        akad: formData.jenisWakaf,
        kategori: formData.kategori,
        targetAmount: parseFloat(formData.targetAmount) || 0,
        collectedAmount: 0,
        description: formData.description,
        bannerUrl: formData.bannerUrl,
        duration: formData.duration,
        bankAccount: formData.bankAccount,
        province: formData.province,
        city: formData.city,
        locationDetail: formData.locationDetail,
        jenisWakaf: formData.jenisWakaf,
        menerimaWakafBarang: formData.menerimaWakafBarang,
        progressFisik: 0,
        status: 'Aktif',
        receipts: [],
      };
      setPrograms((prev) => [newProg, ...prev]);
      setSelectedProgId(newId);
      showToast({
        title: 'Program Berhasil Diterbitkan',
        description: `Program "${formData.name}" siap menerima donasi wakaf.`,
        type: 'success',
      });
    }

    setShowModal(false);
  };

  const handleDeleteProgram = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus program "${name}"?`)) {
      setPrograms((prev) => prev.filter((p) => p.id !== id));
      showToast({
        title: 'Program Dihapus',
        description: `Program "${name}" telah dihapus dari sistem.`,
        type: 'info',
      });
    }
  };

  const handleUpdateProgressFisik = (progId: string, newProgress: number) => {
    setPrograms((prev) =>
      prev.map((p) => (p.id === progId ? { ...p, progressFisik: newProgress } : p))
    );
  };

  const handleAddReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReceiptTitle.trim() || !newReceiptAmount) return;

    const newRcp: ReceiptItem = {
      id: `RCP-${Date.now().toString().slice(-3)}`,
      title: newReceiptTitle,
      amount: parseFloat(newReceiptAmount) || 0,
      fileName: newReceiptFile || 'Kuitansi_Belanja.png',
      date: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'Terverifikasi Super Admin',
      ocrDetected: true,
    };

    setPrograms((prev) =>
      prev.map((p) =>
        p.id === selectedProgId ? { ...p, receipts: [newRcp, ...p.receipts] } : p
      )
    );

    showToast({
      title: 'Kuitansi Berhasil Ditambahkan',
      description: `Nota "${newReceiptTitle}" sebesar Rp ${parseFloat(newReceiptAmount).toLocaleString('id-ID')} telah dicatat.`,
      type: 'success',
    });

    setNewReceiptTitle('');
    setNewReceiptAmount('');
    setReceiptPreviewUrl(null);
  };

  const handleWithdrawFunds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount) return;
    setShowWithdrawModal(false);
    showToast({
      title: 'Pengajuan Penarikan Dana Terkirim',
      description: `Pengajuan Rp ${parseInt(withdrawAmount, 10).toLocaleString('id-ID')} telah dikirim ke Tim Audit Nadzir & DPS.`,
      type: 'success',
    });
    setWithdrawAmount('');
    setWithdrawNote('');
  };

  const filteredPrograms = programs.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchProgramQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchProgramQuery.toLowerCase()) ||
      p.kategori.toLowerCase().includes(searchProgramQuery.toLowerCase());
    const matchesAkad = filterAkad === 'SEMUA' || p.jenisWakaf === filterAkad;
    return matchesSearch && matchesAkad;
  });

  const selectedProgram = programs.find((p) => p.id === selectedProgId) || programs[0];

  return (
    <div className="space-y-6 px-4 sm:px-6 py-6 max-w-7xl mx-auto font-jakarta">
      {/* ========================================================================= */}
      {/* 1. HALAMAN UTAMA: DAFTAR PROGRAM WAKAF & KELOLA                           */}
      {/* ========================================================================= */}
      {activeView === 'main' && (
        <>
          {/* Header */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-800" />
                  Manajemen &amp; Pengawasan Program Wakaf
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Pusat pembuatan program baru, pemantauan slider progres fisik lapangan, upload kuitansi digital, dan tata kelola termin escrow BSI.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="px-4 py-2.5 rounded-xl bg-[#1B5E20] hover:bg-[#144716] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Terbitkan Program Baru</span>
                </button>
              </div>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase block">Total Program Aktif</span>
                  <span className="text-lg font-extrabold text-emerald-950">{programs.length} Proyek</span>
                </div>
                <Layers className="w-7 h-7 text-emerald-600/40" />
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-600 uppercase block">Target Penghimpunan</span>
                  <span className="text-lg font-extrabold text-slate-900 font-mono">
                    Rp {programs.reduce((acc, p) => acc + p.targetAmount, 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <Landmark className="w-7 h-7 text-slate-400/40" />
              </div>

              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-800 uppercase block">Terkumpul Nyata</span>
                  <span className="text-lg font-extrabold text-amber-950 font-mono">
                    Rp {programs.reduce((acc, p) => acc + p.collectedAmount, 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <DollarSign className="w-7 h-7 text-amber-600/40" />
              </div>
            </div>
          </div>

          {/* Program List Cards */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-800" />
                  Daftar Program Wakaf Terkelola ({filteredPrograms.length} Program)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilih program untuk membuka workbench manajemen progres fisik, kuitansi belanja digital, dan termin kas escrow.
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari program / lokasi..."
                    value={searchProgramQuery}
                    onChange={(e) => setSearchProgramQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-700 w-48 sm:w-56"
                  />
                </div>

                <select
                  value={filterAkad}
                  onChange={(e) => setFilterAkad(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:bg-white focus:outline-hidden cursor-pointer"
                >
                  <option value="SEMUA">Semua Akad Wakaf</option>
                  <option value="Wakaf Uang">Wakaf Uang</option>
                  <option value="Wakaf Melalui Uang">Wakaf Melalui Uang</option>
                </select>
              </div>
            </div>

            {/* List of Programs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPrograms.map((prog) => {
                const isSelected = prog.id === selectedProgId;
                const pct =
                  prog.targetAmount > 0
                    ? Math.min(100, Math.round((prog.collectedAmount / prog.targetAmount) * 100))
                    : 0;

                return (
                  <div
                    key={prog.id}
                    onClick={() => setSelectedProgId(prog.id)}
                    className={`bg-white border rounded-2xl overflow-hidden p-4 transition flex flex-col justify-between shadow-2xs hover:shadow-md cursor-pointer ${
                      isSelected
                        ? 'border-[#1B5E20] ring-2 ring-[#1B5E20]/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      {/* Banner Image Display */}
                      <div className="relative h-36 w-full rounded-xl overflow-hidden mb-3 bg-slate-100 border border-slate-200">
                        <Image
                          src={prog.bannerUrl}
                          alt={prog.name}
                          fill
                          className="object-cover"
                          unoptimized
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
                            Rp {prog.collectedAmount.toLocaleString('id-ID')} ({pct}%)
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Durasi:</span>
                          <span className="text-slate-700">
                            {prog.durationStart && prog.durationEnd
                              ? `${prog.durationStart} - ${prog.durationEnd}`
                              : prog.duration}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Lokasi:</span>
                          <span className="text-slate-700 truncate max-w-[140px]">{prog.city}, {prog.province}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Rekening:</span>
                          <span className="font-mono text-[10px] text-slate-700">{prog.bankAccount || prog.bankName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px]">
                      <span
                        className="text-slate-500 flex items-center gap-1 truncate max-w-[130px]"
                        title={prog.supportingDoc || 'Dokumen_Legalitas.pdf'}
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{prog.supportingDoc || 'Dokumen_Legalitas.pdf'}</span>
                      </span>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProgId(prog.id);
                            setActiveView('detail');
                          }}
                          className="px-3 py-1.5 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-2xs hover:shadow-xs"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Kelola Progres</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditModal(prog);
                          }}
                          title="Edit Program"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProgram(prog.id, prog.name);
                          }}
                          title="Hapus Program"
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 2. HALAMAN DEDIKASI KELOLA PROGRAM (DETAIL WORKBENCH VIEW)                */}
      {/* ========================================================================= */}
      {activeView === 'detail' && selectedProgram && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Breadcrumb / Back to List Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-3.5 shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveView('main')}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-2xs hover:shadow-xs"
              >
                <ArrowLeft className="w-4 h-4 text-[#1B5E20]" />
                <span>Kembali ke Daftar Program</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-semibold text-slate-900 truncate max-w-[260px] sm:max-w-md">
                {selectedProgram.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500">ID Program:</span>
              <span className="px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                {selectedProgram.id}
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
                  ID: {selectedProgram.id} • {selectedProgram.city}, {selectedProgram.province} • {selectedProgram.jenisWakaf} • Rekening: {selectedProgram.bankName || selectedProgram.bankAccount}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(true)}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <DollarSign className="w-4 h-4 text-slate-950" />
                  <span>Ajukan Penarikan Dana</span>
                </button>
              </div>
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
                    {selectedProgram.progressFisik >= 80
                      ? 'Tahap Akhir'
                      : selectedProgram.progressFisik >= 50
                      ? 'Konstruksi Berjalan'
                      : 'Fondasi & Awal'}
                  </span>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={selectedProgram.progressFisik}
                onChange={(e) =>
                  handleUpdateProgressFisik(selectedProgram.id, parseInt(e.target.value, 10) || 0)
                }
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
                type="button"
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
                type="button"
                onClick={() => setWorkbenchTab('termin')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  workbenchTab === 'termin'
                    ? 'bg-[#1B5E20] text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Landmark className="w-3.5 h-3.5" />
                <span>
                  Pencairan Termin &amp; Kas Escrow (
                  {terminList.filter((t) => t.programId === selectedProgram.id).length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setWorkbenchTab('wakif')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  workbenchTab === 'wakif'
                    ? 'bg-[#1B5E20] text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  Daftar Wakif &amp; Kabar WA (
                  {wakifList.filter((w) => w.programId === selectedProgram.id).length})
                </span>
              </button>

              <button
                type="button"
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
              <div className="space-y-4">
                <form
                  onSubmit={handleAddReceipt}
                  className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <Receipt className="w-4 h-4 text-[#1B5E20]" />
                      <span>Form Unggah Bukti Nota / Kuitansi Belanja Digital</span>
                    </h4>
                    <span className="text-[10px] text-slate-400">Verifikasi Dokumen Transparan</span>
                  </div>

                  <input
                    type="file"
                    ref={receiptFileInputRef}
                    accept="image/*,application/pdf"
                    onChange={handleReceiptFileSelect}
                    className="hidden"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Nama Nota / Pengeluaran Belanja
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Pengadaan Material Semen & Pasir Cor"
                        value={newReceiptTitle}
                        onChange={(e) => setNewReceiptTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-700 focus:outline-hidden text-slate-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Nominal (Rp)</label>
                      <input
                        type="number"
                        placeholder="5550000"
                        value={newReceiptAmount}
                        onChange={(e) => setNewReceiptAmount(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-700 focus:outline-hidden text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => receiptFileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
                      >
                        <Upload className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Pilih File Kuitansi</span>
                      </button>
                      <span className="text-[11px] truncate max-w-[180px] font-mono text-slate-600 font-semibold">
                        {newReceiptFile}
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#1B5E20] hover:bg-[#144716] text-white font-bold text-xs transition cursor-pointer shrink-0 shadow-xs"
                    >
                      Tambah Kuitansi
                    </button>
                  </div>

                  {receiptPreviewUrl && (
                    <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-200 flex items-center gap-3">
                      <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-slate-300 shadow-xs">
                        <Image
                          src={receiptPreviewUrl}
                          alt="Preview Kuitansi"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-emerald-900 block">Preview Berkas Kuitansi</span>
                        <span className="text-[10px] text-slate-500 font-mono">{newReceiptFile}</span>
                      </div>
                    </div>
                  )}
                </form>

                {/* Table of uploaded receipts */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Receipt className="w-4 h-4 text-slate-600" />
                      Daftar Kuitansi &amp; Nota Belanja Digital Terunggah ({selectedProgram.receipts.length} Berkas)
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      Total Realisasi Belanja:{' '}
                      <strong>
                        Rp{' '}
                        {selectedProgram.receipts
                          .reduce((acc, r) => acc + r.amount, 0)
                          .toLocaleString('id-ID')}
                      </strong>
                    </span>
                  </div>

                  {selectedProgram.receipts.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs">
                      Belum ada kuitansi yang diunggah untuk program ini. Gunakan formulir di atas untuk mengunggah kuitansi.
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="py-3 px-4">Judul Pengeluaran / Nota</th>
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
                              <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                                {rcp.date}
                              </td>
                              <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                                Rp {rcp.amount.toLocaleString('id-ID')}
                              </td>
                              <td className="py-3 px-4 text-blue-700 font-mono text-[11px]">
                                <span className="flex items-center gap-1">
                                  <FileText className="w-3 h-3 text-blue-600" />
                                  {rcp.fileName}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-100 text-emerald-800 border-emerald-200">
                                  {rcp.status || 'Terverifikasi DPS'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SUB-TAB 2: PENCAIRAN TERMIN & KAS ESCROW */}
            {workbenchTab === 'termin' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">
                      Total Wakaf Terhimpun
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 font-mono block mt-1">
                      Rp {selectedProgram.collectedAmount.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
                      Target: Rp {selectedProgram.targetAmount.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                      Dana Telah Dicairkan
                    </span>
                    <span className="text-sm font-extrabold text-emerald-950 font-mono block mt-1">
                      Rp 1.100.000.000
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
                      2 Termin Selesai Terverifikasi
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                    <span className="text-[10px] font-bold text-blue-800 uppercase block">
                      Sisa Saldo di Escrow BSI
                    </span>
                    <span className="text-sm font-extrabold text-blue-950 font-mono block mt-1">
                      Rp 650.000.000
                    </span>
                    <span className="text-[10px] text-blue-700 font-semibold mt-0.5 block">
                      Siap dicairkan sesuai termin progres
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="text-[10px] font-bold text-amber-800 uppercase block">
                      Realisasi Belanja Kuitansi
                    </span>
                    <span className="text-sm font-extrabold text-amber-950 font-mono block mt-1">
                      Rp{' '}
                      {selectedProgram.receipts
                        .reduce((acc, r) => acc + r.amount, 0)
                        .toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold mt-0.5 block">
                      Tervalidasi Dewan Pengawas Syariah
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Landmark className="w-4 h-4 text-[#1B5E20]" />
                      Riwayat Pengajuan &amp; Termin Pencairan Dana Proyek
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Pencairan dana dilakukan bertahap sesuai Surat Perjanjian Kerja (SPK) &amp; Berita Acara Progres Fisik.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-[#1B5E20] hover:bg-[#144716] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0 self-start sm:self-auto"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Ajukan Pencairan Termin Baru</span>
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Tahap / Termin</th>
                        <th className="py-3 px-4">Nominal Pencairan</th>
                        <th className="py-3 px-4">Rekening Tujuan</th>
                        <th className="py-3 px-4">Dokumen SPK/BAP</th>
                        <th className="py-3 px-4">Tgl Pengajuan</th>
                        <th className="py-3 px-4 text-center">Status Audit &amp; Pencairan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {terminList
                        .filter((t) => t.programId === selectedProgram.id)
                        .map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50/70 transition">
                            <td className="py-3 px-4 font-bold text-slate-900">
                              {t.terminKe}
                              <span className="block text-[10px] text-slate-400 font-mono font-normal">
                                ID: {t.id}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-extrabold text-slate-900 font-mono">
                              Rp {t.nominal.toLocaleString('id-ID')}
                            </td>
                            <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                              {t.targetRekening}
                            </td>
                            <td className="py-3 px-4 text-blue-700 font-mono text-[11px]">
                              <button
                                type="button"
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
                                <span>{t.dokumen}</span>
                              </button>
                            </td>
                            <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                              {t.tanggalPengajuan}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-block ${
                                  t.status.includes('Selesai')
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                    : 'bg-amber-100 text-amber-800 border-amber-200'
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
                      Daftar Wakif &amp; Layanan Silaturahmi Progres Pembangunan
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Kirim update laporan progres pembangunan {selectedProgram.progressFisik}% langsung ke WhatsApp Wakif dan cetak Akta Ikrar Wakaf (AIW).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      showToast({
                        title: 'Siarkan Progres ke Semua Wakif',
                        description: `Notifikasi WhatsApp update progres fisik ${selectedProgram.progressFisik}% telah dijadwalkan ke ${
                          wakifList.filter((w) => w.programId === selectedProgram.id).length
                        } wakif.`,
                        type: 'success',
                      });
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0 self-start sm:self-auto"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Siarkan Update WA ({selectedProgram.progressFisik}%)</span>
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
                              <span className="text-[10px] text-slate-500 font-mono">
                                {w.phone} • Tgl: {w.tanggal}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                              Rp {w.nominal.toLocaleString('id-ID')}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                {w.akad}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                              {w.sertifikatNo}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                {w.statusSertifikat}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    showToast({
                                      title: 'Notifikasi WhatsApp Dikirim',
                                      description: `Pesan update progres fisik ${selectedProgram.progressFisik}% berhasil dikirim ke ${w.name} (${w.phone}).`,
                                      type: 'success',
                                    })
                                  }
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition shadow-2xs"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Kabar WA</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    showToast({
                                      title: 'Akta Ikrar Wakaf (AIW)',
                                      description: `Mengunduh sertifikat resmi ${w.sertifikatNo} a.n. ${w.name}...`,
                                      type: 'info',
                                    })
                                  }
                                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition"
                                >
                                  <FileText className="w-3 h-3 text-slate-500" />
                                  <span>Cetak AIW</span>
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
                      Kewajiban pelaporan berkala 6 bulan sekali sesuai amanat UU No. 41 Tahun 2004 &amp; Peraturan BWI No. 4 Tahun 2010.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      showToast({
                        title: 'Unduh Laporan BWI',
                        description: 'Menyiapkan berkas PDF Laporan Semester I BWI...',
                        type: 'info',
                      })
                    }
                    className="px-4 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs shrink-0 self-start sm:self-auto"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Dokumen Laporan BWI (PDF)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block">Status Nazhir Terdaftar</span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      Yayasan Waqf Al-Kautsar Nusantara
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700">
                      No. Registrasi: BWI.3.1.0028/2024
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block">Periode Pelaporan</span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      Semester I - 2026 (Jan - Jun 2026)
                    </span>
                    <span className="text-[10px] text-slate-500">Status: Lengkap &amp; Siap Submit</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block">
                      Pemeriksaan Dewan Pengawas Syariah
                    </span>
                    <span className="font-bold text-emerald-800 block mt-0.5">Opini Syariah Terpenuhi (WTP)</span>
                    <span className="text-[10px] text-slate-500">DPS: Dr. H. Anwar Sadat, M.Ag.</span>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block text-xs">Komponen Rekapitulasi Pelaporan:</span>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
                    <li>
                      Daftar seluruh penghimpunan wakaf uang &amp; wakaf melalui uang:{' '}
                      <strong>Rp {selectedProgram.collectedAmount.toLocaleString('id-ID')}</strong>
                    </li>
                    <li>
                      Realisasi belanja operasional dan fisik proyek:{' '}
                      <strong>
                        Rp{' '}
                        {selectedProgram.receipts
                          .reduce((acc, r) => acc + r.amount, 0)
                          .toLocaleString('id-ID')}
                      </strong>
                    </li>
                    <li>
                      Progres capaian fisik konstruksi: <strong>{selectedProgram.progressFisik}%</strong>
                    </li>
                    <li>
                      Sertifikat Akta Ikrar Wakaf (AIW) terbit:{' '}
                      <strong>
                        {wakifList.filter((w) => w.programId === selectedProgram.id).length} Lembar Resmi
                      </strong>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL FORM PEMBUATAN PROGRAM BARU */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-4 sm:p-6 pb-3 sm:pb-4 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-800" />
                  {editingProgramId ? 'Edit Program Donasi' : 'Form Pembuatan Program Baru'}
                </h3>
                <p className="text-xs text-slate-500">Lengkapi data program untuk diterbitkan di Amwal Platform</p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto grow">
              {/* Filter Badges */}
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <Tag className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Rekomendasi Kata Kunci Instan:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Sekolah', 'Masjid', 'Sosial', 'Kesehatan', 'Air Bersih', 'Pemberdayaan'].map((badge) => (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => handleBadgeClick(badge)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 hover:bg-emerald-600 hover:text-white text-emerald-800 font-bold transition shadow-2xs cursor-pointer flex items-center gap-1"
                    >
                      <span>+ {badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nama Program & Deskripsi */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Nama Program *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pembangunan Gedung Sekolah Yatim"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Deskripsi Lengkap *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan tujuan program, manfaat bagi jamaah/dhuafa, dan rencana alokasi..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden text-slate-900"
                />
              </div>

              {/* Unggah Banner dengan Tombol Pilih File & Live Preview Gambar */}
              <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <Eye className="w-4 h-4 text-emerald-800" />
                    <span>Unggah Banner Program &amp; Live Preview Gambar *</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-medium">Rekomendasi 1200x630 (16:9)</span>
                </div>

                <input
                  type="file"
                  ref={bannerFileInputRef}
                  accept="image/*"
                  onChange={handleBannerFileSelect}
                  className="hidden"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                  <div className="space-y-2">
                    <div
                      onClick={() => bannerFileInputRef.current?.click()}
                      className="border-2 border-dashed border-emerald-300 hover:border-emerald-600 bg-white hover:bg-emerald-50/50 p-3.5 rounded-xl text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group shadow-2xs"
                    >
                      <div className="p-2 rounded-full bg-emerald-100 group-hover:bg-emerald-200 text-emerald-800 transition">
                        <Upload className="w-4 h-4 text-emerald-800" />
                      </div>
                      <div>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs inline-block shadow-2xs mb-1">
                          Pilih File Gambar Banner
                        </span>
                        <p className="text-[11px] text-slate-600">
                          Klik untuk memilih dari HP/Komputer atau seret file ke sini
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        PNG, JPG, WEBP, GIF (Maks. 5MB)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 shrink-0">Atau Link URL:</span>
                      <input
                        type="text"
                        placeholder="https://domain.com/banner.jpg"
                        value={formData.bannerUrl}
                        onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:ring-1 focus:ring-emerald-800 text-slate-900 text-xs bg-white"
                      />
                    </div>
                  </div>

                  {/* Banner Preview */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-2 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-emerald-700" /> Preview Gambar Banner
                      </span>
                      {formData.bannerUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, bannerUrl: '' })}
                          className="text-rose-600 hover:text-rose-800 font-bold text-[10px] cursor-pointer"
                        >
                          Hapus Banner
                        </button>
                      )}
                    </div>

                    {formData.bannerUrl ? (
                      <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 h-28 sm:h-32 group">
                        <Image
                          src={formData.bannerUrl}
                          alt="Preview Banner Program"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => bannerFileInputRef.current?.click()}
                            className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-slate-900 font-bold text-[11px] shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3 text-emerald-800" /> Ganti Gambar
                          </button>
                        </div>
                        <span className="absolute bottom-1.5 right-1.5 bg-emerald-900/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-2xs">
                          Preview Gambar Siap Terbit
                        </span>
                      </div>
                    ) : (
                      <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 h-28 sm:h-32 flex flex-col items-center justify-center text-slate-400 gap-1 text-[11px]">
                        <Eye className="w-6 h-6 text-slate-300" />
                        <span>Belum Ada File Gambar Dipilih</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Target Dana, Durasi, Rekening Bank */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Target Dana (Rp) *</label>
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 500000000"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" /> Durasi Program
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 60 Hari"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-700" /> Rekening Bank
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: BSI - 7182938475 a.n. Amwal"
                    value={formData.bankAccount}
                    onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden text-slate-900"
                  />
                </div>
              </div>

              {/* Dropdown: Lokasi, Jenis Wakaf, Kategori */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" /> Pilihan Lokasi &amp; Klasifikasi Program
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Provinsi</label>
                    <select
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden text-slate-900 font-semibold bg-white"
                    >
                      <option value="Jawa Barat">Jawa Barat</option>
                      <option value="DKI Jakarta">DKI Jakarta</option>
                      <option value="Jawa Tengah">Jawa Tengah</option>
                      <option value="Jawa Timur">Jawa Timur</option>
                      <option value="Banten">Banten</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Kabupaten / Kota</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden text-slate-900 font-semibold bg-white"
                    >
                      <option value="Kab. Sukabumi">Kab. Sukabumi</option>
                      <option value="Jakarta Selatan">Jakarta Selatan</option>
                      <option value="Kota Bandung">Kota Bandung</option>
                      <option value="Kab. Gunungkidul">Kab. Gunungkidul</option>
                      <option value="Kota Surabaya">Kota Surabaya</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Detail Alamat / Kec.</label>
                    <input
                      type="text"
                      placeholder="Kec. Cisaat, Desa Maju"
                      value={formData.locationDetail}
                      onChange={(e) => setFormData({ ...formData, locationDetail: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden text-slate-900 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Jenis Wakaf</label>
                    <select
                      value={formData.jenisWakaf}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jenisWakaf: e.target.value as 'Wakaf Uang' | 'Wakaf Melalui Uang',
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden text-slate-900 font-semibold bg-white"
                    >
                      <option value="Wakaf Uang">Wakaf Uang</option>
                      <option value="Wakaf Melalui Uang">Wakaf Melalui Uang</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Kategori Program</label>
                    <select
                      value={formData.kategori}
                      onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden text-slate-900 font-semibold bg-white"
                    >
                      <option value="Sekolah">Sekolah / Pendidikan</option>
                      <option value="Masjid">Masjid / Keagamaan</option>
                      <option value="Sosial">Sosial / Kemanusiaan</option>
                      <option value="Kesehatan">Kesehatan / RS</option>
                      <option value="Air Bersih">Air Bersih &amp; Sanitasi</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Radio: Menerima Wakaf Barang */}
              <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200">
                <label className="font-bold text-slate-800 block mb-1 text-xs">
                  Menerima Wakaf Barang / Material?
                </label>
                <div className="flex flex-wrap items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-900 text-xs">
                    <input
                      type="radio"
                      name="menerimaWakafBarang"
                      value="Ya"
                      checked={formData.menerimaWakafBarang === 'Ya'}
                      onChange={() => setFormData({ ...formData, menerimaWakafBarang: 'Ya' })}
                      className="text-emerald-800 focus:ring-emerald-600"
                    />
                    <span>Ya (Menerima material semen, tanah, alat, dll.)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-900 text-xs">
                    <input
                      type="radio"
                      name="menerimaWakafBarang"
                      value="Tidak"
                      checked={formData.menerimaWakafBarang === 'Tidak'}
                      onChange={() => setFormData({ ...formData, menerimaWakafBarang: 'Tidak' })}
                      className="text-emerald-800 focus:ring-emerald-600"
                    />
                    <span>Tidak (Hanya Dana Tunai)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Terbitkan Program</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AJUKAN PENARIKAN DANA */}
      {showWithdrawModal && selectedProgram && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-4 sm:p-5 pb-3 border-b border-slate-100 shrink-0">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-600" />
                Pengajuan Penarikan Dana
              </h3>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWithdrawFunds} className="p-4 sm:p-5 space-y-3 text-xs overflow-y-auto grow">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Program:</span>
                <span className="font-bold text-slate-900 block">{selectedProgram.name}</span>
                <span className="text-slate-500 block mt-1">Rekening Tujuan:</span>
                <span className="font-mono font-bold text-emerald-800 block">
                  {selectedProgram.bankAccount || selectedProgram.bankName}
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Nominal Penarikan Dana (Rp) *</label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 15000000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-slate-900 font-extrabold text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Catatan Alokasi Penggunaan *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Penjelasan peruntukan pencairan (misal: Pembayaran tahap 2 pondasi)..."
                  value={withdrawNote}
                  onChange={(e) => setWithdrawNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Kirim Pengajuan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
