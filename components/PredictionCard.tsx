
import React from 'react';
import { PredictionMarket, Category, PredictionStatus } from '../types';
import { CATEGORY_LABELS, STATUS_LABELS } from '../constants';
import { AccuracyMeter } from './AccuracyMeter';
import { Calendar, ArrowRight, Target, Zap } from 'lucide-react';

interface PredictionCardProps {
  market: PredictionMarket;
  onClick: (id: string) => void;
  featured?: boolean;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ market, onClick, featured = false }) => {
  const getStatusColor = (status: PredictionStatus) => {
    switch(status) {
      case PredictionStatus.ACTIVE: return 'text-white border-white/20';
      case PredictionStatus.SUCCESSFUL: return 'text-primary border-primary/30 bg-primary/5';
      default: return 'text-muted border-white/10';
    }
  };

  const pickedOption = market.options.find(o => o.id === market.atypicaPickId);

  return (
    <div 
      onClick={() => onClick(market.id)}
      className={`group cursor-pointer glass-panel spotlight-card rounded-2xl flex flex-col transition-all duration-500 hover:border-white/20 ${featured ? 'md:flex-row md:items-stretch h-auto md:h-64' : ''}`}
    >
      {featured && (
        <div className="md:w-1/4 bg-white/[0.03] border-r border-white/10 flex flex-col items-center justify-center p-8">
          <Zap className="w-8 h-8 text-primary mb-3 animate-subtle-pulse" />
          <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Verified Model</span>
        </div>
      )}
      
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="tag-atypica">
              {CATEGORY_LABELS[market.category]}
            </span>
            <span className={`tag-atypica ${getStatusColor(market.status)}`}>
              {STATUS_LABELS[market.status]}
            </span>
          </div>

          <h3 className="text-[16px] font-semibold text-white leading-snug mb-4 group-hover:text-primary transition-colors">
            {market.title}
          </h3>
        </div>

        <div className="space-y-4">
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-[9px] text-muted font-bold uppercase tracking-wider">Atypica Choice</div>
                <div className="text-[13px] font-medium text-white">
                  {pickedOption?.text || 'Analyzing...'}
                </div>
              </div>
            </div>
            {market.accuracyScore && <AccuracyMeter value={market.accuracyScore} size="sm" />}
          </div>

          <div className="flex items-center justify-between text-[11px] font-medium pt-2">
            <div className="flex items-center text-muted">
              <Calendar className="w-3.5 h-3.5 mr-1.5 opacity-60" />
              Ends {market.closeDate}
            </div>
            <div className="flex items-center text-white/50 group-hover:text-primary transition-all gap-1 font-bold uppercase tracking-widest text-[9px]">
              View Report <ArrowRight className="w-3.5 h-3.5 translate-x-1 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
