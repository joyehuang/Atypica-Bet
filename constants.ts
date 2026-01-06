
import { Category, PredictionStatus, PredictionMarket } from './types';

export const CATEGORY_LABELS: Record<Category, string> = {
  [Category.TECH]: '科技',
  [Category.FINANCE]: '金融',
  [Category.SPORTS]: '体育',
  [Category.ENTERTAINMENT]: '娱乐'
};

export const STATUS_LABELS: Record<PredictionStatus, string> = {
  [PredictionStatus.ACTIVE]: '预测中',
  [PredictionStatus.CLOSED]: '已结束',
  [PredictionStatus.SUCCESSFUL]: '预测成功',
  [PredictionStatus.FAILED]: '预测失败'
};

export const INITIAL_MARKETS: PredictionMarket[] = [
  {
    id: '1',
    title: 'Google, OpenAI, Anthropic... 2026年哪家公司将拥有最强AI模型？',
    description: '综合评估多模态能力、推理深度、开发者生态及商业应用落地情况。',
    category: Category.TECH,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    closeDate: '2026-12-31',
    status: PredictionStatus.ACTIVE,
    options: [
      { id: 'opt1', text: 'Google', externalProb: 0.3, atypicaProb: 0.15 },
      { id: 'opt2', text: 'OpenAI', externalProb: 0.5, atypicaProb: 0.75 },
      { id: 'opt3', text: 'Anthropic', externalProb: 0.2, atypicaProb: 0.1 }
    ],
    atypicaPickId: 'opt2',
    accuracyScore: 0.75,
    atypicaAnalysis: 'OpenAI 凭借其强大的先发优势和快速的迭代能力，在 2026 年依然最有可能占据模型能力的巅峰。其 Q* 技术的突破性应用将极大提升逻辑推理上限。',
    shareCount: 128,
    viewCount: 2540
  },
  {
    id: '2',
    title: '比特币是否能在2025年Q4突破15万美元大关？',
    description: '分析宏观经济走势、机构持仓变动及现货ETF资金流入情况。',
    category: Category.FINANCE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    closeDate: '2025-12-31',
    status: PredictionStatus.ACTIVE,
    options: [
      { id: 'opt4', text: '是', externalProb: 0.45, atypicaProb: 0.65 },
      { id: 'opt5', text: '否', externalProb: 0.55, atypicaProb: 0.35 }
    ],
    atypicaPickId: 'opt4',
    accuracyScore: 0.68,
    atypicaAnalysis: '随着美联储降息周期的确立和减半效应的延迟爆发，流动性溢出将推动比特币进入价格发现的新阶段。',
    shareCount: 89,
    viewCount: 1820
  },
  {
    id: '3',
    title: '谁将赢得 2025 年欧冠冠军？',
    description: '基于球员伤病预测、历史战绩、主客场优势及战术演化趋势。',
    category: Category.SPORTS,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    closeDate: '2025-05-31',
    status: PredictionStatus.SUCCESSFUL,
    options: [
      { id: 'opt6', text: '曼城', externalProb: 0.35, atypicaProb: 0.45, isWinner: true },
      { id: 'opt7', text: '皇马', externalProb: 0.4, atypicaProb: 0.3 },
      { id: 'opt8', text: '拜仁', externalProb: 0.25, atypicaProb: 0.25 }
    ],
    atypicaPickId: 'opt6',
    accuracyScore: 0.88,
    atypicaAnalysis: '曼城的板凳深度和瓜迪奥拉对战术细节的极致打磨，使其在欧战淘汰赛的容错率极高。',
    shareCount: 210,
    viewCount: 4500
  }
];
