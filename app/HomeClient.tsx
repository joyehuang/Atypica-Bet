'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PredictionMarket, Category, PredictionStatus } from '@/types';
import { CATEGORY_LABELS } from '@/constants';
import { PredictionCard } from '@/components/PredictionCard';
import { StatCard } from '@/components/StatCard';
import { ChevronDown, SlidersHorizontal, CheckCircle2, Zap, ChevronRight, ArrowRight, TrendingUp, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Brush } from 'recharts';
import { useLightCard } from '@/hooks/useLightCard';

interface HomeClientProps {
  initialMarkets: PredictionMarket[];
}

export default function HomeClient({ initialMarkets }: HomeClientProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<Category | 'ALL'>('ALL');
  const [activeStatus, setActiveStatus] = useState<PredictionStatus | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'hourly' | 'daily'>('hourly');
  const mouseFollowRef = useRef<HTMLDivElement>(null);
  
  // Verified Logic Results 卡片的橙黄色光效（增强可见度）
  const { cardRef: verifiedCardRef } = useLightCard({
    light: {
      color: 'rgba(255, 179, 71, 0.4)',
      width: 100,
      height: 100,
      blur: 60
    }
  });

  const handleMarketClick = (id: string) => {
    router.push(`/market/${id}`);
  };

  // 鼠标跟随背景效果（带滞后平滑 Lerp 动画）
  useEffect(() => {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (mouseFollowRef.current) {
        mouseFollowRef.current.style.opacity = '1';
      }
    };

    const animate = () => {
      // Lerp 插值，0.15 的系数提供平滑滞后效果
      const lerpFactor = 0.15;
      currentX += (targetX - currentX) * lerpFactor;
      currentY += (targetY - currentY) * lerpFactor;

      if (mouseFollowRef.current) {
        mouseFollowRef.current.style.left = `${currentX}px`;
        mouseFollowRef.current.style.top = `${currentY}px`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseLeave = () => {
      if (mouseFollowRef.current) {
        mouseFollowRef.current.style.opacity = '0';
      }
    };

    // 初始化位置
    if (mouseFollowRef.current) {
      const rect = mouseFollowRef.current.getBoundingClientRect();
      currentX = window.innerWidth / 2;
      currentY = window.innerHeight / 2;
      targetX = currentX;
      targetY = currentY;
    }

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const filteredMarkets = useMemo(() => {
    return initialMarkets.filter(m => {
      const catMatch = activeCategory === 'ALL' || m.category === activeCategory;
      const statusMatch = activeStatus === 'ALL' || m.status === activeStatus;
      return catMatch && statusMatch;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [initialMarkets, activeCategory, activeStatus]);

  const stats = {
    active: initialMarkets.length,
    success: initialMarkets.filter(m => m.status === PredictionStatus.SUCCESSFUL).length,
    precision: Math.round((initialMarkets.filter(m => m.status === PredictionStatus.SUCCESSFUL).length /
               (initialMarkets.filter(m => m.status === PredictionStatus.SUCCESSFUL || m.status === PredictionStatus.FAILED).length || 1)) * 100)
  };

  const successfulMarkets = initialMarkets.filter(m => m.status === PredictionStatus.SUCCESSFUL);

  // 生成从1月9号往前推7天的日期数据，包含每小时的数据点
  const generateProfitData = () => {
    const today = new Date(2026, 0, 9); // 1月9号
    const data = [];
    const dailyValues = {
      bet1: [0, 2, 3, -1, -2, 4, 6],
      bet2: [0, -1, -2, 1, 0, 2, 3],
      bet3: [0, 3, 5, 4, 3, -1, 0],
    };
    
    let cumulativeSum = 0;
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dayIndex = 6 - i;
      
      // 每天24小时的数据点
      for (let hour = 0; hour < 24; hour++) {
        const hourDate = new Date(date);
        hourDate.setHours(hour, 0, 0, 0);
        
        // 使用小时进度进行插值和波动，让数据更有动态感
        const hourProgress = hour / 24;
        const wave1 = Math.sin(hourProgress * Math.PI * 2) * 0.8;
        const wave2 = Math.cos(hourProgress * Math.PI * 1.5) * 0.6;
        const wave3 = Math.sin(hourProgress * Math.PI * 2.5) * 0.7;
        
        // 计算每小时的值，添加波动让线条更有动态感
        const bet1Value = dayIndex === 0 && hour === 0 ? 0 : 
          dailyValues.bet1[dayIndex] * hourProgress + wave1;
        
        const bet2Value = dayIndex === 0 && hour === 0 ? 0 :
          dailyValues.bet2[dayIndex] * hourProgress + wave2;
        
        const bet3Value = dayIndex === 0 && hour === 0 ? 0 :
          dailyValues.bet3[dayIndex] * hourProgress + wave3;
        
        const dailyTotalValue = bet1Value + bet2Value + bet3Value;
        
        // 计算累计值：前面所有天的总和 + 当前天到当前小时的累计
        let prevDaysTotal = 0;
        for (let d = 0; d < dayIndex; d++) {
          prevDaysTotal += dailyValues.bet1[d] + dailyValues.bet2[d] + dailyValues.bet3[d];
        }
        
        // 当前天到当前小时的累计（使用插值）
        const currentDayTotal = dayIndex === 0 ? 0 :
          (dailyValues.bet1[dayIndex] + dailyValues.bet2[dayIndex] + dailyValues.bet3[dayIndex]) * hourProgress;
        
        const cumulativeTotal = prevDaysTotal + currentDayTotal;
        
        data.push({
          dateTime: `${month}/${day} ${hour.toString().padStart(2, '0')}:00`,
          date: `${month}/${day}`,
          hour: hour,
          dateFull: hourDate,
          bet1: Math.round(bet1Value * 10) / 10,
          bet2: Math.round(bet2Value * 10) / 10,
          bet3: Math.round(bet3Value * 10) / 10,
          dailyTotal: Math.round(dailyTotalValue * 10) / 10,
          cumulativeTotal: Math.round(cumulativeTotal * 10) / 10
        });
      }
    }
    return data;
  };

  const allProfitData = generateProfitData();
  
  // 根据视图模式过滤数据
  const profitData = useMemo(() => {
    if (viewMode === 'daily') {
      // 只显示每天最后一个小时的数据点（即每天结束时的值）
      return allProfitData.filter((item, index) => {
        return (index + 1) % 24 === 0 || index === allProfitData.length - 1;
      });
    }
    return allProfitData;
  }, [viewMode, allProfitData]);

  return (
    <div className="max-w-7xl mx-auto px-6 pb-40 relative">
      {/* 鼠标跟随背景光晕 */}
      <div
        ref={mouseFollowRef}
        className="mouse-follow-bg"
        style={{ left: '50%', top: '50%' }}
      />
      {/* Hero Section */}
      <section className="pt-32 pb-24 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">
             AI Predictive Infrastructure v4.2
          </div>

          <div className="relative z-10">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.95]">
              <span className="text-white">Intelligence</span>
              <br />
              <span className="bg-gradient-to-t from-gray-500 to-white bg-clip-text text-transparent">Beyond Guess.</span>
            </h1>
          </div>

          <p className="font-gothic text-muted text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed mt-12">
            Neural networks analyzing factual volatility to provide <br className="hidden md:block" /> objective market foresight with mathematical precision.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 max-w-5xl mx-auto">
        <StatCard label="Active Matrix Nodes" value={stats.active} />
        <StatCard label="Successful Resolves" value={stats.success} hoverEffect="orange-glow" />
        <StatCard label="Model Precision" value={stats.precision + '%'} hoverEffect="blue-ring" />
      </div>

      {/* Profits Visualization */}
      <div className="mb-24">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <TrendingUp className="text-primary w-3.5 h-3.5" />
            </div>
            <h2 className="text-lg font-bold tracking-tight">Profit Analytics</h2>
          </div>
          <button className="flex items-center gap-1 text-[10px] font-bold text-muted uppercase tracking-widest hover:text-white hidden">
            View All Data <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="glass-panel p-4 rounded-xl card-layer-2">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-0.5">Daily Bet Performance</h3>
              <p className="text-xs text-white/60 font-gothic">
                Individual bet performance tracked over time with daily and cumulative profit indicators
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 p-2 bg-white/5 rounded-lg">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-xs text-white font-medium">+42% Total Return</span>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 bg-white/5 rounded-lg border border-white/10">
                <button
                  onClick={() => setViewMode('hourly')}
                  className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                    viewMode === 'hourly'
                      ? 'bg-primary text-black'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Hourly
                </button>
                <button
                  onClick={() => setViewMode('daily')}
                  className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                    viewMode === 'daily'
                      ? 'bg-primary text-black'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Daily
                </button>
              </div>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={profitData}
                margin={{
                  top: 5,
                  right: 20,
                  left: 0,
                  bottom: 50,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey={viewMode === 'hourly' ? 'dateTime' : 'date'} 
                  stroke="#666" 
                  tick={{ fontSize: 9, fill: '#666' }}
                  interval={viewMode === 'hourly' ? 23 : 0} // 按小时模式时每24个显示一个，按天模式时全部显示
                  label={{ value: viewMode === 'hourly' ? 'Date & Time' : 'Date', position: 'insideBottom', offset: -5, fill: '#666', style: { fontSize: '10px' } }}
                  angle={viewMode === 'hourly' ? -45 : 0}
                  textAnchor={viewMode === 'hourly' ? 'end' : 'middle'}
                  height={viewMode === 'hourly' ? 60 : 30}
                />
                <YAxis stroke="#666" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    borderRadius: '6px',
                    padding: '8px',
                  }}
                  itemStyle={{ color: '#fff', fontSize: '11px' }}
                  labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.5)', strokeWidth: 2, strokeDasharray: '3 3' }}
                  formatter={(value: any) => value}
                  labelFormatter={(label: string, payload: any[]) => {
                    if (payload && payload[0] && payload[0].payload && payload[0].payload.dateTime) {
                      return `Time: ${payload[0].payload.dateTime}`;
                    }
                    return `Date: ${label}`;
                  }}
                />
                <Legend verticalAlign="top" height={20} wrapperStyle={{ fontSize: '10px', paddingBottom: '5px' }} />
                <defs>
                  <linearGradient id="cumulativeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#9D4EDD" stopOpacity={1} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
                <Line 
                  type="monotone" 
                  dataKey="bet1" 
                  stroke="#FF4444" 
                  dot={false}
                  activeDot={{ r: 6, fill: '#FF4444', stroke: '#fff', strokeWidth: 2 }} 
                  name="Market A"
                  strokeWidth={1.5}
                />
                <Line 
                  type="monotone" 
                  dataKey="bet2" 
                  stroke="#82ca9d"
                  dot={false}
                  activeDot={{ r: 6, fill: '#82ca9d', stroke: '#fff', strokeWidth: 2 }}
                  name="Market B"
                  strokeWidth={1.5}
                />
                <Line 
                  type="monotone" 
                  dataKey="bet3" 
                  stroke="#ffc658"
                  dot={false}
                  activeDot={{ r: 6, fill: '#ffc658', stroke: '#fff', strokeWidth: 2 }}
                  name="Market C"
                  strokeWidth={1.5}
                />
                <Line 
                  type="monotone" 
                  dataKey="dailyTotal" 
                  stroke="#E91E63" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 7, fill: '#E91E63', stroke: '#fff', strokeWidth: 2 }}
                  name="Daily Total"
                />
                <Line 
                  type="monotone" 
                  dataKey="cumulativeTotal" 
                  stroke="url(#cumulativeGradient)" 
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 8, fill: '#7C3AED', stroke: '#fff', strokeWidth: 2 }}
                  name="Cumulative Profit"
                />
                <Brush
                  dataKey={viewMode === 'hourly' ? 'dateTime' : 'date'}
                  height={30}
                  stroke="#666"
                  fill="rgba(255,255,255,0.05)"
                  tickFormatter={(value) => {
                    if (viewMode === 'hourly') {
                      return value;
                    }
                    return value;
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-white/80 font-gothic">
                Each bet line represents a separate prediction market position. The daily total shows aggregate profit/loss
                per day across all positions, while the cumulative line displays total earnings over time.
                All predictions use the Atypica AI predictive engine with a consistent betting strategy.
                This chart's predictions are based on equal investment amounts across all options.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Market Controls */}
      <div id="market-grid" className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 py-3 border-y border-white/5">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${activeCategory === 'ALL' ? 'bg-white text-black' : 'text-muted hover:text-white'}`}
          >
            All Segments
          </button>
          {Object.entries(CATEGORY_LABELS)
            .filter(([key]) => key !== Category.SPORTS)
            .map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key as Category)}
              className={`px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeCategory === key ? 'bg-white text-black' : 'text-muted hover:text-white'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              value={activeStatus}
              onChange={(e) => setActiveStatus(e.target.value as any)}
              className="appearance-none bg-transparent border-none text-[11px] font-bold uppercase tracking-widest text-muted focus:text-white outline-none pr-6 cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value={PredictionStatus.ACTIVE}>Active</option>
              <option value={PredictionStatus.SUCCESSFUL}>Success</option>
            </select>
            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
          </div>
          <div className="w-px h-4 bg-white/10 hidden md:block"></div>
          <button className="text-muted hover:text-white transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Market Grid - 只显示前3张卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMarkets.length > 0 ? (
          filteredMarkets.slice(0, 3).map((market, index) => {
            const labels = ['A', 'B', 'C'];
            return (
              <PredictionCard 
                key={market.id} 
                market={market} 
                onClick={handleMarketClick}
                marketLabel={labels[index]}
              />
            );
          })
        ) : (
          <div className="col-span-full py-32 text-center">
            <p className="text-muted font-bold tracking-widest uppercase text-xs">Zero results in this query vector.</p>
          </div>
        )}
      </div>

      {/* Verified Results Section */}
      <div className="mt-32">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <CheckCircle2 className="text-primary w-3.5 h-3.5" />
            </div>
            <h2 className="text-lg font-bold tracking-tight">Verified Logic Results</h2>
          </div>
          <button className="flex items-center gap-1 text-[10px] font-bold text-muted uppercase tracking-widest hover:text-white hidden">
            Full History <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Mock Verified Logic Results - 详细分析结果 */}
          <div ref={verifiedCardRef} className="group cursor-pointer glass-panel spotlight-card rounded-xl transition-all duration-300 hover:border-white/20 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-white/20 bg-white/5 text-white">
                    Tech
                      </span>
                  <span className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-primary/30 bg-primary/5 text-primary">
                        Verified Success
                      </span>
                    </div>

                <h3 className="text-xl font-bold text-white leading-tight mb-2">
                  Will the Los Angeles Lakers win the 2024 NBA Championship?
                    </h3>

                <p className="text-sm text-white/70 mb-4">
                  Analysis of team performance metrics, player statistics, and historical championship patterns.
                    </p>
                  </div>

                </div>

            {/* 详细分析结果 */}
            <div className="space-y-4 mb-4">
              <div className="bg-white/[0.03] rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-primary" />
                    <div className="text-sm font-bold text-primary">Atypica Analysis & Prediction</div>
                  </div>

                  <div className="mb-4">
                  <p className="text-sm text-white/80 italic mb-3">
                    &quot;Based on comprehensive analysis of team performance metrics, player statistics, and historical championship patterns, the Los Angeles Lakers demonstrate strong potential for championship success.&quot;
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-white/50 mb-1">Atypica&apos;s Choice</div>
                    <div className="flex items-end gap-3">
                      <div className="text-2xl font-bold text-white">Yes</div>
                      <div className="flex flex-col">
                        <div className="text-xs text-white/70 mb-1">
                          Confidence
                        </div>
                        <div className="flex gap-1.5 items-center">
                          <div className="w-6 h-1 bg-primary rounded-sm"></div>
                          <div className="w-6 h-1 bg-primary rounded-sm"></div>
                          <div className="w-6 h-1 bg-white/30 rounded-sm"></div>
                        </div>
                      </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-white/50 mb-1">Market Consensus</div>
                      <div className="text-base font-medium text-white flex items-center gap-2">
                      72% Probability
                    </div>
                  </div>
                </div>
              </div>

              {/* 详细分析部分 */}
              <div className="bg-white/[0.02] rounded-lg p-4 border border-white/5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-white/70 mb-3">Detailed Analysis Breakdown</div>
                
                <div className="space-y-3">
                  <div className="border-l-2 border-primary/30 pl-3">
                    <div className="text-[10px] font-bold text-primary mb-1">Key Factors</div>
                    <ul className="text-xs text-white/70 space-y-1 list-disc list-inside">
                      <li>Team performance metrics: 8.5/10 average rating</li>
                      <li>Player statistics: LeBron James averaging 28.5 PPG</li>
                      <li>Historical patterns: 65% win rate in playoffs</li>
                    </ul>
                  </div>

                  <div className="border-l-2 border-primary/30 pl-3">
                    <div className="text-[10px] font-bold text-primary mb-1">Risk Assessment</div>
                    <p className="text-xs text-white/70">
                      Moderate risk due to competitive Western Conference. Key players&apos; health status is critical factor.
                    </p>
                  </div>

                  <div className="border-l-2 border-primary/30 pl-3">
                    <div className="text-[10px] font-bold text-primary mb-1">Confidence Rationale</div>
                    <p className="text-xs text-white/70">
                      High confidence based on consistent performance patterns and strong statistical indicators. Model accuracy validated against historical data.
                    </p>
                  </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/60">All Prediction Options</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/60">Result</div>
                </div>

                <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded bg-primary/10 border border-primary/20">
                      <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-primary">
                    Yes
                        </span>
                          <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                            Atypica Pick
                          </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center">
                          <span className="text-[9px] mr-1 text-muted">Market:</span>
                    <span className="text-xs font-medium text-white">72%</span>
                        </div>
                          <div className="flex items-center">
                    <span className="text-xs font-medium text-primary">High</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            <span className="text-xs font-bold text-green-400">Winner</span>
                          </div>
                      </div>
                    </div>

              <div className="flex items-center justify-between p-2 rounded bg-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">
                    No
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center">
                    <span className="text-[9px] mr-1 text-muted">Market:</span>
                    <span className="text-xs font-medium text-white">28%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-primary">Low</span>
                  </div>
                </div>
              </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-white/50">
                  12/15/2024
                    </div>
                    <div className="text-xs text-white/50">
                      <span className="font-medium">Volume:</span>{' '}
                  2,450,000
                    </div>
                  </div>

                  <div className="flex items-center text-white/50 group-hover:text-primary transition-all gap-1 font-bold uppercase tracking-widest text-[9px]">
                    View Full Report <ArrowRight className="w-3.5 h-3.5 translate-x-1 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>

          {successfulMarkets.length === 0 && (
            <div className="col-span-full py-10 text-center glass-panel rounded-xl">
              <p className="text-muted font-bold tracking-widest uppercase text-xs">No verified results available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
