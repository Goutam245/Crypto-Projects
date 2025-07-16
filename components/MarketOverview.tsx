
'use client';

import { useState, useEffect } from 'react';

interface MarketOverviewProps {
  isDarkMode: boolean;
}

export default function MarketOverview({ isDarkMode }: MarketOverviewProps) {
  const [marketData, setMarketData] = useState({
    totalCap: 2.48,
    change24h: 3.2,
    btcDominance: 42.8,
    ethDominance: 18.3,
    volume24h: 89.4,
    fearGreedIndex: 76
  });

  const [topMovers] = useState([
    { symbol: 'RNDR', change: 12.4, price: 8.94 },
    { symbol: 'TIA', change: 8.7, price: 12.45 },
    { symbol: 'SOL', change: 6.8, price: 158.23 },
    { symbol: 'SEI', change: -5.1, price: 0.487 },
    { symbol: 'AVAX', change: -3.2, price: 26.78 }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => ({
        ...prev,
        totalCap: prev.totalCap + (Math.random() - 0.5) * 0.1,
        change24h: prev.change24h + (Math.random() - 0.5) * 0.2
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-3 lg:p-4 transition-colors duration-200`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-3 lg:mb-4 space-y-3 lg:space-y-0">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-6">
          <div className="flex items-center space-x-2">
            <span className={`text-xs lg:text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Global Market Cap
            </span>
            <span className={`text-xl lg:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              ${marketData.totalCap.toFixed(2)}T
            </span>
            <span className={`text-xs lg:text-sm px-2 py-1 rounded ${
              marketData.change24h >= 0
                ? (isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800')
                : (isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800')
            }`}>
              {marketData.change24h >= 0 ? '▲' : '▼'} {Math.abs(marketData.change24h).toFixed(1)}%
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-xs lg:text-sm">
            <div>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>BTC Dom: </span>
              <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{marketData.btcDominance}%</span>
            </div>
            <div>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>ETH Dom: </span>
              <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{marketData.ethDominance}%</span>
            </div>
            <div>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>24h Vol: </span>
              <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>${marketData.volume24h}B</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between lg:justify-end space-x-2">
          <span className={`text-xs lg:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fear & Greed:</span>
          <div className={`px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold ${
            marketData.fearGreedIndex > 75
              ? (isDarkMode ? 'bg-orange-900/20 text-orange-400' : 'bg-orange-100 text-orange-800')
              : marketData.fearGreedIndex > 50
              ? (isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800')
              : (isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800')
          }`}>
            {marketData.fearGreedIndex}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-8">
        <span className={`text-xs lg:text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Top Movers (24h):
        </span>
        <div className="flex flex-wrap items-center gap-2 lg:gap-4">
          {topMovers.map((coin, index) => (
            <div key={index} className="flex items-center space-x-1 lg:space-x-2">
              <span className={`text-xs lg:text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {coin.symbol}
              </span>
              <span className={`text-xs lg:text-sm px-1 lg:px-2 py-1 rounded ${
                coin.change >= 0
                  ? (isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800')
                  : (isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800')
              }`}>
                {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
