
'use client';

import { useState } from 'react';
import PortfolioBacktester from './PortfolioBacktester';
import ArbitrageScanner from './ArbitrageScanner';
import AuditLogViewer from './AuditLogViewer';

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
}

export default function Header({ isDarkMode, setIsDarkMode, isSidebarOpen, setIsSidebarOpen }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b transition-colors duration-200`}>
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        <div className="flex items-center space-x-2 lg:space-x-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <i className="ri-menu-line text-xl"></i>
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <i className="ri-line-chart-line text-white text-lg"></i>
            </div>
            <h1 className={`text-lg lg:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              CryptoDash Pro
            </h1>
          </div>
          
          <div className="hidden xl:flex items-center space-x-1 text-xs px-2">
            <span className={`px-2 py-1 rounded ${isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800'}`}>
              LIVE
            </span>
            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {'<'}200ms latency • MiCA compliant
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4">
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <PortfolioBacktester isDarkMode={isDarkMode} />
            <ArbitrageScanner isDarkMode={isDarkMode} />
            <AuditLogViewer isDarkMode={isDarkMode} />
          </div>

          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-40 lg:w-80 px-3 lg:px-4 py-2 pl-8 lg:pl-10 rounded-lg border text-sm ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <i className={`ri-search-line absolute left-2 lg:left-3 top-1/2 transform -translate-y-1/2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}></i>
          </div>

          <div className="flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <i className={`text-lg ${isDarkMode ? 'ri-sun-line' : 'ri-moon-line'}`}></i>
            </button>

            <button className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}>
              <i className="ri-notification-3-line text-lg"></i>
            </button>

            <button className={`hidden sm:block p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}>
              <i className="ri-settings-3-line text-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
