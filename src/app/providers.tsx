'use client';

import { MarketProvider } from '@/contexts/MarketContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return <MarketProvider>{children}</MarketProvider>;
}
