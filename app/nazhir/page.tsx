"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ShieldCheck, 
  MapPin, 
  Globe, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2,
  Download,
  Building,
  DollarSign,
  Users,
  Grid,
  TrendingUp
} from 'lucide-react';

export default function NazhirPage() {
  const router = useRouter();
  const [copiedDoc, setCopiedDoc] = useState<string | null>(null);

  const stats = [
    { 
      label: 'Total Dana Dikelola', 
      value: 'Rp 124,5 Miliar', 
      icon: <DollarSign size={18} className="text-amwal-secondary-teal" />,
      sub: 'Akumulatif Amanah'
    },
    { 
      label: 'Total Wakif', 
      value: '18.240 Orang', 
      icon: <Users size={18} className="text-blue-600" />,
      sub: 'Donatur Terdaftar'
    },
    { 
      label: 'Total Program', 
      value: '145 Program', 
      icon: <Grid size={18} className="text-amber-600" />,
      sub: 'Telah Terealisasi'
    },
    { 
      label: 'Program Aktif', 
      value: '42 Program', 
      icon: <TrendingUp size={18} className="text-purple-600" />,
      sub: 'Sedang Berjalan'
    }
  ];

  const legalDocs = [
    { id: 'akta', name: 'Akta Pendirian Lembaga Dompet Dhuafa', no: 'No. 23/1993 Kemenkumham', date: 'Sah sejak 1993' },
    { id: 'bwi', name: 'Izin Operasional Nazhir Wakaf BWI', no: 'SK BWI No. 3.3.00001', date: 'Sertifikasi Nasional BWI' },
    { id: 'kemenag', name: 'SK Pengukuhan Lembaga Amil Zakat Kemenag', no: 'SK Dirjen Bimas Islam No. 450', date: 'Reguler Kemenag' },
    { id: 'iso', name: 'Sertifikasi Manajemen Keuangan ISO 9001:2015', no: 'No. ISO-49120-DD', date: 'Sertifikasi Mutu Keuangan' }
  ];

  const activePrograms = [
    {
      id: 1,
      title: 'Pembangunan Gedung Sekolah Yatim',
      category: 'Pendidikan',
      institution: 'Dompet Dhuafa',
      progress: 62,
      collected: 'Rp 620jt',
      daysLeft: 17,
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=200&q=80",
      themeBg: "bg-amwal-secondary-teal/10 text-amwal-secondary-teal"
    },
    {
      id: 2,
      title: 'Wakaf Alat Kesehatan Klinik Umat',
      category: 'Kesehatan',
      institution: 'Dompet Dhuafa',
      progress: 84,
      collected: 'Rp 840jt',
      daysLeft: 22,
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=200&q=80",
      themeBg: "bg-blue-100 text-blue-700"
    }
  ];

  const handleDownloadDoc = (docName: string) => {
    setCopiedDoc(docName);
    setTimeout(() => {
      setCopiedDoc(null);
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative flex flex-col w-full border-x border-gray-100 shadow-xs font-sans pb-16">
      
      {/* Top Banner Cover Background with overlay Back Button  */}
      <div className="relative h-44 w-full">
        <img 
          src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80"
          alt="Nazhir Banner"
          className="absolute inset-0 w-full h-full object-cover brightness-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 z-25 flex items-center">
          <button 
            onClick={() => router.push('/wakaf')} 
            className="bg-black/40 hover:bg-black/60 text-white rounded-full p-2.5 backdrop-blur-md transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
          </button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      {/* Profile Card Overlay Container */}
      <div className="px-4 -mt-12 relative z-10">
        <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3.5">
              <img 
                src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=120&q=80" 
                alt="Dompet Dhuafa Logo" 
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-xl border border-gray-100 object-cover p-1 bg-white shadow-xs"
              />
              <div>
                <h2 className="font-extrabold text-gray-900 text-base flex items-center">
                  Dompet Dhuafa
                </h2>
                <div className="mt-1 flex items-center text-[10px] font-black text-amwal-secondary-teal bg-amwal-secondary-teal/5 border border-amwal-secondary-teal/10 px-2 py-0.5 rounded-full w-fit">
                  <ShieldCheck size={12} className="mr-0.5" /> Terverifikasi BWI
                </div>
                <span className="text-[10px] text-gray-400 font-bold block mt-1">SK BWI: 3.3.00001</span>
              </div>
            </div>
          </div>
          
          <p className="text-[11.5px] text-gray-500 leading-relaxed font-semibold text-justify pt-1 border-t border-gray-100">
            Dompet Dhuafa adalah lembaga filantropi Islam nasional terpercaya yang berkhidmat dalam pemberdayaan kaum dhuafa melalui optimalisasi dana Ziswaf (Zakat, Infak, Sedekah, dan Wakaf) secara modern, transparan, berkah, dan berkelanjutan sejak tahun 1993.
          </p>
        </div>
      </div>

      {/* Grid STATS SECTION - 4 cards matching the wireframe */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className="bg-white border border-gray-150 rounded-2xl p-4 shadow-2xs flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-gray-400 leading-snug uppercase tracking-wider">{stat.label}</span>
                <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100/50">
                  {stat.icon}
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="font-black text-gray-800 text-sm leading-tight">{stat.value}</p>
                <p className="text-[9px] text-amwal-secondary-teal/80 font-bold">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information Card */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-2xs space-y-4">
          <div className="flex items-center space-x-1.5 pb-1 border-b border-gray-100">
            <Building size={14} className="text-amwal-secondary-teal" />
            <h3 className="font-extrabold text-xs text-gray-800 uppercase tracking-wide">Informasi Kontak</h3>
          </div>
          
          <div className="space-y-3.5">
            {[
              { 
                icon: <MapPin size={15} className="text-amwal-secondary-teal" />, 
                title: 'Alamat Kantor Pusat', 
                desc: 'Jl. Warung Jati Barat No. 14, Pasar Minggu, Jakarta Selatan' 
              },
              { 
                icon: <Phone size={15} className="text-amwal-secondary-teal" />, 
                title: 'Call Center & Layanan', 
                desc: '021 - 27874080 (Layanan Wakif)' 
              },
              { 
                icon: <Globe size={15} className="text-amwal-secondary-teal" />, 
                title: 'Situs Web Resmi', 
                desc: 'dompetdhuafa.org',
                style: 'text-amwal-secondary-teal font-extrabold hover:underline'
              },
              { 
                icon: <Mail size={15} className="text-amwal-secondary-teal" />, 
                title: 'Surat Elektronik', 
                desc: 'layanan@dompetdhuafa.org' 
              }
            ].map((contact, idx) => (
              <div key={idx} className="flex items-start">
                <div className="w-8 h-8 rounded-lg bg-amwal-secondary-teal/5 border border-amwal-secondary-teal/10 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                  {contact.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9.5px] font-bold text-gray-400 capitalize">{contact.title}</p>
                  <p className={`text-[11px] font-bold text-gray-700 leading-snug mt-0.5 truncate ${contact.style || ''}`}>
                    {contact.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LEGAL DOCUMENTS SECTION */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-2xs space-y-4">
          <div className="flex items-center space-x-1.5 pb-1 border-b border-gray-100">
            <FileText size={14} className="text-rose-600" />
            <h3 className="font-extrabold text-xs text-gray-800 uppercase tracking-wide font-sans">Dokumen Legalitas</h3>
          </div>

          <div className="space-y-2.5">
            {legalDocs.map((doc) => (
              <button 
                type="button"
                key={doc.id}
                onClick={() => handleDownloadDoc(doc.name)}
                className="w-full text-left p-3 bg-gray-50/70 hover:bg-gray-100 rounded-xl border border-gray-150 hover:border-gray-200 transition flex items-center justify-between group active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center mr-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center mr-3 shrink-0">
                    <FileText size={16} className="text-rose-600" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[11px] font-extrabold text-gray-800 leading-snug truncate group-hover:text-amwal-secondary-teal transition">
                      {doc.name}
                    </h4>
                    <span className="text-[9.5px] font-bold text-gray-400 block mt-0.5">{doc.no}</span>
                  </div>
                </div>
                <div className="flex items-center shrink-0 pl-1">
                  <span className="text-[8.5px] font-bold bg-amwal-secondary-teal/5 text-amwal-secondary-teal border border-amwal-secondary-teal/10 px-1.5 py-0.5 rounded mr-2 flex items-center">
                    <CheckCircle2 size={10} className="mr-0.5 shrink-0" /> SAH
                  </span>
                  <div className="text-gray-400 group-hover:text-amwal-secondary-teal transition">
                    <Download size={14} />
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {copiedDoc && (
            <div className="p-2.5 bg-amwal-secondary-teal text-white text-[10.5px] font-bold rounded-lg text-center shadow-xs animate-bounce">
              ✓ Berhasil mengunduh: {copiedDoc}
            </div>
          )}
        </div>
      </div>

      {/* ACTIVE PROGRAMS LIST SECTION */}
      <div className="px-4 mt-5 space-y-3">
        <div className="flex justify-between items-center px-0.5">
          <h3 className="font-extrabold text-gray-800 text-xs uppercase tracking-wide">Program yang aktif</h3>
          <span className="text-[10px] text-amwal-secondary-teal font-extrabold bg-amwal-secondary-teal/5 border border-amwal-secondary-teal/10 px-2 py-0.5 rounded-full">
            {activePrograms.length} Berjalan
          </span>
        </div>

        <div className="space-y-3.5">
          {activePrograms.map((program) => (
            <div 
              key={program.id} 
              onClick={() => router.push('/wakaf')}
              className="bg-white rounded-2xl shadow-sm border border-gray-150 hover:border-amwal-secondary-teal/30 overflow-hidden flex cursor-pointer hover:shadow-xs transition duration-200"
            >
              <img 
                src={program.image} 
                referrerPolicy="no-referrer"
                className="w-24 h-auto object-cover shrink-0" 
                alt={program.title}
              />
              <div className="p-3.5 flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider mb-1.5 inline-block ${program.themeBg}`}>
                    {program.category}
                  </span>
                  <h4 className="font-extrabold text-xs text-gray-800 leading-snug mb-1 line-clamp-1">
                    {program.title}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-bold">{program.institution}</p>
                </div>
                <div className="mt-2.5">
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1.5 border border-gray-200/20">
                    <div className="bg-amwal-secondary-green h-1.5 rounded-full" style={{ width: `${program.progress}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[9.5px]">
                    <span className="text-amwal-secondary-teal font-black">Terkumpul {program.collected}</span>
                    <span className="text-gray-400 font-bold">{program.daysLeft} hari lagi</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
