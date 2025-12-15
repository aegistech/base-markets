export enum MarketOutcome {
  YES = 'YES',
  NO = 'NO'
}

export interface Market {
  id: string;
  question: string;
  description: string;
  endDate: string;
  volume: number;
  yesPrice: number; // 0.00 to 1.00
  noPrice: number;  // 0.00 to 1.00
  imageUrl: string;
  category: 'Crypto' | 'Politics' | 'Sports' | 'Pop Culture';
  isResolved: boolean;
  winner?: MarketOutcome;
}

export interface UserPosition {
  marketId: string;
  outcome: MarketOutcome;
  shares: number;
  avgPrice: number;
}

export interface UserProfile {
  fid: number; // Farcaster ID
  username: string;
  pfpUrl: string;
  walletAddress: string;
  points: number;
}

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'BUY_YES' | 'BUY_NO' | 'SELL';
  amount: number;
  timestamp: number;
  details: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}