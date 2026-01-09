'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PredictionMarket, Category, PredictionStatus } from '@/types';
import { CATEGORY_LABELS } from '@/constants';
import { PredictionCard } from '@/components/PredictionCard';
import { ChevronDown, SlidersHorizontal, CheckCircle2, Zap, ChevronRight, ArrowRight, TrendingUp, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface HomeClientProps {
  initialMarkets: PredictionMarket[];
}

export default function HomeClient({ initialMarkets }: HomeClientProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<Category | 'ALL'>('ALL');
  const [activeStatus, setActiveStatus] = useState<PredictionStatus | 'ALL'>('ALL');

  const handleMarketClick = (id: string) => {
    router.push(`/market/${id}`);
  };

  const filteredMarkets = useMemo(() => {
    return initialMarkets.filter(m => {
      const catMatch = activeCategory === 'ALL' || m.category === activeCategory;
      const statusMatch = activeStatus === 'ALL' || m.status === activeStatus;
      return catMatch && statusMatch;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [initialMarkets, activeCategory, activeStatus]);

  const stats = {
    active: initialMarkets.length,
    success: initialMarkets.filter(m => m.status === PredictionStatus.SUCCESSFUL).length,
    precision: Math.round((initialMarkets.filter(m => m.status === PredictionStatus.SUCCESSFUL).length /
               (initialMarkets.filter(m => m.status === PredictionStatus.SUCCESSFUL || m.status === PredictionStatus.FAILED).length || 1)) * 100)
  };

  const successfulMarkets = initialMarkets.filter(m => m.status === PredictionStatus.SUCCESSFUL);

  const profitData = [
    { day: 1, bet1: 0, bet2: 0, bet3: 0, bet4: 0, dailyTotal: 0, cumulativeTotal: 0 },
    { day: 2, bet1: 2, bet2: -1, bet3: 3, bet4: 0, dailyTotal: 4, cumulativeTotal: 4 },
    { day: 3, bet1: 3, bet2: -2, bet3: 5, bet4: 1, dailyTotal: 7, cumulativeTotal: 11 },
    { day: 4, bet1: -1, bet2: 1, bet3: 4, bet4: 2, dailyTotal: 6, cumulativeTotal: 17 },
    { day: 5, bet1: -2, bet2: 0, bet3: 3, bet4: 5, dailyTotal: 6, cumulativeTotal: 23 },
    { day: 6, bet1: 4, bet2: 2, bet3: -1, bet4: 3, dailyTotal: 8, cumulativeTotal: 31 },
    { day: 7, bet1: 6, bet2: 3, bet3: 0, bet4: 2, dailyTotal: 11, cumulativeTotal: 42 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 pb-40">
      {/* Hero Section */}
      <section className="pt-32 pb-24 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">
             AI Predictive Infrastructure v4.2
          </div>

          <div className="relative z-10">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.95] text-header">
              Intelligence <br />Beyond Guess.
            </h1>
          </div>

          <p className="font-gothic text-muted text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed mt-12">
            Neural networks analyzing factual volatility to provide <br className="hidden md:block" /> objective market foresight with mathematical precision.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-8">
            <button onClick={() => document.getElementById('market-grid')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-3.5 btn-atypica text-sm">
              Explore Matrix
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
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

      {/* Profits Visualization */}
      <div className="mb-24">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <TrendingUp className="text-primary w-3.5 h-3.5" />
            </div>
            <h2 className="text-lg font-bold tracking-tight">Profit Analytics</h2>
          </div>
          <button className="flex items-center gap-1 text-[10px] font-bold text-muted uppercase tracking-widest hover:text-white">
            View All Data <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="glass-panel p-6 rounded-xl card-layer-2">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Daily Bet Performance</h3>
              <p className="text-sm text-white/60 font-gothic">
                Individual bet performance tracked over time with daily and cumulative profit indicators
              </p>
            </div>
            <div className="flex items-center gap-1.5 p-2 bg-white/5 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-xs text-white font-medium">+42% Total Return</span>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={profitData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="#666" label={{ value: 'Day', position: 'insideBottom', offset: -5, fill: '#666' }} />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                  }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#666' }}
                />
                <Legend verticalAlign="top" height={36} />
                <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
                <Line type="monotone" dataKey="bet1" stroke="#8884d8" activeDot={{ r: 8 }} name="Market A" />
                <Line type="monotone" dataKey="bet2" stroke="#82ca9d" name="Market B" />
                <Line type="monotone" dataKey="bet3" stroke="#ffc658" name="Market C" />
                <Line type="monotone" dataKey="bet4" stroke="#ff8042" name="Market D" />
                <Line type="monotone" dataKey="dailyTotal" stroke="#18FF19" strokeWidth={2} name="Daily Total" />
                <Line type="monotone" dataKey="cumulativeTotal" stroke="#ffffff" strokeWidth={2} name="Cumulative Profit" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-white/80 font-gothic">
                Each bet line represents a separate prediction market position. The daily total shows aggregate profit/loss
                per day across all positions, while the cumulative line displays total earnings over time.
                All predictions use the Atypica AI predictive engine with a consistent betting strategy.
              </p>
            </div>
          </div>
        </div>
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

      {/* Market Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMarkets.length > 0 ? (
          filteredMarkets.map(market => (
            <PredictionCard key={market.id} market={market} onClick={handleMarketClick} />
          ))
        ) : (
          <div className="col-span-full py-32 text-center">
            <p className="text-muted font-bold tracking-widest uppercase text-xs">Zero results in this query vector.</p>
          </div>
        )}
      </div>

      {/* Verified Results Section */}
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

        <div className="grid grid-cols-1 gap-6">
          {successfulMarkets.slice(0, 1).map(market => {
            const pickedOption = market.options.find(o => o.id === market.atypicaPickId);
            const winningOption = market.options.find(o => o.isWinner);

            return (
              <div
                key={market.id}
                onClick={() => handleMarketClick(market.id)}
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
                      &quot;{market.atypicaAnalysis}&quot;
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-white/50 mb-1">Atypica&apos;s Choice</div>
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
                      <span className="font-medium">Resolved:</span>{' '}
                      {new Date(market.resolveDate || market.updatedAt).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </div>
                    <div className="text-xs text-white/50">
                      <span className="font-medium">Volume:</span>{' '}
                      {(market.poolAmount || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
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
}
