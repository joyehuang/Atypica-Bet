
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { MarketDetail } from './pages/MarketDetail';
import { AdminList } from './pages/AdminList';
import { AdminCreate } from './pages/AdminCreate';
import { PredictionMarket, PredictionStatus } from './types';
import { INITIAL_MARKETS } from './constants';

const App: React.FC = () => {
  const [markets, setMarkets] = useState<PredictionMarket[]>(INITIAL_MARKETS);
  const [view, setView] = useState<'HOME' | 'DETAIL' | 'ADMIN' | 'CREATE'>('HOME');
  const [activeMarketId, setActiveMarketId] = useState<string | null>(null);

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

  const handleDeleteMarket = (id: string) => {
    if (confirm('确定要删除这个预测市场吗？')) {
      setMarkets(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleResolveMarket = (id: string, winnerId: string) => {
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
  };

  const handleSaveMarket = (market: PredictionMarket) => {
    setMarkets(prev => [market, ...prev]);
    window.location.hash = '#/admin';
  };

  const handleBatchSaveMarkets = (markets: PredictionMarket[]) => {
    setMarkets(prev => [...markets, ...prev]);
    window.location.hash = '#/admin';
  };

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
