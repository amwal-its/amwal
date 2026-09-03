'use client';

import React, { useState, useRef } from 'react';
import {
  Newspaper,
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  Share2,
  Heart,
  MessageSquare,
  Calendar,
  MapPin,
  User,
  Tag,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Upload,
  Link2,
  ExternalLink,
  Layers,
  Flame,
  Bookmark,
  Send,
  MoreVertical,
  Check,
  X,
  FileText,
  Pin,
  TrendingUp,
  BarChart3,
  Globe,
  Clock,
  ThumbsUp,
  Image as ImageIcon,
  FolderPlus,
  SlidersHorizontal,
  ChevronRight,
  Printer,
  Copy,
  Megaphone,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

// --- DATA TYPES ---
export interface NewsItem {
  id: string;
  title: string;
  category: string;
  type: 'kegiatan' | 'siaran_pers' | 'pengumuman' | 'liputan_khusus';
  coverImage: string;
  summary: string;
  content: string;
  author: string;
  location?: string;
  eventDate?: string;
  publishDate: string;
  status: 'published' | 'draft' | 'archived';
  isPinned?: boolean;
  likesCount: number;
  viewsCount: number;
  tags: string[];
  comments: NewsComment[];
}

export interface NewsComment {
  id: string;
  authorName: string;
  authorRole: string;
  avatarText: string;
  comment: string;
  timestamp: string;
  likes: number;
}

// --- INITIAL DATA ---
const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-01',
    title: 'Peletakan Batu Pertama Pembangunan Rumah Sakit Wakaf Produktif Terpadu Jawa Barat',
    category: 'Kegiatan Lapangan',
    type: 'kegiatan',
    coverImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
    summary: 'Super Admin bersama Badan Wakaf Indonesia (BWI) dan jajaran Pemprov meresmikan mulainya konstruksi RS Wakaf 5 lantai berkapasitas 120 ranjang.',
    content: `## Momentum Kebangkitan Wakaf Kesehatan Nasional
Pada hari Rabu, Super Admin Amwal Foundation bersama Badan Wakaf Indonesia (BWI) Pusat dan Forum Nazhir Jawa Barat secara resmi melaksanakan seremoni peletakan batu pertama (groundbreaking) proyek **Rumah Sakit Wakaf Produktif Terpadu**.

Fasilitas kesehatan ini dibangun di atas lahan wakaf seluas 12.500 m² yang didanai melalui skema kolaborasi Wakaf Uang (Cash Waqf Linked Sukuk) dan wakaf langsung dari 14.200 wakif ritel di seluruh Indonesia.

### Spesifikasi & Layanan Unggulan:
1. **Kapasitas Rawat Inap**: 120 tempat tidur dengan 60% dialokasikan untuk pasien dhuafa non-bayar.
2. **Pusat Hemodialisis Syariah**: 24 mesin cuci darah dengan subsidi penuh dari surplus wakaf produktif.
3. **Poli Ibu & Anak Terpadu**: Fasilitas persalinan dan perawatan neonatal modern.

> 🏥 *"RS Wakaf ini membuktikan bahwa dana abadi ummat dapat dikonversi menjadi infrastruktur nyata yang melayani kesehatan masyarakat tanpa diskriminasi."* — **Ketua Badan Wakaf Indonesia**

Seluruh proses konstruksi diawasi secara berkala dengan sistem pelaporan progres fisik digital terintegrasi di platform Amwal.`,
    author: 'Aldani Prasetyo (Super Admin)',
    location: 'Kabupaten Bandung Barat, Jawa Barat',
    eventDate: '24 Agustus 2026',
    publishDate: '25 Agustus 2026',
    status: 'published',
    isPinned: true,
    likesCount: 342,
    viewsCount: 6850,
    tags: ['WakafKesehatan', 'Groundbreaking', 'RSWakaf', 'BWIPusat', 'InfrastrukturUmmat'],
    comments: [
      {
        id: 'c-1',
        authorName: 'H. M. Syaifullah',
        authorRole: 'Wakif Rutin',
        avatarText: 'MS',
        comment: 'Alhamdulillah, sangat bangga melihat wakaf uang kami terwujud nyata dalam bentuk rumah sakit gratis untuk dhuafa.',
        timestamp: 'Kemarin, 16:40 WIB',
        likes: 18,
      },
      {
        id: 'c-2',
        authorName: 'dr. Farida Rahmawati',
        authorRole: 'Tenaga Medis Relawan',
        avatarText: 'FR',
        comment: 'Semoga proses pembangunan berjalan lancar dan segera bisa melayani masyarakat yang membutuhkan.',
        timestamp: '2 hari lalu',
        likes: 9,
      },
    ],
  },
  {
    id: 'news-02',
    title: 'Penyaluran Bantuan Air Bersih & Sumur Bor Wakaf di 5 Titik Kekeringan Ekstrem NTT',
    category: 'Penyaluran Bantuan',
    type: 'kegiatan',
    coverImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80',
    summary: 'Realisasi dana program wakaf sumur bor telah mengalirkan 45.000 liter air bersih per hari untuk lebih dari 2.800 warga desa.',
    content: `## Air Bersih Mengalir untuk Saudara di Pelosok
Tim Operasional Lapangan Amwal Foundation telah berhasil menyelesaikan pengeboran sumur sedalam 95 meter dan instalasi solar cell pump di 5 desa Kabupaten Timor Tengah Selatan, NTT.

Sebelumnya, warga setempat harus berjalan kaki sejauh 4 kilometer menuruni tebing berbatu untuk mendapatkan satu jeriken air keruh.

### Titik Lokasi Pembangunan:
- **Desa Oebelo**: Sumur Bor Submersible + Toren Penampungan 10.000 Liter.
- **Desa Boking**: Jaringan Perpipaan 1,2 KM ke permukiman dan madrasah.
- **Desa Toineke**: Fasilitas Mandi Cuci Kakus (MCK) Komunal Berbasis Syariah.
- **Desa Nunkolo & Kualin**: Filterisasi air minum reverse osmosis gratis.

Seluruh anggaran belanja pipa, mesin pompa, dan kuitansi operasional telah lolos verifikasi DPS dan tercatat transparan di buku besar blockchain internal.`,
    author: 'Tim Relawan Kemanusiaan Amwal',
    location: 'Timor Tengah Selatan, Nusa Tenggara Timur',
    eventDate: '20 Agustus 2026',
    publishDate: '22 Agustus 2026',
    status: 'published',
    isPinned: true,
    likesCount: 289,
    viewsCount: 4920,
    tags: ['WakafSumurBor', 'SedekahAir', 'NTTTersenyum', 'AirBersih', 'Dhuafa'],
    comments: [
      {
        id: 'c-3',
        authorName: 'Ustadz Abdullah Flores',
        authorRole: 'Tokoh Masyarakat',
        avatarText: 'AF',
        comment: 'Jazakumullah khairan katsiran kepada para wakif dan admin Amwal. Air bersih ini menjadi amal jariyah yang tak putus.',
        timestamp: '3 hari lalu',
        likes: 14,
      },
    ],
  },
  {
    id: 'news-03',
    title: 'Integrasi Standar QRIS Wakaf Digital BWI & Kemudahan Pembayaran Real-Time 2026',
    category: 'Siaran Pers & BWI',
    type: 'siaran_pers',
    coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    summary: 'Platform Amwal resmi menghubungkan QRIS MPM dan CPM dinamis dengan penerbitan Sertifikat Wakaf Uang (SWU) otomatis berbasis NIK.',
    content: `## Kemudahan Berwakaf dalam Genggaman
Amwal Fintech Syariah resmi meluncurkan integrasi **QRIS Wakaf Digital Terstandar BWI**. Melalui inovasi ini, setiap transaksi wakaf uang mulai dari Rp 10.000 melalui mobile banking mana pun langsung tercatat resmi di database nasional Badan Wakaf Indonesia.

### Keunggulan Fitur Baru:
- **Konfirmasi Akad Syariah Instan**: Ijāb Qabūl digital langsung tertera di layar smartphone wakif.
- **Auto-Generate SWU (Sertifikat Wakaf Uang)**: Untuk donasi di atas Rp 1.000.000 diterbitkan sertifikat resmi dengan barcode verifikasi BWI.
- **Zero Fee Transaksi**: 100% dana pokok disalurkan ke portofolio nazhir tanpa potongan merchant.`,
    author: 'Humas & Komunikasi Publik Amwal',
    location: 'Jakarta Islamic Centre, DKI Jakarta',
    eventDate: '18 Agustus 2026',
    publishDate: '19 Agustus 2026',
    status: 'published',
    isPinned: false,
    likesCount: 195,
    viewsCount: 3640,
    tags: ['QRISWakaf', 'DigitalisasiSyariah', 'BWI', 'FintechWakaf'],
    comments: [],
  },
  {
    id: 'news-04',
    title: 'Distribusi Surplus Hasil Kebun Kelapa Sawit & Hidroponik Wakaf Produktif Senilai Rp 840 Juta',
    category: 'Kegiatan Lapangan',
    type: 'kegiatan',
    coverImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop&q=80',
    summary: 'Surplus operasional semester I berhasil dibagikan kepada 650 penerima manfaat (Mauquf Alaih) bidang beasiswa santri dan lansia prasejahtera.',
    content: `## Panen Berkah dari Kebun Wakaf Produktif
Kebun kelapa sawit dan greenhouse hidroponik seluas 40 hektare yang dikelola oleh Nazhir Mitra Amwal di Riau berhasil mencatatkan surplus laba bersih sebesar **Rp 840.000.000** pada panen raya Semester I 2026.

Sesuai ketentuan ikrar wakaf, seluruh surplus (mauquf alaih) disalurkan untuk:
1. **Beasiswa Penuh 200 Santri Yatim** di 8 pesantren binaan.
2. **Bantuan Pangan Pokok Bulanan untuk 450 Lansia Dhuafa**.
3. **Reinvestasi 10% Cadangan Pemeliharaan Bibit** guna menjaga produktivitas pohon sawit.`,
    author: 'Divisi Audit & Penyaluran Surplus',
    location: 'Siak Sri Indrapura, Riau',
    eventDate: '12 Agustus 2026',
    publishDate: '14 Agustus 2026',
    status: 'published',
    isPinned: false,
    likesCount: 220,
    viewsCount: 3180,
    tags: ['SurplusWakaf', 'SawitProduktif', 'BeasiswaSantri', 'MauqufAlaih'],
    comments: [],
  },
  {
    id: 'news-05',
    title: 'PENGUMUMAN: Pendaftaran Uji Sertifikasi Standar Kompetensi Nazhir BWI Batch IV 2026',
    category: 'Pengumuman Resmi',
    type: 'pengumuman',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    summary: 'Dibuka kesempatan bagi seluruh pengelola yayasan dan amil lembaga wakaf untuk mengikuti asesmen standar kompetensi BNSP-BWI.',
    content: `## Pengumuman Resmi Sertifikasi Nazhir
Diumumkan kepada seluruh Pengurus Nazhir Perorangan, Organisasi, maupun Badan Hukum yang terdaftar di platform Amwal bahwa pendaftaran **Sertifikasi Kompetensi Nazhir (LSP BWI - BNSP)** telah dibuka.

### Skema Uji Kompetensi:
- Tata Kelola Legalitas dan Harta Benda Wakaf (HBW)
- Penyusunan Laporan Keuangan PSAK 112
- Strategi Manajemen Risiko Investasi Wakaf Uang
- Digital Reporting & Monitoring Lapangan

Pendaftaran ditutup pada tanggal 10 September 2026 melalui dashboard masing-masing Nazhir.`,
    author: 'Sekretariat Sertifikasi & Kepatuhan',
    location: 'Kantor BWI Pusat, Gedung Bayt Al-Qur’an TMII',
    eventDate: '01 September 2026',
    publishDate: '10 Agustus 2026',
    status: 'published',
    isPinned: false,
    likesCount: 160,
    viewsCount: 2450,
    tags: ['SertifikasiNazhir', 'BNSP', 'Pengumuman', 'PSAK112'],
    comments: [],
  },
];

