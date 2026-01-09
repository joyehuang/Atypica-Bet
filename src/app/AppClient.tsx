'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home } from '@/pages/Home';
import { MarketDetail } from '@/pages/MarketDetail';
import { AdminList } from '@/pages/AdminList';
import { AdminCreate } from '@/pages/AdminCreate';
import { PredictionMarket, PredictionStatus } from '@/types';
import { INITIAL_MARKETS } from '@/constants';
import {
  getMarketsFromDatabase,
  saveMarketToDatabase,
  saveMarketsToDatabase,
  deleteMarketFromDatabase,
  resolveMarketInDatabase,
} from '@/services/databaseService';

export default function AppClient() {
  const [markets, setMarkets] = useState<PredictionMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // 从数据库加载市场数据
  useEffect(() => {
    const loadMarkets = async () => {
      try {
        setLoading(true);
        const dbMarkets = await getMarketsFromDatabase();
        if (dbMarkets.length > 0) {
          setMarkets(dbMarkets);
        } else {
          // 如果数据库为空，使用初始数据
          setMarkets(INITIAL_MARKETS);
        }
      } catch (error) {
        console.error('加载市场数据失败:', error);
        // 如果 API 不可用，使用初始数据
        setMarkets(INITIAL_MARKETS);
      } finally {
        setLoading(false);
      }
    };

    loadMarkets();
  }, []);

  const handleMarketClick = (id: string) => {
    router.push(`/market/${id}`);
  };

  const handleDeleteMarket = async (id: string) => {
    if (confirm('确定要删除这个预测市场吗？')) {
      try {
        await deleteMarketFromDatabase(id);
        setMarkets(prev => prev.filter(m => m.id !== id));
      } catch (error) {
        console.error('删除市场失败:', error);
        alert('删除市场失败，请重试');
      }
    }
  };

  const handleResolveMarket = async (id: string, winnerId: string) => {
    try {
      await resolveMarketInDatabase(id, winnerId);
      setMarkets(prev => prev.map(m => {
        if (m.id === id) {
          const isAtypicaCorrect = m.atypicaPickId === winnerId;
          return {
            ...m,
            status: isAtypicaCorrect ? PredictionStatus.SUCCESSFUL : PredictionStatus.FAILED,
            options: m.options.map(o => ({ ...o, isWinner: o.id === winnerId })),
            resolveDate: new Date().toISOString()
          };
        }
        return m;
      }));
      alert('市场已成功结算！');
    } catch (error) {
      console.error('结算市场失败:', error);
      alert('结算市场失败，请重试');
    }
  };

  const handleCreateMarket = async (market: PredictionMarket) => {
    try {
      const savedMarket = await saveMarketToDatabase(market);
      setMarkets(prev => [savedMarket, ...prev]);
      router.push('/');
      return savedMarket;
    } catch (error) {
      console.error('创建市场失败:', error);
      alert('创建市场失败，请重试');
      throw error;
    }
  };

  const handleBatchCreate = async (newMarkets: PredictionMarket[]) => {
    try {
      const savedMarkets = await saveMarketsToDatabase(newMarkets);
      setMarkets(prev => [...savedMarkets, ...prev]);
      router.push('/admin');
      return savedMarkets;
    } catch (error) {
      console.error('批量创建市场失败:', error);
      alert('批量创建市场失败，请重试');
      throw error;
    }
  };

  const handleEditMarket = async (market: PredictionMarket) => {
    setMarkets(prev => prev.map(m => m.id === market.id ? market : m));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // 根据路径渲染不同的页面
  if (pathname === '/admin') {
    return (
      <AdminList
        markets={markets}
        onDelete={handleDeleteMarket}
        onResolve={handleResolveMarket}
      />
    );
  }

  if (pathname === '/admin/create') {
    return (
      <AdminCreate
        onCreate={handleCreateMarket}
        onBatchCreate={handleBatchCreate}
      />
    );
  }

  if (pathname?.startsWith('/market/')) {
    const id = pathname.replace('/market/', '');
    return (
      <MarketDetail
        marketId={id}
        markets={markets}
        onEdit={handleEditMarket}
      />
    );
  }

  return (
    <Home
      onMarketClick={handleMarketClick}
      markets={markets}
    />
  );
}
