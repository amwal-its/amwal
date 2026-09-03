'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  Video,
  Plus,
  Search,
  Filter,
  Heart,
  MessageSquare,
  HelpCircle,
  Upload,
  Link2,
  Trash2,
  Edit3,
  Eye,
  CheckCircle2,
  AlertCircle,
  Play,
  Share2,
  Clock,
  Tag,
  Check,
  Send,
  MoreVertical,
  ThumbsUp,
  Sparkles,
  Layers,
  FileText,
  GraduationCap,
  Award,
  ChevronRight,
  ExternalLink,
  Flame,
  BarChart3,
  Calendar,
  User,
  ShieldCheck,
  RefreshCw,
  X,
  Image as ImageIcon,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Minus,
  Undo2,
  Redo2,
  Eraser,
  Columns2,
  Printer,
  Type,
  Palette,
  Highlighter,
  CheckSquare,
  FileDown,
  Settings2,
  FolderPlus,
  SlidersHorizontal,
  Camera,
  FileCheck,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

// --- DATA TYPES ---
export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  points: number;
}

export interface DiscussionComment {
  id: string;
  authorName: string;
  authorRole: 'Jamaah' | 'Muzakki' | 'Wakif' | 'Admin' | 'Asatidz';
  avatarText: string;
  comment: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  status: 'approved' | 'pending' | 'flagged';
  videoTimestamp?: string; // e.g. "03:45"
  replies?: DiscussionComment[];
}

export interface ArticleItem {
  id: string;
  title: string;
  category: string;
  coverImage: string;
  content: string;
  summary: string;
  author: string;
  publishDate: string;
  status: 'published' | 'draft';
  likesCount: number;
  isLikedByUser?: boolean;
  viewsCount: number;
  readTime: string;
  quiz?: QuizQuestion[];
  discussions: DiscussionComment[];
}

export interface VideoItem {
  id: string;
  title: string;
  category: string;
  sourceType: 'upload' | 'link';
  videoUrl: string;
  thumbnailUrl: string;
  speaker: string;
  duration: string;
  description: string;
  publishDate: string;
  status: 'published' | 'draft';
  likesCount: number;
  isLikedByUser?: boolean;
  viewsCount: number;
  discussions: DiscussionComment[];
}

