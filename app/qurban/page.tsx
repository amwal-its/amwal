"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, User, Plus, Minus, MapPin, Sparkles, AlertCircle, Smartphone, Landmark, CreditCard } from 'lucide-react';

interface QurbanItem {
  id: string;
  type: 'kambing' | 'sapi';
  subType?: 'individu' | 'kolektif';
  title: string;
  weight: string;
  price: number;
  distribution: string;
  description: string;
  imageUrl: string;
  isPopular?: boolean;
}

export default function QurbanPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<'kambing' | 'sapi'>('kambing');
  const [activeCowType, setActiveCowType] = useState<'kolektif' | 'individu'>('kolektif');
  const [selectedItem, setSelectedItem] = useState<QurbanItem | null>(null);
  const [qty, setQty] = useState(1);
  const [shohibulNames, setShohibulNames] = useState<string[]>(['']);
  const [paymentMethod, setPaymentMethod] = useState('qris');
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  // Sample premium dataset for Qurban
  const qurbanItems: QurbanItem[] = [
    {
      id: 'k-std',
      type: 'kambing',
      title: 'Kambing Standar Pelosok',
      weight: '23 - 25 kg',
      price: 2150000,
      distribution: 'NTT, NTB & Sulawesi Barat',
      description: 'Penyaluran diprioritaskan untuk dhuafa dan masyarakat rawan pangan di daerah pelosok kepulauan timur Indonesia.',
      imageUrl: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 'k-prem',
      type: 'kambing',
      title: 'Kambing Premium Al-Azhar',
      weight: '29 - 33 kg',
      price: 2950000,
      distribution: 'Daerah Terpencil & Pesantren',
      description: 'Pilihan qurban berkualitas prima dengan bobot dan usia prima sesuai syariat. Disalurkan ke pesantren tahfidz pelosok.',
      imageUrl: 'https://images.unsplash.com/photo-1484557985045-eaa252be761c?auto=format&fit=crop&w=500&q=80',
      isPopular: true
    },
    {
      id: 'k-gaza',
      type: 'kambing',
      title: 'Kambing Qurban Gaza & Palestina',
      weight: '30 - 35 kg',
      price: 4900000,
      distribution: 'Pengungsian Gaza, Palestina',
      description: 'Paket qurban kemanusiaan mancanegara untuk menyemangati saudara-saudara kita di kamp-kamp pengungsian Gaza.',
      imageUrl: 'https://images.unsplash.com/photo-1456154875044-f8578c776092?auto=format&fit=crop&w=500&q=80'
    },
    // Cow Kolektif (Sharing 1/7)
    {
      id: 's-kol-std',
      type: 'sapi',
      subType: 'kolektif',
      title: 'Sapi Kolektif 1/7 Standar',
      weight: '35 - 40 kg (Bagian dari Sapi ~250kg)',
      price: 2500000,
      distribution: 'Masyarakat Terpencil Jawa Barat',
      description: 'Qurban sapi kolektif patungan 7 orang. Menjadi salah satu dari 7 shohibul qurban sapi berkualitas.',
      imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 's-kol-prem',
      type: 'sapi',
      subType: 'kolektif',
      title: 'Sapi Kolektif 1/7 Premium',
      weight: '50 - 55 kg (Bagian dari Sapi ~360kg)',
      price: 3450000,
      distribution: 'Daerah Rawan Pangan Nasional',
      description: 'Qurban patungan sapi premium seberat total ~360kg. Pembagian daging merata untuk dhuafa pelosok nusantara.',
      imageUrl: 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=500&q=80',
      isPopular: true
    },
    // Cow Individu (1 Whole Cow)
    {
      id: 's-ind-std',
      type: 'sapi',
      subType: 'individu',
      title: 'Sapi Individu Standar',
      weight: '250 - 270 kg (1 Ekor Utuh)',
      price: 17200000,
      distribution: 'Wilayah Bencana & Dhuafa Nusantara',
      description: 'Persembahkan 1 ekor sapi standar utuh atas nama keluarga atau kelompok Anda. Manfaat tersebar ke ratusan keluarga.',
      imageUrl: 'https://images.unsplash.com/photo-1545155986-e7e0e49ca248?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 's-ind-prem',
      type: 'sapi',
      subType: 'individu',
      title: 'Sapi Individu Premium',
      weight: '360 - 400 kg (1 Ekor Utuh)',
      price: 24000000,
      distribution: 'Distribusi Global Kemanusiaan',
      description: 'Pilihan qurban sapi super besar berkualitas premium mutlak. Sempurna untuk syiar qurban sosial dengan dampak maksimal.',
      imageUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=500&q=80'
    }
  ];

  const filteredItems = qurbanItems.filter(item => {
    if (item.type !== activeCategory) return false;
    if (activeCategory === 'sapi') {
      return item.subType === activeCowType;
    }
    return true;
  });

  const handleOpenCheckout = (item: QurbanItem) => {
    setSelectedItem(item);
    setQty(1);
    setShohibulNames(['']);
  };

  const handleQtyChange = (newQty: number) => {
    if (newQty < 1) return;
    setQty(newQty);
    
    setShohibulNames(prev => {
      const copy = [...prev];
      if (newQty > copy.length) {
        while (copy.length < newQty) {
          copy.push('');
        }
      } else {
        copy.splice(newQty);
      }
      return copy;
    });
  };

  const handleNameChange = (index: number, val: string) => {
    setShohibulNames(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handlePaymentSubmit = () => {
    if (!selectedItem) return;
    const randId = 'AMW-QRB-' + Math.floor(100000 + Math.random() * 900000);
    setTransactionId(randId);
    setIsSuccess(true);
  };

  const handleCloseSuccess = () => {
    setIsSuccess(false);
    setSelectedItem(null);
    router.push('/dashboard');
  };

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative flex flex-col w-full border-x border-gray-100 shadow-xs">
      {/* Top sticky header */}
      <div className="bg-white px-4 py-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shadow-sm">
        <button onClick={() => router.push('/dashboard')} className="mr-3 text-gray-600 hover:text-amwal-secondary-teal transition">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-lg text-gray-800">Qurban Amwal</h1>
          <p className="text-[10px] text-gray-500">Ibadah qurban berkah, praktis & tepat sasaran</p>
        </div>
        <div className="flex items-center space-x-1.5 bg-amwal-secondary-teal/5 px-2.5 py-1.5 rounded-full border border-amwal-secondary-teal/10 text-amwal-secondary-teal">
          <Sparkles size={14} className="animate-pulse" />
          <span className="text-[10px] font-bold">Terpercaya</span>
        </div>
      </div>

      {/* Hero Banner Section */}
      <div className="p-4">
        <div className="relative rounded-2xl overflow-hidden h-36 bg-gradient-to-r from-emerald-800 via-amwal-secondary-teal to-emerald-900 shadow-md flex items-center p-5">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-cover bg-center blend-overlay opacity-30" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=400&q=80')` }}></div>
          <div className="relative z-10 text-white max-w-[70%]">
            <span className="bg-amber-400 text-emerald-950 font-bold tracking-wider text-[9px] px-2 py-0.5 rounded-full uppercase">Idul Adha 1447 H</span>
            <h2 className="text-lg font-bold mt-1 leading-tight">Tebarkan Qurban Hingga Pelosok Negeri</h2>
            <p className="text-[10px] text-emerald-100 mt-1 leading-relaxed">Penyaluran merata, hewan sehat berkualitas & dokumentasi lengkap untuk Shohibul Qurban.</p>
          </div>
        </div>
      </div>

      {/* Primary Category Selector */}
      <div className="px-4 pb-2">
        <div className="bg-white p-1 rounded-xl shadow-xs border border-gray-100 flex">
          <button 
            type="button"
            onClick={() => setActiveCategory('kambing')}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center cursor-pointer ${
              activeCategory === 'kambing'
                ? 'bg-amwal-secondary-teal text-white shadow-xs'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span>Qurban Kambing / Domba</span>
          </button>
          <button 
            type="button"
            onClick={() => setActiveCategory('sapi')}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center cursor-pointer ${
              activeCategory === 'sapi'
                ? 'bg-amwal-secondary-teal text-white shadow-xs'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span>Qurban Sapi</span>
          </button>
        </div>
      </div>

      {/* Sapi Sub-Category Selector (Individu vs Kolektif) */}
      {activeCategory === 'sapi' && (
        <div className="px-4 pb-3 flex justify-center">
          <div className="inline-flex bg-gray-100 p-1 rounded-full border border-gray-200">
            <button
              type="button"
              onClick={() => setActiveCowType('kolektif')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeCowType === 'kolektif'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Kolektif (Patungan 1/7)
            </button>
            <button
              type="button"
              onClick={() => setActiveCowType('individu')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeCowType === 'individu'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Individu (1 Ekor Utuh)
            </button>
          </div>
        </div>
      )}

      {/* Informative Banner */}
      <div className="px-4 pb-2">
        <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg flex items-start space-x-2">
          <AlertCircle size={16} className="text-amber-600 mt-0.5 flex-none" />
          <div className="text-[11px] text-amber-800 leading-relaxed">
            {activeCategory === 'kambing' ? (
              <p>Satu paket <strong>Qurban Kambing/Domba</strong> ditujukan untuk <strong>1 orang shohibul qurban</strong>. Hewan dipelihara langsung oleh peternak lokal mitra Amwal.</p>
            ) : activeCowType === 'kolektif' ? (
              <p>Paket <strong>Kolektif 1/7</strong> berarti Anda membeli 1 dari 7 bagian sapi. Amwal akan otomatis menggabungkan patungan Anda dengan 6 shohibul qurban lainnya agar genap menjadi 1 ekor sapi utuh.</p>
            ) : (
              <p>Paket <strong>Sapi Individu</strong> diniatkan untuk atas nama pribadi, keluarga, atau kelompok Anda (maksimal 7 orang shohibul qurban) untuk pembelian 1 ekor sapi utuh.</p>
            )}
          </div>
        </div>
      </div>

      {/* Livestock List Grid */}
      <div className="p-4 space-y-4 flex-1">
        <h3 className="font-bold text-gray-800 text-sm mb-1 px-1">Pilihan Paket Tersedia</h3>
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden flex flex-col hover:border-amwal-secondary-teal transition duration-200"
          >
            <div className="relative h-44 bg-gray-100 w-full">
              <img src={item.imageUrl} referrerPolicy="no-referrer" className="w-full h-full object-cover" alt={item.title} />
              
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                <span className="bg-amwal-secondary-teal text-white font-bold text-[10px] px-2.5 py-1 rounded-md shadow-sm">
                  {item.weight}
                </span>
                <span className="bg-black/70 text-white text-[10px] font-medium px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center space-x-1">
                  <MapPin size={10} />
                  <span>{item.distribution}</span>
                </span>
              </div>

              {item.isPopular && (
                <div className="absolute top-3 right-3 bg-amber-400 text-emerald-950 font-bold text-[10px] px-2.5 py-1 rounded-md shadow-xs flex items-center space-x-1">
                  <Sparkles size={11} />
                  <span>Paling Dipilih</span>
                </div>
              )}
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <h4 className="font-bold text-gray-800 text-base leading-tight mb-1">{item.title}</h4>
              <p className="text-xs text-gray-500 line-clamp-2 md:line-clamp-none mb-3">{item.description}</p>
              
              <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block font-medium">Harga Penyaluran</span>
                  <span className="text-lg font-extrabold text-amwal-secondary-teal">{formatRupiah(item.price)}</span>
                </div>
                
                <button
                  type="button"
                  onClick={() => handleOpenCheckout(item)}
                  className="bg-amwal-secondary-teal text-white font-bold text-xs py-2 px-4 rounded-lg hover:bg-amwal-secondary-teal/90 active:scale-95 transition cursor-pointer"
                >
                  Pilih Paket
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Drawer bottom overlay sheet */}
      {selectedItem && !isSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 flex flex-col justify-end">
          <div className="flex-1" onClick={() => setSelectedItem(null)}></div>
          
          <div className="bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto flex flex-col w-full max-w-md mx-auto shadow-2xl relative animate-slide-up pb-6">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto my-3 cursor-pointer" onClick={() => setSelectedItem(null)}></div>
            
            <div className="px-5 pb-3 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Konfirmasi Paket Qurban</h3>
                <p className="text-xs text-amwal-secondary-teal font-semibold">{selectedItem.title}</p>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm px-2 py-1"
              >
                Tutup
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="flex items-center justify-between bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                <div>
                  <span className="font-bold text-gray-800 text-sm block">Jumlah Hewan Qurban</span>
                  <span className="text-xs text-gray-400">Silakan sesuaikan jumlah hewan</span>
                </div>
                
                <div className="flex items-center space-x-3 bg-white p-1 rounded-lg border border-gray-200">
                  <button 
                    onClick={() => handleQtyChange(qty - 1)}
                    disabled={qty <= 1}
                    className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition cursor-pointer"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-bold text-sm text-gray-800 px-1 w-4 text-center">{qty}</span>
                  <button 
                    onClick={() => handleQtyChange(qty + 1)}
                    className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-gray-800 flex items-center">
                    <User size={16} className="text-amwal-secondary-teal mr-1" />
                    Nama Shohibul Qurban (Mudhohi)
                  </h4>
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Sesuai Syariat</span>
                </div>
                
                <div className="space-y-3">
                  {shohibulNames.map((name, index) => (
                    <div key={index} className="relative">
                      <span className="absolute left-3 top-3.5 text-xs font-bold text-amwal-secondary-teal bg-amwal-secondary-teal/5 w-5 h-5 rounded-full flex items-center justify-center">
                        {index + 1}
                      </span>
                      <input 
                        type="text"
                        value={name}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                        placeholder="Contoh: Aldani bin Prasetyo"
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-xs font-medium text-gray-800 focus:ring-2 focus:ring-amwal-secondary-teal focus:border-amwal-secondary-teal outline-none"
                      />
                    </div>
                  ))}
                  <p className="text-[10px] text-gray-400 leading-relaxed italic px-1">
                    *Tuliskan nama shohibul berformat lengkap beserta binti/bin untuk kejelasan akad dan doa niat sembelihan. Max 7 nama jika memesan Sapi Individu.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-sm text-gray-800">Pilih Metode Pembayaran</h4>
                <div className="space-y-2">
                  {[
                    { id: 'qris', label: 'QRIS (Gopay, OVO, ShopeePay)', icon: <Smartphone size={16} className="text-amwal-secondary-teal" /> },
                    { id: 'bsi', label: 'Bank Syariah Indonesia (BSI Transfer)', icon: <Landmark size={16} className="text-amwal-secondary-teal" /> },
                    { id: 'card', label: 'Kartu Kredit / Debit Syariah', icon: <CreditCard size={16} className="text-amwal-secondary-teal" /> }
                  ].map(method => (
                    <div 
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)} 
                      className={`flex items-center p-3 rounded-xl border cursor-pointer transition ${
                        paymentMethod === method.id 
                          ? 'bg-amwal-secondary-teal/5 border-amwal-secondary-teal/30' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="mr-3 bg-white p-2 rounded-lg border border-gray-100">{method.icon}</div>
                      <span className="flex-1 text-xs font-semibold text-gray-800">{method.label}</span>
                      {paymentMethod === method.id ? <CheckCircle2 size={18} className="text-amwal-secondary-teal" /> : <div className="w-[18px] h-[18px] rounded-full border border-gray-300" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-medium">Beban Total ({qty} Hewan)</span>
                  <div className="text-xl font-extrabold text-amwal-secondary-teal">{formatRupiah(selectedItem.price * qty)}</div>
                </div>
                
                <button
                  type="button"
                  onClick={handlePaymentSubmit}
                  disabled={shohibulNames.some(name => name.trim() === '')}
                  className="bg-amwal-secondary-teal text-white font-bold text-sm py-3 px-6 rounded-xl hover:bg-amwal-secondary-teal/90 active:scale-95 transition disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
                >
                  Salurkan Qurban
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {isSuccess && selectedItem && (
        <div className="fixed inset-0 z-55 bg-white/95 flex flex-col justify-center items-center p-6 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-sm text-center space-y-6">
            <div className="inline-flex p-4 bg-amwal-secondary-teal/10 text-amwal-secondary-teal rounded-full animate-bounce">
              <CheckCircle2 size={48} />
            </div>

            <div>
              <span className="bg-amwal-secondary-teal/10 text-amwal-secondary-teal font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">Transaksi Sukses</span>
              <h2 className="text-2xl font-bold text-gray-800 mt-2">Niat Qurban Diterima!</h2>
              <p className="text-xs text-gray-500 mt-1.5 px-3 leading-relaxed">
                Jazaakumullah khairan katsiran. Akad qurban Anda telah tercatat dengan aman pada sistem syariah Amwal.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 text-left space-y-3.5 shadow-xs">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-gray-200">
                <span className="text-gray-400">ID SALURAN</span>
                <span className="font-mono font-bold text-gray-800">{transactionId}</span>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Paket</span>
                  <span className="font-bold text-gray-800">{selectedItem.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Banyaknya</span>
                  <span className="font-bold text-gray-800">{qty} Ekor</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-400 font-medium">Atas Nama Shohibul</span>
                  <div className="text-right">
                    {shohibulNames.map((name, i) => (
                      <span key={i} className="font-bold text-amwal-secondary-teal block text-xs">
                        {i + 1}. {name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Metode</span>
                  <span className="font-bold uppercase text-gray-750">{paymentMethod}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2.5 border-t border-gray-200 text-xs">
                <span className="text-gray-500 font-bold">Total Disalurkan</span>
                <span className="text-base font-extrabold text-amwal-secondary-teal">{formatRupiah(selectedItem.price * qty)}</span>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 px-4 leading-relaxed">
              *Informasi penimbangan, foto penyembelihan, dan sertifikat Shohibul Qurban akan dikirimkan langsung melalui notifikasi akun dan WhatsApp Anda secara real-time.
            </p>

            <button 
              onClick={handleCloseSuccess}
              className="w-full bg-amwal-secondary-teal text-white font-bold py-3.5 rounded-xl hover:bg-amwal-secondary-teal/90 active:scale-95 transition cursor-pointer"
            >
              Lihat Riwayat Transaksi
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
