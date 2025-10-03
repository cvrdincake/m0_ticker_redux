import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WebSocketClient } from './websocket';

// Mock WebSocket
class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  constructor(url, protocols) {
    this.url = url;
    this.protocols = protocols;
    this.readyState = MockWebSocket.CONNECTING;
    this.onopen = null;
    this.onclose = null;
    this.onmessage = null;
    this.onerror = null;
    
    // Simulate async connection
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      if (this.onopen) this.onopen(new Event('open'));
    }, 10);
  }

  send(data) {
    if (this.readyState !== MockWebSocket.OPEN) {
      throw new Error('WebSocket is not open');
    }
  }

  close(code, reason) {
    this.readyState = MockWebSocket.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close', { code, reason }));
    }
  }
}

global.WebSocket = MockWebSocket;

describe('WebSocketClient', () => {
  let client;
  const testUrl = 'ws://localhost:8080/test';

  beforeEach(() => {
    vi.useFakeTimers();
    client = new WebSocketClient(testUrl);
  });

  afterEach(() => {
    if (client) {
      client.destroy();
    }
    vi.restoreAllTimers();
  });

  it('creates client with correct URL', () => {
    expect(client.url).toBe(testUrl);
  });

  it('connects and emits open event', async () => {
    const openHandler = vi.fn();
    client.on('open', openHandler);
    
    client.connect();
    
    // Fast-forward timers to trigger connection
    await vi.advanceTimersByTimeAsync(20);
    
    expect(openHandler).toHaveBeenCalled();
    expect(client.isConnected()).toBe(true);
  });

  it('handles reconnection with exponential backoff', async () => {
    const reconnectHandler = vi.fn();
    client.on('reconnect', reconnectHandler);
    
    client.connect();
    await vi.advanceTimersByTimeAsync(20);
    
    // Simulate connection loss
    client.ws.close();
    
    // Fast-forward to trigger first reconnect
    await vi.advanceTimersByTimeAsync(1000);
    
    expect(reconnectHandler).toHaveBeenCalledWith({
      attempt: 1,
      delay: expect.any(Number)
    });
  });

  it('sends messages when connected', async () => {
    const sendSpy = vi.spyOn(MockWebSocket.prototype, 'send');
    
    client.connect();
    await vi.advanceTimersByTimeAsync(20);
    
    const testData = { type: 'test', data: 'hello' };
    client.send(testData);
    
    expect(sendSpy).toHaveBeenCalledWith(JSON.stringify(testData));
  });

  it('throws error when sending while disconnected', () => {
    expect(() => {
      client.send({ test: 'data' });
    }).toThrow('WebSocket is not connected');
  });

  it('stops reconnection after max attempts', async () => {
    client.options.maxReconnectAttempts = 2;
    const errorHandler = vi.fn();
    client.on('error', errorHandler);
    
    client.connect();
    await vi.advanceTimersByTimeAsync(20);
    
    // Simulate multiple connection failures
    for (let i = 0; i < 3; i++) {
      client.ws.close();
      await vi.advanceTimersByTimeAsync(5000);
    }
    
    expect(errorHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Max reconnect attempts reached'
      })
    );
  });

  it('handles heartbeat mechanism', async () => {
    client.options.heartbeatInterval = 100;
    const sendSpy = vi.spyOn(MockWebSocket.prototype, 'send');
    
    client.connect();
    await vi.advanceTimersByTimeAsync(20);
    
    // Fast-forward past heartbeat interval
    await vi.advanceTimersByTimeAsync(150);
    
    expect(sendSpy).toHaveBeenCalledWith('ping');
  });

  it('responds to pong messages', async () => {
    client.connect();
    await vi.advanceTimersByTimeAsync(20);
    
    const initialPongTime = client.lastPongTime;
    
    // Simulate pong response
    client.ws.onmessage(new MessageEvent('message', { data: 'pong' }));
    
    expect(client.lastPongTime).toBeGreaterThan(initialPongTime);
  });

  it('cleans up on destroy', () => {
    client.connect();
    const disconnectSpy = vi.spyOn(client, 'disconnect');
    
    client.destroy();
    
    expect(disconnectSpy).toHaveBeenCalled();
    expect(client.isDestroyed).toBe(true);
  });

  it('provides connection stats', async () => {
    client.connect();
    await vi.advanceTimersByTimeAsync(20);
    
    const stats = client.getStats();
    
    expect(stats).toEqual({
      isConnected: true,
      reconnectAttempts: 0,
      lastPongTime: expect.any(Number),
      url: testUrl,
      readyState: MockWebSocket.OPEN
    });
  });
});