// --- INITIAL DUMMY DATA ---
const INITIAL_ARTICLES: ArticleItem[] = [
  {
    id: 'art-01',
    title: 'Memahami Fiqih Wakaf Uang (Cash Waqf) Sesuai Fatwa MUI & UU No. 41 Tahun 2004',
    category: 'Fiqih Wakaf',
    coverImage: 'https://images.unsplash.com/photo-1584281722572-8a9d3e8e19e0?w=800&auto=format&fit=crop&q=80',
    summary: 'Panduan lengkap mengenai hukum, syarat, dan tata kelola wakaf uang agar pokok wakaf tetap abadi dan manfaatnya mengalir berkelanjutan.',
    content: `Wakaf uang (Cash Waqf) adalah wakaf yang dilakukan seseorang, kelompok orang, lembaga atau badan hukum dalam bentuk uang tunai. Termasuk ke dalam pengertian uang adalah surat-surat berharga.

### Dasar Hukum & Fatwa MUI
Komisi Fatwa Majelis Ulama Indonesia (MUI) pada 11 Mei 2002 menetapkan fatwa bahwa:
1. Wakaf uang (cash waqf/waqf al-nuqud) hukumnya jawaz (boleh).
2. Wakaf uang hanya boleh disalurkan dan digunakan untuk hal-hal yang dibolehkan secara syar'i.
3. Nilai pokok wakaf uang harus dijamin kelestariannya, tidak boleh dijual, dihibahkan, dan/atau diwariskan.

### Mekanisme Pengelolaan oleh Nazhir
Nazhir yang mengelola wakaf uang wajib menginvestasikan dana tersebut pada instrumen keuangan syariah yang aman dan produktif (seperti Sukuk Negara / CWLS, deposito mudharabah, atau sektor riil syariah). Hasil surplus investasinya (mauquf alaih) disalurkan untuk pemberdayaan ummat, pendidikan, dan kesehatan.`,
    author: 'Dr. KH. M. Cholil Nafis, Lc., M.A.',
    publishDate: '20 Agustus 2026',
    status: 'published',
    likesCount: 142,
    isLikedByUser: false,
    viewsCount: 1890,
    readTime: '6 mnt',
    quiz: [
      {
        id: 'q-1',
        question: 'Apakah hukum asal wakaf uang menurut ketetapan fatwa MUI tahun 2002?',
        options: [
          { id: 'opt-a', text: 'Haram karena uang habis dipakai' },
          { id: 'opt-b', text: 'Jawaz (Boleh) asalkan nilai pokoknya dijaga kelestariannya' },
          { id: 'opt-c', text: 'Makruh tanzih' },
          { id: 'opt-d', text: 'Hanya boleh untuk lembaga pemerintah' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Fatwa MUI 2002 menyatakan wakaf uang adalah Jawaz (boleh) dengan syarat pokok uangnya tidak boleh berkurang atau hilang.',
        points: 25,
      },
      {
        id: 'q-2',
        question: 'Lembaga keuangan yang ditunjuk menteri untuk menerima setoran wakaf uang disebut?',
        options: [
          { id: 'opt-a', text: 'LKS-PWU (Lembaga Keuangan Syariah Penerima Wakaf Uang)' },
          { id: 'opt-b', text: 'Koperasi Simpan Pinjam' },
          { id: 'opt-c', text: 'Bursa Efek Indonesia' },
          { id: 'opt-d', text: 'Badan Amil Zakat Nasional' },
        ],
        correctOptionId: 'opt-a',
        explanation: 'Berdasarkan UU No 41/2004, penerimaan wakaf uang dilakukan melalui LKS-PWU yang terdaftar resmi di BWI dan Kemenag.',
        points: 25,
      },
    ],
    discussions: [
      {
        id: 'disc-1',
        authorName: 'H. Bambang Prasetyo',
        authorRole: 'Wakif',
        avatarText: 'BP',
        comment: 'Apakah wakaf uang yang disetorkan via platform Amwal ini langsung diterbitkan Sertifikat Wakaf Uang (SWU) resmi?',
        timestamp: 'Kemarin, 14:20 WIB',
        likes: 12,
        status: 'approved',
        replies: [
          {
            id: 'rep-1',
            authorName: 'Admin Syariah Amwal',
            authorRole: 'Admin',
            avatarText: 'AS',
            comment: 'Betul Bapak Bambang, untuk nominal wakaf uang mulai dari Rp 1.000.000 otomatis diterbitkan SWU digital dengan QR BWI resmi.',
            timestamp: 'Kemarin, 15:05 WIB',
            likes: 8,
            status: 'approved',
          },
        ],
      },
      {
        id: 'disc-2',
        authorName: 'Siti Aminah, S.E.',
        authorRole: 'Muzakki',
        avatarText: 'SA',
        comment: 'Sangat jelas penjelasannya! Semoga semakin banyak yang teredukasi tentang wakaf produktif.',
        timestamp: '2 hari lalu',
        likes: 5,
        status: 'approved',
      },
    ],
  },
  {
    id: 'art-02',
    title: 'Perhitungan Zakat Penghasilan & Maal: Standar Nisab Emas 85 Gram BAZNAS 2026',
    category: 'Zakat & Nisab',
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    summary: 'Rumus praktis menghitung kewajiban zakat maal dan zakat profesi bulanan dengan acuan harga emas murni terkini.',
    content: `Zakat Maal wajib dikeluarkan bagi setiap muslim yang hartanya telah mencapai nishab (senilai 85 gram emas murni) dan telah berlalu masa haulnya (1 tahun hijriyah/masehi).

### Formula Zakat Profesi:
- Pendapatan Bersih Bulanan ≥ (85 gram emas x Harga Terkini) ÷ 12
- Tarif Zakat = 2.5% x Pendapatan Bruto / Netto tanpa beban utang mendesak.

### 8 Golongan Asnaf Penyaluran:
Penyaluran zakat wajib ditujukan hanya untuk 8 Asnaf sebagaimana QS. At-Taubah ayat 60: Fakir, Miskin, Amil, Muallaf, Riqab, Gharimin, Fisabilillah, dan Ibnu Sabil.`,
    author: 'Tim Ahli Syariah BAZNAS RI',
    publishDate: '18 Agustus 2026',
    status: 'published',
    likesCount: 98,
    isLikedByUser: false,
    viewsCount: 1420,
    readTime: '5 mnt',
    quiz: [
      {
        id: 'q-2-1',
        question: 'Berapakah nisab minimal zakat maal yang disepakati jumhur ulama?',
        options: [
          { id: 'opt-a', text: '50 gram perak' },
          { id: 'opt-b', text: '85 gram emas murni' },
          { id: 'opt-c', text: '100 gram emas' },
          { id: 'opt-d', text: '10 ekor kambing' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Nisab zakat harta emas dan perniagaan adalah setara dengan 85 gram emas murni (20 dinar).',
        points: 25,
      },
    ],
    discussions: [
      {
        id: 'disc-3',
        authorName: 'Rudi Hartono',
        authorRole: 'Muzakki',
        avatarText: 'RH',
        comment: 'Apakah bonus tahunan dan THR wajib digabungkan dalam hitungan zakat penghasilan bulan berjalan?',
        timestamp: '3 hari lalu',
        likes: 7,
        status: 'approved',
        replies: [
          {
            id: 'rep-2',
            authorName: 'Ustadz Ridwan (DPS)',
            authorRole: 'Asatidz',
            avatarText: 'UR',
            comment: 'Afwan Akhi Rudi, betul. Setiap pemasukan tambahan (mal mustafad) pada saat diterima langsung dihitung zakatnya 2.5% jika total pendapatan bulan tersebut di atas nisab.',
            timestamp: '3 hari lalu',
            likes: 6,
            status: 'approved',
          },
        ],
      },
    ],
  },
  {
    id: 'art-03',
    title: 'Tata Cara & Syarat Sah Patungan Hewan Qurban Sapi 1/7 dalam Fiqh Syafi’i',
    category: 'Qurban & Fiqh Hewan',
    coverImage: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80',
    summary: 'Kajian fiqh seputar batas maksimal 7 shohibul untuk satu ekor sapi, penegasan akad wakalah, dan distribusi daging.',
    content: `Menurut Mazhab Syafi'i, satu ekor sapi atau unta mencukupi untuk kurban 7 orang shohibul, baik mereka satu keluarga maupun dari keluarga yang berbeda-beda.

### Syarat Penting Patungan 1/7:
1. Tidak boleh melebihi 7 orang peserta dalam satu ekor sapi.
2. Niat masing-masing peserta harus untuk taqarrub kepada Allah (ibadah qurban atau aqiqah).
3. Pembagian daging kurban qurban tathawwu' (sunnah) disunnahkan sepertiga untuk shohibul, sepertiga dihadiahkan, dan sepertiga disedekahkan kepada fakir miskin.`,
    author: 'Divisi Edukasi Juleha & Fiqh Qurban',
    publishDate: '15 Agustus 2026',
    status: 'published',
    likesCount: 176,
    isLikedByUser: true,
    viewsCount: 2310,
    readTime: '4 mnt',
    quiz: [],
    discussions: [],
  },
];

const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid-01',
    title: 'Masterclass: Roadmap Transformasi Nazhir Tradisional Menuju Nazhir Produktif Era Digital',
    category: 'Webinar Wakaf',
    sourceType: 'link',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    speaker: 'Prof. Dr. Ir. KH. Mohammad Nuh, DEA (Ketua BWI)',
    duration: '45:20',
    description: 'Kupas tuntas tata kelola aset wakaf bernilai tinggi, integrasi crowdfunding, dan instrumen Cash Waqf Linked Sukuk (CWLS).',
    publishDate: '21 Agustus 2026',
    status: 'published',
    likesCount: 310,
    isLikedByUser: false,
    viewsCount: 4250,
    discussions: [
      {
        id: 'vdisc-1',
        authorName: 'Deni Setiawan (Nazhir Al-Hikmah)',
        authorRole: 'Wakif',
        avatarText: 'DS',
        videoTimestamp: '12:40',
        comment: 'Pada menit 12:40 sangat mencerahkan terkait legalitas sertifikasi kompetensi nazhir BNSP!',
        timestamp: '1 hari lalu',
        likes: 15,
        status: 'approved',
      },
      {
        id: 'vdisc-2',
        authorName: 'Ustadzah Maryam Lc.',
        authorRole: 'Asatidz',
        avatarText: 'UM',
        videoTimestamp: '28:15',
        comment: 'Perlu diperhatikan juga mitigasi risiko portofolio wakaf di sektor pertanian.',
        timestamp: '2 hari lalu',
        likes: 9,
        status: 'approved',
      },
    ],
  },
  {
    id: 'vid-02',
    title: 'Tutorial & Simulasi Praktis: Penyelenggaraan Penyembelihan Halal Qurban di RPH Modern',
    category: 'Panduan Praktis',
    sourceType: 'upload',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80',
    speaker: 'Ustadz Juleha Indonesia & drh. Syarif Hidayat',
    duration: '18:35',
    description: 'Panduan visual pemeriksaan antemortem, penegakan syariat halal, dan penanganan higienis daging qurban.',
    publishDate: '17 Agustus 2026',
    status: 'published',
    likesCount: 220,
    isLikedByUser: true,
    viewsCount: 3180,
    discussions: [],
  },
  {
    id: 'vid-03',
    title: 'Kajian Fiqih Zakat: Cara Audit Kepatuhan 8 Asnaf Menggunakan PSAK 109',
    category: 'Kajian Fiqih',
    sourceType: 'link',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
    speaker: 'Dr. H. Anwar Abbas, M.M., M.Ag.',
    duration: '32:10',
    description: 'Strategi pembukuan akuntansi zakat dan pencegahan pelanggaran alokasi hak amil (maks 12.5%).',
    publishDate: '12 Agustus 2026',
    status: 'published',
    likesCount: 185,
    isLikedByUser: false,
    viewsCount: 2450,
    discussions: [],
  },
];

// --- HELPER RENDERING RICH FORMATTING & ISLAMIC CALLOUTS ---
function renderInlineFormatting(text: string): React.ReactNode {
  if (!text) return text;
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*|<u>.*?<\/u>|~~.*?~~|`.*?`|\[.*?\]\(.*?\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-bold text-slate-900">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="italic text-slate-800">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('<u>') && token.endsWith('</u>')) {
      parts.push(
        <u key={match.index} className="underline decoration-slate-400 underline-offset-2">
          {token.slice(3, -4)}
        </u>
      );
    } else if (token.startsWith('~~') && token.endsWith('~~')) {
      parts.push(
        <s key={match.index} className="line-through text-slate-400">
          {token.slice(2, -2)}
        </s>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded bg-emerald-50 text-[#1B5E20] font-mono text-[11px] font-semibold border border-emerald-200"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('[') && token.includes('](')) {
      const linkMatch = token.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        parts.push(
          <a
            key={match.index}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1B5E20] font-bold underline hover:text-[#144716] inline-flex items-center gap-0.5"
          >
            {linkMatch[1]}
            <ExternalLink className="w-3 h-3 inline ml-0.5" />
          </a>
        );
      } else {
        parts.push(token);
      }
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

// Convert legacy markdown / text to rich Google Docs HTML
function convertContentToDocHtml(raw: string): string {
  if (!raw) return '<p>Mulai ketik materi edukasi fiqih, rujukan hadits, dan panduan syariah di sini...</p>';
  
  // If already rich HTML with tags, return
  if (/<(p|h1|h2|h3|div|blockquote|ul|ol|table|hr)[^>]*>/i.test(raw)) {
    return raw;
  }

  // Convert legacy markdown lines
  const paragraphs = raw.split(/\n\s*\n/);
  return paragraphs
    .map((para) => {
      const trimmed = para.trim();
      if (!trimmed) return '';
      if (trimmed === '---' || trimmed === '***') {
        return '<hr class="my-6 border-slate-200" />';
      }
      if (trimmed.startsWith('# ')) {
        return `<h1 class="text-xl sm:text-2xl font-black text-slate-900 mt-4 mb-2">${trimmed.replace(/^#\s+/, '')}</h1>`;
      }
      if (trimmed.startsWith('## ')) {
        return `<h2 class="text-lg sm:text-xl font-bold text-slate-900 mt-3 mb-2">${trimmed.replace(/^##\s+/, '')}</h2>`;
      }
      if (trimmed.startsWith('### ')) {
        return `<h3 class="text-base font-bold text-slate-800 mt-2 mb-1">${trimmed.replace(/^###\s+/, '')}</h3>`;
      }
      if (trimmed.startsWith('> 🕋') || trimmed.startsWith('> 📜') || (trimmed.toLowerCase().includes('dalil') && trimmed.startsWith('>'))) {
        const text = trimmed.replace(/^>\s?/gm, '').replace(/\n/g, '<br/>');
        return `<div class="my-4 p-4 bg-emerald-50/90 border-l-4 border-[#1B5E20] rounded-r-2xl text-emerald-950 text-xs sm:text-sm font-medium shadow-2xs space-y-1"><div class="font-bold text-[#1B5E20] text-xs">🕋 Rujukan Fiqih &amp; Dalil Syariah</div><p class="italic">${text}</p></div>`;
      }
      if (trimmed.startsWith('>')) {
        const text = trimmed.replace(/^>\s?/gm, '').replace(/\n/g, '<br/>');
        return `<blockquote class="my-3 pl-4 border-l-3 border-amber-400 italic text-slate-700 bg-amber-50/40 p-3 rounded-r-xl text-xs sm:text-sm">${text}</blockquote>`;
      }
      
      const lines = trimmed.split('\n');
      const isBullet = lines.every((l) => /^[-*•]\s+/.test(l.trim()) || l.trim() === '');
      if (isBullet) {
        const items = lines.filter((l) => l.trim()).map((l) => `<li>${l.trim().replace(/^[-*•]\s+/, '')}</li>`).join('');
        return `<ul class="list-disc pl-5 space-y-1 my-2 text-slate-800 text-xs sm:text-sm">${items}</ul>`;
      }

      const isNumbered = lines.every((l) => /^\d+\.\s+/.test(l.trim()) || l.trim() === '');
      if (isNumbered) {
        const items = lines.filter((l) => l.trim()).map((l) => `<li>${l.trim().replace(/^\d+\.\s+/, '')}</li>`).join('');
        return `<ol class="list-decimal pl-5 space-y-1 my-2 text-slate-800 text-xs sm:text-sm">${items}</ol>`;
      }

      // Convert inline markdown in regular paragraph
      let htmlPara = trimmed
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/~~(.*?)~~/g, '<s>$1</s>')
        .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-emerald-50 text-[#1B5E20] font-mono text-[11px] font-semibold border border-emerald-200">$1</code>')
        .replace(/\n/g, '<br/>');

      return `<p class="my-2 leading-relaxed text-xs sm:text-sm text-slate-800">${htmlPara}</p>`;
    })
    .filter(Boolean)
    .join('\n');
}

function renderRichArticleContent(content: string, defaultAlign: string = 'text-left') {
  if (!content) return <p className="text-slate-400 italic text-xs">Belum ada konten tulisan.</p>;

  // If content contains rich HTML tags from Google Docs editor, render directly with clean paper styling
  if (/<(p|h1|h2|h3|div|blockquote|ul|ol|table|hr|span|strong|em|u|s)[^>]*>/i.test(content)) {
    return (
      <div
        className={`google-docs-content space-y-3 leading-relaxed text-slate-800 ${defaultAlign}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Split by double newlines or blank lines for fallback plain text / markdown
  const paragraphs = content.split(/\n\s*\n/);

  return (
    <div className={`space-y-4 ${defaultAlign}`}>
      {paragraphs.map((para, pIdx) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        if (trimmed === '---' || trimmed === '***') {
          return <hr key={pIdx} className="my-6 border-slate-200" />;
        }

        // Check alignment wraps like <div align="center">...</div> or <p align="right">
        let alignClass = '';
        let cleanText = trimmed;
        if (/^<div align="center">/i.test(trimmed) || /^<center>/i.test(trimmed) || /^<p align="center">/i.test(trimmed)) {
          alignClass = 'text-center';
          cleanText = trimmed.replace(/<\/?(div|p|center)[^>]*>/gi, '').trim();
        } else if (/^<div align="right">/i.test(trimmed) || /^<p align="right">/i.test(trimmed)) {
          alignClass = 'text-right';
          cleanText = trimmed.replace(/<\/?(div|p)[^>]*>/gi, '').trim();
        } else if (/^<div align="justify">/i.test(trimmed) || /^<p align="justify">/i.test(trimmed)) {
          alignClass = 'text-justify';
          cleanText = trimmed.replace(/<\/?(div|p)[^>]*>/gi, '').trim();
        } else if (/^<div align="left">/i.test(trimmed) || /^<p align="left">/i.test(trimmed)) {
          alignClass = 'text-left';
          cleanText = trimmed.replace(/<\/?(div|p)[^>]*>/gi, '').trim();
        }

        // Heading 1
        if (cleanText.startsWith('# ')) {
          return (
            <h1 key={pIdx} className={`text-xl sm:text-2xl font-black text-slate-900 tracking-tight pt-2 ${alignClass}`}>
              {renderInlineFormatting(cleanText.replace(/^#\s+/, ''))}
            </h1>
          );
        }

        // Heading 2
        if (cleanText.startsWith('## ')) {
          return (
            <h2 key={pIdx} className={`text-lg sm:text-xl font-bold text-slate-900 tracking-tight pt-1.5 ${alignClass}`}>
              {renderInlineFormatting(cleanText.replace(/^##\s+/, ''))}
            </h2>
          );
        }

        // Heading 3
        if (cleanText.startsWith('### ')) {
          return (
            <h3 key={pIdx} className={`text-base font-bold text-slate-800 pt-1 ${alignClass}`}>
              {renderInlineFormatting(cleanText.replace(/^###\s+/, ''))}
            </h3>
          );
        }

        // Dalil / Islamic Blockquote
        if (cleanText.startsWith('> 🕋') || cleanText.startsWith('> 📜') || (cleanText.toLowerCase().includes('dalil') && cleanText.startsWith('>'))) {
          const quoteLines = cleanText.split('\n').map((l) => l.replace(/^>\s?/, ''));
          return (
            <div key={pIdx} className="my-3 p-4 bg-emerald-50/90 border-l-4 border-[#1B5E20] rounded-r-2xl text-emerald-950 text-xs sm:text-sm font-medium shadow-2xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B5E20]">
                <BookOpen className="w-4 h-4" />
                <span>Rujukan Fiqih & Dalil Syariah</span>
              </div>
              <div className="italic leading-relaxed space-y-1">
                {quoteLines.map((line, lIdx) => (
                  <p key={lIdx} className={alignClass}>{renderInlineFormatting(line)}</p>
                ))}
              </div>
            </div>
          );
        }

        // Standard Blockquote
        if (cleanText.startsWith('>')) {
          const quoteLines = cleanText.split('\n').map((l) => l.replace(/^>\s?/, ''));
          return (
            <blockquote key={pIdx} className={`my-3 pl-4 border-l-3 border-amber-400 italic text-slate-700 bg-amber-50/40 p-3 rounded-r-xl text-xs sm:text-sm ${alignClass}`}>
              {quoteLines.map((line, lIdx) => (
                <p key={lIdx}>{renderInlineFormatting(line)}</p>
              ))}
            </blockquote>
          );
        }

        // Lines analysis for lists
        const lines = cleanText.split('\n');
        const isBulletList = lines.every((l) => /^[-*•]\s+/.test(l.trim()) || l.trim() === '');
        const isNumberedList = lines.every((l) => /^\d+\.\s+/.test(l.trim()) || l.trim() === '');

        if (isBulletList && lines.some((l) => l.trim() !== '')) {
          return (
            <ul key={pIdx} className={`space-y-1.5 my-2 list-none pl-1 ${alignClass}`}>
              {lines.map((l, lIdx) => {
                if (!l.trim()) return null;
                const itemText = l.trim().replace(/^[-*•]\s+/, '');
                return (
                  <li key={lIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E20] mt-2 shrink-0"></span>
                    <span className="leading-relaxed">{renderInlineFormatting(itemText)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        if (isNumberedList && lines.some((l) => l.trim() !== '')) {
          return (
            <ol key={pIdx} className={`space-y-1.5 my-2 list-none pl-1 ${alignClass}`}>
              {lines.map((l, lIdx) => {
                if (!l.trim()) return null;
                const match = l.trim().match(/^(\d+)\.\s+(.*)$/);
                const num = match ? match[1] : (lIdx + 1).toString();
                const itemText = match ? match[2] : l.trim();
                return (
                  <li key={lIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800">
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[#1B5E20] font-mono text-[11px] font-bold shrink-0">
                      {num}
                    </span>
                    <span className="leading-relaxed">{renderInlineFormatting(itemText)}</span>
                  </li>
                );
              })}
            </ol>
          );
        }

        // Regular Paragraph
        return (
          <p key={pIdx} className={`text-xs sm:text-sm text-slate-800 leading-relaxed ${alignClass}`}>
            {lines.map((l, lIdx) => (
              <React.Fragment key={lIdx}>
                {renderInlineFormatting(l)}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

// --- MINIMALIST WYSIWYG ARTICLE EDITOR COMPONENT ---
interface MinimalArticleEditorProps {
  value: string;
  onChange: (htmlContent: string) => void;
  title?: string;
}

function MinimalArticleEditor({ value, onChange }: MinimalArticleEditorProps) {
  const { showToast } = useToast();
  const editorRef = useRef<HTMLDivElement | null>(null);

  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');
  const [currentStyle, setCurrentStyle] = useState<string>('p');
  const [activeAlign, setActiveAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [showSyariahMenu, setShowSyariahMenu] = useState<boolean>(false);
  
  // History for Undo / Redo
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const isUpdatingRef = useRef<boolean>(false);
  const lastSyncedValueRef = useRef<string | null>(null);

  // Initialize editor content or sync when external value changes
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      if (lastSyncedValueRef.current !== value) {
        lastSyncedValueRef.current = value;
        const initialHtml = convertContentToDocHtml(value);
        if (editorRef.current.innerHTML !== initialHtml) {
          editorRef.current.innerHTML = initialHtml;
        }
        setHistory((prev) => (prev.length === 0 ? [initialHtml] : prev));
        setHistoryIndex((prev) => (prev === -1 ? 0 : prev));
      }
    }
  }, [value]);

  // Sync internal innerHTML back to parent
  const handleContentInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    isUpdatingRef.current = true;
    lastSyncedValueRef.current = html;
    onChange(html);

    // Save history
    setHistory((prev) => {
      const newHist = prev.slice(0, Math.max(0, historyIndex + 1));
      newHist.push(html);
      if (newHist.length > 40) newHist.shift();
      return newHist;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 39));

    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 50);
  };

  const executeCommand = (command: string, arg?: string) => {
    if (editorMode === 'preview') setEditorMode('edit');
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      editorRef.current.focus();
      handleContentInput();
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0 && editorRef.current) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      editorRef.current.innerHTML = prev;
      onChange(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1 && editorRef.current) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      editorRef.current.innerHTML = next;
      onChange(next);
    }
  };

  const handleFormatStyle = (tag: string) => {
    setCurrentStyle(tag);
    if (tag === 'p') {
      executeCommand('formatBlock', '<p>');
    } else if (tag === 'h1') {
      executeCommand('formatBlock', '<h1>');
    } else if (tag === 'h2') {
      executeCommand('formatBlock', '<h2>');
    } else if (tag === 'h3') {
      executeCommand('formatBlock', '<h3>');
    } else if (tag === 'blockquote') {
      executeCommand('formatBlock', '<blockquote>');
    }
  };

  const handleAlignment = (align: 'left' | 'center' | 'right' | 'justify') => {
    setActiveAlign(align);
    if (align === 'left') executeCommand('justifyLeft');
    else if (align === 'center') executeCommand('justifyCenter');
    else if (align === 'right') executeCommand('justifyRight');
    else if (align === 'justify') executeCommand('justifyFull');
  };

  const insertCustomHtmlBlock = (htmlBlock: string, notificationTitle: string) => {
    if (editorMode === 'preview') setEditorMode('edit');
    executeCommand('insertHTML', htmlBlock);
    setShowSyariahMenu(false);
    showToast({
      title: notificationTitle,
      description: 'Format materi syariah berhasil disisipkan.',
      type: 'success',
    });
  };

  const handleInsertLink = () => {
    const url = prompt('Masukkan tautan URL (contoh: https://bwi.go.id):');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const handleClearFormat = () => {
    executeCommand('removeFormat');
  };

  // Stats calculation
  const rawText = value ? value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
  const charCount = rawText.length;
  const wordCount = rawText ? rawText.split(/\s+/).length : 0;
  const readTimeEst = Math.max(1, Math.ceil((wordCount || 1) / 180));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs transition focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/10">
      {/* 1. MINIMALIST SINGLE-ROW TOOLBAR */}
      <div className="p-2 sm:p-2.5 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-slate-700 select-none">
        <div className="flex flex-wrap items-center gap-1">
          {/* Undo & Redo */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-1.5 hover:bg-white hover:shadow-xs disabled:opacity-30 rounded-lg text-slate-600 transition cursor-pointer"
            title="Urungkan (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 hover:bg-white hover:shadow-xs disabled:opacity-30 rounded-lg text-slate-600 transition cursor-pointer"
            title="Ulangi (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* Style Selector */}
          <select
            value={currentStyle}
            onChange={(e) => handleFormatStyle(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 outline-none cursor-pointer hover:border-slate-300 transition"
          >
            <option value="p">Teks Normal</option>
            <option value="h1">Judul Bab (H1)</option>
            <option value="h2">Sub-Bab (H2)</option>
            <option value="h3">Poin Bahasan (H3)</option>
            <option value="blockquote">Kutipan / Quote</option>
          </select>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* Inline Formatting: Bold, Italic, Underline, Strike */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => executeCommand('bold')}
              className="p-1.5 hover:bg-white hover:shadow-xs rounded-lg text-slate-800 transition cursor-pointer font-bold"
              title="Tebal (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('italic')}
              className="p-1.5 hover:bg-white hover:shadow-xs rounded-lg text-slate-800 transition cursor-pointer italic"
              title="Miring (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('underline')}
              className="p-1.5 hover:bg-white hover:shadow-xs rounded-lg text-slate-800 transition cursor-pointer"
              title="Garis Bawah (Ctrl+U)"
            >
              <Underline className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('strikeThrough')}
              className="p-1.5 hover:bg-white hover:shadow-xs rounded-lg text-slate-800 transition cursor-pointer"
              title="Coretan"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* Alignment */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => handleAlignment('left')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                activeAlign === 'left' ? 'bg-white text-[#1B5E20] shadow-xs font-bold' : 'text-slate-600 hover:bg-white'
              }`}
              title="Rata Kiri"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleAlignment('center')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                activeAlign === 'center' ? 'bg-white text-[#1B5E20] shadow-xs font-bold' : 'text-slate-600 hover:bg-white'
              }`}
              title="Rata Tengah"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleAlignment('right')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                activeAlign === 'right' ? 'bg-white text-[#1B5E20] shadow-xs font-bold' : 'text-slate-600 hover:bg-white'
              }`}
              title="Rata Kanan"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleAlignment('justify')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                activeAlign === 'justify' ? 'bg-white text-[#1B5E20] shadow-xs font-bold' : 'text-slate-600 hover:bg-white'
              }`}
              title="Rata Justify"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* Lists & Link */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => executeCommand('insertUnorderedList')}
              className="p-1.5 hover:bg-white hover:shadow-xs rounded-lg text-slate-700 transition cursor-pointer"
              title="Daftar Butir (• List)"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('insertOrderedList')}
              className="p-1.5 hover:bg-white hover:shadow-xs rounded-lg text-slate-700 transition cursor-pointer"
              title="Daftar Angka (1, 2, 3)"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleInsertLink}
              className="p-1.5 hover:bg-white hover:shadow-xs rounded-lg text-slate-700 transition cursor-pointer"
              title="Sisipkan Tautan Web"
            >
              <Link2 className="w-4 h-4" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* Syariah Quick Preset Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSyariahMenu(!showSyariahMenu)}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[#1B5E20] rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="Sisipkan Format Dalil & Catatan Fiqih"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Dalil Fiqih</span>
            </button>

            {showSyariahMenu && (
              <div className="absolute top-8 left-0 z-30 w-72 bg-white border border-slate-200 rounded-xl p-1.5 shadow-xl space-y-1 animate-in fade-in zoom-in-95 text-xs text-slate-800">
                <button
                  type="button"
                  onClick={() =>
                    insertCustomHtmlBlock(
                      `<div class="my-4 p-4 bg-emerald-50/90 border-l-4 border-[#1B5E20] rounded-r-xl text-emerald-950 not-italic space-y-1"><div class="flex items-center gap-1.5 font-bold text-[#1B5E20] text-xs"><span>🕋 Rujukan Fiqih &amp; Dalil Syariah</span></div><p class="italic text-xs sm:text-sm text-slate-800 leading-relaxed">"Perumpamaan orang yang menafkahkan hartanya di jalan Allah adalah serupa dengan sebutir benih..." (QS. Al-Baqarah: 261)</p></div><p><br></p>`,
                      'Kotak Dalil Syariah'
                    )
                  }
                  className="w-full text-left p-2 hover:bg-emerald-50 rounded-lg flex items-center gap-2.5 transition cursor-pointer"
                >
                  <span className="p-1.5 bg-emerald-100 text-[#1B5E20] rounded-md">🕋</span>
                  <div>
                    <div className="font-bold text-slate-900">Kotak Dalil Al-Qur&apos;an / Hadits</div>
                    <div className="text-[10px] text-slate-500">Kutipan ayat &amp; hadits sahih berlatar hijau</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    insertCustomHtmlBlock(
                      `<div class="my-4 p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-950 space-y-1"><div class="font-bold text-xs text-amber-900">📜 Rujukan Fatwa &amp; Regulasi</div><p class="text-xs text-slate-700">1. Fatwa DSN-MUI No. XX/DSN-MUI/2026<br/>2. Peraturan BWI No. 01 Tahun 2020 tentang Nazhir Profesional.</p></div><p><br></p>`,
                      'Rujukan Fatwa'
                    )
                  }
                  className="w-full text-left p-2 hover:bg-amber-50 rounded-lg flex items-center gap-2.5 transition cursor-pointer"
                >
                  <span className="p-1.5 bg-amber-100 text-amber-800 rounded-md">📜</span>
                  <div>
                    <div className="font-bold text-slate-900">Fatwa DSN-MUI & Regulasi BWI</div>
                    <div className="text-[10px] text-slate-500">Box dasar hukum formal dan nomor fatwa</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    insertCustomHtmlBlock(
                      `<div class="my-4 p-3.5 bg-blue-50/90 border-l-4 border-blue-600 rounded-r-xl text-blue-950 space-y-1"><div class="font-bold text-xs text-blue-900">💡 Catatan Penting Nazhir / Amil</div><p class="text-xs text-slate-700 leading-relaxed">Pastikan akad wakalah ditegakkan secara transparan dan alokasi hak operasional amil tidak melampaui batas syar'i 12.5%.</p></div><p><br></p>`,
                      'Catatan Nazhir'
                    )
                  }
                  className="w-full text-left p-2 hover:bg-blue-50 rounded-lg flex items-center gap-2.5 transition cursor-pointer"
                >
                  <span className="p-1.5 bg-blue-100 text-blue-800 rounded-md">💡</span>
                  <div>
                    <div className="font-bold text-slate-900">Catatan Nazhir / Amil</div>
                    <div className="text-[10px] text-slate-500">Peringatan kepatuhan & transparansi</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    insertCustomHtmlBlock(
                      `<hr class="my-5 border-slate-200" /><p><br></p>`,
                      'Garis Pembatas'
                    )
                  }
                  className="w-full text-left p-2 hover:bg-slate-100 rounded-lg flex items-center gap-2.5 transition cursor-pointer"
                >
                  <span className="p-1.5 bg-slate-100 text-slate-700 rounded-md">➖</span>
                  <div>
                    <div className="font-bold text-slate-900">Garis Pembatas (Divider)</div>
                    <div className="text-[10px] text-slate-500">Pemisah bagian bab</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleClearFormat}
            className="p-1.5 hover:bg-white hover:text-rose-600 rounded-lg text-slate-500 transition cursor-pointer ml-0.5"
            title="Bersihkan Format Teks"
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>

        {/* Right side: Mode Switch (Tulis / Pratinjau) & Counter */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span>{wordCount} kata</span>
            <span>•</span>
            <span>~{readTimeEst} mnt</span>
          </div>

          <div className="inline-flex p-0.5 bg-slate-200/80 rounded-lg">
            <button
              type="button"
              onClick={() => setEditorMode('edit')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                editorMode === 'edit'
                  ? 'bg-white text-[#1B5E20] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Tulis</span>
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('preview')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                editorMode === 'preview'
                  ? 'bg-white text-[#1B5E20] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pratinjau</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MINIMALIST WRITING CANVAS */}
      <div className="min-h-[300px] p-5 sm:p-7 bg-white">
        {editorMode === 'edit' ? (
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleContentInput}
            className="outline-none min-h-[260px] text-sm sm:text-base leading-relaxed text-slate-800 space-y-3 font-sans"
          />
        ) : (
          <div className="min-h-[260px] text-sm sm:text-base leading-relaxed text-slate-800 space-y-3 font-sans">
            {renderRichArticleContent(value)}
          </div>
        )}
      </div>

      {/* 3. MINIMAL FOOTER BAR */}
      <div className="px-5 py-2 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Editor Aktif • Tersinkronisasi Otomatis</span>
        </span>
        <span className="font-mono">{charCount} karakter</span>
      </div>
    </div>
  );
}

