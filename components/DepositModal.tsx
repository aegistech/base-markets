import React, { useState } from 'react';
import { Button } from './Button';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => Promise<void>;
  currentBalance: number;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onDeposit, currentBalance }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleDeposit = async () => {
    const val = parseFloat(amount);
    if (!isNaN(val) && val > 0) {
      setIsLoading(true);
      try {
        await onDeposit(val);
        setAmount('');
        onClose();
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-md p-6 shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-white">Deposit to BaseMarkets</h2>
        <p className="text-gray-400 text-sm mb-6">
          Approve and deposit USDC from your wallet into the Smart Contract.
        </p>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-400 mb-1">Amount (USDC)</label>
          <div className="relative">
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3 text-white focus:border-base-500 focus:outline-none text-lg disabled:opacity-50"
              placeholder="0.00"
              disabled={isLoading}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">USDC</span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={onClose} fullWidth disabled={isLoading}>Cancel</Button>
          <Button variant="primary" onClick={handleDeposit} fullWidth disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : "Confirm Transaction"}
          </Button>
        </div>
        
        <div className="mt-4 text-center text-xs text-gray-500">
           Interacting with Base Network Contract
        </div>
      </div>
    </div>
  );
};