"use client";

import React from "react";
import Image from "next/image";
import { 
  Search, 
  Bell, 
  User, 
  Plus, 
  MapPin, 
  Users, 
  BookOpen, 
  ChevronRight, 
  PlayCircle,
  Home,
  HandHeart
} from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Dashboard() {
  const educationCards = [
    { 
      img: "/assets/images/education/ilmu-faraidh-dijamin-bisa-bagi-waris.png", 
      title: "Ilmu Faraidh | Dijamin bisa bagi waris",
      hasPlay: false
    },
    { 
      img: "/assets/images/education/jangan-tunda-pembagian-warisan.png", 
      title: "Jangan Tunda Pembagian Warisan", 
      hasPlay: true 
    },
    { 
      img: "/assets/images/education/pembagian-harta-waris-menurut-hukum-perdata.png", 
      title: "Pembagian Harta Waris Menurut Hukum Perdata",
      hasPlay: false
    }
  ];

  const wakafCards = [
    { 
      img: "/assets/images/wakaf/wakaf-dana-abadi-untuk-pendidikan-agama-islam.png", 
      title: "Wakaf Dana Abadi untuk Pendidikan Agama Islam", 
      progress: 65, 
      terkumpul: "Rp 162.500.000" 
    },
    { 
      img: "/assets/images/wakaf/wakaf-pembangunan-masjid-al-furqon.png", 
      title: "Wakaf Pembangunan Masjid Al-Furqon", 
      progress: 18, 
      terkumpul: "Rp 141.600.000" 
    },
    { 
      img: "/assets/images/wakaf/wakaf-air-bersih-desa-nurul-amanah.png", 
      title: "Wakaf Air Bersih Desa Nurul Amanah", 
      progress: 49, 
      terkumpul: "Rp 48.700.000" 
    },
    { 
      img: "/assets/images/wakaf/wakaf-perbaikan-jalan-aspal-untuk-akses-pendidikan.png", 
      title: "Wakaf Perbaikan Jalan Aspal untuk Akses Pendidikan dan...", 
      progress: 85, 
      terkumpul: "Rp 853.750.000" 
    }
  ];

  const heroBanners = [
    {
      img: "/assets/images/wakaf/wakaf-pembangunan-masjid-al-furqon.png",
      title: "Pembangunan Masjid Al-Furqon untuk Santri"
    },
    {
      img: "/assets/images/wakaf/wakaf-dana-abadi-untuk-pendidikan-agama-islam.png",
      title: "Wakaf Dana Abadi untuk Pendidikan Agama Islam"
    },
    {
      img: "/assets/images/wakaf/wakaf-air-bersih-desa-nurul-amanah.png",
      title: "Wakaf Air Bersih Desa Nurul Amanah"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-jakarta flex flex-col">
      
      {/* Desktop Top Navigation (Hidden on mobile) */}
      <header className="hidden md:flex items-center px-8 lg:px-12 py-4 bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        {/* Left Side: Logo & Menus */}
        <div className="flex items-center gap-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-amwal-sm overflow-hidden bg-white shadow-sm flex items-center justify-center border border-amwal-main-2/20 p-0.5">
              <img
                src="/assets/images/logo.png"
                alt="Amwal Logo"
                className="object-contain w-[34px] h-[34px]"
              />
            </div>
            <div>
              <h1 className="text-2xl font-yeseva text-amwal-secondary-teal mt-[-2px] tracking-tight">Amwal</h1>
            </div>
          </div>
          
          {/* 4 Menus Horizontal */}
          <nav className="flex items-center gap-8 font-semibold text-amwal-neutral-dark/70 text-sm">
            <a href="#" className="text-amwal-secondary-teal font-bold border-b-2 border-amwal-secondary-teal pb-1">Beranda</a>
            <a href="#" className="hover:text-amwal-secondary-teal transition-colors pb-1 border-b-2 border-transparent hover:border-amwal-secondary-teal/50">Wakaf</a>
            <a href="#" className="hover:text-amwal-secondary-teal transition-colors pb-1 border-b-2 border-transparent hover:border-amwal-secondary-teal/50">Waris</a>
            <a href="#" className="hover:text-amwal-secondary-teal transition-colors pb-1 border-b-2 border-transparent hover:border-amwal-secondary-teal/50">Edukasi</a>
          </nav>
        </div>

        {/* Right Side: Search & Profile */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Pencarian..." 
              className="bg-slate-100 text-amwal-neutral-dark rounded-full py-2 pl-9 pr-4 outline-none focus:ring-2 focus:ring-amwal-tertiary-gold text-sm w-64 transition-all" 
            />
          </div>
          <div className="relative p-2.5 bg-slate-100 rounded-full cursor-pointer hover:bg-slate-200 transition-colors">
            <Bell className="w-5 h-5 text-amwal-secondary-teal" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-amwal-status-danger rounded-full border-2 border-white"></div>
          </div>
          <div className="w-10 h-10 rounded-full bg-amwal-main-1 border border-amwal-secondary-teal/10 flex items-center justify-center font-bold text-sm text-amwal-secondary-teal shadow-inner cursor-pointer hover:bg-amwal-secondary-teal/10 transition-colors">
            BA
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative pb-24 md:pb-12 overflow-x-hidden">
        
        {/* Green Background Header Layer */}
        <div className="w-full bg-amwal-secondary-teal rounded-b-[40px] md:rounded-b-none pt-6 pb-28 md:pb-36 px-5 md:px-8 relative z-0 flex flex-col">
          <div className="w-full max-w-7xl mx-auto">
            {/* Mobile Header (Hidden on Desktop) */}
            <div className="md:hidden flex items-center gap-4 text-white">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Pencarian" 
                  className="w-full bg-white text-amwal-neutral-dark rounded-full py-2.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-amwal-tertiary-gold text-sm shadow-sm" 
                />
              </div>
              <div className="relative p-2.5 bg-white rounded-full shadow-sm flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-amwal-secondary-teal" />
                <div className="absolute top-0 right-0 w-3 h-3 bg-amwal-status-danger rounded-full border-2 border-white"></div>
              </div>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                <User className="text-gray-400 w-6 h-6" />
              </div>
            </div>

            {/* Greeting on Desktop */}
            <div className="hidden md:block pt-4 pb-2 text-white">
              <h2 className="text-3xl font-yeseva">Selamat Datang, Bara!</h2>
              <p className="text-white/80 font-medium mt-1">Mari bersama membangun kemaslahatan umat melalui wakaf.</p>
            </div>
          </div>
        </div>

        {/* Floating Content Overlapping the Green Background */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-8 flex flex-col -mt-20 md:-mt-24">
          
          {/* Hero Image Carousel */}
          <div className="w-full mx-auto md:max-w-none">
            <div className="rounded-amwal-lg overflow-hidden border-[1.5px] border-amwal-tertiary-gold shadow-xl aspect-[16/9] md:aspect-[21/7] lg:aspect-[24/6] w-full bg-white relative">
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true, dynamicBullets: true }}
                loop={true}
                className="w-full h-full hero-swiper"
              >
                {heroBanners.map((banner, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="w-full h-full relative">
                      <img 
                        src={banner.img} 
                        alt={banner.title} 
                        className="object-cover object-center w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent md:from-black/90 md:via-black/40 flex flex-col justify-end md:justify-center p-5 md:p-10">
                        <h2 className="text-white font-yeseva text-lg md:text-3xl lg:text-4xl leading-snug max-w-[90%] md:max-w-[70%] drop-shadow-md">
                          {banner.title}
                        </h2>
                        <button className="mt-3 md:mt-5 bg-amwal-status-success text-white px-5 py-2 md:px-8 md:py-3 rounded-amwal-md text-xs md:text-sm font-bold w-fit hover:bg-opacity-90 transition-all shadow-md hover:scale-105">
                          Wakaf sekarang
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <style jsx global>{`
                .hero-swiper .swiper-pagination-bullet {
                  background: white;
                  opacity: 0.6;
                }
                .hero-swiper .swiper-pagination-bullet-active {
                  background: var(--color-amwal-tertiary-gold, #B88A44);
                  opacity: 1;
                }
                /* Hide scrollbar for webkit */
                .hide-scrollbar::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
            </div>
          </div>

          {/* Quick Actions (4 Icons) */}
          <div className="grid grid-cols-4 gap-2 md:gap-8 py-8 mt-2 w-full max-w-4xl mx-auto">
            {[
              { icon: Plus, label: "Buat program wakaf" },
              { icon: MapPin, label: "Cari wakaf di sekitarmu" },
              { icon: Users, label: "Kelola waris" },
              { icon: BookOpen, label: "Pusat edukasi" }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 md:gap-4 cursor-pointer group">
                <div className="w-14 h-14 md:w-20 md:h-20 bg-amwal-secondary-teal text-white rounded-full flex items-center justify-center shadow-md group-hover:scale-105 group-hover:bg-amwal-secondary-teal/90 transition-all">
                  <item.icon className="w-7 h-7 md:w-10 md:h-10" strokeWidth={1.5} />
                </div>
                <span className="text-[11px] md:text-sm leading-tight text-center text-amwal-secondary-teal font-bold max-w-[80px] md:max-w-[120px]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Main Dashboard Content Grid: 
              Using lg:flex-row-reverse so 'Pusat Edukasi' is the first DOM element (on top for Mobile)
              but rendered on the right side for Desktop.
          */}
          <div className="w-full flex flex-col lg:flex-row-reverse gap-6 md:gap-8">
            
            {/* Section 'Pusat Edukasi' (First in DOM: Top on Mobile, Right on Desktop) */}
            <div className="w-full lg:w-1/3 flex flex-col mb-2 lg:mb-0">
              <div className="bg-white border border-yellow-400/80 rounded-amwal-lg p-5 md:p-6 shadow-sm relative overflow-hidden flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-yeseva text-amwal-secondary-teal flex items-center gap-2 text-xl md:text-2xl">
                    Pusat Edukasi <ChevronRight className="w-6 h-6 text-amwal-tertiary-gold" />
                  </h3>
                </div>
                <p className="text-sm text-amwal-neutral-dark/70 mb-5 font-medium">
                  Pelajari ilmu waris dan wakaf lengkap.
                </p>
                
                {/* Horizontal scroll on mobile, Vertical stack on large desktop */}
                <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 snap-x snap-mandatory scroll-smooth hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {educationCards.map((item, idx) => (
                    <div key={idx} className="min-w-[160px] md:min-w-[200px] lg:min-w-0 snap-start relative rounded-amwal-md overflow-hidden aspect-[4/5] lg:aspect-video shadow-sm cursor-pointer group border border-slate-100">
                      <img src={item.img} alt={item.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-3 md:p-4">
                        {item.hasPlay && (
                          <PlayCircle className="w-10 h-10 md:w-12 md:h-12 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-90 drop-shadow-md group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                        )}
                        <h4 className="text-white text-[13px] md:text-sm font-medium leading-tight drop-shadow-md">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 'Temukan Wakaf' (Second in DOM: Bottom on Mobile, Left on Desktop) */}
            <div className="w-full lg:w-2/3 flex flex-col">
              <div className="bg-white md:bg-[#f5f9f5] border border-amwal-secondary-teal/10 rounded-amwal-lg p-5 md:p-6 shadow-sm md:shadow-inner flex-1">
                <h3 className="font-yeseva text-amwal-secondary-teal flex items-center gap-2 text-xl md:text-2xl mb-5">
                  Temukan Wakaf <ChevronRight className="w-6 h-6 text-amwal-tertiary-gold" />
                </h3>
                <div className="flex flex-col gap-4">
                  {wakafCards.map((item, idx) => (
                    <div key={idx} className="flex flex-row gap-4 bg-white p-3 rounded-amwal-md shadow-sm border border-slate-100 hover:shadow-md hover:border-amwal-tertiary-gold/30 transition-all cursor-pointer group">
                      <div className="relative w-[100px] h-[100px] md:w-[130px] md:h-[130px] shrink-0 rounded-amwal-sm overflow-hidden">
                        <img src={item.img} alt={item.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="flex flex-col flex-1 justify-between py-1">
                        <h4 className="text-sm md:text-lg font-bold text-amwal-neutral-dark leading-snug line-clamp-2 md:line-clamp-3 pr-2 group-hover:text-amwal-secondary-teal transition-colors">
                          {item.title}
                        </h4>
                        <div className="mt-2">
                          <div className="flex justify-between text-[11px] md:text-sm text-slate-500 mb-1.5 font-medium">
                            <span>Progres</span>
                            <span className="font-bold text-amwal-secondary-teal">{item.progress}%</span>
                          </div>
                          <div className="w-full bg-amwal-main-1 h-2 md:h-2.5 rounded-full overflow-hidden mb-1.5 md:mb-2">
                            <div className="bg-amwal-secondary-green h-full rounded-full transition-all duration-1000" style={{ width: `${item.progress}%` }}></div>
                          </div>
                          <div className="text-[11px] md:text-sm text-amwal-neutral-dark font-semibold">
                            {item.terkumpul} <span className="text-slate-500 font-medium">terkumpul</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Mobile-Only Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 px-8 py-3 flex justify-between items-center z-50 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] pb-6">
        {[
          { icon: Home, label: "Beranda", active: true },
          { icon: HandHeart, label: "Wakaf", active: false },
          { icon: Users, label: "Waris", active: false },
          { icon: BookOpen, label: "Edukasi", active: false }
        ].map((item, idx) => (
          <div key={idx} className={`flex flex-col items-center gap-1.5 cursor-pointer ${item.active ? 'text-amwal-secondary-teal' : 'text-slate-400 hover:text-slate-600'}`}>
            <item.icon className={`w-6 h-6 ${item.active ? 'fill-amwal-secondary-teal text-amwal-secondary-teal' : ''}`} strokeWidth={item.active ? 2 : 1.5} />
            <span className={`text-[11px] font-medium ${item.active ? 'font-bold' : ''}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
      
    </div>
  );
}

