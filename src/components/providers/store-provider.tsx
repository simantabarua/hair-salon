'use client';

import React, { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';
import { store, AppStore } from '@/store';
import { initializeCart } from '@/store/slices/cartSlice';

interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const storeRef = useRef<AppStore | null>(null);
  // eslint-disable-next-line react-hooks/refs
  if (!storeRef.current) {
    storeRef.current = store;
  }

  useEffect(() => {
    if (storeRef.current) {
      storeRef.current.dispatch(initializeCart());
    }
  }, []);

  // eslint-disable-next-line react-hooks/refs
  return (
    <Provider store={storeRef.current}>
      <SessionProvider>{children}</SessionProvider>
    </Provider>
  );
}
