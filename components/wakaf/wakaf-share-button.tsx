'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy, MessageCircle, X } from 'lucide-react';

interface WakafShareButtonProps {
  judul: string;
  className?: string;
  variant?: 'floating' | 'button' | 'inline';
}

export function WakafShareButton({
  judul,
  className = '',
  variant = 'button',
}: WakafShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  const shareText = `Mari berwakaf untuk program "${judul}" melalui platform Amwal Yayasan Manarul Ilmi ITS. Salurkan kebaikan abadi Anda di:`;

  const handleShareClick = async () => {
    const url = getShareUrl();

    // 1. Try native Web Share API (Mobile browsers)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: judul,
          text: `Mari berwakaf untuk program: ${judul}`,
          url,
        });
        return;
      } catch (err) {
        // User aborted or native share failed -> fallback to modal
      }
    }

    // 2. Fallback to share modal on desktop / unsupported devices
    setIsOpen(true);
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard fallback
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${getShareUrl()}`)}`;

  if (variant === 'floating') {
    return (
      <>
        <button
          onClick={handleShareClick}
          aria-label="Bagikan Program"
          className={`w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 flex items-center justify-center shadow-md active:scale-95 hover:bg-black/60 transition-all cursor-pointer ${className}`}
        >
          {copied ? (
            <Check className="w-5 h-5 text-emerald-400" />
          ) : (
            <Share2 className="w-5 h-5" />
          )}
        </button>

        {/* Modal Fallback */}
        {isOpen && (
          <ShareModal
            judul={judul}
            whatsappUrl={whatsappUrl}
            copied={copied}
            onCopy={handleCopyLink}
            onClose={() => setIsOpen(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleShareClick}
        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs transition-all shadow-2xs cursor-pointer active:scale-[0.98] ${className}`}
      >
        <Share2 className="w-4 h-4 text-[#439F46] shrink-0" />
        <span>Bagikan Program</span>
      </button>

      {/* Modal Fallback */}
      {isOpen && (
        <ShareModal
          judul={judul}
          whatsappUrl={whatsappUrl}
          copied={copied}
          onCopy={handleCopyLink}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

interface ShareModalProps {
  judul: string;
  whatsappUrl: string;
  copied: boolean;
  onCopy: () => void;
  onClose: () => void;
}

function ShareModal({
  judul,
  whatsappUrl,
  copied,
  onCopy,
  onClose,
}: ShareModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-gray-100 relative">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#439F46] flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Bagikan Program</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-3 line-clamp-2 leading-relaxed">
          {judul}
        </p>

        <div className="space-y-2.5 mt-4">
          {/* WhatsApp Share */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Bagikan ke WhatsApp</span>
          </a>

          {/* Copy Link */}
          <button
            type="button"
            onClick={onCopy}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-semibold transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Link Berhasil Disalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-gray-600" />
                <span>Salin Tautan Program</span>
              </>
            )}
          </button>
        </div>

        {copied && (
          <p className="text-[11px] text-center text-emerald-600 font-medium mt-2 animate-in fade-in">
            ✓ Tautan telah disalin ke clipboard!
          </p>
        )}
      </div>
    </div>
  );
}
