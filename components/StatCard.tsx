'use client';

import React, { useRef, useEffect } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  hoverEffect?: 'orange-glow' | 'blue-ring' | null;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, hoverEffect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const isModelPrecision = hoverEffect === 'blue-ring';
  
  // Model Precision 鼠标跟随蓝色圆圈
  useEffect(() => {
    if (!isModelPrecision || !cardRef.current || !ringRef.current) return;
    
    const card = cardRef.current;
    const ring = ringRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ring.style.left = `${x}px`;
      ring.style.top = `${y}px`;
      ring.style.opacity = '1';
    };
    
    const handleMouseLeave = () => {
      ring.style.opacity = '0';
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isModelPrecision]);
  
  return (
    <div 
      ref={cardRef}
      className={`glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-visible ${
        hoverEffect === 'orange-glow' ? 'stat-orange-glow' : ''
      } ${isModelPrecision ? 'stat-blue-ring' : ''}`}
    >
      {isModelPrecision && (
        <div ref={ringRef} className="stat-blue-ring-cursor"></div>
      )}
      <div className="text-2xl font-black text-white mb-0.5">{value}</div>
      <div className="text-[10px] text-muted font-bold uppercase tracking-widest">{label}</div>
    </div>
  );
};
