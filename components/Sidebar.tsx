import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavItem = ({ to, label, icon }: { to: string, label: string, icon: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-dark-700/50 text-white border border-dark-600' 
          : 'text-gray-400 hover:bg-dark-800 hover:text-white'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

interface SidebarProps {
    onDeposit?: () => void;
    onWithdraw?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onDeposit, onWithdraw }) => {
  return (
    <div className="w-64 flex-shrink-0 hidden lg:block border-r border-dark-700 bg-dark-900 p-4 min-h-[calc(100vh-8rem)]">
      <div className="space-y-1">
        <NavItem 
          to="/" 
          label="Markets" 
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} 
        />
        <NavItem 
          to="/leaderboard" 
          label="Leaderboard" 
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} 
        />
        <NavItem 
          to="/earn" 
          label="Earn" 
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
        />
        <NavItem 
          to="/portfolio" 
          label="Portfolio" 
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>} 
        />
        <NavItem 
          to="/points" 
          label="Points" 
          icon={<svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>} 
        />
        
        {/* Funds Management Section */}
        <div className="pt-4 mt-4 border-t border-dark-700">
            <h3 className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">My Wallet</h3>
            <button 
                onClick={onDeposit}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-green-400 hover:bg-dark-800 transition-colors"
            >
                <span className="text-lg">💰</span>
                <span>Deposit Funds</span>
            </button>
            <button 
                onClick={onWithdraw}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-dark-800 hover:text-white transition-colors"
            >
                <span className="text-lg">🏦</span>
                <span>Withdraw</span>
            </button>
        </div>

        <div className="pt-4 mt-4 border-t border-dark-700">
           <NavItem 
            to="/news" 
            label="News" 
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>} 
          />
        </div>
      </div>
    </div>
  );
};