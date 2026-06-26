"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  Search, 
  HandCoins, 
  HandHeart, 
  HeartHandshake, 
  Beef, 
  ArrowRight,
  Coins,
  Sparkles,
  CheckCircle2,
  Home,
  Clock,
  BookOpen
} from 'lucide-react';
import { getPoints, canCheckInToday, checkInDaily } from '@/lib/points';
import { BottomNav } from '@/components/bottom-nav';

export default function DashboardPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [points, setPoints] = useState<number>(200);
  const [showHasCheckIn, setShowHasCheckIn] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [scrollPercent, setScrollPercent] = useState<number>(0);

  const loadPoints = () => {
    const pts = getPoints();
    setPoints(pts || 200);
    setShowHasCheckIn(canCheckInToday());
  };

  const handleClaimCheckIn = () => {
    const res = checkInDaily();
    if (res.success) {
      setToastMessage(`Alhamdulillah! Berhasil presensi harian. +${res.pointsAdded} XP Berkah ditambahkan!`);
      loadPoints();
      setTimeout(() => {
        setToastMessage(null);
      }, 4000);
    }
  };
  
  const banners = [
    {
      title: "Berwakaf Lebih Mudah",
      desc: "Bangun pahala mengalir bersama Amwal",
      img: "https://images.unsplash.com/photo-1597466765990-64ad1c35dafc?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Infaq Jumat Berkah",
      desc: "Raih keberkahan di hari yang mulia",
      img: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Qurban Tanpa Batas",
      desc: "Tebar kebahagiaan hingga pelosok negeri",
      img: "https://images.unsplash.com/photo-1484557985045-eaa252be761c?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const maxScroll = target.scrollWidth - target.clientWidth;
    if (maxScroll <= 0) return;
    setScrollPercent(target.scrollLeft / maxScroll);
  };

  useEffect(() => {
    loadPoints();

    // Listen to points updates dynamically
    const handlePointsUpdated = () => {
      loadPoints();
    };
    window.addEventListener('amwal_points_updated', handlePointsUpdated);

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => {
      clearInterval(timer);
      window.removeEventListener('amwal_points_updated', handlePointsUpdated);
    };
  }, []);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative flex flex-col w-full border-x border-gray-100 shadow-xs pb-24">
      <div className="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-10 border-b border-gray-100/50">
        <div className="relative flex-1 mr-4">
          <input 
            type="text" 
            placeholder="Cari program wakaf..." 
            className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-amwal-secondary-teal border-none"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => router.push('/dashboard/notifications')} className="text-gray-600 relative cursor-pointer outline-none">
            <Bell size={24} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
          </button>
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" 
            alt="Profile" 
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full border border-gray-250 cursor-pointer object-cover"
            onClick={() => router.push('/dashboard/profile')}
          />
        </div>
      </div>

      {/* Poin Berkah & Absensi Header Bar */}
      <div className="mx-4 mt-3 flex items-center justify-between bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-xl px-4 py-3.5 shadow-3xs cursor-pointer" onClick={() => router.push('/dashboard/points')}>
        <div className="flex items-center space-x-2.5">
          <div className="bg-white/10 p-2 rounded-lg text-amber-300">
            <Coins size={18} className="animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] text-emerald-250 font-bold uppercase tracking-wider">Poin Berkah Anda</p>
            <p className="text-sm font-black font-mono tracking-tight">{points} XP</p>
          </div>
        </div>
        
        {showHasCheckIn ? (
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClaimCheckIn();
            }}
            className="bg-[#FBBF24] hover:bg-[#F59E0B] text-emerald-950 font-black text-[10px] uppercase px-3.5 py-1.5 rounded-full transition duration-200 shadow-sm flex items-center space-x-1 cursor-pointer shrink-0"
          >
            <Sparkles size={11} className="animate-spin text-emerald-900" />
            <span>KLAIM ABSEN</span>
          </button>
        ) : (
          <div className="flex items-center space-x-1 bg-white/10 px-2.5 py-1.5 rounded-full text-[10px] font-bold text-emerald-100">
            <CheckCircle2 size={12} className="text-emerald-350" />
            <span>Sudah Absen</span>
          </div>
        )}
      </div>

      {/* Toast Notification for Daily Check-In */}
      {toastMessage && (
        <div className="mx-4 mt-3 bg-amber-500 text-white font-bold text-xs px-4.5 py-3 rounded-lg shadow-sm border border-amber-600 flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-2">
            <Sparkles size={15} className="text-white animate-bounce" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Carousel (with 92% width so next slide peeks) */}
      <div className="pl-4 py-4 relative overflow-hidden">
        <div className="overflow-hidden rounded-l-xl relative h-40">
          <div 
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 92}%)` }}
          >
            {banners.map((banner, idx) => (
              <div key={idx} className="w-[92%] shrink-0 h-full pr-3">
                <div className="relative h-full bg-teal-800 w-full flex items-center justify-center rounded-xl overflow-hidden shadow-xs">
                  <img src={banner.img} referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover opacity-45" />
                  <div className="relative z-10 text-white text-center px-4">
                    <h2 className="text-base font-bold mb-1">{banner.title}</h2>
                    <p className="text-[11px] opacity-90">{banner.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-1.5 absolute bottom-3 left-0 right-0 z-20 pr-4">
            {banners.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions grid */}
      <div className="px-5 py-4 grid grid-cols-4 gap-3 bg-white mx-4 rounded-2xl border border-gray-100 shadow-sm mt-1">
        <button className="flex flex-col items-center justify-center space-y-1.5 transition active:scale-95 group cursor-pointer" onClick={() => router.push('/catalog')}>
          <div className="w-11 h-11 bg-emerald-50 text-amwal-secondary-teal rounded-xl flex items-center justify-center shadow-xs border border-emerald-100 group-hover:bg-emerald-100 group-hover:shadow-sm transition duration-150">
            <HandHeart size={22} />
          </div>
          <span className="text-[10.5px] text-gray-700 text-center font-bold leading-tight group-hover:text-amwal-secondary-teal transition">Wakaf</span>
        </button>
        <button className="flex flex-col items-center justify-center space-y-1.5 transition active:scale-95 group cursor-pointer" onClick={() => router.push('/zakat')}>
          <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shadow-xs border border-purple-100 group-hover:bg-purple-100 group-hover:shadow-sm transition duration-150">
            <HeartHandshake size={22} />
          </div>
          <span className="text-[10.5px] text-gray-700 text-center font-bold leading-tight group-hover:text-purple-800 transition">Zakat</span>
        </button>
        <button className="flex flex-col items-center justify-center space-y-1.5 transition active:scale-95 group cursor-pointer" onClick={() => router.push('/qurban')}>
          <div className="w-11 h-11 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shadow-xs border border-orange-100 group-hover:bg-orange-100 group-hover:shadow-sm transition duration-150">
            <Beef size={22} />
          </div>
          <span className="text-[10.5px] text-gray-700 text-center font-bold leading-tight group-hover:text-orange-900 transition">Qurban</span>
        </button>
        <button className="flex flex-col items-center justify-center space-y-1.5 transition active:scale-95 group cursor-pointer" onClick={() => router.push('/infaq')}>
          <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shadow-xs border border-amber-100 group-hover:bg-amber-100 group-hover:shadow-sm transition duration-150">
            <HandCoins size={22} />
          </div>
          <span className="text-[10.5px] text-gray-700 text-center font-bold leading-tight group-hover:text-amber-800 transition">Lainnya</span>
        </button>
      </div>

      {/* News & Education */}
      <div className="mt-6">
        <div className="px-4 flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800 text-sm">Berita & Edukasi</h3>
          <button onClick={() => router.push('/education')} className="text-xs text-amwal-secondary-teal font-bold flex items-center cursor-pointer">
            Lihat Semua <ArrowRight size={13} className="ml-1"/>
          </button>
        </div>
        <div 
          onScroll={handleScroll}
          className="flex overflow-x-auto px-4 pb-2 space-x-4 hide-scrollbar scroll-smooth"
        >
          {[
            {
              id: 'syariah_milenial',
              title: 'Manajemen Keuangan Syariah untuk Milenial',
              category: 'Finansial Pintar',
              img: 'https://images.unsplash.com/photo-1579621970588-a3f5ece89634?auto=format&fit=crop&w=400&q=80'
            },
            {
              id: 'wakaf_infaq_sedekah',
              title: 'Perbedaan Mendasar Wakaf, Infaq, dan Sedekah',
              category: 'Fiqih Muamalah',
              img: 'https://images.unsplash.com/photo-1604594849809-dfedbc827105?auto=format&fit=crop&w=400&q=80'
            }
          ].map((item) => (
            <div 
              key={item.id} 
              className="min-w-[240px] bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden cursor-pointer hover:border-emerald-200 transition duration-200" 
              onClick={() => router.push(`/education/${item.id}`)}
            >
              <img src={item.img} referrerPolicy="no-referrer" className="w-full h-28 object-cover" />
              <div className="p-3">
                <span className="text-[10px] text-blue-600 font-bold mb-1 block">{item.category}</span>
                <h4 className="font-bold text-xs text-gray-850 leading-tight mb-1 line-clamp-2">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* Custom scrollbar progress indicator */}
        <div className="mx-4 mt-2 mb-4 h-[3px] bg-gray-200/80 rounded-full relative">
          <div 
            className="absolute bg-amwal-secondary-teal h-full w-12 rounded-full transition-all duration-150"
            style={{ left: `${scrollPercent * (100 - 15)}%` }}
          ></div>
        </div>
      </div>

      {/* Recommended campaigns */}
      <div className="mt-2 pb-8">
        <div className="px-4 flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800 text-sm">Program Wakaf Pilihan</h3>
          <button onClick={() => router.push('/catalog')} className="text-xs text-amwal-secondary-teal font-bold flex items-center cursor-pointer">
            Lihat Semua <ArrowRight size={13} className="ml-1"/>
          </button>
        </div>
        <div className="px-4 space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden flex cursor-pointer hover:shadow-sm transition" onClick={() => router.push('/wakaf')}>
            <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=200&q=80" referrerPolicy="no-referrer" className="w-28 h-auto object-cover" />
            <div className="p-3 flex-1">
              <span className="text-[9px] bg-emerald-50 text-amwal-secondary-teal px-2 py-0.5 rounded font-bold mb-1.5 inline-block">Pendidikan</span>
              <h4 className="font-bold text-xs text-gray-800 leading-tight mb-1">Pembangunan Gedung Sekolah Yatim</h4>
              <p className="text-[10px] text-gray-500 mb-2 font-medium">Dompet Dhuafa</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1.5 overflow-hidden">
                <div className="bg-amwal-secondary-green h-1.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <div className="flex justify-between text-[9px] font-bold">
                <span className="text-amwal-secondary-teal">Terkumpul Rp 450jt</span>
                <span className="text-gray-400 font-medium">45 hari lagi</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden flex cursor-pointer hover:shadow-sm transition" onClick={() => router.push('/wakaf')}>
            <img src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=200&q=80" referrerPolicy="no-referrer" className="w-28 h-auto object-cover" />
            <div className="p-3 flex-1">
              <span className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold mb-1.5 inline-block">Kesehatan</span>
              <h4 className="font-bold text-xs text-gray-800 leading-tight mb-1">Wakaf Alat Kesehatan Klinik Umat</h4>
              <p className="text-[10px] text-gray-500 mb-2 font-medium">Lazismu</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1.5 overflow-hidden">
                <div className="bg-amwal-secondary-green h-1.5 rounded-full" style={{ width: '70%' }}></div>
              </div>
              <div className="flex justify-between text-[9px] font-bold">
                <span className="text-amwal-secondary-teal">Terkumpul Rp 140jt</span>
                <span className="text-gray-400 font-medium">12 hari lagi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
}
