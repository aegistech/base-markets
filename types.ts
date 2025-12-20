
export enum MarketOutcome {
  YES = 'YES',
  NO = 'NO'
}

export type Language = 'en';

export interface Market {
  id: string;
  question: string;
  description: string;
  endDate: string;
  volume: number;
  yesPrice: number;
  noPrice: number;
  imageUrl: string;
  category: 'Crypto' | 'Politics' | 'Sports' | 'Pop Culture';
  isResolved: boolean;
  winner?: MarketOutcome;
}

export interface UserProfile {
  fid: number;
  username: string;
  pfpUrl: string;
  walletAddress: string;
  points: number;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}
