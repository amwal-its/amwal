"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2, 
  Heart, 
  Gift, 
  MessageSquare, 
  Sparkles, 
  Landmark, 
  Smartphone, 
  CreditCard, 
  Search, 
  X,
  BookOpen,
  GraduationCap,
  Home,
  Utensils,
  Package,
  Globe,
  HeartHandshake
} from 'lucide-react';

const getAkadIcon = (emoji: string, category: string, className?: string) => {
  const defaultClass = className || "";
  switch (emoji) {
    case '🤝':
      return <HeartHandshake className={defaultClass || "text-amwal-secondary-teal"} size={20} />;
    case '📖':
      return <BookOpen className={defaultClass || "text-blue-600"} size={20} />;
    case '💖':
      return <Heart className={defaultClass || "text-rose-500 fill-rose-50/50"} size={20} />;
    case '🎒':
    case '📚':
    case '🎓':
    case '👨‍🎓':
      return <GraduationCap className={defaultClass || "text-amber-600"} size={20} />;
    case '🇵🇸':
      return <Globe className={defaultClass || "text-amwal-secondary-teal"} size={20} />;
    case '🍲':
      return <Utensils className={defaultClass || "text-orange-600"} size={20} />;
    case '📦':
      return <Package className={defaultClass || "text-purple-600"} size={20} />;
    case '🏠':
      return <Home className={defaultClass || "text-teal-600"} size={20} />;
    default:
      if (category === 'ota') {
        return <GraduationCap className={defaultClass || "text-amber-500"} size={20} />;
      }
      return <Heart className={defaultClass || "text-amwal-secondary-teal"} size={20} />;
  }
};

const getCategoryIcon = (id: string, isSelected: boolean) => {
  const color = isSelected ? "text-white" : "text-gray-500";
  switch (id) {
    case 'semua':
      return <Sparkles size={14} className={`shrink-0 ${color}`} />;
    case 'infaq':
      return <Heart size={14} className={`shrink-0 ${color}`} />;
    case 'ota':
      return <GraduationCap size={14} className={`shrink-0 ${color}`} />;
    default:
      return null;
  }
};

interface AkadCategory {
  id: string;
  label: string;
  emoji: string;
  colorClass: string;
  borderClass: string;
}

interface AkadItem {
  id: string;
  category: 'zakat' | 'infaq' | 'ota' | 'wakaf' | 'qurban';
  title: string;
  description: string;
  imageUrl: string;
  emoji: string;
  defaultAmount?: number;
  fixedAmount?: boolean;
  badge?: string;
}

