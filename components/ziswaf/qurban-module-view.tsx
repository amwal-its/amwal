'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  PackageCheck,
  TrendingUp,
  Award,
  Plus,
  Send,
  Download,
  Search,
  Users,
  CheckCircle2,
  Layers,
  Play,
  Sparkles,
  MessageCircle,
  CheckCircle,
  Camera,
  MapPin,
  Link2,
  UploadCloud,
  Video,
  Image as ImageIcon,
  Trash2,
  FileVideo,
  FileImage,
  ExternalLink,
  X,
  Eye,
  Film,
  Building,
} from 'lucide-react';
import { QurbanItem, PatunganGroup, ShohibulOrder } from '@/types/ziswaf';
import { useToast } from '@/components/ui/toast';
import { ZiswafModals } from './ziswaf-modals';
import { DrmSimulationBanner } from '@/components/admin/drm-simulation-banner';

interface EvidenceMediaFile {
  id: string;
  name: string;
  type: 'image' | 'video';
  size: string;
  previewUrl?: string;
  timestamp: string;
}

const defaultQurbanCatalog: QurbanItem[] = [
  {
    id: 'Q-01',
    category: 'Kambing / Domba',
    title: 'Kambing Standar Grade B (23-28 kg)',
    breed: 'Kambing Jawa Randu Sehat',
    weightKg: '25 kg (Hidup)',
    price: 2450000,
    stock: 50,
    sold: 38,
    distributionArea: 'Pelosok Sukabumi & Cianjur Selatan',
    image: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'Q-02',
    category: 'Sapi Patungan 1/7',
    title: 'Slot 1/7 Sapi Limousin / PO (220-270 kg)',
    breed: 'Sapi Peranakan Ongole (PO)',
    weightKg: '240 kg (Kolektif 7 Jiwa)',
    price: 2950000,
    stock: 35,
    sold: 31,
    distributionArea: 'Kawasan 3T Nusa Tenggara Timur & Banten',
    image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'Q-03',
    category: 'Sapi Utuh',
    title: 'Sapi Utuh Simental Super (350-400 kg)',
    breed: 'Sapi Simental Super Pedaging',
    weightKg: '380 kg (Hidup)',
    price: 24500000,
    stock: 12,
    sold: 10,
    distributionArea: 'Kornet / Rendang Kaleng Bencana Nasional',
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80',
  },
];

const defaultPatunganGroups: PatunganGroup[] = [
  {
    groupTag: 'Sapi 01 (PO Sukabumi)',
    status: 'Lengkap (Siap Potong)',
    statusColor: 'bg-emerald-100 text-[#1B5E20] border-emerald-300',
    shohibulList: [
      'H. Danang Wijaya bin Wijaya',
      'Hj. Siti Rahmawati binti Abdullah',
      'Farhan Fauzi bin Danang',
      'Anisa Fauzia binti Danang',
      'dr. Irwan Setiawan bin Suparman',
      'H. Mulyadi Pratama bin Pratama',
      'Keluarga Besar Bpk. Subroto',
    ],
    rphLocation: 'RPH Cisaat, Kab. Sukabumi',
    julehaTeam: 'Ust. Ridwan & Tim Juleha DPD Sukabumi',
  },
  {
    groupTag: 'Sapi 02 (Limousin NTT)',
    status: 'Tersisa 2 Slot',
    statusColor: 'bg-amber-100 text-amber-900 border-amber-300',
    shohibulList: [
      'Bpk. H. Hendro bin Suwarno',
      'Ibu Nuraeni binti Kasim',
      'Ahmad Syauqi bin Hendro',
      'Zaskia Adya binti Hendro',
      'Hamba Allah (Alm. H. Basri)',
    ],
    rphLocation: 'RPH Sentra Qurban Kupang, NTT',
    julehaTeam: 'Ust. Haris & Juleha MUI NTT',
  },
  {
    groupTag: 'Sapi 03 (PO Cianjur)',
    status: 'Tersisa 5 Slot',
    statusColor: 'bg-blue-100 text-blue-900 border-blue-300',
    shohibulList: [
      'Bpk. Denny Hermawan bin Hermawan',
      'Ibu Lilis Suryani binti Hasan',
    ],
    rphLocation: 'RPH Terpadu Warungkondang, Cianjur',
    julehaTeam: 'Ust. Asep Saepudin & Tim Halal',
  },
];

