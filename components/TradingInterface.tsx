
'use client';

import { useState, useEffect } from 'react';
import CandlestickChart from './CandlestickChart';
import OrderBook from './OrderBook';
import TradingPanel from './TradingPanel';

interface TradingInterfaceProps {
  symbol: string;
  isDarkMode: boolean;
}

export default function TradingInterface({ symbol, isDarkMode }: TradingInterfaceProps) {
  const [currentPrice, setCurrentPrice] = useState(67234.56);
  const [priceChange, setPriceChange] = useState(2.4);

  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 100;
      setCurrentPrice(prev => Math.max(0, prev + change));
      setPriceChange((Math.random() - 0.5) * 10);
    }, 1000);

    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-3 lg:p-4 transition-colors duration-200`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-3 lg:space-y-0">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
            <h2 className={`text-xl lg:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {symbol.replace('USDT', '/USDT')}
            </h2>
            <div className="flex items-center space-x-2">
              <span className={`text-2xl lg:text-3xl font-bold ${priceChange >= 0 ? (isDarkMode ? 'text-green-400' : 'text-green-600') : (isDarkMode ? 'text-red-400' : 'text-red-600')}`}>
                ${currentPrice.toLocaleString()}
              </span>
              <span className={`text-sm lg:text-lg px-2 lg:px-3 py-1 rounded ${priceChange >= 0 ? (isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800') : (isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800')}`}>
                {priceChange >= 0 ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-xs lg:text-sm">
            <div>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>24h High: </span>
              <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ${(currentPrice * 1.05).toLocaleString()}
              </span>
            </div>
            <div>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>24h Low: </span>
              <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ${(currentPrice * 0.95).toLocaleString()}
              </span>
            </div>
            <div>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Volume: </span>
              <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ${(Math.random() * 1000 + 500).toFixed(0)}M
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 flex flex-col min-h-0">
          <CandlestickChart symbol={symbol} isDarkMode={isDarkMode} />
        </div>

        <div className="w-full lg:w-80 flex flex-col lg:flex-col min-h-0">
          <OrderBook symbol={symbol} isDarkMode={isDarkMode} />
          <TradingPanel symbol={symbol} isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
}
