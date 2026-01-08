
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
        </div>

        <div className="space-y-3">
          {/* Polymarket Yes/No display */}
          {isYesNoOption && (
            <div className="mb-4">
              {/* Probability Circle Display */}
              <div className="flex items-center justify-between mb-4">
                {market.options.map((option, index) => {
                  const isAtypicaPick = option.id === market.atypicaPickId;
                  const marketPercentage = Math.round((option.externalProb || 0) * 100);
                  const isYes = option.text.toLowerCase() === 'yes';

                  return (
                    <div key={option.id} className="flex flex-col items-center">
                      <div className={`flex items-center justify-center w-16 h-16 rounded-full
                        ${isAtypicaPick ? 'border-2 border-primary' : 'border border-white/30'}
                        ${isYes ? 'bg-primary/10' : 'bg-white/10'}`}>
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-bold text-white">{marketPercentage}%</span>
                          <span className="text-[10px] text-muted">chance</span>
                        </div>
                      </div>
                      <div className="mt-1 text-[11px] text-muted">
                        Market
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Options Buttons Display */}
              <div className="flex space-x-1">
                {market.options.map((option) => {
                  const isYes = option.text.toLowerCase() === 'yes';
                  const isAtypicaPick = option.id === market.atypicaPickId;
                  const atypicaPercentage = option.atypicaProb ? Math.round(option.atypicaProb * 100) : null;

                  return (
                    <div
                      key={option.id}
                      className={`flex-1 h-12 flex items-center justify-center rounded-md cursor-pointer
                        ${isYes
                          ? 'bg-green-100/10 hover:bg-green-100/20'
                          : 'bg-red-100/10 hover:bg-red-100/20'}`}
                    >
                      <div className="relative flex items-center">
                        <span className={`font-medium text-sm ${isYes ? 'text-green-400' : 'text-red-400'}`}>
                          {option.text}
                        </span>

                        {/* Atypica Pick Indicator */}
                        {isAtypicaPick && atypicaPercentage && (
                          <div className="absolute -top-4 -right-6 flex items-center">
                            <div className="bg-primary/20 px-1.5 py-0.5 rounded text-[10px] font-bold text-primary">
                              {atypicaPercentage}%
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Volume Information */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                <div className="flex items-center">
                  <span className="text-xs text-white/70 font-medium">
                    ${(market.poolAmount || 0).toLocaleString()} Vol.
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {market.accuracyScore && (
                    <div className="flex items-center">
                      <AccuracyMeter
                        value={market.accuracyScore}
                        size="sm"
                        showLabel={false}
                      />
                      <span className="ml-1 text-[10px] text-primary font-bold">
                        Atypica Confidence
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Standard prediction choice */}
          {!isYesNoOption && (
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[9px] text-muted font-bold uppercase tracking-wider">Market Options</div>
                <div className="text-[9px] text-muted font-bold uppercase tracking-wider">Probability</div>
              </div>

              <div className="space-y-2">
                {market.options.map((option) => {
                  const isAtypicaPick = option.id === market.atypicaPickId;
                  const marketPercentage = Math.round((option.externalProb || 0) * 100);
                  const atypicaPercentage = Math.round((option.atypicaProb || 0) * 100);
                  const hasAtypicaPrediction = option.atypicaProb !== undefined && option.atypicaProb !== option.externalProb;

                  return (
                    <div key={option.id} className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isAtypicaPick && (
                            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                          )}
                          <span className={`text-[11px] font-medium ${isAtypicaPick ? 'text-primary' : 'text-white'}`}>
                            {option.text}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {hasAtypicaPrediction && (
                              <div className="flex items-center mr-2">
                                <span className="text-[10px] mr-1 text-primary">Atypica:</span>
                                <span className="text-[10px] font-medium text-primary">{atypicaPercentage}%</span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <span className="text-[10px] mr-1 text-muted">Market:</span>
                              <span className="text-[11px] font-medium text-white">{marketPercentage}%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-1 w-full bg-white/10 rounded-full h-1 relative">
                        {/* Market probability bar */}
                        <div
                          className="h-1 rounded-full bg-white/30"
                          style={{ width: `${marketPercentage}%` }}
                        ></div>

                        {/* Atypica prediction marker */}
                        {hasAtypicaPrediction && (
                          <div
                            className="h-3 w-1.5 rounded-full bg-primary absolute top-0"
                            style={{ left: `${atypicaPercentage}%`, transform: 'translateX(-50%)' }}
                          ></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {market.accuracyScore && (
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-center">
                    <span className="text-xs text-white/70 font-medium">
                      ${(market.poolAmount || 0).toLocaleString()} Vol.
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <AccuracyMeter value={market.accuracyScore} size="sm" />
                    <span className="text-[9px] text-muted font-medium mt-1">Atypica Confidence</span>
                  </div>
                </div>
              )}
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