export function EducationManagementView() {
  const { showToast } = useToast();

  // Primary Active Tab: 'articles' | 'videos'
  const [mainTab, setMainTab] = useState<'articles' | 'videos'>('articles');

  // Sub Views for Articles: 'list' | 'create' | 'quiz_manager' | 'discussion' | 'analytics'
  const [articleSubView, setArticleSubView] = useState<'list' | 'create' | 'quiz_manager' | 'discussion'>('list');

  // Sub Views for Videos: 'list' | 'upload_file' | 'upload_link' | 'discussion'
  const [videoSubView, setVideoSubView] = useState<'list' | 'upload_file' | 'upload_link' | 'discussion'>('list');

  // Articles & Videos State
  const [articles, setArticles] = useState<ArticleItem[]>(INITIAL_ARTICLES);
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);

  // Selected item for Quiz / Discussion / Preview
  const [selectedArticleId, setSelectedArticleId] = useState<string>(INITIAL_ARTICLES[0].id);
  const [selectedVideoId, setSelectedVideoId] = useState<string>(INITIAL_VIDEOS[0].id);
  const [previewArticle, setPreviewArticle] = useState<ArticleItem | null>(null);
  const [previewVideo, setPreviewVideo] = useState<VideoItem | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Dynamic Category Management (Admin can add, edit, and delete categories)
  const [articleCategories, setArticleCategories] = useState<string[]>([
    'Fiqih Wakaf',
    'Zakat & Nisab',
    'Infaq & Sedekah',
    'Qurban & Fiqh Hewan',
    'Literasi Syariah',
  ]);
  const [videoCategories, setVideoCategories] = useState<string[]>([
    'Kajian Fiqih',
    'Panduan Praktis',
    'Webinar Wakaf',
    'Tutorial Amil',
    'Kisah Inspiratif',
  ]);

  // Modal Category Management State
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [categoryModalTab, setCategoryModalTab] = useState<'articles' | 'videos'>('articles');
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  const [editingCategoryText, setEditingCategoryText] = useState<string>('');

  // Inline Quick Add Category State
  const [showInlineAddCategory, setShowInlineAddCategory] = useState<'article' | 'video_file' | 'video_link' | null>(null);
  const [inlineCategoryInput, setInlineCategoryInput] = useState('');

  // Form State: Create Article
  const [articleImageSource, setArticleImageSource] = useState<'upload' | 'link'>('upload');
  const [uploadedImageFileName, setUploadedImageFileName] = useState<string>('');
  const [articleForm, setArticleForm] = useState<{
    title: string;
    category: string;
    coverImage: string;
    summary: string;
    content: string;
    author: string;
    status: 'published' | 'draft';
    quiz: QuizQuestion[];
  }>({
    title: '',
    category: 'Fiqih Wakaf',
    coverImage: 'https://images.unsplash.com/photo-1584281722572-8a9d3e8e19e0?w=800&auto=format&fit=crop&q=80',
    summary: '',
    content: '',
    author: 'Super Admin Edukasi Amwal',
    status: 'published',
    quiz: [],
  });

  // Quiz Builder within Article Creation Form
  const [showArticleQuizBuilder, setShowArticleQuizBuilder] = useState(false);
  const [articleQuizQuestion, setArticleQuizQuestion] = useState('');
  const [articleQuizOptions, setArticleQuizOptions] = useState<string[]>(['', '', '', '']);
  const [articleQuizCorrectIndex, setArticleQuizCorrectIndex] = useState<number>(0);
  const [articleQuizExplanation, setArticleQuizExplanation] = useState('');
  const [articleQuizPoints, setArticleQuizPoints] = useState<number>(25);
  const [editingArticleQuizIndex, setEditingArticleQuizIndex] = useState<number | null>(null);

  // Rich Text Editor State & History
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [editorMode, setEditorMode] = useState<'edit' | 'preview' | 'split'>('edit');
  const [editorAlign, setEditorAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [history, setHistory] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const updateArticleContent = (newContent: string) => {
    setArticleForm((prev) => ({ ...prev, content: newContent }));
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(newContent);
    if (newHist.length > 30) newHist.shift();
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevContent = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setArticleForm((prev) => ({ ...prev, content: prevContent }));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextContent = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setArticleForm((prev) => ({ ...prev, content: nextContent }));
    }
  };

  const insertFormatting = (prefix: string, suffix: string = '', defaultPlaceholder: string = 'teks') => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const currentVal = articleForm.content;
    const selected = currentVal.substring(start, end);
    const replacement = selected ? `${prefix}${selected}${suffix}` : `${prefix}${defaultPlaceholder}${suffix}`;
    const newVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);

    updateArticleContent(newVal);

    setTimeout(() => {
      el.focus();
      if (selected) {
        el.setSelectionRange(start + prefix.length, end + prefix.length);
      } else {
        el.setSelectionRange(start + prefix.length, start + prefix.length + defaultPlaceholder.length);
      }
    }, 0);
  };

  const insertLinePrefix = (prefix: string, defaultLine: string = 'Poin Pembahasan') => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const currentVal = articleForm.content;
    const selected = currentVal.substring(start, end);

    if (!selected) {
      const isStartOfLine = start === 0 || currentVal[start - 1] === '\n';
      const insertText = (isStartOfLine ? '' : '\n') + `${prefix}${defaultLine}`;
      const newVal = currentVal.substring(0, start) + insertText + currentVal.substring(end);
      updateArticleContent(newVal);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start + insertText.length, start + insertText.length);
      }, 0);
      return;
    }

    const lines = selected.split('\n');
    const modifiedLines = lines.map((line, idx) => {
      if (prefix === '1. ') {
        return `${idx + 1}. ${line.replace(/^(\d+\.|\*|-|•)\s+/, '')}`;
      }
      return `${prefix}${line.replace(/^(\d+\.|\*|-|•)\s+/, '')}`;
    });
    const replacement = modifiedLines.join('\n');
    const newVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);
    updateArticleContent(newVal);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start, start + replacement.length);
    }, 0);
  };

  const handleApplyAlignment = (align: 'left' | 'center' | 'right' | 'justify') => {
    setEditorAlign(align);
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const currentVal = articleForm.content;
    const selected = currentVal.substring(start, end);

    if (selected) {
      const cleanSelected = selected.replace(/<\/?(div|p|center)[^>]*>/gi, '').trim();
      const replacement = `<div align="${align}">\n${cleanSelected}\n</div>`;
      const newVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);
      updateArticleContent(newVal);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start, start + replacement.length);
      }, 0);
    } else {
      showToast({
        title: `Perataan Teks: ${align === 'left' ? 'Rata Kiri' : align === 'center' ? 'Rata Tengah' : align === 'right' ? 'Rata Kanan' : 'Rata Kanan-Kiri (Justify)'}`,
        description: 'Format perataan aktif di editor.',
        type: 'info',
      });
    }
  };

  const clearFormatting = () => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const currentVal = articleForm.content;
    const selected = currentVal.substring(start, end);
    if (!selected) {
      showToast({
        title: 'Pilih Teks Terlebih Dahulu',
        description: 'Blok teks yang ingin dibersihkan dari format khusus.',
        type: 'info',
      });
      return;
    }

    const cleaned = selected
      .replace(/(\*\*|\*|~~|`)/g, '')
      .replace(/<\/?(u|b|i|s|div|p|center)[^>]*>/gi, '')
      .replace(/^([#>-]|•|\d+\.)\s+/gm, '');

    const newVal = currentVal.substring(0, start) + cleaned + currentVal.substring(end);
    updateArticleContent(newVal);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start, start + cleaned.length);
    }, 0);
  };

  // Form State: Upload Video File
  const [videoFileImageSource, setVideoFileImageSource] = useState<'upload' | 'link'>('upload');
  const [videoFileUploadedImageName, setVideoFileUploadedImageName] = useState<string>('');
  const [videoUploadForm, setVideoUploadForm] = useState({
    title: '',
    category: 'Kajian Fiqih',
    speaker: '',
    duration: '14:28',
    description: '',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    fileName: 'materi-syariah-2026.mp4',
    fileSize: '128 MB',
    uploadProgress: 100,
  });

  // Form State: Upload Video Link
  const [videoLinkImageSource, setVideoLinkImageSource] = useState<'upload' | 'link'>('upload');
  const [videoLinkUploadedImageName, setVideoLinkUploadedImageName] = useState<string>('');
  const [videoLinkForm, setVideoLinkForm] = useState({
    title: '',
    category: 'Webinar Wakaf',
    speaker: '',
    duration: '28:45',
    description: '',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
  });

  // Quiz Builder State
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptions, setNewOptions] = useState<string[]>(['', '', '', '']);
  const [correctOptIndex, setCorrectOptIndex] = useState<number>(0);
  const [newExplanation, setNewExplanation] = useState('');
  const [newPoints, setNewPoints] = useState<number>(25);

  // New Discussion Reply State
  const [replyText, setReplyText] = useState('');
  const [videoCommentTimestamp, setVideoCommentTimestamp] = useState('00:00');

  // Selected Article & Video Objects
  const currentArticle = articles.find((a) => a.id === selectedArticleId) || articles[0];
  const currentVideo = videos.find((v) => v.id === selectedVideoId) || videos[0];

  // Handlers for Articles
  const handleSaveQuizInArticleForm = () => {
    if (!articleQuizQuestion.trim() || articleQuizOptions.some((opt) => !opt.trim())) {
      showToast({
        title: 'Soal Kuis Belum Lengkap',
        description: 'Pertanyaan dan keempat opsi jawaban (A, B, C, D) wajib diisi.',
        type: 'error',
      });
      return;
    }

    const questionObj: QuizQuestion = {
      id: editingArticleQuizIndex !== null && articleForm.quiz[editingArticleQuizIndex]
        ? articleForm.quiz[editingArticleQuizIndex].id
        : `q-art-${Date.now()}`,
      question: articleQuizQuestion.trim(),
      options: articleQuizOptions.map((text, idx) => ({
        id: `opt-${idx}`,
        text: text.trim(),
      })),
      correctOptionId: `opt-${articleQuizCorrectIndex}`,
      explanation: articleQuizExplanation.trim() || 'Kunci jawaban sesuai kaidah fiqih syariah.',
      points: articleQuizPoints || 25,
    };

    let updatedQuiz = [...articleForm.quiz];
    if (editingArticleQuizIndex !== null) {
      updatedQuiz[editingArticleQuizIndex] = questionObj;
      showToast({
        title: 'Soal Kuis Diperbarui',
        description: 'Perubahan pada butir soal kuis berhasil disimpan.',
        type: 'success',
      });
    } else {
      updatedQuiz.push(questionObj);
      showToast({
        title: 'Soal Kuis Ditambahkan',
        description: 'Butir soal kuis pilihan ganda berhasil ditambahkan ke artikel.',
        type: 'success',
      });
    }

    setArticleForm((prev) => ({ ...prev, quiz: updatedQuiz }));
    // Reset quiz inputs
    setArticleQuizQuestion('');
    setArticleQuizOptions(['', '', '', '']);
    setArticleQuizCorrectIndex(0);
    setArticleQuizExplanation('');
    setArticleQuizPoints(25);
    setEditingArticleQuizIndex(null);
    setShowArticleQuizBuilder(false);
  };

  const handleEditQuizInArticleForm = (index: number) => {
    const q = articleForm.quiz[index];
    if (!q) return;
    setArticleQuizQuestion(q.question);
    setArticleQuizOptions(q.options.map((o) => o.text));
    const correctIdx = q.options.findIndex((o) => o.id === q.correctOptionId);
    setArticleQuizCorrectIndex(correctIdx >= 0 ? correctIdx : 0);
    setArticleQuizExplanation(q.explanation || '');
    setArticleQuizPoints(q.points || 25);
    setEditingArticleQuizIndex(index);
    setShowArticleQuizBuilder(true);
  };

  const handleDeleteQuizInArticleForm = (index: number) => {
    const updated = articleForm.quiz.filter((_, i) => i !== index);
    setArticleForm((prev) => ({ ...prev, quiz: updated }));
    showToast({
      title: 'Soal Kuis Dihapus',
      description: 'Butir soal telah dihapus dari artikel.',
      type: 'info',
    });
  };

  const handleGenerateSampleQuizForArticle = () => {
    const category = articleForm.category;
    let sampleQuestions: QuizQuestion[] = [];

    if (category === 'Fiqih Wakaf') {
      sampleQuestions = [
        {
          id: `q-auto-${Date.now()}-1`,
          question: 'Apa syarat utama keabsahan benda yang diwakafkan (Mauquf Bih) dalam syariat Islam?',
          options: [
            { id: 'opt-0', text: 'Benda harus memiliki manfaat jangka panjang dan tidak habis sekali pakai (tahan lama)' },
            { id: 'opt-1', text: 'Benda harus berupa uang tunai rupiah saja' },
            { id: 'opt-2', text: 'Benda boleh milik orang lain tanpa izin' },
            { id: 'opt-3', text: 'Benda harus langsung dikonsumsi habis pada hari pertama' },
          ],
          correctOptionId: 'opt-0',
          explanation: 'Benda wakaf harus memiliki ketahanan zat (baqa-u ashliha) dan memberikan manfaat berkelanjutan.',
          points: 50,
        },
        {
          id: `q-auto-${Date.now()}-2`,
          question: 'Berapakah batas maksimal hak bagi hasil/imbalan operasional bagi Nazhir profesional sesuai regulasi BWI?',
          options: [
            { id: 'opt-0', text: 'Maksimal 10% dari hasil bersih pengelolaan wakaf produktif' },
            { id: 'opt-1', text: 'Maksimal 50% dari seluruh pokok wakaf' },
            { id: 'opt-2', text: 'Bebas tanpa batasan persentase' },
            { id: 'opt-3', text: 'Nazhir dilarang menerima imbalan sama sekali' },
          ],
          correctOptionId: 'opt-0',
          explanation: 'Sesuai UU No. 41 Tahun 2004 pasal 12, nazhir dapat menerima imbalan dari hasil bersih pengelolaan paling banyak 10%.',
          points: 50,
        },
      ];
    } else if (category === 'Zakat & Nisab') {
      sampleQuestions = [
        {
          id: `q-auto-${Date.now()}-1`,
          question: 'Berapakah batas nisab zakat maal (harta simpanan/tabungan) yang setara dengan emas murni?',
          options: [
            { id: 'opt-0', text: '85 gram emas murni (telah genap haul 1 tahun)' },
            { id: 'opt-1', text: '10 gram emas murni' },
            { id: 'opt-2', text: '500 gram perak tanpa haul' },
            { id: 'opt-3', text: '1 kilogram emas batangan' },
          ],
          correctOptionId: 'opt-0',
          explanation: 'Nisab zakat maal merujuk pada standar 20 dinar emas atau setara 85 gram emas murni.',
          points: 50,
        },
        {
          id: `q-auto-${Date.now()}-2`,
          question: 'Berapa tarif persentase zakat yang wajib dikeluarkan atas harta simpanan yang telah mencapai nisab dan haul?',
          options: [
            { id: 'opt-0', text: '2.5% (seperempat puluh)' },
            { id: 'opt-1', text: '5% (seperdua puluh)' },
            { id: 'opt-2', text: '10% (sepersepuluh)' },
            { id: 'opt-3', text: '20% (seperlima)' },
          ],
          correctOptionId: 'opt-0',
          explanation: 'Kadar zakat atas emas, perak, tabungan, dan perdagangan adalah 2.5% per tahun.',
          points: 50,
        },
      ];
    } else if (category === 'Qurban & Fiqh Hewan') {
      sampleQuestions = [
        {
          id: `q-auto-${Date.now()}-1`,
          question: 'Berapa jumlah maksimal mudhohi (orang yang berqurban) yang boleh berpatungan untuk 1 ekor sapi?',
          options: [
            { id: 'opt-0', text: 'Maksimal untuk 7 orang' },
            { id: 'opt-1', text: 'Hanya untuk 1 orang saja' },
            { id: 'opt-2', text: 'Maksimal untuk 10 orang' },
            { id: 'opt-3', text: 'Boleh patungan hingga 20 orang' },
          ],
          correctOptionId: 'opt-0',
          explanation: 'Berdasarkan hadits Jabir bin Abdillah r.a. riwayat Muslim, satu ekor unta/sapi mencukupi untuk 7 orang berqurban.',
          points: 50,
        },
        {
          id: `q-auto-${Date.now()}-2`,
          question: 'Manakah cacat hewan berikut yang menyebabkan hewan TIDAK SAH dijadikan qurban?',
          options: [
            { id: 'opt-0', text: 'Buta sebelah yang jelas, sakit parah, atau pincang yang jelas tak sanggup berjalan' },
            { id: 'opt-1', text: 'Warna bulunya putih belang hitam' },
            { id: 'opt-2', text: 'Bertanduk panjang melengkung' },
            { id: 'opt-3', text: 'Berukuran tubuh sangat gemuk' },
          ],
          correctOptionId: 'opt-0',
          explanation: 'Hadits Al-Bara bin Azib menyebutkan 4 cacat yang tidak sah: buta jelas, sakit jelas, pincang jelas, dan sangat kurus tanpa sumsum.',
          points: 50,
        },
      ];
    } else {
      sampleQuestions = [
        {
          id: `q-auto-${Date.now()}-1`,
          question: 'Apa perbedaan mendasar antara infaq wajib dan infaq sunnah (sedekah)?',
          options: [
            { id: 'opt-0', text: 'Infaq wajib ditentukan syariat (seperti zakat & nafkah keluarga), sedangkan sedekah bersifat sukarela kapan saja' },
            { id: 'opt-1', text: 'Infaq hanya untuk orang kaya, sedekah hanya untuk orang miskin' },
            { id: 'opt-2', text: 'Tidak ada perbedaan sama sekali' },
            { id: 'opt-3', text: 'Sedekah hanya boleh dalam bentuk uang tunai' },
          ],
          correctOptionId: 'opt-0',
          explanation: 'Infaq terbagi menjadi wajib (zakat, kafarat, nafkah) dan tathawwu (sukarela/sedekah sunnah).',
          points: 50,
        },
        {
          id: `q-auto-${Date.now()}-2`,
          question: 'Prinsip utama transaksi muamalah syariah yang melarang adanya ketidakpastian / penipuan spekulatif adalah larangan:',
          options: [
            { id: 'opt-0', text: 'Gharar & Maysir (spekulasi judi)' },
            { id: 'opt-1', text: 'Tijarah (perdagangan halal)' },
            { id: 'opt-2', text: 'Wakalah bil Ujrah (perwakilan amanah)' },
            { id: 'opt-3', text: 'Mudharabah (bagi hasil usaha)' },
          ],
          correctOptionId: 'opt-0',
          explanation: 'Syariat Islam mewajibkan transparansi dan melarang unsur riba, gharar, maysir, dan tadlis.',
          points: 50,
        },
      ];
    }

    setArticleForm((prev) => ({
      ...prev,
      quiz: [...prev.quiz, ...sampleQuestions],
    }));

    showToast({
      title: 'Kuis Otomatis Dibuat',
      description: `${sampleQuestions.length} butir soal pilihan ganda standar fiqih ${category} berhasil disematkan.`,
      type: 'success',
    });
  };

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title.trim() || !articleForm.content.trim()) {
      showToast({
        title: 'Form Belum Lengkap',
        description: 'Judul dan isi artikel edukasi wajib diisi.',
        type: 'error',
      });
      return;
    }

    const newArticle: ArticleItem = {
      id: `art-${Date.now()}`,
      title: articleForm.title,
      category: articleForm.category,
      coverImage: articleForm.coverImage || 'https://images.unsplash.com/photo-1584281722572-8a9d3e8e19e0?w=800&auto=format&fit=crop&q=80',
      summary: articleForm.summary || articleForm.content.slice(0, 120) + '...',
      content: articleForm.content,
      author: articleForm.author,
      publishDate: '23 Agustus 2026',
      status: articleForm.status,
      likesCount: 0,
      isLikedByUser: false,
      viewsCount: 1,
      readTime: `${Math.max(2, Math.ceil(articleForm.content.split(' ').length / 150))} mnt`,
      quiz: articleForm.quiz,
      discussions: [],
    };

    setArticles([newArticle, ...articles]);
    setSelectedArticleId(newArticle.id);
    setArticleSubView('list');
    showToast({
      title: 'Artikel Edukasi Berhasil Dibuat',
      description: `Artikel "${newArticle.title.slice(0, 35)}..." bersama ${newArticle.quiz?.length || 0} soal kuis telah disimpan dan dipublikasikan.`,
      type: 'success',
    });

    // Reset Form
    setArticleForm({
      title: '',
      category: 'Fiqih Wakaf',
      coverImage: 'https://images.unsplash.com/photo-1584281722572-8a9d3e8e19e0?w=800&auto=format&fit=crop&q=80',
      summary: '',
      content: '',
      author: 'Super Admin Edukasi Amwal',
      status: 'published',
      quiz: [],
    });
    setArticleQuizQuestion('');
    setArticleQuizOptions(['', '', '', '']);
    setArticleQuizCorrectIndex(0);
    setArticleQuizExplanation('');
    setArticleQuizPoints(25);
    setEditingArticleQuizIndex(null);
    setShowArticleQuizBuilder(false);
  };

  const handleToggleArticleLike = (articleId: string) => {
    setArticles((prev) =>
      prev.map((art) => {
        if (art.id === articleId) {
          const isLiked = !art.isLikedByUser;
          return {
            ...art,
            isLikedByUser: isLiked,
            likesCount: isLiked ? art.likesCount + 1 : Math.max(0, art.likesCount - 1),
          };
        }
        return art;
      })
    );
    showToast({
      title: 'Apresiasi Artikel',
      description: 'Menyukai artikel edukasi syariah.',
      type: 'info',
    });
  };

  const handleDeleteArticle = (articleId: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== articleId));
    showToast({
      title: 'Artikel Dihapus',
      description: 'Artikel telah dihapus dari repositori edukasi.',
      type: 'info',
    });
  };

  // Handlers for Quiz
  const handleOpenQuizManager = (article: ArticleItem) => {
    setSelectedArticleId(article.id);
    setQuizQuestions(article.quiz || []);
    setArticleSubView('quiz_manager');
  };

  const handleAddQuizQuestion = () => {
    if (!newQuestionText.trim() || newOptions.some((opt) => !opt.trim())) {
      showToast({
        title: 'Soal Kuis Belum Lengkap',
        description: 'Pertanyaan dan keempat opsi jawaban (A, B, C, D) wajib diisi.',
        type: 'error',
      });
      return;
    }

    const questionId = `q-${Date.now()}`;
    const questionObj: QuizQuestion = {
      id: questionId,
      question: newQuestionText,
      options: newOptions.map((text, idx) => ({
        id: `opt-${idx}`,
        text: text.trim(),
      })),
      correctOptionId: `opt-${correctOptIndex}`,
      explanation: newExplanation || 'Kunci jawaban sesuai kaidah fiqih.',
      points: newPoints || 25,
    };

    const updatedQuestions = [...quizQuestions, questionObj];
    setQuizQuestions(updatedQuestions);

    // Save to article
    setArticles((prev) =>
      prev.map((a) => (a.id === selectedArticleId ? { ...a, quiz: updatedQuestions } : a))
    );

    // Reset Quiz Form
    setNewQuestionText('');
    setNewOptions(['', '', '', '']);
    setCorrectOptIndex(0);
    setNewExplanation('');
    setNewPoints(25);

    showToast({
      title: 'Soal Kuis Ditambahkan',
      description: 'Pertanyaan pilihan ganda berhasil ditautkan ke artikel.',
      type: 'success',
    });
  };

  const handleDeleteQuizQuestion = (qId: string) => {
    const updated = quizQuestions.filter((q) => q.id !== qId);
    setQuizQuestions(updated);
    setArticles((prev) =>
      prev.map((a) => (a.id === selectedArticleId ? { ...a, quiz: updated } : a))
    );
    showToast({
      title: 'Soal Dihapus',
      description: 'Butir soal kuis pilihan ganda telah dihapus.',
      type: 'info',
    });
  };

  // Handlers for Category Management (Article & Video)
  const handleAddCategory = (type: 'articles' | 'videos', name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      showToast({
        title: 'Nama Kategori Kosong',
        description: 'Tuliskan nama kategori edukasi yang valid.',
        type: 'error',
      });
      return;
    }

    const list = type === 'articles' ? articleCategories : videoCategories;
    if (list.some((cat) => cat.toLowerCase() === trimmed.toLowerCase())) {
      showToast({
        title: 'Kategori Sudah Terdaftar',
        description: `Kategori "${trimmed}" sudah ada di dalam daftar.`,
        type: 'info',
      });
      return;
    }

    if (type === 'articles') {
      setArticleCategories((prev) => [...prev, trimmed]);
      setArticleForm((prev) => ({ ...prev, category: trimmed }));
    } else {
      setVideoCategories((prev) => [...prev, trimmed]);
      setVideoUploadForm((prev) => ({ ...prev, category: trimmed }));
      setVideoLinkForm((prev) => ({ ...prev, category: trimmed }));
    }

    setNewCategoryName('');
    setShowInlineAddCategory(null);
    setInlineCategoryInput('');
    showToast({
      title: 'Kategori Berhasil Dibuat',
      description: `Kategori baru "${trimmed}" kini aktif dan dapat digunakan.`,
      type: 'success',
    });
  };

  const handleUpdateCategory = (type: 'articles' | 'videos', index: number, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    if (type === 'articles') {
      const oldName = articleCategories[index];
      const updated = [...articleCategories];
      updated[index] = trimmed;
      setArticleCategories(updated);
      setArticles((prev) =>
        prev.map((art) => (art.category === oldName ? { ...art, category: trimmed } : art))
      );
      if (articleForm.category === oldName) {
        setArticleForm((prev) => ({ ...prev, category: trimmed }));
      }
    } else {
      const oldName = videoCategories[index];
      const updated = [...videoCategories];
      updated[index] = trimmed;
      setVideoCategories(updated);
      setVideos((prev) =>
        prev.map((vid) => (vid.category === oldName ? { ...vid, category: trimmed } : vid))
      );
      if (videoUploadForm.category === oldName) {
        setVideoUploadForm((prev) => ({ ...prev, category: trimmed }));
      }
      if (videoLinkForm.category === oldName) {
        setVideoLinkForm((prev) => ({ ...prev, category: trimmed }));
      }
    }

    setEditingCategoryIndex(null);
    setEditingCategoryText('');
    showToast({
      title: 'Kategori Diperbarui',
      description: `Nama kategori berhasil diubah menjadi "${trimmed}".`,
      type: 'success',
    });
  };

  const handleDeleteCategory = (type: 'articles' | 'videos', index: number) => {
    const list = type === 'articles' ? articleCategories : videoCategories;
    if (list.length <= 1) {
      showToast({
        title: 'Tidak Dapat Dihapus',
        description: 'Minimal harus ada 1 kategori edukasi aktif.',
        type: 'error',
      });
      return;
    }

    const removedName = list[index];
    const updated = list.filter((_, i) => i !== index);

    if (type === 'articles') {
      setArticleCategories(updated);
      if (articleForm.category === removedName) {
        setArticleForm((prev) => ({ ...prev, category: updated[0] }));
      }
    } else {
      setVideoCategories(updated);
      if (videoUploadForm.category === removedName) {
        setVideoUploadForm((prev) => ({ ...prev, category: updated[0] }));
      }
      if (videoLinkForm.category === removedName) {
        setVideoLinkForm((prev) => ({ ...prev, category: updated[0] }));
      }
    }

    showToast({
      title: 'Kategori Dihapus',
      description: `Kategori "${removedName}" telah dihapus.`,
      type: 'info',
    });
  };

  // Handlers for Video File Selection
  const handleVideoFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const fileName = file.name;

    setVideoUploadForm((prev) => ({
      ...prev,
      fileName,
      fileSize: sizeInMB,
    }));

    showToast({
      title: 'Berkas Video Terpilih',
      description: `Berkas "${fileName}" (${sizeInMB}) siap diunggah.`,
      type: 'success',
    });
  };

  // Handlers for Video Thumbnail Upload (File picker / Drag & drop)
  const handleVideoThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'upload_file' | 'upload_link') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast({
        title: 'Format Berkas Salah',
        description: 'Pilih berkas gambar berekstensi JPG, PNG, atau WebP.',
        type: 'error',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast({
        title: 'Ukuran Gambar Terlalu Besar',
        description: 'Maksimal ukuran berkas gambar thumbnail adalah 5 MB.',
        type: 'error',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (target === 'upload_file') {
        setVideoUploadForm((prev) => ({ ...prev, thumbnailUrl: dataUrl }));
        setVideoFileUploadedImageName(file.name);
      } else {
        setVideoLinkForm((prev) => ({ ...prev, thumbnailUrl: dataUrl }));
        setVideoLinkUploadedImageName(file.name);
      }
      showToast({
        title: 'Thumbnail Berhasil Diunggah',
        description: `Berkas "${file.name}" diterapkan sebagai sampul video.`,
        type: 'success',
      });
    };
    reader.readAsDataURL(file);
  };

  // Handlers for Video
  const handleUploadVideoFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUploadForm.title.trim()) {
      showToast({
        title: 'Judul Video Wajib Diisi',
        description: 'Masukkan judul materi video edukasi.',
        type: 'error',
      });
      return;
    }

    const newVideo: VideoItem = {
      id: `vid-${Date.now()}`,
      title: videoUploadForm.title,
      category: videoUploadForm.category,
      sourceType: 'upload',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnailUrl: videoUploadForm.thumbnailUrl,
      speaker: videoUploadForm.speaker || 'Tim Ahli Fiqih Amwal',
      duration: videoUploadForm.duration || '14:28', // Automatically set based on video file metadata
      description: videoUploadForm.description || 'Rekaman materi edukasi dan panduan praktis.',
      publishDate: '23 Agustus 2026',
      status: 'published',
      likesCount: 0,
      isLikedByUser: false,
      viewsCount: 1,
      discussions: [],
    };

    setVideos([newVideo, ...videos]);
    setVideoSubView('list');
    showToast({
      title: 'Berkas Video Berhasil Diunggah',
      description: `Video "${newVideo.title.slice(0, 35)}..." dengan durasi otomatis ${newVideo.duration} siap ditonton.`,
      type: 'success',
    });
  };

  const handleUploadVideoLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoLinkForm.title.trim() || !videoLinkForm.videoUrl.trim()) {
      showToast({
        title: 'Tautan Video Belum Lengkap',
        description: 'Masukkan judul dan URL streaming (YouTube / Vimeo).',
        type: 'error',
      });
      return;
    }

    const newVideo: VideoItem = {
      id: `vid-link-${Date.now()}`,
      title: videoLinkForm.title,
      category: videoLinkForm.category,
      sourceType: 'link',
      videoUrl: videoLinkForm.videoUrl,
      thumbnailUrl: videoLinkForm.thumbnailUrl,
      speaker: videoLinkForm.speaker || 'Pemateri Kajian Syariah',
      duration: videoLinkForm.duration || '28:45',
      description: videoLinkForm.description || 'Materi video terhubung dari platform eksternal.',
      publishDate: '23 Agustus 2026',
      status: 'published',
      likesCount: 0,
      isLikedByUser: false,
      viewsCount: 1,
      discussions: [],
    };

    setVideos([newVideo, ...videos]);
    setVideoSubView('list');
    showToast({
      title: 'Tautan Video Berhasil Ditautkan',
      description: `Video streaming berhasil disematkan ke katalog edukasi.`,
      type: 'success',
    });
  };

  const handleToggleVideoLike = (videoId: string) => {
    setVideos((prev) =>
      prev.map((vid) => {
        if (vid.id === videoId) {
          const isLiked = !vid.isLikedByUser;
          return {
            ...vid,
            isLikedByUser: isLiked,
            likesCount: isLiked ? vid.likesCount + 1 : Math.max(0, vid.likesCount - 1),
          };
        }
        return vid;
      })
    );
    showToast({
      title: 'Apresiasi Video',
      description: 'Menyukai video edukasi syariah.',
      type: 'info',
    });
  };

  // Discussion Add Comment Handler
  const handleAddDiscussionReply = (targetType: 'article' | 'video', targetId: string) => {
    if (!replyText.trim()) return;

    const newComment: DiscussionComment = {
      id: `comm-${Date.now()}`,
      authorName: 'Super Admin Amwal (Asatidz Hub)',
      authorRole: 'Admin',
      avatarText: 'SA',
      comment: replyText.trim(),
      timestamp: 'Baru saja',
      likes: 0,
      status: 'approved',
      videoTimestamp: targetType === 'video' ? videoCommentTimestamp : undefined,
    };

    if (targetType === 'article') {
      setArticles((prev) =>
        prev.map((art) => {
          if (art.id === targetId) {
            return {
              ...art,
              discussions: [newComment, ...art.discussions],
            };
          }
          return art;
        })
      );
    } else {
      setVideos((prev) =>
        prev.map((vid) => {
          if (vid.id === targetId) {
            return {
              ...vid,
              discussions: [newComment, ...vid.discussions],
            };
          }
          return vid;
        })
      );
    }

    setReplyText('');
    showToast({
      title: 'Tanggapan Terkirim',
      description: 'Komentar jawaban admin telah dipublikasikan di forum diskusi.',
      type: 'success',
    });
  };

  // Filtered lists
  const filteredArticles = articles.filter((art) => {
    const matchSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'all' || art.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const filteredVideos = videos.filter((vid) => {
    const matchSearch =
      vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'all' || vid.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-100/40 via-teal-50/20 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Manajemen Edukasi & Publikasi
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Kelola artikel fiqih, kuis pilihan ganda interaktif, siaran video kajian, serta moderasi diskusi tanya-jawab jamaah dalam satu arsitektur terintegrasi.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
              using dummy data
            </span>
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
            <div className="px-3 py-1">
              <div className="text-xs text-slate-500 font-medium">Total Artikel</div>
              <div className="text-lg font-black text-slate-900 font-mono">{articles.length}</div>
            </div>
            <div className="px-3 py-1 border-x border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Total Video</div>
              <div className="text-lg font-black text-slate-900 font-mono">{videos.length}</div>
            </div>
            <div className="px-3 py-1">
              <div className="text-xs text-slate-500 font-medium">Total Like</div>
              <div className="text-lg font-black text-emerald-800 font-mono">
                {articles.reduce((a, b) => a + b.likesCount, 0) + videos.reduce((a, b) => a + b.likesCount, 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* PRIMARY TAB SWITCHER (Artikel vs Video) */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => {
                setMainTab('articles');
                setArticleSubView('list');
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition cursor-pointer ${
                mainTab === 'articles'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Modul Artikel ({articles.length})</span>
            </button>

            <button
              onClick={() => {
                setMainTab('videos');
                setVideoSubView('list');
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition cursor-pointer ${
                mainTab === 'videos'
                  ? 'bg-[#1B5E20] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Modul Video ({videos.length})</span>
            </button>
          </div>

          {/* Action CTA depending on active mainTab */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCategoryModalTab(mainTab === 'articles' ? 'articles' : 'videos');
                setShowCategoryModal(true);
              }}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition"
              title="Kelola & Edit Daftar Kategori Edukasi"
            >
              <Settings2 className="w-4 h-4 text-slate-600" />
              <span>Kelola Kategori</span>
            </button>

            {mainTab === 'articles' ? (
              <>
                {articleSubView !== 'list' && (
                  <button
                    onClick={() => setArticleSubView('list')}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    ← Kembali ke List Artikel
                  </button>
                )}
                {articleSubView === 'list' && (
                  <button
                    onClick={() => setArticleSubView('create')}
                    className="px-4 py-2.5 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition"
                  >
                    <Plus className="w-4 h-4" />
                    Buat Artikel Baru
                  </button>
                )}
              </>
            ) : (
              <>
                {videoSubView !== 'list' && (
                  <button
                    onClick={() => setVideoSubView('list')}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    ← Kembali ke List Video
                  </button>
                )}
                {videoSubView === 'list' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setVideoSubView('upload_file')}
                      className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#1B5E20] border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition"
                    >
                      <Upload className="w-4 h-4" />
                      Upload File Video
                    </button>
                    <button
                      onClick={() => setVideoSubView('upload_link')}
                      className="px-4 py-2.5 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition"
                    >
                      <Link2 className="w-4 h-4" />
                      Upload Link Video
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: ARTIKEL (List, Buat Artikel, Quiz, Diskusi, Like)              */}
      {/* ========================================================================= */}
      {mainTab === 'articles' && (
        <div className="space-y-6">
          {/* Search & Filter Bar for Articles */}
          {articleSubView === 'list' && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Daftar Artikel Edukasi ({filteredArticles.length})</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari judul artikel/kategori/penulis..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#1B5E20]"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:bg-white cursor-pointer"
                >
                  <option value="all">Semua Kategori ({articleCategories.length})</option>
                  {articleCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* VIEW: LIST ARTIKEL */}
          {articleSubView === 'list' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((art) => (
                <div
                  key={art.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between group"
                >
                  {/* Article Thumbnail */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white font-bold text-[10px] uppercase">
                        {art.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                        <span>{art.publishDate}</span>
                        <span>•</span>
                        <span>{art.readTime} baca</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-[#1B5E20] transition">
                        {art.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {art.summary}
                      </p>
                    </div>

                    {/* Meta stats: Like, Views, Quiz, Discussion */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <span className="flex items-center gap-1 text-rose-700 font-bold" title="Jumlah Suka">
                          <Heart className="w-3 h-3 fill-rose-600" /> {art.likesCount}
                        </span>
                        <span className="flex items-center gap-1" title="Pembaca">
                          <Eye className="w-3 h-3 text-slate-400" /> {art.viewsCount}
                        </span>
                        <span className="flex items-center gap-1 text-blue-600" title="Diskusi Jamaah">
                          <MessageSquare className="w-3 h-3" /> {art.discussions.length}
                        </span>
                      </div>

                      {art.quiz && art.quiz.length > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] flex items-center gap-1">
                          <HelpCircle className="w-2.5 h-2.5" />
                          {art.quiz.length} Soal Kuis
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Tanpa Kuis</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <button
                        onClick={() => setPreviewArticle(art)}
                        className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition"
                      >
                        <Eye className="w-3 h-3" />
                        Baca
                      </button>
                      <button
                        onClick={() => handleOpenQuizManager(art)}
                        className="px-2 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition"
                      >
                        <HelpCircle className="w-3 h-3" />
                        Kuis
                      </button>
                      <button
                        onClick={() => {
                          setSelectedArticleId(art.id);
                          setArticleSubView('discussion');
                        }}
                        className="px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#1B5E20] border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition"
                      >
                        <MessageSquare className="w-3 h-3" />
                        Diskusi
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW: BUAT ARTIKEL (Form Gambar, Judul, Kategori, Isi, Kuis) */}
          {articleSubView === 'create' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Formulir Pembuatan Artikel Edukasi Baru</h2>
                  <p className="text-xs text-slate-500">
                    Lengkapi thumbnail ilustrasi, judul, kategori fiqih, isi materi materi, serta rancang kuis interaktif pemahaman jamaah.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const quizEl = document.getElementById('article-quiz-section');
                      if (quizEl) {
                        quizEl.scrollIntoView({ behavior: 'smooth' });
                      }
                      setShowArticleQuizBuilder(true);
                    }}
                    className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-700" />
                    <span>Buat Kuis ({articleForm.quiz.length} Soal)</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateArticle} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Judul Artikel */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Judul Artikel Edukasi <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Panduan Fiqih Wakaf Saham & Sukuk Produktif untuk Generasi Muda..."
                      value={articleForm.title}
                      onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#1B5E20]"
                    />
                  </div>

                  {/* Kategori */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700">
                        Kategori Fiqih / Topik <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setShowInlineAddCategory(showInlineAddCategory === 'article' ? null : 'article');
                            setInlineCategoryInput('');
                          }}
                          className="text-[11px] text-[#1B5E20] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Kategori Baru</span>
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => {
                            setCategoryModalTab('articles');
                            setShowCategoryModal(true);
                          }}
                          className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                        >
                          Kelola List
                        </button>
                      </div>
                    </div>

                    {/* Inline Quick Add Category Input */}
                    {showInlineAddCategory === 'article' && (
                      <div className="flex items-center gap-1.5 p-2 bg-emerald-50/80 border border-emerald-200 rounded-xl">
                        <input
                          type="text"
                          placeholder="Nama kategori baru..."
                          value={inlineCategoryInput}
                          onChange={(e) => setInlineCategoryInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCategory('articles', inlineCategoryInput);
                            }
                          }}
                          className="flex-1 px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-hidden"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleAddCategory('articles', inlineCategoryInput)}
                          className="px-3 py-1.5 bg-[#1B5E20] text-white rounded-lg text-xs font-bold hover:bg-[#144716] cursor-pointer"
                        >
                          Simpan
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowInlineAddCategory(null);
                            setInlineCategoryInput('');
                          }}
                          className="px-2 py-1.5 text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    )}

                    <select
                      value={articleForm.category}
                      onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#1B5E20]"
                    >
                      {articleCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Gambar / Cover Artikel (Bisa Link & Upload File) */}
                  <div className="space-y-2 md:col-span-2 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                      <div>
                        <label className="block text-xs font-bold text-slate-800">
                          Banner / Gambar Ilustrasi Artikel <span className="text-rose-500">*</span>
                        </label>
                        <p className="text-[11px] text-slate-500">
                          Pilih metode untuk menambahkan thumbnail artikel: upload file lokal atau masukkan tautan URL.
                        </p>
                      </div>

                      {/* Toggle Options: Upload vs Link */}
                      <div className="inline-flex p-1 bg-white border border-slate-200 rounded-xl shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setArticleImageSource('upload')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            articleImageSource === 'upload'
                              ? 'bg-[#1B5E20] text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Upload File
                        </button>
                        <button
                          type="button"
                          onClick={() => setArticleImageSource('link')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            articleImageSource === 'link'
                              ? 'bg-[#1B5E20] text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          Link URL Gambar
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 items-start">
                      {/* Left: Input Control (Upload or Link) */}
                      <div className="md:col-span-2 space-y-3">
                        {articleImageSource === 'upload' ? (
                          <div className="space-y-2">
                            <label className="border-2 border-dashed border-slate-300 hover:border-[#1B5E20] bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition group">
                              <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#1B5E20] flex items-center justify-center mb-2 group-hover:scale-110 transition">
                                <Upload className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-bold text-slate-800">
                                Klik untuk upload atau drag & drop file gambar
                              </span>
                              <span className="text-[11px] text-slate-400 mt-0.5">
                                Format didukung: JPG, PNG, WebP (Maks. 5 MB)
                              </span>
                              <input
                                type="file"
                                accept="image/png, image/jpeg, image/webp"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (file.size > 5 * 1024 * 1024) {
                                      showToast({
                                        title: 'File Terlalu Besar',
                                        description: 'Ukuran file gambar maksimal 5 MB.',
                                        type: 'error',
                                      });
                                      return;
                                    }
                                    setUploadedImageFileName(file.name);
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      const dataUrl = event.target?.result as string;
                                      setArticleForm({ ...articleForm, coverImage: dataUrl });
                                      showToast({
                                        title: 'Gambar Berhasil Diunggah',
                                        description: `File "${file.name}" siap digunakan sebagai banner artikel.`,
                                        type: 'success',
                                      });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>

                            {uploadedImageFileName && (
                              <div className="flex items-center justify-between px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                                <div className="flex items-center gap-2 truncate">
                                  <ImageIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span className="font-semibold truncate">{uploadedImageFileName}</span>
                                </div>
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                                  Siap Digunakan
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                Masukkan Tautan / Link URL Gambar Langsung
                              </label>
                              <div className="relative">
                                <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                                <input
                                  type="url"
                                  placeholder="https://images.unsplash.com/... atau tautan CDN gambar"
                                  value={articleForm.coverImage}
                                  onChange={(e) => {
                                    setArticleForm({ ...articleForm, coverImage: e.target.value });
                                    setUploadedImageFileName('');
                                  }}
                                  className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 placeholder-slate-400 focus:border-[#1B5E20]"
                                />
                              </div>
                            </div>

                            {/* Preset Template Cepat */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Contoh Pilihan Cepat:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {[
                                  { label: 'Fiqih Wakaf', url: 'https://images.unsplash.com/photo-1584281722572-8a9d3e8e19e0?w=800&auto=format&fit=crop&q=80' },
                                  { label: 'Zakat & Nisab', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80' },
                                  { label: 'Qurban & Hewan', url: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80' },
                                  { label: 'Sukuk & Bisnis', url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80' },
                                ].map((preset) => (
                                  <button
                                    key={preset.label}
                                    type="button"
                                    onClick={() => {
                                      setArticleForm({ ...articleForm, coverImage: preset.url });
                                      setUploadedImageFileName('');
                                    }}
                                    className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[10px] font-semibold transition cursor-pointer"
                                  >
                                    {preset.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Live Preview Banner */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-600 block">
                          Pratinjau Banner Cover
                        </span>
                        <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shadow-2xs group">
                          {articleForm.coverImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={articleForm.coverImage}
                              alt="Pratinjau Banner Artikel"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584281722572-8a9d3e8e19e0?w=800&auto=format&fit=crop&q=80';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                              <ImageIcon className="w-6 h-6 mb-1" />
                              <span className="text-[10px]">Belum ada gambar terpilih</span>
                            </div>
                          )}
                          <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold rounded-md">
                            Rasio 16:9
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Penulis & Status */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Nama Penulis / Asatidz</label>
                    <input
                      type="text"
                      value={articleForm.author}
                      onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Status Publikasi</label>
                    <select
                      value={articleForm.status}
                      onChange={(e) => setArticleForm({ ...articleForm, status: e.target.value as any })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                    >
                      <option value="published">Langsung Publikasikan (Live)</option>
                      <option value="draft">Simpan Sebagai Draft</option>
                    </select>
                  </div>
                </div>

                {/* Ringkasan Singkat */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Ringkasan Singkat (Lead / Excerpt)
                  </label>
                  <input
                    type="text"
                    placeholder="Ikhtisar 1-2 kalimat pengantar artikel yang memikat pembaca..."
                    value={articleForm.summary}
                    onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
                  />
                </div>

                {/* Isi Lengkap Artikel Edukasi with Minimalist WYSIWYG Editor */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800">
                      Isi Dokumen Materi Edukasi <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Editor Teks Minimalis (Poin, Format, Perataan &amp; Dalil Fiqih)
                    </span>
                  </div>

                  <MinimalArticleEditor
                    value={articleForm.content}
                    onChange={(val) => setArticleForm((prev) => ({ ...prev, content: val }))}
                    title={articleForm.title || 'Materi Edukasi Syariah'}
                  />
                </div>

                {/* ========================================================================= */}
                {/* FITUR QUIZ: PEMBUATAN & PENGATURAN KUIS ARTIKEL                          */}
                {/* ========================================================================= */}
                <div id="article-quiz-section" className="p-5 sm:p-6 bg-slate-50/90 rounded-3xl border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5" />
                          Kuis Interaktif Pemahaman Materi
                        </span>
                        <span className="text-xs font-bold text-slate-500 font-mono">
                          {articleForm.quiz.length} Butir Soal Terpasang
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Sertakan pertanyaan pilihan ganda untuk menguji pemahaman syariah jamaah setelah membaca artikel ini.
                      </p>
                    </div>

                    {/* Tombol Buat & Rekomendasi Kuis */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleGenerateSampleQuizForArticle}
                        className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                        title="Otomatis masukkan butir soal standar sesuai topik materi"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Rekomendasi Soal Otomatis</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (showArticleQuizBuilder) {
                            setShowArticleQuizBuilder(false);
                            setEditingArticleQuizIndex(null);
                          } else {
                            setArticleQuizQuestion('');
                            setArticleQuizOptions(['', '', '', '']);
                            setArticleQuizCorrectIndex(0);
                            setArticleQuizExplanation('');
                            setArticleQuizPoints(25);
                            setEditingArticleQuizIndex(null);
                            setShowArticleQuizBuilder(true);
                          }
                        }}
                        className="px-4 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{showArticleQuizBuilder ? 'Tutup Form Soal' : 'Buat Soal Kuis'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Form Tambah/Edit Soal Kuis */}
                  {showArticleQuizBuilder && (
                    <div className="p-4 sm:p-5 bg-white rounded-2xl border border-emerald-200 shadow-sm space-y-4 animate-in fade-in zoom-in-95">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          {editingArticleQuizIndex !== null ? `Edit Butir Soal #${editingArticleQuizIndex + 1}` : 'Form Pembuatan Soal Kuis Pilihan Ganda'}
                        </h4>
                        <span className="text-[11px] text-slate-400 font-mono">Format 4 Pilihan (A, B, C, D)</span>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Pertanyaan Kuis <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: Berapa batas persentase maksimal hak operasional Amil dalam fiqih zakat?"
                            value={articleQuizQuestion}
                            onChange={(e) => setArticleQuizQuestion(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-[#1B5E20]"
                          />
                        </div>

                        {/* 4 Opsi Jawaban (A, B, C, D) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {['A', 'B', 'C', 'D'].map((letter, idx) => (
                            <div key={letter} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <label className="font-semibold text-slate-700 text-[11px]">Opsi {letter}</label>
                                <label className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="article_quiz_correct"
                                    checked={articleQuizCorrectIndex === idx}
                                    onChange={() => setArticleQuizCorrectIndex(idx)}
                                    className="accent-[#1B5E20]"
                                  />
                                  Kunci Jawaban Benar
                                </label>
                              </div>
                              <input
                                type="text"
                                placeholder={`Jawaban opsi ${letter}...`}
                                value={articleQuizOptions[idx]}
                                onChange={(e) => {
                                  const updated = [...articleQuizOptions];
                                  updated[idx] = e.target.value;
                                  setArticleQuizOptions(updated);
                                }}
                                className={`w-full px-3.5 py-2 rounded-xl text-xs border transition ${
                                  articleQuizCorrectIndex === idx
                                    ? 'bg-emerald-50/80 border-emerald-400 font-bold text-emerald-950 ring-1 ring-emerald-300'
                                    : 'bg-white border-slate-300 text-slate-800'
                                }`}
                              />
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                          <div className="sm:col-span-2">
                            <label className="block font-semibold text-slate-700 mb-1">
                              Penjelasan Fiqih / Dalil Rujukan Singkat
                            </label>
                            <input
                              type="text"
                              placeholder="Contoh: Sesuai QS. At-Taubah:60 dan fatwa DSN-MUI batas operasional amil adalah 1/8 (12.5%)."
                              value={articleQuizExplanation}
                              onChange={(e) => setArticleQuizExplanation(e.target.value)}
                              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">Bobot Poin Soal</label>
                            <input
                              type="number"
                              value={articleQuizPoints}
                              onChange={(e) => setArticleQuizPoints(parseInt(e.target.value) || 25)}
                              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              setShowArticleQuizBuilder(false);
                              setEditingArticleQuizIndex(null);
                            }}
                            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveQuizInArticleForm}
                            className="px-4 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            {editingArticleQuizIndex !== null ? 'Perbarui Soal' : 'Simpan Soal ke Artikel'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Daftar Soal yang Sudah Terpasang pada Form Artikel */}
                  <div className="space-y-2">
                    {articleForm.quiz.length === 0 ? (
                      <div className="p-6 text-center bg-white/70 rounded-2xl border border-dashed border-slate-300 text-slate-400 text-xs">
                        Belum ada soal kuis untuk artikel ini. Klik tombol <strong>&quot;Buat Soal Kuis&quot;</strong> atau <strong>&quot;Rekomendasi Soal Otomatis&quot;</strong> untuk menyematkan kuis.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {articleForm.quiz.map((q, idx) => (
                          <div
                            key={q.id || idx}
                            className="p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-2.5">
                                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <div>
                                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">{q.question}</h5>
                                  <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-slate-500 font-mono">
                                    <span className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-md font-semibold">
                                      +{q.points} Poin
                                    </span>
                                    {q.explanation && (
                                      <span className="text-slate-600 line-clamp-1 italic">
                                        Dalil: {q.explanation}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleEditQuizInArticleForm(idx)}
                                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                                  title="Edit Butir Soal"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteQuizInArticleForm(idx)}
                                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                  title="Hapus Butir Soal"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Opsi Jawaban Preview */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                              {q.options.map((opt, optIdx) => {
                                const isCorrect = opt.id === q.correctOptionId || `opt-${optIdx}` === q.correctOptionId;
                                const letter = ['A', 'B', 'C', 'D'][optIdx] || optIdx + 1;
                                return (
                                  <div
                                    key={opt.id || optIdx}
                                    className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-2 ${
                                      isCorrect
                                        ? 'bg-emerald-50 border-emerald-300 text-[#1B5E20] font-bold ring-1 ring-emerald-200'
                                        : 'bg-slate-50 border-slate-200 text-slate-700'
                                    }`}
                                  >
                                    <span className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold shrink-0 ${
                                      isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                                    }`}>
                                      {letter}
                                    </span>
                                    <span className="truncate flex-1">{opt.text}</span>
                                    {isCorrect && (
                                      <span className="text-[10px] font-extrabold text-[#1B5E20] shrink-0 bg-emerald-100 px-1.5 py-0.5 rounded">
                                        Kunci
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-200">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      Artikel siap diterbitkan {articleForm.quiz.length > 0 ? `bersama ${articleForm.quiz.length} soal kuis interaktif` : '(tanpa kuis)'}.
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setArticleSubView('list')}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition"
                    >
                      <Check className="w-4 h-4" />
                      Simpan & Terbitkan Artikel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* VIEW: MANAJEMEN QUIZ PILIHAN GANDA */}
          {articleSubView === 'quiz_manager' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" />
                      Kuis Interaktif
                    </span>
                    <span className="text-xs font-bold text-slate-400">Total: {quizQuestions.length} Butir Soal</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">
                    Manajemen Quiz Pilihan Ganda: {currentArticle.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedArticleId}
                    onChange={(e) => {
                      setSelectedArticleId(e.target.value);
                      const target = articles.find((a) => a.id === e.target.value);
                      setQuizQuestions(target?.quiz || []);
                    }}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                  >
                    {articles.map((art) => (
                      <option key={art.id} value={art.id}>
                        {art.title.slice(0, 35)}...
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Form Tambah Soal Baru */}
              <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-[#1B5E20]" />
                  Tambah Butir Soal Pilihan Ganda
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Pertanyaan Kuis <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Berapa batas persentase maksimal hak operasional Amil dalam fiqih zakat?"
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:border-[#1B5E20]"
                    />
                  </div>

                  {/* 4 Opsi Jawaban (A, B, C, D) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['A', 'B', 'C', 'D'].map((letter, idx) => (
                      <div key={letter} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="font-semibold text-slate-700 text-[11px]">Opsi {letter}</label>
                          <label className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 cursor-pointer">
                            <input
                              type="radio"
                              name="correct_answer"
                              checked={correctOptIndex === idx}
                              onChange={() => setCorrectOptIndex(idx)}
                              className="accent-[#1B5E20]"
                            />
                            Kunci Jawaban Benar
                          </label>
                        </div>
                        <input
                          type="text"
                          placeholder={`Jawaban ${letter}...`}
                          value={newOptions[idx]}
                          onChange={(e) => {
                            const updated = [...newOptions];
                            updated[idx] = e.target.value;
                            setNewOptions(updated);
                          }}
                          className={`w-full px-3 py-1.5 rounded-xl text-xs border ${
                            correctOptIndex === idx
                              ? 'bg-emerald-50/70 border-emerald-400 font-bold text-emerald-950'
                              : 'bg-white border-slate-300 text-slate-800'
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Penjelasan Fiqih / Dalil Rujukan
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Sesuai QS. At-Taubah:60 dan fatwa DSN MUI batas amil adalah 1/8 (12.5%)."
                        value={newExplanation}
                        onChange={(e) => setNewExplanation(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Bobot Poin Soal</label>
                      <input
                        type="number"
                        value={newPoints}
                        onChange={(e) => setNewPoints(parseInt(e.target.value) || 25)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleAddQuizQuestion}
                    className="px-4 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Simpan Soal ke Kuis
                  </button>
                </div>
              </div>

              {/* Daftar Soal yang Sudah Ada */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Daftar Soal Kuis Terpasang ({quizQuestions.length})
                </h3>

                {quizQuestions.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-400 text-xs">
                    Belum ada soal kuis pada artikel ini. Tambahkan pertanyaan melalui form di atas.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {quizQuestions.map((q, qIdx) => (
                      <div
                        key={q.id}
                        className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#1B5E20] font-black text-xs flex items-center justify-center shrink-0">
                              {qIdx + 1}
                            </span>
                            <div>
                              <h4 className="text-xs font-bold text-slate-900">{q.question}</h4>
                              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                                Bobot: {q.points} Poin
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteQuizQuestion(q.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition"
                            title="Hapus soal ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Opsi List */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {q.options.map((opt, oIdx) => {
                            const isCorrect = opt.id === q.correctOptionId;
                            return (
                              <div
                                key={opt.id}
                                className={`p-2.5 rounded-xl border flex items-center justify-between text-[11px] ${
                                  isCorrect
                                    ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-950'
                                    : 'bg-slate-50 border-slate-200 text-slate-700'
                                }`}
                              >
                                <span>
                                  {String.fromCharCode(65 + oIdx)}. {opt.text}
                                </span>
                                {isCorrect && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900 font-extrabold">
                                    KUNCI
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {q.explanation && (
                          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                            <strong>Penjelasan Syariah:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: DISKUSI PEMBACA ARTIKEL */}
          {articleSubView === 'discussion' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    Forum Diskusi Jamaah: {currentArticle.title}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Moderasi tanya jawab syariah dan berikan penjelasan resmi asatidz.
                  </p>
                </div>
                <select
                  value={selectedArticleId}
                  onChange={(e) => setSelectedArticleId(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                >
                  {articles.map((art) => (
                    <option key={art.id} value={art.id}>
                      {art.title.slice(0, 35)}...
                    </option>
                  ))}
                </select>
              </div>

              {/* Balas Diskusi Baru */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  Tulis Tanggapan Resmi Super Admin / Asatidz
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Tuliskan jawaban atau fatwa penjelasan atas diskusi artikel..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:border-[#1B5E20]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddDiscussionReply('article', selectedArticleId);
                    }}
                  />
                  <button
                    onClick={() => handleAddDiscussionReply('article', selectedArticleId)}
                    className="px-4 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Kirim
                  </button>
                </div>
              </div>

              {/* Daftar Thread Komentar */}
              <div className="space-y-4">
                {currentArticle.discussions.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-400 text-xs">
                    Belum ada diskusi pembaca pada artikel ini.
                  </div>
                ) : (
                  currentArticle.discussions.map((disc) => (
                    <div
                      key={disc.id}
                      className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#1B5E20] font-bold text-xs flex items-center justify-center">
                            {disc.avatarText}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{disc.authorName}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                                {disc.authorRole}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">{disc.timestamp}</span>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3 text-slate-400" /> {disc.likes}
                        </span>
                      </div>

                      <p className="text-xs text-slate-800 leading-relaxed pl-9">
                        {disc.comment}
                      </p>

                      {/* Sub-replies */}
                      {disc.replies && disc.replies.length > 0 && (
                        <div className="ml-9 space-y-2 pt-2 border-t border-slate-100">
                          {disc.replies.map((rep) => (
                            <div
                              key={rep.id}
                              className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-1 text-xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                                  <ShieldCheck className="w-3.5 h-3.5 text-[#1B5E20]" />
                                  {rep.authorName} ({rep.authorRole})
                                </span>
                                <span className="text-[10px] text-emerald-800 font-mono">{rep.timestamp}</span>
                              </div>
                              <p className="text-emerald-900 text-[11px] leading-relaxed">{rep.comment}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: VIDEO (List, Upload Video, Upload Link, Diskusi Video, Like)   */}
      {/* ========================================================================= */}
      {mainTab === 'videos' && (
        <div className="space-y-6">
          {/* Search & Filter Bar for Videos */}
          {videoSubView === 'list' && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Katalog Video Edukasi ({filteredVideos.length})</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari video / pemateri..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#1B5E20]"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:bg-white cursor-pointer"
                >
                  <option value="all">Semua Kategori ({videoCategories.length})</option>
                  {videoCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* VIEW: LIST VIDEO */}
          {videoSubView === 'list' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((vid) => (
                <div
                  key={vid.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between group"
                >
                  {/* Video Thumbnail with Play Button */}
                  <div className="relative h-48 w-full bg-slate-900 overflow-hidden cursor-pointer" onClick={() => setPreviewVideo(vid)}>
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#1B5E20]/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-900/90 backdrop-blur-xs text-white font-bold text-[10px] uppercase">
                        {vid.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-white font-mono text-[10px] font-bold">
                      {vid.duration}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span className="truncate">{vid.speaker}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold uppercase text-[9px]">
                          {vid.sourceType === 'upload' ? 'MP4 File' : 'Stream Link'}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-[#1B5E20] transition">
                        {vid.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {vid.description}
                      </p>
                    </div>

                    {/* Meta Stats */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono text-[11px]">
                      <span className="flex items-center gap-1 text-rose-700 font-bold">
                        <Heart className="w-3 h-3 fill-rose-600" /> {vid.likesCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-slate-400" /> {vid.viewsCount} Ditonton
                      </span>
                      <span className="flex items-center gap-1 text-blue-600">
                        <MessageSquare className="w-3 h-3" /> {vid.discussions.length} Diskusi
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => setPreviewVideo(vid)}
                        className="px-3 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Putar Video
                      </button>
                      <button
                        onClick={() => {
                          setSelectedVideoId(vid.id);
                          setVideoSubView('discussion');
                        }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Diskusi
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW: UPLOAD VIDEO FILE */}
          {videoSubView === 'upload_file' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-[#1B5E20]" />
                    Upload Berkas Video Edukasi (MP4 / WebM)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Unggah berkas rekaman kajian syariah atau tutorial langsung ke repositori media Amwal.
                  </p>
                </div>
              </div>

              <form onSubmit={handleUploadVideoFile} className="space-y-6">
                {/* File Upload Dropzone for Video */}
                <div className="relative p-6 sm:p-8 bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl text-center space-y-3 hover:border-emerald-500 transition group">
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/x-matroska,video/quicktime"
                    onChange={handleVideoFileSelection}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    id="videoFileInput"
                  />
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#1B5E20] mx-auto flex items-center justify-center group-hover:scale-105 transition">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-900 block">
                      Klik atau Seret Berkas Video ke Sini
                    </span>
                    <span className="text-xs text-slate-500">
                      Mendukung format MP4, MKV, WebM • Maksimal ukuran berkas 500 MB
                    </span>
                  </div>
                  <div className="pt-1 flex items-center justify-center gap-2">
                    <span className="px-3.5 py-1.5 bg-white border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {videoUploadForm.fileName} ({videoUploadForm.fileSize})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Judul Video */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Judul Video Edukasi <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Tata Cara Pemotongan Hewan Kurban Sesuai Standar Juleha..."
                      value={videoUploadForm.title}
                      onChange={(e) => setVideoUploadForm({ ...videoUploadForm, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#1B5E20]"
                    />
                  </div>

                  {/* Kategori Video Dinamis */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700">
                        Kategori Video <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setShowInlineAddCategory(showInlineAddCategory === 'video_file' ? null : 'video_file');
                            setInlineCategoryInput('');
                          }}
                          className="text-[11px] text-[#1B5E20] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Kategori Baru</span>
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => {
                            setCategoryModalTab('videos');
                            setShowCategoryModal(true);
                          }}
                          className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                        >
                          Kelola List
                        </button>
                      </div>
                    </div>

                    {/* Inline Quick Add Category Input */}
                    {showInlineAddCategory === 'video_file' && (
                      <div className="flex items-center gap-1.5 p-2 bg-emerald-50/80 border border-emerald-200 rounded-xl">
                        <input
                          type="text"
                          placeholder="Nama kategori video baru..."
                          value={inlineCategoryInput}
                          onChange={(e) => setInlineCategoryInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCategory('videos', inlineCategoryInput);
                            }
                          }}
                          className="flex-1 px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-hidden"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleAddCategory('videos', inlineCategoryInput)}
                          className="px-3 py-1.5 bg-[#1B5E20] text-white rounded-lg text-xs font-bold hover:bg-[#144716] cursor-pointer"
                        >
                          Simpan
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowInlineAddCategory(null);
                            setInlineCategoryInput('');
                          }}
                          className="px-2 py-1.5 text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    )}

                    <select
                      value={videoUploadForm.category}
                      onChange={(e) => setVideoUploadForm({ ...videoUploadForm, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#1B5E20]"
                    >
                      {videoCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Narasumber / Pemateri */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Narasumber / Pemateri</label>
                    <input
                      type="text"
                      placeholder="Contoh: Ustadz Dr. Oni Sahroni, M.A."
                      value={videoUploadForm.speaker}
                      onChange={(e) => setVideoUploadForm({ ...videoUploadForm, speaker: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-[#1B5E20]"
                    />
                  </div>

                  {/* Durasi Video (Manual Input) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Durasi Video (MM:SS) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 14:28 atau 01:15:00"
                        value={videoUploadForm.duration}
                        onChange={(e) => setVideoUploadForm({ ...videoUploadForm, duration: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 focus:bg-white focus:border-[#1B5E20]"
                      />
                    </div>
                  </div>

                  {/* Thumbnail Video: Bisa Upload Gambar atau Link */}
                  <div className="space-y-2 md:col-span-2 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                      <div>
                        <label className="block text-xs font-bold text-slate-800">
                          Gambar Thumbnail / Sampul Video <span className="text-rose-500">*</span>
                        </label>
                        <p className="text-[11px] text-slate-500">
                          Pilih metode: upload gambar dari komputer atau gunakan tautan gambar URL.
                        </p>
                      </div>

                      {/* Toggle Options: Upload vs Link */}
                      <div className="inline-flex p-1 bg-white border border-slate-200 rounded-xl shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setVideoFileImageSource('upload')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            videoFileImageSource === 'upload'
                              ? 'bg-[#1B5E20] text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Upload Gambar
                        </button>
                        <button
                          type="button"
                          onClick={() => setVideoFileImageSource('link')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            videoFileImageSource === 'link'
                              ? 'bg-[#1B5E20] text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          Tautan URL
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 items-center">
                      <div className="sm:col-span-2 space-y-2">
                        {videoFileImageSource === 'upload' ? (
                          <div className="relative border-2 border-dashed border-emerald-300 bg-emerald-50/40 rounded-2xl p-4 text-center hover:bg-emerald-50 transition cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleVideoThumbnailUpload(e, 'upload_file')}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex items-center justify-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#1B5E20] flex items-center justify-center">
                                <Camera className="w-4 h-4" />
                              </div>
                              <div className="text-left">
                                <span className="text-xs font-bold text-slate-800 block">
                                  {videoFileUploadedImageName || 'Pilih atau Seret Foto Thumbnail (PNG/JPG)'}
                                </span>
                                <span className="text-[10px] text-slate-500">Maksimal 5 MB • Rasio 16:9 disarankan</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="relative">
                            <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                            <input
                              type="url"
                              placeholder="https://images.unsplash.com/..."
                              value={videoUploadForm.thumbnailUrl}
                              onChange={(e) => setVideoUploadForm({ ...videoUploadForm, thumbnailUrl: e.target.value })}
                              className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:border-[#1B5E20]"
                            />
                          </div>
                        )}

                        {/* Quick Presets */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] font-bold text-slate-500">Pilihan Cepat:</span>
                          {[
                            { name: 'Kajian Fiqih', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80' },
                            { name: 'Webinar Amwal', url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80' },
                            { name: 'Tutorial Fiqh', url: 'https://images.unsplash.com/photo-1584281722572-8a9d3e8e19e0?w=800&auto=format&fit=crop&q=80' },
                          ].map((preset) => (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => {
                                setVideoUploadForm({ ...videoUploadForm, thumbnailUrl: preset.url });
                                setVideoFileUploadedImageName(preset.name);
                              }}
                              className="text-[10px] px-2 py-0.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md transition cursor-pointer"
                            >
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Live Thumbnail Preview */}
                      <div className="relative aspect-video rounded-xl bg-slate-900 border border-slate-200 overflow-hidden shadow-2xs group flex items-center justify-center">
                        <img
                          src={videoUploadForm.thumbnailUrl}
                          alt="Pratinjau Thumbnail"
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="w-7 h-7 rounded-full bg-white/90 text-[#1B5E20] flex items-center justify-center shadow-xs">
                            <Play className="w-3 h-3 fill-current ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 rounded text-[9px] font-mono text-white font-bold">
                          {videoUploadForm.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deskripsi Video */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Deskripsi Ringkas Video</label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan poin penting yang dibahas dalam video edukasi ini..."
                    value={videoUploadForm.description}
                    onChange={(e) => setVideoUploadForm({ ...videoUploadForm, description: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs text-slate-800 focus:bg-white focus:border-[#1B5E20]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setVideoSubView('list')}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Upload className="w-4 h-4" />
                    Proses Unggah & Terbitkan
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* VIEW: UPLOAD LINK VIDEO (YouTube / Vimeo / Streaming) */}
          {videoSubView === 'upload_link' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-blue-600" />
                    Sematkan Tautan Video Eksternal (YouTube / Webinar Link)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Tautkan video siaran kajian dari YouTube, Vimeo, atau rekaman Zoom meeting.
                  </p>
                </div>
              </div>

              <form onSubmit={handleUploadVideoLink} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Tautan URL Streaming */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Tautan URL Streaming Video <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="url"
                        required
                        placeholder="https://www.youtube.com/watch?v=... atau https://vimeo.com/..."
                        value={videoLinkForm.videoUrl}
                        onChange={(e) => setVideoLinkForm({ ...videoLinkForm, videoUrl: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-[#1B5E20]"
                      />
                    </div>
                  </div>

                  {/* Judul Video */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Judul Video Kajian <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Webinar Nasional: Optimalisasi CWLS untuk Kemaslahatan Ummat..."
                      value={videoLinkForm.title}
                      onChange={(e) => setVideoLinkForm({ ...videoLinkForm, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white"
                    />
                  </div>

                  {/* Kategori Video Dinamis */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700">
                        Kategori Video <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setShowInlineAddCategory(showInlineAddCategory === 'video_link' ? null : 'video_link');
                            setInlineCategoryInput('');
                          }}
                          className="text-[11px] text-[#1B5E20] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Kategori Baru</span>
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => {
                            setCategoryModalTab('videos');
                            setShowCategoryModal(true);
                          }}
                          className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                        >
                          Kelola List
                        </button>
                      </div>
                    </div>

                    {/* Inline Quick Add Category Input */}
                    {showInlineAddCategory === 'video_link' && (
                      <div className="flex items-center gap-1.5 p-2 bg-emerald-50/80 border border-emerald-200 rounded-xl">
                        <input
                          type="text"
                          placeholder="Nama kategori video baru..."
                          value={inlineCategoryInput}
                          onChange={(e) => setInlineCategoryInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCategory('videos', inlineCategoryInput);
                            }
                          }}
                          className="flex-1 px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-hidden"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleAddCategory('videos', inlineCategoryInput)}
                          className="px-3 py-1.5 bg-[#1B5E20] text-white rounded-lg text-xs font-bold hover:bg-[#144716] cursor-pointer"
                        >
                          Simpan
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowInlineAddCategory(null);
                            setInlineCategoryInput('');
                          }}
                          className="px-2 py-1.5 text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    )}

                    <select
                      value={videoLinkForm.category}
                      onChange={(e) => setVideoLinkForm({ ...videoLinkForm, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#1B5E20]"
                    >
                      {videoCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Narasumber / Lembaga Penyelenggara */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Pemateri / Lembaga</label>
                    <input
                      type="text"
                      placeholder="Contoh: Komite Nasional Ekonomi dan Keuangan Syariah (KNEKS)"
                      value={videoLinkForm.speaker}
                      onChange={(e) => setVideoLinkForm({ ...videoLinkForm, speaker: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white"
                    />
                  </div>

                  {/* Durasi Video (Manual Input) */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Durasi Video (Format MM:SS atau JJ:MM:SS) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 28:45 atau 01:30:00"
                        value={videoLinkForm.duration}
                        onChange={(e) => setVideoLinkForm({ ...videoLinkForm, duration: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 focus:bg-white focus:border-[#1B5E20]"
                      />
                    </div>
                  </div>

                  {/* Thumbnail Video Link: Bisa Upload Gambar atau Link */}
                  <div className="space-y-2 md:col-span-2 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                      <div>
                        <label className="block text-xs font-bold text-slate-800">
                          Gambar Thumbnail / Sampul Video Streaming <span className="text-rose-500">*</span>
                        </label>
                        <p className="text-[11px] text-slate-500">
                          Pilih metode: upload gambar dari komputer atau gunakan tautan gambar URL.
                        </p>
                      </div>

                      {/* Toggle Options: Upload vs Link */}
                      <div className="inline-flex p-1 bg-white border border-slate-200 rounded-xl shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setVideoLinkImageSource('upload')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            videoLinkImageSource === 'upload'
                              ? 'bg-[#1B5E20] text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Upload Gambar
                        </button>
                        <button
                          type="button"
                          onClick={() => setVideoLinkImageSource('link')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            videoLinkImageSource === 'link'
                              ? 'bg-[#1B5E20] text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          Tautan URL
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 items-center">
                      <div className="sm:col-span-2 space-y-2">
                        {videoLinkImageSource === 'upload' ? (
                          <div className="relative border-2 border-dashed border-emerald-300 bg-emerald-50/40 rounded-2xl p-4 text-center hover:bg-emerald-50 transition cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleVideoThumbnailUpload(e, 'upload_link')}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex items-center justify-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#1B5E20] flex items-center justify-center">
                                <Camera className="w-4 h-4" />
                              </div>
                              <div className="text-left">
                                <span className="text-xs font-bold text-slate-800 block">
                                  {videoLinkUploadedImageName || 'Pilih atau Seret Foto Thumbnail (PNG/JPG)'}
                                </span>
                                <span className="text-[10px] text-slate-500">Maksimal 5 MB • Rasio 16:9 disarankan</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="relative">
                            <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                            <input
                              type="url"
                              placeholder="https://images.unsplash.com/..."
                              value={videoLinkForm.thumbnailUrl}
                              onChange={(e) => setVideoLinkForm({ ...videoLinkForm, thumbnailUrl: e.target.value })}
                              className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:border-[#1B5E20]"
                            />
                          </div>
                        )}

                        {/* Quick Presets */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] font-bold text-slate-500">Pilihan Cepat:</span>
                          {[
                            { name: 'Webinar Nasional', url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80' },
                            { name: 'Kajian CWLS', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80' },
                            { name: 'Diskusi Syariah', url: 'https://images.unsplash.com/photo-1584281722572-8a9d3e8e19e0?w=800&auto=format&fit=crop&q=80' },
                          ].map((preset) => (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => {
                                setVideoLinkForm({ ...videoLinkForm, thumbnailUrl: preset.url });
                                setVideoLinkUploadedImageName(preset.name);
                              }}
                              className="text-[10px] px-2 py-0.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md transition cursor-pointer"
                            >
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Live Thumbnail Preview */}
                      <div className="relative aspect-video rounded-xl bg-slate-900 border border-slate-200 overflow-hidden shadow-2xs group flex items-center justify-center">
                        <img
                          src={videoLinkForm.thumbnailUrl}
                          alt="Pratinjau Thumbnail"
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="w-7 h-7 rounded-full bg-white/90 text-[#1B5E20] flex items-center justify-center shadow-xs">
                            <Play className="w-3 h-3 fill-current ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 rounded text-[9px] font-mono text-white font-bold">
                          {videoLinkForm.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Deskripsi Materi</label>
                  <textarea
                    rows={3}
                    placeholder="Deskripsi singkat konten webinar..."
                    value={videoLinkForm.description}
                    onChange={(e) => setVideoLinkForm({ ...videoLinkForm, description: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs text-slate-800 focus:bg-white focus:border-[#1B5E20]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setVideoSubView('list')}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Link2 className="w-4 h-4" />
                    Sematkan Video
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* VIEW: DISKUSI VIDEO (Dengan Timestamp Materi) */}
          {videoSubView === 'discussion' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                    Tanya Jawab & Diskusi Video: {currentVideo.title}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Diskusi berstempel waktu (timestamp) untuk membedah materi kajian.
                  </p>
                </div>
                <select
                  value={selectedVideoId}
                  onChange={(e) => setSelectedVideoId(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                >
                  {videos.map((vid) => (
                    <option key={vid.id} value={vid.id}>
                      {vid.title.slice(0, 35)}...
                    </option>
                  ))}
                </select>
              </div>

              {/* Form Tambah Diskusi Video dengan Timestamp */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="w-full sm:w-36">
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Timestamp</label>
                    <input
                      type="text"
                      placeholder="MM:SS (misal 04:20)"
                      value={videoCommentTimestamp}
                      onChange={(e) => setVideoCommentTimestamp(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-center font-bold"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Jawaban / Catatan Admin</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Tuliskan catatan kajian atau klarifikasi hukum syariah..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:border-[#1B5E20]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddDiscussionReply('video', selectedVideoId);
                        }}
                      />
                      <button
                        onClick={() => handleAddDiscussionReply('video', selectedVideoId)}
                        className="px-4 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Kirim
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daftar Diskusi Video */}
              <div className="space-y-3">
                {currentVideo.discussions.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-400 text-xs">
                    Belum ada diskusi jamaah pada video ini.
                  </div>
                ) : (
                  currentVideo.discussions.map((disc) => (
                    <div
                      key={disc.id}
                      className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-900 font-bold text-xs flex items-center justify-center">
                            {disc.avatarText}
                          </div>
                          <span className="text-xs font-bold text-slate-900">{disc.authorName}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                            {disc.authorRole}
                          </span>
                        </div>
                        {disc.videoTimestamp && (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-800 text-[10px] font-mono font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {disc.videoTimestamp}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed pl-9">{disc.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BACA ARTIKEL LENGKAP & SIMULASI KUIS                                */}
      {/* ========================================================================= */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 flex flex-col">
            {/* Minimalist Reader Modal Header */}
            <div className="bg-white/90 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 bg-emerald-50 text-[#1B5E20] font-bold text-[11px] rounded-full border border-emerald-200">
                  {previewArticle.category}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 font-medium">{previewArticle.publishDate}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-xl transition cursor-pointer"
                  title="Cetak Artikel"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewArticle(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                  title="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reading Content Area */}
            <div className="p-6 sm:p-10 space-y-6">
              {/* Header Title & Author */}
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight tracking-tight">
                  {previewArticle.title}
                </h1>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ditulis oleh <strong>{previewArticle.author}</strong></span>
                </div>
              </div>

              {/* Banner Cover Image */}
              {previewArticle.coverImage && (
                <div className="h-60 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs">
                  <img
                    src={previewArticle.coverImage}
                    alt={previewArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Ringkasan / Lead paragraph */}
              {previewArticle.summary && (
                <div className="p-4 bg-slate-50 border-l-3 border-emerald-600 rounded-r-xl text-sm font-medium text-slate-700 italic leading-relaxed">
                  {previewArticle.summary}
                </div>
              )}

              {/* Isi Dokumen Formatted */}
              <div className="text-sm sm:text-base leading-relaxed text-slate-800 space-y-4 pt-2">
                {renderRichArticleContent(previewArticle.content)}
              </div>

              {/* Kuis Interaktif Section */}
              {previewArticle.quiz && previewArticle.quiz.length > 0 && (
                <div className="mt-8 p-5 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-amber-700" />
                      Uji Pemahaman: Kuis ({previewArticle.quiz.length} Soal)
                    </h3>
                    <span className="text-[10px] font-mono text-amber-800 font-bold">100 Poin Total</span>
                  </div>

                  <div className="space-y-3">
                    {previewArticle.quiz.map((q, idx) => (
                      <div key={q.id} className="p-3.5 bg-white rounded-xl border border-amber-200 text-xs space-y-2">
                        <span className="font-bold text-slate-900 block">
                          {idx + 1}. {q.question}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {q.options.map((opt, oIdx) => (
                            <button
                              key={opt.id}
                              onClick={() => {
                                const isCorrect = opt.id === q.correctOptionId;
                                showToast({
                                  title: isCorrect ? 'Jawaban Anda Benar! (+25 Poin)' : 'Jawaban Kurang Tepat',
                                  description: q.explanation,
                                  type: isCorrect ? 'success' : 'info',
                                });
                              }}
                              className="p-2 text-left bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 rounded-lg border border-slate-200 text-[11px] text-slate-700 cursor-pointer transition"
                            >
                              {String.fromCharCode(65 + oIdx)}. {opt.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleToggleArticleLike(previewArticle.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
                    previewArticle.isLikedByUser
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${previewArticle.isLikedByUser ? 'fill-current' : ''}`} />
                  <span>Suka ({previewArticle.likesCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewArticle(null)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PLAYER VIDEO                                                      */}
      {/* ========================================================================= */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-[#1B5E20] font-extrabold uppercase">
                  {previewVideo.category}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">{previewVideo.title}</h3>
              </div>
              <button
                onClick={() => setPreviewVideo(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Box */}
            <div className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden flex items-center justify-center">
              <video
                controls
                autoPlay
                src={previewVideo.videoUrl}
                poster={previewVideo.thumbnailUrl}
                className="w-full h-full object-contain"
              >
                Browser Anda tidak mendukung tag video.
              </video>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Pemateri: <strong className="text-slate-900">{previewVideo.speaker}</strong></span>
              <span>Durasi: {previewVideo.duration}</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              {previewVideo.description}
            </p>

            <div className="flex items-center justify-between pt-2 border-t">
              <button
                onClick={() => handleToggleVideoLike(previewVideo.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
                  previewVideo.isLikedByUser
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${previewVideo.isLikedByUser ? 'fill-current' : ''}`} />
                <span>Suka ({previewVideo.likesCount})</span>
              </button>

              <button
                onClick={() => setPreviewVideo(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Selesai Menonton
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: KELOLA KATEGORI EDUKASI (ARTIKEL & VIDEO)                          */}
      {/* ========================================================================= */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#1B5E20] flex items-center justify-center">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Kelola Kategori Edukasi</h3>
                  <p className="text-xs text-slate-500">
                    Tambah, perbarui, atau hapus kategori untuk artikel dan video.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setEditingCategoryIndex(null);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Selector: Artikel vs Video */}
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setCategoryModalTab('articles');
                  setEditingCategoryIndex(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  categoryModalTab === 'articles'
                    ? 'bg-white text-[#1B5E20] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Kategori Artikel ({articleCategories.length})</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategoryModalTab('videos');
                  setEditingCategoryIndex(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  categoryModalTab === 'videos'
                    ? 'bg-white text-[#1B5E20] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Kategori Video ({videoCategories.length})</span>
              </button>
            </div>

            {/* Form Tambah Kategori Baru */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Tambah Kategori {categoryModalTab === 'articles' ? 'Artikel' : 'Video'} Baru
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Contoh: ${categoryModalTab === 'articles' ? 'Zakat Saham, Sukuk Ritel...' : 'Podcast Syariah, Live Webinar...'}`}
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCategory(categoryModalTab, newCategoryName);
                    }
                  }}
                  className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-[#1B5E20] focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => handleAddCategory(categoryModalTab, newCategoryName)}
                  className="px-4 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </button>
              </div>
            </div>

            {/* List Kategori yang Ada */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wider">
                <span>Daftar Kategori</span>
                <span>Tindakan</span>
              </div>

              {(categoryModalTab === 'articles' ? articleCategories : videoCategories).map((cat, idx) => {
                const isEditing = editingCategoryIndex === idx;
                const usageCount = categoryModalTab === 'articles'
                  ? articles.filter((a) => a.category === cat).length
                  : videos.filter((v) => v.category === cat).length;

                return (
                  <div
                    key={cat}
                    className="flex items-center justify-between gap-2 p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition group"
                  >
                    {isEditing ? (
                      <div className="flex-1 flex items-center gap-1.5">
                        <input
                          type="text"
                          value={editingCategoryText}
                          onChange={(e) => setEditingCategoryText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleUpdateCategory(categoryModalTab, idx, editingCategoryText);
                            }
                          }}
                          className="flex-1 px-2.5 py-1 bg-slate-50 border border-emerald-400 rounded-lg text-xs font-semibold text-slate-900 focus:outline-hidden"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleUpdateCategory(categoryModalTab, idx, editingCategoryText)}
                          className="px-2.5 py-1 bg-[#1B5E20] text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-[#144716]"
                        >
                          Simpan
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCategoryIndex(null)}
                          className="px-2 py-1 text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span className="text-xs font-bold text-slate-800">{cat}</span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-mono">
                            {usageCount} {categoryModalTab === 'articles' ? 'artikel' : 'video'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCategoryIndex(idx);
                              setEditingCategoryText(cat);
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="Edit Kategori"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(categoryModalTab, idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Hapus Kategori"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowCategoryModal(false);
                  setEditingCategoryIndex(null);
                }}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
