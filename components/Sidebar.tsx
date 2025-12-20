import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';

const NavItem = ({ to, label, icon }: { to: string, label: string, icon: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
        isActive 
          ? 'bg-dark-700/50 text-white border border-dark-600 shadow-sm' 
          : 'text-gray-400 hover:bg-dark-800 hover:text-white'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

interface SidebarProps {
    onDeposit?: () => void;
    onWithdraw?: () => void;
    lang: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({ onDeposit, onWithdraw, lang }) => {
  const t = TRANSLATIONS.en;

  return (
    <div className="w-64 flex-shrink-0 hidden lg:block border-r border-dark-700 bg-dark-900 p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <NavItem to="/" label={t.markets} icon="📊" />
        <NavItem to="/leaderboard" label={t.leaderboard} icon="🏆" />
        <NavItem to="/earn" label={t.earn} icon="💎" />
        <NavItem to="/portfolio" label={t.portfolio} icon="💼" />
        
        <div className="pt-8 mt-8 border-t border-dark-700">
            <h3 className="px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">{t.myWallet}</h3>
            <button 
                onClick={onDeposit}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-green-400 hover:bg-green-500/10 transition-colors"
            >
                <span>💰</span>
                <span>{t.deposit}</span>
            </button>
            <button 
                onClick={onWithdraw}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-dark-800 hover:text-white transition-colors"
            >
                <span>🏦</span>
                <span>{t.withdraw}</span>
            </button>
        </div>
      </div>
    </div>
  );
};
