
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
