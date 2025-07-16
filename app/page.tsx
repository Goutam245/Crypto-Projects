
'use client';

import { useState, useEffect } from 'react';
import MarketOverview from '../components/MarketOverview';
import TradingInterface from '../components/TradingInterface';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function CryptoDashPro() {
  const [activeSymbol, setActiveSymbol] = useState('BTCUSDT');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark' : 'light';
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      <Header 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      
      <div className="flex h-screen pt-16">
        <Sidebar 
          activeSymbol={activeSymbol}
          setActiveSymbol={setActiveSymbol}
          isDarkMode={isDarkMode}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <MarketOverview isDarkMode={isDarkMode} />
          <TradingInterface 
            symbol={activeSymbol}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </div>
  );
}
