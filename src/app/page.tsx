'use client';

import { useRouter } from 'next/navigation';
import { Home } from '@/pages/Home';
import { useMarkets } from '@/contexts/MarketContext';

export default function HomePage() {
  const router = useRouter();
  const { markets, loading } = useMarkets();

  const handleMarketClick = (id: string) => {
    router.push(`/market/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return <Home onMarketClick={handleMarketClick} markets={markets} />;
}
