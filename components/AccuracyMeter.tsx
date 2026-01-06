
import React from 'react';

interface AccuracyMeterProps {
  value: number; // 0-1
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const AccuracyMeter: React.FC<AccuracyMeterProps> = ({ value, size = 'md', showLabel = true }) => {
  const percentage = Math.round(value * 100);
  
  // Minimalist palette
  let color = '#ffffff';
  if (value >= 0.85) color = '#18FF19'; 
  else if (value >= 0.65) color = '#ffffff';

  const sizeMetrics = {
    sm: { w: 'w-10', h: 'h-10', stroke: 2, radius: 18 },
    md: { w: 'w-16', h: 'h-16', stroke: 3, radius: 28 },
    lg: { w: 'w-24', h: 'h-24', stroke: 4, radius: 44 }
  };

  const { w, h, stroke, radius } = sizeMetrics[size];
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value * circumference);

  return (
    <div className={`relative flex items-center justify-center ${w} ${h}`}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={stroke}
          fill="transparent"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-bold text-white leading-none ${size === 'lg' ? 'text-xl' : size === 'md' ? 'text-sm' : 'text-[9px]'}`}>
          {percentage}%
        </span>
      </div>
    </div>
  );
};
