'use client';

import { useRouter } from 'next/navigation';
import { AdminCreate } from '@/pages/AdminCreate';
import { useMarkets } from '@/contexts/MarketContext';

export default function AdminCreatePage() {
  const router = useRouter();
  const { createMarket, batchCreateMarkets } = useMarkets();

  const handleCreate = async (market: any) => {
    try {
      const savedMarket = await createMarket(market);
      router.push('/');
      return savedMarket;
    } catch (error) {
      alert('创建市场失败，请重试');
      throw error;
    }
  };

  const handleBatchCreate = async (markets: any[]) => {
    try {
      const savedMarkets = await batchCreateMarkets(markets);
      router.push('/admin');
      return savedMarkets;
    } catch (error) {
      alert('批量创建市场失败，请重试');
      throw error;
    }
  };

  return (
    <AdminCreate
      onCreate={handleCreate}
      onBatchCreate={handleBatchCreate}
    />
  );
}
