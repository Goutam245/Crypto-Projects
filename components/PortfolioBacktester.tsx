
'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface BacktestResult {
  date: string;
  portfolioValue: number;
  btcValue: number;
  returns: number;
}

interface PortfolioBacktesterProps {
  isDarkMode: boolean;
}

export default function PortfolioBacktester({ isDarkMode }: PortfolioBacktesterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [strategy, setStrategy] = useState('balanced');
  const [timeframe, setTimeframe] = useState('1M');
  const [results, setResults] = useState<BacktestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [metrics, setMetrics] = useState({
    totalReturn: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
    winRate: 0
  });

  const strategies = [
    { id: 'balanced', name: '60/40 BTC/ETH', description: 'Balanced crypto portfolio' },
    { id: 'aggressive', name: '80/20 BTC/Alts', description: 'Aggressive growth strategy' },
    { id: 'conservative', name: '40/60 BTC/Stables', description: 'Conservative approach' },
    { id: 'momentum', name: 'Momentum Trading', description: 'Trend following strategy' }
  ];

  const runBacktest = async () => {
    setIsRunning(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const generateResults = () => {
      const data: BacktestResult[] = [];
      let portfolioValue = 10000;
      let btcValue = 10000;

      for (let i = 0; i < 30; i++) {
        const date = new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toLocaleDateString();

        const portfolioChange = (Math.random() - 0.45) * 0.05;
        const btcChange = (Math.random() - 0.48) * 0.06;

        portfolioValue *= (1 + portfolioChange);
        btcValue *= (1 + btcChange);

        data.push({
          date,
          portfolioValue,
          btcValue,
          returns: ((portfolioValue - 10000) / 10000) * 100
        });
      }

      return data;
    };

    const backtestResults = generateResults();
    setResults(backtestResults);

    const finalValue = backtestResults[backtestResults.length - 1].portfolioValue;
    setMetrics({
      totalReturn: ((finalValue - 10000) / 10000) * 100,
      sharpeRatio: 1.2 + Math.random() * 0.8,
      maxDrawdown: -(Math.random() * 15 + 5),
      winRate: 55 + Math.random() * 20
    });

    setIsRunning(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`px-2 lg:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-xs lg:text-sm ${
          isDarkMode
            ? 'bg-purple-600 hover:bg-purple-700 text-white'
            : 'bg-purple-500 hover:bg-purple-600 text-white'
       }`}
      >
        <i className="ri-line-chart-line mr-1 lg:mr-2"></i>
        <span className="hidden sm:inline">Portfolio Backtester</span>
        <span className="sm:hidden">Backtest</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-6xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-h-[90vh] overflow-y-auto`}>
        <div className={`p-4 lg:p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl lg:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Portfolio Backtester
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-2 rounded-lg ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Strategy
                </label>
                <div className="space-y-2">
                  {strategies.map((strat) => (
                    <label key={strat.id} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="strategy"
                        value={strat.id}
                        checked={strategy === strat.id}
                        onChange={(e) => setStrategy(e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <div className={`font-medium text-sm lg:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {strat.name}
                        </div>
                        <div className={`text-xs lg:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {strat.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Timeframe
                </label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className={`w-full px-3 py-2 rounded border text-sm ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="1W">1 Week</option>
                  <option value="1M">1 Month</option>
                  <option value="3M">3 Months</option>
                  <option value="6M">6 Months</option>
                  <option value="1Y">1 Year</option>
                </select>
              </div>

              <button
                onClick={runBacktest}
                disabled={isRunning}
                className={`w-full py-2 lg:py-3 px-4 rounded-lg font-semibold transition-colors whitespace-nowrap text-sm lg:text-base ${
                  isRunning
                    ? (isDarkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-300 text-gray-500')
                    : (isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white')
                }`}
              >
                {isRunning ? 'Running Backtest...' : 'Run Backtest'}
              </button>
            </div>

            <div className="lg:col-span-2">
              {results.length > 0 && (
                <div className="space-y-4 lg:space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
                    <div className={`p-3 lg:p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <div className={`text-xs lg:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Return</div>
                      <div className={`text-lg lg:text-xl font-bold ${
                        metrics.totalReturn >= 0
                          ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                          : (isDarkMode ? 'text-red-400' : 'text-red-600')
                      }`}>
                        {metrics.totalReturn.toFixed(2)}%
                      </div>
                    </div>
                    <div className={`p-3 lg:p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <div className={`text-xs lg:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sharpe Ratio</div>
                      <div className={`text-lg lg:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {metrics.sharpeRatio.toFixed(2)}
                      </div>
                    </div>
                    <div className={`p-3 lg:p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <div className={`text-xs lg:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Max Drawdown</div>
                      <div className={`text-lg lg:text-xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                        {metrics.maxDrawdown.toFixed(2)}%
                      </div>
                    </div>
                    <div className={`p-3 lg:p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <div className={`text-xs lg:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Win Rate</div>
                      <div className={`text-lg lg:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {metrics.winRate.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="h-64 lg:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={results}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
                        <XAxis dataKey="date" stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} fontSize={10} tick={{ fontSize: 10 }} />
                        <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} fontSize={10} tick={{ fontSize: 10 }} />
                        <Line
                          type="monotone"
                          dataKey="portfolioValue"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          name="Portfolio"
                        />
                        <Line
                          type="monotone"
                          dataKey="btcValue"
                          stroke="#F59E0B"
                          strokeWidth={2}
                          name="BTC Benchmark"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
