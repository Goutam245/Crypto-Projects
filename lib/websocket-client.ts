
'use client';

export interface PriceData {
  symbol: string;
  price: string;
  priceChange: string;
  priceChangePercent: string;
  volume: string;
  high: string;
  low: string;
  timestamp: number;
}

export interface OrderBookData {
  symbol: string;
  bids: [string, string][];
  asks: [string, string][];
  timestamp: number;
}

class BinanceWebSocketClient {
  private ws: WebSocket | null = null;
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();
  private reconnectInterval = 5000;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isConnecting = false;

  connect() {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;
    
    try {
      const streams = [
        'btcusdt@ticker',
        'ethusdt@ticker',
        'solusdt@ticker',
        'adausdt@ticker',
        'dotusdt@ticker',
        'avaxusdt@ticker',
        'maticusdt@ticker',
        'linkusdt@ticker',
        'btcusdt@depth20@100ms',
        'ethusdt@depth20@100ms'
      ];
      
      const wsUrl = `wss://stream.binance.com:9443/ws/${streams.join('/')}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('Binance WebSocket connected');
        this.isConnecting = false;
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('Binance WebSocket disconnected');
        this.isConnecting = false;
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('Binance WebSocket error:', error);
        this.isConnecting = false;
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  private handleMessage(data: any) {
    if (data.e === '24hrTicker') {
      const priceData: PriceData = {
        symbol: data.s,
        price: data.c,
        priceChange: data.P,
        priceChangePercent: data.P,
        volume: data.v,
        high: data.h,
        low: data.l,
        timestamp: data.E
      };
      this.emit('ticker', priceData);
    } else if (data.e === 'depthUpdate') {
      const orderBookData: OrderBookData = {
        symbol: data.s,
        bids: data.b,
        asks: data.a,
        timestamp: data.E
      };
      this.emit('orderbook', orderBookData);
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    
    this.reconnectTimer = setTimeout(() => {
      console.log('Attempting to reconnect...');
      this.connect();
    }, this.reconnectInterval);
  }

  subscribe(event: string, callback: (data: any) => void) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event)!.add(callback);
  }

  unsubscribe(event: string, callback: (data: any) => void) {
    const eventSubscribers = this.subscribers.get(event);
    if (eventSubscribers) {
      eventSubscribers.delete(callback);
    }
  }

  private emit(event: string, data: any) {
    const eventSubscribers = this.subscribers.get(event);
    if (eventSubscribers) {
      eventSubscribers.forEach(callback => callback(data));
    }
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscribers.clear();
  }
}

export const binanceWS = new BinanceWebSocketClient();
