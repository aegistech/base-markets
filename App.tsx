import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Market, MarketOutcome, UserProfile, Language } from './types';
import { INITIAL_MARKETS, MOCK_USER, LEADERBOARD_DATA, TRANSLATIONS } from './constants';
import { MarketCard } from './components/MarketCard';
import { TradeModal } from './components/TradeModal';
import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { Button } from './components/Button';
import { Logo } from './components/Logo';
import { LegalFooter } from './components/LegalFooter';
import { CryptoTicker } from './components/CryptoTicker';
import { Sidebar } from './components/Sidebar';
import { Snowfall } from './components/Snowfall';
import { 
  connectWallet, 
  depositFunds, 
  withdrawFunds, 
  buyShares, 
  getWalletUSDCBalance, 
  Web3State 
} from './services/web3Service';

const LeaderboardPage = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white">{t.leaderboard}</h1>
        <p className="text-gray-400">Top predictors on Base.</p>
      </div>
      <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-dark-900/50 border-b border-dark-700">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Rank</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">User</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Profit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700 font-bold">
            {LEADERBOARD_DATA.map(row => (
              <tr key={row.rank} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-5 font-mono text-base-500">#{row.rank}</td>
                <td className="px-6 py-5 text-white">{row.user}</td>
                <td className="px-6 py-5 text-right font-mono text-green-500">+${row.pnl.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const App = () => {
  const [lang, setLang] = useState<Language>('en'); 
  const [user, setUser] = useState<UserProfile | null>(null);
  const [balance, setBalance] = useState(0);
  const [web3State, setWeb3State] = useState<Web3State | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [tradeModalData, setTradeModalData] = useState<{market: Market, outcome: MarketOutcome} | null>(null);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const handleLogin = async () => {
    setIsConnecting(true);
    try {
      const state = await connectWallet();
      if (state) {
        setWeb3State(state);
        setUser({ ...MOCK_USER, walletAddress: state.address });
        const usdcBalance = await getWalletUSDCBalance(state.signer, state.address);
        setBalance(usdcBalance);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsConnecting(false);
    }
  };

  const ensureLogin = async () => {
    if (!web3State) {
      await handleLogin();
      return !!web3State;
    }
    return true;
  };

  const wrapDeposit = async (amount: number, onStatus: (msg: string) => void) => {
    if (!web3State) return;
    const success = await depositFunds(amount, web3State.signer, onStatus);
    if (success) {
      const b = await getWalletUSDCBalance(web3State.signer, web3State.address);
      setBalance(b);
    }
  };

  const wrapWithdraw = async (amount: number) => {
    if (!web3State) return;
    const success = await withdrawFunds(amount, web3State.signer);
    if (success) {
      const b = await getWalletUSDCBalance(web3State.signer, web3State.address);
      setBalance(b);
    }
  };

  const wrapTrade = async (marketId: string, outcome: MarketOutcome, amount: number, onStatus: (msg: string) => void) => {
    if (!web3State) return;
    const success = await buyShares(marketId, outcome, amount, web3State.signer, onStatus);
    if (success) {
      const b = await getWalletUSDCBalance(web3State.signer, web3State.address);
      setBalance(b);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-dark-900 text-white flex flex-col font-sans overflow-x-hidden">
        <Snowfall />
        <CryptoTicker />
        
        <header className="border-b border-dark-700 bg-dark-900/80 backdrop-blur-md sticky top-0 z-40 h-16">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Logo className="w-8 h-8" />
              <span className="font-black text-xl tracking-tighter">BASEMARKETS</span>
            </Link>
            <div className="flex items-center gap-3">
              <button onClick={() => setLang(lang === 'en' ? 'vi' : 'en')} className="p-2 text-[10px] font-black bg-dark-800 rounded-lg border border-dark-600 uppercase">
                {lang}
              </button>
              {user ? (
                <div className="flex items-center gap-2 bg-dark-800 px-3 py-1.5 rounded-full border border-dark-700">
                  <span className="text-xs font-black text-base-400 font-mono">${balance.toFixed(2)}</span>
                  <button className="h-6 w-6 bg-base-500 hover:bg-base-600 text-white rounded-full flex items-center justify-center font-bold text-sm" onClick={() => setShowDeposit(true)}>+</button>
                  <img src={user.pfpUrl} alt="User" className="w-6 h-6 rounded-full border border-white/20" />
                </div>
              ) : (
                <Button variant="farcaster" onClick={handleLogin} disabled={isConnecting} size="sm" className="font-black">
                  {isConnecting ? t.connecting : t.signIn}
                </Button>
              )}
            </div>
          </div>
        </header>

        <div className="flex flex-1 max-w-7xl w-full mx-auto relative z-10">
          <Sidebar 
            onDeposit={async () => (await ensureLogin()) && setShowDeposit(true)} 
            onWithdraw={async () => (await ensureLogin()) && setShowWithdraw(true)} 
            lang={lang} 
          />
          <main className="flex-1 p-4 md:p-8 min-w-0">
            <Routes>
              <Route path="/" element={
                <div className="space-y-12">
                  <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-base-600 to-black p-8 border border-white/10 shadow-2xl">
                    <div className="relative z-20 max-w-xl">
                      <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">{t.heroTitle}</h1>
                      <p className="text-white/70 text-lg mb-8">{t.heroDesc}</p>
                      <Button variant="primary" size="lg" className="!bg-white !text-base-600 font-black">{t.startTrading}</Button>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                      <span className="w-1.5 h-8 bg-base-500 rounded-full"></span>
                      {t.trendingMarkets}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {INITIAL_MARKETS.map(market => (
                        <MarketCard key={market.id} market={market} onTrade={(m, o) => setTradeModalData({ market: m, outcome: o })} lang={lang} />
                      ))}
                    </div>
                  </div>
                </div>
              } />
              <Route path="/leaderboard" element={<LeaderboardPage lang={lang} />} />
              <Route path="/portfolio" element={<div className="p-12 text-center text-gray-500 italic font-bold">Portfolio coming soon...</div>} />
            </Routes>
          </main>
        </div>
        <LegalFooter />

        <TradeModal isOpen={!!tradeModalData} onClose={() => setTradeModalData(null)} market={tradeModalData?.market || null} initialOutcome={tradeModalData?.outcome || MarketOutcome.YES} onTrade={wrapTrade} userBalance={balance} />
        <DepositModal isOpen={showDeposit} onClose={() => setShowDeposit(false)} onDeposit={wrapDeposit} currentBalance={balance} />
        <WithdrawModal isOpen={showWithdraw} onClose={() => setShowWithdraw(false)} onWithdraw={wrapWithdraw} currentBalance={balance} />
      </div>
    </Router>
  );
};

export default App;
