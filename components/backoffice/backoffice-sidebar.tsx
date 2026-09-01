'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShieldCheck,
  Building2,
  Layers,
  PlusCircle,
  Receipt,
  HeartHandshake,
  Coins,
  PackageCheck,
  Users,
  Grid,
  FileSpreadsheet,
  BookOpen,
  GraduationCap,
  Newspaper,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';

interface BackofficeSidebarProps {
  role?: 'ADMIN' | 'NADZIR' | string;
  userName?: string;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

interface SubMenuItem {
  id: string;
  label: string;
  subtitle: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  /** exact match = pathname must be exactly this href; default false = startsWith */
  exactMatch?: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  subtitle: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  sectionHeader?: string;
  isDropdown?: boolean;
  children?: SubMenuItem[];
}

export function BackofficeSidebar({
  role = 'ADMIN',
  userName = 'Super Admin',
  mobileOpen = false,
  setMobileOpen,
}: BackofficeSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = role === 'ADMIN';

  const [pendingCounts, setPendingCounts] = useState<{
    total: number;
    nadzir: number;
    withdrawals: number;
    permohonan: number;
  } | null>(null);

  const [manualDropdownState, setManualDropdownState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isAdmin) {
      fetch('/api/admin/approvals/pending')
        .then((res) => res.json())
        .then((json) => {
          if (json?.data?.counts) {
            setPendingCounts(json.data.counts);
          }
        })
        .catch(() => {});
    }
  }, [isAdmin, pathname]);

  const toggleDropdown = (id: string, currentlyOpen: boolean) => {
    setManualDropdownState((prev) => ({
      ...prev,
      [id]: !currentlyOpen,
    }));
  };

  const handleNavClick = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    router.push('/login');
  };

  /** Precise sub-item active check — avoids multiple items lighting up for shared hrefs */
  const isSubItemActive = (sub: SubMenuItem, siblings: SubMenuItem[]): boolean => {
    // Always use exact href matching to prevent cross-contamination
    if (sub.exactMatch) return pathname === sub.href;
    // Non-exact: check siblings for a more specific match first
    const exactSiblingMatch = siblings.find((s) => s !== sub && pathname === s.href);
    if (exactSiblingMatch) return false;
    return pathname === sub.href || pathname.startsWith(sub.href + '/') || pathname.startsWith(sub.href + '?');
  };

  /** Precise leaf-item active check — uses searchParams-aware comparison */
  const isLeafActive = (item: MenuItem): boolean => {
    if (!item.href || item.isDropdown) return false;
    // /admin must be exact to avoid matching /admin/approvals etc.
    if (item.href === '/admin') return pathname === '/admin';
    // For /admin/approvals: only active when there is no extra ?tab= query
    // (sub-item 'Audit Kuitansi Belanja' uses /admin/approvals?tab=kuitansi)
    if (item.href === '/admin/approvals') {
      return pathname === '/admin/approvals';
    }
    return pathname === item.href;
  };

  const menuItems: MenuItem[] = isAdmin
    ? [
        // ── TATA KELOLA AMWAL ──────────────────────────────
        {
          id: 'overview',
          label: 'Ringkasan Utama',
          subtitle: 'RFMD, Retensi & Status Otoritas',
          href: '/admin',
          icon: LayoutDashboard,
          sectionHeader: 'Tata Kelola Amwal',
        },
        {
          id: 'super_admin_approvals',
          label: 'Pusat Persetujuan',
          subtitle: 'Audit & Verifikasi Terpadu',
          href: '/admin/approvals',
          icon: ShieldCheck,
          badge:
            pendingCounts && pendingCounts.total > 0
              ? `${pendingCounts.total} Antrean`
              : undefined,
        },
        {
          id: 'nazhir_verifikasi',
          label: 'Verifikasi Nazhir',
          subtitle: 'Pendaftaran Lembaga BWI',
          href: '/admin/nadzir-verifikasi',
          icon: Building2,
          badge:
            pendingCounts && pendingCounts.nadzir > 0
              ? `${pendingCounts.nadzir} Menunggu`
              : undefined,
        },

        // ── PENGAWASAN PROGRAM ─────────────────────────────
        {
          id: 'wakaf_dropdown',
          label: 'Program Wakaf',
          subtitle: 'Manajemen & Progres Fisik',
          icon: Layers,
          sectionHeader: 'Pengawasan Program',
          isDropdown: true,
          children: [
            {
              id: 'wakaf_list',
              label: 'Daftar Program Wakaf',
              subtitle: 'Monitoring & Progres Fisik',
              href: '/admin/wakaf',
              icon: Layers,
              exactMatch: true,
            },
            {
              id: 'wakaf_create',
              label: 'Buat Program Langsung',
              subtitle: 'Terbitkan Program Baru',
              href: '/admin/wakaf?view=create',
              icon: PlusCircle,
              exactMatch: true,
            },
            {
              id: 'wakaf_receipts',
              label: 'Audit Kuitansi Belanja',
              subtitle: 'Verifikasi Pengeluaran & OCR',
              href: '/admin/wakaf?view=receipts',
              icon: Receipt,
              exactMatch: true,
            },
          ],
        },

        // ── MONITORING ZISWAF ──────────────────────────────
        {
          id: 'ziswaf_dropdown',
          label: 'Modul Amil ZISWAF',
          subtitle: 'Infaq, Zakat 8 Asnaf & Qurban',
          icon: HeartHandshake,
          sectionHeader: 'Monitoring ZISWAF',
          isDropdown: true,
          children: [
            {
              id: 'ziswaf_infaq',
              label: 'Infaq & Sedekah',
              subtitle: 'Kategori & Transaksi QRIS',
              href: '/admin/ziswaf/infaq',
              icon: HeartHandshake,
              exactMatch: true,
            },
            {
              id: 'ziswaf_zakat',
              label: 'Zakat & 8 Asnaf',
              subtitle: 'Kalkulator & Penyaluran',
              href: '/admin/ziswaf/zakat',
              icon: Coins,
              exactMatch: true,
            },
            {
              id: 'ziswaf_qurban',
              label: 'Qurban & RPH',
              subtitle: 'Katalog, Patungan & Sembelih',
              href: '/admin/ziswaf/qurban',
              icon: PackageCheck,
              exactMatch: true,
            },
          ],
        },

        // ── ANALITIK & TRANSPARANSI ────────────────────────
        {
          id: 'segmentation',
          label: 'Kelompok Donatur',
          subtitle: 'Tabel Segmentasi RFM-D',
          href: '/admin/segmentasi',
          icon: Users,
          sectionHeader: 'Analitik & Transparansi',
        },
        {
          id: 'cohort',
          label: 'Kesetiaan Donatur',
          subtitle: 'Retensi & Heatmap M+1',
          href: '/admin/kesetiaan',
          icon: Grid,
        },
        {
          id: 'transparansi',
          label: 'Catatan Transparansi',
          subtitle: 'Log Audit & Realisasi Dana',
          href: '/admin/transparansi',
          icon: FileSpreadsheet,
        },

        // ── SISTEM INFORMASI & PUBLIKASI ───────────────────
        {
          id: 'education_dropdown',
          label: 'Edukasi & Berita',
          subtitle: 'Artikel, Video & Publikasi',
          icon: BookOpen,
          sectionHeader: 'Sistem Informasi & Publikasi',
          isDropdown: true,
          children: [
            {
              id: 'education',
              label: 'Manajemen Edukasi',
              subtitle: 'Artikel Fiqih & Literasi',
              href: '/admin/edukasi',
              icon: GraduationCap,
              exactMatch: true,
            },
            {
              id: 'news',
              label: 'Manajemen Berita',
              subtitle: 'Liputan Kegiatan & Pengumuman',
              href: '/admin/berita',
              icon: Newspaper,
              exactMatch: true,
            },
            {
              id: 'documents',
              label: 'Dokumen Legalitas',
              subtitle: 'Arsip SK, AIW & Sertifikat',
              href: '/admin/dokumen',
              icon: FileText,
              exactMatch: true,
            },
          ],
        },
        {
          id: 'settings',
          label: 'Pengaturan Sistem',
          subtitle: 'Konfigurasi Platform',
          href: '/admin/pengaturan',
          icon: Settings,
        },
      ]
    : [
        {
          id: 'nazhir_manage',
          label: 'Manajemen Program',
          subtitle: 'Progres Fisik & Status BWI',
          href: '/nazhir',
          icon: Layers,
          sectionHeader: 'Modul Nazhir Wakaf',
        },
        {
          id: 'nazhir_receipts_single',
          label: 'Kuitansi & Bukti Belanja',
          subtitle: 'Unggah & Status Audit',
          href: '/nazhir',
          icon: Receipt,
        },
      ];

  const userInitial = userName.trim().charAt(0).toUpperCase() || 'A';

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen && setMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col h-screen shrink-0 font-jakarta shadow-sm transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#1B5E20] rounded-xl flex items-center justify-center text-white font-bold text-base shadow-xs shrink-0">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#1B5E20] uppercase leading-none">
                AMWAL
              </span>
              <span className="text-[9px] font-semibold text-emerald-800 tracking-wider uppercase mt-0.5">
                Social Finance Platform
              </span>
            </div>
          </div>

          {setMobileOpen && (
            <button
              type="button"
              aria-label="Tutup Menu"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Menu — scrollable */}
        <div className="px-3 flex-1 overflow-y-auto space-y-0.5 py-3 no-scrollbar">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isDropdown = !!(item.isDropdown && item.children && item.children.length > 0);
            const siblings = item.children ?? [];
            const isChildActive = isDropdown && siblings.some((c) => isSubItemActive(c, siblings));
            const defaultOpen = isChildActive || item.id === 'wakaf_dropdown';
            const isOpen = isDropdown
              ? manualDropdownState[item.id] !== undefined
                ? manualDropdownState[item.id]
                : defaultOpen
              : false;
            // Active for leaf menu items — uses precise isLeafActive() helper
            const isActive = !isDropdown && isLeafActive(item);

            return (
              <div key={item.id}>
                {/* Section Header */}
                {item.sectionHeader && (
                  <div
                    className={`px-2 ${
                      index === 0 ? 'pt-0.5' : 'pt-4'
                    } pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400`}
                  >
                    {item.sectionHeader}
                  </div>
                )}

                {/* DROPDOWN ACCORDION */}
                {isDropdown ? (
                  <div>
                    <button
                      type="button"
                      onClick={() => toggleDropdown(item.id, isOpen)}
                      className={`w-full flex items-center justify-between px-2.5 py-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                        isChildActive
                          ? 'bg-emerald-50/80 border border-emerald-200/70 text-emerald-950 font-semibold'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Direct icon render — no wrapper box to prevent dot-compression */}
                        <Icon
                          className={`w-5 h-5 min-w-[20px] min-h-[20px] shrink-0 ${
                            isChildActive
                              ? 'text-emerald-700'
                              : 'text-slate-500 group-hover:text-emerald-700'
                          }`}
                        />
                        <div className="truncate">
                          <div className="text-xs font-bold truncate leading-tight">
                            {item.label}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-1">
                        {item.badge && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                              isChildActive
                                ? 'bg-emerald-700 text-white border-emerald-600'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {isOpen ? (
                          <ChevronUp
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isChildActive ? 'text-emerald-700' : 'text-slate-400'
                            }`}
                          />
                        ) : (
                          <ChevronDown
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isChildActive ? 'text-emerald-700' : 'text-slate-400'
                            }`}
                          />
                        )}
                      </div>
                    </button>

                    {/* Sub-items */}
                    {isOpen && (
                      <div className="mt-0.5 pl-3.5 ml-3 border-l-2 border-emerald-200/70 space-y-0.5 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                        {siblings.map((sub) => {
                          const SubIcon = sub.icon;
                          const isSubActive = isSubItemActive(sub, siblings);

                          return (
                            <Link
                              key={sub.id}
                              href={sub.href}
                              onClick={handleNavClick}
                              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-all cursor-pointer group ${
                                isSubActive
                                  ? 'bg-[#1B5E20] text-white shadow-xs'
                                  : 'text-slate-600 hover:bg-emerald-50 hover:text-[#1B5E20]'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <SubIcon
                                  className={`w-4 h-4 min-w-[16px] min-h-[16px] shrink-0 ${
                                    isSubActive
                                      ? 'text-white'
                                      : 'text-slate-400 group-hover:text-emerald-600'
                                  }`}
                                />
                                <div className="truncate">
                                  <div className="text-xs truncate leading-tight font-medium">
                                    {sub.label}
                                  </div>
                                  <div
                                    className={`text-[9px] truncate ${
                                      isSubActive ? 'text-emerald-100' : 'text-slate-400'
                                    }`}
                                  >
                                    {sub.subtitle}
                                  </div>
                                </div>
                              </div>

                              {sub.badge && (
                                <span
                                  className={`ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                                    isSubActive
                                      ? 'bg-white/20 text-white'
                                      : 'bg-emerald-100 text-emerald-800'
                                  }`}
                                >
                                  {sub.badge}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  /* REGULAR LEAF MENU ITEM */
                  <Link
                    href={item.href || '#'}
                    onClick={handleNavClick}
                    className={`w-full flex items-center justify-between px-2.5 py-2.5 rounded-xl text-left transition-all cursor-pointer group border ${
                      isActive
                        ? 'bg-[#1B5E20] text-white shadow-xs border-transparent'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Direct icon render — no wrapper box */}
                      <Icon
                        className={`w-5 h-5 min-w-[20px] min-h-[20px] shrink-0 ${
                          isActive
                            ? 'text-white'
                            : 'text-slate-500 group-hover:text-emerald-700'
                        }`}
                      />
                      <div className="truncate">
                        <div className="text-xs font-bold truncate leading-tight">
                          {item.label}
                        </div>
                        <div
                          className={`text-[10px] truncate mt-0.5 ${
                            isActive ? 'text-emerald-100' : 'text-slate-400'
                          }`}
                        >
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    {item.badge && (
                      <span
                        className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white border-white/30'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Logout Card — exact 1:1 with prototype */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 shrink-0 space-y-2">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2 px-3 bg-white hover:bg-rose-50 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs whitespace-nowrap"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            Keluar / Ganti Akun Role
          </button>

          <div className="text-[10px] text-center text-slate-400 font-mono">
            Amwal Sys v2.8 Syariah
          </div>
        </div>
      </aside>
    </>
  );
}
