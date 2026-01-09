'use client';

import { useParams } from 'next/navigation';
import { MarketDetail } from '@/pages/MarketDetail';
import { useMarkets } from '@/contexts/MarketContext';

export default function MarketDetailPage() {
  const params = useParams();
  const { markets, updateMarket } = useMarkets();
  const marketId = params.id as string;

  return (
    <MarketDetail
      marketId={marketId}
      markets={markets}
      onEdit={updateMarket}
    />
  );
}
