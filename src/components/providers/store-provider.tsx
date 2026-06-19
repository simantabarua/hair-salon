'use client';

import React, { useRef } from 'react';
import { Provider } from 'react-redux';
import { store, AppStore } from '@/store';

interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const storeRef = useRef<AppStore | null>(null);
  // eslint-disable-next-line react-hooks/refs
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = store;
  }

  // eslint-disable-next-line react-hooks/refs
  return <Provider store={storeRef.current}>{children}</Provider>;
}
