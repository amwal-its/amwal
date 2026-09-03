'use client';

import React, { useState } from 'react';
import { BackofficeSidebar } from './backoffice-sidebar';
import { BackofficeHeader } from './backoffice-header';
import { motion, AnimatePresence } from 'motion/react';
import { usePathname } from 'next/navigation';
import { ToastProvider } from '@/components/ui/toast';

interface BackofficeShellProps {
  role: string;
  userName: string;
  children: React.ReactNode;
}

export function BackofficeShell({ role, userName, children }: BackofficeShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <ToastProvider>
      <div className="flex min-h-screen w-full bg-[#F8F9FA] font-jakarta antialiased">
      {/* Sidebar Navigation */}
      <BackofficeSidebar
        role={role}
        userName={userName}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 min-h-screen overflow-x-hidden">
        <BackofficeHeader
          role={role}
          userName={userName}
          onToggleMobileMenu={() => setMobileOpen((prev) => !prev)}
        />

        {/* Page Content with Motion Fade Transition */}
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex-1 min-w-0"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
    </ToastProvider>
  );
}
