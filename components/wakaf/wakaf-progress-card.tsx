import React from 'react';
import { Clock } from 'lucide-react';

interface WakafProgressCardProps {
  terkumpul: number;
  target: number;
  durasiHari?: number | null;
  createdAt?: string | Date;
}

export function WakafProgressCard({
  terkumpul,
  target,
  durasiHari = 60,
  createdAt,
}: WakafProgressCardProps) {
  const percentage = target > 0 ? Math.min(100, Math.round((terkumpul / target) * 100)) : 0;

  // Calculate remaining days if createdAt and durasiHari exist
  let sisaHari = durasiHari || 45;
  if (createdAt && durasiHari) {
    const createdDate = new Date(createdAt);
    const endDate = new Date(createdDate.getTime() + durasiHari * 24 * 60 * 60 * 1000);
    const diffTime = endDate.getTime() - new Date().getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    sisaHari = daysLeft > 0 ? daysLeft : 0;
  }

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-[#F8F9FA] border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs transition-all">
      {/* Top Metrics Row */}
      <div className="flex items-start justify-between gap-4 mb-3">
        {/* Left: Terkumpul */}
        <div>
          <span className="block text-[10px] sm:text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Terkumpul
          </span>
          <span className="text-lg sm:text-xl font-extrabold text-[#00AA45] tracking-tight">
            {formatRupiah(terkumpul)}
          </span>
        </div>

        {/* Right: Target */}
        <div className="text-right">
          <span className="block text-[10px] sm:text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Target
          </span>
          <span className="text-sm sm:text-base font-bold text-gray-900">
            {formatRupiah(target)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-[#00AA45] rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${Math.max(3, percentage)}%` }}
        />
      </div>

      {/* Bottom Sub-info */}
      <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
        <span className="font-semibold text-gray-600">{percentage}% Tercapai</span>

        <div className="inline-flex items-center gap-1.5 bg-white border border-gray-200/90 px-3 py-1 rounded-full shadow-xs text-gray-700">
          <Clock className="w-3.5 h-3.5 text-gray-500" />
          <span>{sisaHari > 0 ? `${sisaHari} Hari Lagi` : 'Selesai'}</span>
        </div>
      </div>
    </div>
  );
}
