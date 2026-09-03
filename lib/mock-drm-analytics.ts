/**
 * DATA SIMULASI -- BUKAN DATA ASLI
 * File ini HANYA untuk ilustrasi visual widget DRM lanjutan
 * (RFMD, Cohort, Churn) yang pipeline datanya belum dibangun.
 * Lihat DECISION_LOG.md Putaran 6 & 9.
 * JANGAN import file ini ke luar folder widget DRM manapun.
 */

// ============================================================
// RFMD 4 Mini KPI Cards (Overview Section)
// ============================================================
export const mockRfmdKpis = [
  {
    title: 'Keaktifan Donatur',
    value: '68',
    unit: 'hari sekali',
    change: '-12 hari (Lebih Cepat)',
    desc: 'Rata-rata waktu donatur kembali berdonasi sejak transaksi terakhir',
  },
  {
    title: 'Frekuensi Donasi',
    value: '4.2',
    unit: 'kali transaksi',
    change: '+0.8x Naik',
    desc: 'Rata-rata jumlah donasi yang dilakukan setiap donatur',
  },
  {
    title: 'Rata-rata Nominal',
    value: 'Rp 842.000',
    unit: '',
    change: '+15% Naik',
    desc: 'Besar donasi rata-rata per sekali transaksi (Waqf & Infaq)',
  },
  {
    title: 'Variasi Program',
    value: '2.3',
    unit: 'Jenis Program',
    change: '+0.4 Jenis Program',
    desc: 'Rata-rata ragam jenis donasi yang diikuti (Waqf, Infaq, Sedekah)',
  },
];

// ============================================================
// Box A: RFMD Donut Chart — Donor Segment Distribution
// ============================================================
export const mockDonorSegments = [
  {
    name: 'Champion',
    value: 12,
    color: '#1B5E20',
    count: '1.450 donor',
    desc: 'Nilai & frekuensi tertinggi',
  },
  {
    name: 'Loyal',
    value: 22,
    color: '#2E7D32',
    count: '2.660 donor',
    desc: 'Rutin berdonasi berkala',
  },
  {
    name: 'New',
    value: 28,
    color: '#4CAF50',
    count: '3.380 donor',
    desc: 'Bergabung < 30 hari',
  },
  {
    name: 'At-Risk',
    value: 20,
    color: '#E65100',
    count: '2.420 donor',
    desc: 'Keaktifan menurun > 60 hari',
  },
  {
    name: 'Lapsed',
    value: 13,
    color: '#C62828',
    count: '1.570 donor',
    desc: 'Tidak ada transaksi > 180 hari',
  },
  {
    name: 'Situational',
    value: 5,
    color: '#00838F',
    count: '600 donor',
    desc: 'Berdonasi saat bencana/ramadhan',
  },
];

// ============================================================
// Box B: Cohort Retention Heatmap M0-M5
// ============================================================
export const mockCohortMatrix = [
  {
    month: "Jan '25",
    count: 1240,
    ltv: 'Rp 3.420.000',
    m0: 100,
    m1: 68,
    m2: 54,
    m3: 48,
    m4: 42,
    m5: 39,
  },
  {
    month: "Feb '25",
    count: 1450,
    ltv: 'Rp 3.850.000',
    m0: 100,
    m1: 72,
    m2: 58,
    m3: 51,
    m4: 46,
    m5: null,
  },
  {
    month: "Mar '25",
    count: 1680,
    ltv: 'Rp 4.100.000',
    m0: 100,
    m1: 75,
    m2: 62,
    m3: 55,
    m4: null,
    m5: null,
  },
  {
    month: "Apr '25",
    count: 1920,
    ltv: 'Rp 3.950.000',
    m0: 100,
    m1: 71,
    m2: 59,
    m3: null,
    m4: null,
    m5: null,
  },
  {
    month: "May '25",
    count: 2150,
    ltv: 'Rp 4.250.000',
    m0: 100,
    m1: 76,
    m2: null,
    m3: null,
    m4: null,
    m5: null,
  },
  {
    month: "Jun '25",
    count: 2480,
    ltv: 'Rp 4.600.000',
    m0: 100,
    m1: null,
    m2: null,
    m3: null,
    m4: null,
    m5: null,
  },
];

