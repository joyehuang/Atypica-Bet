
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { MarketDetail } from './pages/MarketDetail';
import { AdminList } from './pages/AdminList';
import { AdminCreate } from './pages/AdminCreate';
import { PredictionMarket, PredictionStatus } from './types';
import { INITIAL_MARKETS } from './constants';
import {
  getMarketsFromDatabase,
  saveMarketToDatabase,
  saveMarketsToDatabase,
  deleteMarketFromDatabase,
  resolveMarketInDatabase,
} from './services/databaseService';

const App: React.FC = () => {
  const [markets, setMarkets] = useState<PredictionMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'HOME' | 'DETAIL' | 'ADMIN' | 'CREATE'>('HOME');
  const [activeMarketId, setActiveMarketId] = useState<string | null>(null);

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

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/market/')) {
        const id = hash.replace('#/market/', '');
        setActiveMarketId(id);
        setView('DETAIL');
      } else if (hash === '#/admin') {
        setView('ADMIN');
      } else if (hash === '#/admin/create') {
        setView('CREATE');
      } else {
        setView('HOME');
        setActiveMarketId(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleMarketClick = (id: string) => {
    window.location.hash = `#/market/${id}`;
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
    } catch (error) {
      console.error('结算市场失败:', error);
      alert('结算市场失败，请重试');
    }
  };

  const handleSaveMarket = async (market: PredictionMarket) => {
    try {
      const savedMarket = await saveMarketToDatabase(market);
      setMarkets(prev => [savedMarket, ...prev]);
      window.location.hash = '#/admin';
    } catch (error) {
      console.error('保存市场失败:', error);
      alert('保存市场失败，请检查 API 服务器是否运行');
    }
  };

  const handleBatchSaveMarkets = async (markets: PredictionMarket[]) => {
    try {
      const savedMarkets = await saveMarketsToDatabase(markets);
      setMarkets(prev => [...savedMarkets, ...prev]);
      window.location.hash = '#/admin';
    } catch (error) {
      console.error('批量保存市场失败:', error);
      alert('批量保存市场失败，请检查 API 服务器是否运行');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white/60">加载中...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {view === 'HOME' && <Home onMarketClick={handleMarketClick} markets={markets} />}
      {view === 'DETAIL' && activeMarketId && (
        <MarketDetail 
          marketId={activeMarketId} 
          markets={markets} 
          onBack={() => window.location.hash = '#'} 
        />
      )}
      {view === 'ADMIN' && (
        <AdminList 
          markets={markets} 
          onAdd={() => window.location.hash = '#/admin/create'} 
          onDelete={handleDeleteMarket}
          onResolve={handleResolveMarket}
        />
      )}
      {view === 'CREATE' && (
        <AdminCreate
          onBack={() => window.location.hash = '#/admin'}
          onSave={handleSaveMarket}
          onBatchSave={handleBatchSaveMarkets}
        />
      )}
    </Layout>
  );
};

export default App;
