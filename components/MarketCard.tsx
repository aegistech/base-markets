import React, { useState } from 'react';
import { Market, MarketOutcome } from '../types';
import { Button } from './Button';
import { getMarketAnalysis } from '../services/geminiService';
import { TRANSLATIONS } from '../constants';

interface MarketCardProps {
  market: Market;
  onTrade: (market: Market, outcome: MarketOutcome) => void;
  lang: 'en' | 'zh';
}

export const MarketCard: React.FC<MarketCardProps> = ({ market, onTrade, lang }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const t = TRANSLATIONS[lang];

  const fetchAnalysis = async () => {
    if (analysis) return; // Don't refetch
    setLoadingAnalysis(true);
    const result = await getMarketAnalysis(market.question, market.yesPrice);
    setAnalysis(result);
    setLoadingAnalysis(false);
  };

  const yesPercent = Math.round(market.yesPrice * 100);
  const noPercent = Math.round(market.noPrice * 100);

  return (
    <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl overflow-hidden hover:border-holiday-gold dark:hover:border-holiday-gold transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col h-full group">
      <div className="flex p-4 gap-4">
        <div className="relative">
            <img 
            src={market.imageUrl} 
            alt="Market" 
            className="w-16 h-16 rounded-lg object-cover bg-gray-100 dark:bg-dark-700 flex-shrink-0"
            />
            {market.category === 'Crypto' && (
                <div className="absolute -top-1 -right-1 bg-holiday-gold text-dark-900 text-[10px] font-bold px-1.5 rounded-full border border-white dark:border-dark-800">
                    $
                </div>
            )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white leading-tight mb-1 line-clamp-2 group-hover:text-base-600 dark:group-hover:text-base-400 transition-colors">
              {market.question}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{t.vol}: ${market.volume.toLocaleString()}</span>
            <span>•</span>
            <span className="text-holiday-red dark:text-red-400">{t.ends} {market.endDate}</span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 mt-auto space-y-3">
        {/* Analysis Section */}
        {analysis ? (
          <div className="bg-gray-50 dark:bg-dark-900/50 p-3 rounded-lg text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-700 animate-fadeIn">
            <span className="text-purple-600 dark:text-purple-400 font-bold">{t.aiInsight}:</span> {analysis}
          </div>
        ) : (
          <button 
            onClick={(e) => { e.stopPropagation(); fetchAnalysis(); }}
            disabled={loadingAnalysis}
            className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-500 flex items-center gap-1 w-full font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM6.375 9.875c.62 0 1.205-.125 1.734-.348a5.25 5.25 0 003.543-3.543 5.23 5.23 0 01.348-1.734 5.23 5.23 0 01.348 1.734 5.25 5.25 0 003.543 3.543c.529.223 1.114.348 1.734.348.62 0 1.205.125 1.734.348a5.25 5.25 0 003.543 3.543 5.23 5.23 0 01.348 1.734 5.23 5.23 0 01-.348 1.734 5.25 5.25 0 00-3.543 3.543c-.529.223-1.114.348-1.734.348-.62 0-1.205-.125-1.734-.348a5.25 5.25 0 00-3.543-3.543A5.23 5.23 0 019.875 14.125a5.23 5.23 0 01-.348-1.734A5.25 5.25 0 005.984 8.848 5.23 5.23 0 016.375 9.875z" clipRule="evenodd" />
            </svg>
            {loadingAnalysis ? t.analyzing : t.askGemini}
          </button>
        )}

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="success" 
            size="sm" 
            onClick={() => onTrade(market, MarketOutcome.YES)}
            className="flex flex-col items-center py-2 h-auto"
          >
            <span className="font-bold">YES {yesPercent}%</span>
            <span className="text-[10px] opacity-80">{t.buy} at ${market.yesPrice.toFixed(2)}</span>
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => onTrade(market, MarketOutcome.NO)}
            className="flex flex-col items-center py-2 h-auto"
          >
            <span className="font-bold">NO {noPercent}%</span>
            <span className="text-[10px] opacity-80">{t.buy} at ${market.noPrice.toFixed(2)}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