// ============================================================
// Box C & D: Markov Churn Transition Matrix + Action Hub
// ============================================================
export const mockChurnSegments = ['Champion', 'Loyal', 'New', 'At-Risk', 'Lapsed'];

export const mockChurnPredictions = {
  /** 5x5 Markov transition matrix — rows = fromState, cols = toState */
  markovMatrix: [
    [68.4, 24.2, 0.0, 5.2, 2.2],   // From Champion
    [15.8, 58.2, 0.0, 18.4, 7.6],  // From Loyal
    [8.5, 32.1, 22.4, 25.0, 12.0], // From New
    [2.1, 11.3, 0.0, 56.6, 30.0],  // From At-Risk -> Lapsed (HIGH RISK!)
    [0.5, 3.2, 0.0, 12.1, 84.2],   // From Lapsed
  ],

  /** Action Hub alert items for Box D */
  actionAlerts: [
    {
      id: 'alert-at-risk-lapsed',
      severity: 'HIGH' as const,
      label: 'At-Risk Berisiko Pasif (30.0%)',
      count: '2.420 donor',
      description:
        'Ada 2.420 donatur yang belum berdonasi lagi dalam 60 hari terakhir. Perlu disapa kembali!',
      primaryAction: 'Kirim Pesan Sapaan',
      secondaryAction: 'Kontak Pengelola',
    },
    {
      id: 'alert-loyal-atrisk',
      severity: 'MEDIUM' as const,
      label: 'Loyal Berisiko Menurun (18.4%)',
      count: '2.660 donor',
      description:
        'Donatur rutin yang belum mengaktifkan pengingat donasi bulanan (autodebet).',
      primaryAction: 'Tawarkan Autodebet',
      secondaryAction: null,
    },
  ],

  /** Strategy chips per segment shown at bottom of Box D */
  strategyChips: [
    {
      segment: 'Champion',
      strategy: '"Ajak menjadi Duta Waqf Abadi"',
      colorClass: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    },
    {
      segment: 'Donatur Baru',
      strategy: '"Kirim laporan dampak dalam 30 hari"',
      colorClass: 'bg-blue-50 border-blue-200 text-blue-900',
    },
    {
      segment: 'Musiman',
      strategy: '"Ingatkan saat Program Ramadhan & Bencana"',
      colorClass: 'bg-slate-100 border-slate-200 text-slate-800',
    },
  ],
};

// ============================================================
// Mock Donors List for Full Donor Segmentation Table (/admin/segmentasi)
// ============================================================
export interface MockDonor {
  id: string;
  name: string;
  email: string;
  phone: string;
  segment: 'Champion' | 'Loyal' | 'New' | 'At-Risk' | 'Lapsed' | 'Situational';
  incomeRange: string;
  recency: string;
  recencyDays: number;
  frequency: number;
  monetary: string;
  monetaryVal: number;
  diversity: number;
  akads: string[];
  lastAkad: string;
  rfmdScore: string;
  status: string;
}