export function NewsManagementView() {
  const { showToast } = useToast();

  // Primary Sub View: 'list' | 'create' | 'categories' | 'analytics'
  const [subView, setSubView] = useState<'list' | 'create' | 'categories' | 'analytics'>('list');

  // News List State
  const [newsList, setNewsList] = useState<NewsItem[]>(INITIAL_NEWS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Categories State
  const [categories, setCategories] = useState<string[]>([
    'Kegiatan Lapangan',
    'Penyaluran Bantuan',
    'Siaran Pers & BWI',
    'Pengumuman Resmi',
    'Kemitraan Strategis',
    'Seremoni & Akad',
  ]);

  // Reader Modal Preview
  const [previewNews, setPreviewNews] = useState<NewsItem | null>(null);

  // New Comment in Preview
  const [commentInput, setCommentInput] = useState('');

  // Editing ID
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State: Create / Edit News
  const [coverSource, setCoverSource] = useState<'upload' | 'link' | 'preset'>('preset');
  const [uploadedCoverName, setUploadedCoverName] = useState('');
  const [tagInput, setTagInput] = useState('');

  const [form, setForm] = useState<{
    title: string;
    category: string;
    type: 'kegiatan' | 'siaran_pers' | 'pengumuman' | 'liputan_khusus';
    coverImage: string;
    summary: string;
    content: string;
    author: string;
    location: string;
    eventDate: string;
    status: 'published' | 'draft';
    isPinned: boolean;
    tags: string[];
  }>({
    title: '',
    category: 'Kegiatan Lapangan',
    type: 'kegiatan',
    coverImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
    summary: '',
    content: '',
    author: 'Super Admin Amwal',
    location: 'Jakarta & Lapangan Binaan',
    eventDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    status: 'published',
    isPinned: false,
    tags: ['KegiatanAmwal', 'TransparansiWakaf'],
  });

  // Modal Category Management
  const [newCatInput, setNewCatInput] = useState('');
  const [editingCatIndex, setEditingCatIndex] = useState<number | null>(null);
  const [editingCatText, setEditingCatText] = useState('');

  // Preset Images
  const PRESET_IMAGES = [
    { label: 'Groundbreaking RS', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80' },
    { label: 'Penyaluran Air Bersih', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80' },
    { label: 'Akad & Seremoni', url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80' },
    { label: 'Pertanian Produktif', url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop&q=80' },
    { label: 'Pendidikan & Pelatihan', url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80' },
    { label: 'Bantuan Sosial & Sembako', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80' },
  ];

  // Handlers
  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      title: '',
      category: categories[0] || 'Kegiatan Lapangan',
      type: 'kegiatan',
      coverImage: PRESET_IMAGES[0].url,
      summary: '',
      content: '',
      author: 'Super Admin Amwal',
      location: 'DKI Jakarta & Lapangan Binaan',
      eventDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'published',
      isPinned: false,
      tags: ['KegiatanAmwal', 'WakafProduktif'],
    });
    setSubView('create');
  };

  const handleEdit = (news: NewsItem) => {
    setEditingId(news.id);
    setForm({
      title: news.title,
      category: news.category,
      type: news.type,
      coverImage: news.coverImage,
      summary: news.summary,
      content: news.content,
      author: news.author,
      location: news.location || '',
      eventDate: news.eventDate || '',
      status: news.status === 'archived' ? 'draft' : news.status,
      isPinned: !!news.isPinned,
      tags: news.tags || [],
    });
    setSubView('create');
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus berita/informasi ini?')) {
      setNewsList((prev) => prev.filter((n) => n.id !== id));
      showToast({
        title: 'Berita Dihapus',
        description: 'Artikel berita kegiatan berhasil dihapus dari sistem.',
        type: 'info',
      });
      if (previewNews?.id === id) setPreviewNews(null);
    }
  };

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNewsList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isPinned: !item.isPinned } : item))
    );
    showToast({
      title: 'Status Pin Diperbarui',
      description: 'Status sorotan/headline berita berhasil diubah.',
      type: 'success',
    });
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const cleanTag = tagInput.trim().replace(/^#/, '');
    if (!form.tags.includes(cleanTag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, cleanTag] }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tagToRemove) }));
  };

  const handleSaveNews = (saveStatus: 'published' | 'draft') => {
    if (!form.title.trim()) {
      showToast({
        title: 'Judul Berita Kosong',
        description: 'Harap isi judul berita atau nama kegiatan.',
        type: 'error',
      });
      return;
    }
    if (!form.content.trim() && !form.summary.trim()) {
      showToast({
        title: 'Konten Belum Lengkap',
        description: 'Tuliskan ringkasan dan isi lengkap berita kegiatan.',
        type: 'error',
      });
      return;
    }

    const todayStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    if (editingId) {
      setNewsList((prev) =>
        prev.map((item) => {
          if (item.id === editingId) {
            return {
              ...item,
              title: form.title.trim(),
              category: form.category,
              type: form.type,
              coverImage: form.coverImage,
              summary: form.summary.trim() || form.title,
              content: form.content.trim(),
              author: form.author.trim() || 'Super Admin',
              location: form.location.trim(),
              eventDate: form.eventDate.trim(),
              status: saveStatus,
              isPinned: form.isPinned,
              tags: form.tags,
            };
          }
          return item;
        })
      );
      showToast({
        title: 'Berita Berhasil Diperbarui',
        description: `Artikel berita "${form.title.slice(0, 30)}..." telah disimpan.`,
        type: 'success',
      });
    } else {
      const newNews: NewsItem = {
        id: `news-${Date.now()}`,
        title: form.title.trim(),
        category: form.category,
        type: form.type,
        coverImage: form.coverImage,
        summary: form.summary.trim() || form.title,
        content: form.content.trim() || form.summary,
        author: form.author.trim() || 'Super Admin Amwal',
        location: form.location.trim(),
        eventDate: form.eventDate.trim(),
        publishDate: todayStr,
        status: saveStatus,
        isPinned: form.isPinned,
        likesCount: 0,
        viewsCount: 1,
        tags: form.tags.length > 0 ? form.tags : ['KegiatanAmwal'],
        comments: [],
      };
      setNewsList((prev) => [newNews, ...prev]);
      showToast({
        title: saveStatus === 'published' ? 'Berita Diterbitkan!' : 'Draft Disimpan',
        description: `Informasi kegiatan berhasil ${saveStatus === 'published' ? 'terbit ke portal publik' : 'disimpan sebagai konsep'}.`,
        type: 'success',
      });
    }

    setSubView('list');
  };

  const handleAddComment = (newsId: string) => {
    if (!commentInput.trim()) return;
    const newComm: NewsComment = {
      id: `comm-${Date.now()}`,
      authorName: 'Super Admin (Tanggapan Resmi)',
      authorRole: 'Admin Platform',
      avatarText: 'SA',
      comment: commentInput.trim(),
      timestamp: 'Baru saja',
      likes: 0,
    };

    setNewsList((prev) =>
      prev.map((item) => {
        if (item.id === newsId) {
          return {
            ...item,
            comments: [...item.comments, newComm],
          };
        }
        return item;
      })
    );

    if (previewNews && previewNews.id === newsId) {
      setPreviewNews({
        ...previewNews,
        comments: [...previewNews.comments, newComm],
      });
    }

    setCommentInput('');
    showToast({
      title: 'Tanggapan Terkirim',
      description: 'Komentar resmi admin berhasil disematkan pada berita.',
      type: 'success',
    });
  };

  const handleLikeNews = (id: string) => {
    setNewsList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, likesCount: n.likesCount + 1 } : n))
    );
    if (previewNews && previewNews.id === id) {
      setPreviewNews({ ...previewNews, likesCount: previewNews.likesCount + 1 });
    }
  };

  // Category Management Handlers
  const handleAddCategory = () => {
    if (!newCatInput.trim()) return;
    const cat = newCatInput.trim();
    if (!categories.includes(cat)) {
      setCategories((prev) => [...prev, cat]);
      showToast({
        title: 'Kategori Berita Ditambahkan',
        description: `Kategori "${cat}" siap digunakan.`,
        type: 'success',
      });
    }
    setNewCatInput('');
  };

  const handleSaveEditCategory = (index: number) => {
    if (!editingCatText.trim()) return;
    const updated = [...categories];
    const oldCat = updated[index];
    const newCat = editingCatText.trim();
    updated[index] = newCat;
    setCategories(updated);

    // Update news using this category
    setNewsList((prev) =>
      prev.map((item) => (item.category === oldCat ? { ...item, category: newCat } : item))
    );

    setEditingCatIndex(null);
    setEditingCatText('');
    showToast({
      title: 'Kategori Diperbarui',
      description: `Kategori diubah menjadi "${newCat}".`,
      type: 'success',
    });
  };

  const handleDeleteCategory = (catName: string) => {
    if (categories.length <= 1) {
      showToast({
        title: 'Gagal Menghapus',
        description: 'Minimal harus ada 1 kategori aktif.',
        type: 'error',
      });
      return;
    }
    setCategories((prev) => prev.filter((c) => c !== catName));
    showToast({
      title: 'Kategori Dihapus',
      description: `Kategori "${catName}" telah dihapus.`,
      type: 'info',
    });
  };

  // Filtered News
  const filteredNews = newsList.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchType = selectedType === 'all' || item.type === selectedType;
    const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;

    return matchSearch && matchCategory && matchType && matchStatus;
  });

  // Calculate High-level Stats
  const totalNews = newsList.length;
  const publishedCount = newsList.filter((n) => n.status === 'published').length;
  const draftCount = newsList.filter((n) => n.status === 'draft').length;
  const totalViews = newsList.reduce((acc, curr) => acc + curr.viewsCount, 0);
  const totalLikes = newsList.reduce((acc, curr) => acc + curr.likesCount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. TOP HEADER & ACTION BAR */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-emerald-700 text-white rounded-2xl shadow-xs">
              <Newspaper className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Manajemen Berita & Kegiatan
                </h1>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Super Admin
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Publikasikan dokumentasi kegiatan lapangan, siaran pers BWI, dan pengumuman resmi transparansi amwal.
              </p>
            </div>
          </div>

          {/* Quick Sub-navigation & CTA */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSubView('list')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                subView === 'list'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Daftar Berita ({totalNews})</span>
            </button>

            <button
              onClick={() => setSubView('categories')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                subView === 'categories'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FolderPlus className="w-4 h-4" />
              <span>Kategori ({categories.length})</span>
            </button>

            <button
              onClick={() => setSubView('analytics')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                subView === 'analytics'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Statistik</span>
            </button>

            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-[#1B5E20] hover:bg-[#154a19] text-white rounded-xl text-xs font-bold transition shadow-xs hover:shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Berita Baru</span>
            </button>
          </div>
        </div>

        {/* STATS METRIC RIBBON */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Publikasi</div>
            <div className="text-xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5">
              <span>{publishedCount}</span>
              <span className="text-xs font-medium text-slate-400">/ {totalNews} rilis</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
            <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Total Pembaca</div>
            <div className="text-xl font-black text-emerald-950 mt-1">
              {totalViews.toLocaleString('id-ID')} <span className="text-xs font-medium text-emerald-700">Views</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-100">
            <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Apresiasi & Suka</div>
            <div className="text-xl font-black text-amber-950 mt-1">
              {totalLikes.toLocaleString('id-ID')} <span className="text-xs font-medium text-amber-700">Likes</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100">
            <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Status Konsep (Draft)</div>
            <div className="text-xl font-black text-blue-950 mt-1 flex items-center justify-between">
              <span>{draftCount} Draft</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-200/80 text-blue-900 font-bold">
                Siap Review
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN SUB-VIEW SWITCHER */}

      {/* --- SUBVIEW: LIST BERITA --- */}
      {subView === 'list' && (
        <div className="space-y-5">
          {/* Filter and Search Toolbar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari judul berita, tag, atau lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-600 outline-none transition"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer hover:border-slate-300 transition"
              >
                <option value="all">Semua Kategori</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer hover:border-slate-300 transition"
              >
                <option value="all">Semua Tipe</option>
                <option value="kegiatan">Kegiatan Lapangan</option>
                <option value="siaran_pers">Siaran Pers</option>
                <option value="pengumuman">Pengumuman Resmi</option>
                <option value="liputan_khusus">Liputan Khusus</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer hover:border-slate-300 transition"
              >
                <option value="all">Semua Status</option>
                <option value="published">Terbit (Published)</option>
                <option value="draft">Draft (Konsep)</option>
              </select>
            </div>
          </div>

          {/* NEWS CARDS GRID */}
          {filteredNews.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs">
              <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">Tidak ada berita yang sesuai</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Silakan sesuaikan kata kunci pencarian atau filter kategori di atas.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedType('all');
                  setSelectedStatus('all');
                }}
                className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredNews.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-500/50 hover:shadow-md transition overflow-hidden flex flex-col group"
                >
                  {/* Cover Image Container */}
                  <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold">
                        {item.category}
                      </span>

                      <div className="flex items-center gap-1">
                        {item.isPinned && (
                          <span className="p-1.5 rounded-lg bg-amber-500 text-white shadow-xs" title="Disematkan di Beranda">
                            <Pin className="w-3 h-3 fill-current" />
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            item.status === 'published'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>

                    {/* Location Badge if exists */}
                    {item.location && (
                      <div className="absolute bottom-2 left-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md text-white text-[10px]">
                        <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                        <span className="truncate max-w-[200px]">{item.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Publication Date & Author */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{item.publishDate}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span className="truncate max-w-[120px]">{item.author.split(' ')[0]}</span>
                        </span>
                      </div>

                      <h3
                        onClick={() => setPreviewNews(item)}
                        className="text-sm font-bold text-slate-900 hover:text-emerald-800 transition line-clamp-2 leading-snug cursor-pointer"
                      >
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                        {item.summary}
                      </p>

                      {/* Tags */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {item.tags.slice(0, 3).map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md"
                            >
                              #{t}
                            </span>
                          ))}
                          {item.tags.length > 3 && (
                            <span className="text-[9px] text-slate-400">+{item.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      {/* Views & Likes */}
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.viewsCount}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-rose-500" />
                          <span>{item.likesCount}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                          <span>{item.comments?.length || 0}</span>
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleTogglePin(item.id, e)}
                          className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                            item.isPinned
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                          }`}
                          title={item.isPinned ? 'Lepas Pin' : 'Sematkan di Beranda'}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setPreviewNews(item)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-xs transition cursor-pointer"
                          title="Lihat Pratinjau Pembaca"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg text-xs transition cursor-pointer"
                          title="Edit Berita"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs transition cursor-pointer"
                          title="Hapus Berita"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- SUBVIEW: CREATE / EDIT NEWS FORM --- */}
      {subView === 'create' && (
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-2xs space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {editingId ? 'Edit Artikel Berita & Kegiatan' : 'Formulir Publikasi Berita & Kegiatan'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tuliskan liputan lapangan, siaran pers, atau pengumuman resmi transparansi dana wakaf.
              </p>
            </div>

            <button
              onClick={() => setSubView('list')}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              <span>Kembali</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Main Editor Inputs */}
            <div className="lg:col-span-2 space-y-5">
              {/* Judul Berita */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Judul Berita / Nama Kegiatan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Seremoni Penyerahan Beasiswa Santri & Peresmian Sumur Bor Wakaf NTT..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-600 outline-none transition"
                />
              </div>

              {/* Ringkasan / Lead Paragraph */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Ringkasan / Lead Paragraph (Muncul di Beranda & Notifikasi)
                </label>
                <textarea
                  rows={2}
                  placeholder="Tulis ringkasan padat 1-2 kalimat mengenai inti acara atau pengumuman..."
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-600 outline-none transition"
                />
              </div>

              {/* Isi Lengkap Berita (Rich Text Area) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Isi Lengkap Berita & Liputan <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Mendukung Markdown & Heading (##, ###, &gt; kutipan)</span>
                </div>
                <textarea
                  rows={10}
                  placeholder="Tulis narasi berita lengkap di sini... Anda dapat menggunakan subjudul (## Judul), poin-poin (1., 2.), dan kutipan (> Pesan)."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-sans text-slate-800 focus:bg-white focus:border-emerald-600 outline-none transition leading-relaxed"
                />
              </div>

              {/* Lokasi & Tanggal Kegiatan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Lokasi Pelaksanaan Kegiatan
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Contoh: Bandung Barat / Kantor BWI Pusat"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-600 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tanggal Kegiatan
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Contoh: 24 Agustus 2026"
                      value={form.eventDate}
                      onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-600 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Tags Management */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Topik / Tag Berita
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Ketik tag (contoh: PenyaluranWakaf, BWI) lalu tekan Tambah..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-600 outline-none transition"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Tambah Tag
                  </button>
                </div>

                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {form.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-rose-600 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right 1 Col: Metadata, Cover, & Publishing Options */}
            <div className="space-y-5 bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80">
              {/* Category & Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Kategori Berita
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none cursor-pointer hover:border-slate-300 transition"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tipe Publikasi
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none cursor-pointer hover:border-slate-300 transition"
                >
                  <option value="kegiatan">Berita Kegiatan Lapangan</option>
                  <option value="siaran_pers">Siaran Pers Resmi</option>
                  <option value="pengumuman">Pengumuman Penting</option>
                  <option value="liputan_khusus">Liputan Khusus</option>
                </select>
              </div>

              {/* Penulis */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Penulis / Redaktur
                </label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-emerald-600 transition"
                />
              </div>

              {/* Headline / Pin Toggle */}
              <div className="pt-2 border-t border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.isPinned}
                    onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Pin className="w-3.5 h-3.5 text-amber-500 fill-current" />
                    <span>Jadikan Berita Utama / Pin ke Beranda</span>
                  </span>
                </label>
              </div>

              {/* Cover Image Selector */}
              <div className="pt-3 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Foto Utama / Cover Berita
                </label>

                {/* Preset Thumbnails */}
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  {PRESET_IMAGES.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setForm({ ...form, coverImage: img.url })}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                        form.coverImage === img.url
                          ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Custom URL Input */}
                <div className="relative">
                  <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Atau masukkan tautan URL gambar..."
                    value={form.coverImage}
                    onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              {/* Save & Publish Buttons */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <button
                  type="button"
                  onClick={() => handleSaveNews('published')}
                  className="w-full py-2.5 bg-[#1B5E20] hover:bg-[#154a19] text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingId ? 'Simpan & Publikasikan' : 'Terbitkan Berita Sekarang'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveNews('draft')}
                  className="w-full py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Simpan Sebagai Draft</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBVIEW: CATEGORIES MANAGEMENT --- */}
      {subView === 'categories' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Manajemen Kategori Berita & Informasi
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola kelompok topik untuk memudahkan pengarsipan liputan kegiatan dan pengumuman.
              </p>
            </div>

            <button
              onClick={() => setSubView('list')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Kembali ke Daftar
            </button>
          </div>

          {/* Add Category Form */}
          <div className="flex gap-2 max-w-lg">
            <input
              type="text"
              placeholder="Nama kategori baru (contoh: Beasiswa Santri, Kunjungan DPS)..."
              value={newCatInput}
              onChange={(e) => setNewCatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 outline-none transition"
            />
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-[#1B5E20] hover:bg-[#154a19] text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah</span>
            </button>
          </div>

          {/* Categories List Table */}
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {categories.map((cat, idx) => {
              const count = newsList.filter((n) => n.category === cat).length;
              const isEditing = editingCatIndex === idx;

              return (
                <div key={idx} className="p-3.5 flex items-center justify-between bg-white hover:bg-slate-50/70 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </div>

                    {isEditing ? (
                      <input
                        type="text"
                        value={editingCatText}
                        onChange={(e) => setEditingCatText(e.target.value)}
                        className="px-2.5 py-1 text-xs border border-emerald-500 rounded-lg outline-none font-semibold text-slate-800"
                        autoFocus
                      />
                    ) : (
                      <div>
                        <div className="text-xs font-bold text-slate-900">{cat}</div>
                        <div className="text-[10px] text-slate-400">{count} artikel berita terdaftar</div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleSaveEditCategory(idx)}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition cursor-pointer"
                        >
                          Simpan
                        </button>
                        <button
                          onClick={() => setEditingCatIndex(null)}
                          className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-300 transition cursor-pointer"
                        >
                          Batal
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingCatIndex(idx);
                            setEditingCatText(cat);
                          }}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg text-xs transition cursor-pointer"
                          title="Ubah Nama"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs transition cursor-pointer"
                          title="Hapus Kategori"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- SUBVIEW: STATISTIK & JANGKAUAN --- */}
      {subView === 'analytics' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Statistik & Jangkauan Informasi Publik
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Performa artikel berita, ketertarikan jamaah, dan engagement per kategori.
              </p>
            </div>

            <button
              onClick={() => setSubView('list')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Kembali ke Berita
            </button>
          </div>

          {/* Top News Ranking */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Berita Terpopuler Berdasarkan Pembaca
            </h3>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {newsList
                .sort((a, b) => b.viewsCount - a.viewsCount)
                .slice(0, 5)
                .map((n, i) => (
                  <div key={n.id} className="p-3.5 flex items-center justify-between bg-white hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center ${
                        i === 0 ? 'bg-amber-100 text-amber-800' : i === 1 ? 'bg-slate-200 text-slate-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        #{i + 1}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 line-clamp-1">{n.title}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{n.category}</span>
                          <span>•</span>
                          <span>{n.publishDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <span className="text-emerald-800 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{n.viewsCount.toLocaleString()}</span>
                      </span>
                      <span className="text-rose-600 flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        <span>{n.likesCount}</span>
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* --- READER PREVIEW MODAL --- */}
      {previewNews && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            {/* Modal Header Cover */}
            <div className="relative aspect-video sm:aspect-21/9 w-full bg-slate-900">
              <img
                src={previewNews.coverImage}
                alt={previewNews.title}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <button
                onClick={() => setPreviewNews(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-5 right-5 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-md text-[10px] font-bold">
                    {previewNews.category}
                  </span>
                  {previewNews.location && (
                    <span className="flex items-center gap-1 text-[11px] text-slate-200 bg-black/40 px-2 py-0.5 rounded-md">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>{previewNews.location}</span>
                    </span>
                  )}
                </div>
                <h1 className="text-lg sm:text-2xl font-black leading-snug">
                  {previewNews.title}
                </h1>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Metadata Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-slate-800">{previewNews.author}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{previewNews.publishDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLikeNews(previewNews.id)}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    <span>{previewNews.likesCount} Suka</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      showToast({
                        title: 'Tautan Disalin',
                        description: 'Link publik berita telah disalin ke clipboard.',
                        type: 'info',
                      });
                    }}
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                    title="Bagikan"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lead Summary */}
              {previewNews.summary && (
                <div className="p-4 bg-emerald-50/80 rounded-2xl border-l-4 border-emerald-600 text-emerald-950 font-medium text-xs sm:text-sm leading-relaxed">
                  {previewNews.summary}
                </div>
              )}

              {/* Main Content Body */}
              <div className="text-slate-800 text-xs sm:text-sm leading-relaxed space-y-4 font-sans whitespace-pre-line">
                {previewNews.content}
              </div>

              {/* Tags */}
              {previewNews.tags && previewNews.tags.length > 0 && (
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-500 mr-1">Topik:</span>
                  {previewNews.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-lg"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Comments Section */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  <span>Komentar & Apresiasi Publik ({previewNews.comments?.length || 0})</span>
                </h3>

                {/* Comment Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Tuliskan respon atau tanggapan resmi admin..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(previewNews.id)}
                    className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-600 outline-none transition"
                  />
                  <button
                    onClick={() => handleAddComment(previewNews.id)}
                    className="px-4 py-2 bg-[#1B5E20] hover:bg-[#154a19] text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim</span>
                  </button>
                </div>

                {/* Comments List */}
                <div className="space-y-2.5 mt-3">
                  {previewNews.comments && previewNews.comments.length > 0 ? (
                    previewNews.comments.map((comm) => (
                      <div key={comm.id} className="p-3 bg-slate-50 rounded-xl space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-800">{comm.authorName}</span>
                          <span className="text-slate-400">{comm.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{comm.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">Belum ada komentar untuk artikel ini.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
