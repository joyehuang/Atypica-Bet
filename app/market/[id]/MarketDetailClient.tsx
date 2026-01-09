'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PredictionMarket, PredictionStatus } from '@/types';
import { CATEGORY_LABELS, STATUS_LABELS } from '@/constants';
import { AccuracyMeter } from '@/components/AccuracyMeter';
import {
  ChevronLeft, Share2, ShieldCheck, Copy,
  Check, ChevronDown, ChevronUp, Clock,
  RefreshCw, MessageSquare, Heart
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface MarketDetailClientProps {
  market: PredictionMarket;
}

export default function MarketDetailClient({ market }: MarketDetailClientProps) {
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');
  const [copied, setCopied] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("1 min ago");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<string>("");
  const [isNearDeadline, setIsNearDeadline] = useState<boolean>(false);

  useEffect(() => {
    if (market.status !== PredictionStatus.ACTIVE) return;

    const updateCountdown = () => {
      const now = new Date();
      const closeDate = new Date(market.closeDate);
      const timeRemaining = closeDate.getTime() - now.getTime();

      const isNear = timeRemaining < 48 * 60 * 60 * 1000;
      setIsNearDeadline(isNear);

      if (timeRemaining <= 0) {
        setCountdown("Ended");
        return;
      }

      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setCountdown(`${days}d ${hours}h`);
      } else {
        setCountdown(`${hours}h ${minutes}m`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [market.closeDate, market.status]);

  const data = market.options.map(opt => ({
    name: opt.text,
    external: Math.round((opt.externalProb || 0) * 100),
    atypica: Math.round((opt.atypicaProb || 0) * 100),
    id: opt.id,
    isAtypicaPick: opt.id === market.atypicaPickId
  }));

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated("Just now");
    }, 800);
  };

  const pickedOption = market.options.find(o => o.id === market.atypicaPickId);

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <button
        onClick={() => router.push('/')}
        className="group flex items-center gap-2 text-muted hover:text-white transition-colors font-bold text-[10px] uppercase tracking-[0.2em] mb-12"
      >
        <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        Return to Matrix Grid
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-3 mb-3">
                <span className="tag-atypica">{CATEGORY_LABELS[market.category]}</span>
                <span className={`tag-atypica ${market.status === PredictionStatus.ACTIVE && isNearDeadline ? 'text-amber-400 border-amber-500/30 bg-amber-500/5' : market.status === PredictionStatus.SUCCESSFUL ? 'text-primary' : 'text-white'}`}>
                  {market.status === PredictionStatus.ACTIVE && isNearDeadline ? 'Ending Soon' : STATUS_LABELS[market.status]}
                </span>
              </div>

              <div className="flex gap-3 mb-3">
                <div className="flex items-center gap-3">
                  {market.status === PredictionStatus.ACTIVE && (
                    <div className="flex items-center bg-white/[0.03] px-3 py-1.5 rounded-full">
                      <Clock className={`w-3.5 h-3.5 mr-2 ${isNearDeadline ? 'text-amber-400' : 'text-muted'}`} />
                      <span className={`text-[10px] font-bold ${isNearDeadline ? 'text-amber-400' : 'text-white'}`}>
                        {countdown}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center bg-white/[0.03] px-3 py-1.5 rounded-full">
                    <button
                      onClick={handleRefresh}
                      className="flex items-center hover:text-white transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 mr-2 text-muted ${isRefreshing ? 'animate-spin' : ''}`} />
                      <span className="text-[10px] font-bold text-white">{isRefreshing ? "Refreshing..." : `Updated ${lastUpdated}`}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[1.1] text-header">
              {market.title}
            </h1>
            <p className="text-muted text-xl font-medium leading-relaxed">
              {market.description}
            </p>

            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-[11px] text-muted">
                <MessageSquare className="w-4 h-4" />
                <span>{market.viewCount} Views</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted">
                <Heart className="w-4 h-4" />
                <span>{Math.floor(market.shareCount / 2)} Likes</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted">
                <Share2 className="w-4 h-4" />
                <span>{market.shareCount} Shares</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-8 border border-white/5">
            <div className="flex items-center justify-between mb-10">
              <div className="space-y-1">
                <h2 className="text-xs font-black text-white uppercase tracking-[0.2em]">Probability Matrix</h2>
                <p className="text-[9px] text-muted font-bold uppercase tracking-widest">Weighted Comparative Analysis</p>
              </div>
              <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest text-muted">
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-white/10 rounded-full" /> Market Average</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(24,255,25,0.3)]" /> Atypica Model</div>
              </div>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ left: 0, right: 30 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 9, fontWeight: 700, fill: '#666' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.01)' }} contentStyle={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '9px' }} />
                  <Bar dataKey="external" fill="rgba(255,255,255,0.05)" radius={[0, 2, 2, 0]} barSize={8} />
                  <Bar dataKey="atypica" radius={[0, 2, 2, 0]} barSize={8}>
                    {data.map((entry, index) => <Cell key={index} fill={entry.isAtypicaPick ? '#18FF19' : '#ffffff'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border-primary/20">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="text-[9px] text-primary font-bold uppercase tracking-[0.3em] mb-2">Validated Logical Choice</div>
              <div className="text-2xl font-black text-white leading-tight mb-4">
                {pickedOption?.text}
              </div>

              <div className="mb-4">
                <AccuracyMeter
                  value={market.accuracyScore || 0}
                  size="lg"
                  showDualRing={true}
                  marketPercentage={pickedOption?.externalProb || 0}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 w-full text-center border-t border-white/5 pt-4">
                <div>
                  <div className="text-[8px] text-muted font-bold uppercase tracking-widest mb-1">Model Confidence</div>
                  <div className="text-primary font-bold text-sm">{Math.round((market.accuracyScore || 0) * 100)}%</div>
                </div>
                <div>
                  <div className="text-[8px] text-muted font-bold uppercase tracking-widest mb-1">Market Consensus</div>
                  <div className="text-white font-bold text-sm">{Math.round((pickedOption?.externalProb || 0) * 100)}%</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-muted text-[9px] font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Model Confidence High
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { id: 'overview', title: 'Contextual Matrix', content: market.description },
              { id: 'reasoning', title: 'Logical Deduction', content: market.atypicaAnalysis || 'Computing...' },
            ].map(section => (
              <div key={section.id} className="glass-panel rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">{section.title}</span>
                  {expandedSection === section.id ? <ChevronUp className="w-3.5 h-3.5 text-muted" /> : <ChevronDown className="w-3.5 h-3.5 text-muted" />}
                </button>
                {expandedSection === section.id && (
                  <div className="px-6 pb-5 text-muted text-[12px] leading-relaxed">
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-wrap gap-3">
            <button onClick={handleCopyLink} className="flex-1 btn-outline py-2.5 text-[10px] font-bold uppercase tracking-widest">
              {copied ? <Check className="w-3 h-3 mx-auto" /> : 'Copy Report Link'}
            </button>
            <button className="p-2.5 btn-outline text-muted hover:text-white">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
