'use client';

import { useState, useEffect, useCallback } from 'react';

interface ArbitrageOpportunity {
  symbol: string;
  buyExchange: string;
  sellExchange: string;
  buyPrice: number;
  sellPrice: number;
  spread: number;
  volume: number;
  profit: number;
}

interface ArbitrageScannerProps {
  isDarkMode: boolean;
}

export default function ArbitrageScanner({ isDarkMode }: ArbitrageScannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [minSpread, setMinSpread] = useState(0.5);
  const [minVolume, setMinVolume] = useState(10000);

  const exchanges = ['Binance', 'Coinbase', 'Kraken', 'OKX', 'Bybit'];

  const scanForOpportunities = useCallback(async () => {
    setIsScanning(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // simulate async delay

    const symbols = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'AVAX', 'MATIC', 'LINK'];
    const newOpportunities: ArbitrageOpportunity[] = [];

    symbols.forEach(symbol => {
      if (Math.random() > 0.3) {
        const basePrice = Math.random() * 1000 + 100;
        const spread = Math.random() * 3 + minSpread;
        const volume = Math.random() * 50000 + minVolume;

        const buyExchange = exchanges[Math.floor(Math.random() * exchanges.length)];
        let sellExchange = exchanges[Math.floor(Math.random() * exchanges.length)];
        while (sellExchange === buyExchange) {
          sellExchange = exchanges[Math.floor(Math.random() * exchanges.length)];
        }

        const buyPrice = basePrice;
        const sellPrice = basePrice * (1 + spread / 100);
        const profit = (sellPrice - buyPrice) * (volume / sellPrice) * 0.1;

        newOpportunities.push({
          symbol,
          buyExchange,
          sellExchange,
          buyPrice,
          sellPrice,
          spread,
          volume,
          profit
        });
      }
    });

    newOpportunities.sort((a, b) => b.spread - a.spread);
    setOpportunities(newOpportunities);
    setIsScanning(false);
  }, [minSpread, minVolume, exchanges]);

  useEffect(() => {
    if (isOpen) {
      scanForOpportunities();
      const interval = setInterval(scanForOpportunities, 10000);
      return () => clearInterval(interval);
    }
  }, [isOpen, scanForOpportunities]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`px-2 lg:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-xs lg:text-sm ${
          isDarkMode
            ? 'bg-orange-600 hover:bg-orange-700 text-white'
            : 'bg-orange-500 hover:bg-orange-600 text-white'
        }`}
      >
        <i className="ri-arrow-left-right-line mr-1 lg:mr-2"></i>
        <span className="hidden sm:inline">Arbitrage Scanner</span>
        <span className="sm:hidden">Arbitrage</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-6xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-h-[90vh] overflow-hidden`}>
        <div className={`p-4 lg:p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <h2 className={`text-lg lg:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Cross-Exchange Arbitrage Scanner
              </h2>
              {isScanning && (
                <div className={`flex items-center space-x-2 text-xs lg:text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  <div className="animate-spin w-3 lg:w-4 h-3 lg:h-4 border-2 border-current border-t-transparent rounded-full"></div>
                  <span className="hidden sm:inline">Scanning...</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-2 rounded-lg ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-4 lg:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 lg:mb-6 space-y-3 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div>
                <label className={`block text-xs lg:text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Min Spread (%)
                </label>
                <input
                  type="number"
                  value={minSpread}
                  onChange={(e) => setMinSpread(Number(e.target.value))}
                  step="0.1"
                  min="0"
                  className={`w-20 lg:w-24 px-2 lg:px-3 py-2 rounded border text-xs lg:text-sm ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-xs lg:text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Min Volume ($)
                </label>
                <input
                  type="number"
                  value={minVolume}
                  onChange={(e) => setMinVolume(Number(e.target.value))}
                  step="1000"
                  min="0"
                  className={`w-24 lg:w-32 px-2 lg:px-3 py-2 rounded border text-xs lg:text-sm ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            <button
              onClick={scanForOpportunities}
              disabled={isScanning}
              className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-xs lg:text-sm ${
                isScanning
                  ? (isDarkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-300 text-gray-500')
                  : (isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white')
              }`}
            >
              <i className="ri-refresh-line mr-1 lg:mr-2"></i>
              Refresh Scan
            </button>
          </div>

          <div className="space-y-3">
            {opportunities.length > 0 ? (
              opportunities.map((opp, index) => (
                <div
                  key={index}
                  className={`p-3 lg:p-4 rounded-lg border ${
                    isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-3 lg:space-y-0">
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                      <div className={`text-base lg:text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {opp.symbol}
                      </div>
                      <div className="flex items-center space-x-2 text-xs lg:text-sm">
                        <span className={`px-2 py-1 rounded ${isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800'}`}>
                          Buy: {opp.buyExchange}
                        </span>
                        <i className="ri-arrow-right-line text-gray-400"></i>
                        <span className={`px-2 py-1 rounded ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800'}`}>
                          Sell: {opp.sellExchange}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:flex lg:items-center gap-3 lg:gap-6 text-xs lg:text-sm">
                      <div>
                        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Buy Price</div>
                        <div className={`font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                          ${opp.buyPrice.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sell Price</div>
                        <div className={`font-semibold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                          ${opp.sellPrice.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Spread</div>
                        <div className={`font-bold text-base lg:text-lg ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                          {opp.spread.toFixed(2)}%
                        </div>
                      </div>
                      <div>
                        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Est. Profit</div>
                        <div className={`font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          ${opp.profit.toFixed(0)}
                        </div>
                      </div>
                      <button
                        className={`px-3 py-2 rounded font-medium transition-colors whitespace-nowrap text-xs lg:text-sm col-span-2 lg:col-span-1 ${
                          isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        Execute
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={`text-center py-8 lg:py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {isScanning ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin w-4 lg:w-6 h-4 lg:h-6 border-2 border-current border-t-transparent rounded-full"></div>
                    <span>Scanning for arbitrage opportunities...</span>
                  </div>
                ) : (
                  <div>
                    <i className="ri-search-line text-3xl lg:text-4xl mb-2"></i>
                    <div>No arbitrage opportunities found</div>
                    <div className="text-xs lg:text-sm mt-1">Try adjusting your filters or refresh the scan</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
