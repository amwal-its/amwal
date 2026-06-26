"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Info, 
  Sparkles, 
  AlertCircle, 
  Landmark, 
  Smartphone, 
  CreditCard, 
  Coins 
} from 'lucide-react';

export default function ZakatPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'fitrah' | 'maal'>('fitrah');
  
  // Fitrah States
  const [fitrahPricePerPerson, setFitrahPricePerPerson] = useState<number>(45000); // Standard BAZNAS / person
  const [fitrahQty, setFitrahQty] = useState<number>(1);
  const [fitrahNames, setFitrahNames] = useState<string[]>(['']);
  
  // Maal States (Wealth Calculator)
  const [maalType, setMaalType] = useState<'penghasilan' | 'perusahaan' | 'perdagangan' | 'emas'>('penghasilan');
  
  // 1. Zakat Penghasilan States
  const [incomeSalary, setIncomeSalary] = useState<string>('');
  const [incomeOther, setIncomeOther] = useState<string>('');
  
  // 2. Zakat Perusahaan States
  const [companyTab, setCompanyTab] = useState<'jasa' | 'dagang'>('jasa');
  const [companyRevenue, setCompanyRevenue] = useState<string>(''); // Pendapatan sebelum pajak
  const [companyAssets, setCompanyAssets] = useState<string>(''); // Aktiva Lancar
  const [companyLiabilities, setCompanyLiabilities] = useState<string>(''); // Pasiva Lancar
  
  // 3. Zakat Perdagangan States
  const [tradeAssets, setTradeAssets] = useState<string>(''); // Aset Lancar
  const [tradeProfit, setTradeProfit] = useState<string>(''); // Laba
  
  // 4. Zakat Emas States
  const [goldQty, setGoldQty] = useState<string>(''); // Jumlah Emas (gram)
  const [goldPrice, setGoldPrice] = useState<string>('1200000'); // Harga Emas per Gram
  
  const goldPricePerGram = 1200000; // gold price in IDR
  const nishabGoldGrams = 85;
  const nishabLimit = goldPricePerGram * nishabGoldGrams; // ~ Rp 102.000.000
  
  // Calculated Maal States
  const [totalMaalWealth, setTotalMaalWealth] = useState<number>(0);
  const [netMaalWealth, setNetMaalWealth] = useState<number>(0);
  const [maalZakatDue, setMaalZakatDue] = useState<number>(0);
  const [reachesNishab, setReachesNishab] = useState<boolean>(false);

  // Unified Checkout States
  const [checkoutItem, setCheckoutItem] = useState<{
    type: 'fitrah' | 'maal';
    title: string;
    amount: number;
    details: string;
  } | null>(null);
  
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bsi' | 'card'>('qris');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string>('');

  // AI Chatbot States
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isAILoading, setIsAILoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll AI chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAILoading]);

  const handleSendPrompt = async (promptToSend?: string) => {
    const text = promptToSend || chatInput;
    if (!text.trim() || isAILoading) return;

    // Add user message immediately
    const updatedMessages = [...chatMessages, { role: 'user' as const, content: text }];
    setChatMessages(updatedMessages);
    if (!promptToSend) setChatInput('');
    setIsAILoading(true);

    try {
      const response = await fetch('/api/gemini/zakat-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi AI');
      }

      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant' as const, content: data.reply || '' }]);
    } catch (err: any) {
      console.error(err);
      setChatMessages(prev => [...prev, { 
        role: 'assistant' as const, 
        content: "Maaf, terjadi gangguan koneksi ke server Ustadz AI Amwal. Silakan coba kembali sesaat lagi." 
      }]);
    } finally {
      setIsAILoading(false);
    }
  };

  const parseMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, index) => {
      let cleanLine = line.trim();
      if (!cleanLine) return <div key={index} className="h-2" />;
      
      const isBullet = cleanLine.startsWith('-') || cleanLine.startsWith('*');
      if (isBullet) {
        cleanLine = cleanLine.substring(1).trim();
      }
      
      const parts = cleanLine.split(/\*\*([\s\S]*?)\*\*/g);
      const content = parts.map((part, pIdx) => {
        if (pIdx % 2 === 1) {
          return <strong key={pIdx} className="font-bold text-gray-900">{part}</strong>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={index} className="ml-4 list-disc text-xs text-gray-700 leading-relaxed mb-1">
            {content}
          </li>
        );
      }

      return (
        <p key={index} className="text-xs text-gray-700 leading-relaxed mb-1.5">
          {content}
        </p>
      );
    });
  };

  // Auto calculate Maal Zakat whenever input fields change
  useEffect(() => {
    if (maalType === 'penghasilan') {
      const salary = parseFloat(incomeSalary) || 0;
      const other = parseFloat(incomeOther) || 0;
      const total = salary + other;
      setTotalMaalWealth(total);
      setNetMaalWealth(total);
      
      const nishabProfesiBulan = 7640114; // SK BAZNAS 2026
      if (total >= nishabProfesiBulan) {
        setReachesNishab(true);
        setMaalZakatDue(Math.round(total * 0.025));
      } else {
        setReachesNishab(false);
        setMaalZakatDue(0);
      }
    } 
    else if (maalType === 'perusahaan') {
      if (companyTab === 'jasa') {
        const rev = parseFloat(companyRevenue) || 0;
        setTotalMaalWealth(rev);
        setNetMaalWealth(rev);
        
        // Nishab Perusahaan setara 85 gr emas
        if (rev >= nishabLimit) {
          setReachesNishab(true);
          setMaalZakatDue(Math.round(rev * 0.025));
        } else {
          setReachesNishab(false);
          setMaalZakatDue(0);
        }
      } else {
        const assets = parseFloat(companyAssets) || 0;
        const liab = parseFloat(companyLiabilities) || 0;
        const net = assets - liab;
        const finalNet = net < 0 ? 0 : net;
        setTotalMaalWealth(assets);
        setNetMaalWealth(finalNet);
        
        if (finalNet >= nishabLimit) {
          setReachesNishab(true);
          setMaalZakatDue(Math.round(finalNet * 0.025));
        } else {
          setReachesNishab(false);
          setMaalZakatDue(0);
        }
      }
    }
    else if (maalType === 'perdagangan') {
      const assets = parseFloat(tradeAssets) || 0;
      const profit = parseFloat(tradeProfit) || 0;
      const total = assets + profit;
      setTotalMaalWealth(total);
      setNetMaalWealth(total);
      
      const nishabPerdaganganTahun = 91681728; // SK BAZNAS 2026
      if (total >= nishabPerdaganganTahun) {
        setReachesNishab(true);
        setMaalZakatDue(Math.round(total * 0.025));
      } else {
        setReachesNishab(false);
        setMaalZakatDue(0);
      }
    }
    else if (maalType === 'emas') {
      const qty = parseFloat(goldQty) || 0;
      const price = parseFloat(goldPrice) || 1200000;
      const value = qty * price;
      setTotalMaalWealth(value);
      setNetMaalWealth(value);
      
      // Nishab is 85 grams of gold
      if (qty >= 85) {
        setReachesNishab(true);
        setMaalZakatDue(Math.round(value * 0.025));
      } else {
        setReachesNishab(false);
        setMaalZakatDue(0);
      }
    }
  }, [
    maalType, 
    incomeSalary, incomeOther, 
    companyTab, companyRevenue, companyAssets, companyLiabilities, 
    tradeAssets, tradeProfit, 
    goldQty, goldPrice, nishabLimit
  ]);

  // Adjust Fitrah Shohibul Name Inputs matching count
  const handleFitrahQtyChange = (newQty: number) => {
    if (newQty < 1) return;
    setFitrahQty(newQty);
    setFitrahNames(prev => {
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

  const handleFitrahNameChange = (index: number, val: string) => {
    setFitrahNames(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handlePayFitrah = () => {
    const totalAmount = fitrahQty * fitrahPricePerPerson;
    const activeNames = fitrahNames.filter(n => n.trim() !== '').join(', ');
    setCheckoutItem({
      type: 'fitrah',
      title: 'Zakat Fitrah ' + fitrahQty + ' Jiwa',
      amount: totalAmount,
      details: activeNames || 'Shohibul Zakat Fitrah Keluarga'
    });
  };

  const handlePayMaal = () => {
    if (maalZakatDue <= 0) return;
    let details = '';
    let title = '';
    if (maalType === 'penghasilan') {
      title = 'Zakat Penghasilan / Profesi';
      details = `Zakat atas penghasilan bulanan ${formatRupiah(totalMaalWealth)}`;
    } else if (maalType === 'perusahaan') {
      title = 'Zakat Perusahaan';
      details = `Zakat perusahaan (${companyTab === 'jasa' ? 'Sektor Jasa' : 'Sektor Dagang/Industri'}) dengan nilai terkena zakat ${formatRupiah(netMaalWealth)}`;
    } else if (maalType === 'perdagangan') {
      title = 'Zakat Perdagangan';
      details = `Zakat perdagangan dengan nilai total omset & laba ${formatRupiah(totalMaalWealth)}`;
    } else if (maalType === 'emas') {
      title = 'Zakat Emas / Logam Mulia';
      details = `Zakat emas seberat ${goldQty} gram senilai ${formatRupiah(totalMaalWealth)}`;
    }
    setCheckoutItem({
      type: 'maal',
      title: title,
      amount: maalZakatDue,
      details: details
    });
  };

  const handlePaymentSubmit = () => {
    if (!checkoutItem) return;
    const randId = 'AMW-ZKT-' + Math.floor(100000 + Math.random() * 900000);
    setTransactionId(randId);
    setIsSuccess(true);
  };

  const handleCloseSuccess = () => {
    setIsSuccess(false);
    setCheckoutItem(null);
    router.push('/dashboard');
  };

  const handleResetMaal = () => {
    setIncomeSalary('');
    setIncomeOther('');
    setCompanyRevenue('');
    setCompanyAssets('');
    setCompanyLiabilities('');
    setTradeAssets('');
    setTradeProfit('');
    setGoldQty('');
    setGoldPrice('1200000');
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
          <h1 className="font-bold text-lg text-gray-800">Zakat Amwal</h1>
          <p className="text-[10px] text-gray-500">Kalkulator digital & penyaluran zakat aman terpercaya</p>
        </div>
        <div className="flex items-center space-x-1.5 bg-purple-50 px-2.5 py-1.5 rounded-full border border-purple-100 text-purple-700">
          <Coins size={14} className="animate-pulse" />
          <span className="text-[10px] font-bold">2.5% Berkah</span>
        </div>
      </div>

      {/* Hero Banner Section */}
      <div className="p-4">
        <div className="relative rounded-2xl overflow-hidden h-36 bg-gradient-to-r from-purple-800 via-indigo-900 to-indigo-950 shadow-md flex items-center p-5">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div 
            className="absolute right-0 top-0 bottom-0 w-1/3 bg-cover bg-center blend-overlay opacity-3 w-[150px]" 
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=400&q=80')`, backgroundSize: 'cover' }}
          ></div>
          <div className="relative z-10 text-white max-w-[75%]">
            <span className="bg-amber-400 text-indigo-950 font-bold tracking-wider text-[9px] px-2.5 py-0.5 rounded-full uppercase">Pembersih Jiwa & Harta</span>
            <h2 className="text-lg font-bold mt-1 leading-tight">Zakat Tepat Sasaran bagi 8 Ashnaf</h2>
            <p className="text-[10.5px] text-indigo-100 mt-1 leading-relaxed">Kelola zakat fitrah dan maal Anda secara transparan. Didistribusikan langsung kepada mustahik yang berhak.</p>
          </div>
        </div>
      </div>

      {/* Premium Tab Selector */}
      <div className="px-4 pb-4">
        <div className="bg-white p-1 rounded-xl shadow-xs border border-gray-100 flex">
          <button 
            type="button"
            onClick={() => setActiveTab('fitrah')}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'fitrah'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span>Zakat Fitrah</span>
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('maal')}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'maal'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span>Zakat Maal</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-4 pb-6 space-y-4">
        
        {/* TAB 1: ZAKAT FITRAH */}
        {activeTab === 'fitrah' && (
          <div className="space-y-4">
            
            {/* Guide Info Banner */}
            <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-purple-800 font-bold text-xs">
                <AlertCircle size={15} />
                <span>Aturan Zakat Fitrah</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Zakat Fitrah adalah kewajiban wajib bagi setiap jiwa muslim menjelang usai bulan suci Ramadhan. 
                Nilai setara beras seberat <strong>2.5 kg atau 3.5 liter</strong> per orang. 
                BAZNAS menetapkan konversi tunai berkisar <strong>Rp 45.000 / jiwa</strong> tahun ini.
              </p>
            </div>

            {/* Config & Shohibul Form Card */}
            <div className="bg-white rounded-2xl border border-gray-150 p-5 space-y-4 shadow-xs">
              <h3 className="font-bold text-gray-800 text-sm">Hitung & Daftarkan Anggota Keluarga</h3>

              {/* Price level select options */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-gray-500 block">Konversi Beras per Jiwa</span>
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => setFitrahPricePerPerson(45000)}
                    className={`p-3 rounded-xl border-2 cursor-pointer text-center transition ${
                      fitrahPricePerPerson === 45000 
                        ? 'border-purple-600 bg-purple-50/20' 
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <span className="text-xs font-bold text-gray-800 block">Beras Standar</span>
                    <span className="text-[10px] text-gray-400 block mb-0.5">Nasi pulen biasa</span>
                    <span className="text-xs font-bold text-purple-700">Rp 45.000 / orang</span>
                  </div>

                  <div 
                    onClick={() => setFitrahPricePerPerson(55000)}
                    className={`p-3 rounded-xl border-2 cursor-pointer text-center transition ${
                      fitrahPricePerPerson === 55000 
                        ? 'border-purple-600 bg-purple-50/20' 
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <span className="text-xs font-bold text-gray-800 block">Beras Premium</span>
                    <span className="text-[10px] text-gray-400 block mb-0.5">Nasi organik / basmati</span>
                    <span className="text-xs font-bold text-purple-700">Rp 55.000 / orang</span>
                  </div>
                </div>
              </div>

              {/* Quantity setting */}
              <div className="flex items-center justify-between border-t border-b border-gray-100 py-3.5">
                <div>
                  <span className="font-bold text-gray-800 text-xs block">Jumlah Tanggungan (Jiwa)</span>
                  <span className="text-[10.5px] text-gray-400">Termasuk diri Anda sendiri</span>
                </div>
                
                <div className="flex items-center space-x-3 bg-gray-50 p-1 rounded-lg border border-gray-150">
                  <button 
                    onClick={() => handleFitrahQtyChange(fitrahQty - 1)}
                    disabled={fitrahQty <= 1}
                    className="w-8 h-8 rounded bg-white flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-45 shadow-xs transition"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="font-bold text-xs text-gray-800 px-1 w-4 text-center">{fitrahQty}</span>
                  <button 
                    onClick={() => handleFitrahQtyChange(fitrahQty + 1)}
                    className="w-8 h-8 rounded bg-white flex items-center justify-center text-gray-600 hover:bg-gray-100 shadow-xs transition"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {/* Names input group */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-gray-500 block">Nama-Nama Shohibul Zakat Fitrah</span>
                {fitrahNames.map((name, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute left-3 top-3 text-[10px] font-bold text-purple-700 bg-purple-50 w-5 h-5 rounded-full flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => handleFitrahNameChange(idx, e.target.value)}
                      placeholder={`Nama Lengkap Jiwa #${idx + 1}`}
                      className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div className="bg-purple-50/30 p-4 rounded-xl border border-purple-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold">Kalkulasi Total Zakat Fitrah</span>
                  <div className="text-lg font-extrabold text-purple-700">{formatRupiah(fitrahQty * fitrahPricePerPerson)}</div>
                </div>

                <button
                  type="button"
                  onClick={handlePayFitrah}
                  className="bg-purple-600 text-white font-bold text-xs py-2.5 px-6 rounded-lg hover:bg-purple-700 active:scale-95 transition shadow-xs"
                >
                  Bayar Fitrah
                </button>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: ZAKAT MAAL */}
        {activeTab === 'maal' && (
          <div className="space-y-4">
            
            {/* Guide Info Banner */}
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl space-y-1.5">
              <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs">
                <Info size={15} />
                <span>Panduan & Batas Nishab Umum</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Zakat Maal wajib dikeluarkan bagi harta yang telah memenuhi kriteria haul (mengendap 1 tahun) 
                dan mencapai nishab setara emas <strong>85 gram</strong>.
              </p>
              <div className="text-[10px] font-medium text-amber-955 bg-white/60 p-2 rounded border border-amber-100 flex justify-between">
                <span>Nilai Emas Acuan BAZNAS:</span>
                <span className="font-bold">{formatRupiah(goldPricePerGram)} / gr</span>
              </div>
              <div className="text-[10px] font-medium text-amber-955 bg-white/60 p-2 rounded border border-amber-100 flex justify-between">
                <span>Batas Minimal Harta Wajib (Nishab):</span>
                <span className="font-bold">{formatRupiah(nishabLimit)}</span>
              </div>
            </div>

            {/* Jenis Zakat Selection Dropdown Pill */}
            <div className="flex items-center justify-center space-x-2 py-3 bg-white rounded-2xl border border-gray-150 shadow-3xs">
              <span className="text-xs font-extrabold text-amwal-neutral-dark font-sans tracking-wide">Jenis Zakat :</span>
              <div className="relative">
                <select
                  value={maalType}
                  onChange={(e) => {
                     setMaalType(e.target.value as any);
                  }}
                  className="appearance-none bg-amwal-secondary-teal text-white text-xs font-black tracking-wider px-5 py-2.5 pr-9 rounded-full border border-amwal-secondary-teal focus:outline-none focus:ring-2 focus:ring-amwal-secondary-teal/80 cursor-pointer uppercase font-sans hover:bg-amwal-secondary-teal/90 transition shadow-xs"
                >
                  <option value="penghasilan">PENGHASILAN</option>
                  <option value="perusahaan">PERUSAHAAN</option>
                  <option value="perdagangan">PERDAGANGAN</option>
                  <option value="emas">EMAS</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-white/90">
                  <span className="text-[9px]">▼</span>
                </div>
              </div>
            </div>

            {/* Form Input Fields Card */}
            <div className="bg-white rounded-2xl border border-gray-150 p-5 space-y-4 shadow-3xs">
              
              {/* CASE 1: PENGHASILAN */}
              {maalType === 'penghasilan' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">
                      Gaji saya per bulan
                    </label>
                    <div className="relative rounded-xl border border-gray-200 flex items-center bg-gray-50/20 shadow-4xs overflow-hidden">
                      <span className="px-3.5 text-xs font-bold text-gray-500 bg-gray-50/50 border-r border-gray-200 h-10 flex items-center">Rp.</span>
                      <input 
                        type="number"
                        value={incomeSalary}
                        onChange={(e) => setIncomeSalary(e.target.value)}
                        placeholder="0"
                        className="flex-1 bg-transparent py-2.5 px-3.5 text-xs font-extrabold text-gray-850 outline-none w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">
                      Penghasilan lain-lain per bulan
                    </label>
                    <div className="relative rounded-xl border border-gray-200 flex items-center bg-gray-50/20 shadow-4xs overflow-hidden">
                      <span className="px-3.5 text-xs font-bold text-gray-500 bg-gray-50/50 border-r border-gray-200 h-10 flex items-center">Rp.</span>
                      <input 
                        type="number"
                        value={incomeOther}
                        onChange={(e) => setIncomeOther(e.target.value)}
                        placeholder="0"
                        className="flex-1 bg-transparent py-2.5 px-3.5 text-xs font-extrabold text-gray-850 outline-none w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">
                      Jumlah penghasilan per bulan
                    </label>
                    <div className="relative rounded-xl border border-gray-200 flex items-center bg-gray-100 shadow-4xs overflow-hidden">
                      <span className="px-3.5 text-xs font-bold text-gray-500 border-r border-gray-200 bg-gray-100 h-10 flex items-center">Rp.</span>
                      <input 
                        type="text"
                        readOnly
                        value={formatRupiah((parseFloat(incomeSalary) || 0) + (parseFloat(incomeOther) || 0)).replace('Rp ', '')}
                        className="flex-1 bg-gray-100 py-2.5 px-3.5 text-xs font-extrabold text-gray-850 outline-none w-full cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <label className="text-xs font-bold text-gray-700 block">
                      Nisab per tahun
                    </label>
                    <div className="relative rounded-xl border border-gray-100 flex items-center bg-gray-100 shadow-4xs overflow-hidden">
                      <span className="px-3.5 text-xs font-bold text-gray-500 border-r border-gray-200 bg-gray-100 h-10 flex items-center">Rp.</span>
                      <input 
                        type="text"
                        readOnly
                        value="91.681.728"
                        className="flex-1 bg-gray-100 py-2.5 px-3.5 text-xs font-extrabold text-gray-600 outline-none w-full cursor-not-allowed"
                      />
                    </div>
                    <span className="text-[10px] text-red-600 font-bold block pt-0.5">Sesuai SK Ketua BAZNAS No. 15 tahun 2026</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">
                      Nisab per bulan
                    </label>
                    <div className="relative rounded-xl border border-gray-100 flex items-center bg-gray-100 shadow-4xs overflow-hidden">
                      <span className="px-3.5 text-xs font-bold text-gray-500 border-r border-gray-200 bg-gray-100 h-10 flex items-center">Rp.</span>
                      <input 
                        type="text"
                        readOnly
                        value="7.640.114"
                        className="flex-1 bg-gray-100 py-2.5 px-3.5 text-xs font-extrabold text-gray-600 outline-none w-full cursor-not-allowed"
                      />
                    </div>
                    <span className="text-[10px] text-red-600 font-bold block pt-0.5">Sesuai SK Ketua BAZNAS No. 15 tahun 2026</span>
                  </div>
                </div>
              )}

              {/* CASE 2: PERUSAHAAN */}
              {maalType === 'perusahaan' && (
                <div className="space-y-4 animate-fade-in">
                  {/* Company Subtab Selector (Jasa vs Dagang/Industri) */}
                  <div className="flex border-b border-gray-100 mb-2 bg-gray-50 rounded-xl p-1 shadow-4xs">
                    <button
                      type="button"
                      onClick={() => setCompanyTab('jasa')}
                      className={`flex-1 py-2.5 text-xs font-black rounded-lg transition-all text-center cursor-pointer ${
                        companyTab === 'jasa'
                          ? 'bg-amwal-secondary-teal text-white shadow-xs'
                          : 'text-gray-500 hover:text-gray-800 bg-transparent'
                      }`}
                    >
                      Jasa
                    </button>
                    <button
                      type="button"
                      onClick={() => setCompanyTab('dagang')}
                      className={`flex-1 py-2.5 text-xs font-black rounded-lg transition-all text-center cursor-pointer ${
                        companyTab === 'dagang'
                          ? 'bg-amwal-secondary-teal text-white shadow-xs'
                          : 'text-gray-500 hover:text-gray-800 bg-transparent'
                      }`}
                    >
                      Dagang/Industri
                    </button>
                  </div>

                  {companyTab === 'jasa' ? (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 block">
                        Pendapatan sebelum pajak
                      </label>
                      <div className="relative rounded-xl border border-gray-200 flex items-center bg-gray-50/20 shadow-4xs overflow-hidden">
                        <span className="px-3.5 text-xs font-bold text-gray-500 bg-gray-50/50 border-r border-gray-200 h-10 flex items-center">Rp.</span>
                        <input 
                          type="number"
                          value={companyRevenue}
                          onChange={(e) => setCompanyRevenue(e.target.value)}
                          placeholder="0"
                          className="flex-1 bg-transparent py-2.5 px-3.5 text-xs font-extrabold text-gray-850 outline-none w-full"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">
                          Aktiva Lancar
                        </label>
                        <div className="relative rounded-xl border border-gray-200 flex items-center bg-gray-50/20 shadow-4xs overflow-hidden">
                          <span className="px-3.5 text-xs font-bold text-gray-500 bg-gray-50/50 border-r border-gray-200 h-10 flex items-center">Rp.</span>
                          <input 
                            type="number"
                            value={companyAssets}
                            onChange={(e) => setCompanyAssets(e.target.value)}
                            placeholder="0"
                            className="flex-1 bg-transparent py-2.5 px-3.5 text-xs font-extrabold text-gray-850 outline-none w-full"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">
                          Pasiva Lancar
                        </label>
                        <div className="relative rounded-xl border border-gray-200 flex items-center bg-gray-50/20 shadow-4xs overflow-hidden">
                          <span className="px-3.5 text-xs font-bold text-gray-500 bg-gray-50/50 border-r border-gray-200 h-10 flex items-center">Rp.</span>
                          <input 
                            type="number"
                            value={companyLiabilities}
                            onChange={(e) => setCompanyLiabilities(e.target.value)}
                            placeholder="0"
                            className="flex-1 bg-transparent py-2.5 px-3.5 text-xs font-extrabold text-gray-850 outline-none w-full"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">
                          Jumlah
                        </label>
                        <div className="relative rounded-xl border border-gray-200 flex items-center bg-gray-100 shadow-4xs overflow-hidden">
                          <span className="px-3.5 text-xs font-bold text-gray-500 border-r border-gray-200 bg-gray-100 h-10 flex items-center">Rp.</span>
                          <input 
                            type="text"
                            readOnly
                            value={formatRupiah(Math.max(0, (parseFloat(companyAssets) || 0) - (parseFloat(companyLiabilities) || 0))).replace('Rp ', '')}
                            className="flex-1 bg-gray-100 py-2.5 px-3.5 text-xs font-extrabold text-gray-800 outline-none w-full cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 text-[10px] text-gray-400 leading-relaxed font-semibold">
                    * Zakat Perusahaan dihitung setara nishab emas 85 gram per tahun ({formatRupiah(nishabLimit)}) dengan tarif zakat 2.5%.
                  </div>
                </div>
              )}

              {/* CASE 3: PERDAGANGAN */}
              {maalType === 'perdagangan' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">
                      Aset Lancar
                    </label>
                    <div className="relative rounded-xl border border-gray-200 flex items-center bg-gray-50/20 shadow-4xs overflow-hidden">
                      <span className="px-3.5 text-xs font-bold text-gray-500 bg-gray-50/50 border-r border-gray-200 h-10 flex items-center">Rp.</span>
                      <input 
                        type="number"
                        value={tradeAssets}
                        onChange={(e) => setTradeAssets(e.target.value)}
                        placeholder="0"
                        className="flex-1 bg-transparent py-2.5 px-3.5 text-xs font-extrabold text-gray-850 outline-none w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">
                      Laba
                    </label>
                    <div className="relative rounded-xl border border-gray-200 flex items-center bg-gray-50/20 shadow-4xs overflow-hidden">
                      <span className="px-3.5 text-xs font-bold text-gray-500 bg-gray-50/50 border-r border-gray-200 h-10 flex items-center">Rp.</span>
                      <input 
                        type="number"
                        value={tradeProfit}
                        onChange={(e) => setTradeProfit(e.target.value)}
                        placeholder="0"
                        className="flex-1 bg-transparent py-2.5 px-3.5 text-xs font-extrabold text-gray-850 outline-none w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">
                      Jumlah
                    </label>
                    <div className="relative rounded-xl border border-gray-200 flex items-center bg-gray-100 shadow-4xs overflow-hidden">
                      <span className="px-3.5 text-xs font-bold text-gray-500 border-r border-gray-200 bg-gray-100 h-10 flex items-center">Rp.</span>
                      <input 
                        type="text"
                        readOnly
                        value={formatRupiah((parseFloat(tradeAssets) || 0) + (parseFloat(tradeProfit) || 0)).replace('Rp ', '')}
                        className="flex-1 bg-gray-100 py-2.5 px-3.5 text-xs font-extrabold text-gray-800 outline-none w-full cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <label className="text-xs font-bold text-gray-700 block">
                      Nisab per tahun
                    </label>
                    <div className="relative rounded-xl border border-gray-100 flex items-center bg-gray-100 shadow-4xs overflow-hidden">
                      <span className="px-3.5 text-xs font-bold text-gray-500 border-r border-gray-200 bg-gray-100 h-10 flex items-center">Rp.</span>
                      <input 
                        type="text"
                        readOnly
                        value="91.681.728"
                        className="flex-1 bg-gray-100 py-2.5 px-3.5 text-xs font-extrabold text-gray-600 outline-none w-full cursor-not-allowed"
                      />
                    </div>
                    <span className="text-[10px] text-red-650 font-bold block pt-0.5">Sesuai SK Ketua BAZNAS No. 15 tahun 2026</span>
                  </div>
                </div>
              )}

              {/* CASE 4: EMAS */}
              {maalType === 'emas' && (
                <div className="space-y-4 animate-fade-in">
                  {/* Yellow Formula Banner */}
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-xl space-y-0.5 text-xs">
                    <p className="font-sans font-extrabold text-amber-955">
                      Formula: <span className="font-medium text-gray-700">Jumlah Emas (gram) × Harga Emas × 2.5%</span>
                    </p>
                    <p className="font-sans font-extrabold text-amber-955">
                      Nisab: <span className="font-medium text-gray-700">85 gram emas</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-700 block leading-tight">
                        Jumlah Emas yang Dimiliki
                      </label>
                      <div className="relative rounded-xl border border-gray-200 flex items-center bg-gray-50/20 shadow-4xs overflow-hidden">
                        <input 
                          type="number"
                          value={goldQty}
                          onChange={(e) => setGoldQty(e.target.value)}
                          placeholder="0"
                          className="flex-1 bg-transparent py-2.5 pl-3 pr-1 text-xs font-extrabold text-gray-850 outline-none w-full text-right"
                        />
                        <span className="px-2.5 text-[10px] font-bold text-gray-500 bg-gray-50/50 border-l border-gray-200 h-10 flex items-center">gram</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-700 block leading-tight">
                        Harga Emas per Gram
                      </label>
                      <div className="relative rounded-xl border border-gray-200 flex items-center bg-gray-50/20 shadow-4xs overflow-hidden">
                        <span className="px-2 text-[10px] font-bold text-gray-500 bg-gray-50/50 border-r border-gray-200 h-10 flex items-center">Rp</span>
                        <input 
                          type="number"
                          value={goldPrice}
                          onChange={(e) => setGoldPrice(e.target.value)}
                          placeholder="1.200.000"
                          className="flex-1 bg-transparent py-2.5 px-2 text-xs font-extrabold text-gray-855 outline-none w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-400 italic font-semibold pt-1">
                    * Total emas yang Anda miliki selama 1 tahun
                  </p>
                </div>
              )}

              {/* Dynamic Calculation Receipt Summary */}
              <div className="bg-gray-50 border border-gray-150 p-4 rounded-xl space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-bold">Jumlah Harta Bersih:</span>
                  <span className="font-extrabold text-gray-850">{formatRupiah(netMaalWealth)}</span>
                </div>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-bold">Status Kewajiban:</span>
                  {reachesNishab ? (
                    <span className="bg-amwal-secondary-teal/10 text-amwal-secondary-teal font-extrabold text-[10px] px-2.5 py-1 rounded-full flex items-center space-x-1 border border-amwal-secondary-teal/20 shadow-4xs animate-pulse-once">
                      <CheckCircle2 size={11} className="text-amwal-secondary-teal" />
                      <span>Wajib Zakat</span>
                    </span>
                  ) : (
                    <span className="bg-gray-250 text-gray-500 font-extrabold text-[10px] px-2.5 py-1 rounded-full border border-gray-200">
                      Belum Wajib Zakat
                    </span>
                  )}
                </div>

                {reachesNishab ? (
                  <div className="bg-amwal-secondary-teal/5 p-3.5 rounded-lg border border-amwal-secondary-teal/10 text-center shadow-4xs">
                    <span className="text-[10px] text-amwal-secondary-teal block font-bold mb-0.5 uppercase tracking-wide">Kalkulasi Nilai Zakat (2.5%):</span>
                    <span className="text-lg font-black text-amwal-secondary-teal">{formatRupiah(maalZakatDue)}</span>
                  </div>
                ) : netMaalWealth > 0 ? (
                  <p className="text-[10px] text-gray-400 italic text-center leading-relaxed font-semibold">
                    Harta bersih belum mencapai batas nishab minimum. Anda belum diwajibkan zakat maal, namun direkomendasikan ber-Infaq guna berkah tambahan.
                  </p>
                ) : null}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleResetMaal}
                  className="flex-1 bg-amber-400 text-indigo-950 font-black text-xs py-3.5 rounded-xl hover:bg-amber-500 cursor-pointer transition active:scale-95 text-center shadow-xs"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handlePayMaal}
                  disabled={!reachesNishab}
                  className="flex-1 bg-amwal-secondary-teal hover:bg-amwal-secondary-teal/90 text-white font-black text-xs py-3.5 rounded-xl disabled:opacity-40 disabled:scale-100 cursor-pointer transition active:scale-95 text-center shadow-xs"
                >
                  Tunaikan Zakat
                </button>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Checkout Drawer bottom overlay sheet */}
      {checkoutItem && !isSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 flex flex-col justify-end">
          <div className="flex-1" onClick={() => setCheckoutItem(null)}></div>
          
          <div className="bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto flex flex-col w-full max-w-md mx-auto shadow-2xl relative animate-slide-up pb-6">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto my-3 cursor-pointer" onClick={() => setCheckoutItem(null)}></div>
            
            <div className="px-5 pb-3 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Konfirmasi Penyaluran</h3>
                <p className="text-xs text-purple-600 font-semibold">{checkoutItem.title}</p>
              </div>
              <button 
                onClick={() => setCheckoutItem(null)}
                className="text-gray-400 hover:text-gray-655 font-bold text-sm px-2 py-1"
              >
                Batal
              </button>
            </div>

            <div className="p-5 space-y-5">
              
              {/* Target info */}
              <div className="bg-purple-50/30 p-3.5 rounded-xl border border-purple-100 space-y-1">
                <span className="text-[10px] text-purple-700 uppercase font-black tracking-wider block">Sifat Akad & Mustahik</span>
                <p className="text-xs text-gray-700 font-semibold leading-relaxed">
                  Zakat langsung dialokasikan ke program pemberdayaan ekonomi umat dhuafa & beasiswa produktif BAZNAS.
                </p>
                <div className="text-[10px] text-gray-450 pt-1 border-t border-purple-100/50 mt-1">
                  <strong>Detil:</strong> {checkoutItem.details}
                </div>
              </div>

              {/* Payment selection */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-gray-800">Pilih Metode Transaksi</h4>
                <div className="space-y-2">
                  {[
                    { id: 'qris', label: 'QRIS (Gopay, OVO, ShopeePay)', icon: <Smartphone size={16} className="text-purple-600" /> },
                    { id: 'bsi', label: 'Bank Syariah Indonesia (BSI Transfer)', icon: <Landmark size={16} className="text-purple-600" /> },
                    { id: 'card', label: 'Kartu Kredit / Debit Syariah', icon: <CreditCard size={16} className="text-purple-600" /> }
                  ].map(method => (
                    <div 
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)} 
                      className={`flex items-center p-3 rounded-xl border cursor-pointer transition ${
                        paymentMethod === method.id 
                          ? 'bg-purple-50 border-purple-300' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="mr-3 bg-white p-2 rounded-lg border border-gray-100">{method.icon}</div>
                      <span className="flex-1 text-xs font-semibold text-gray-800">{method.label}</span>
                      {paymentMethod === method.id ? <CheckCircle2 size={18} className="text-purple-600" /> : <div className="w-[18px] h-[18px] rounded-full border border-gray-300" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action and pricing */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block">TOTAL ZAKAT</span>
                  <div className="text-xl font-extrabold text-purple-700">{formatRupiah(checkoutItem.amount)}</div>
                </div>
                
                <button
                  type="button"
                  onClick={handlePaymentSubmit}
                  className="bg-purple-600 text-white font-bold text-sm py-3.5 px-6 rounded-xl hover:bg-purple-700 active:scale-95 transition"
                >
                  Bayar & Tunaikan Akad
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Payment Success Screen Overlay */}
      {isSuccess && checkoutItem && (
        <div className="fixed inset-0 z-55 bg-white/95 flex flex-col justify-center items-center p-6 animate-fade-in">
          <div className="w-full max-w-sm text-center space-y-6">
            <div className="inline-flex p-4 bg-purple-100 text-purple-700 rounded-full animate-bounce">
              <CheckCircle2 size={48} />
            </div>

            <div>
              <span className="bg-purple-100 text-purple-800 font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">Zakat Terbayar</span>
              <h2 className="text-2xl font-bold text-gray-800 mt-2">Ibadah Zakat Sempurna</h2>
              <p className="text-xs text-gray-500 mt-1.5 px-3 leading-relaxed">
                Alhamdulillah, dana zakat Anda sebesar {formatRupiah(checkoutItem.amount)} berhasil diterima dan tercatat di program mustahik Amwal.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 text-left space-y-3.5">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-gray-200">
                <span className="text-gray-450">NO TRANSAKSI</span>
                <span className="font-mono font-bold text-gray-800">{transactionId}</span>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Jenis Alokasi</span>
                  <span className="font-bold text-gray-800 capitalize">Zakat {checkoutItem.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Kategori Paket</span>
                  <span className="font-bold text-gray-850">{checkoutItem.title}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-400 font-medium">Mudhohi / Pembayar</span>
                  <p className="font-bold text-purple-800 text-xs text-right break-words max-w-[200px]">
                    {checkoutItem.details}
                  </p>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-450">Metode</span>
                  <span className="font-bold uppercase text-gray-700">{paymentMethod}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2.5 border-t border-gray-200 text-xs">
                <span className="text-gray-500 font-bold">Total Terbayar</span>
                <span className="text-base font-extrabold text-purple-700">{formatRupiah(checkoutItem.amount)}</span>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 px-4 leading-relaxed">
              *Tanda terima elektronik resmi BAZNAS / Lembaga amil mitra pembayar akan dikirimkan langsung ke e-mail & notifikasi histori Anda saat dana selesai divalidasi.
            </p>

            <button 
              onClick={handleCloseSuccess}
              className="w-full bg-purple-600 text-white font-bold py-3.5 rounded-xl hover:bg-purple-700 active:scale-95 transition"
            >
              Kembali ke Riwayat
            </button>
          </div>
        </div>
      )}

      {/* Floating action button (FAB) for AI Chatbot */}
      <button
        type="button"
        onClick={() => setIsChatOpen(true)}
        className="fixed right-5 bottom-6 z-40 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full w-12 h-12 shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center border border-purple-400 cursor-pointer"
        title="Tanya Ustadz AI"
      >
        <Sparkles size={20} className="text-amber-300 fill-amber-300" />
      </button>

      {/* AI Chatbot Drawer Panel */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-end animate-fade-in">
          <div className="flex-1" onClick={() => setIsChatOpen(false)}></div>
          <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl relative animate-slide-left">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/25">
                  <Sparkles className="text-amber-300 fill-amber-300" size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Ustadz AI Amwal</h3>
                  <span className="text-[10px] text-purple-200 block flex items-center">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block mr-1 animate-pulse"></span>
                    Ahli Fikih Zakat • Online
                  </span>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="text-white/80 hover:text-white font-bold text-lg p-2 rounded-lg hover:bg-white/10 transition"
              >
                ✕
              </button>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
              {/* Welcome message */}
              <div className="flex items-start space-x-2 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm shrink-0 border border-purple-200">
                  🕌
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-150 shadow-2xs">
                  <p className="text-xs text-gray-800 font-semibold leading-relaxed">
                    Assalamu'alaikum Warahmatullahi Wabarakatuh. Saya Ustadz AI Amwal. 
                    Mari saya bimbing perhitungan, nishab, kriteria haul, atau perkara fiqih zakat fitrah & zakat maal Anda. Ada yang bisa saya bantu?
                  </p>
                  <p className="text-[9px] text-purple-600 mt-1 font-bold">Ustadz AI • Baru saja</p>
                </div>
              </div>

              {/* Dynamic messages */}
              {chatMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex items-start space-x-2 max-w-[85%] ${
                    msg.role === 'user' ? 'ml-auto justify-end flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  {msg.role !== 'user' ? (
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm shrink-0 border border-purple-200 font-bold">
                      🕌
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs shrink-0 text-white font-bold">
                      U
                    </div>
                  )}
                  <div className={`p-3 rounded-2xl shadow-2xs border ${
                    msg.role === 'user' 
                      ? 'bg-purple-600 text-white border-purple-700 rounded-tr-none' 
                      : 'bg-white text-gray-800 border-gray-150 rounded-tl-none'
                  }`}>
                    {msg.role === 'user' ? (
                      <p className="text-xs space-pre-wrap leading-relaxed">{msg.content}</p>
                    ) : (
                      <div className="space-y-1">
                        {parseMarkdown(msg.content)}
                      </div>
                    )}
                    <p className={`text-[9px] mt-1 ${msg.role === 'user' ? 'text-purple-200 text-right' : 'text-gray-400 font-semibold'}`}>
                      {msg.role === 'user' ? 'Anda' : 'Ustadz AI'}
                    </p>
                  </div>
                </div>
              ))}

              {/* Loading state indicator */}
              {isAILoading && (
                <div className="flex items-start space-x-2 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-xs shrink-0 border border-purple-200 font-bold">
                    🕌
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-150 shadow-2xs flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[10px] text-gray-400 font-bold pl-1.5">Ustadz AI menelaah dalil...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Recommended suggestion prompt chips */}
            <div className="bg-white border-t border-gray-100 px-4 py-3">
              <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wide">Pertanyaan Populer:</p>
              <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none select-none">
                {[
                  "Berapa batas nishab emas & perak?",
                  "Apakah tabungan haji wajib dizakati?",
                  "Apakah gaji bulanan wajib zakat profesi?",
                  "Bagaimana lafadz niat membayar zakat?"
                ].map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    disabled={isAILoading}
                    onClick={() => handleSendPrompt(prompt)}
                    className="shrink-0 text-[10px] font-extrabold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-full px-3 py-1.5 border border-purple-100 cursor-pointer active:scale-95 transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input section */}
            <div className="p-4 bg-white border-t border-gray-100 flex items-center space-x-2">
              <input 
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendPrompt(chatInput);
                  }
                }}
                disabled={isAILoading}
                placeholder="Tanyakan fatwa, syarat haul, cara khidmat..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 font-bold focus:bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none w-full"
              />
              <button 
                type="button"
                onClick={() => handleSendPrompt(chatInput)}
                disabled={isAILoading || !chatInput.trim()}
                className="bg-purple-600 text-white rounded-xl px-4 py-3 font-bold text-xs hover:bg-purple-700 active:scale-95 transition disabled:opacity-50 disabled:scale-100 cursor-pointer text-center"
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
