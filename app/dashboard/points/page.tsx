"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Award, 
  CheckCircle2, 
  Coins, 
  Calendar, 
  BookOpen, 
  ArrowUpRight, 
  Clock,
  Sparkles,
  Zap
} from 'lucide-react';
import { 
  getPoints, 
  getPointsHistory, 
  canCheckInToday, 
  checkInDaily, 
  PointsHistoryItem 
} from '@/lib/points';

export default function PointsPage() {
  const router = useRouter();
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [history, setHistory] = useState<PointsHistoryItem[]>([]);
  const [canCheckIn, setCanCheckIn] = useState<boolean>(false);
  const [checkInSuccess, setCheckInSuccess] = useState<string | null>(null);

  const loadPointsData = () => {
    setTotalPoints(getPoints());
    setHistory(getPointsHistory());
    setCanCheckIn(canCheckInToday());
  };

  useEffect(() => {
    loadPointsData();

    // Listen to points updates dynamically
    const handlePointsUpdated = () => {
      loadPointsData();
    };
    window.addEventListener('amwal_points_updated', handlePointsUpdated);
    return () => {
      window.removeEventListener('amwal_points_updated', handlePointsUpdated);
    };
  }, []);

  const handleCheckInNow = () => {
    const res = checkInDaily();
    if (res.success) {
      setCheckInSuccess(`Masya Allah! Berhasil melakukan absensi harian. Anda mendapatkan +${res.pointsAdded} XP Berkah!`);
      loadPointsData();
      setTimeout(() => {
        setCheckInSuccess(null);
      }, 4000);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative flex flex-col w-full border-x border-gray-100 shadow-xs pb-20">
      {/* Sticky Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-10 border-b border-gray-100 shadow-3xs">
        <button onClick={() => router.back()} className="text-gray-600 hover:text-amwal-secondary-teal p-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer">
          <ArrowLeft size={22} />
        </button>
        <span className="text-[10px] font-bold text-amwal-secondary-teal uppercase tracking-wider bg-amwal-secondary-teal/5 px-3 py-1 rounded-full border border-amwal-secondary-teal/15">
          Poin Berkah & Level Akun
        </span>
        <button className="text-gray-400 p-1.5 cursor-pointer">
          <Award size={20} className="text-amwal-secondary-teal" />
        </button>
      </div>

      {/* Point Card Banner */}
      <div className="mx-4 mt-4 bg-gradient-to-br from-amwal-secondary-teal to-teal-950 text-white rounded-2xl p-5 shadow-md relative overflow-hidden">
        {/* Decorative ambient blobs */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-teal-500/20 rounded-full blur-2xl"></div>
        <div className="absolute top-2 right-4 text-teal-350 opacity-20 select-none pointer-events-none">
          <Coins size={110} />
        </div>

        <div className="relative z-10 space-y-4">
          <div>
            <span className="text-[9px] bg-white/25 text-amber-250 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
              Total Akumulasi XP Anda
            </span>
            <div className="flex items-baseline space-x-2 mt-1.5">
              <span className="text-3xl font-black font-mono tracking-tight text-white">{totalPoints}</span>
              <span className="text-[10px] text-teal-200 font-bold">XP Berkah</span>
            </div>
          </div>

          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden w-full relative">
            <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((totalPoints / 1000) * 100, 100)}%` }}></div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-bold text-teal-100">
            <span>Level 1 (Mubtadi)</span>
            <span>Target: 1.000 XP untuk Level 2</span>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {checkInSuccess && (
        <div className="mx-4 mt-3 bg-amber-500 text-white px-4 py-3 rounded-xl shadow-md border border-amber-600 flex items-start space-x-2 animate-bounce">
          <Sparkles size={18} className="shrink-0 mt-0.5 text-amber-100" />
          <p className="text-xs font-bold leading-normal">{checkInSuccess}</p>
        </div>
      )}

      {/* Absen Harian Section */}
      <div className="mx-4 mt-4 bg-white border border-gray-150 rounded-2xl p-4.5 shadow-3xs">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center">
              <Calendar className="text-amwal-secondary-teal mr-1.5" size={15} />
              Absensi Berkah Harian
            </h3>
            <p className="text-[10.5px] text-gray-500 leading-normal max-w-xs">
              Dapatkan +50 XP gratis setiap hari hanya dengan menekan tombol masuk aplikasi.
            </p>
          </div>
          <span className="text-[9px] bg-amwal-secondary-teal/5 text-amwal-secondary-teal font-black px-2 py-0.5 rounded-md border border-amwal-secondary-teal/15">
            Harian
          </span>
        </div>

        <div className="mt-4">
          {canCheckIn ? (
            <button
              onClick={handleCheckInNow}
              className="w-full py-2.5 bg-amwal-secondary-teal hover:bg-amwal-secondary-teal/90 text-white text-xs font-extrabold rounded-xl shadow-xs transition active:scale-98 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Zap size={14} className="text-amber-300 fill-amber-300" />
              <span>Absen & Klaim 50 XP Sekarang</span>
            </button>
          ) : (
            <div className="w-full py-2.5 bg-gray-100 border border-gray-200 text-gray-500 text-xs font-bold rounded-xl flex items-center justify-center space-x-2">
              <CheckCircle2 size={14} className="text-amwal-secondary-teal" />
              <span>Sudah Absen Hari ini (Besok masuk lagi)</span>
            </div>
          )}
        </div>
      </div>

      {/* Misi Tambahan */}
      <div className="mx-4 mt-4">
        <h3 className="text-xs font-black text-gray-700 uppercase tracking-widest mb-2 px-1">
          Kumpulkan Lebih Banyak XP
        </h3>
        <div className="bg-white border border-gray-150 rounded-2xl divide-y divide-gray-100 overflow-hidden shadow-3xs">
          
          <div className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition cursor-pointer" onClick={() => router.push('/education')}>
            <div className="flex items-start space-x-3 pr-2">
              <div className="bg-blue-50 text-blue-700 p-2.5 rounded-xl border border-blue-100 shadow-3xs">
                <BookOpen size={16} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-extrabold text-gray-800">Menyelesaikan Kuis Edukasi</h4>
                <p className="text-[10px] text-gray-400">Kerjakan kuis di setiap akhir artikel.</p>
              </div>
            </div>
            <div className="text-right flex-none">
              <span className="text-[10px] font-bold text-blue-755 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                +100 XP
              </span>
              <span className="text-[9px] text-gray-400 block mt-0.5 font-medium">Materi Fikih</span>
            </div>
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition cursor-pointer" onClick={() => router.push('/catalog')}>
            <div className="flex items-start space-x-3 pr-2">
              <div className="bg-amber-50 text-amber-700 p-2.5 rounded-xl border border-amber-100 shadow-3xs">
                <ArrowUpRight size={16} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-extrabold text-gray-800">Melakukan Wakaf Produktif</h4>
                <p className="text-[10px] text-gray-400">Salurkan donasi wakaf kemanusiaan.</p>
              </div>
            </div>
            <div className="text-right flex-none">
              <span className="text-[10px] font-bold text-amber-755 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">
                +200 XP
              </span>
              <span className="text-[9px] text-gray-400 block mt-0.5 font-medium">Sekali Donasi</span>
            </div>
          </div>

        </div>
      </div>

      {/* Histori Poin */}
      <div className="mx-4 mt-5 pb-8">
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-xs font-black text-gray-700 uppercase tracking-widest flex items-center">
            <Clock size={13} className="mr-1.5 text-gray-400" />
            Histori Perolehan XP
          </h3>
          <span className="text-[10px] text-gray-450 font-bold">{history.length} amalan</span>
        </div>

        {history.length === 0 ? (
          <div className="bg-white border border-gray-150 rounded-2xl p-6 text-center text-gray-400 text-xs">
            Belum ada catatan histori. Mulai dengan absen di atas!
          </div>
        ) : (
          <div className="bg-white border border-gray-150 rounded-2xl divide-y divide-gray-100 overflow-hidden shadow-3xs text-left">
            {history.map((item) => (
              <div key={item.id} className="p-3.5 flex items-center justify-between">
                <div className="space-y-0.5 pr-2">
                  <h4 className="text-xs font-bold text-gray-850 line-clamp-1 leading-normal">{item.title}</h4>
                  <p className="text-[9px] text-gray-400 font-semibold">{item.date} • Berhasil Tercatat</p>
                </div>
                <div className="text-right flex-none">
                  <span className={`text-xs font-mono font-black ${
                    item.type === 'plus' ? 'text-amwal-secondary-teal' : 'text-rose-600'
                  }`}>
                    {item.type === 'plus' ? '+' : '-'}{item.points} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
