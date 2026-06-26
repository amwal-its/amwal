"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Circle, Smartphone, CreditCard, Landmark, ArrowRight } from 'lucide-react';
import { addPoints } from '@/lib/points';

export default function PaymentPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [nominal, setNominal] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('qris');
  const [invoiceId, setInvoiceId] = useState<string>('');

  useEffect(() => {
    // Pre-generate an invoice ID to display later
    const rand = Math.floor(100 + Math.random() * 900);
    setInvoiceId(`INV-2026-${rand}`);
  }, []);

  const presetNominals = [50000, 100000, 200000, 500000, 1000000, 5000000];

  const handleNominalClick = (amount: number) => {
    setNominal(amount.toString());
  };

  const formatRupiah = (value: string) => {
    if (!value) return '';
    const numberString = value.replace(/[^,\d]/g, '').toString();
    const split = numberString.split(',');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substring(0, sisa);
    const ribuan = split[0].substring(sisa).match(/\d{3}/gi);

    if (ribuan) {
      const separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
    return rupiah;
  };

  const handleProceedPayment = () => {
    if (!nominal || parseInt(nominal) < 10000) return;
    
    // Add points for completing a Wakaf donation
    addPoints(200, 'Melakukan Wakaf Produktif (Pembangunan Gedung Sekolah Yatim)');
    
    // Proceed to success page
    setStep(2);
  };

  const getMethodLabel = (id: string) => {
    switch (id) {
      case 'qris': return 'QRIS';
      case 'va': return 'Virtual Account';
      case 'card': return 'Credit/Debit Card';
      default: return 'Online Transfer';
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative flex flex-col w-full border-x border-gray-100 shadow-xs">
      {step === 1 ? (
        <>
          {/* Step 1 Header */}
          <div className="bg-white px-4 py-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shadow-sm">
            <button onClick={() => router.back()} className="mr-3 text-gray-600 hover:text-amwal-secondary-teal transition cursor-pointer">
              <ArrowLeft size={24} />
            </button>
            <h1 className="font-bold text-lg">Pembayaran Wakaf</h1>
          </div>

          <div className="p-4 bg-white mb-2 shadow-sm border-b border-gray-100">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Anda akan berwakaf untuk program:</p>
            <h2 className="font-bold text-sm text-gray-800">Pembangunan Gedung Sekolah Yatim</h2>
          </div>

          <div className="p-4 bg-white mb-2 shadow-sm border-b border-gray-100">
            <h3 className="font-bold text-xs text-gray-800 uppercase tracking-widest mb-3">Nominal Wakaf</h3>
            
            <div className="relative mb-4">
              <span className="absolute left-4 top-3.5 font-bold text-gray-400 select-none">Rp</span>
              <input 
                type="text" 
                value={formatRupiah(nominal)}
                onChange={(e) => setNominal(e.target.value.replace(/\./g, ''))}
                placeholder="0"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-lg font-bold text-gray-800 focus:ring-2 focus:ring-amwal-secondary-teal focus:border-amwal-secondary-teal outline-none transition"
              />
            </div>

            <div className="grid grid-cols-3 gap-2.5 mb-4">
              {presetNominals.map(preset => (
                <button 
                  key={preset}
                  onClick={() => handleNominalClick(preset)}
                  className={`py-2 rounded-lg text-xs font-bold border transition duration-200 cursor-pointer ${
                    nominal === preset.toString() 
                      ? 'bg-amwal-secondary-teal/5 border-amwal-secondary-teal text-amwal-secondary-teal shadow-2xs' 
                      : 'bg-white border-gray-200 text-gray-600 hover:border-amwal-secondary-teal/30 hover:bg-gray-50'
                  }`}
                >
                  {preset / 1000}K
                </button>
              ))}
            </div>

            <label className="flex items-center space-x-3 bg-gray-50 p-3.5 rounded-xl border border-gray-150 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={isAnonymous}
                onChange={() => setIsAnonymous(!isAnonymous)}
                className="w-4 h-4 text-amwal-secondary-teal rounded border-gray-300 focus:ring-amwal-secondary-teal cursor-pointer" 
              />
              <span className="text-xs font-semibold text-gray-600 flex-1">Sembunyikan Nama (Hamba Allah)</span>
            </label>
          </div>

          <div className="p-4 bg-white mb-28 shadow-sm border-b border-gray-100">
            <h3 className="font-bold text-xs text-gray-800 uppercase tracking-widest mb-3">Metode Pembayaran</h3>
            
            <div className="space-y-3">
              {[
                { id: 'qris', label: 'QRIS (Gopay, OVO, ShopeePay)', icon: <Smartphone size={18} className="text-blue-500" /> },
                { id: 'va', label: 'Virtual Account (BCA, Mandiri, BSI)', icon: <Landmark size={18} className="text-amber-500" /> },
                { id: 'card', label: 'Kartu Kredit / Debit', icon: <CreditCard size={18} className="text-purple-500" /> }
              ].map(method => (
                <div 
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)} 
                  className={`flex items-center p-3.5 rounded-xl border cursor-pointer transition duration-200 ${
                    paymentMethod === method.id 
                      ? 'bg-amwal-secondary-teal/5 border-amwal-secondary-teal/30 shadow-3xs' 
                      : 'bg-white border-gray-200 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="mr-3">{method.icon}</div>
                  <span className="flex-1 text-xs font-semibold text-gray-700">{method.label}</span>
                  {paymentMethod === method.id ? (
                    <CheckCircle2 size={20} className="text-amwal-secondary-teal" />
                  ) : (
                    <Circle size={20} className="text-gray-300" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sticky Total Footer */}
          <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 p-4 z-30 shadow-[0_-4px_15px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-3 px-1">
              <span className="text-xs font-medium text-gray-500">Total Pembayaran</span>
              <span className="text-base font-black text-amwal-secondary-teal">Rp {formatRupiah(nominal) || '0'}</span>
            </div>
            <button 
              onClick={handleProceedPayment} 
              disabled={!nominal || parseInt(nominal) < 10000}
              className="w-full bg-amwal-secondary-teal hover:bg-amwal-secondary-teal/90 text-white font-extrabold py-3.5 rounded-xl transition duration-200 cursor-pointer shadow-xs disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
            >
              Lanjutkan Pembayaran
            </button>
          </div>
        </>
      ) : (
        /* Step 2: Payment Success Screen Layout */
        <div className="bg-white flex flex-col min-h-screen items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-amwal-secondary-teal/10 text-amwal-secondary-teal rounded-full flex items-center justify-center mb-5 animate-pulse">
            <CheckCircle2 size={42} />
          </div>
          
          <h1 className="text-2xl font-black text-gray-900 mb-2">Alhamdulillah</h1>
          <p className="text-xs text-gray-500 leading-relaxed mb-6 max-w-xs">
            Pembayaran wakaf Anda sedang diproses. Semoga menjadi amal jariyah yang pahalanya senantiasa mengalir tanpa putus.
          </p>
          
          <div className="bg-gray-50 rounded-2xl p-4.5 w-full border border-gray-150/60 mb-8 text-left shadow-3xs">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium text-gray-500">ID Transaksi</span>
              <span className="text-xs font-bold text-gray-800 font-mono">{invoiceId}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium text-gray-500">Program</span>
              <span className="text-xs font-bold text-gray-800 truncate ml-4">Pembangunan Gedung Sekolah Yatim</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium text-gray-500">Metode</span>
              <span className="text-xs font-bold text-gray-800 uppercase">{getMethodLabel(paymentMethod)}</span>
            </div>
            <div className="border-t border-dashed border-gray-200 my-3"></div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-500">Total Pembayaran</span>
              <span className="text-base font-black text-amwal-secondary-teal">Rp {formatRupiah(nominal)}</span>
            </div>
          </div>

          <div className="w-full space-y-3 mt-auto mb-4">
            <button 
              onClick={() => router.push('/dashboard/history')}
              className="w-full bg-amwal-secondary-teal hover:bg-amwal-secondary-teal/90 text-white font-extrabold py-3.5 rounded-xl transition duration-200 cursor-pointer shadow-xs"
            >
              Lihat Riwayat Wakaf
            </button>
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full bg-white text-amwal-secondary-teal font-extrabold py-3.5 rounded-xl border border-amwal-secondary-teal/20 hover:bg-amwal-secondary-teal/5 transition duration-200 cursor-pointer"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
