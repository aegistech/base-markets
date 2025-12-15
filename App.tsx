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
import { connectWallet, depositFunds, withdrawFunds, stakeFunds, requestUnstakeFunds, completeUnstakeFunds, buyShares, getPendingUnstake, getWalletUSDCBalance, Web3State } from './services/web3Service';

// Mock Farcaster Icon
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

const Header = ({ 
  user, 
  onLogin, 
  onOpenDeposit, 
  onOpenWithdraw,
  balance,
  points,
  isConnecting,
  isDarkMode,
  toggleTheme,
  lang,
  setLang
}: { 
  user: UserProfile | null, 
  onLogin: () => void, 
  onOpenDeposit: () => void,
  onOpenWithdraw: () => void,
  balance: number,
  points: number,
  isConnecting: boolean,
  isDarkMode: boolean,
  toggleTheme: () => void,
  lang: 'en' | 'zh',
  setLang: (l: 'en' | 'zh') => void
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <header className="border-b border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900 sticky top-0 z-40 transition-colors duration-300">
      <div className="w-full px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold tracking-tight text-dark-900 dark:text-white flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Logo className="w-8 h-8" />
            <span className="hidden sm:inline font-sans">BaseMarkets</span>
          </Link>
          
          {/* Search Bar */}
          <div className="hidden md:flex relative ml-4">
             <input 
               type="text" 
               placeholder={t.searchPlaceholder}
               className="bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-sm rounded-full pl-10 pr-4 py-2 text-gray-800 dark:text-gray-300 w-64 focus:outline-none focus:border-base-500 focus:ring-1 focus:ring-base-500 transition-colors"
             />
             <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="relative">
            <select 
              value={lang}
              onChange={(e) => setLang(e.target.value as 'en' | 'zh')}
              className="appearance-none bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 text-xs font-medium py-1.5 pl-3 pr-8 rounded-lg focus:outline-none border border-transparent focus:border-base-500 cursor-pointer"
            >
              <option value="en">🇺🇸 English</option>
              <option value="zh">🇨🇳 中文</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <button 
            onClick={toggleTheme}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
               <div className="hidden sm:flex flex-col items-end mr-2">
                 <span className="text-xs text-gray-500 dark:text-gray-400">{t.balance}</span>
                 <span className="text-sm font-mono font-bold text-gray-900 dark:text-white">${balance.toFixed(2)}</span>
               </div>
               
               <div className="flex items-center gap-2">
                 <Button size="sm" variant="success" onClick={onOpenDeposit}>+</Button>
                 <Button size="sm" variant="secondary" onClick={onOpenWithdraw}>-</Button>
               </div>

               <div className="h-8 w-[1px] bg-gray-200 dark:bg-dark-700 mx-2"></div>

               <div className="flex items-center gap-2">
                 <img src={user.pfpUrl} alt={user.username} className="w-8 h-8 rounded-full border border-gray-200 dark:border-dark-600" />
                 <div className="hidden sm:block">
                   <div className="text-sm font-bold text-gray-900 dark:text-white leading-none">@{user.username}</div>
                   <div className="text-xs text-holiday-gold font-medium">{user.points} pts</div>
                 </div>
               </div>
            </div>
          ) : (
            <Button variant="farcaster" onClick={onLogin} disabled={isConnecting}>
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
  const [lang, setLang] = useState<'en' | 'zh'>('en'); // Language State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [markets, setMarkets] = useState<Market[]>(INITIAL_MARKETS);
  const [balance, setBalance] = useState(0);
  
  // Web3 State
  const [web3State, setWeb3State] = useState<Web3State | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Staking State
  const [stakedBalance, setStakedBalance] = useState(0);
  const [pendingUnstake, setPendingUnstake] = useState({ amount: 0, unlockTime: 0 });

  // Modals
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showStake, setShowStake] = useState(false);
  const [tradeModalData, setTradeModalData] = useState<{market: Market, outcome: MarketOutcome} | null>(null);

  const t = TRANSLATIONS[lang]; // Current translations

  // Theme Toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Wallet Connection
  const handleLogin = async () => {
    setIsConnecting(true);
    const state = await connectWallet();
    if (state) {
      setWeb3State(state);
      // For demo, we also set the mock user profile
      setUser({
        ...MOCK_USER,
        walletAddress: state.address
      });
      
      // FETCH REAL BALANCE FROM WALLET (USDC)
      const usdcBalance = await getWalletUSDCBalance(state.signer, state.address);
      setBalance(usdcBalance);
      
      // Fetch Staking Info
      const pending = await getPendingUnstake(state.signer);
      setPendingUnstake(pending);
    }
    setIsConnecting(false);
  };

  // Actions
  const handleDeposit = async (amount: number, onStatus: (msg: string) => void) => {
    if (!web3State) return;
    const success = await depositFunds(amount, web3State.signer, onStatus);
    if (success) {
      // Refresh wallet balance after deposit
      const usdcBalance = await getWalletUSDCBalance(web3State.signer, web3State.address);
      setBalance(usdcBalance); 
    }
  };

  const handleWithdraw = async (amount: number) => {
    if (!web3State) return;
    const success = await withdrawFunds(amount, web3State.signer);
    if (success) {
      // Refresh wallet balance after withdraw
      const usdcBalance = await getWalletUSDCBalance(web3State.signer, web3State.address);
      setBalance(usdcBalance);
    }
  };

  const handleTrade = async (marketId: string, outcome: MarketOutcome, amount: number, onStatus: (msg: string) => void) => {
    if (!web3State) {
        alert("Please connect wallet first");
        return;
    }
    const success = await buyShares(marketId, outcome, amount, web3State.signer, onStatus);
    if (success) {
        // Refresh wallet balance
        const usdcBalance = await getWalletUSDCBalance(web3State.signer, web3State.address);
        setBalance(usdcBalance);
    }
  };

  const handleStake = async (amount: number, onStatus: (msg: string) => void) => {
      if (!web3State) return;
      const success = await stakeFunds(amount, web3State.signer, onStatus);
      if (success) {
          const usdcBalance = await getWalletUSDCBalance(web3State.signer, web3State.address);
          setBalance(usdcBalance);
          setStakedBalance(prev => prev + amount);
      }
  };

  const handleRequestUnstake = async (amount: number) => {
      if (!web3State) return;
      const success = await requestUnstakeFunds(amount, web3State.signer);
      if (success) {
          setStakedBalance(prev => prev - amount);
          // Fetch pending info again or update optimistically
          const pending = await getPendingUnstake(web3State.signer);
          setPendingUnstake(pending);
      }
  };

  const handleCompleteUnstake = async () => {
      if (!web3State) return;
      const success = await completeUnstakeFunds(web3State.signer);
      if (success) {
          // Funds return to wallet, update balance
          const usdcBalance = await getWalletUSDCBalance(web3State.signer, web3State.address);
          setBalance(usdcBalance);
          setPendingUnstake({ amount: 0, unlockTime: 0 });
      }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-300">
        <CryptoTicker />
        
        <Header 
          user={user} 
          onLogin={handleLogin} 
          onOpenDeposit={() => setShowDeposit(true)}
          onOpenWithdraw={() => setShowWithdraw(true)}
          balance={balance}
          points={user?.points || 0}
          isConnecting={isConnecting}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          lang={lang}
          setLang={setLang}
        />

        <div className="flex flex-1 max-w-7xl w-full mx-auto">
          <Sidebar 
             onDeposit={() => setShowDeposit(true)}
             onWithdraw={() => setShowWithdraw(true)}
             lang={lang}
          />

          <main className="flex-1 p-4 md:p-6 min-w-0 overflow-y-auto">
            <Routes>
              {/* Markets Dashboard */}
              <Route path="/" element={
                <div className="space-y-6">
                  {/* Hero / Banner Area - Updated for better color balance */}
                  <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-indigo-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden flex items-center min-h-[280px]">
                    <div className="relative z-10 max-w-2xl">
                      <h1 className="text-4xl font-extrabold mb-4 leading-tight tracking-tight drop-shadow-sm">{t.heroTitle}</h1>
                      <p className="text-blue-100 text-lg mb-8 max-w-lg leading-relaxed">{t.heroDesc}</p>
                      <Button variant="primary" className="bg-white text-blue-700 hover:bg-blue-50 border-none px-8 py-3 text-base font-bold shadow-lg shadow-blue-900/30 transform transition-all hover:-translate-y-0.5">
                        {t.startTrading}
                      </Button>
                    </div>
                    {/* Decorative background elements */}
                    <div className="absolute inset-0 z-0">
                         <div className="absolute right-0 top-0 h-full w-2/3 bg-[url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] opacity-30 bg-cover bg-center" style={{ maskImage: 'linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0))', WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0))' }}></div>
                         <div className="absolute -right-20 -bottom-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                         <div className="absolute -left-20 -top-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    </div>
                  </div>

                  {/* Market Grid */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                       <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.trendingMarkets}</h2>
                       <div className="flex gap-2">
                         <select className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg text-sm px-3 py-1.5 focus:outline-none focus:border-base-500">
                           <option>{t.topVolume}</option>
                           <option>{t.newest}</option>
                           <option>{t.endingSoon}</option>
                         </select>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                      {markets.map(market => (
                        <MarketCard 
                          key={market.id} 
                          market={market} 
                          onTrade={(m, o) => setTradeModalData({ market: m, outcome: o })}
                          lang={lang}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              } />

              {/* Leaderboard Route */}
              <Route path="/leaderboard" element={
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t.leaderboard}</h2>
                  <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 dark:bg-dark-900 border-b border-gray-200 dark:border-dark-700">
                        <tr>
                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.rank}</th>
                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.user}</th>
                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">{t.pnl}</th>
                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">{t.winRate}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
                        {LEADERBOARD_DATA.map((entry) => (
                          <tr key={entry.rank} className="hover:bg-gray-50 dark:hover:bg-dark-700/50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`
                                flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                                ${entry.rank === 1 ? 'bg-yellow-500 text-white' : 
                                  entry.rank === 2 ? 'bg-gray-400 text-white' :
                                  entry.rank === 3 ? 'bg-amber-600 text-white' : 'text-gray-500'}
                              `}>
                                {entry.rank}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{entry.user}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-green-500 font-mono">+${entry.pnl.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">{entry.winRate}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              } />

              {/* Earn/Staking Route */}
              <Route path="/earn" element={
                 <div className="max-w-2xl mx-auto text-center py-12">
                   <div className="inline-block p-4 rounded-full bg-base-500/10 mb-4">
                     <span className="text-4xl">🏦</span>
                   </div>
                   <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{t.earnYield}</h2>
                   <p className="text-gray-500 mb-8 max-w-md mx-auto">
                     {t.provideLiquidity} <span className="text-green-500 font-bold">12.5%</span>
                   </p>
                   
                   <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
                     <div className="bg-white dark:bg-dark-800 p-4 rounded-xl border border-gray-200 dark:border-dark-700">
                        <div className="text-xs text-gray-500 mb-1">{t.yourStaked}</div>
                        <div className="text-2xl font-bold font-mono">${stakedBalance.toFixed(2)}</div>
                     </div>
                     <div className="bg-white dark:bg-dark-800 p-4 rounded-xl border border-gray-200 dark:border-dark-700">
                        <div className="text-xs text-gray-500 mb-1">{t.pendingUnstake}</div>
                        <div className="text-2xl font-bold font-mono">${pendingUnstake.amount.toFixed(2)}</div>
                     </div>
                   </div>

                   <Button size="lg" onClick={() => setShowStake(true)}>
                     {t.manageStake}
                   </Button>
                 </div>
              } />

              {/* News Route */}
              <Route path="/news" element={
                <div className="max-w-3xl mx-auto">
                    <NewsFeed news={MOCK_NEWS} />
                </div>
              } />
              
              {/* Other Routes Placeholders */}
              <Route path="*" element={<div className="p-12 text-center text-gray-500">{t.comingSoon}</div>} />

            </Routes>
          </main>
        </div>

        <LegalFooter />

        {/* Modals */}
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
        
        <WithdrawModal 
          isOpen={showWithdraw} 
          onClose={() => setShowWithdraw(false)} 
          onWithdraw={handleWithdraw} 
          currentBalance={balance} 
        />

        <StakeModal 
          isOpen={showStake}
          onClose={() => setShowStake(false)}
          onStake={handleStake}
          onRequestUnstake={handleRequestUnstake}
          onCompleteUnstake={handleCompleteUnstake}
          stakedBalance={stakedBalance}
          walletBalance={balance}
          pendingUnstakeAmount={pendingUnstake.amount}
          pendingUnlockTime={pendingUnstake.unlockTime}
        />

      </div>
    </Router>
  );
};

export default App;
