/**
 * DATA SIMULASI -- BUKAN DATA ASLI
 * File ini HANYA untuk ilustrasi visual widget DRM lanjutan
 * (RFMD, Cohort, Churn) yang pipeline datanya belum dibangun.
 * Lihat DECISION_LOG.md Putaran 6 & 9.
 * JANGAN import file ini ke luar folder widget DRM manapun.
 */

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
