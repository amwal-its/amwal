'use client';

import React, { useState, useEffect } from 'react';

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body?: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notifications', {
        headers: {
          'x-user-id': 'usr_dummy_wakif', // fallback header for mock user
        },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.data.notifications || []);
        setUnreadCount(data.data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Fetch notifications error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'x-user-id': 'usr_dummy_wakif',
        },
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error('Mark notification read error:', err);
    }
  };

  return (
    <div className="relative inline-block">
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className="relative p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors focus:outline-hidden"
        title="Notifikasi"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
            <h4 className="text-sm font-bold text-slate-800">Notifikasi System</h4>
            {unreadCount > 0 && (
              <button
                onClick={() => handleMarkAsRead('all')}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
              >
                Tandai Semua Terbaca
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="p-4 text-center text-xs text-slate-400">Memuat notifikasi...</div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">Belum ada notifikasi baru</div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => !item.isRead && handleMarkAsRead(item.id)}
                  className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                    !item.isRead ? 'bg-emerald-50/40' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className={`text-xs font-bold ${!item.isRead ? 'text-slate-900' : 'text-slate-600'}`}>
                      {item.title}
                    </h5>
                    {!item.isRead && <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 mt-1" />}
                  </div>
                  {item.body && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.body}</p>}
                  <span className="text-[10px] text-slate-400 mt-1.5 block">
                    {new Date(item.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
