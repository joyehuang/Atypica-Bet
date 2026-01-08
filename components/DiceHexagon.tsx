import React from 'react';

interface DiceHexagonProps {
  className?: string;
  size?: number;
}

export const DiceHexagon: React.FC<DiceHexagonProps> = ({
  className = '',
  size = 24
}) => {
  // Calculate SVG dimensions
  const viewBoxSize = 24;
  const strokeWidth = size / 12;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Hexagon shape (filled) */}
      <path
        d="M21 16.5v-9l-7.5-4.5L6 7.5v9l7.5 4.5L21 16.5z"
        fill="currentColor"
        stroke="none"
      />

      {/* Dice dots/lines */}
      <line
        x1="7.5"
        y1="10.5"
        x2="16.5"
        y2="10.5"
        stroke="#000"
        strokeWidth={strokeWidth}
      />
      <line
        x1="7.5"
        y1="13.5"
        x2="16.5"
        y2="13.5"
        stroke="#000"
        strokeWidth={strokeWidth}
      />
      <line
        x1="12"
        y1="8"
        x2="12"
        y2="16"
        stroke="#000"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default DiceHexagon;