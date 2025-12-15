import React, { useState } from 'react';
import { Button } from './Button';

interface StakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStake: (amount: number) => Promise<void>;
  onRequestUnstake: (amount: number) => Promise<void>;
  onCompleteUnstake: () => Promise<void>;
  stakedBalance: number;
  walletBalance: number;
  pendingUnstakeAmount: number;
  pendingUnlockTime: number; // Unix timestamp
}

export const StakeModal: React.FC<StakeModalProps> = ({ 
  isOpen, 
  onClose, 
  onStake, 
  onRequestUnstake, 
  onCompleteUnstake,
  stakedBalance,
  walletBalance,
  pendingUnstakeAmount,
  pendingUnlockTime
}) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'stake' | 'unstake'>('stake');

  if (!isOpen) return null;

  const handleAction = async () => {
    const val = parseFloat(amount);
    if (!isNaN(val) && val > 0) {
      setIsLoading(true);
      try {
        if (activeTab === 'stake') {
          await onStake(val);
        } else {
          await onRequestUnstake(val);
        }
        setAmount('');
        // Don't close immediately so they can see result or switch tabs
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleFinalize = async () => {
      setIsLoading(true);
      try {
          await onCompleteUnstake();
          onClose();
      } catch(e) {
          console.error(e);
      } finally {
          setIsLoading(false);
      }
  }

  const maxAmount = activeTab === 'stake' ? walletBalance : stakedBalance;
  const isInvalid = parseFloat(amount) > maxAmount || parseFloat(amount) <= 0 || isNaN(parseFloat(amount));

  const currentTime = Math.floor(Date.now() / 1000);
  const canWithdraw = pendingUnlockTime > 0 && currentTime >= pendingUnlockTime;
  const hoursLeft = pendingUnlockTime > currentTime ? Math.ceil((pendingUnlockTime - currentTime) / 3600) : 0;
  const daysLeft = Math.ceil(hoursLeft / 24);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-md p-6 shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-white">Manage USDC Liquidity</h2>
        
        {/* Tabs */}
        <div className="flex bg-dark-900 rounded-lg p-1 mb-6">
          <button 
            onClick={() => setActiveTab('stake')}
            className={`flex-1 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'stake' ? 'bg-base-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Stake
          </button>
          <button 
            onClick={() => setActiveTab('unstake')}
            className={`flex-1 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'unstake' ? 'bg-base-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Unstake
          </button>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
             <label className="font-medium">Amount (USDC)</label>
             <span>Max: ${maxAmount.toFixed(2)}</span>
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
                onClick={() => setAmount(maxAmount.toString())}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-base-500 hover:text-white uppercase font-bold"
                disabled={isLoading}
            >
                Max
            </button>
          </div>
        </div>

        {activeTab === 'stake' && (
          <div className="bg-green-900/20 border border-green-900/50 p-3 rounded-lg mb-6 text-xs text-green-400">
            Estimated APY: <span className="font-bold">12.5%</span>. Rewards are paid in USDC.
          </div>
        )}

        {activeTab === 'unstake' && (
           <div className="bg-yellow-900/20 border border-yellow-900/50 p-3 rounded-lg mb-6 text-xs text-yellow-400">
             Unstaking initiates a <strong>3-day lockup period</strong>. You can withdraw your funds after this time.
           </div>
        )}

        <div className="flex gap-3 mb-6">
          <Button variant="primary" onClick={handleAction} fullWidth disabled={isInvalid || isLoading}>
            {isLoading && !amount ? "Processing..." : `Confirm ${activeTab === 'stake' ? 'Stake' : 'Request Unstake'}`}
          </Button>
        </div>

        {/* Pending Withdrawals Section */}
        {pendingUnstakeAmount > 0 && (
            <div className="border-t border-dark-700 pt-4 mt-4">
                <h3 className="text-sm font-bold text-white mb-3">Pending Withdrawals</h3>
                <div className="bg-dark-900 rounded-lg p-3 flex justify-between items-center">
                    <div>
                        <div className="text-white font-mono font-bold">${pendingUnstakeAmount.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">
                            {canWithdraw 
                                ? <span className="text-green-500">Ready to withdraw</span> 
                                : <span>Unlocks in {daysLeft} day(s)</span>
                            }
                        </div>
                    </div>
                    <Button 
                        size="sm" 
                        variant={canWithdraw ? "success" : "secondary"} 
                        disabled={!canWithdraw || isLoading}
                        onClick={handleFinalize}
                    >
                        {isLoading ? "..." : "Claim"}
                    </Button>
                </div>
            </div>
        )}
        
        <div className="mt-4">
            <Button variant="secondary" onClick={onClose} fullWidth>Close</Button>
        </div>

      </div>
    </div>
  );
};