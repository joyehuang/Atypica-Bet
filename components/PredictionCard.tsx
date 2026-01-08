
import React, { useState, useEffect } from 'react';
import { PredictionMarket, Category, PredictionStatus } from '../types';
import { CATEGORY_LABELS, STATUS_LABELS } from '../constants';
import { AccuracyMeter } from './AccuracyMeter';
import { Calendar, ArrowRight, Target, Zap, RefreshCw, MessageSquare, Heart, Share2, Clock, DollarSign } from 'lucide-react';

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
      className={`group cursor-pointer glass-panel spotlight-card rounded-2xl flex flex-col transition-all duration-500 hover:border-white/20 ${featured ? 'md:flex-row md:items-stretch h-auto md:h-64' : ''} ${isNearDeadline ? 'animate-gentle-pulse shadow-[0_0_15px_rgba(251,191,36,0.1)]' : ''}`}
    >
      {featured && (
        <div className="md:w-1/5 bg-white/[0.03] border-r border-white/10 flex flex-col items-center justify-center p-4">
          <Zap className="w-6 h-6 text-primary mb-2 animate-subtle-pulse" />
          <span className="text-[9px] font-bold text-primary tracking-widest uppercase">Verified Model</span>
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="tag-atypica">
                {CATEGORY_LABELS[market.category]}
              </span>
              <span className={`tag-atypica ${getStatusColor(market.status)}`}>
                {isNearDeadline && market.status === PredictionStatus.ACTIVE ? 'Ending Soon' : STATUS_LABELS[market.status]}
              </span>

              {/* Pool Amount Display */}
              {formattedPoolAmount && (
                <span className="tag-atypica bg-white/[0.03] text-white flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {formattedPoolAmount}
                </span>
              )}
            </div>

            {/* Social metrics */}
            <div className="flex items-center gap-3">
              <div className="flex items-center text-[9px] text-white/50">
                <MessageSquare className="w-3 h-3 mr-1" />
                <span>{Math.floor(market.viewCount / 100)}</span>
              </div>
              <div className="flex items-center text-[9px] text-white/50">
                <Heart className="w-3 h-3 mr-1" />
                <span>{Math.floor(market.shareCount / 2)}</span>
              </div>
              <div className="flex items-center text-[9px] text-white/50">
                <Share2 className="w-3 h-3 mr-1" />
                <span>{market.shareCount}</span>
              </div>
            </div>
          </div>

          <h3 className="text-[15px] font-semibold text-white leading-snug mb-3 group-hover:text-primary transition-colors">
            {market.title}
          </h3>

          {/* Atypica Pick Display - NEW SECTION */}
          {pickedOption && (
            <div className="mb-2 border-t border-white/10 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Zap className="w-3 h-3 text-primary" />
                  </div>
                  <div>
                    <div className="text-[9px] text-primary font-bold uppercase tracking-wider">Atypica Pick</div>
                    <div className="text-[13px] font-semibold text-white">
                      {pickedOption.text}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex flex-col items-end">
                    <div className="text-[9px] text-white/50 font-medium mb-0.5">Probabilities</div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        <span className="text-[9px] text-muted mr-1">Market:</span>
                        <span className="text-[11px] font-medium text-white">{Math.round((pickedOption.externalProb || 0) * 100)}%</span>
                      </div>
                      {pickedOption.atypicaProb !== undefined && (
                        <div className="flex items-center">
                          <span className="text-[9px] text-primary mr-1">Atypica:</span>
                          <span className="text-[11px] font-medium text-primary">{Math.round(pickedOption.atypicaProb * 100)}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {market.atypicaAnalysis && (
                <div className="mt-1.5 text-[10px] text-white/70 line-clamp-1">
                  {market.atypicaAnalysis}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          {/* Polymarket Yes/No display */}
          {isYesNoOption && (
            <div className="mb-2">
              {/* Simple Yes/No Buttons */}
              <div className="flex space-x-2">
                {market.options.map((option) => {
                  const isYes = option.text.toLowerCase() === 'yes';
                  const marketPercentage = Math.round((option.externalProb || 0) * 100);
                  const atypicaPercentage = option.atypicaProb !== undefined
                    ? Math.round(option.atypicaProb * 100)
                    : null;
                  const hasAtypicaPrediction = atypicaPercentage !== null;

                  return (
                    <div
                      key={option.id}
                      className={`flex-1 h-auto rounded-lg p-2.5 cursor-pointer transition-all
                        ${isYes
                          ? 'bg-green-100/10 border border-green-500/20 hover:bg-green-100/15'
                          : 'bg-red-100/10 border border-red-500/20 hover:bg-red-100/15'}`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`font-medium text-sm ${isYes ? 'text-green-400' : 'text-red-400'}`}>
                          {option.text}
                        </span>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-muted">Market:</span>
                          <span className="text-[11px] font-medium text-white">
                            {marketPercentage}%
                          </span>
                        </div>

                        {hasAtypicaPrediction && (
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-primary">Atypica:</span>
                            <span className="text-[11px] font-medium text-primary">
                              {atypicaPercentage}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Volume Information */}
              <div className="flex justify-end mt-1.5">
                <span className="text-xs text-white/50 font-medium">
                  ${(market.poolAmount || 0).toLocaleString()} Vol.
                </span>
              </div>
            </div>
          )}

          {/* Standard prediction choice */}
          {!isYesNoOption && (
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-[9px] text-muted font-bold uppercase tracking-wider">Market Options</div>
                <div className="text-[9px] text-muted font-bold uppercase tracking-wider">Probabilities</div>
              </div>

              <div className="space-y-1.5">
                {market.options.map((option) => {
                  const isAtypicaPick = option.id === market.atypicaPickId;
                  const marketPercentage = Math.round((option.externalProb || 0) * 100);
                  const atypicaPercentage = option.atypicaProb !== undefined
                    ? Math.round(option.atypicaProb * 100)
                    : null;
                  const hasAtypicaPrediction = atypicaPercentage !== null;

                  return (
                    <div
                      key={option.id}
                      className={`py-1.5 px-2 rounded ${
                        isAtypicaPick ? 'bg-primary/10 border border-primary/20' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium ${isAtypicaPick ? 'text-primary' : 'text-white'}`}>
                          {option.text}
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-3">
                        {hasAtypicaPrediction && (
                          <div className="flex items-center">
                            <span className="text-[9px] mr-1 text-primary">Atypica:</span>
                            <span className="text-[11px] font-medium text-primary">{atypicaPercentage}%</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <span className="text-[9px] mr-1 text-muted">Market:</span>
                          <span className="text-[11px] font-medium text-white">{marketPercentage}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Volume Information */}
              <div className="flex justify-end mt-2 pt-1.5 border-t border-white/10">
                <span className="text-xs text-white/50 font-medium">
                  ${(market.poolAmount || 0).toLocaleString()} Vol.
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-[10px] font-medium pt-1">
            <div className="flex items-center gap-3">
              {/* Countdown display */}
              <div className="flex items-center text-muted">
                <Clock className={`w-3 h-3 mr-1 ${isNearDeadline ? 'text-amber-400' : 'opacity-60'}`} />
                <span className={isNearDeadline ? 'text-amber-400 font-bold' : ''}>
                  {countdown}
                </span>
              </div>

              {/* Last updated display with refresh button */}
              <div className="flex items-center text-muted">
                <button
                  onClick={handleRefresh}
                  className="flex items-center hover:text-white transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>{isRefreshing ? "Refreshing..." : lastUpdated}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center text-white/50 group-hover:text-primary transition-all gap-1 font-bold uppercase tracking-widest text-[9px]">
              View Report <ArrowRight className="w-3 h-3 translate-x-1 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
