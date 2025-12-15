import { Market, NewsItem } from './types';

export const INITIAL_MARKETS: Market[] = [
  {
    id: '1',
    question: "Bitcoin có đạt $100k trước Giáng sinh không?",
    description: "Giải quyết là CÓ nếu giá BTC trên Coinbase >= $100,000 vào lúc 11:59 PM EST ngày 24/12/2025.",
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
    question: "TVL của Base có nhân đôi trước Giao thừa không?",
    description: "Giải quyết là CÓ nếu L2Beat báo cáo TVL của Base > $10 tỷ vào ngày 31/12/2025.",
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
    question: "'All I Want for Christmas is You' có đứng đầu Billboard lần nữa không?",
    description: "Giải quyết là CÓ nếu bài hát của Mariah Carey đứng số 1 Hot 100 trong tuần lễ Giáng sinh.",
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
    question: "Có tuyết rơi ở New York vào ngày Giáng sinh không?",
    description: "Giải quyết dựa trên dữ liệu trạm thời tiết Central Park báo cáo >0.1 inch tuyết.",
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
  username: "nguoi_choi_he_chien",
  pfpUrl: "https://picsum.photos/100/100?random=99",
  walletAddress: "0xFC...1225",
  points: 100
};

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: "Thợ đào Bitcoin đạt lợi nhuận kỷ lục khi độ khó điều chỉnh",
    source: "CoinDesk",
    timeAgo: "2 giờ trước",
    sentiment: "bullish"
  },
  {
    id: '2',
    title: "Farcaster giới thiệu 'Frames' mới cho thị trường dự đoán",
    source: "The Block",
    timeAgo: "4 giờ trước",
    sentiment: "bullish"
  },
  {
    id: '3',
    title: "Lo ngại pháp lý bao trùm dự luật stablecoin mới",
    source: "Decrypt",
    timeAgo: "6 giờ trước",
    sentiment: "bearish"
  },
  {
    id: '4',
    title: "Mạng lưới Base đạt thông lượng cao nhất mọi thời đại",
    source: "CoinTelegraph",
    timeAgo: "8 giờ trước",
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
  { rank: 1, user: "ca_map.eth", pnl: 124500, winRate: 78 },
  { rank: 2, user: "trader_nhat", pnl: 98200, winRate: 65 },
  { rank: 3, user: "hodl_to_die", pnl: 45000, winRate: 55 },
  { rank: 4, user: "ba_ban_ca", pnl: 32100, winRate: 62 },
  { rank: 5, user: "basegod_vn", pnl: 28000, winRate: 40 },
];