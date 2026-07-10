export interface PointsHistoryItem {
  id: string;
  title: string;
  points: number;
  type: 'plus' | 'minus';
  date: string;
}

const DEFAULT_POINTS = 150;
const DEFAULT_HISTORY: PointsHistoryItem[] = [
  {
    id: 'h1',
    title: 'Pendaftaran Akun Baru',
    points: 100,
    type: 'plus',
    date: '10 Mei 2026'
  },
  {
    id: 'h2',
    title: 'Melengkapi Kuesioner Profil',
    points: 50,
    type: 'plus',
    date: '11 Mei 2026'
  }
];

export function getPoints(): number {
  if (typeof window === 'undefined') return DEFAULT_POINTS;
  const points = localStorage.getItem('amwal_total_points');
  if (points === null) {
    localStorage.setItem('amwal_total_points', String(DEFAULT_POINTS));
    return DEFAULT_POINTS;
  }
  return Number(points);
}

export function getPointsHistory(): PointsHistoryItem[] {
  if (typeof window === 'undefined') return DEFAULT_HISTORY;
  const history = localStorage.getItem('amwal_points_history');
  if (history === null) {
    localStorage.setItem('amwal_points_history', JSON.stringify(DEFAULT_HISTORY));
    return DEFAULT_HISTORY;
  }
  return JSON.parse(history);
}

export function addPoints(amount: number, reason: string): number {
  if (typeof window === 'undefined') return DEFAULT_POINTS;
  const currentPoints = getPoints();
  const newPoints = currentPoints + amount;
  localStorage.setItem('amwal_total_points', String(newPoints));

  const history = getPointsHistory();
  const today = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const formattedDate = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

  const newItem: PointsHistoryItem = {
    id: 'h_' + Date.now(),
    title: reason,
    points: amount,
    type: amount >= 0 ? 'plus' : 'minus',
    date: formattedDate
  };

  const updatedHistory = [newItem, ...history];
  localStorage.setItem('amwal_points_history', JSON.stringify(updatedHistory));

  // Trigger a custom event so listener screens can reload instantly if needed
  window.dispatchEvent(new Event('amwal_points_updated'));

  return newPoints;
}

export function getLastCheckInDate(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('amwal_last_checkin_date');
}

export function canCheckInToday(): boolean {
  if (typeof window === 'undefined') return false;
  const todayStr = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
  const lastCheckIn = getLastCheckInDate();
  return lastCheckIn !== todayStr;
}

export function checkInDaily(): { success: boolean; pointsAdded: number; newTotal: number } {
  if (typeof window === 'undefined') {
    return { success: false, pointsAdded: 0, newTotal: DEFAULT_POINTS };
  }
  if (!canCheckInToday()) {
    return { success: false, pointsAdded: 0, newTotal: getPoints() };
  }

  const pointsAdded = 50;
  const todayStr = new Date().toISOString().split('T')[0];
  localStorage.setItem('amwal_last_checkin_date', todayStr);
  
  const newTotal = addPoints(pointsAdded, 'Presensi Harian (Absen Berkah)');
  return { success: true, pointsAdded, newTotal };
}