export default function InfaqPage() {
  const router = useRouter();
  
  // Navigation & state
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTab, setSelectedTab] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAkadId, setSelectedAkadId] = useState<string>('infaq-umum');
  
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedPresetAmount, setSelectedPresetAmount] = useState<number | null>(50000);
  const [donorName, setDonorName] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [prayerMessage, setPrayerMessage] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bsi' | 'card'>('qris');
  
  // Checkout & Success States
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [finalInfaqAmount, setFinalInfaqAmount] = useState<number>(0);

  const categories: AkadCategory[] = [
    { id: 'semua', label: 'Semua', emoji: '🌟', colorClass: 'bg-amwal-secondary-teal text-white border-amwal-secondary-teal', borderClass: 'border-amwal-secondary-teal/20' },
    { id: 'infaq', label: 'Infaq', emoji: '🤝', colorClass: 'bg-blue-600 text-white border-blue-600', borderClass: 'border-blue-200' },
    { id: 'ota', label: 'Asuh Yatim', emoji: '🎒', colorClass: 'bg-amber-600 text-white border-amber-600', borderClass: 'border-amber-200' },
  ];

  const akadList: AkadItem[] = [
    {
      id: 'infaq-umum',
      category: 'infaq',
      title: 'Infaq',
      description: 'Donasi kemanusiaan umum untuk menyokong berbagai asnaf pelayanan umat secara fleksibel di berbagai daerah yang paling membutuhkan bantuan.',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=500&q=80',
      emoji: '🤝',
      badge: 'Sedekah Umum'
    },
    {
      id: 'infaq-penghafal-quran',
      category: 'infaq',
      title: 'Infaq Penghafal Al-Quran',
      description: 'Dukungan mushaf Al-Quran bermutu tinggi, logistik saku, serta beasiswa harian untuk santri-santri tahfidz di seantero pelosok.',
      imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=500&q=80',
      emoji: '📖',
      badge: 'Syiar Quran'
    },
    {
      id: 'santunan-yatim',
      category: 'infaq',
      title: 'Santunan Yatim',
      description: 'Menyalurkan bantuan pangan, paket pakaian bersih, serta dana jaminan kesehatan anak-anak yatim piatu di yayasan mitra Amwal.',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=500&q=80',
      emoji: '💖',
      badge: 'Kasih Sayang'
    },
    {
      id: 'ota-sd',
      category: 'ota',
      title: 'Orang Tua Asuh Yatim (SD)',
      description: 'Dukungan beasiswa SPP bulanan, alat tulis, buku diktat pelajaran, dan seragam sekolah bagi anak yatim tingkat SD.',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=500&q=80',
      emoji: '🎒',
      defaultAmount: 150000,
      badge: 'SD'
    },
    {
      id: 'ota-smp',
      category: 'ota',
      title: 'Orang Tua Asuh Yatim (SMP)',
      description: 'Pembiayaan biaya SPP bulanan sekolah anak yatim panti taraf SMP, penunjang ujian, serta bimbingan pembiasaan akhlak.',
      imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=500&q=80',
      emoji: '📚',
      defaultAmount: 250000,
      badge: 'SMP'
    },
    {
      id: 'ota-sma',
      category: 'ota',
      title: 'Orang Tua Asuh Yatim (SMA)',
      description: 'Penyaluran biaya bulanan pendidikan anak yatim tingkat SMA demi persiapan kelulusan, buku les, dan biaya harian sekolah.',
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=500&q=80',
      emoji: '🎓',
      defaultAmount: 350000,
      badge: 'SMA'
    },
    {
      id: 'ota-mahasiswa-its',
      category: 'ota',
      title: 'OTA Mahasiswa ITS Yatim dan Dhuafa',
      description: 'Pilar beasiswa pendidikan tinggi mencakup bantuan UKT semesteran dan asrama akomodasi bagi mahasiswa ITS berprestasi dari latar dhuafa.',
      imageUrl: 'https://images.unsplash.com/photo-1491845338269-4f53cbf7f16e?auto=format&fit=crop&w=500&q=80',
      emoji: '👨‍🎓',
      defaultAmount: 1000000,
      badge: 'ITS Mitra'
    },
    {
      id: 'infaq-palestina',
      category: 'infaq',
      title: 'Infaq Palestina',
      description: 'Solidaritas bantuan medis darurat kemanusiaan berkala berupa air bersih, klinik keliling, obat-obatan, dan paket gizi hangat di jalur Gaza.',
      imageUrl: 'https://images.unsplash.com/photo-1545641203-7d072a14e3b2?auto=format&fit=crop&w=500&q=80',
      emoji: '🇵🇸',
      badge: 'Kemanusiaan'
    },
    {
      id: 'fidyah',
      category: 'infaq',
      title: 'Fidyah',
      description: 'Pembayaran hutang kewajiban puasa Ramadan bagi yang berhalangan tetap dengan mendistribusikan santapan fakir dhuafa.',
      imageUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=500&q=80',
      emoji: '🍲',
      defaultAmount: 45000,
      badge: 'Tebas Puasa'
    },
    {
      id: 'sembako',
      category: 'infaq',
      title: 'Sembako',
      description: 'Penyaluran paket bahan makanan pokok (beras, minyak goreng, gula pasir, telur, susu) bagi rumah tangga dhuafa prasejahtera.',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80',
      emoji: '📦',
      defaultAmount: 150000,
      badge: 'Sembako Pangan'
    },
    {
      id: 'bedah-rumah',
      category: 'infaq',
      title: 'Bedah Rumah Dhuafa',
      description: 'Renovasi dan kontruksi hunian reyot tidak layak huni milik lansia sebatang kara dan dhuafa agar kembali kokoh, higienis, dan bermartabat.',
      imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=500&q=80',
      emoji: '🏠',
      badge: 'Bantuan Hunian'
    },
    {
      id: 'recovery-bencana',
      category: 'infaq',
      title: 'Recovery Bencana',
      description: 'Bantuan rekonstruksi kilat sarana mandi cuci kakus, masjid perumahan, serta rehabilitasi gizi bagi anak korban terdampak musibah gempa/banjir.',
      imageUrl: 'https://images.unsplash.com/photo-1469571486090-c5ff070148c4?auto=format&fit=crop&w=500&q=80',
      emoji: '🚨',
      badge: 'Tanggap Bencana'
    }
  ];

  const presetAmounts = [10000, 25000, 50000, 100000, 250000, 500000];

  // Handler for Akad Selection
  const handleSelectAkad = (akad: AkadItem) => {
    setSelectedAkadId(akad.id);
    if (akad.defaultAmount) {
      setCustomAmount(akad.defaultAmount.toString());
      setSelectedPresetAmount(null);
    } else {
      setCustomAmount('');
      setSelectedPresetAmount(50000);
    }
  };

  const activeAkad = akadList.find(a => a.id === selectedAkadId) || akadList[1];

  // Derive total payment value
  const getInfaqAmount = (): number => {
    if (activeAkad.fixedAmount && activeAkad.defaultAmount) {
      return activeAkad.defaultAmount;
    }
    if (selectedPresetAmount !== null) {
      return selectedPresetAmount;
    }
    return parseFloat(customAmount) || 0;
  };

  const handleSelectPreset = (amount: number) => {
    if (activeAkad.fixedAmount) return;
    setSelectedPresetAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (val: string) => {
    if (activeAkad.fixedAmount) return;
    setCustomAmount(val);
    setSelectedPresetAmount(null);
  };

  const handleCalculateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = getInfaqAmount();
    if (finalAmount < 1000) {
      return; // Minimum infaq limit
    }
    setFinalInfaqAmount(finalAmount);
    
    // Generate simulated billing details
    const randId = 'AMW-AKD-' + Math.floor(100000 + Math.random() * 900000);
    setTransactionId(randId);
    setIsSuccess(true);
  };

  const handleCloseSuccess = () => {
    setIsSuccess(false);
    router.push('/dashboard');
  };

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Filter items according to search & categories tab
  const filteredAkadList = akadList.filter(item => {
    const matchesTab = selectedTab === 'semua' || item.category === selectedTab;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative flex flex-col w-full border-x border-gray-100 shadow-xs font-sans">
      
      {/* Top sticky header with extra spacing on top */}
      <div className="bg-white px-4 pt-8 pb-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shadow-sm">
        <button 
          onClick={() => {
            if (step === 2) {
              setStep(1);
            } else {
              router.push('/dashboard');
            }
          }} 
          className="mr-3 text-gray-600 hover:text-amwal-secondary-teal transition"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-lg text-gray-800">Katalog Akad Syariah</h1>
          <p className="text-[10px] text-gray-500">Pilih & tunaikan akad pilihan syariah Anda dengan mudah & ikhlas</p>
        </div>
      </div>

      {step === 1 && (
        <div className="flex-col flex flex-1">
          {/* SEARCH AND FILTER SEGMENTS */}
          <div className="px-4 mt-4">
            {/* Search input field */}
            <div className="relative mb-3.5 group">
              <input 
                type="text" 
                placeholder="Cari akad: ITS, Sembako, Palestina, Fidyah..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl h-11 pl-10.5 pr-11 text-xs font-semibold focus:border-amwal-secondary-teal focus:ring-4 focus:ring-amwal-secondary-teal/10 outline-none shadow-2xs block text-gray-800 placeholder-gray-400 transition-all duration-200"
              />
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400/95 group-focus-within:text-amwal-secondary-teal transition-colors duration-200" />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={() => setSearchQuery('')} 
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-655 bg-gray-100/80 hover:bg-gray-150/80 p-1.5 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer"
                >
                  <X size={12} strokeWidth={2.5} />
                </button>
              )}
            </div>

            {/* Categories Tab selector pills */}
            <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedTab(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition cursor-pointer border flex items-center space-x-1.5 shadow-sm ${
                    selectedTab === cat.id
                      ? cat.colorClass + ' border-transparent'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {getCategoryIcon(cat.id, selectedTab === cat.id)}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* SELECTION GRID FROM IMAGE - 18 AKAD MATCHING LIST */}
          <div className="px-4 pt-1 space-y-2.5">
            <div className="flex justify-between items-center px-1 font-sans">
              <h3 className="font-extrabold text-xs text-amwal-secondary-teal">Daftar Pilihan Akad ({filteredAkadList.length})</h3>
              <span className="text-[10px] text-gray-400 font-bold">Kategori: <span className="text-amwal-secondary-teal uppercase">{selectedTab}</span></span>
            </div>

            {/* Interactive Akad Items list style - NO in-box scrolling, full natural page flow! */}
            <div className="space-y-2.5 pb-2">
              {filteredAkadList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectAkad(item)}
                  className={`p-3.5 rounded-xl border transition-all duration-200 flex items-start cursor-pointer hover:shadow-2xs ${
                    selectedAkadId === item.id
                      ? 'border-2 border-amwal-secondary-teal bg-amwal-secondary-teal/5 shadow-sm'
                      : 'border-gray-150 hover:border-gray-200 bg-white hover:-translate-y-0.5'
                  }`}
                >
                  {/* Clean Vector Icon instead of Emoji */}
                  <div className="flex-none w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center mr-3 shadow-xs border border-gray-100/10 mb-auto mt-0.5">
                    {getAkadIcon(item.emoji, item.category)}
                  </div>

                  {/* Informative text */}
                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-start justify-between space-x-2">
                      <h4 className="text-xs font-bold text-gray-800 leading-snug">{item.title}</h4>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        item.category === 'zakat' ? 'bg-purple-100 text-purple-700' :
                        item.category === 'infaq' ? 'bg-blue-100 text-blue-700' :
                        item.category === 'ota' ? 'bg-amber-100 text-amber-700' :
                        item.category === 'wakaf' ? 'bg-teal-100 text-teal-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {item.badge || item.category.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-gray-500 leading-normal mt-1.5 font-medium line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* End status bubble indicator */}
                  <div className="flex-none pl-2.5 flex items-center h-full pt-1.5">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedAkadId === item.id ? 'border-amwal-secondary-teal bg-amwal-secondary-teal' : 'border-gray-300'
                    }`}>
                      {selectedAkadId === item.id && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                    </div>
                  </div>
                </div>
              ))}

              {filteredAkadList.length === 0 && (
                <div className="text-center py-8 text-gray-400 font-semibold text-[11px] bg-white border border-gray-150 rounded-2xl p-4">
                  Tidak ada akad yang cocok dengan kata kunci atau kategori ini.
                </div>
              )}
            </div>
          </div>

          {/* Lanjut button to proceed to the payment details form */}
          <div className="px-4 pt-4 pb-12">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full bg-amwal-secondary-teal hover:bg-amwal-secondary-teal/90 text-white font-extrabold text-xs py-4 rounded-xl transition shadow-md flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.98]"
            >
              <span>Lanjut ke Pembayaran</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleCalculateAndSubmit} className="flex-1 px-4 mt-4 pb-10 space-y-4">
          
          {/* Selected Program Context Panel */}
          <div className="bg-amwal-secondary-teal text-white rounded-2xl p-4.5 space-y-2 shadow-sm border border-amwal-secondary-teal">
            <div className="flex items-center space-x-3">
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 shrink-0">
                {getAkadIcon(activeAkad.emoji, activeAkad.category, "text-white w-5 h-5")}
              </div>
              <div>
                <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded font-black tracking-wider uppercase text-amber-300">Akad Aktif</span>
                <h4 className="font-extrabold text-sm text-white">{activeAkad.title}</h4>
              </div>
            </div>
            <p className="text-[11px] text-white/95 leading-relaxed font-sans font-medium">
              {activeAkad.description}
            </p>
            {activeAkad.defaultAmount && (
              <div className="text-[10px] text-amber-300 font-extrabold flex items-center pt-0.5">
                <span>Rekomendasi Donasi: {formatRupiah(activeAkad.defaultAmount)}</span>
              </div>
            )}
          </div>

          {/* SECTION 2: PILIH/TETAPKAN NOMINAL AMAL */}
          <div className="bg-white rounded-2xl border border-gray-150 p-5 space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-xs">Set Nominal Penyaluran</h3>
              <span className="text-[10px] text-amwal-secondary-teal font-black flex items-center bg-amwal-secondary-teal/5 px-2.5 py-1 rounded-full border border-amwal-secondary-teal/10 shadow-xs">
                <Gift size={11} className="mr-0.5" /> Berkah Syariah
              </span>
            </div>

            {/* Conditional Input Rendering */}
            {activeAkad.fixedAmount ? (
              <div className="bg-amber-50 border border-amber-205 p-4 rounded-xl space-y-1">
                <span className="text-[9.5px] text-amber-800 font-black uppercase tracking-wider block">Harga Tetap Syar'i</span>
                <p className="text-[11px] text-gray-700 font-medium leading-normal">
                  Program ini memerlukan kontribusi pembiayaan senilai <strong className="font-black text-amwal-secondary-teal">{formatRupiah(activeAkad.defaultAmount || 0)}</strong> sesuai ketentuan syariah qurban/paket.
                </p>
              </div>
            ) : (
              <>
                {/* Preset Buttons Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {presetAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleSelectPreset(amount)}
                      className={`py-3 px-1.5 rounded-xl border text-xs font-black transition cursor-pointer ${
                        selectedPresetAmount === amount
                          ? 'bg-amwal-secondary-teal text-white border-amwal-secondary-teal shadow-xs'
                          : 'bg-white text-gray-700 border-gray-155 hover:bg-gray-50'
                      }`}
                    >
                      {amount >= 1000000 ? `${amount/1000000} Juta` : `${amount/1000}rb`}
                    </button>
                  ))}
                </div>

                {/* Custom amount field input */}
                <div className="relative pt-1">
                  <span className="text-[10px] text-gray-400 font-bold block mb-1">Atau Nominal Kustom (Min. Rp 1.000)</span>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 font-black text-xs text-gray-400">Rp</span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      placeholder="Masukkan nominal bebas"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-extrabold text-gray-800 focus:bg-white focus:ring-2 focus:ring-amwal-secondary-teal focus:border-amwal-secondary-teal outline-none transition"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* SECTION 3: MUDAH DAN DOA PENGINFAK */}
          <div className="bg-white rounded-2xl border border-gray-150 p-5 space-y-4 shadow-sm">
            <h3 className="font-bold text-gray-800 text-xs">Identitas & Harapan Doa</h3>

            {/* Donor name or choose anonymous checkbox */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10.5px] font-bold text-gray-500 block">Atas Nama Donatur / Shohibul Akad</label>
                
                <label className="inline-flex items-center space-x-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => {
                      setIsAnonymous(e.target.checked);
                      if (e.target.checked) setDonorName('Hamba Allah');
                      else setDonorName('');
                    }}
                    className="rounded border-gray-305 text-amwal-secondary-teal focus:ring-amwal-secondary-teal h-3.5 w-3.5"
                  />
                  <span className="text-[10px] font-black text-amwal-secondary-teal">Jadikan Hamba Allah</span>
                </label>
              </div>

              <input
                type="text"
                value={isAnonymous ? 'Hamba Allah' : donorName}
                disabled={isAnonymous}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Contoh: Aldani bin Prasetyo"
                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs font-black text-gray-800 focus:ring-2 focus:ring-amwal-secondary-teal focus:border-amwal-secondary-teal outline-none disabled:bg-gray-100 disabled:text-gray-400 transition"
                required={!isAnonymous}
              />
            </div>

            {/* Prayer Request message input */}
            <div className="space-y-1.5">
              <label className="text-[10.5px] font-bold text-gray-500 block flex items-center">
                <MessageSquare size={13} className="text-amwal-secondary-teal mr-1" />
                <span>Titip Doa Akad Niat (Opsional)</span>
              </label>
              <textarea
                rows={2}
                value={prayerMessage}
                onChange={(e) => setPrayerMessage(e.target.value)}
                placeholder="cth: Semoga diberi kemudahan dalam pekerjaan, kesehatan keluarga besar, serta mendapat ridho-Nya..."
                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs font-medium text-gray-700 focus:ring-2 focus:ring-amwal-secondary-teal focus:border-amwal-secondary-teal outline-none transition"
              />
            </div>
          </div>

          {/* SECTION 4: METODE PEMBAYARAN */}
          <div className="bg-white rounded-2xl border border-gray-150 p-5 space-y-3 shadow-sm pt-4">
            <h3 className="font-bold text-gray-800 text-xs">Metode Pembayaran Syariah</h3>
            <div className="space-y-2">
              {[
                { id: 'qris', label: 'QRIS (Gopay, OVO, ShopeePay)', icon: <Smartphone size={16} className="text-emerald-950" /> },
                { id: 'bsi', label: 'Bank Syariah Indonesia (BSI Transfer)', icon: <Landmark size={16} className="text-emerald-950" /> },
                { id: 'card', label: 'Kartu Kredit / Debit Syariah', icon: <CreditCard size={16} className="text-emerald-950" /> }
              ].map(method => (
                <div 
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)} 
                  className={`flex items-center p-3 rounded-xl border cursor-pointer transition ${
                    paymentMethod === method.id 
                      ? 'bg-amwal-secondary-teal/5 border-amwal-secondary-teal/30' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="mr-3 bg-white p-2 rounded-lg border border-gray-100">{method.icon}</div>
                  <span className="flex-1 text-xs font-extrabold text-gray-800">{method.label}</span>
                  {paymentMethod === method.id ? <CheckCircle2 size={18} className="text-amwal-secondary-teal" /> : <div className="w-[18px] h-[18px] rounded-full border border-gray-300" />}
                </div>
              ))}
            </div>
          </div>

          {/* TOTAL BAR AND PAYMENT TRIGGER CONTAINER */}
          <div className="bg-white rounded-2xl border border-gray-150 p-5 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[9.5px] text-gray-400 font-extrabold block">TOTAL AKAD</span>
              <div className="text-lg font-black text-amwal-secondary-teal">{formatRupiah(getInfaqAmount())}</div>
            </div>
            
            <button
              type="submit"
              disabled={getInfaqAmount() < 1000 || (!isAnonymous && donorName.trim() === '')}
              className="bg-amwal-secondary-teal hover:bg-amwal-secondary-teal/90 text-white font-extrabold text-xs py-3 px-6 rounded-xl transition disabled:bg-gray-150 disabled:text-gray-400 disabled:cursor-not-allowed shadow-xs cursor-pointer"
            >
              Tunaikan Akad
            </button>
          </div>

        </form>
      )}

      {/* Payment Success Fullscreen Modal Page */}
      {isSuccess && (
        <div className="fixed inset-0 z-55 bg-white/98 flex flex-col justify-center items-center p-6 overflow-y-auto animate-fade-in">
          <div className="w-full max-w-sm text-center space-y-5 py-4">
            
            {/* Heart Visual Icon */}
            <div className="inline-flex p-4 bg-amwal-secondary-teal/10 text-amwal-secondary-teal rounded-full shadow-sm animate-bounce">
              <CheckCircle2 size={44} className="text-amwal-secondary-teal" />
            </div>

            <div>
              <span className="bg-amwal-secondary-teal/10 text-amwal-secondary-teal font-black text-[10px] px-3.5 py-1 rounded-full uppercase tracking-wider">Akad Diterima Amwal</span>
              <h2 className="text-2xl font-black text-gray-800 mt-2">Masya Allah, Berkah!</h2>
              <p className="text-xs text-gray-500 mt-1.5 px-2 leading-relaxed">
                Jazaakumullahu Khairan Katsiran. Akad Anda secara resmi telah diterima, dan dicatat pada lembar mustahik syariah Amwal.
              </p>
            </div>

            {/* Prayer request card block overlay */}
            {prayerMessage && (
              <div className="bg-amber-50/70 border border-amber-105 p-3.5 rounded-xl text-left relative">
                <span className="text-[9px] bg-amber-400/30 text-amber-900 font-bold px-2 py-0.5 rounded-md absolute -top-2.5 left-4">
                  Doa Terpanjat 🕊️
                </span>
                <p className="text-[10.5px] text-gray-750 italic leading-relaxed pt-1.5">
                  &ldquo;{prayerMessage}&rdquo;
                </p>
              </div>
            )}

            {/* Final receipt bill invoice details box */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 text-left space-y-3 shadow-xs">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-gray-200">
                <span className="text-gray-400">ID PENYALURAN</span>
                <span className="font-mono font-black text-amwal-secondary-teal">{transactionId}</span>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium font-bold">Jenis Akad</span>
                  <span className="font-extrabold text-gray-800">{activeAkad.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-405 font-medium">Atas Nama Shohibul</span>
                  <span className="font-extrabold text-amwal-neutral-dark">{isAnonymous ? 'Hamba Allah' : donorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Metode Bayar</span>
                  <span className="font-mono font-black uppercase text-gray-700">{paymentMethod}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2.5 border-t border-gray-200 text-xs">
                <span className="text-gray-500 font-bold">Total Nilai Akad</span>
                <span className="text-base font-black text-amwal-secondary-teal">{formatRupiah(finalInfaqAmount)}</span>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 leading-relaxed px-2 font-medium">
              &ldquo;Harta tidak akan berkurang karena sedekah, melainkan keberkahannya melimpah di dunia & akhirat.&rdquo;
            </p>

            <button 
              onClick={handleCloseSuccess}
              className="w-full bg-amwal-secondary-teal text-white font-extrabold py-3.5 rounded-xl hover:bg-amwal-secondary-teal/90 transition shadow-xs cursor-pointer"
            >
              Lihat Riwayat Penyaluran
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
