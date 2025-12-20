
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Market, MarketOutcome, UserProfile } from './types';
import { INITIAL_MARKETS, MOCK_USER, LEADERBOARD_DATA, TRANSLATIONS } from './constants';
import { MarketCard } from './components/MarketCard';
import { TradeModal } from './components/TradeModal';
import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { StakeModal } from './components/StakeModal';
import { Button } from './components/Button';
import { Logo } from './components/Logo';
import { LegalFooter } from './components/LegalFooter';
import { CryptoTicker } from './components/CryptoTicker';
import { Sidebar } from './components/Sidebar';
import { Snowfall } from './components/Snowfall';
import { connectWallet, depositFunds, withdrawFunds, stakeFunds, requestUnstakeFunds, completeUnstakeFunds, buyShares, getPendingUnstake, getWalletUSDCBalance, Web3State } from './services/web3Service';

declare global {
  interface Window {
    farcaster?: {
      sdk?: {
        actions: {
          ready: () => void;
          openUrl: (url: string) => void;
        };
      };
    };
  }
}

// --- Icons ---
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591 1.591M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

// --- Pages ---

const LeaderboardPage = ({ lang }: { lang: 'en' }) => {
  const t = TRANSLATIONS.en;
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white">{t.leaderboard}</h1>
        <p className="text-gray-400">Top predictors on the Base ecosystem.</p>
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-2xl border border-gray-200 dark:border-dark-700 overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-dark-900/50 border-b border-gray-200 dark:border-dark-700">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">PnL</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Win Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
            {LEADERBOARD_DATA.map((row) => (
              <tr key={row.rank} className="hover:bg-gray-50 dark:hover:bg-dark-700/30 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-base-500">#{row.rank}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-base-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                      {row.user.slice(0, 2)}
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">{row.user}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-mono text-green-500 font-bold">+${row.pnl.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">
                   <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                        <div className="h-full bg-base-500" style={{ width: `${row.winRate}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{row.winRate}%</span>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EarnPage = ({ onOpenStake, stakedBalance, poolTotal, lang }: any) => {
  const t = TRANSLATIONS.en;
  
  // Real-time projected rewards (12.5% APY / 365 / 24 / 60 / 60)
  const [sessionRewards, setSessionRewards] = useState(0);

  useEffect(() => {
    if (stakedBalance <= 0) return;
    const interval = setInterval(() => {
      const rewardPerSec = (stakedBalance * 0.125) / (365 * 24 * 60 * 60);
      setSessionRewards(prev => prev + rewardPerSec);
    }, 1000);
    return () => clearInterval(interval);
  }, [stakedBalance]);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white">{t.earn}</h1>
        <p className="text-gray-400">Provide liquidity to the prediction markets and earn protocol fees.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-base-900 to-black border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold border border-green-500/30 mb-2 inline-block uppercase tracking-wider">{t.stakingStatus}</span>
                <h2 className="text-2xl font-bold text-white">USDC Liquidity Pool</h2>
              </div>
              <div className="text-right">
                <div className="text-gray-400 text-xs uppercase font-bold tracking-widest">APY</div>
                <div className="text-4xl font-black text-green-400">{t.stakingApy}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/5">
                <div className="text-xs text-gray-400 mb-1">{t.poolTvl}</div>
                <div className="text-xl font-bold text-white font-mono">${poolTotal.toLocaleString()}</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/5">
                <div className="text-xs text-gray-400 mb-1">Lock Period</div>
                <div className="text-xl font-bold text-white">3 Days</div>
              </div>
            </div>
          </div>
          {/* Visual Decor */}
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-base-500/20 blur-[60px] rounded-full"></div>
        </div>

        <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
           <div>
             <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold mb-6 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-base-500 animate-pulse"></span>
               {t.yourStake}
             </h3>
             <div className="mb-8">
               <div className="text-4xl font-black text-gray-900 dark:text-white font-mono">${stakedBalance.toFixed(2)}</div>
               <div className="text-xs text-gray-500 mt-1">Total Staked USDC</div>
             </div>
             
             <div className="space-y-3 mb-8">
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">{t.accumulatedRewards}</span>
                 <span className="font-bold text-green-500 font-mono">+${sessionRewards.toFixed(6)}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Shared Protocol Fees</span>
                 <span className="font-bold text-white">0.3%</span>
               </div>
             </div>
           </div>

           <div className="space-y-3">
             <Button variant="primary" fullWidth size="lg" onClick={onOpenStake}>{t.manageStaking}</Button>
             <Button variant="outline" fullWidth disabled={sessionRewards <= 0} onClick={() => alert("Rewards claimed!")}>{t.claimRewards}</Button>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [lang] = useState<'en'>('en'); // Forced English
  const [user, setUser] = useState<UserProfile | null>(null);
  const [markets] = useState<Market[]>(INITIAL_MARKETS);
  const [balance, setBalance] = useState(0);
  const [stakedBalance, setStakedBalance] = useState(0);
  
  // Simulation: Global Pool starts at $300k
  const [poolBaseTVL, setPoolBaseTVL] = useState(300000);
  
  const [web3State, setWeb3State] = useState<Web3State | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showStake, setShowStake] = useState(false);
  const [pendingUnstake, setPendingUnstake] = useState({ amount: 0, unlockTime: 0 });
  const [tradeModalData, setTradeModalData] = useState<{market: Market, outcome: MarketOutcome} | null>(null);

  const t = TRANSLATIONS.en;

  useEffect(() => {
    const initFarcaster = async () => {
      if (window.farcaster?.sdk) {
        window.farcaster.sdk.actions.ready();
      }
    };
    initFarcaster();
  }, []);

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
      
      const unstakeInfo = await getPendingUnstake(state.signer);
      setPendingUnstake(unstakeInfo);
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

  // Cumulative Staking Logic
  const handleStake = async (amount: number, onStatus: (msg: string) => void) => {
      if (!web3State) return;
      const success = await stakeFunds(amount, web3State.signer, onStatus);
      if (success) {
          setStakedBalance(prev => prev + amount);
          setPoolBaseTVL(prev => prev + amount); // Add to the global simulation pool
          const usdcBalance = await getWalletUSDCBalance(web3State.signer, web3State.address);
          setBalance(usdcBalance);
      }
  };

  const handleWithdraw = async (amount: number) => {
    if (!web3State) return;
    const success = await withdrawFunds(amount, web3State.signer);
    if (success) {
      const usdcBalance = await getWalletUSDCBalance(web3State.signer, web3State.address);
      setBalance(usdcBalance);
    }
  };

  const handleCompleteUnstake = async () => {
    if (!web3State) return;
    const success = await completeUnstakeFunds(web3State.signer);
    if (success) {
      const usdcBalance = await getWalletUSDCBalance(web3State.signer, web3State.address);
      setBalance(usdcBalance);
      const unstakeInfo = await getPendingUnstake(web3State.signer);
      setPendingUnstake(unstakeInfo);
    }
  };

  const handleRequestUnstake = async (amount: number) => {
    if (!web3State) return;
    const success = await requestUnstakeFunds(amount, web3State.signer);
    if (success) {
      setStakedBalance(prev => Math.max(0, prev - amount));
      setPoolBaseTVL(prev => Math.max(300000, prev - amount));
      const unstakeInfo = await getPendingUnstake(web3State.signer);
      setPendingUnstake(unstakeInfo);
    }
  };

  const handleBuyShares = async (marketId: string, outcome: MarketOutcome, amount: number, onStatus: (msg: string) => void) => {
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
          balance={balance} isConnecting={isConnecting}
          isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)}
        />

        <div className="flex flex-1 max-w-7xl w-full mx-auto relative z-10">
          <Sidebar onDeposit={() => setShowDeposit(true)} onWithdraw={() => setShowWithdraw(true)} lang={lang} />

          <main className="flex-1 p-4 md:p-6 min-w-0 overflow-y-auto pb-24 lg:pb-6">
            <Routes>
              <Route path="/" element={
                <div className="space-y-8 animate-fadeIn">
                  {/* Hero Section */}
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
                      <Button variant="primary" size="lg" className="!bg-white !text-base-600 !rounded-2xl px-10 py-4 font-black">
                        {t.startTrading}
                      </Button>
                    </div>
                  </div>

                  <div id="market-grid">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">{t.trendingMarkets}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {markets.map(market => (
                        <MarketCard key={market.id} market={market} onTrade={(m, o) => setTradeModalData({ market: m, outcome: o })} lang={lang} />
                      ))}
                    </div>
                  </div>
                </div>
              } />

              <Route path="/leaderboard" element={<LeaderboardPage lang={lang} />} />
              <Route path="/earn" element={
                <EarnPage 
                  lang={lang} 
                  onOpenStake={() => setShowStake(true)} 
                  stakedBalance={stakedBalance} 
                  poolTotal={poolBaseTVL}
                />
              } />
              <Route path="/portfolio" element={<div className="p-12 text-center text-gray-500">Portfolio view coming soon...</div>} />
            </Routes>
          </main>
        </div>

        <LegalFooter />

        {/* Modals */}
        <TradeModal isOpen={!!tradeModalData} onClose={() => setTradeModalData(null)} market={tradeModalData?.market || null} initialOutcome={tradeModalData?.outcome || MarketOutcome.YES} onTrade={handleBuyShares} userBalance={balance} />
        <DepositModal isOpen={showDeposit} onClose={() => setShowDeposit(false)} onDeposit={handleDeposit} currentBalance={balance} />
        <WithdrawModal isOpen={showWithdraw} onClose={() => setShowWithdraw(false)} onWithdraw={handleWithdraw} currentBalance={balance} />
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

const Header = ({ user, onLogin, onOpenDeposit, balance, isConnecting, isDarkMode, toggleTheme }: any) => (
  <header className="border-b border-gray-200 dark:border-dark-700 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md sticky top-0 z-40 transition-colors duration-300">
    <div className="w-full px-4 h-16 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <Logo className="w-8 h-8" />
        <span className="hidden sm:inline font-black text-xl text-white">BaseMarkets</span>
      </Link>
      <div className="flex items-center gap-3">
        <button onClick={toggleTheme} className="p-2 text-gray-400 hover:bg-dark-800 rounded-lg transition-colors">
          {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </button>
        {user ? (
          <div className="flex items-center gap-3 bg-dark-800 px-3 py-1.5 rounded-full border border-dark-700">
            <span className="text-sm font-bold text-base-500">${balance.toFixed(2)}</span>
            <Button size="sm" variant="primary" className="h-6 w-6 !p-0 rounded-full" onClick={onOpenDeposit}>+</Button>
            <img src={user.pfpUrl} alt="User" className="w-6 h-6 rounded-full" />
          </div>
        ) : (
          <Button variant="farcaster" onClick={onLogin} disabled={isConnecting} size="sm">
            {isConnecting ? "Connecting..." : "Sign In"}
          </Button>
        )}
      </div>
    </div>
  </header>
);

export default App;
