'use client'
import React, { useState, useEffect } from 'react';
import { PredictionMarket, Category, PredictionStatus } from '../types';
import { CATEGORY_LABELS, STATUS_LABELS } from '../constants';
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

  const renderConfidenceIndicator = (probability: number) => {
    // 根据概率值决定哪个 bar 高亮
    // 0-40%: 红色高亮 (低置信度)
    // 40-70%: 黄色高亮 (中置信度)
    // 70-100%: 绿色高亮 (高置信度)
    const percent = probability * 100;
    let activeBar: 1 | 2 | 3 = 1; // 默认红色
    
    if (percent >= 70) {
      activeBar = 3; // 绿色
    } else if (percent >= 40) {
      activeBar = 2; // 黄色
    } else {
      activeBar = 1; // 红色
    }

    return (
      <div className="flex flex-col gap-1.5">
        <div className="text-xs font-semibold text-white/70 mb-0.5">Prediction confidence</div>
        <div className="flex gap-2 items-center">
          {/* 红色 bar (低置信度) */}
          <div
            className={`h-2 w-10 rounded-sm transition-all ${
              activeBar === 1 
                ? 'bg-red-500 shadow-lg shadow-red-500/50' 
                : 'bg-red-500/20'
            }`}
          />
          {/* 黄色 bar (中置信度) */}
          <div
            className={`h-2 w-10 rounded-sm transition-all ${
              activeBar === 2 
                ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' 
                : 'bg-yellow-500/20'
            }`}
          />
          {/* 绿色 bar (高置信度) */}
          <div
            className={`h-2 w-10 rounded-sm transition-all ${
              activeBar === 3 
                ? 'bg-green-500 shadow-lg shadow-green-500/50' 
                : 'bg-green-500/20'
            }`}
          />
        </div>
      </div>
    );
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
          <div className="flex flex-row justify-between items-start mb-3">
            <div className="text-lg font-bold text-white">{pickedOption.text}</div>
          </div>

          <div className="space-y-3">
            {/* Prediction confidence */}
            {pickedOption.atypicaProb !== undefined ? (
              renderConfidenceIndicator(pickedOption.atypicaProb)
            ) : (
              <div className="text-white">N/A</div>
            )}

            {/* NFT 持仓信息 */}
            {market.nftCurrentValue !== undefined && market.nftPercentRealizedPnl !== undefined && market.nftWinValue !== undefined && (
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-1 h-1 rounded-full bg-primary"></div>
                  <div className="text-xs font-semibold text-white/70">NFT Position</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gradient-to-br from-black/70 to-black/50 rounded-lg px-2.5 py-2 border border-white/20 hover:border-white/30 transition-all hover:scale-[1.02]">
                    <div className="text-[9px] text-white/50 mb-1 font-medium">Value</div>
                    <div className="text-xs text-white font-bold">${Math.abs(market.nftCurrentValue).toFixed(4)}</div>
                  </div>
                  <div className="bg-gradient-to-br from-black/70 to-black/50 rounded-lg px-2.5 py-2 border border-white/20 hover:border-white/30 transition-all hover:scale-[1.02]">
                    <div className="text-[9px] text-white/50 mb-1 font-medium">Odds</div>
                    <div className={`text-xs font-bold ${market.nftPercentRealizedPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {market.nftPercentRealizedPnl >= 0 ? '+' : ''}{market.nftPercentRealizedPnl.toFixed(2)}%
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-black/70 to-black/50 rounded-lg px-2.5 py-2 border border-white/20 hover:border-white/30 transition-all hover:scale-[1.02]">
                    <div className="text-[9px] text-white/50 mb-1 font-medium">Win</div>
                    <div className="text-xs text-white font-bold">${market.nftWinValue.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            )}
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
      <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-white/10">
        <div className="flex items-center justify-between text-[10px] font-medium">
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

        {formattedPoolAmount && (
          <div className="flex items-center gap-1.5 text-[11px] font-medium">
            <DollarSign className="w-3 h-3 text-primary" />
            <span className="text-white/80">Total Pool: <span className="text-white font-semibold">{formattedPoolAmount}</span></span>
          </div>
        )}
      </div>
    </div>
  );
};