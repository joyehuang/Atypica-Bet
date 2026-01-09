'use client';

import { AdminList } from '@/pages/AdminList';
import { useMarkets } from '@/contexts/MarketContext';

export default function AdminPage() {
  const { markets, deleteMarket, resolveMarket } = useMarkets();

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这个预测市场吗？')) {
      try {
        await deleteMarket(id);
      } catch (error) {
        alert('删除市场失败，请重试');
      }
    }
  };

  const handleResolve = async (id: string, winnerId: string) => {
    try {
      await resolveMarket(id, winnerId);
      alert('市场已成功结算！');
    } catch (error) {
      alert('结算市场失败，请重试');
    }
  };

  return (
    <AdminList
      markets={markets}
      onDelete={handleDelete}
      onResolve={handleResolve}
    />
  );
}
