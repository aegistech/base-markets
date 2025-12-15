import React, { useState, useEffect } from 'react';
import { COIN_PRICES } from '../constants';

interface CoinData {
  id: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image?: string;
}

export const CryptoTicker = () => {
  const [coins, setCoins] = useState<CoinData[]>([]);

  const fetchPrices = async () => {
    try {
      // Base Ecosystem + Major Coins IDs
      const ids = "bitcoin,ethereum,solana,binancecoin,aerodrome-finance,degen-base,brett,virtual-protocol,usd-coin";
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=20&page=1&sparkline=false`
      );

      if (!response.ok) {
        throw new Error("CoinGecko API Limit or Error");
      }

      const data = await response.json();
      setCoins(data);
    } catch (error) {
      console.warn("CoinGecko API failed, using fallback data:", error);
      // Fallback to constants if API fails
      const fallbackData = COIN_PRICES.map((c, index) => ({
        id: index.toString(),
        symbol: c.symbol,
        current_price: c.price,
        price_change_percentage_24h: c.change
      }));
      setCoins(fallbackData);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchPrices();

    // Auto-update every 60 seconds
    const interval = setInterval(fetchPrices, 60000);

    return () => clearInterval(interval);
  }, []);

  // Duplicate list for seamless infinite loop
  const displayCoins = [...coins, ...coins];

  return (
    <div className="bg-dark-900 border-b border-dark-700 h-8 overflow-hidden flex items-center relative z-50">
      <div className="flex whitespace-nowrap gap-8 items-center px-4 animate-marquee hover:[animation-play-state:paused]">
        {displayCoins.map((coin, idx) => (
          <div key={`${coin.id}-${idx}`} className="flex items-center gap-2 text-xs font-mono">
            {coin.image && <img src={coin.image} alt={coin.symbol} className="w-4 h-4 rounded-full" />}
            <span className="font-bold text-gray-300 uppercase">{coin.symbol}</span>
            <span className="text-white">${coin.current_price.toLocaleString(undefined, { maximumFractionDigits: 6 })}</span>
            <span className={coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}>
              {coin.price_change_percentage_24h >= 0 ? '↑' : '↓'} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};