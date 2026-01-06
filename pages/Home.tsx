
import React, { useState, useMemo } from 'react';
import { PredictionMarket, Category, PredictionStatus } from '../types';
import { INITIAL_MARKETS, CATEGORY_LABELS } from '../constants';
import { PredictionCard } from '../components/PredictionCard';
import { ChevronDown, SlidersHorizontal, CheckCircle2, Activity, Zap } from 'lucide-react';

interface HomeProps {
  onMarketClick: (id: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onMarketClick }) => {
  const [activeCategory, setActiveCategory] = useState<Category | 'ALL'>('ALL');
  const [activeStatus, setActiveStatus] = useState<PredictionStatus | 'ALL'>('ALL');
  const [markets] = useState<PredictionMarket[]>(INITIAL_MARKETS);

  const filteredMarkets = useMemo(() => {
    return markets.filter(m => {
      const catMatch = activeCategory === 'ALL' || m.category === activeCategory;
      const statusMatch = activeStatus === 'ALL' || m.status === activeStatus;
      return catMatch && statusMatch;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [markets, activeCategory, activeStatus]);

  const stats = {
    active: markets.length,
    success: markets.filter(m => m.status === PredictionStatus.SUCCESSFUL).length,
    precision: Math.round((markets.filter(m => m.status === PredictionStatus.SUCCESSFUL).length / 
               (markets.filter(m => m.status === PredictionStatus.SUCCESSFUL || m.status === PredictionStatus.FAILED).length || 1)) * 100)
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-40">
      {/* Refined Hero */}
      <section className="pt-32 pb-24 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">
             AI Predictive Infrastructure v4.2
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.95] text-header">
            Intelligence <br />Beyond Guess.
          </h1>
          
          <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Neural networks analyzing factual volatility to provide <br className="hidden md:block" /> objective market foresight with mathematical precision.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button onClick={() => document.getElementById('market-grid')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-3.5 btn-atypica text-sm">
              Explore Matrix
            </button>
            <button className="px-8 py-3.5 btn-outline text-sm">
              Model Research
            </button>
          </div>
        </div>
      </section>

      {/* Discrete Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 max-w-5xl mx-auto">
        {[
          { label: 'Active Matrix Nodes', value: stats.active },
          { label: 'Successful Resolves', value: stats.success },
          { label: 'Model Precision', value: stats.precision + '%' }
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center">
             <div className="text-2xl font-black text-white mb-0.5">{stat.value}</div>
             <div className="text-[10px] text-muted font-bold uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Market Controls */}
      <div id="market-grid" className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 py-3 border-y border-white/5">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => setActiveCategory('ALL')}
            className={`px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${activeCategory === 'ALL' ? 'bg-white text-black' : 'text-muted hover:text-white'}`}
          >
            All Segments
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button 
              key={key}
              onClick={() => setActiveCategory(key as Category)}
              className={`px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeCategory === key ? 'bg-white text-black' : 'text-muted hover:text-white'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <select 
              value={activeStatus}
              onChange={(e) => setActiveStatus(e.target.value as any)}
              className="appearance-none bg-transparent border-none text-[11px] font-bold uppercase tracking-widest text-muted focus:text-white outline-none pr-6 cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value={PredictionStatus.ACTIVE}>Active</option>
              <option value={PredictionStatus.SUCCESSFUL}>Success</option>
            </select>
            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
          </div>
          <div className="w-px h-4 bg-white/10 hidden md:block"></div>
          <button className="text-muted hover:text-white transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMarkets.length > 0 ? (
          filteredMarkets.map(market => (
            <PredictionCard key={market.id} market={market} onClick={onMarketClick} />
          ))
        ) : (
          <div className="col-span-full py-32 text-center">
            <p className="text-muted font-bold tracking-widest uppercase text-xs">Zero results in this query vector.</p>
          </div>
        )}
      </div>

      {/* Validated Node Showcase */}
      <div className="mt-32">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
               <CheckCircle2 className="text-primary w-4 h-4" />
             </div>
             <h2 className="text-xl font-bold tracking-tight">Verified Logic Results</h2>
           </div>
           <button className="text-[10px] font-bold text-muted uppercase tracking-widest hover:text-white">Full History</button>
        </div>
        <div className="grid grid-cols-1 gap-6">
           {markets.filter(m => m.status === PredictionStatus.SUCCESSFUL).slice(0, 1).map(m => (
             <PredictionCard key={m.id} market={m} onClick={onMarketClick} featured />
           ))}
        </div>
      </div>
    </div>
  );
};
