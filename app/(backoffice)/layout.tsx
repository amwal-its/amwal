import React from 'react';
import { getSession } from '@/lib/session';
import { BackofficeSidebar } from '@/components/backoffice/backoffice-sidebar';
import { BackofficeHeader } from '@/components/backoffice/backoffice-header';

export const dynamic = 'force-dynamic';

export default async function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const role = session?.role || 'ADMIN';
  const userName = session?.email || (role === 'ADMIN' ? 'Super Admin BWI' : 'Nadzir YMI ITS');

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-jakarta antialiased">
      {/* Sidebar Navigation */}
      <BackofficeSidebar role={role} userName={userName} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <BackofficeHeader
          role={role}
          userName={userName}
        />
        <div className="flex-1 pb-16">{children}</div>
      </div>
    </div>
  );
}
