'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  ShieldCheck,
  Search,
  Download,
  CheckCircle2,
  Clock,
  Filter,
  User,
  CreditCard,
  Building2,
  Receipt,
  TrendingUp,
  Wallet,
  Landmark,
  FileText,
  ExternalLink,
  Lock,
  Layers,
  Calendar,
  AlertCircle,
  Eye,
  X,
  Tag,
  Sparkles,
  Plus,
  Edit3,
  Trash2,
  UploadCloud,
  Check,
  FileCheck,
  HeartHandshake,
  Coins,
  PackageCheck,
  Send,
  Users,
  Award,
  BadgeCheck,
  FileBadge,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export type RoleType = 'super_admin' | 'nazhir' | 'amil' | 'lainnya' | 'donatur';

export interface LegalDocumentItem {
  id: string;
  title: string;
  category: string;
  docNumber: string;
  issuer: string;
  validUntil: string;
  status: string;
  badge?: string;
  fileSize: string;
  fileName?: string;
  description: string;
  roleScope?: 'all' | 'nazhir' | 'amil';
}

interface DocumentsSectionProps {
  initialSubTab?: 'transparency' | 'legalitas';
  currentRole?: RoleType;
}

export function DocumentsView({
  initialSubTab = 'legalitas',
  currentRole = 'super_admin',
}: DocumentsSectionProps = {}) {
  const { showToast } = useToast();
  const [mainTab, setMainTab] = useState<'transparency' | 'legalitas'>(initialSubTab);

  // Sub tabs state based on role
  // For Amil ('lainnya'): 'ziswaf_transactions' | 'ziswaf_disbursements' | 'ziswaf_audit'
  // For Nazhir ('nazhir'): 'transactions' | 'physical'
  // For Super Admin: 'transactions' | 'physical' | 'ziswaf_disbursements' | 'superadmin_audit'
  const defaultSubTab =
    currentRole === 'lainnya'
      ? 'ziswaf_transactions'
      : currentRole === 'nazhir'
      ? 'physical'
      : 'transactions';

  const [transparencySubTab, setTransparencySubTab] = useState<string>(defaultSubTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAkad, setFilterAkad] = useState<string>('SEMUA');

  // Search & Filter state specifically for Legalitas Lembaga
  const [legalSearchQuery, setLegalSearchQuery] = useState('');
  const [legalCategoryFilter, setLegalCategoryFilter] = useState<string>('SEMUA');

  // 1. ZISWAF & Global Incoming Transactions
  const transactions = [
    {
      id: 'TX-ZKT-2026-891',
      donorName: 'Dr. H. Muhammad Arifin, M.Ag.',
      isAnonymous: false,
      donorId: 'MZK-00182',
      amount: 45000000,
      jenisAkad: 'Zakat Maal',
      timestamp: '26 Agt 2026, 09:15:20 WIB',
      program: 'Penyaluran Asnaf Fakir & Pengentasan Kemiskinan',
      paymentMethod: 'BSI Virtual Account',
      statusMuzakki: 'Muzakki Terdaftar',
      bszNumber: 'BSZ-BAZNAS/2026/08/8821',
      scope: 'ziswaf',
    },
    {
      id: 'TX-INF-2026-440',
      donorName: 'Hamba Allah',
      isAnonymous: true,
      donorId: 'MNF-00912',
      amount: 2500000,
      jenisAkad: 'Infaq Subuh',
      timestamp: '26 Agt 2026, 06:40:12 WIB',
      program: 'Sedekah Subuh & Santunan 1.000 Anak Yatim',
      paymentMethod: 'QRIS Syariah Dinamis',
      statusMuzakki: 'Munfiq Anonim',
      bszNumber: 'QRIS-NPP-2026/08/440',
      scope: 'ziswaf',
    },
    {
      id: 'TX-QRB-2026-105',
      donorName: 'Keluarga Bpk. Rahmat Santoso (7 Jiwa)',
      isAnonymous: false,
      donorId: 'SHB-00045',
      amount: 20650000,
      jenisAkad: 'Qurban Sapi 1 Ekor (7/7)',
      timestamp: '25 Agt 2026, 14:10:05 WIB',
      program: 'Paket Qurban Sapi Limousin & Distribusi Pelosok NTT',
      paymentMethod: 'Transfer Mandiri Syariah',
      statusMuzakki: 'Shohibul Qurban',
      bszNumber: 'QRB-WAKALAH-2026/0105',
      scope: 'ziswaf',
    },
    {
      id: 'TX-INF-2026-439',
      donorName: 'PT Mandiri Sejahtera Logistik',
      isAnonymous: false,
      donorId: 'CORP-0089',
      amount: 35000000,
      jenisAkad: 'Infaq Program Khusus',
      timestamp: '25 Agt 2026, 11:20:45 WIB',
      program: 'Bantuan Tanggap Darurat Bencana Banjir Bandang',
      paymentMethod: 'BCA Syariah Corporate VA',
      statusMuzakki: 'Munfiq Korporasi',
      bszNumber: 'INF-REC/2026/08/119',
      scope: 'ziswaf',
    },
    {
      id: 'TX-ZKT-2026-890',
      donorName: 'Hj. Siti Mariam, S.E.',
      isAnonymous: false,
      donorId: 'MZK-00341',
      amount: 12500000,
      jenisAkad: 'Zakat Penghasilan',
      timestamp: '24 Agt 2026, 16:05:18 WIB',
      program: 'Program Beasiswa Generasi Emas Fisabilillah',
      paymentMethod: 'QRIS Syariah',
      statusMuzakki: 'Muzakki Terverifikasi',
      bszNumber: 'BSZ-BAZNAS/2026/08/8819',
      scope: 'ziswaf',
    },
    {
      id: 'TX-WKF-2026-992',
      donorName: 'Ir. H. Hendra Wijaya',
      isAnonymous: false,
      donorId: 'WKF-00109',
      amount: 100000000,
      jenisAkad: 'Wakaf Uang',
      timestamp: '24 Agt 2026, 15:10:44 WIB',
      program: 'Waqf Pembangunan Klinik Air Bersih Al-Azhar',
      paymentMethod: 'Transfer Bank Syariah (BSI)',
      statusMuzakki: 'Wakif Abadi',
      bszNumber: 'SWU-BWI/2026/00109',
      scope: 'wakaf',
    },
    {
      id: 'TX-WKF-2026-991',
      donorName: 'Dra. Hj. Siti Rahmah',
      isAnonymous: false,
      donorId: 'WKF-00341',
      amount: 15000000,
      jenisAkad: 'Wakaf Melalui Uang',
      timestamp: '23 Agt 2026, 11:45:18 WIB',
      program: 'Waqf Renovasi Gedung Sekolah Tahfidz Yatim',
      paymentMethod: 'QRIS Syariah',
      statusMuzakki: 'Wakif Terdaftar',
      bszNumber: 'SWU-BWI/2026/00341',
      scope: 'wakaf',
    },
  ];

  // 2. Physical Wakaf Construction Logs (Nazhir)
  const physicalLogs = [
    {
      id: 'LOG-WKF-2026-084',
      timestamp: '25 Agt 2026, 14:22 WIB',
      program: 'Waqf Pembangunan Klinik Air Bersih Al-Azhar',
      activity: 'Pemasangan Pipa Besi Galvanis & Pompa Submersible 3 HP',
      progressFisik: 65,
      disbursement: 18500000,
      receiptFile: 'Kuitansi_Pipa_02.png',
      status: 'Terverifikasi DPS & Super Admin',
      vendor: 'CV Tirta Abadi Teknik',
    },
    {
      id: 'LOG-WKF-2026-083',
      timestamp: '20 Agt 2026, 11:05 WIB',
      program: 'Sumur Waqf Produktif Desa Maju Sukabumi',
      activity: 'Selesai Pengeboran Kedalaman 80 Meter & Uji Kelayakan Baku Air',
      progressFisik: 92,
      disbursement: 24000000,
      receiptFile: 'Nota_Pengeboran_Sumur.pdf',
      status: 'Terverifikasi DPS & Super Admin',
      vendor: 'PT Geosurvey Nusantara',
    },
    {
      id: 'LOG-WKF-2026-082',
      timestamp: '14 Agt 2026, 09:30 WIB',
      program: 'Pengadaan Ambulans Gratis Dhuafa Al-Kautsar',
      activity: 'Pembayaran Uang Muka Karoseri Medis & Sirine Ambulans',
      progressFisik: 30,
      disbursement: 45000000,
      receiptFile: 'DP_Karoseri_Ambulans.pdf',
      status: 'Terverifikasi DPS & Super Admin',
      vendor: 'PT Ambulance Medika Karoseri',
    },
    {
      id: 'LOG-WKF-2026-081',
      timestamp: '08 Agt 2026, 16:45 WIB',
      program: 'Waqf Pembangunan Klinik Air Bersih Al-Azhar',
      activity: 'Pengadaan Semen Tiga Roda 60 Sak & Pasir Pasang Super',
      progressFisik: 58,
      disbursement: 5550000,
      receiptFile: 'Kuitansi_Material_Semen.jpg',
      status: 'Terverifikasi DPS & Super Admin',
      vendor: 'TB Mitra Bangunan',
    },
  ];

  // 3. ZISWAF & 8 Asnaf Distribution Logs (Amil ZISWAF)
  const ziswafDisbursementLogs = [
    {
      id: 'LOG-ZIS-2026-051',
      timestamp: '26 Agt 2026, 10:30 WIB',
      program: 'Penyaluran Asnaf Fakir & Miskin — Paket Sembako & Uang Tunai',
      asnafCategory: 'Fakir & Miskin (Asnaf 1 & 2)',
      activity: 'Distribusi 250 paket sembako beras organik 5kg, minyak, telur & santunan tunai mustahik',
      recipientsCount: 250,
      disbursement: 62500000,
      bastDocument: 'BAST_Penyaluran_Fakir_Miskin_Kelurahan_Jatinegara.pdf',
      status: 'Terverifikasi DPS & BAZNAS',
      location: 'Kec. Jatinegara, Jakarta Timur',
    },
    {
      id: 'LOG-ZIS-2026-050',
      timestamp: '25 Agt 2026, 15:45 WIB',
      program: 'Beasiswa Pendidikan Santri Dhuafa Fisabilillah',
      asnafCategory: 'Fisabilillah (Asnaf 7)',
      activity: 'Penyaluran SPP, kitab kuning, dan biaya hidup 45 santri tahfidz pelosok Banten',
      recipientsCount: 45,
      disbursement: 45000000,
      bastDocument: 'Kuitansi_SPP_Pesantren_Tahfidz_Banten.pdf',
      status: 'Terverifikasi DPS & BAZNAS',
      location: 'Kab. Pandeglang, Banten',
    },
    {
      id: 'LOG-ZIS-2026-049',
      timestamp: '24 Agt 2026, 13:00 WIB',
      program: 'Bantuan Darurat Korban Kebakaran & Bencana',
      asnafCategory: 'Gharimin & Ibnu Sabil (Asnaf 6 & 8)',
      activity: 'Bantuan sewa hunian sementara dan modal usaha pemulihan 12 kepala keluarga mustahik',
      recipientsCount: 12,
      disbursement: 36000000,
      bastDocument: 'Berita_Acara_Serah_Terima_Bencana_Kebakaran.pdf',
      status: 'Terverifikasi DPS & BAZNAS',
      location: 'Kec. Tambora, Jakarta Barat',
    },
    {
      id: 'LOG-ZIS-2026-048',
      timestamp: '22 Agt 2026, 11:15 WIB',
      program: 'Pembinaan & Modal Usaha Muallaf Mandiri',
      asnafCategory: 'Muallaf (Asnaf 4)',
      activity: 'Pemberian gerobak usaha kuliner halal dan modal kerja untuk 8 mualaf binaan',
      recipientsCount: 8,
      disbursement: 28000000,
      bastDocument: 'BAST_Gerobak_Usaha_Mualaf_Center.pdf',
      status: 'Terverifikasi DPS & BAZNAS',
      location: 'Kota Kupang, NTT',
    },
    {
      id: 'LOG-ZIS-2026-047',
      timestamp: '20 Agt 2026, 09:20 WIB',
      program: 'Distribusi Daging Qurban Pelosok Nusantara',
      asnafCategory: 'Program Sosial Qurban Mustahik',
      activity: 'Penyaluran 840 besek besek daging segar sapi dan kambing hasil sembelih syar’i RPH',
      recipientsCount: 840,
      disbursement: 58800000,
      bastDocument: 'Laporan_Distribusi_Daging_Qurban_Pedalaman.pdf',
      status: 'Sertifikasi Halal Juleha & DPS',
      location: 'Desa Oebelo, Kab. Kupang',
    },
  ];

  // 4. Centralized Legal Documents
  const initialLegalDocs: LegalDocumentItem[] = [
    {
      id: 'LEG-01',
      title: 'SK Izin Operasional Lembaga Amil Zakat (LAZ) & UPZ BAZNAS RI',
      category: 'Legalitas Lembaga Amil Zakat (LAZ)',
      docNumber: 'BAZNAS/KEP-LAZ/0892/2024 / KEMENAG-DJ.VII/2024',
      issuer: 'Badan Amil Zakat Nasional (BAZNAS) & Kemenag RI',
      validUntil: '31 Desember 2028',
      status: 'AKTIF & TERVALIDASI',
      badge: 'Resmi BAZNAS',
      fileSize: '3.6 MB (PDF Signed)',
      fileName: 'SK_Izin_Operasional_LAZ_BAZNAS_2024.pdf',
      description: 'Keputusan resmi penetapan izin operasional Lembaga Amil Zakat skala nasional dan Unit Pengumpul Zakat (UPZ) sesuai UU No. 23 Tahun 2011.',
      roleScope: 'all',
    },
    {
      id: 'LEG-02',
      title: 'Tanda Daftar Nazhir Wakaf Uang Badan Wakaf Indonesia (BWI)',
      category: 'Izin Operasional Nazhir',
      docNumber: 'BWI.3.1.0028/2024 / KEP-BWI/NZ/2024',
      issuer: 'Badan Wakaf Indonesia (BWI) Pusat',
      validUntil: '31 Desember 2028',
      status: 'AKTIF & TERVALIDASI',
      badge: 'Utama BWI',
      fileSize: '2.4 MB (PDF Signed)',
      fileName: 'Tanda_Daftar_Nazhir_BWI_2024.pdf',
      description: 'Lisensi resmi tanda daftar Nazhir Wakaf Uang (STBPN) sesuai amanat UU No. 41 Tahun 2004 & PP No. 25 Tahun 2018.',
      roleScope: 'nazhir',
    },
    {
      id: 'LEG-03',
      title: 'Rekomendasi & Fatwa Dewan Pengawas Syariah (DPS) DSN-MUI',
      category: 'Kepatuhan Syariah ZISWAF',
      docNumber: 'DSN-MUI/REK-ZISWAF/0991/2024',
      issuer: 'Dewan Syariah Nasional Majelis Ulama Indonesia',
      validUntil: '15 Juli 2027',
      status: 'AKTIF & TERVALIDASI',
      badge: 'Syariah MUI',
      fileSize: '1.8 MB (PDF)',
      fileName: 'Rekomendasi_DPS_DSN_MUI.pdf',
      description: 'Fatwa dan penetapan DPS DSN-MUI mengenai kesesuaian syariah tata kelola Zakat, Infaq, Sedekah, Qurban, dan Wakaf Uang.',
      roleScope: 'all',
    },
    {
      id: 'LEG-04',
      title: 'Izin Pengumpulan Uang dan Barang (PUB) Kemensos & Kemenag RI',
      category: 'Legalitas Lembaga Sosial',
      docNumber: 'KEMENSOS.PUB/VII/4421/2024',
      issuer: 'Kementerian Sosial & Kemenag RI',
      validUntil: '20 Agustus 2027',
      status: 'AKTIF & TERVALIDASI',
      badge: 'Kemensos',
      fileSize: '3.1 MB (PDF)',
      fileName: 'Izin_PUB_Kemensos_Kemenag_2024.pdf',
      description: 'Izin resmi penyelenggaraan pengumpulan dana donasi ZISWAF dan program kemanusiaan skala nasional.',
      roleScope: 'all',
    },
    {
      id: 'LEG-05',
      title: 'Penetapan Rekening Giro Terpisah ZISWAF & LKS-PWU BSI',
      category: 'Perbankan Syariah Terpisah',
      docNumber: 'BSI/DIR-PWU-ZIS/00881/2024',
      issuer: 'Bank Syariah Indonesia (BSI) Kantor Pusat',
      validUntil: '31 Desember 2028',
      status: 'AKTIF & TERVALIDASI',
      badge: 'Rekening Syariah',
      fileSize: '1.9 MB (PDF)',
      fileName: 'Penetapan_Rekening_ZISWAF_LKS_PWU_BSI.pdf',
      description: 'Surat ketetapan pemisahan rekening bank peruntukan: Rekening Zakat, Rekening Infaq, Rekening Qurban, dan Rekening Giro Wakaf Uang (LKS-PWU).',
      roleScope: 'all',
    },
    {
      id: 'LEG-06',
      title: 'Akta Pendirian Yayasan & Pengesahan Kemenkumham RI',
      category: 'Badan Hukum',
      docNumber: 'AHU-0019283.AH.01.04.Tahun 2023',
      issuer: 'Kementerian Hukum dan HAM Republik Indonesia',
      validUntil: 'Seumur Hidup / Permanen',
      status: 'TERDAFTAR RESMI',
      badge: 'Badan Hukum',
      fileSize: '4.5 MB (PDF)',
      fileName: 'Akta_Notaris_Kemenkumham.pdf',
      description: 'Akta notaris pendirian badan hukum yayasan pengelola wakaf dan ziswaf serta lembaran berita negara.',
      roleScope: 'all',
    },
    {
      id: 'LEG-07',
      title: 'Ketetapan Lembaga Penerima Zakat Pengurang Penghasilan Bruto (Fiskal)',
      category: 'Perpajakan & Pengurang Pajak',
      docNumber: '02.481.992.4-012.000 / KEP-PBN-ZIS/2024',
      issuer: 'Direktorat Jenderal Pajak (DJP) Kemenkeu RI',
      validUntil: 'Permanen / Aktif',
      status: 'TERDAFTAR RESMI',
      badge: 'Pengurang Pajak',
      fileSize: '1.2 MB (PDF)',
      fileName: 'SK_Fiskal_Pengurang_Pajak_DJP.pdf',
      description: 'Ketetapan resmi bukti setor zakat (BSZ) dan wakaf uang yang diterbitkan sah sebagai pengurang pajak penghasilan (Pasal 22 UU No. 23/2011).',
      roleScope: 'all',
    },
    {
      id: 'LEG-08',
      title: 'Opini Audit Keuangan Syariah Wajar Tanpa Pengecualian (WTP)',
      category: 'Audit Keuangan & Transparansi',
      docNumber: 'KAP-AHR/WTP-ZISWAF/0081/2025',
      issuer: 'Kantor Akuntan Publik (KAP) Amir, Hendro & Rekan',
      validUntil: 'Periode Buku 2025/2026',
      status: 'OPINI WTP',
      badge: 'Audit WTP',
      fileSize: '5.2 MB (PDF)',
      fileName: 'Opini_Audit_KAP_WTP_Ziswaf_2025.pdf',
      description: 'Laporan hasil audit tahunan akuntabilitas keuangan lembaga dengan opini tertinggi Wajar Tanpa Pengecualian (WTP).',
      roleScope: 'all',
    },
    {
      id: 'LEG-09',
      title: 'Sertifikasi ISO 9001:2015 Manajemen Mutu Pengelolaan ZISWAF',
      category: 'Kepatuhan & Sertifikasi Mutu',
      docNumber: 'ISO-QMS-9001/JKT/2024/099',
      issuer: 'Badan Sertifikasi Manajemen Mutu Internasional (TUV)',
      validUntil: '10 Oktober 2027',
      status: 'TERSTANDARISASI',
      badge: 'ISO 9001',
      fileSize: '2.7 MB (PDF)',
      fileName: 'ISO_9001_Sertifikat_Ziswaf.pdf',
      description: 'Sertifikasi standar internasional sistem tata kelola mutu, kepatuhan audit asnaf, dan transparansi distribusi donasi.',
      roleScope: 'all',
    },
  ];

  // State Management for Legal Documents List & Modals
  const [legalDocs, setLegalDocs] = useState<LegalDocumentItem[]>(initialLegalDocs);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<LegalDocumentItem | null>(null);
  const [previewDocModal, setPreviewDocModal] = useState<LegalDocumentItem | null>(null);
  const [deleteConfirmDoc, setDeleteConfirmDoc] = useState<LegalDocumentItem | null>(null);

  // Form State for Add / Edit
  const defaultFormData: Omit<LegalDocumentItem, 'id'> = {
    title: '',
    category:
      currentRole === 'lainnya'
        ? 'Legalitas Lembaga Amil Zakat (LAZ)'
        : currentRole === 'nazhir'
        ? 'Izin Operasional Nazhir'
        : 'Legalitas Lembaga Sosial',
    docNumber: '',
    issuer: '',
    validUntil: '31 Desember 2028',
    status: 'AKTIF & TERVALIDASI',
    fileSize: '2.4 MB (PDF Signed)',
    fileName: 'Dokumen_Legalitas.pdf',
    description: '',
  };
  const [formData, setFormData] = useState<Omit<LegalDocumentItem, 'id'>>(defaultFormData);

  const handleOpenAddModal = () => {
    setEditingDoc(null);
    setFormData(defaultFormData);
    setShowAddEditModal(true);
  };

  const handleOpenEditModal = (doc: LegalDocumentItem) => {
    setEditingDoc(doc);
    setFormData({
      title: doc.title,
      category: doc.category,
      docNumber: doc.docNumber,
      issuer: doc.issuer,
      validUntil: doc.validUntil,
      status: doc.status,
      fileSize: doc.fileSize,
      fileName: doc.fileName || `${doc.title.replace(/\s+/g, '_')}.pdf`,
      description: doc.description,
    });
    setShowAddEditModal(true);
  };

  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.docNumber.trim() || !formData.issuer.trim()) {
      showToast({
        title: 'Formulir Belum Lengkap',
        description: 'Mohon isi nama dokumen, nomor SK/Izin, dan instansi penerbit.',
        type: 'warning',
      });
      return;
    }

    if (editingDoc) {
      setLegalDocs((prev) =>
        prev.map((d) =>
          d.id === editingDoc.id
            ? {
                ...d,
                ...formData,
              }
            : d
        )
      );
      showToast({
        title: 'Dokumen Berhasil Diperbarui',
        description: `Perubahan pada berkas "${formData.title}" telah tersimpan secara resmi.`,
        type: 'success',
      });
    } else {
      const newId = `LEG-0${legalDocs.length + 1}`;
      const newDoc: LegalDocumentItem = {
        id: newId,
        ...formData,
        fileSize: formData.fileSize || '2.5 MB (PDF)',
      };
      setLegalDocs((prev) => [newDoc, ...prev]);
      showToast({
        title: 'Dokumen Legalitas Ditambahkan',
        description: `Berkas "${formData.title}" berhasil diarsipkan dalam pangkalan legalitas lembaga.`,
        type: 'success',
      });
    }

    setShowAddEditModal(false);
    setEditingDoc(null);
  };

  const handleDeleteDocument = (doc: LegalDocumentItem) => {
    setLegalDocs((prev) => prev.filter((d) => d.id !== doc.id));
    setDeleteConfirmDoc(null);
    showToast({
      title: 'Dokumen Dihapus',
      description: `Berkas "${doc.title}" telah dihapus dari daftar legalitas.`,
      type: 'info',
    });
  };

  // Filter transactions based on search and role
  const filteredTransactions = transactions.filter((tx) => {
    const isAmil = currentRole === 'lainnya';
    const isNazhir = currentRole === 'nazhir';

    if (isAmil && tx.scope !== 'ziswaf') return false;
    if (isNazhir && tx.scope !== 'wakaf') return false;

    const matchAkad = filterAkad === 'SEMUA' || tx.jenisAkad.toLowerCase().includes(filterAkad.toLowerCase());
    const matchSearch =
      tx.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.bszNumber && tx.bszNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchAkad && matchSearch;
  });

  // Filter physical wakaf logs
  const filteredPhysicalLogs = physicalLogs.filter((log) => {
    return (
      log.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.vendor.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Filter ZISWAF disbursement logs
  const filteredZiswafDisbursements = ziswafDisbursementLogs.filter((log) => {
    return (
      log.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.asnafCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Filter Legal Documents
  const filteredLegalDocs = legalDocs.filter((doc) => {
    if (currentRole === 'nazhir' && doc.roleScope === 'amil') return false;

    const matchCategory =
      legalCategoryFilter === 'SEMUA' ||
      doc.category.toLowerCase().includes(legalCategoryFilter.toLowerCase()) ||
      Boolean(doc.badge && doc.badge.toLowerCase().includes(legalCategoryFilter.toLowerCase()));

    const query = legalSearchQuery.trim().toLowerCase();
    const matchSearch =
      !query ||
      doc.title.toLowerCase().includes(query) ||
      doc.docNumber.toLowerCase().includes(query) ||
      doc.issuer.toLowerCase().includes(query) ||
      doc.category.toLowerCase().includes(query) ||
      doc.id.toLowerCase().includes(query) ||
      doc.description.toLowerCase().includes(query);

    return matchCategory && matchSearch;
  });

  // Categories list for filtering
  const legalCategories = [
    'SEMUA',
    'Legalitas Lembaga Amil Zakat (LAZ)',
    'Izin Operasional Nazhir',
    'Kepatuhan Syariah ZISWAF',
    'Legalitas Lembaga Sosial',
    'Badan Hukum',
    'Perbankan Syariah Terpisah',
    'Perpajakan & Pengurang Pajak',
    'Kepatuhan & Sertifikasi Mutu',
    'Audit Keuangan & Transparansi',
  ];

  // Role metadata configurations
  const roleConfig: Record<RoleType, {
    title: string;
    subtitle: string;
    badgeText: string;
    badgeColor: string;
    metric1Label: string;
    metric1Value: string;
    metric1Sub: string;
    metric2Label: string;
    metric2Value: string;
    metric2Sub: string;
    metric3Label: string;
    metric3Value: string;
    metric3Sub: string;
  }> = {
    super_admin: {
      title: 'Dokumen & Catatan Transparansi Terpadu',
      subtitle: 'Audit trail konsolidasi lintas ekosistem (Wakaf, Infaq, Zakat, Qurban), transparansi pencairan fisik & penyaluran 8 Asnaf, serta tata kelola legalitas resmi.',
      badgeText: 'Otoritas Tunggal Super Admin',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      metric1Label: 'Total Penghimpunan (Global)',
      metric1Value: 'Rp 3.687.500.000',
      metric1Sub: 'Wakaf (Rp 2.845M) + ZISWAF (Rp 842.5Jt)',
      metric2Label: 'Saldo Kas & Dana Tersedia',
      metric2Value: 'Rp 1.448.500.000',
      metric2Sub: 'Terparkir aman di Giro Wadiah BSI',
      metric3Label: 'Realisasi Penyaluran & Audit',
      metric3Value: 'Rp 2.239.000.000',
      metric3Sub: '100% tersertifikasi nota kuitansi, BSZ & DPS',
    },
    nazhir: {
      title: 'Catatan Transparansi & Legalitas Wakaf',
      subtitle: 'Audit trail penerimaan wakaf uang, transparansi realisasi belanja kuitansi & progres fisik proyek, serta arsip legalitas tanda daftar Nazhir BWI.',
      badgeText: 'Nazhir Wakaf Terdaftar BWI',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      metric1Label: 'Total Wakaf Terhimpun',
      metric1Value: 'Rp 2.845.000.000',
      metric1Sub: '+14.8% dari periode audit sebelumnya',
      metric2Label: 'Dana Kas di LKS-PWU BSI',
      metric2Value: 'Rp 1.130.000.000',
      metric2Sub: 'Rekening Giro Wadiah Khusus Wakaf Uang',
      metric3Label: 'Realisasi Belanja Fisik Proyek',
      metric3Value: 'Rp 1.715.000.000',
      metric3Sub: '100% kuitansi terverifikasi BWI & DPS',
    },
    amil: {
      title: 'Catatan Transparansi & Legalitas ZISWAF',
      subtitle: 'Audit trail penerimaan donasi Infaq, Zakat & Qurban real-time, transparansi penyaluran 8 Asnaf, laporan mustahik, serta berkas legalitas LAZ / UPZ BAZNAS.',
      badgeText: 'Amil ZISWAF (LAZ / UPZ BAZNAS)',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      metric1Label: 'Total Penghimpunan ZISWAF',
      metric1Value: 'Rp 842.500.000',
      metric1Sub: 'Infaq (Rp 312Jt) + Zakat (Rp 428Jt) + Qurban (Rp 102.5Jt)',
      metric2Label: 'Saldo Kas Penyaluran ZISWAF',
      metric2Value: 'Rp 318.500.000',
      metric2Sub: 'Rekening Giro Terpisah Zakat & Infaq BSI',
      metric3Label: 'Realisasi Penyaluran 8 Asnaf & Program',
      metric3Value: 'Rp 524.000.000',
      metric3Sub: '100% akuntabel dengan BSZ & Berita Acara (BAST)',
    },
    lainnya: {
      title: 'Catatan Transparansi & Legalitas ZISWAF',
      subtitle: 'Audit trail penerimaan donasi Infaq, Zakat & Qurban real-time, transparansi penyaluran 8 Asnaf, laporan mustahik, serta berkas legalitas LAZ / UPZ BAZNAS.',
      badgeText: 'Amil ZISWAF (LAZ / UPZ BAZNAS)',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      metric1Label: 'Total Penghimpunan ZISWAF',
      metric1Value: 'Rp 842.500.000',
      metric1Sub: 'Infaq (Rp 312Jt) + Zakat (Rp 428Jt) + Qurban (Rp 102.5Jt)',
      metric2Label: 'Saldo Kas Penyaluran ZISWAF',
      metric2Value: 'Rp 318.500.000',
      metric2Sub: 'Rekening Giro Terpisah Zakat & Infaq BSI',
      metric3Label: 'Realisasi Penyaluran 8 Asnaf & Program',
      metric3Value: 'Rp 524.000.000',
      metric3Sub: '100% akuntabel dengan BSZ & Berita Acara (BAST)',
    },
    donatur: {
      title: 'Dokumen & Catatan Transparansi',
      subtitle: 'Audit trail transaksi real-time dan berkas legalitas resmi.',
      badgeText: 'Donatur & Wakif',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      metric1Label: 'Total Penghimpunan',
      metric1Value: 'Rp 3.687.500.000',
      metric1Sub: 'Audit konsolidasi terpadu',
      metric2Label: 'Saldo Kas Tersedia',
      metric2Value: 'Rp 1.448.500.000',
      metric2Sub: 'Giro Syariah BSI',
      metric3Label: 'Total Penyaluran',
      metric3Value: 'Rp 2.239.000.000',
      metric3Sub: 'Terverifikasi DPS',
    },
  };

  const currentRoleConfig = roleConfig[currentRole] || roleConfig.super_admin;

  return (
    <div className="space-y-6">
      {/* Top Header & Role-Aware Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-[#1B5E20]">
                <FileSpreadsheet className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {currentRoleConfig.title}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${currentRoleConfig.badgeColor}`}>
                {currentRoleConfig.badgeText}
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              {currentRoleConfig.subtitle}
            </p>
          </div>

          {/* Main Tab Toggle: Catatan Transparansi vs Legalitas */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setMainTab('transparency')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                mainTab === 'transparency'
                  ? 'bg-white text-[#1B5E20] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Catatan Transparansi
            </button>
            <button
              onClick={() => setMainTab('legalitas')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                mainTab === 'legalitas'
                  ? 'bg-white text-[#1B5E20] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Legalitas Lembaga
            </button>
          </div>
        </div>

        {/* 3 Metric Cards Tailored to Role */}
        {mainTab === 'transparency' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold mb-1">
                <span>{currentRoleConfig.metric1Label}</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-950">
                {currentRoleConfig.metric1Value}
              </div>
              <p className="text-[11px] text-emerald-700 mt-1">
                {currentRoleConfig.metric1Sub}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100">
              <div className="flex items-center justify-between text-blue-800 text-xs font-semibold mb-1">
                <span>{currentRoleConfig.metric2Label}</span>
                <Wallet className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-blue-950">
                {currentRoleConfig.metric2Value}
              </div>
              <p className="text-[11px] text-blue-700 mt-1">
                {currentRoleConfig.metric2Sub}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100">
              <div className="flex items-center justify-between text-purple-800 text-xs font-semibold mb-1">
                <span>{currentRoleConfig.metric3Label}</span>
                <ShieldCheck className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-purple-950">
                {currentRoleConfig.metric3Value}
              </div>
              <p className="text-[11px] text-purple-700 mt-1">
                {currentRoleConfig.metric3Sub}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content: Catatan Transparansi */}
      {mainTab === 'transparency' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
          {/* Sub-menu Tabs Tailored to Active Role */}
          <div className="px-6 pt-5 pb-3 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {/* If Amil Role ('lainnya') */}
              {currentRole === 'lainnya' && (
                <>
                  <button
                    onClick={() => setTransparencySubTab('ziswaf_transactions')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      transparencySubTab === 'ziswaf_transactions'
                        ? 'bg-[#1B5E20] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Coins className="w-3.5 h-3.5" />
                    Transparansi Transaksi ZISWAF Masuk
                  </button>
                  <button
                    onClick={() => setTransparencySubTab('ziswaf_disbursements')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      transparencySubTab === 'ziswaf_disbursements'
                        ? 'bg-[#1B5E20] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    Transparansi Penyaluran 8 Asnaf & Program Sosial
                  </button>
                </>
              )}

              {/* If Nazhir Role ('nazhir') */}
              {currentRole === 'nazhir' && (
                <>
                  <button
                    onClick={() => setTransparencySubTab('physical')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      transparencySubTab === 'physical'
                        ? 'bg-[#1B5E20] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Transparansi Pencairan & Progres Fisik Proyek Wakaf
                  </button>
                  <button
                    onClick={() => setTransparencySubTab('transactions')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      transparencySubTab === 'transactions'
                        ? 'bg-[#1B5E20] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    Penerimaan Wakaf Uang (Wakif)
                  </button>
                </>
              )}

              {/* If Super Admin Role */}
              {currentRole === 'super_admin' && (
                <>
                  <button
                    onClick={() => setTransparencySubTab('transactions')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      transparencySubTab === 'transactions'
                        ? 'bg-[#1B5E20] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    Transaksi Global (Semua Akad)
                  </button>
                  <button
                    onClick={() => setTransparencySubTab('physical')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      transparencySubTab === 'physical'
                        ? 'bg-[#1B5E20] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Progres Fisik Wakaf (Nazhir)
                  </button>
                  <button
                    onClick={() => setTransparencySubTab('ziswaf_disbursements')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      transparencySubTab === 'ziswaf_disbursements'
                        ? 'bg-[#1B5E20] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    Penyaluran Asnaf & ZISWAF (Amil)
                  </button>
                </>
              )}
            </div>

            {/* Search & Filter Inputs */}
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari transaksi / mustahik / program..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1B5E20] w-48 sm:w-60"
                />
              </div>

              {(transparencySubTab === 'transactions' || transparencySubTab === 'ziswaf_transactions') && (
                <select
                  value={filterAkad}
                  onChange={(e) => setFilterAkad(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#1B5E20]"
                >
                  <option value="SEMUA">Semua Akad</option>
                  {currentRole !== 'nazhir' && <option value="Infaq">Infaq</option>}
                  {currentRole !== 'nazhir' && <option value="Zakat">Zakat</option>}
                  {currentRole !== 'nazhir' && <option value="Qurban">Qurban</option>}
                  {currentRole !== 'lainnya' && <option value="Wakaf">Wakaf</option>}
                </select>
              )}

              <button
                onClick={() =>
                  showToast({
                    title: 'Laporan Transparansi Diexport',
                    description: `Dokumen audit trail transparansi (${currentRole === 'lainnya' ? 'ZISWAF & Asnaf' : currentRole === 'nazhir' ? 'Wakaf & Progres Fisik' : 'Konsolidasi Global'}) berhasil diunduh dalam format PDF & CSV resmi.`,
                    type: 'success',
                  })
                }
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
            </div>
          </div>

          {/* Sub-menu View 1: Transaksi Masuk (ZISWAF / Global / Wakif) */}
          {(transparencySubTab === 'transactions' || transparencySubTab === 'ziswaf_transactions') && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Nama Donatur / Muzakki</th>
                    <th className="py-3 px-4">Nominal Donasi</th>
                    <th className="py-3 px-4">Jenis Akad</th>
                    <th className="py-3 px-4">Waktu (Timestamp)</th>
                    <th className="py-3 px-4">Program / Peruntukan</th>
                    <th className="py-3 px-4">Metode Bayar</th>
                    <th className="py-3 px-4">Nomor BSZ / Transaksi</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {tx.donorName}
                            {tx.isAnonymous && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-200 text-slate-700 font-normal">
                                Anonim
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            ID: {tx.donorId}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-emerald-900 font-mono">
                          Rp {tx.amount.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              tx.jenisAkad.includes('Zakat')
                                ? 'bg-amber-100 text-amber-900 border-amber-200'
                                : tx.jenisAkad.includes('Infaq')
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                : tx.jenisAkad.includes('Qurban')
                                ? 'bg-blue-100 text-blue-800 border-blue-200'
                                : 'bg-purple-100 text-purple-800 border-purple-200'
                            }`}
                          >
                            {tx.jenisAkad}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                          {tx.timestamp}
                        </td>
                        <td className="py-3.5 px-4 max-w-xs truncate font-medium text-slate-800">
                          {tx.program}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                          {tx.paymentMethod}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">
                          <div className="font-semibold text-emerald-800">{tx.bszNumber || tx.id}</div>
                          <div className="text-[10px] text-slate-400">{tx.id}</div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {tx.statusMuzakki}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                        Tidak ada transaksi yang cocok dengan filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Sub-menu View 2: Transparansi Penyaluran 8 Asnaf & Program ZISWAF (Khusus Amil & Super Admin) */}
          {transparencySubTab === 'ziswaf_disbursements' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">ID Penyaluran & Waktu</th>
                    <th className="py-3 px-4">Kategori Asnaf / Program</th>
                    <th className="py-3 px-4">Aktivitas & Penerima Manfaat</th>
                    <th className="py-3 px-4">Mustahik</th>
                    <th className="py-3 px-4">Nominal Disalurkan</th>
                    <th className="py-3 px-4">Dokumen BAST & Kuitansi</th>
                    <th className="py-3 px-4">Lokasi Wilayah</th>
                    <th className="py-3 px-4 text-center">Status Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredZiswafDisbursements.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-slate-900">{log.id}</div>
                        <div className="text-[11px] text-slate-500">{log.timestamp}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 inline-block">
                          {log.asnafCategory}
                        </span>
                        <div className="text-[11px] font-semibold text-slate-900 mt-1 max-w-xs truncate">
                          {log.program}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-sm text-slate-700 leading-relaxed">
                        {log.activity}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                        {log.recipientsCount.toLocaleString('id-ID')} Jiwa
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-950 font-mono">
                        Rp {log.disbursement.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-blue-700">
                        <button
                          onClick={() =>
                            showToast({
                              title: 'Lampiran Berita Acara',
                              description: `Membuka pratinjau dokumen BAST & Kuitansi Penyaluran: ${log.bastDocument}`,
                              type: 'info',
                            })
                          }
                          className="hover:underline flex items-center gap-1 cursor-pointer truncate max-w-xs"
                          title={log.bastDocument}
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">{log.bastDocument}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 text-[11px] whitespace-nowrap">
                        {log.location}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Sub-menu View 3: Progres Fisik Proyek Wakaf (Nazhir & Super Admin) */}
          {transparencySubTab === 'physical' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Log ID & Waktu</th>
                    <th className="py-3 px-4">Program Wakaf</th>
                    <th className="py-3 px-4">Aktivitas Fisik Proyek</th>
                    <th className="py-3 px-4">Progres Fisik</th>
                    <th className="py-3 px-4">Pencairan Dana</th>
                    <th className="py-3 px-4">Bukti Kuitansi & Vendor</th>
                    <th className="py-3 px-4 text-center">Status Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredPhysicalLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-slate-900">{log.id}</div>
                        <div className="text-[11px] text-slate-500">{log.timestamp}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                        {log.program}
                      </td>
                      <td className="py-3.5 px-4 max-w-sm text-slate-700">
                        {log.activity}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="w-28 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-[#1B5E20]">{log.progressFisik}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-[#1B5E20] h-1.5 rounded-full"
                              style={{ width: `${log.progressFisik}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                        Rp {log.disbursement.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-4 text-[11px]">
                        <button
                          onClick={() =>
                            showToast({
                              title: 'Lampiran Digital',
                              description: `Membuka pratinjau kuitansi terverifikasi: ${log.receiptFile}`,
                              type: 'info',
                            })
                          }
                          className="hover:underline flex items-center gap-1 cursor-pointer text-blue-700 font-mono"
                        >
                          <Receipt className="w-3 h-3 text-blue-600" />
                          {log.receiptFile}
                        </button>
                        <div className="text-[10px] text-slate-500 mt-0.5">{log.vendor}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {log.status}
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

      {/* Main Content: Legalitas Program / Lembaga */}
      {mainTab === 'legalitas' && (
        <div className="space-y-5">
          {/* Search, Filter Bar & Tambah Dokumen Action */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Cari nama berkas, nomor SK/Izin, penerbit (BAZNAS, BWI, DSN-MUI, Kemenag, Kemensos)..."
                  value={legalSearchQuery}
                  onChange={(e) => setLegalSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:bg-white transition"
                />
                {legalSearchQuery && (
                  <button
                    onClick={() => setLegalSearchQuery('')}
                    className="absolute right-3 top-2.5 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                    title="Hapus pencarian"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Category Dropdown */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                  <select
                    value={legalCategoryFilter}
                    onChange={(e) => setLegalCategoryFilter(e.target.value)}
                    className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B5E20] cursor-pointer"
                  >
                    {legalCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === 'SEMUA' ? 'Semua Kategori Dokumen' : cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tombol Tambah Dokumen Legalitas */}
                <button
                  onClick={handleOpenAddModal}
                  className="px-4 py-2.5 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs hover:shadow-md transition shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Dokumen</span>
                </button>
              </div>
            </div>

            {/* Result Counter & Active Query Indication */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="text-slate-600 flex items-center gap-2">
                <span>
                  Menampilkan <strong className="text-slate-900">{filteredLegalDocs.length}</strong> dari{' '}
                  <span className="text-slate-500">{legalDocs.length} dokumen legalitas resmi</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  using dummy data
                </span>
                {(legalSearchQuery || legalCategoryFilter !== 'SEMUA') && (
                  <span className="text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[11px]">
                    Filter Aktif
                  </span>
                )}
              </div>

              {(legalSearchQuery || legalCategoryFilter !== 'SEMUA') && (
                <button
                  onClick={() => {
                    setLegalSearchQuery('');
                    setLegalCategoryFilter('SEMUA');
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>Reset Filter</span>
                </button>
              )}
            </div>
          </div>

          {/* Grid of Legal Documents */}
          {filteredLegalDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLegalDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-emerald-50 text-[#1B5E20]">
                          <FileText className="w-5 h-5" />
                        </span>
                        <div>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                            {doc.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {doc.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {doc.title}
                      </h3>
                      {doc.description && (
                        <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">
                          {doc.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-slate-500 font-sans shrink-0">Nomor SK/Izin:</span>
                        <strong className="text-slate-800 truncate text-right">{doc.docNumber}</strong>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-slate-500 font-sans shrink-0">Penerbit:</span>
                        <strong className="text-slate-800 truncate text-right">{doc.issuer}</strong>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-slate-500 font-sans shrink-0">Masa Berlaku:</span>
                        <strong className="text-slate-800">{doc.validUntil}</strong>
                      </div>
                      {doc.fileName && (
                        <div className="flex justify-between items-center gap-2 pt-1 border-t border-slate-200/60">
                          <span className="text-slate-500 font-sans shrink-0">File Lampiran:</span>
                          <span className="text-emerald-700 font-semibold truncate flex items-center gap-1">
                            <FileCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                            {doc.fileName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                    <span className="text-[11px] text-slate-500 font-medium font-mono">{doc.fileSize}</span>
                    
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setPreviewDocModal(doc)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1"
                        title="Pratinjau Berkas"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                        <span>Lihat</span>
                      </button>

                      <button
                        onClick={() =>
                          showToast({
                            title: 'Unduhan Berhasil',
                            description: `Salinan resmi berkas "${doc.title}" (${doc.fileSize}) berhasil diunduh.`,
                            type: 'success',
                          })
                        }
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                        title="Unduh PDF Resmi"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh</span>
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(doc)}
                        className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold cursor-pointer transition"
                        title="Edit Dokumen Legalitas"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmDoc(doc)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold cursor-pointer transition"
                        title="Hapus Dokumen Legalitas"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-2xs space-y-3">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Tidak Ada Dokumen Legalitas yang Cocok
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Tidak ditemukan dokumen dengan kata kunci &quot;{legalSearchQuery}&quot; pada kategori yang dipilih.
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setLegalSearchQuery('');
                    setLegalCategoryFilter('SEMUA');
                  }}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition cursor-pointer"
                >
                  Reset Pencarian
                </button>
                <button
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 bg-[#1B5E20] text-white text-xs font-bold rounded-xl hover:bg-[#144716] transition cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Dokumen Baru</span>
                </button>
              </div>
            </div>
          )}

          <div className="bg-emerald-900 text-emerald-50 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white">Sertifikasi & Kepatuhan Berkala</h4>
                <p className="text-xs text-emerald-200">
                  Platform Amwal diaudit secara berkala oleh BAZNAS RI, Badan Wakaf Indonesia (BWI), Dewan Pengawas Syariah DSN-MUI, dan Akuntan Publik Independen (Opini WTP).
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                showToast({
                  title: 'Laporan Audit Syariah & Keuangan',
                  description: 'Membuka dokumen Opini Wajar Tanpa Pengecualian (WTP) & Kepatuhan Syariah 2025/2026.',
                  type: 'info',
                })
              }
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer"
            >
              Lihat Laporan Audit Tahunan
            </button>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH / EDIT DOKUMEN LEGALITAS */}
      {showAddEditModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-emerald-100 text-[#1B5E20] rounded-xl">
                  {editingDoc ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingDoc ? 'Edit Dokumen Legalitas Lembaga' : 'Tambah Dokumen Legalitas Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingDoc
                      ? `Perbarui informasi dan masa berlaku berkas ${editingDoc.id}`
                      : 'Arsipkan dokumen legalitas LAZ, izin BAZNAS/BWI, SK Kemenag, atau fatwa DPS'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddEditModal(false);
                  setEditingDoc(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDocument} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Dokumen / Sertifikasi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    currentRole === 'lainnya'
                      ? 'Contoh: SK Izin Operasional Lembaga Amil Zakat (LAZ) BAZNAS RI'
                      : 'Contoh: Tanda Daftar Nazhir Wakaf Uang Badan Wakaf Indonesia (BWI)'
                  }
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Dokumen <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E20] cursor-pointer"
                  >
                    <option value="Legalitas Lembaga Amil Zakat (LAZ)">Legalitas Lembaga Amil Zakat (LAZ)</option>
                    <option value="Izin Operasional Nazhir">Izin Operasional Nazhir</option>
                    <option value="Kepatuhan Syariah ZISWAF">Kepatuhan Syariah ZISWAF</option>
                    <option value="Legalitas Lembaga Sosial">Legalitas Lembaga Sosial</option>
                    <option value="Badan Hukum">Badan Hukum</option>
                    <option value="Perbankan Syariah Terpisah">Perbankan Syariah Terpisah</option>
                    <option value="Perpajakan & Pengurang Pajak">Perpajakan & Pengurang Pajak</option>
                    <option value="Kepatuhan & Sertifikasi Mutu">Kepatuhan & Sertifikasi Mutu</option>
                    <option value="Audit Keuangan & Transparansi">Audit Keuangan & Transparansi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status Validasi <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E20] cursor-pointer"
                  >
                    <option value="AKTIF & TERVALIDASI">AKTIF & TERVALIDASI</option>
                    <option value="TERDAFTAR RESMI">TERDAFTAR RESMI</option>
                    <option value="TERSTANDARISASI">TERSTANDARISASI</option>
                    <option value="OPINI WTP">OPINI WTP</option>
                    <option value="DALAM PROSES PERPANJANGAN">DALAM PROSES PERPANJANGAN</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor SK / Izin / Akta <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: BAZNAS/KEP-LAZ/0892/2024"
                    value={formData.docNumber}
                    onChange={(e) => setFormData({ ...formData, docNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Instansi / Lembaga Penerbit <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Badan Amil Zakat Nasional (BAZNAS) & Kemenag"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Masa Berlaku Dokumen <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 31 Desember 2028 atau Seumur Hidup"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi / Cakupan Legalitas
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan singkat peruntukan izin, dasar hukum undang-undang, atau kewenangan operasional..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:bg-white"
                />
              </div>

              {/* Upload Berkas Lampiran PDF */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Unggah Berkas PDF Salinan Resmi
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-emerald-400 bg-slate-50 hover:bg-emerald-50/40 rounded-xl p-4 text-center transition cursor-pointer">
                  <UploadCloud className="w-7 h-7 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-slate-800">
                    {formData.fileName || 'Klik untuk memilih berkas PDF'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Format didukung: PDF, PDF/A, Signed PDF (Maks. 15 MB)
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const sampleName = formData.title
                        ? `${formData.title.slice(0, 20).replace(/\s+/g, '_')}_Official_Signed.pdf`
                        : 'Berkas_Legalitas_Lembaga.pdf';
                      setFormData({
                        ...formData,
                        fileName: sampleName,
                        fileSize: '3.2 MB (PDF Signed)',
                      });
                      showToast({
                        title: 'Berkas Terlampir',
                        description: `File "${sampleName}" berhasil disematkan.`,
                        type: 'info',
                      });
                    }}
                    className="mt-2 px-3 py-1 bg-white border border-slate-200 hover:border-emerald-400 rounded-lg text-xs font-semibold text-slate-700 hover:text-[#1B5E20] shadow-2xs inline-block transition cursor-pointer"
                  >
                    Pilih File Salinan PDF
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddEditModal(false);
                    setEditingDoc(null);
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingDoc ? 'Simpan Perubahan' : 'Arsipkan Dokumen'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PRATINJAU DOKUMEN RESMI */}
      {previewDocModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-100 text-[#1B5E20] rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Salinan Resmi Dokumen Terdaftar</h3>
                  <span className="text-xs text-slate-500 font-mono">{previewDocModal.id}</span>
                </div>
              </div>
              <button
                onClick={() => setPreviewDocModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 space-y-4 font-sans">
              <div className="text-center pb-4 border-b border-slate-200 space-y-1">
                <div className="w-12 h-12 bg-emerald-700 text-white rounded-full flex items-center justify-center mx-auto font-black text-sm tracking-wider">
                  AMW
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-2 uppercase tracking-wide">
                  {previewDocModal.title}
                </h4>
                <p className="text-xs text-slate-500 font-mono">{previewDocModal.docNumber}</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {previewDocModal.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-500 text-[11px]">Instansi / Otoritas Penerbit:</span>
                  <p className="font-bold text-slate-800">{previewDocModal.issuer}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-500 text-[11px]">Masa Berlaku Resmi:</span>
                  <p className="font-bold text-slate-800">{previewDocModal.validUntil}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-500 text-[11px]">Kategori Dokumen:</span>
                  <p className="font-bold text-slate-800">{previewDocModal.category}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-500 text-[11px]">Nama Berkas Lampiran:</span>
                  <p className="font-bold text-emerald-800 font-mono truncate">{previewDocModal.fileName || `${previewDocModal.id}.pdf`}</p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                <span className="text-slate-500 text-[11px]">Ringkasan Cakupan Legalitas:</span>
                <p className="text-slate-700 leading-relaxed">{previewDocModal.description}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                <span>Ukuran Berkas: <strong>{previewDocModal.fileSize}</strong></span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Stempel Digital Terverifikasi BAZNAS & BWI
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  handleOpenEditModal(previewDocModal);
                  setPreviewDocModal(null);
                }}
                className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Data Dokumen</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewDocModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    showToast({
                      title: 'Unduhan Berhasil',
                      description: `Salinan resmi (${previewDocModal.fileSize}) ${previewDocModal.title} berhasil diunduh.`,
                      type: 'success',
                    });
                    setPreviewDocModal(null);
                  }}
                  className="px-4 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Dokumen PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI HAPUS DOKUMEN */}
      {deleteConfirmDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600">
              <span className="p-2.5 bg-rose-100 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">Hapus Dokumen Legalitas?</h3>
                <p className="text-xs text-slate-500">Tindakan ini akan menghapus berkas dari pangkalan data.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900">{deleteConfirmDoc.title}</p>
              <p className="text-slate-500 font-mono text-[11px]">{deleteConfirmDoc.docNumber}</p>
              <p className="text-slate-600 text-[11px]">Penerbit: {deleteConfirmDoc.issuer}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmDoc(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteDocument(deleteConfirmDoc)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Dokumen</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
