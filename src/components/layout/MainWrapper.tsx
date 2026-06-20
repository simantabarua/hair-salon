'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  return (
    <main className={`flex-grow ${isAdmin ? '' : 'pt-16 md:pt-20'}`}>
      {children}
    </main>
  );
}
