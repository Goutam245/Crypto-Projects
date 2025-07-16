
'use client';

import { useState, useEffect } from 'react';
import { auditLogger, AuditLogEntry } from '../lib/audit-logger';

interface AuditLogViewerProps {
  isDarkMode: boolean;
}

export default function AuditLogViewer({ isDarkMode }: AuditLogViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'success' | 'failed' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLogs(auditLogger.getRecentLogs(1000));
    }
  }, [isOpen]);

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.status === filter;
    const matchesSearch = !searchTerm || 
      log.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userId.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const exportLogs = () => {
    const data = auditLogger.exportLogs();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cryptodash_audit_logs_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`px-2 lg:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-xs lg:text-sm ${
          isDarkMode
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
            : 'bg-indigo-500 hover:bg-indigo-600 text-white'
       }`}
      >
        <i className="ri-file-list-3-line mr-1 lg:mr-2"></i>
        <span className="hidden sm:inline">MiCA Audit Logs</span>
        <span className="sm:hidden">Audit</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-7xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-h-[90vh] overflow-hidden`}>
        <div className={`p-4 lg:p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-3 lg:space-y-0">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <h2 className={`text-lg lg:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                MiCA Compliance Audit Logs
              </h2>
              <span className={`px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm ${isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800'}`}>
                {filteredLogs.length} entries
              </span>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-3">
              <button
                onClick={exportLogs}
                className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-xs lg:text-sm ${
                  isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
               }`}
              >
                <i className="ri-download-line mr-1 lg:mr-2"></i>
                Export JSON
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-2 rounded-lg ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-3 lg:space-y-0 lg:space-x-4 mb-4 lg:mb-6">
            <div className="relative flex-1 lg:flex-none">
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full lg:w-80 px-3 lg:px-4 py-2 pl-8 lg:pl-10 rounded-lg border text-xs lg:text-sm ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <i className={`ri-search-line absolute left-2 lg:left-3 top-1/2 transform -translate-y-1/2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}></i>
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className={`px-3 py-2 rounded-lg border text-xs lg:text-sm ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="overflow-y-auto max-h-96">
            {filteredLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <th className={`text-left py-3 px-2 lg:px-4 font-semibold text-xs lg:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Timestamp
                      </th>
                      <th className={`text-left py-3 px-2 lg:px-4 font-semibold text-xs lg:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        User ID
                      </th>
                      <th className={`text-left py-3 px-2 lg:px-4 font-semibold text-xs lg:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Action
                      </th>
                      <th className={`text-left py-3 px-2 lg:px-4 font-semibold text-xs lg:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Symbol
                      </th>
                      <th className={`text-left py-3 px-2 lg:px-4 font-semibold text-xs lg:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Amount
                      </th>
                      <th className={`text-left py-3 px-2 lg:px-4 font-semibold text-xs lg:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Status
                      </th>
                      <th className={`text-left py-3 px-2 lg:px-4 font-semibold text-xs lg:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        MiCA
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className={`border-b ${isDarkMode ? 'border-gray-700/50' : 'border-gray-100'}`}>
                        <td className={`py-3 px-2 lg:px-4 text-xs font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <div className="truncate max-w-32 lg:max-w-none">
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </td>
                        <td className={`py-3 px-2 lg:px-4 text-xs font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <div className="truncate max-w-24 lg:max-w-none">
                            {log.userId}
                          </div>
                        </td>
                        <td className={`py-3 px-2 lg:px-4 text-xs ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          <div className="truncate max-w-24 lg:max-w-none">
                            {log.action}
                          </div>
                        </td>
                        <td className={`py-3 px-2 lg:px-4 text-xs font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          {log.symbol || '-'}
                        </td>
                        <td className={`py-3 px-2 lg:px-4 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <div className="truncate max-w-20 lg:max-w-none">
                            {log.amount ? `${log.amount} ${log.symbol}` : '-'}
                          </div>
                        </td>
                        <td className="py-3 px-2 lg:px-4">
                          <span className={`px-1 lg:px-2 py-1 rounded-full text-xs font-medium ${
                            log.status === 'success'
                              ? (isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800')
                              : log.status === 'failed'
                              ? (isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800')
                              : (isDarkMode ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-100 text-yellow-800')
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 lg:px-4">
                          <div className="flex flex-col lg:flex-row lg:items-center space-y-1 lg:space-y-0 lg:space-x-2">
                            <span className={`px-1 lg:px-2 py-1 rounded text-xs ${
                              log.compliance.micaCompliant
                                ? (isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800')
                                : (isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800')
                            }`}>
                              {log.compliance.micaCompliant ? 'Compliant' : 'Non-compliant'}
                            </span>
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Risk: {log.compliance.riskScore}/10
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={`text-center py-8 lg:py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <i className="ri-file-list-3-line text-3xl lg:text-4xl mb-2"></i>
                <div>No audit logs found</div>
                <div className="text-xs lg:text-sm mt-1">Logs will appear as users perform actions</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
