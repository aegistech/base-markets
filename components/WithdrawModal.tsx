import React, { useState } from 'react';
import { Button } from './Button';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (amount: number) => Promise<void>;
  currentBalance: number;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, onWithdraw, currentBalance }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleWithdraw = async () => {
    const val = parseFloat(amount);
    if (!isNaN(val) && val > 0 && val <= currentBalance) {
      setIsLoading(true);
      try {
        await onWithdraw(val);
        setAmount('');
        onClose();
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isInvalid = parseFloat(amount) > currentBalance || parseFloat(amount) <= 0 || isNaN(parseFloat(amount));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-md p-6 shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-white">Withdraw Funds</h2>
        <p className="text-gray-400 text-sm mb-6">
          Withdraw tokens from the Smart Contract back to your wallet.
        </p>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
             <label className="font-medium">Amount (USDC)</label>
             <span>Available in Contract: ${currentBalance.toFixed(2)}</span>
          </div>
          <div className="relative">
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3 text-white focus:border-base-500 focus:outline-none text-lg disabled:opacity-50"
              placeholder="0.00"
              disabled={isLoading}
            />
            <button 
                onClick={() => setAmount(currentBalance.toString())}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-base-500 hover:text-white uppercase font-bold"
                disabled={isLoading}
            >
                Max
            </button>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={onClose} fullWidth disabled={isLoading}>Cancel</Button>
          <Button variant="primary" onClick={handleWithdraw} fullWidth disabled={isInvalid || isLoading}>
            {isLoading ? (
               <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Withdrawing...
              </span>
            ) : "Confirm Withdraw"}
          </Button>
        </div>
        
        <div className="mt-4 text-center text-xs text-gray-500">
           Transaction requires wallet signature.
        </div>
      </div>
    </div>
  );
};