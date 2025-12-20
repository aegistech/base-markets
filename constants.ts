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
    portfolio: "Portfolio",
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
    buy: "Buy"
  },
  vi: {
    searchPlaceholder: "Tìm kiếm thị trường...",
    balance: "Số dư",
    deposit: "Nạp tiền",
    withdraw: "Rút tiền",
    signIn: "Đăng nhập",
    connecting: "Đang kết nối...",
    markets: "Thị trường",
    leaderboard: "Bảng xếp hạng",
    portfolio: "Danh mục",
    myWallet: "Ví của tôi",
    heroTitle: "Dự đoán tương lai. Nhận USDC.",
    heroDesc: "Thị trường dự đoán phi tập trung hàng đầu trên Base. Nhanh chóng, an toàn và thanh khoản cao.",
    startTrading: "Bắt đầu giao dịch",
    trendingMarkets: "Thị trường nổi bật",
    vol: "Khối lượng",
    ends: "Kết thúc",
    aiInsight: "Phân tích AI",
    askGemini: "Hỏi AI Analyst",
    analyzing: "Đang phân tích...",
    buy: "Mua"
  }
};

export const INITIAL_MARKETS: Market[] = [
  {
    id: '1',
    question: "BTC to reach $120k before Q3 2025?",
    description: "Resolves to YES if BTC hits $120,000 on Coinbase.",
    endDate: "2025-07-01",
    volume: 3240000,
    yesPrice: 0.65,
    imageUrl: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    category: 'Crypto',
    isResolved: false
  },
  {
    id: '2',
    question: "Base to reach $20B TVL by year end?",
    description: "Based on L2Beat data on 2025-12-31.",
    endDate: "2025-12-31",
    volume: 1250000,
    yesPrice: 0.48,
    imageUrl: "https://avatars.githubusercontent.com/u/108554348?s=200&v=4",
    category: 'Crypto',
    isResolved: false
  }
];

export const LEADERBOARD_DATA = [
  { rank: 1, user: "vitalik.eth", pnl: 450000 },
  { rank: 2, user: "base_whale", pnl: 280200 },
  { rank: 3, user: "degen_king", pnl: 145000 },
];

export const MOCK_USER = {
  fid: 888,
  username: "base_trader",
  pfpUrl: "https://picsum.photos/100/100?random=99",
  walletAddress: "0xFC...1225",
  points: 2500
};

export const COIN_PRICES = [
  { symbol: "BTC", price: 98120.50, change: 1.2 },
  { symbol: "ETH", price: 2745.80, change: -0.8 },
  { symbol: "USDC", price: 1.00, change: 0.00 },
];
