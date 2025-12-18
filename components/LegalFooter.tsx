import React from 'react';

export const LegalFooter = () => {
  return (
    <footer className="mt-12 py-8 border-t border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900">
      <div className="max-w-5xl mx-auto px-4 text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">BaseMarkets</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm">
              The premier decentralized prediction market on Base. 
              Trade on news, politics, and culture with the security of the blockchain.
              Built for the Farcaster community.
            </p>
          </div>
          
          <div>
            <h5 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Platform</h5>
            <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-base-500">Markets</a></li>
              <li><a href="#" className="hover:text-base-500">Leaderboard</a></li>
              <li><a href="#" className="hover:text-base-500">Activity</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Resources</h5>
            <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-base-500">Terms of Use</a></li>
              <li><a href="#" className="hover:text-base-500">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-base-500 font-medium text-base-500">Developer Docs</a></li>
              <li><a href="#" className="hover:text-base-500">API Access</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 dark:border-dark-700 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400">
          <p>© 2025 BaseMarkets. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            BaseMarkets is a non-custodial interface. 
            Users are responsible for their own keys and compliance with local laws.
          </p>
        </div>
      </div>
    </footer>
  );
};