export const mockDonorsList: MockDonor[] = [
  {
    id: 'DNR-8401',
    name: 'H. Bambang Soewito',
    email: 'bambang.s@gmail.com',
    phone: '+62 812-9840-1122',
    segment: 'Champion',
    incomeRange: '> Rp 50 Jt/bln',
    recency: '8 hari lalu',
    recencyDays: 8,
    frequency: 18,
    monetary: 'Rp 48.500.000',
    monetaryVal: 48500000,
    diversity: 4,
    akads: ['Waqf Uang', 'Waqf Pembangunan', 'Infaq Subuh', 'Zakat Maal'],
    lastAkad: 'Waqf Pembangunan Klinik Al-Azhar',
    rfmdScore: 'R: 5 | F: 5 | M: 5 | D: 4',
    status: 'Sangat Aktif',
  },
  {
    id: 'DNR-8402',
    name: 'Hj. Siti Rahmah, S.E.',
    email: 'siti.rahmah@yahoo.co.id',
    phone: '+62 811-2345-6789',
    segment: 'Loyal',
    incomeRange: 'Rp 25-50 Jt/bln',
    recency: '15 hari lalu',
    recencyDays: 15,
    frequency: 12,
    monetary: 'Rp 14.200.000',
    monetaryVal: 14200000,
    diversity: 3,
    akads: ['Waqf Uang', 'Infaq Operasional Ambulans', 'Sedekah Subuh'],
    lastAkad: 'Infaq Operasional Ambulans Gratis',
    rfmdScore: 'R: 4 | F: 4 | M: 4 | D: 3',
    status: 'Aktif Rutin',
  },
  {
    id: 'DNR-8403',
    name: 'Ahmad Subandi',
    email: 'ahmad.subandi@gmail.com',
    phone: '+62 856-7788-9900',
    segment: 'New',
    incomeRange: 'Rp 10-20 Jt/bln',
    recency: '4 hari lalu',
    recencyDays: 4,
    frequency: 1,
    monetary: 'Rp 1.500.000',
    monetaryVal: 1500000,
    diversity: 1,
    akads: ['Waqf Sumur Air Bersih Sukabumi'],
    lastAkad: 'Sumur Waqf Sukabumi',
    rfmdScore: 'R: 5 | F: 1 | M: 2 | D: 1',
    status: 'Onboarding 30 Hari',
  },
  {
    id: 'DNR-8404',
    name: 'Drs. Irwan Wijaya',
    email: 'irwan.w@corporate.co.id',
    phone: '+62 813-1122-3344',
    segment: 'At-Risk',
    incomeRange: 'Rp 15-30 Jt/bln',
    recency: '72 hari lalu',
    recencyDays: 72,
    frequency: 7,
    monetary: 'Rp 8.900.000',
    monetaryVal: 8900000,
    diversity: 2,
    akads: ['Waqf Uang', 'Infaq Masjid'],
    lastAkad: 'Waqf Uang Masjid Al-Kautsar',
    rfmdScore: 'R: 2 | F: 3 | M: 3 | D: 2',
    status: 'Butuh Retargeting',
  },
  {
    id: 'DNR-8405',
    name: 'Dr. Hj. Nurhayati',
    email: 'nurhayati.dr@gmail.com',
    phone: '+62 818-0909-1212',
    segment: 'Lapsed',
    incomeRange: 'Rp 10-25 Jt/bln',
    recency: '194 hari lalu',
    recencyDays: 194,
    frequency: 3,
    monetary: 'Rp 3.200.000',
    monetaryVal: 3200000,
    diversity: 1,
    akads: ['Infaq Bencana'],
    lastAkad: 'Infaq Bencana Alam Cianjur',
    rfmdScore: 'R: 1 | F: 2 | M: 2 | D: 1',
    status: 'Inaktif > 6 Bulan',
  },
  {
    id: 'DNR-8406',
    name: 'Muhamad Rizky, S.T.',
    email: 'm.rizky@tech.id',
    phone: '+62 878-3344-5566',
    segment: 'Situational',
    incomeRange: 'Rp 10-25 Jt/bln',
    recency: '45 hari lalu',
    recencyDays: 45,
    frequency: 2,
    monetary: 'Rp 2.000.000',
    monetaryVal: 2000000,
    diversity: 2,
    akads: ['Zakat Maal', 'Sedekah Ramadhan'],
    lastAkad: 'Zakat Maal Akhir Tahun',
    rfmdScore: 'R: 3 | F: 1 | M: 2 | D: 2',
    status: 'Sensitif Event',
  },
];
