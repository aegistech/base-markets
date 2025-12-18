import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Market, MarketOutcome, UserProfile } from './types';
import { INITIAL_MARKETS, MOCK_USER, MOCK_NEWS, LEADERBOARD_DATA, TRANSLATIONS } from './constants';
import { MarketCard } from './components/MarketCard';
import { TradeModal } from './components/TradeModal';
import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { StakeModal } from './components/StakeModal';
import { Button } from './components/Button';
import { Logo } from './components/Logo';
import { NewsFeed } from './components/NewsFeed';
import { LegalFooter } from './components/LegalFooter';
import { CryptoTicker } from './components/CryptoTicker';
import { Sidebar } from './components/Sidebar';
import { Snowfall } from './components/Snowfall';
import { connectWallet, depositFunds, withdrawFunds, stakeFunds, requestUnstakeFunds, completeUnstakeFunds, buyShares, getPendingUnstake, getWalletUSDCBalance, Web3State } from './services/web3Service';

const FarcasterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="mr-2">
    <path d="M15.8333 10.8333H4.16667V9.16667H15.8333V10.8333ZM15.8333 5.83333H4.16667V4.16667H15.8333V5.83333ZM10.8333 15.8333H4.16667V14.1667H10.8333V15.8333Z" fill="white"/>
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

