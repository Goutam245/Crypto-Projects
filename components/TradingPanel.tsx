
'use client';

import { useState } from 'react';
import { auditLogger } from '../lib/audit-logger';

interface TradingPanelProps {
  symbol: string;
  isDarkMode: boolean;
}

export default function TradingPanel({ symbol, isDarkMode }: TradingPanelProps) {
  const [orderType, setOrderType] = useState('market');
  const [side, setSide] = useState('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');

  const [positions] = useState([
    { symbol: 'BTCUSDT', side: 'LONG', size: 0.5, pnl: 234.56, pnlPercent: 2.4 },
    { symbol: 'ETHUSDT', side: 'SHORT', size: 2.1, pnl: -123.45, pnlPercent: -1.8 }
  ]);

  const [recentTrades] = useState([
    { price: 67234.56, size: 0.123, time: '14:32:45', side: 'buy' },
    { price: 67228.94, size: 0.456, time: '14:32:43', side: 'sell' },
    { price: 67241.23, size: 0.089, time: '14:32:41', side: 'buy' },
    { price: 67235.67, size: 0.234, time: '14:32:39', side: 'sell' },
    { price: 67242.89, size: 0.167, time: '14:32:37', side: 'buy' }
  ]);

  const handleSubmitOrder = () => {
    const orderPrice = orderType === 'market' ? 67234.56 : parseFloat(price);
    const orderAmount = parseFloat(amount);

    if (!orderAmount || (orderType === 'limit' && !orderPrice)) {
      alert('Please fill in all required fields');
      return;
    }

    auditLogger.log({
      userId: 'user_demo_001',
      action: `${side.toUpperCase()}_ORDER_SUBMITTED`,
      symbol: symbol,
      amount: orderAmount,
      price: orderPrice,
      side: side as 'buy' | 'sell',
      orderType: orderType as 'market' | 'limit',
      status: 'success',
      ipAddress: '192.168.1.100',
      userAgent: navigator.userAgent,
      compliance: {
        micaCompliant: true,
        riskScore: Math.floor(Math.random() * 5) + 1,
        region: 'EU'
      }
    });

    alert(`${side.toUpperCase()} ${orderType} order submitted: ${amount} ${symbol}`);
    setAmount('');
    if (orderType === 'limit') setPrice('');
  };

  return (
    <div className={`flex-1 lg:max-h-96 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-200 overflow-y-auto`}>
      <div className={`p-3 lg:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-base lg:text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Trading Panel
        </h3>

        <div className="space-y-3 lg:space-y-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setSide('buy')}
              className={`flex-1 py-2 px-3 lg:px-4 rounded font-semibold text-sm lg:text-base transition-colors whitespace-nowrap ${
                side === 'buy'
                  ? 'bg-green-600 text-white'
                  : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setSide('sell')}
              className={`flex-1 py-2 px-3 lg:px-4 rounded font-semibold text-sm lg:text-base transition-colors whitespace-nowrap ${
                side === 'sell'
                  ? 'bg-red-600 text-white'
                  : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
              }`}
            >
              Sell
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setOrderType('market')}
              className={`flex-1 py-1 px-2 lg:px-3 rounded text-xs lg:text-sm transition-colors whitespace-nowrap ${
                orderType === 'market'
                  ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                  : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
              }`}
            >
              Market
            </button>
            <button
              onClick={() => setOrderType('limit')}
              className={`flex-1 py-1 px-2 lg:px-3 rounded text-xs lg:text-sm transition-colors whitespace-nowrap ${
                orderType === 'limit'
                  ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                  : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
              }`}
            >
              Limit
            </button>
          </div>

          {orderType === 'limit' && (
            <div>
              <label className={`block text-xs lg:text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className={`w-full px-3 py-2 rounded border text-xs lg:text-sm ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          )}

          <div>
            <label className={`block text-xs lg:text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className={`w-full px-3 py-2 rounded border text-xs lg:text-sm ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <button
            onClick={handleSubmitOrder}
            className={`w-full py-2 lg:py-3 px-3 lg:px-4 rounded font-semibold text-sm lg:text-base transition-colors whitespace-nowrap ${
              side === 'buy'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {side === 'buy' ? 'Buy' : 'Sell'} {symbol.replace('USDT', '')}
          </button>
        </div>
      </div>

      <div className={`p-3 lg:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h4 className={`text-sm lg:text-md font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Open Positions
        </h4>
        <div className="space-y-2">
          {positions.map((position, index) => (
            <div key={index} className={`p-2 lg:p-3 rounded ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`font-semibold text-xs lg:text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {position.symbol.replace('USDT', '')}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  position.side === 'LONG'
                    ? (isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800')
                    : (isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800')
                }`}>
                  {position.side}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Size: {position.size}
                </span>
                <span className={`font-semibold ${
                  position.pnl >= 0
                    ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                    : (isDarkMode ? 'text-red-400' : 'text-red-600')
                }`}>
                  ${position.pnl.toFixed(2)} ({position.pnlPercent.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 lg:p-4">
        <h4 className={`text-sm lg:text-md font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Recent Trades
        </h4>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {recentTrades.map((trade, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <span className={`font-mono ${
                trade.side === 'buy'
                  ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                  : (isDarkMode ? 'text-red-400' : 'text-red-600')
              }`}>
                ${trade.price.toFixed(2)}
              </span>
              <span className={`font-mono ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {trade.size.toFixed(3)}
              </span>
              <span className={`font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {trade.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
