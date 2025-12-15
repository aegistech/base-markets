import { Market, NewsItem } from './types';

export const TRANSLATIONS = {
  en: {
    searchPlaceholder: "Search markets...",
    balance: "Balance",
    deposit: "Deposit Funds",
    withdraw: "Withdraw",
    signIn: "Sign in with Farcaster",
    connecting: "Connecting...",
    markets: "Markets",
    leaderboard: "Leaderboard",
    earn: "Earn",
    portfolio: "Portfolio",
    points: "Points",
    news: "News",
    myWallet: "My Wallet",
    heroTitle: "Predict the Future. Win Rewards.",
    heroDesc: "Trade on the outcome of real-world events using USDC on Base. Low fees, instant settlements.",
    startTrading: "Start Trading",
    trendingMarkets: "Trending Markets",
    topVolume: "Top Volume",
    newest: "Newest",
    endingSoon: "Ending Soon",
    vol: "Vol",
    ends: "Ends",
    aiInsight: "AI Insight",
    askGemini: "Ask Gemini Analyst",
    analyzing: "Analyzing...",
    buy: "Buy",
    rank: "Rank",
    user: "User",
    pnl: "PnL",
    winRate: "Win Rate",
    earnYield: "Earn Yield on USDC",
    provideLiquidity: "Provide liquidity to the prediction markets and earn a share of trading fees. Current APY:",
    yourStaked: "Your Staked Balance",
    pendingUnstake: "Pending Unstake",
    manageStake: "Manage Stake",
    comingSoon: "Coming Soon"
  },
  zh: {
    searchPlaceholder: "搜索市场...",
    balance: "余额",
    deposit: "存款",
    withdraw: "取款",
    signIn: "使用 Farcaster 登录",
    connecting: "连接中...",
    markets: "市场",
    leaderboard: "排行榜",
    earn: "赚取",
    portfolio: "投资组合",
    points: "积分",
    news: "新闻",
    myWallet: "我的钱包",
    heroTitle: "预测未来，赢取奖励。",
    heroDesc: "使用 Base 链上的 USDC 交易真实世界事件的结果。低费用，即时结算。",
    startTrading: "开始交易",
    trendingMarkets: "热门市场",
    topVolume: "最高交易量",
    newest: "最新",
    endingSoon: "即将结束",
    vol: "交易量",
    ends: "结束于",
    aiInsight: "AI 见解",
    askGemini: "询问 Gemini 分析师",
    analyzing: "分析中...",
    buy: "买入",
    rank: "排名",
    user: "用户",
    pnl: "盈亏",
    winRate: "胜率",
    earnYield: "赚取 USDC 收益",
    provideLiquidity: "为预测市场提供流动性并赚取交易费用分成。当前年化收益率：",
    yourStaked: "您的质押余额",
    pendingUnstake: "待解押",
    manageStake: "管理质押",
    comingSoon: "敬请期待"
  }
};

export const INITIAL_MARKETS: Market[] = [
  {
    id: '1',
    question: "Will Bitcoin reach $100k before Christmas?",
    description: "Resolves to YES if BTC price on Coinbase is >= $100,000 at 11:59 PM EST on Dec 24, 2025.",
    endDate: "2025-12-24",
    volume: 2540000,
    yesPrice: 0.72,
    noPrice: 0.28,
    imageUrl: "https://picsum.photos/400/400?random=1",
    category: 'Crypto',
    isResolved: false
  },
  {
    id: '2',
    question: "Will Base TVL double before New Year's Eve?",
    description: "Resolves to YES if L2Beat reports Base TVL > $10 Billion on Dec 31, 2025.",
    endDate: "2025-12-31",
    volume: 850000,
    yesPrice: 0.42,
    noPrice: 0.58,
    imageUrl: "https://picsum.photos/400/400?random=2",
    category: 'Crypto',
    isResolved: false
  },
  {
    id: '3',
    question: "Will 'All I Want for Christmas is You' top Billboard again?",
    description: "Resolves to YES if Mariah Carey's song hits #1 on the Hot 100 during Christmas week.",
    endDate: "2025-12-20",
    volume: 3200000,
    yesPrice: 0.95,
    noPrice: 0.05,
    imageUrl: "https://picsum.photos/400/400?random=3",
    category: 'Pop Culture',
    isResolved: false
  },
  {
    id: '4',
    question: "Will it snow in New York on Christmas Day?",
    description: "Resolves based on Central Park weather station data reporting >0.1 inch of snow.",
    endDate: "2025-12-25",
    volume: 120000,
    yesPrice: 0.30,
    noPrice: 0.70,
    imageUrl: "https://picsum.photos/400/400?random=4",
    category: 'Politics',
    isResolved: false
  }
];

export const MOCK_USER = {
  fid: 888,
  username: "crypto_warrior",
  pfpUrl: "https://picsum.photos/100/100?random=99",
  walletAddress: "0xFC...1225",
  points: 100
};

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: "Bitcoin miners hit record profits as difficulty adjusts",
    source: "CoinDesk",
    timeAgo: "2 hours ago",
    sentiment: "bullish"
  },
  {
    id: '2',
    title: "Farcaster introduces new 'Frames' for prediction markets",
    source: "The Block",
    timeAgo: "4 hours ago",
    sentiment: "bullish"
  },
  {
    id: '3',
    title: "Regulatory concerns cloud new stablecoin bill",
    source: "Decrypt",
    timeAgo: "6 hours ago",
    sentiment: "bearish"
  },
  {
    id: '4',
    title: "Base network hits all-time high throughput",
    source: "CoinTelegraph",
    timeAgo: "8 hours ago",
    sentiment: "bullish"
  }
];

// Updated Prices (Ref: CoinGecko/Market Data)
export const COIN_PRICES = [
  { symbol: "BTC", price: 98120.50, change: 1.2 },
  { symbol: "ETH", price: 2745.80, change: -0.8 },
  { symbol: "SOL", price: 242.15, change: 2.4 },
  { symbol: "BNB", price: 658.90, change: 0.5 },
  { symbol: "DEGEN", price: 0.0214, change: 8.5 },  // Base
  { symbol: "BRETT", price: 0.165, change: 4.2 },   // Base
  { symbol: "AERO", price: 1.32, change: -1.5 },    // Base
  { symbol: "VIRTUAL", price: 2.45, change: 15.2 }, // Base AI
  { symbol: "USDC", price: 1.00, change: 0.00 },
];

export const LEADERBOARD_DATA = [
  { rank: 1, user: "whale.eth", pnl: 124500, winRate: 78 },
  { rank: 2, user: "top_trader", pnl: 98200, winRate: 65 },
  { rank: 3, user: "hodl_forever", pnl: 45000, winRate: 55 },
  { rank: 4, user: "degen_king", pnl: 32100, winRate: 62 },
  { rank: 5, user: "base_god", pnl: 28000, winRate: 40 },
];
