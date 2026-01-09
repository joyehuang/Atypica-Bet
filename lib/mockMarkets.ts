import { Category, PredictionMarket, PredictionStatus } from '@/types';

// 本地开发用的 Mock 市场数据，用于测试 PredictionCard 展示效果
export const MOCK_MARKETS: PredictionMarket[] = [
  {
    id: 'mock-1',
    title: 'Will Bitcoin close above $150,000 on Dec 31, 2026?',
    description:
      'Aggregated on-chain flows, ETF inflows and macro liquidity regime suggest elevated upside risk for BTC into the 2026 halving cycle.',
    category: Category.FINANCE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    closeDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 天后
    resolveDate: undefined,
    status: PredictionStatus.ACTIVE,
    options: [
      {
        id: 'opt-btc-yes',
        text: 'Yes',
        externalProb: 0.58,
        atypicaProb: 0.3, // 30% - 红色 bar
        isWinner: false,
      },
      {
        id: 'opt-btc-no',
        text: 'No',
        externalProb: 0.42,
        atypicaProb: 0.7,
        isWinner: false,
      },
    ],
    atypicaPickId: 'opt-btc-yes',
    atypicaAnalysis:
      'Derivative positioning and structural ETF demand create reflexive upside into year-end. Absent a deep macro shock, odds favor a regime shift above six figures.',
    accuracyScore: 0.81,
    externalSource: 'Polymarket: BTC year-end target',
    shareCount: 128,
    viewCount: 5421,
    poolAmount: 2_500_000,
    poolCurrency: 'USD',
    // NFT 持仓 mock 数据
    nftPercentRealizedPnl: 15.5, // 正收益
    nftCurrentValue: 0.155, // 1 * 15.5 / 100
    nftWinValue: 1.0, // 购买 1 美元
    nftLastSynced: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    title: 'Will the next iPhone feature native on-device LLM?',
    description:
      'Supply-chain checks, Apple silicon roadmap and privacy positioning indicate a high likelihood of on-device generative models shipping in the next flagship cycle.',
    category: Category.TECH,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    closeDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 天后
    resolveDate: undefined,
    status: PredictionStatus.ACTIVE,
    options: [
      {
        id: 'opt-iph-yes',
        text: 'Yes',
        externalProb: 0.65,
        atypicaProb: 0.55, // 55% - 黄色 bar
        isWinner: false,
      },
      {
        id: 'opt-iph-no',
        text: 'No',
        externalProb: 0.35,
        atypicaProb: 0.45,
        isWinner: false,
      },
    ],
    atypicaPickId: 'opt-iph-yes',
    atypicaAnalysis:
      'Apple’s silicon performance envelope and marketing emphasis on privacy make an on-device LLM the most coherent strategic move this cycle.',
    accuracyScore: 0.76,
    externalSource: 'Polymarket: Apple AI features',
    shareCount: 302,
    viewCount: 9876,
    poolAmount: 1_450_000,
    poolCurrency: 'USD',
    // NFT 持仓 mock 数据
    nftPercentRealizedPnl: -10.2, // 负收益
    nftCurrentValue: -0.102, // 1 * (-10.2) / 100
    nftWinValue: 1.0, // 购买 1 美元
    nftLastSynced: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    title: 'Will Team A win the 2025 Championship Finals?',
    description:
      'Injury reports, roster depth and historical playoff efficiency heavily favor Team A, barring black-swan level disruptions.',
    category: Category.SPORTS,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    closeDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 已结束
    resolveDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: PredictionStatus.SUCCESSFUL,
    options: [
      {
        id: 'opt-teamA',
        text: 'Team A',
        externalProb: 0.55,
        atypicaProb: 0.85, // 85% - 绿色 bar
        isWinner: true,
      },
      {
        id: 'opt-field',
        text: 'Any other team',
        externalProb: 0.45,
        atypicaProb: 0.15,
        isWinner: false,
      },
    ],
    atypicaPickId: 'opt-teamA',
    atypicaAnalysis:
      'Team A’s half-court offense and bench stability dominate late-series scenarios, especially under compressed rest schedules.',
    accuracyScore: 0.9,
    externalSource: 'Polymarket: 2025 Finals winner',
    shareCount: 520,
    viewCount: 16_432,
    poolAmount: 3_100_000,
    poolCurrency: 'USD',
    // NFT 持仓 mock 数据
    nftPercentRealizedPnl: 35.8, // 高收益
    nftCurrentValue: 0.358, // 1 * 35.8 / 100
    nftWinValue: 1.0, // 购买 1 美元
    nftLastSynced: new Date().toISOString(),
  },
];


