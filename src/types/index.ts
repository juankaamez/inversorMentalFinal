export interface InvestorProfile {
  riskTolerance: 'conservador' | 'moderado' | 'agresivo';
  investmentGoals: string[];
  timeHorizon: number;
  initialInvestment: number;
  preferredSectors?: string[];
  preferredRegions?: string[];
}

export interface StockData {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  dividend: number;
  high52Week: number;
  low52Week: number;
  avgVolume: number;
  beta: number;
}

export interface NewsItem {
  headline: string;
  summary: string;
  url: string;
  source: string;
  datetime: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
  region?: string;
  category?: string;
}