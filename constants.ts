import { Market } from './types';

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
    heroDesc: "The premier decentralized prediction market on Base. Fast, secure, and liquid.",
    startTrading: "Start Trading",
    trendingMarkets: "Trending Markets",
    vol: "Vol",
    ends: "Ends",
    aiInsight: "AI Insight",
    askGemini: "Ask AI Analyst",
    analyzing: "Analyzing...",
    buy: "Buy",
    stakingApy: "12.5% APY",
    poolTvl: "Global Pool TVL",
    yourStake: "Your Active Stake",
    accumulatedRewards: "Unclaimed Rewards",
    manageStaking: "Manage Staking",
    claimRewards: "Claim Rewards",
    stakingStatus: "Live Yield Pool"
  }
};

export const INITIAL_MARKETS: Market[] = [
  {
    id: '1',
    question: "Will Bitcoin hit $120k before Q3 2025?",
    description: "Resolves to YES if BTC/USD touches $120,000 on Coinbase.",
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
    question: "Will Base reach $20B TVL by year end?",
    description: "Resolves based on L2Beat metrics for Dec 31, 2025.",
    endDate: "2025-12-31",
    volume: 1250000,
    yesPrice: 0.48,
    noPrice: 0.52,
    imageUrl: "https://avatars.githubusercontent.com/u/108554348?s=200&v=4",
    category: 'Crypto',
    isResolved: false
  }
];

export const MOCK_USER = {
  fid: 888,
  username: "base_trader",
  pfpUrl: "https://picsum.photos/100/100?random=99",
  walletAddress: "0xFC...1225",
  points: 2500
};

export const LEADERBOARD_DATA = [
  { rank: 1, user: "vitalik.eth", pnl: 450000, winRate: 82 },
  { rank: 2, user: "base_whale", pnl: 280200, winRate: 75 },
  { rank: 3, user: "degen_king", pnl: 145000, winRate: 68 },
];

export const COIN_PRICES = [
  { symbol: "BTC", price: 98120.50, change: 1.2 },
  { symbol: "ETH", price: 2745.80, change: -0.8 },
  { symbol: "USDC", price: 1.00, change: 0.00 },
];