const defaultShohibulOrders: ShohibulOrder[] = [
  {
    id: 'ORD-QRB-001',
    buyerName: 'H. Danang Wijaya',
    animalType: 'Slot 1/7 Sapi (Sapi 01)',
    qurbanNames: 'Danang Wijaya bin H. Wijaya',
    amount: 2950000,
    distributionOption: 'Disalurkan 100% (Pelosok 3T)',
    wakalahTimestamp: '22 Agt 2026, 09:14:22 WIB',
    wakalahLafazh: 'Saya mewakilkan pembelian, penyembelihan syar\'i, dan penyaluran qurban kepada Amwal lillahi ta\'ala.',
    status: 'Lunas & Akad Sah',
  },
  {
    id: 'ORD-QRB-002',
    buyerName: 'dr. Irwan Setiawan',
    animalType: 'Slot 1/7 Sapi (Sapi 01)',
    qurbanNames: 'dr. Irwan Setiawan bin Suparman',
    amount: 2950000,
    distributionOption: 'Hak 1/3 Bagian Diantar ke Rumah',
    wakalahTimestamp: '21 Agt 2026, 14:20:10 WIB',
    wakalahLafazh: 'Saya serahkan pengelolaan qurban dan menghendaki pengambilan hak 1/3 daging qurban.',
    status: 'Lunas & Akad Sah',
  },
  {
    id: 'ORD-QRB-003',
    buyerName: 'Keluarga Bpk. H. Mulyadi',
    animalType: 'Kambing Standar Grade B',
    qurbanNames: 'Mulyadi Pratama bin Pratama',
    amount: 2450000,
    distributionOption: 'Disalurkan 100% (Pelosok 3T)',
    wakalahTimestamp: '20 Agt 2026, 16:05:44 WIB',
    wakalahLafazh: 'Bismillah, saya ikrarkan akad wakalah qurban kambing atas nama diri pribadi lillahi ta\'ala.',
    status: 'Lunas & Akad Sah',
  },
];

