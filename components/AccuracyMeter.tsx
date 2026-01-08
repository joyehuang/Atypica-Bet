
import React from 'react';

interface AccuracyMeterProps {
  value: number; // 0-1
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  marketPercentage?: number; // Optional market percentage to show dual visualization
  showDualRing?: boolean; // Whether to show both market and atypica rings
  labelPrefix?: string; // Optional label prefix
}

export const AccuracyMeter: React.FC<AccuracyMeterProps> = ({
  value,
  size = 'md',
  showLabel = true,
  marketPercentage,
  showDualRing = false,
  labelPrefix
}) => {
  const percentage = Math.round(value * 100);
  const marketPercentageValue = marketPercentage !== undefined ? Math.round(marketPercentage * 100) : null;

  // Minimalist palette
  let atypicaColor = '#ffffff';
  if (value >= 0.85) atypicaColor = '#18FF19';
  else if (value >= 0.65) atypicaColor = '#ffffff';

  // Market color is always white with lower opacity
  const marketColor = 'rgba(255,255,255,0.5)';

  const sizeMetrics = {
    sm: { w: 'w-10', h: 'h-10', stroke: 2, radius: 18, inner: 14, textMain: 'text-[9px]', textSecondary: 'text-[6px]' },
    md: { w: 'w-16', h: 'h-16', stroke: 3, radius: 28, inner: 23, textMain: 'text-sm', textSecondary: 'text-[8px]' },
    lg: { w: 'w-24', h: 'h-24', stroke: 4, radius: 44, inner: 38, textMain: 'text-xl', textSecondary: 'text-xs' }
  };

  const { w, h, stroke, radius, inner, textMain, textSecondary } = sizeMetrics[size];

  // Calculate circumferences and offsets
  const outerCircumference = 2 * Math.PI * radius;
  const innerCircumference = showDualRing ? 2 * Math.PI * inner : 0;

  const atypicaOffset = outerCircumference - (value * outerCircumference);
  const marketOffset = showDualRing && marketPercentage !== undefined
    ? innerCircumference - (marketPercentage * innerCircumference)
    : 0;

  return (
    <div className={`relative flex items-center justify-center ${w} ${h}`}>
      <svg className="w-full h-full transform -rotate-90">
        {/* Outer background ring */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={stroke}
          fill="transparent"
        />

        {/* Atypica confidence ring (outer) */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={atypicaColor}
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={outerCircumference}
          strokeDashoffset={atypicaOffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-in-out"
        />

        {/* Inner background ring for market percentage */}
        {showDualRing && (
          <circle
            cx="50%"
            cy="50%"
            r={inner}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={stroke}
            fill="transparent"
          />
        )}

        {/* Market percentage ring (inner) */}
        {showDualRing && marketPercentage !== undefined && (
          <circle
            cx="50%"
            cy="50%"
            r={inner}
            stroke={marketColor}
            strokeWidth={stroke}
            fill="transparent"
            strokeDasharray={innerCircumference}
            strokeDashoffset={marketOffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-in-out"
          />
        )}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* If showing both rings, display both values */}
        {showDualRing && marketPercentageValue !== null ? (
          <>
            <span className={`font-bold text-primary leading-none ${textMain}`}>
              {percentage}%
            </span>
            <span className={`font-medium text-white/70 leading-tight ${textSecondary}`}>
              Mkt: {marketPercentageValue}%
            </span>
          </>
        ) : (
          <span className={`font-bold text-white leading-none ${textMain}`}>
            {labelPrefix && <span className={`block text-center ${textSecondary} text-white/50 mb-0.5`}>{labelPrefix}</span>}
            {percentage}%
          </span>
        )}
      </div>
    </div>
  );
};
