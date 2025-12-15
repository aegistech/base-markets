import React from 'react';
import { NewsItem } from '../types';

export const NewsFeed = ({ news }: { news: NewsItem[] }) => {
  return (
    <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="text-xl">📰</span> Crypto News
        </h3>
        <span className="text-xs text-holiday-green font-medium animate-pulse">Live</span>
      </div>
      
      <div className="space-y-4">
        {news.map(item => (
          <div key={item.id} className="group cursor-pointer">
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-bold text-base-500 dark:text-base-400 uppercase tracking-wider">{item.source}</span>
              <span className="text-xs text-gray-400">{item.timeAgo}</span>
            </div>
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-base-600 dark:group-hover:text-base-400 transition-colors leading-snug">
              {item.title}
            </h4>
            <div className="mt-1 flex items-center gap-2">
              <div className={`h-1.5 w-1.5 rounded-full ${
                item.sentiment === 'bullish' ? 'bg-green-500' : 
                item.sentiment === 'bearish' ? 'bg-red-500' : 'bg-gray-400'
              }`} />
              <span className="text-[10px] text-gray-500 capitalize">{item.sentiment}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};