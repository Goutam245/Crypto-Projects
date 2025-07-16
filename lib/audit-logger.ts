'use client';

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  userId: string;
  action: string;
  symbol?: string;
  amount?: number;
  price?: number;
  side?: 'buy' | 'sell';
  orderType?: 'market' | 'limit';
  status: 'success' | 'failed' | 'pending';
  ipAddress?: string;
  userAgent?: string;
  compliance: {
    micaCompliant: boolean;
    riskScore: number; // TODO: Replace with real backend risk score if applicable
    region: string;
  };
}

class AuditLogger {
  private logs: AuditLogEntry[] = [];
  private maxLogs = 10000;

  constructor() {
    this.loadFromStorage();
  }

  log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const logEntry: AuditLogEntry = {
      ...entry,
      id: this.generateId(),
      timestamp: Date.now(),
    };

    this.logs.unshift(logEntry);

    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    this.saveToStorage();
    console.log('MiCA Audit Log:', logEntry);
  }

  getRecentLogs(limit: number = 100): AuditLogEntry[] {
    return this.logs.slice(0, limit);
  }

  getLogsByUser(userId: string, limit: number = 100): AuditLogEntry[] {
    return this.logs.filter(log => log.userId === userId).slice(0, limit);
  }

  getLogsBySymbol(symbol: string, limit: number = 100): AuditLogEntry[] {
    return this.logs.filter(log => log.symbol === symbol).slice(0, limit);
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return `log_${crypto.randomUUID()}`;
    } else {
      return `log_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('cryptodash_audit_logs', JSON.stringify(this.logs));
      } catch (error) {
        console.error('Failed to save audit logs:', error);
      }
    }
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem('cryptodash_audit_logs');
        if (stored) {
          this.logs = JSON.parse(stored);
        }
      } catch (error) {
        console.error('Failed to load audit logs:', error);
        this.logs = [];
      }
    } else {
      this.logs = []; // fallback
    }
  }
}

export const auditLogger = new AuditLogger();
