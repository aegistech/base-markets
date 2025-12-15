import React, { useState, useEffect } from 'react';
import { Market, MarketOutcome } from '../types';
import { Button } from './Button';

interface TradeModalProps {
  market: Market | null;
  initialOutcome: MarketOutcome;
  isOpen: boolean;
  onClose: () => void;
  onTrade: (marketId: string, outcome: MarketOutcome, amount: number) => void;
  userBalance: number;
}

export const TradeModal: React.FC<TradeModalProps> = ({ 
  market, 
  initialOutcome, 
  isOpen, 
  onClose, 
  onTrade,
  userBalance 
}) => {
  const [amount, setAmount] = useState('');
  const [outcome, setOutcome] = useState<MarketOutcome>(initialOutcome);

  useEffect(() => {
    setOutcome(initialOutcome);
    setAmount('');
  }, [initialOutcome, isOpen]);

  if (!isOpen || !market) return null;

  const price = outcome === MarketOutcome.YES ? market.yesPrice : market.noPrice;
  const potentialShares = amount ? parseFloat(amount) / price : 0;
  const potentialReturn = potentialShares * 1; // Each share pays out $1
  const potentialProfit = potentialReturn - (parseFloat(amount) || 0);
  const profitPercent = price > 0 ? ((1 - price) / price) * 100 : 0;

  const handleTrade = () => {
    const val = parseFloat(amount);
    if (!isNaN(val) && val > 0 && val <= userBalance) {
      onTrade(market.id, outcome, val);
      onClose();
    }
  };

  const isInvalid = parseFloat(amount) > userBalance || parseFloat(amount) <= 0 || isNaN(parseFloat(amount));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-md p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-lg font-bold text-white pr-4">{market.question}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {/* Outcome Toggle */}
        <div className="bg-dark-900 p-1 rounded-lg flex mb-6">
          <button 
            onClick={() => setOutcome(MarketOutcome.YES)}
            className={`flex-1 py-2 rounded-md font-medium text-sm transition-all ${outcome === MarketOutcome.YES ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Buy YES (${market.yesPrice})
          </button>
          <button 
            onClick={() => setOutcome(MarketOutcome.NO)}
            className={`flex-1 py-2 rounded-md font-medium text-sm transition-all ${outcome === MarketOutcome.NO ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Buy NO (${market.noPrice})
          </button>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Amount to Invest</span>
            <span>Balance: ${userBalance.toFixed(2)}</span>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg pl-8 pr-4 py-3 text-white focus:border-base-500 focus:outline-none text-lg font-mono"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Calculations */}
        <div className="bg-dark-900/50 rounded-lg p-4 mb-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Est. Shares</span>
            <span className="text-white font-mono">{potentialShares.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Potential Payout</span>
            <span className="text-green-400 font-mono">${potentialReturn.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs border-t border-dark-700 pt-2 mt-2">
            <span className="text-gray-500">Return on Investment</span>
            <span className="text-green-500 font-bold">+{profitPercent.toFixed(0)}%</span>
          </div>
        </div>

        <Button 
          variant={outcome === MarketOutcome.YES ? 'success' : 'danger'} 
          onClick={handleTrade} 
          fullWidth
          disabled={isInvalid}
        >
          {isInvalid && parseFloat(amount) > userBalance ? "Insufficient Balance" : `Confirm Buy ${outcome}`}
        </Button>
      </div>
    </div>
  );
};