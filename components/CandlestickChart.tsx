'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
  Bar
} from 'recharts';

interface ChartPoint {
  time: string;
  price: number;
  volume: number;
  rsi: number;
  macd: number;
  signal: number;
  histogram: number;
}

interface CandlestickChartProps {
  symbol: string;
  isDarkMode: boolean;
}

export default function CandlestickChart({ symbol, isDarkMode }: CandlestickChartProps) {
  const [timeframe, setTimeframe] = useState('1H');
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [showIndicators, setShowIndicators] = useState({ macd: false, rsi: false });

  useEffect(() => {
    const generateData = (): ChartPoint[] => {
      const data: ChartPoint[] = [];
      let basePrice = 67234.56;

      for (let i = 0; i < 100; i++) {
        const time = new Date(Date.now() - (100 - i) * 60000).toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        });

        const change = (Math.random() - 0.5) * 200;
        basePrice += change;

        const rsi = 30 + Math.random() * 40;
        const macd = (Math.random() - 0.5) * 100;
        const signal = macd + (Math.random() - 0.5) * 20;

        data.push({
          time,
          price: Math.max(0, basePrice),
          volume: Math.random() * 1000 + 500,
          rsi,
          macd,
          signal,
          histogram: macd - signal
        });
      }

      return data;
    };

    // প্রথমে ডেটা জেনারেট করে সেট করলাম
    setChartData(generateData());

    // ৫০০ms পর পর ডেটা আপডেট করার জন্য ইন্টারভ্যাল
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev];
        if (newData.length > 0) {
          const lastPrice = newData[newData.length - 1].price;
          const change = (Math.random() - 0.5) * 100;
          const newPrice = Math.max(0, lastPrice + change);

          const rsi = 30 + Math.random() * 40;
          const macd = (Math.random() - 0.5) * 100;
          const signal = macd + (Math.random() - 0.5) * 20;

          newData.push({
            time: new Date().toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit'
            }),
            price: newPrice,
            volume: Math.random() * 1000 + 500,
            rsi,
            macd,
            signal,
            histogram: macd - signal
          });

          if (newData.length > 100) {
            newData.shift();
          }
        }
        return newData;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [symbol]);

  const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D', '1W'];

  return (
    <div className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-200 min-h-0`}>
      {/* Timeframe Buttons */}
      <div className={`p-3 lg:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-3 lg:space-y-0">
          <div className="flex items-center space-x-1 lg:space-x-2 overflow-x-auto">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 lg:px-3 py-1 rounded text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
                  timeframe === tf
                    ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                    : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Indicators Toggle */}
          <div className="flex items-center justify-between lg:justify-end space-x-2">
            <div className="flex items-center space-x-1 lg:space-x-2">
              <button
                onClick={() => setShowIndicators(prev => ({ ...prev, macd: !prev.macd }))}
                className={`px-2 lg:px-3 py-1 rounded text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
                  showIndicators.macd
                    ? (isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white')
                    : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                }`}
              >
                MACD
              </button>
              <button
                onClick={() => setShowIndicators(prev => ({ ...prev, rsi: !prev.rsi }))}
                className={`px-2 lg:px-3 py-1 rounded text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
                  showIndicators.rsi
                    ? (isDarkMode ? 'bg-orange-600 text-white' : 'bg-orange-500 text-white')
                    : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                }`}
              >
                RSI
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className={`${showIndicators.macd || showIndicators.rsi ? 'h-48 lg:h-64' : 'h-64 lg:h-96'} p-3 lg:p-4`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
            <XAxis dataKey="time" stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} fontSize={10} />
            <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} fontSize={10} domain={['dataMin - 100', 'dataMax + 100']} />
            <Area type="monotone" dataKey="price" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Indicators Section */}
      {(showIndicators.macd || showIndicators.rsi) && (
        <div className="grid grid-cols-1 gap-4 p-3 lg:p-4 border-t border-gray-700">
          {showIndicators.macd && (
            <div className="h-24 lg:h-32">
              <div className={`text-xs lg:text-sm font-semibold mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>MACD</div>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
                  <XAxis dataKey="time" stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} fontSize={8} />
                  <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} fontSize={8} />
                  <Line type="monotone" dataKey="macd" stroke="#8B5CF6" strokeWidth={1} dot={false} />
                  <Line type="monotone" dataKey="signal" stroke="#F59E0B" strokeWidth={1} dot={false} />
                  <Bar dataKey="histogram" fill="#6366F1" opacity={0.6} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}

          {showIndicators.rsi && (
            <div className="h-24 lg:h-32">
              <div className={`text-xs lg:text-sm font-semibold mb-2 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>RSI</div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
                  <XAxis dataKey="time" stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} fontSize={8} />
                  <YAxis domain={[0, 100]} stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} fontSize={8} />
                  <Line type="monotone" dataKey="rsi" stroke="#F97316" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey={() => 70} stroke="#EF4444" strokeWidth={1} strokeDasharray="5 5" dot={false} />
                  <Line type="monotone" dataKey={() => 30} stroke="#10B981" strokeWidth={1} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
