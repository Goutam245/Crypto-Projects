'use client';

import { useState, useEffect } from 'react';
import { binanceWS, OrderBookData } from '../lib/websocket-client';

interface OrderBookProps {
  symbol: string;
  isDarkMode: boolean;
}

interface Order {
  price: number;
  size: number;
  total: number;
}

export default function OrderBook({ symbol, isDarkMode }: OrderBookProps) {
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);
  const [spread, setSpread] = useState(0);
  const [basePrice, setBasePrice] = useState(67234.56); // 🟢 এখানে state হিসাবে রাখা হলো

  useEffect(() => {
    const generateOrders = () => {
      const newBids: Order[] = [];
      const newAsks: Order[] = [];

      let totalBids = 0;
      const tempBase = basePrice;

      for (let i = 0; i < 15; i++) {
        const price = tempBase - (i + 1) * (Math.random() * 5 + 1);
        const size = Math.random() * 2 + 0.1;
        totalBids += size;
        newBids.push({ price, size, total: totalBids });
      }

      let totalAsks = 0;
      for (let i = 0; i < 15; i++) {
        const price = tempBase + (i + 1) * (Math.random() * 5 + 1);
        const size = Math.random() * 2 + 0.1;
        totalAsks += size;
        newAsks.push({ price, size, total: totalAsks });
      }

      setBids(newBids);
      setAsks(newAsks);

      if (newAsks.length > 0 && newBids.length > 0) {
        const highestBidPrice = newBids[0].price;
        const lowestAskPrice = newAsks[0].price;
        setSpread(lowestAskPrice - highestBidPrice);
        setBasePrice(highestBidPrice); // 🟢 আপডেট করা হলো
      }
    };

    const handleOrderBookUpdate = (data: OrderBookData) => {
      if (data.symbol !== symbol) return;

      const newBids: Order[] = [];
      const newAsks: Order[] = [];

      let totalBids = 0;
      data.bids.slice(0, 15).forEach(([priceStr, sizeStr]) => {
        const price = parseFloat(priceStr);
        const size = parseFloat(sizeStr);
        totalBids += size;
        newBids.push({ price, size, total: totalBids });
      });

      let totalAsks = 0;
      data.asks.slice(0, 15).forEach(([priceStr, sizeStr]) => {
        const price = parseFloat(priceStr);
        const size = parseFloat(sizeStr);
        totalAsks += size;
        newAsks.push({ price, size, total: totalAsks });
      });

      setBids(newBids);
      setAsks(newAsks);

      if (newAsks.length > 0 && newBids.length > 0) {
        const highestBidPrice = newBids[0].price;
        const lowestAskPrice = newAsks[0].price;
        setSpread(lowestAskPrice - highestBidPrice);
        setBasePrice(highestBidPrice); // 🟢 আপডেট করা হলো
      }
    };

    generateOrders();
    binanceWS.subscribe('orderbook', handleOrderBookUpdate);

    const fallbackInterval = setInterval(generateOrders, 2000);

    return () => {
      binanceWS.unsubscribe('orderbook', handleOrderBookUpdate);
      clearInterval(fallbackInterval);
    };
  }, [symbol]);

  return (
    <div className={`flex-1 lg:max-h-96 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b lg:border-b transition-colors duration-200`}>
      <div className={`p-3 lg:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-base lg:text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Order Book
          </h3>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Spread:</span>
            <span className={`font-semibold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
              ${spread.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="h-64 lg:h-80 overflow-hidden">
        <div className="grid grid-cols-3 gap-1 p-2 text-xs font-semibold border-b border-gray-700">
          <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Price (USDT)</span>
          <span className={`text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Size (BTC)</span>
          <span className={`text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total</span>
        </div>

        <div className="h-20 lg:h-32 overflow-y-auto">
          {asks.map((ask, index) => (
            <div key={index} className="grid grid-cols-3 gap-1 p-1 text-xs hover:bg-red-900/10 transition-colors relative">
              <div className="absolute inset-y-0 right-0 bg-red-500/10"
                style={{ width: `${(ask.total / Math.max(...asks.map(a => a.total))) * 100}%` }} />
              <span className={`font-mono ${isDarkMode ? 'text-red-400' : 'text-red-600'} relative z-10`}>
                {ask.price.toFixed(2)}
              </span>
              <span className={`text-right font-mono ${isDarkMode ? 'text-white' : 'text-gray-900'} relative z-10`}>
                {ask.size.toFixed(6)}
              </span>
              <span className={`text-right font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} relative z-10`}>
                {ask.total.toFixed(4)}
              </span>
            </div>
          ))}
        </div>

        <div className={`p-2 text-center border-y ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
          <div className={`text-base lg:text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            ${(bids[0]?.price || basePrice).toFixed(2)}
          </div>
          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Last Price
          </div>
        </div>

        <div className="h-20 lg:h-32 overflow-y-auto">
          {bids.map((bid, index) => (
            <div key={index} className="grid grid-cols-3 gap-1 p-1 text-xs hover:bg-green-900/10 transition-colors relative">
              <div className="absolute inset-y-0 right-0 bg-green-500/10"
                style={{ width: `${(bid.total / Math.max(...bids.map(b => b.total))) * 100}%` }} />
              <span className={`font-mono ${isDarkMode ? 'text-green-400' : 'text-green-600'} relative z-10`}>
                {bid.price.toFixed(2)}
              </span>
              <span className={`text-right font-mono ${isDarkMode ? 'text-white' : 'text-gray-900'} relative z-10`}>
                {bid.size.toFixed(6)}
              </span>
              <span className={`text-right font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} relative z-10`}>
                {bid.total.toFixed(4)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
