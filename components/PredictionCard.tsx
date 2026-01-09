'use client';

import React, { useState, useEffect } from 'react';
import { PredictionMarket, Category, PredictionStatus } from '@/types';
import { CATEGORY_LABELS, STATUS_LABELS } from '@/constants';
import { AccuracyMeter } from './AccuracyMeter';
import { Calendar, ArrowRight, Target, Zap, RefreshCw, MessageSquare, Heart, Share2, Clock, DollarSign, AlertTriangle, Info, Tag } from 'lucide-react';

interface PredictionCardProps {
  market: PredictionMarket;
  onClick: (id: string) => void;
  featured?: boolean;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ market, onClick, featured = false }) => {
  const [lastUpdated, setLastUpdated] = useState<string>("Just now");
  const [isNearDeadline, setIsNearDeadline] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Calculate time remaining until close date
  useEffect(() => {
    if (market.status !== PredictionStatus.ACTIVE) return;

    const updateCountdown = () => {
      const now = new Date();
      const closeDate = new Date(market.closeDate);
      const timeRemaining = closeDate.getTime() - now.getTime();

      // Check if within 48 hours of deadline
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

  const getStatusColor = (status: PredictionStatus) => {
    switch(status) {
      case PredictionStatus.ACTIVE: return isNearDeadline ? 'text-amber-400 border-amber-500/30 bg-amber-500/5' : 'text-white border-white/20';
      case PredictionStatus.SUCCESSFUL: return 'text-primary border-primary/30 bg-primary/5';
      default: return 'text-muted border-white/10';
    }
  };

  const getConfidenceLevel = (probability: number) => {
    if (probability >= 0.8) return "High";
    if (probability >= 0.6) return "Medium";
    if (probability >= 0.4) return "Moderate";
    return "Low";
  };

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRefreshing(true);
    // Simulate refresh - in a real implementation, this would fetch updated data
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated("Just now");
    }, 800);
  };

  const pickedOption = market.options.find(o => o.id === market.atypicaPickId);
  const marketLeader = market.options.reduce((prev, current) =>
    (current.externalProb || 0) > (prev.externalProb || 0) ? current : prev
  );

  // Check if this is a Yes/No prediction (Polymarket style)
  const isYesNoOption = market.options.length === 2 &&
    (market.options[0].text.toLowerCase() === "yes" || market.options[0].text.toLowerCase() === "no") &&
    (market.options[1].text.toLowerCase() === "yes" || market.options[1].text.toLowerCase() === "no");

  // Format pool amount with currency
  const formattedPoolAmount = market.poolAmount
    ? `${market.poolAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })} ${market.poolCurrency || 'USD'}`
    : null;

  return (
    <div
      onClick={() => onClick(market.id)}
      className={`group cursor-pointer glass-panel glass-effect spotlight-card rounded-xl transition-all duration-300 hover:border-white/20 p-5 cursor-follow card-layered ${
        isNearDeadline ? 'deadline-glow' : ''
      } ${market.status === PredictionStatus.SUCCESSFUL ? 'success-glow' : ''}`}
    >
      {/* 防误解锚点 - Header with AI prediction disclaimer */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center">
            <Zap className="w-4 h-4 text-primary mr-1.5" />
            <span className="text-[12px] font-bold text-primary">Atypica AI Prediction</span>
          </div>
          <div className="flex items-center text-[9px] text-white/50 gap-1">
            <Tag className="w-3 h-3 text-white/40" />
            <span>{CATEGORY_LABELS[market.category]}</span>
          </div>
        </div>
        <p className="text-[10px] text-muted">Based on simulated agent behavior</p>
      </div>

      {/* Prediction Question */}
      <h3 className="text-lg font-semibold text-white leading-snug mb-4 group-hover:text-primary transition-colors">
        {market.title}
      </h3>

      {/* Main Prediction Box */}
      {pickedOption && (
        <div className="mb-4 bg-white/[0.03] border border-white/10 rounded-xl p-4 card-layer-2">
          <div className="text-[11px] text-white/70 mb-1.5">Atypica predicts</div>

          <div className="flex flex-row justify-between items-start mb-2">
            <div className="text-lg font-bold text-white">{pickedOption.text}</div>
          </div>

          <div className="text-3xl font-bold text-primary">
            {pickedOption.atypicaProb !== undefined ?
              `${Math.round(pickedOption.atypicaProb * 100)}%` :
              "N/A"}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-white/10 my-4"></div>

      {/* Market context - 明确是"背景" */}
      <div className="mb-4">
        <div className="text-[13px] font-semibold uppercase tracking-wide text-white/80 mb-2">
          Market context (Polymarket)
        </div>

        <div className="space-y-2 bg-white/[0.01] p-3 rounded-lg border border-white/5 card-layer-1">
          {market.options.map((option) => (
            <div key={option.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2"></div>
                <span className="text-sm text-white">{option.text}</span>
              </div>
              <span className="text-sm font-medium text-white">
                {Math.round((option.externalProb || 0) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] font-medium pt-4 mt-2 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="text-muted flex items-center">
            <RefreshCw className={`w-3 h-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Updated {isRefreshing ? "now" : lastUpdated}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1 text-amber-400" />
            <span>End: {new Date(market.closeDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center text-white/50 group-hover:text-primary transition-all gap-1 font-bold card-layer-1 px-2 py-1 rounded-full hover:bg-white/5">
          View analysis <ArrowRight className="w-3 h-3 translate-x-1 group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </div>
  );
};
