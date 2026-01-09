'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PredictionMarket, PredictionStatus } from '@/types';
import { INITIAL_MARKETS } from '@/constants';
import {
  getMarketsFromDatabase,
  saveMarketToDatabase,
  saveMarketsToDatabase,
  deleteMarketFromDatabase,
  resolveMarketInDatabase,
} from '@/services/databaseService';

interface MarketContextType {
  markets: PredictionMarket[];
  loading: boolean;
  refreshMarkets: () => Promise<void>;
  createMarket: (market: PredictionMarket) => Promise<PredictionMarket>;
  batchCreateMarkets: (markets: PredictionMarket[]) => Promise<PredictionMarket[]>;
  deleteMarket: (id: string) => Promise<void>;
  resolveMarket: (id: string, winnerId: string) => Promise<void>;
  updateMarket: (market: PredictionMarket) => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export function MarketProvider({ children }: { children: ReactNode }) {
  const [markets, setMarkets] = useState<PredictionMarket[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMarkets = async () => {
    try {
      setLoading(true);
      const dbMarkets = await getMarketsFromDatabase();
      if (dbMarkets.length > 0) {
        setMarkets(dbMarkets);
      } else {
        setMarkets(INITIAL_MARKETS);
      }
    } catch (error) {
      console.error('加载市场数据失败:', error);
      setMarkets(INITIAL_MARKETS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarkets();
  }, []);

  const createMarket = async (market: PredictionMarket): Promise<PredictionMarket> => {
    try {
      const savedMarket = await saveMarketToDatabase(market);
      setMarkets(prev => [savedMarket, ...prev]);
      return savedMarket;
    } catch (error) {
      console.error('创建市场失败:', error);
      throw error;
    }
  };

  const batchCreateMarkets = async (newMarkets: PredictionMarket[]): Promise<PredictionMarket[]> => {
    try {
      const savedMarkets = await saveMarketsToDatabase(newMarkets);
      setMarkets(prev => [...savedMarkets, ...prev]);
      return savedMarkets;
    } catch (error) {
      console.error('批量创建市场失败:', error);
      throw error;
    }
  };

  const deleteMarket = async (id: string): Promise<void> => {
    try {
      await deleteMarketFromDatabase(id);
      setMarkets(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('删除市场失败:', error);
      throw error;
    }
  };

  const resolveMarket = async (id: string, winnerId: string): Promise<void> => {
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
      throw error;
    }
  };

  const updateMarket = (market: PredictionMarket) => {
    setMarkets(prev => prev.map(m => m.id === market.id ? market : m));
  };

  return (
    <MarketContext.Provider
      value={{
        markets,
        loading,
        refreshMarkets: loadMarkets,
        createMarket,
        batchCreateMarkets,
        deleteMarket,
        resolveMarket,
        updateMarket,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
}

export function useMarkets() {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error('useMarkets must be used within a MarketProvider');
  }
  return context;
}
