
'use client';

import { useState, useEffect } from 'react';
import { binanceWS, PriceData } from '../lib/websocket-client';

interface SidebarProps {
  activeSymbol: string;
  setActiveSymbol: (symbol: string) => void;
  isDarkMode: boolean;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function Sidebar({ activeSymbol, setActiveSymbol, isDarkMode, isOpen, setIsOpen }: SidebarProps) {
  const [watchlist, setWatchlist] = useState([
    { symbol: 'BTCUSDT', name: 'Bitcoin', price: 67234.56, change: 2.4 },
    { symbol: 'ETHUSDT', name: 'Ethereum', price: 3456.78, change: 1.8 },
    { symbol: 'SOLUSDT', name: 'Solana', price: 158.23, change: 6.8 },
    { symbol: 'ADAUSDT', name: 'Cardano', price: 0.4567, change: -1.2 },
    { symbol: 'DOTUSDT', name: 'Polkadot', price: 6.789, change: 3.4 },
    { symbol: 'AVAXUSDT', name: 'Avalanche', price: 26.78, change: -3.2 },
    { symbol: 'MATICUSDT', name: 'Polygon', price: 0.8945, change: 4.7 },
    { symbol: 'LINKUSDT', name: 'Chainlink', price: 14.56, change: 0.9 }
  ]);

  const [alerts] = useState([
    { symbol: 'BTC', type: 'price', condition: '> $68,000', status: 'active' },
    { symbol: 'ETH', type: 'volume', condition: '> 1M', status: 'triggered' },
    { symbol: 'SOL', type: 'change', condition: '> 5%', status: 'active' }
  ]);

  useEffect(() => {
    binanceWS.connect();

    const handlePriceUpdate = (data: PriceData) => {
      setWatchlist(prev => prev.map(coin => {
        if (coin.symbol === data.symbol) {
          return {
            ...coin,
            price: parseFloat(data.price),
            change: parseFloat(data.priceChangePercent)
          };
        }
        return coin;
      }));
    };

    binanceWS.subscribe('ticker', handlePriceUpdate);

    return () => {
      binanceWS.unsubscribe('ticker', handlePriceUpdate);
    };
  }, []);

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)} />

      <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-40 w-80 lg:w-80 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col transition-all duration-200 h-full lg:h-auto`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Watchlist</h2>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full bg-green-400 animate-pulse`}></div>
              <span className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Live</span>
              <button className={`p-1 rounded ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                <i className="ri-add-line"></i>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className={`lg:hidden p-1 rounded ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {watchlist.map((coin, index) => (
              <div
                key={index}
                onClick={() => {
                  setActiveSymbol(coin.symbol);
                  setIsOpen(false);
                }}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  activeSymbol === coin.symbol
                    ? (isDarkMode ? 'bg-blue-900/30 border border-blue-500/50' : 'bg-blue-50 border border-blue-200')
                    : (isDarkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100')
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className={`font-semibold text-sm truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {coin.symbol.replace('USDT', '')}
                    </div>
                    <div className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {coin.name}
                    </div>
                  </div>
                  <div className="text-right ml-2">
                    <div className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${coin.price.toLocaleString()}
                    </div>
                    <div className={`text-xs ${
                      coin.change >= 0
                        ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                        : (isDarkMode ? 'text-red-400' : 'text-red-600')
                    }`}>
                      {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Price Alerts
          </h3>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {alert.symbol}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    alert.status === 'triggered'
                      ? (isDarkMode ? 'bg-orange-900/20 text-orange-400' : 'bg-orange-100 text-orange-800')
                      : (isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800')
                  }`}>
                    {alert.status}
                  </span>
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {alert.type} {alert.condition}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
