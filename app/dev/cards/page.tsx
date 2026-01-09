'use client';

import { MOCK_MARKETS } from '@/lib/mockMarkets';
import { PredictionCard } from '@/components/PredictionCard';

export default function PredictionCardDevPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white mb-2">
          PredictionCard Component Showcase
        </h1>
        <p className="text-sm text-white/60">
          This page renders several mock prediction markets to visually validate the
          layout, states, and data bindings of the <code>PredictionCard</code> component.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_MARKETS.map((market) => (
          <PredictionCard
            key={market.id}
            market={market}
            onClick={(id) => {
              // 开发环境中仅在控制台打印
              // eslint-disable-next-line no-console
              console.log('Clicked mock market:', id);
            }}
          />
        ))}
      </div>
    </div>
  );
}