const Header = ({ user, onLogin, onOpenDeposit, onOpenWithdraw, balance, points, isConnecting, isDarkMode, toggleTheme, lang, setLang }: any) => {
  const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS];

  return (
    <header className="border-b border-gray-200 dark:border-dark-700 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md sticky top-0 z-40 transition-colors duration-300">
      <div className="w-full px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold tracking-tight text-dark-900 dark:text-white flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Logo className="w-8 h-8" />
            <span className="hidden sm:inline font-sans">BaseMarkets</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors">
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2 bg-gray-100 dark:bg-dark-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-dark-700">
                 <span className="text-sm font-mono font-bold text-base-500">${balance.toFixed(2)}</span>
                 <Button size="sm" variant="primary" className="h-6 w-6 !p-0 rounded-full" onClick={onOpenDeposit}>+</Button>
               </div>
               <img src={user.pfpUrl} alt={user.username} className="w-8 h-8 rounded-full border-2 border-base-500" />
            </div>
          ) : (
            <Button variant="farcaster" onClick={onLogin} disabled={isConnecting} size="sm">
              {isConnecting ? t.connecting : <><FarcasterIcon /> {t.signIn}</>}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [lang, setLang] = useState<'en' | 'zh'>('en');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [markets, setMarkets] = useState<Market[]>(INITIAL_MARKETS);
  const [balance, setBalance] = useState(0);
  const [web3State, setWeb3State] = useState<Web3State | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [pendingUnstake, setPendingUnstake] = useState({ amount: 0, unlockTime: 0 });
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showStake, setShowStake] = useState(false);
  const [tradeModalData, setTradeModalData] = useState<{market: Market, outcome: MarketOutcome} | null>(null);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const handleLogin = async () => {
    setIsConnecting(true);
    const state = await connectWallet();
    if (state) {
      setWeb3State(state);
      setUser({ ...MOCK_USER, walletAddress: state.address });
      const usdcBalance = await getWalletUSDCBalance(state.signer, state.address);
      setBalance(usdcBalance);
    }
    setIsConnecting(false);
  };

  const handleDeposit = async (amount: number, onStatus: (msg: string) => void) => {
    if (!web3State) return;
    const success = await depositFunds(amount, web3State.signer, onStatus);
    if (success) {
      const usdcBalance = await getWalletUSDCBalance(web3State.signer, web3State.address);
      setBalance(usdcBalance); 
    }
  };

  const handleTrade = async (marketId: string, outcome: MarketOutcome, amount: number, onStatus: (msg: string) => void) => {
    if (!web3State) return;
    const success = await buyShares(marketId, outcome, amount, web3State.signer, onStatus);
    if (success) {
        const usdcBalance = await getWalletUSDCBalance(web3State.signer, web3State.address);
        setBalance(usdcBalance);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-300 relative">
        <Snowfall />
        <CryptoTicker />
        
        <Header 
          user={user} onLogin={handleLogin} 
          onOpenDeposit={() => setShowDeposit(true)}
          onOpenWithdraw={() => setShowWithdraw(true)}
          balance={balance} isConnecting={isConnecting}
          isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)}
          lang={lang} setLang={setLang}
        />

        <div className="flex flex-1 max-w-7xl w-full mx-auto relative z-10">
          <Sidebar onDeposit={() => setShowDeposit(true)} onWithdraw={() => setShowWithdraw(true)} lang={lang} />

          <main className="flex-1 p-4 md:p-6 min-w-0 overflow-y-auto">
            <Routes>
              <Route path="/" element={
                <div className="space-y-8">
                  {/* Hero Section Re-designed */}
                  <div className="relative group rounded-3xl overflow-hidden bg-gradient-to-br from-base-600 via-base-900 to-black p-8 md:p-12 shadow-2xl border border-white/10">
                    <div className="relative z-20 max-w-xl">
                      <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-base-100 mb-6 border border-white/20 animate-pulse">
                        LIVE ON BASE NETWORK
                      </div>
                      <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight text-white tracking-tight drop-shadow-lg">
                        {t.heroTitle}
                      </h1>
                      <p className="text-base-100/80 text-lg mb-8 leading-relaxed font-medium">
                        {t.heroDesc}
                      </p>
                      
                      <div className="flex flex-wrap gap-4">
                        <Button 
                          variant="primary" 
                          size="lg"
                          className="!bg-white !text-base-600 hover:!bg-base-50 !border-none !rounded-2xl px-10 py-4 text-lg font-black shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105 active:scale-95"
                        >
                          {t.startTrading}
                        </Button>
                        <div className="flex -space-x-3 items-center">
                          {[1,2,3,4].map(i => (
                            <img key={i} src={`https://picsum.photos/32/32?random=${i+10}`} className="w-10 h-10 rounded-full border-2 border-base-900 shadow-lg" alt="User" />
                          ))}
                          <span className="ml-4 text-sm font-bold text-white/60">+12.4k trading</span>
                        </div>
                      </div>
                    </div>

                    {/* Background Visuals - Non-Earth focused */}
                    <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-40">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-base-500/20 rounded-full blur-[120px] animate-blob"></div>
                      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-base-500/10 to-transparent"></div>
                      <div className="absolute right-12 top-12 flex flex-col gap-4">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-48 h-12 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 animate-pulse" style={{ animationDelay: `${i * 0.5}s` }}></div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Market Grid */}
                  <div>
                    <div className="flex justify-between items-end mb-6">
                       <div>
                         <h2 className="text-2xl font-black text-gray-900 dark:text-white">{t.trendingMarkets}</h2>
                         <p className="text-sm text-gray-500">Real-time sentiment from Farcaster users</p>
                       </div>
                       <Link to="/markets" className="text-sm font-bold text-base-500 hover:underline">View All →</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {markets.map(market => (
                        <MarketCard 
                          key={market.id} market={market} 
                          onTrade={(m, o) => setTradeModalData({ market: m, outcome: o })}
                          lang={lang}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              } />
              
              <Route path="/leaderboard" element={<div className="p-12 text-center text-gray-500">Leaderboard Loading...</div>} />
              <Route path="/earn" element={<div className="p-12 text-center text-gray-500">Earn Module Loading...</div>} />
            </Routes>
          </main>
        </div>

        <LegalFooter />

        <TradeModal 
          isOpen={!!tradeModalData}
          onClose={() => setTradeModalData(null)}
          market={tradeModalData?.market || null}
          initialOutcome={tradeModalData?.outcome || MarketOutcome.YES}
          onTrade={handleTrade}
          userBalance={balance}
        />
        
        <DepositModal 
          isOpen={showDeposit} 
          onClose={() => setShowDeposit(false)} 
          onDeposit={handleDeposit} 
          currentBalance={balance} 
        />
      </div>
    </Router>
  );
};

export default App;
