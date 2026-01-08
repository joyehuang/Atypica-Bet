
export enum Category {
  TECH = 'TECH',
  FINANCE = 'FINANCE',
  SPORTS = 'SPORTS',
  ENTERTAINMENT = 'ENTERTAINMENT'
}

export enum PredictionStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED'
}

export interface PredictionOption {
  id: string;
  text: string;
  externalProb?: number; // 0-1
  atypicaProb?: number;  // 0-1
  isWinner?: boolean;
}

export interface PredictionMarket {
  id: string;
  title: string;
  description: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
  closeDate: string;
  resolveDate?: string;
  status: PredictionStatus;
  options: PredictionOption[];
  atypicaPickId?: string;
  atypicaAnalysis?: string;
  accuracyScore?: number; // 0-1
  externalSource?: string;
  shareCount: number;
  viewCount: number;
  poolAmount?: number; // 池子总金额
  poolCurrency?: string; // 货币类型，例如 "USD"
}

// Polymarket API 响应类型
export interface PolymarketTag {
  id: string;
  label: string;
  slug: string;
}

export interface PolymarketSubMarket {
  id: string;
  question: string;
  slug: string;
  startDate: string;
  endDate: string;
  image: string;
  icon: string;
  description: string;
  outcomes: string;  // JSON string: "[\"Yes\", \"No\"]"
  outcomePrices: string;  // JSON string: "[\"0.45\", \"0.55\"]"
  volume: string;
  active: boolean;
  closed: boolean;
  bestBid?: number;
  bestAsk?: number;
  lastTradePrice?: number;
}

export interface PolymarketEventGroup {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  image: string;
  icon: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  new: boolean;
  featured: boolean;
  restricted: boolean;
  volume: number;
  markets: PolymarketSubMarket[];
  tags: PolymarketTag[];
}
