
import React, { useState, useMemo } from 'react';
import { PredictionMarket, Category, PredictionStatus } from '../types';
import { INITIAL_MARKETS, CATEGORY_LABELS } from '../constants';
import { PredictionCard } from '../components/PredictionCard';
import { AccuracyMeter } from '../components/AccuracyMeter';
import { ChevronDown, SlidersHorizontal, CheckCircle2, Activity, Zap, ChevronRight, ArrowRight } from 'lucide-react';

interface HomeProps {
  onMarketClick: (id: string) => void;
  markets: PredictionMarket[];
}

export const Home: React.FC<HomeProps> = ({ onMarketClick, markets }) => {
  const [activeCategory, setActiveCategory] = useState<Category | 'ALL'>('ALL');
  const [activeStatus, setActiveStatus] = useState<PredictionStatus | 'ALL'>('ALL');

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

      {/* Enhanced Verified Logic Results Section */}
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

        {/* Detailed Verified Results Card */}
        <div className="grid grid-cols-1 gap-6">
          {successfulMarkets.slice(0, 1).map(market => {
            const pickedOption = market.options.find(o => o.id === market.atypicaPickId);
            const winningOption = market.options.find(o => o.isWinner);
            const correctPrediction = pickedOption?.id === winningOption?.id;

            return (
              <div
                key={market.id}
                onClick={() => onMarketClick(market.id)}
                className="group cursor-pointer glass-panel spotlight-card rounded-xl transition-all duration-300 hover:border-white/20 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="tag-atypica">
                        {CATEGORY_LABELS[market.category]}
                      </span>
                      <span className="tag-atypica text-primary border-primary/30 bg-primary/5">
                        Verified Success
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-white leading-tight mb-2 group-hover:text-primary transition-colors">
                      {market.title}
                    </h3>

                    <p className="text-sm text-white/70 mb-4 line-clamp-2">
                      {market.description}
                    </p>
                  </div>

                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">Model Accuracy</div>
                    <div className="flex items-center gap-1">
                      <div className="text-2xl font-bold text-primary">{Math.round((market.accuracyScore || 0) * 100)}%</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/[0.03] rounded-lg p-4 border border-white/10 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-primary" />
                    <div className="text-sm font-bold text-primary">Atypica Analysis & Prediction</div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-white/80 italic">
                      "{market.atypicaAnalysis}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-white/50 mb-1">Atypica's Choice</div>
                      <div className="text-base font-medium text-white flex items-center gap-2">
                        {pickedOption?.text}
                        <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {Math.round((pickedOption?.atypicaProb || 0) * 100)}% Confidence
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-white/50 mb-1">Market Consensus</div>
                      <div className="text-base font-medium text-white flex items-center gap-2">
                        {Math.round((pickedOption?.externalProb || 0) * 100)}% Probability
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/60">All Prediction Options</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/60">Result</div>
                </div>

                <div className="space-y-2">
                  {market.options.map(option => (
                    <div
                      key={option.id}
                      className={`flex items-center justify-between p-2 rounded ${
                        option.isWinner ? 'bg-green-500/10 border border-green-500/20' :
                        option.id === market.atypicaPickId ? 'bg-primary/10 border border-primary/20' :
                        'bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${
                          option.id === market.atypicaPickId ? 'text-primary' : 'text-white'
                        }`}>
                          {option.text}
                        </span>
                        {option.id === market.atypicaPickId && (
                          <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                            Atypica Pick
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center">
                          <span className="text-[9px] mr-1 text-muted">Market:</span>
                          <span className="text-xs font-medium text-white">{Math.round((option.externalProb || 0) * 100)}%</span>
                        </div>
                        {option.atypicaProb !== undefined && (
                          <div className="flex items-center">
                            <span className="text-[9px] mr-1 text-primary">Atypica:</span>
                            <span className="text-xs font-medium text-primary">{Math.round(option.atypicaProb * 100)}%</span>
                          </div>
                        )}
                        {option.isWinner && (
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            <span className="text-xs font-bold text-green-400">Winner</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-white/50">
                      <span className="font-medium">Resolved:</span> {new Date(market.resolveDate || market.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-white/50">
                      <span className="font-medium">Volume:</span> ${(market.poolAmount || 0).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center text-white/50 group-hover:text-primary transition-all gap-1 font-bold uppercase tracking-widest text-[9px]">
                    View Full Report <ArrowRight className="w-3.5 h-3.5 translate-x-1 group-hover:translate-x-2 transition-transform" />
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
