import { Market, NewsItem, MarketOutcome } from './types';

export const TRANSLATIONS = {
  en: {
    searchPlaceholder: "Search markets...",
    balance: "Balance",
    deposit: "Deposit",
    withdraw: "Withdraw",
    signIn: "Sign in",
    connecting: "Connecting...",
    markets: "Markets",
    leaderboard: "Leaderboard",
    earn: "Earn",
    portfolio: "Portfolio",
    points: "Points",
    news: "News",
    myWallet: "My Wallet",
    heroTitle: "Predict the Future. Win USDC.",
    heroDesc: "The most liquid prediction market on Base. Fast, secure, and decentralized.",
    startTrading: "Start Trading",
    trendingMarkets: "Trending Markets",
    vol: "Vol",
    ends: "Ends",
    aiInsight: "AI Insight",
    askGemini: "Ask Gemini Analyst",
    analyzing: "Analyzing...",
    buy: "Buy",
    stakingApy: "12.5% APY",
    poolTvl: "Total Value Locked",
    yourStake: "Your Stake",
    accumulatedRewards: "Earned Rewards",
    manageStaking: "Manage Staking",
    claimRewards: "Claim Rewards",
    stakingStatus: "Active Pool"
  }
};

export const INITIAL_MARKETS: Market[] = [
  {
    id: '1',
    question: "Will BTC reach $120,000 before July 2025?",
    description: "Resolves to YES if BTC reaches $120k on Coinbase before July 1, 2025.",
    endDate: "2025-07-01",
    volume: 3240000,
    yesPrice: 0.65,
    noPrice: 0.35,
    imageUrl: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    category: 'Crypto',
    isResolved: false
  },
  {
    id: '2',
    question: "Will Base TVL exceed $15 Billion by end of year?",
    description: "Based on L2Beat data for Dec 31, 2025.",
    endDate: "2025-12-31",
    volume: 1250000,
    yesPrice: 0.48,
    noPrice: 0.52,
    imageUrl: "https://avatars.githubusercontent.com/u/108554348?s=200&v=4",
    category: 'Crypto',
    isResolved: false
  },
  {
    id: '3',
    question: "Will the Fed announce a rate cut in June 2025?",
    description: "Resolves YES if there is any cut in the June FOMC meeting.",
    endDate: "2025-06-30",
    volume: 890000,
    yesPrice: 0.75,
    noPrice: 0.25,
    imageUrl: "https://picsum.photos/400/400?random=44",
    category: 'Politics',
    isResolved: false
  }
];

export const MOCK_USER = {
  fid: 888,
  username: "vuminh_degen",
  pfpUrl: "https://picsum.photos/100/100?random=99",
  walletAddress: "0xFC...1225",
  points: 2500
};

export const COIN_PRICES = [
  { symbol: "BTC", price: 98120.50, change: 1.2 },
  { symbol: "ETH", price: 2745.80, change: -0.8 },
  { symbol: "SOL", price: 242.15, change: 2.4 },
  { symbol: "USDC", price: 1.00, change: 0.00 },
];

export const LEADERBOARD_DATA = [
  { rank: 1, user: "vitalik.eth", pnl: 450000, winRate: 82 },
  { rank: 2, user: "base_whale", pnl: 280200, winRate: 75 },
  { rank: 3, user: "degen_king", pnl: 145000, winRate: 68 },
  { rank: 4, user: "farcaster_fan", pnl: 92100, winRate: 62 },
  { rank: 5, user: "early_adopter", pnl: 48000, winRate: 58 },
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: "Ethereum L2 adoption spikes on Base",
    source: "Bloomberg",
    timeAgo: "1h ago",
    sentiment: 'bullish'
  }
];
