
import React, { useState, useMemo } from 'react';
import { PredictionMarket, Category, PredictionStatus } from '../types';
import { INITIAL_MARKETS, CATEGORY_LABELS } from '../constants';
import { PredictionCard } from '../components/PredictionCard';
import { AccuracyMeter } from '../components/AccuracyMeter';
import { ChevronDown, SlidersHorizontal, CheckCircle2, Activity, Zap, ChevronRight } from 'lucide-react';

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

  // Get successful markets for verified results section
  const successfulMarkets = markets.filter(m => m.status === PredictionStatus.SUCCESSFUL);

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

      {/* Improved Verified Logic Results Section */}
      <div className="mt-32">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <CheckCircle2 className="text-primary w-3.5 h-3.5" />
            </div>
            <h2 className="text-lg font-bold tracking-tight">Verified Logic Results</h2>
          </div>
          <button className="flex items-center gap-1 text-[10px] font-bold text-muted uppercase tracking-widest hover:text-white">
            Full History <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compact Verified Results Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {successfulMarkets.slice(0, 2).map(market => {
            const pickedOption = market.options.find(o => o.id === market.atypicaPickId);
            const marketConsensus = pickedOption?.externalProb || 0;

            return (
              <div
                key={market.id}
                onClick={() => onMarketClick(market.id)}
                className="group cursor-pointer glass-panel spotlight-card rounded-xl flex items-center transition-all duration-300 hover:border-white/20 p-4 gap-5"
              >
                <div className="flex-shrink-0">
                  <AccuracyMeter
                    value={market.accuracyScore || 0}
                    size="md"
                    showDualRing={true}
                    marketPercentage={marketConsensus}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="tag-atypica text-xs py-0.5">
                      {CATEGORY_LABELS[market.category]}
                    </span>
                    <span className="tag-atypica text-primary border-primary/30 bg-primary/5 text-xs py-0.5">
                      Verified
                    </span>
                  </div>

                  <h3 className="text-[14px] font-medium text-white leading-tight mb-2 truncate group-hover:text-primary transition-colors">
                    {market.title}
                  </h3>

                  <div className="flex items-center">
                    <div className="text-[11px]">
                      <span className="text-muted">Atypica Choice:</span>{" "}
                      <span className="text-primary font-medium">{pickedOption?.text}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {successfulMarkets.length === 0 && (
            <div className="col-span-full py-10 text-center glass-panel rounded-xl">
              <p className="text-muted font-bold tracking-widest uppercase text-xs">No verified results available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
