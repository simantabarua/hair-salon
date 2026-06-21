'use client';

import React, { useRef } from 'react';
import { Provider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';
import { store, AppStore } from '@/store';

interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const storeRef = useRef<AppStore | null>(null);
  // eslint-disable-next-line react-hooks/refs
  if (!storeRef.current) {
    storeRef.current = store;
  }

  // eslint-disable-next-line react-hooks/refs
  return (
    <Provider store={storeRef.current}>
      <SessionProvider>{children}</SessionProvider>
    </Provider>
  );
}
