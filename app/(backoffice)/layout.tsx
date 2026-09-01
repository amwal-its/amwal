import React from 'react';
import { getSession } from '@/lib/session';
import { BackofficeShell } from '@/components/backoffice/backoffice-shell';

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
    <BackofficeShell role={role} userName={userName}>
      {children}
    </BackofficeShell>
  );
}