export function QurbanModuleView() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'grouping' | 'transactions' | 'wakalah' | 'distribution_options' | 'reports'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnimalFilter, setSelectedAnimalFilter] = useState('all');

  // Qurban State
  const [qurbanCatalog] = useState<QurbanItem[]>(defaultQurbanCatalog);
  const [patunganGroups, setPatunganGroups] = useState<PatunganGroup[]>(defaultPatunganGroups);
  const [shohibulOrders, setShohibulOrders] = useState<ShohibulOrder[]>(defaultShohibulOrders);

  // Evidence state
  const [selectedGroupEvidence, setSelectedGroupEvidence] = useState<PatunganGroup | null>(null);
  const [isSendingWa, setIsSendingWa] = useState(false);
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceMediaFile[]>([]);
  const [evidenceActiveTab, setEvidenceActiveTab] = useState<'both' | 'link' | 'upload'>('both');
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<EvidenceMediaFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Shared Modals State
  const [selectedQurbanCert, setSelectedQurbanCert] = useState<ShohibulOrder | null>(null);
  const [selectedShohibulReport, setSelectedShohibulReport] = useState<ShohibulOrder | null>(null);
  const [selectedRphStream, setSelectedRphStream] = useState<ShohibulOrder | null>(null);
  const [isAddShohibulOpen, setIsAddShohibulOpen] = useState(false);
  const [shohibulBuyerName, setShohibulBuyerName] = useState('');
  const [shohibulQurbanName, setShohibulQurbanName] = useState('');
  const [shohibulAnimalChoice, setShohibulAnimalChoice] = useState('Slot 1/7 Sapi (Sapi 02)');
  const [shohibulDistOption, setShohibulDistOption] = useState('Disalurkan 100% (Pelosok 3T)');

  const handleOpenEvidenceModal = (grp: PatunganGroup) => {
    setSelectedGroupEvidence(grp);
    setEvidenceUrl(`https://stream.amwal.id/qurban/2026/${grp.groupTag.toLowerCase().replace(/\s+/g, '-')}`);
    setEvidenceFiles([
      {
        id: `ev-img-${grp.groupTag.replace(/\s+/g, '-').toLowerCase()}-default-1`,
        name: `Foto_Penyembelihan_${grp.groupTag.replace(/\s+/g, '_')}_Syari.jpg`,
        type: 'image',
        size: '2.4 MB',
        timestamp: '10 Dzulhijjah • 08:35 WIB',
        previewUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=800&auto=format&fit=crop&q=80',
      },
      {
        id: `ev-vid-${grp.groupTag.replace(/\s+/g, '-').toLowerCase()}-default-2`,
        name: `Video_Proses_Sembelih_Juleha_${grp.groupTag.replace(/\s+/g, '_')}_1080p.mp4`,
        type: 'video',
        size: '28.6 MB',
        timestamp: '10 Dzulhijjah • 08:38 WIB',
      },
    ]);
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const currentCount = evidenceFiles.length;
    const newFiles: EvidenceMediaFile[] = Array.from(files).map((file, idx) => {
      const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.mov');
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const isImg = file.type.startsWith('image/');
      let previewUrl: string | undefined = undefined;
      if (isImg) {
        try {
          previewUrl = URL.createObjectURL(file);
        } catch {
          previewUrl = undefined;
        }
      }

      return {
        id: `upload-${currentCount + idx + 1}-${file.name.replace(/[^a-zA-Z0-9]/g, '_')}`,
        name: file.name,
        type: isVideo ? 'video' : 'image',
        size: `${sizeMB} MB`,
        previewUrl,
        timestamp: 'Baru saja diunggah',
      };
    });

    setEvidenceFiles((prev) => [...prev, ...newFiles]);
    showToast({
      title: 'Berkas Berhasil Ditambahkan',
      description: `${newFiles.length} file dokumentasi video/foto berhasil disematkan.`,
      type: 'success',
    });
  };

  const handleAddSampleMedia = (type: 'image' | 'video', label: string) => {
    const sampleItem: EvidenceMediaFile = {
      id: `sample-${evidenceFiles.length + 1}-${label.replace(/\s+/g, '_')}`,
      name: type === 'video' ? `Video_${label.replace(/\s+/g, '_')}_4K.mp4` : `Foto_${label.replace(/\s+/g, '_')}_HD.jpg`,
      type,
      size: type === 'video' ? '34.2 MB' : '3.1 MB',
      timestamp: '10 Dzulhijjah • Hari H Sembelih',
      previewUrl: type === 'image' ? 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=800&auto=format&fit=crop&q=80' : undefined,
    };
    setEvidenceFiles((prev) => [...prev, sampleItem]);
    showToast({
      title: 'Dokumentasi Ditambahkan',
      description: `Lampiran ${sampleItem.name} berhasil ditambahkan.`,
      type: 'info',
    });
  };

  const handleRemoveEvidenceFile = (id: string) => {
    setEvidenceFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleAddShohibulSubmit = () => {
    if (!shohibulBuyerName || !shohibulQurbanName) {
      showToast({
        title: 'Form Belum Lengkap',
        description: 'Mohon lengkapi nama pemesan dan lafazh nama pequrban.',
        type: 'error',
      });
      return;
    }

    const newOrder: ShohibulOrder = {
      id: `ORD-QRB-00${shohibulOrders.length + 1}`,
      buyerName: shohibulBuyerName,
      animalType: shohibulAnimalChoice,
      qurbanNames: shohibulQurbanName,
      amount: 2950000,
      distributionOption: shohibulDistOption,
      wakalahTimestamp: 'Hari ini, Baru saja',
      wakalahLafazh: 'Saya serahkan pelaksanaan qurban secara syar\'i kepada Amwal lillahi ta\'ala.',
      status: 'Lunas & Akad Sah',
    };

    setShohibulOrders([newOrder, ...shohibulOrders]);

    // If slot 1/7, assign to patungan group 2
    setPatunganGroups((prev) =>
      prev.map((grp) =>
        grp.groupTag.includes('Sapi 02')
          ? {
              ...grp,
              shohibulList: [...grp.shohibulList, shohibulQurbanName],
              status: grp.shohibulList.length + 1 >= 7 ? 'Lengkap (Siap Potong)' : `Tersisa ${7 - (grp.shohibulList.length + 1)} Slot`,
            }
          : grp
      )
    );

    setIsAddShohibulOpen(false);
    setShohibulBuyerName('');
    setShohibulQurbanName('');
    showToast({
      title: 'Shohibul Berhasil Didaftarkan',
      description: `Akad Wakalah ${newOrder.id} untuk ${newOrder.qurbanNames} sah terdaftar.`,
      type: 'success',
    });
  };

  const filteredOrders = shohibulOrders.filter((ord) => {
    const matchSearch =
      ord.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.qurbanNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchAnimal = selectedAnimalFilter === 'all' || ord.animalType.toLowerCase().includes(selectedAnimalFilter.toLowerCase());
    return matchSearch && matchAnimal;
  });

  return (
    <div className="space-y-6 font-jakarta pb-12">
      {/* Simulation Banner */}
      <DrmSimulationBanner
        title="Modul Qurban Terpadu & RPH Halal (Data Simulasi Amil)"
        description="Visualisasi slot patungan 1/7 sapi, manifes Juleha bersertifikat MUI, log akad wakalah digital, dan broadcast WhatsApp dokumentasi sembelih."
      />

      {/* Sub-Navigation Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2.5 shadow-2xs">
        <div className="flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Ringkasan Qurban
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5" />
              Katalog &amp; Stok Hewan
            </button>
            <button
              onClick={() => setActiveTab('grouping')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'grouping'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Patungan Sapi 1/7
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${activeTab === 'grouping' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {patunganGroups.length} Grup
              </span>
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'transactions'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Shohibul Qurban
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${activeTab === 'transactions' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {shohibulOrders.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('wakalah')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'wakalah'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Log Akad Wakalah
            </button>
            <button
              onClick={() => setActiveTab('distribution_options')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'distribution_options'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              Distribusi &amp; RPH
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Laporan &amp; WA Blast
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsAddShohibulOpen(true)}
              className="px-3.5 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Daftarkan Shohibul 1/7
            </button>
          </div>
        </div>
      </div>

      {/* 1. OVERVIEW QURBAN */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Total Hewan Terjual</span>
                <span className="p-2 rounded-xl bg-emerald-50 text-[#1B5E20]">
                  <PackageCheck className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                79 Ekor / Slot
              </div>
              <div className="mt-2 text-[11px] text-emerald-800 font-semibold">
                38 Kambing • 10 Sapi • 31 Slot 1/7
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Total Dana Qurban</span>
                <span className="p-2 rounded-xl bg-blue-50 text-blue-800">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                Rp 441.950.000
              </div>
              <div className="mt-2 text-[11px] text-blue-700 font-semibold">
                Target Kuota: Rp 500Jt (88.4%)
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Slot Patungan Sapi</span>
                <span className="p-2 rounded-xl bg-amber-50 text-amber-800">
                  <Layers className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold text-amber-900 font-mono tracking-tight">
                4 Kelompok Sapi
              </div>
              <div className="mt-2 text-[11px] text-slate-500 font-semibold">
                1 Siap Potong (7/7) • 3 Dalam Proses
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Penerima Manfaat Daging</span>
                <span className="p-2 rounded-xl bg-purple-50 text-purple-800">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                4.850 Paket Daging
              </div>
              <div className="mt-2 text-[11px] text-purple-800 font-semibold">
                Wilayah 3T, Dhuafa &amp; Bencana
              </div>
            </div>
          </div>

          {/* Quick Sapi Groups Status */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-[#1B5E20]" />
                  Status Cepat Pengelompokan Slot Patungan Sapi 1/7
                </h3>
                <p className="text-xs text-slate-500">Setiap 7 shohibul otomatis dihimpun dalam 1 sapi dengan sertifikat dan log akad terpadu</p>
              </div>
              <button
                onClick={() => setActiveTab('grouping')}
                className="text-xs font-bold text-[#1B5E20] hover:underline cursor-pointer"
              >
                Lihat Semua Grup →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {patunganGroups.map((grp) => (
                <div key={grp.groupTag} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{grp.groupTag}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${grp.statusColor}`}>
                      {grp.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-mono">
                    {grp.shohibulList.length}/7 Shohibul Terdaftar
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    RPH: {grp.rphLocation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. KATALOG & STOK HEWAN */}
      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {qurbanCatalog.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs flex flex-col justify-between">
              <div>
                <div className="h-44 w-full relative bg-slate-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    unoptimized
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                    {item.category}
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div>Ras: <strong>{item.breed}</strong></div>
                    <div>Estimasi Bobot: <strong>{item.weightKg}</strong></div>
                    <div>Wilayah Distribusi: <span className="text-slate-700">{item.distributionArea}</span></div>
                  </div>
                  <div className="pt-3 border-t text-xs">
                    <span className="text-slate-400 text-[10px] block">Harga Per Ekor / Slot</span>
                    <div className="text-lg font-extrabold text-emerald-900 font-mono">
                      Rp {item.price.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 pt-0 flex items-center justify-between text-xs border-t border-slate-100 mt-2">
                <span className="text-[11px] text-slate-500">Stok: <strong>{item.stock - item.sold} tersisa</strong> ({item.sold} terjual)</span>
                <button
                  onClick={() => {
                    showToast({
                      title: 'Kelola Stok Hewan',
                      description: `Pembaruan kuota & sertifikat kesehatan hewan ${item.title}.`,
                      type: 'info',
                    });
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Kelola Stok
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. PATUNGAN SAPI 1/7 */}
      {activeTab === 'grouping' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Monitoring &amp; Visualizer Sapi Kolektif 1/7</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-extrabold">
                  {patunganGroups.filter(g => g.shohibulList.length === 7).length} / {patunganGroups.length} Kuota Penuh
                </span>
              </h3>
              <p className="text-xs text-slate-500">Setiap 7 shohibul otomatis digabung menjadi 1 ekor sapi dengan nomor tagging resmi e-Qurban</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddShohibulOpen(true)}
                className="px-3.5 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Daftarkan Shohibul 1/7
              </button>
              <button
                onClick={() => {
                  const newGrp: PatunganGroup = {
                    groupTag: `Sapi 0${patunganGroups.length + 1} (Baru)`,
                    status: 'Tersisa 7 Slot',
                    statusColor: 'bg-blue-100 text-blue-900 border-blue-300',
                    shohibulList: [],
                    rphLocation: 'RPH Sentra Qurban Amwal',
                    julehaTeam: 'Tim Juleha Standar MUI',
                  };
                  setPatunganGroups([...patunganGroups, newGrp]);
                  showToast({
                    title: 'Grup Sapi Baru Dibuka',
                    description: `Kelompok ${newGrp.groupTag} siap menerima 7 kuota shohibul.`,
                    type: 'success',
                  });
                }}
                className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Buka Sapi Baru
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {patunganGroups.map((grp, idx) => {
              const filledCount = grp.shohibulList.length;
              const isFull = filledCount >= 7;
              return (
                <div key={grp.groupTag} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/80 space-y-4 shadow-2xs hover:border-emerald-300 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center text-xs shadow-2xs ${isFull ? 'bg-[#1B5E20] text-white' : 'bg-amber-500 text-slate-950'}`}>
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{grp.groupTag}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold border ${grp.statusColor}`}>
                            {grp.status} ({filledCount}/7 Slot)
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {grp.rphLocation}</span>
                          <span>•</span>
                          <span>Juleha: <strong className="text-slate-800">{grp.julehaTeam}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEvidenceModal(grp)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition"
                      >
                        <Camera className="w-3.5 h-3.5 text-emerald-700" />
                        Bukti Sembelih ({filledCount})
                      </button>
                      {!isFull && (
                        <button
                          onClick={() => setIsAddShohibulOpen(true)}
                          className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition shadow-2xs"
                        >
                          <Plus className="w-3 h-3" />
                          Isi Slot
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Visual 7 Slots Grid */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-2">
                      <span>Kapasitas Shohibul Terisi</span>
                      <span className="font-mono text-emerald-900 font-bold">{Math.round((filledCount / 7) * 100)}% Lengkap</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full transition-all duration-500 ${isFull ? 'bg-[#1B5E20]' : 'bg-amber-500'}`}
                        style={{ width: `${(filledCount / 7) * 100}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">
                      {grp.shohibulList.map((shohibul, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-3 bg-white rounded-xl border border-emerald-200/90 flex flex-col justify-between gap-1.5 shadow-2xs hover:shadow-xs transition"
                        >
                          <div className="flex items-center justify-between">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#1B5E20] font-black text-[10px] flex items-center justify-center">
                              {sIdx + 1}
                            </span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                          <div className="font-bold text-slate-800 text-[11px] truncate" title={shohibul}>
                            {shohibul}
                          </div>
                          <span className="text-[9px] font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded text-center">
                            Akad &amp; Lunas
                          </span>
                        </div>
                      ))}
                      {Array.from({ length: Math.max(0, 7 - filledCount) }).map((_, emptyIdx) => (
                        <button
                          key={`empty-${emptyIdx}`}
                          onClick={() => setIsAddShohibulOpen(true)}
                          className="p-3 bg-slate-100/70 hover:bg-emerald-50/60 rounded-xl border border-dashed border-slate-300 hover:border-emerald-400 text-slate-400 hover:text-emerald-800 flex flex-col items-center justify-center gap-1 text-[11px] transition cursor-pointer group min-h-[75px]"
                        >
                          <span className="w-5 h-5 rounded-full bg-slate-200 group-hover:bg-emerald-200 group-hover:text-emerald-900 font-bold text-[10px] flex items-center justify-center text-slate-600">
                            {filledCount + emptyIdx + 1}
                          </span>
                          <span className="text-[10px] font-semibold text-center">Slot Kosong</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Bukti Dokumentasi Sembelih & Broadcast Shohibul */}
      {selectedGroupEvidence && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-[#1B5E20]">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Dokumentasi &amp; Kirim Bukti Sembelih</h3>
                  <p className="text-xs text-slate-500">{selectedGroupEvidence.groupTag} • {selectedGroupEvidence.rphLocation}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGroupEvidence(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="space-y-4 text-xs overflow-y-auto pr-1 pt-3 pb-1">
              {/* Shohibul List Summary */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    Daftar Shohibul Terpilih ({selectedGroupEvidence.shohibulList.length} Orang):
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Akad Syar&apos;i Lunas
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-700">
                  {selectedGroupEvidence.shohibulList.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 bg-white/70 px-2 py-1 rounded-lg border border-slate-100">
                      <span className="text-emerald-700 font-bold text-[10px] w-4">{idx + 1}.</span>
                      <span className="truncate">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mode / Tabs Filter */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800 text-xs">Media Dokumentasi:</span>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px]">
                  <button
                    type="button"
                    onClick={() => setEvidenceActiveTab('both')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
                      evidenceActiveTab === 'both' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Semua ({evidenceFiles.length + (evidenceUrl ? 1 : 0)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setEvidenceActiveTab('link')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 cursor-pointer ${
                      evidenceActiveTab === 'link' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Link2 className="w-3 h-3" /> Tautan
                  </button>
                  <button
                    type="button"
                    onClick={() => setEvidenceActiveTab('upload')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 cursor-pointer ${
                      evidenceActiveTab === 'upload' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <UploadCloud className="w-3 h-3" /> Upload ({evidenceFiles.length})
                  </button>
                </div>
              </div>

              {/* 1. TAUTAN VIDEO / LINK REKAMAN */}
              {(evidenceActiveTab === 'both' || evidenceActiveTab === 'link') && (
                <div className="p-3.5 bg-blue-50/40 border border-blue-200/80 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Link2 className="w-4 h-4 text-blue-700" />
                      Tautan Rekaman / Video Penyembelihan (Live / VOD / YouTube / Drive)
                    </label>
                    {evidenceUrl && (
                      <span className="text-[10px] text-blue-700 font-semibold bg-blue-100/70 px-2 py-0.5 rounded-full">
                        Link Aktif
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="Masukkan URL video (https://...)"
                      value={evidenceUrl}
                      onChange={(e) => setEvidenceUrl(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-[11px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    {evidenceUrl && (
                      <a
                        href={evidenceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition"
                        title="Buka tautan"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Tes
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* 2. UNGGAH BERKAS FOTO ATAU VIDEO */}
              {(evidenceActiveTab === 'both' || evidenceActiveTab === 'upload') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <UploadCloud className="w-4 h-4 text-[#1B5E20]" />
                      Unggah Berkas Foto atau Video Dokumentasi Langsung
                    </label>
                    <span className="text-[10px] text-slate-500">
                      Maks. 50 MB / file (MP4, MOV, JPG, PNG)
                    </span>
                  </div>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*,video/*"
                    multiple
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                  />

                  {/* Dropzone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingFile(true);
                    }}
                    onDragLeave={() => setIsDraggingFile(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingFile(false);
                      handleFileSelect(e.dataTransfer.files);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-4 text-center transition cursor-pointer ${
                      isDraggingFile
                        ? 'border-[#1B5E20] bg-emerald-50'
                        : 'border-slate-300 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/30'
                    }`}
                  >
                    <div className="flex justify-center items-center gap-2 mb-1">
                      <div className="p-2 rounded-xl bg-white border border-slate-200 text-[#1B5E20] shadow-2xs">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-slate-200 text-blue-700 shadow-2xs">
                        <Video className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      Tarik &amp; lepas video atau foto di sini, atau <span className="text-[#1B5E20] underline">Pilih dari Perangkat</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Format didukung: MP4, MOV, MKV, JPG, JPEG, PNG, WEBP
                    </p>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 font-semibold">Lampirkan Cepat:</span>
                    <button
                      type="button"
                      onClick={() => handleAddSampleMedia('image', 'Penyembelihan_Syari')}
                      className="px-2 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 rounded-lg text-[10px] font-semibold flex items-center gap-1 shadow-2xs transition cursor-pointer"
                    >
                      <FileImage className="w-3 h-3 text-emerald-700" /> Foto Sembelih
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddSampleMedia('image', 'Timbangan_Daging_Karkas')}
                      className="px-2 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 rounded-lg text-[10px] font-semibold flex items-center gap-1 shadow-2xs transition cursor-pointer"
                    >
                      <FileImage className="w-3 h-3 text-emerald-700" /> Foto Daging &amp; Timbangan
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddSampleMedia('video', 'Full_Sembelih_Juleha')}
                      className="px-2 py-1 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 rounded-lg text-[10px] font-semibold flex items-center gap-1 shadow-2xs transition cursor-pointer"
                    >
                      <FileVideo className="w-3 h-3 text-blue-700" /> Video Full Proses MP4
                    </button>
                  </div>

                  {/* Uploaded Files List */}
                  {evidenceFiles.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                        <span>Berkas Terlampir ({evidenceFiles.length} item):</span>
                        <button
                          type="button"
                          onClick={() => setEvidenceFiles([])}
                          className="text-[10px] text-rose-600 hover:underline font-semibold cursor-pointer"
                        >
                          Hapus Semua
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {evidenceFiles.map((file) => (
                          <div
                            key={file.id}
                            className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs hover:border-emerald-300 transition"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {file.type === 'image' ? (
                                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 overflow-hidden relative">
                                  {file.previewUrl ? (
                                    <Image
                                      src={file.previewUrl}
                                      alt={file.name}
                                      width={40}
                                      height={40}
                                      className="w-full h-full object-cover"
                                      unoptimized
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <ImageIcon className="w-5 h-5 text-[#1B5E20]" />
                                  )}
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                                  <Film className="w-5 h-5 text-blue-700" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold text-slate-900 truncate" title={file.name}>
                                  {file.name}
                                </p>
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                  <span className="uppercase font-mono font-semibold text-slate-700">{file.type}</span>
                                  <span>•</span>
                                  <span>{file.size}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {file.previewUrl && (
                                <button
                                  type="button"
                                  onClick={() => setPreviewMedia(file)}
                                  className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer transition"
                                  title="Pratinjau"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveEvidenceFile(file.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition"
                                title="Hapus berkas"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. NOTIFICATION MESSAGE PREVIEW */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 text-xs space-y-1.5">
                <div className="font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    Pesan Notifikasi WhatsApp Siap Dikirim:
                  </span>
                  <span className="text-[10px] text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded font-mono">
                    Auto-Generate
                  </span>
                </div>
                <div className="p-2.5 bg-white/90 rounded-lg border border-emerald-200/80 font-mono text-[10.5px] text-slate-800 leading-relaxed whitespace-pre-line">
                  {`“Bismillah, amanah Qurban Anda (${selectedGroupEvidence.groupTag}) telah disembelih sesuai syariat Islam di ${selectedGroupEvidence.rphLocation}.
                  
📹 Tautan Rekaman Video: ${evidenceUrl || '(Tidak dilampirkan)'}
📸 Lampiran Berkas: ${evidenceFiles.length > 0 ? `${evidenceFiles.length} Berkas Dokumentasi (${evidenceFiles.map(f => f.name).join(', ')})` : 'Foto Dokumentasi & Sertifikat Digital Terlampir'}.

Jazakumullah Khairan Katsiran.”`}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t mt-2 shrink-0">
              <div className="text-[11px] text-slate-500">
                {evidenceFiles.length} file &amp; {evidenceUrl ? '1 link aktif' : '0 link'}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGroupEvidence(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSendingWa(true);
                    setTimeout(() => {
                      setIsSendingWa(false);
                      setSelectedGroupEvidence(null);
                      showToast({
                        title: 'Bukti Sembelih Terkirim',
                        description: `WhatsApp & Email berhasil dikirim ke seluruh ${selectedGroupEvidence.shohibulList.length} shohibul (${selectedGroupEvidence.groupTag}) beserta tautan video dan ${evidenceFiles.length} lampiran foto/video.`,
                        type: 'success',
                      });
                    }, 700);
                  }}
                  disabled={isSendingWa}
                  className="px-4 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition shadow-xs disabled:opacity-50"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isSendingWa ? 'Mengirimkan...' : 'Kirim Bukti ke Shohibul'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 space-y-3 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="font-bold text-xs text-slate-900 truncate">{previewMedia.name}</div>
              <button
                type="button"
                onClick={() => setPreviewMedia(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {previewMedia.previewUrl && (
              <div className="rounded-xl overflow-hidden bg-slate-900 aspect-video relative flex items-center justify-center">
                <Image
                  src={previewMedia.previewUrl}
                  alt={previewMedia.name}
                  width={600}
                  height={400}
                  className="w-full h-full object-contain"
                  unoptimized
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Ukuran: <strong>{previewMedia.size}</strong></span>
              <button
                type="button"
                onClick={() => setPreviewMedia(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. SHOHIBUL QURBAN TRANSACTIONS */}
      {activeTab === 'transactions' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Data Transaksi Pemesan &amp; Nama Shohibul Qurban</h3>
              <p className="text-xs text-slate-500">Pencatatan akad, distribusi daging, dan penerbitan sertifikat digital</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddShohibulOpen(true)}
                className="px-3.5 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Daftarkan Shohibul
              </button>
              <button
                onClick={() => {
                  showToast({
                    title: 'Ekspor Data Shohibul',
                    description: 'Mengunduh manifes pequrban untuk tim Juleha di RPH...',
                    type: 'success',
                  });
                }}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Table Filters */}
          <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari pemesan, nama shohibul qurban (bin/binti), ID pesanan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
              />
            </div>
            <select
              value={selectedAnimalFilter}
              onChange={(e) => setSelectedAnimalFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <option value="all">Semua Tipe Hewan / Slot</option>
              <option value="Sapi">Sapi (Utuh / Patungan 1/7)</option>
              <option value="Kambing">Kambing / Domba</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">ID Pesanan</th>
                  <th className="py-3 px-4">Nama Pemesan</th>
                  <th className="py-3 px-4">Tipe Hewan</th>
                  <th className="py-3 px-4">Lafazh Nama Pequrban</th>
                  <th className="py-3 px-4">Opsi Distribusi</th>
                  <th className="py-3 px-4 text-center">Aksi / Laporan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 text-[11px]">{ord.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{ord.buyerName}</td>
                    <td className="py-3 px-4 text-slate-700">{ord.animalType}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-900">{ord.qurbanNames}</td>
                    <td className="py-3 px-4 text-[11px] text-slate-600">{ord.distributionOption}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedQurbanCert(ord)}
                          title="Lihat Sertifikat Qurban"
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#1B5E20] border border-emerald-300 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition shadow-2xs"
                        >
                          <Award className="w-3 h-3 text-emerald-700" />
                          Sertifikat
                        </button>
                        <button
                          onClick={() => setSelectedShohibulReport(ord)}
                          title="Kirim Laporan WhatsApp"
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedRphStream(ord)}
                          title="Tonton Live / Rekaman RPH"
                          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer transition"
                        >
                          <Play className="w-3.5 h-3.5" />
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

      {/* 5. LOG AKAD WAKALAH */}
      {activeTab === 'wakalah' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Log Niat &amp; Akad Wakalah Syariah Digital</h3>
              <p className="text-xs text-slate-500">Tersimpan permanen dengan Digital Timestamp &amp; Akreditasi MUI</p>
            </div>
            <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
              Total Akad: {shohibulOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {shohibulOrders.map((ord) => (
              <div key={ord.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{ord.buyerName} ({ord.id})</span>
                  <span className="text-[11px] text-slate-500 font-mono">{ord.wakalahTimestamp}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 italic text-emerald-950 font-serif">
                  &quot;{ord.wakalahLafazh}&quot;
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. DISTRIBUSI & RPH */}
      {activeTab === 'distribution_options' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900">Opsi 1: Disalurkan 100% (Pool Mustahik Pelosok)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Daging qurban dikalengkan (rendang/kornet steril) atau didistribusikan segar ke 14 wilayah 3T di NTT, NTB, Maluku, dan Banten Selatan.
            </p>
            <div className="p-3.5 bg-slate-50 rounded-xl font-mono text-xs text-slate-700">
              Total Pemesan Disalurkan 100%: <strong>68 Shohibul (86%)</strong>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900">Opsi 2: Hak 1/3 Bagian Diambil Shohibul</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Paket 1/3 bagian daging segar siap olah diantar langsung menggunakan coolbox ber-es kering pada hari H+1 atau diambil di RPH rekanan.
            </p>
            <div className="p-3.5 bg-slate-50 rounded-xl font-mono text-xs text-slate-700">
              Total Pemesan Hak 1/3: <strong>11 Shohibul (14%)</strong>
            </div>
          </div>
        </div>
      )}

      {/* 7. LAPORAN & WA BLAST */}
      {activeTab === 'reports' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Dokumentasi Pelaksanaan &amp; Auto-Report WhatsApp</h3>
              <p className="text-xs text-slate-500">Kirim video penyembelihan dan sertifikat langsung ke WhatsApp shohibul</p>
            </div>
            <button
              onClick={() => {
                if (shohibulOrders.length > 0) {
                  setSelectedShohibulReport(shohibulOrders[0]);
                }
              }}
              className="px-3.5 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Kirim Notifikasi Laporan WA
            </button>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Sistem secara otomatis mengkompilasi foto/video hewan sebelum &amp; sesudah sembelih beserta sertifikat qurban digital untuk dikirimkan langsung ke nomor WhatsApp shohibul.
          </p>
        </div>
      )}

      {/* Shared Modals */}
      <ZiswafModals
        selectedBszMuzakki={null}
        onCloseBsz={() => {}}
        selectedQurbanCert={selectedQurbanCert}
        onCloseQurbanCert={() => setSelectedQurbanCert(null)}
        isQrisGeneratorOpen={false}
        onCloseQris={() => {}}
        qrisGenAmount=""
        setQrisGenAmount={() => {}}
        qrisGenNote=""
        setQrisGenNote={() => {}}
        isCreateInfaqOpen={false}
        onCloseCreateInfaq={() => {}}
        infaqFormName=""
        setInfaqFormName={() => {}}
        infaqFormCategory="Infaq Subuh"
        setInfaqFormCategory={() => {}}
        infaqFormTarget=""
        setInfaqFormTarget={() => {}}
        infaqFormNoTarget={false}
        setInfaqFormNoTarget={() => {}}
        infaqFormDesc=""
        setInfaqFormDesc={() => {}}
        onSubmitCreateInfaq={() => {}}
        isManualInfaqOpen={false}
        onCloseManualInfaq={() => {}}
        infaqManualDonor=""
        setInfaqManualDonor={() => {}}
        infaqManualAmount=""
        setInfaqManualAmount={() => {}}
        infaqManualProgram=""
        setInfaqManualProgram={() => {}}
        infaqManualMethod="Kasir Tunai / Kotak Infaq"
        setInfaqManualMethod={() => {}}
        infaqPrograms={[]}
        onSubmitManualInfaq={() => {}}
        isRecordZakatOpen={false}
        onCloseRecordZakat={() => {}}
        zakatMuzakkiName=""
        setZakatMuzakkiName={() => {}}
        zakatMuzakkiPhone=""
        setZakatMuzakkiPhone={() => {}}
        zakatMuzakkiNpwp=""
        setZakatMuzakkiNpwp={() => {}}
        zakatTypeSelected="Zakat Maal - Penghasilan"
        setZakatTypeSelected={() => {}}
        zakatNominalInput=""
        setZakatNominalInput={() => {}}
        zakatCalcNote=""
        setZakatCalcNote={() => {}}
        onSubmitRecordZakat={() => {}}
        isDistributeAsnafOpen={false}
        onCloseDistributeAsnaf={() => {}}
        selectedAsnafTarget="Fakir"
        setSelectedAsnafTarget={() => {}}
        distributeNominal=""
        setDistributeNominal={() => {}}
        distributeBeneficiaryCount=""
        setDistributeBeneficiaryCount={() => {}}
        distributeNotes=""
        setDistributeNotes={() => {}}
        onSubmitDistributeAsnaf={() => {}}
        isAddShohibulOpen={isAddShohibulOpen}
        onCloseAddShohibul={() => setIsAddShohibulOpen(false)}
        shohibulBuyerName={shohibulBuyerName}
        setShohibulBuyerName={setShohibulBuyerName}
        shohibulQurbanName={shohibulQurbanName}
        setShohibulQurbanName={setShohibulQurbanName}
        shohibulAnimalChoice={shohibulAnimalChoice}
        setShohibulAnimalChoice={setShohibulAnimalChoice}
        shohibulDistOption={shohibulDistOption}
        setShohibulDistOption={setShohibulDistOption}
        onSubmitAddShohibul={handleAddShohibulSubmit}
        selectedRphStream={selectedRphStream}
        onCloseRphStream={() => setSelectedRphStream(null)}
        selectedShohibulReport={selectedShohibulReport}
        onCloseShohibulReport={() => setSelectedShohibulReport(null)}
        onShowToast={showToast}
      />
    </div>
  );
}
