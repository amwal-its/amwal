"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Wallet, Info, HandHeart } from 'lucide-react';

interface NotificationItem {
  id: number;
  type: 'transaction' | 'update' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: React.ReactNode;
}

export default function NotificationsPage() {
  const router = useRouter();

  const notifications: NotificationItem[] = [
    {
      id: 1,
      type: 'transaction',
      title: 'Pembayaran Berhasil',
      message: 'Alhamdulillah, pembayaran wakaf Anda sebesar Rp 500.000 telah kami terima.',
      time: '10 menit yang lalu',
      read: false,
      icon: <Wallet size={20} />
    },
    {
      id: 2,
      type: 'update',
      title: 'Update Program Wakaf',
      message: 'Pembangunan Gedung Sekolah Yatim yang Anda danai telah mencapai progres 45%.',
      time: '2 jam yang lalu',
      read: false,
      icon: <HandHeart size={20} />
    },
    {
      id: 3,
      type: 'info',
      title: 'Selamat Datang di Amwal',
      message: 'Mulai perjalanan amal jariyah Anda bersama kami. Temukan program wakaf pilihan.',
      time: '1 hari yang lalu',
      read: true,
      icon: <Info size={20} />
    }
  ];

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative flex flex-col w-full border-x border-gray-100 shadow-xs">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center sticky top-0 z-10 border-b border-gray-100 shadow-sm">
        <button onClick={() => router.back()} className="mr-3 text-gray-600 hover:text-amwal-secondary-teal transition cursor-pointer">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg flex-1">Notifikasi</h1>
      </div>

      {/* Notifications List */}
      <div className="p-4 space-y-3">
        {notifications.map(notif => (
          <div 
            key={notif.id} 
            className={`bg-white p-4 rounded-xl border flex space-x-3 transition cursor-pointer hover:shadow-xs ${
              notif.read 
                ? 'border-gray-100' 
                : 'border-amwal-secondary-teal/20 bg-amwal-secondary-teal/5 shadow-3xs'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              notif.type === 'transaction' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
              notif.type === 'update' ? 'bg-amwal-secondary-teal/10 text-amwal-secondary-teal border border-amwal-secondary-teal/10' :
              'bg-amber-50 text-amber-600 border border-amber-100'
            }`}>
              {notif.icon}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className={`text-sm ${notif.read ? 'font-medium text-gray-700' : 'font-bold text-gray-900'}`}>
                  {notif.title}
                </h4>
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-amwal-secondary-teal mt-1.5 shrink-0 animate-pulse"></div>
                )}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-2">{notif.message}</p>
              <p className="text-[10px] text-gray-400 font-semibold">{notif.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
