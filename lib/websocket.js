/**
 * Hardened WebSocket client with exponential backoff, heartbeat, and visibility API
 */

class WebSocketClient {
  constructor(url, options = {}) {
    this.url = url;
    this.options = {
      maxReconnectAttempts: 10,
      initialReconnectDelay: 1000,
      maxReconnectDelay: 30000,
      heartbeatInterval: 30000,
      heartbeatTimeout: 10000,
      protocols: [],
      ...options
    };
    
    this.ws = null;
    this.reconnectAttempts = 0;
    this.reconnectTimer = null;
    this.heartbeatTimer = null;
    this.heartbeatTimeoutTimer = null;
    this.lastPongTime = 0;
    
    this.isConnecting = false;
    this.isDestroyed = false;
    this.shouldReconnect = true;
    
    // Event listeners
    this.listeners = {
      open: new Set(),
      message: new Set(),
      close: new Set(),
      error: new Set(),
      reconnect: new Set()
    };
    
    // Bind methods
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleOnline = this.handleOnline.bind(this);
    this.handleOffline = this.handleOffline.bind(this);
    
    // Register visibility and network listeners
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
    }
  }
  
  /**
   * Connect to WebSocket
   */
  connect() {
    if (this.isDestroyed || this.isConnecting || this.isConnected()) {
      return;
    }
    
    this.isConnecting = true;
    
    try {
      this.ws = new WebSocket(this.url, this.options.protocols);
      
      this.ws.onopen = (event) => {
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.lastPongTime = Date.now();
        
        this.startHeartbeat();
        this.emit('open', event);
      };
      
      this.ws.onmessage = (event) => {
        // Handle pong responses
        if (event.data === 'pong') {
          this.lastPongTime = Date.now();
          this.clearHeartbeatTimeout();
          return;
        }
        
        try {
          const data = JSON.parse(event.data);
          this.emit('message', data);
        } catch (error) {
          // Handle non-JSON messages
          this.emit('message', event.data);
        }
      };
      
      this.ws.onclose = (event) => {
        this.isConnecting = false;
        this.stopHeartbeat();
        
        this.emit('close', event);
        
        if (this.shouldReconnect && !this.isDestroyed) {
          this.scheduleReconnect();
        }
      };
      
      this.ws.onerror = (event) => {
        this.isConnecting = false;
        this.emit('error', event);
      };
      
    } catch (error) {
      this.isConnecting = false;
      this.emit('error', error);
      
      if (this.shouldReconnect && !this.isDestroyed) {
        this.scheduleReconnect();
      }
    }
  }
  
  /**
   * Disconnect WebSocket
   */
  disconnect(code = 1000, reason = '') {
    this.shouldReconnect = false;
    this.clearReconnectTimer();
    this.stopHeartbeat();
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close(code, reason);
    }
  }
  
  /**
   * Send message
   */
  send(data) {
    if (!this.isConnected()) {
      throw new Error('WebSocket is not connected');
    }
    
    const message = typeof data === 'string' ? data : JSON.stringify(data);
    this.ws.send(message);
  }
  
  /**
   * Check if connected
   */
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
  
  /**
   * Add event listener
   */
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].add(callback);
    }
  }
  
  /**
   * Remove event listener
   */
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].delete(callback);
    }
  }
  
  /**
   * Emit event to listeners
   */
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`WebSocket listener error for ${event}:`, error);
        }
      });
    }
  }
  
  /**
   * Schedule reconnection with exponential backoff
   */
  scheduleReconnect() {
    if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
      this.emit('error', new Error('Max reconnect attempts reached'));
      return;
    }
    
    const delay = Math.min(
      this.options.initialReconnectDelay * Math.pow(2, this.reconnectAttempts),
      this.options.maxReconnectDelay
    );
    
    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      this.emit('reconnect', { attempt: this.reconnectAttempts, delay });
      this.connect();
    }, delay);
  }
  
  /**
   * Clear reconnect timer
   */
  clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
  
  /**
   * Start heartbeat mechanism
   */
  startHeartbeat() {
    this.stopHeartbeat();
    
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.send('ping');
        this.startHeartbeatTimeout();
      }
    }, this.options.heartbeatInterval);
  }
  
  /**
   * Stop heartbeat mechanism
   */
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    this.clearHeartbeatTimeout();
  }
  
  /**
   * Start heartbeat timeout
   */
  startHeartbeatTimeout() {
    this.clearHeartbeatTimeout();
    
    this.heartbeatTimeoutTimer = setTimeout(() => {
      // No pong received, connection may be dead
      this.disconnect(1000, 'Heartbeat timeout');
    }, this.options.heartbeatTimeout);
  }
  
  /**
   * Clear heartbeat timeout
   */
  clearHeartbeatTimeout() {
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer);
      this.heartbeatTimeoutTimer = null;
    }
  }
  
  /**
   * Handle visibility change
   */
  handleVisibilityChange() {
    if (typeof document === 'undefined') return;
    
    if (document.visibilityState === 'visible') {
      // Page became visible, reconnect if needed
      if (!this.isConnected() && this.shouldReconnect) {
        this.connect();
      }
    } else {
      // Page hidden, reduce activity
      this.stopHeartbeat();
    }
  }
  
  /**
   * Handle online event
   */
  handleOnline() {
    if (!this.isConnected() && this.shouldReconnect) {
      this.reconnectAttempts = 0; // Reset attempts on network recovery
      this.connect();
    }
  }
  
  /**
   * Handle offline event
   */
  handleOffline() {
    this.disconnect(1000, 'Network offline');
  }
  
  /**
   * Get connection stats
   */
  getStats() {
    return {
      isConnected: this.isConnected(),
      reconnectAttempts: this.reconnectAttempts,
      lastPongTime: this.lastPongTime,
      url: this.url,
      readyState: this.ws ? this.ws.readyState : WebSocket.CLOSED
    };
  }
  
  /**
   * Destroy client and cleanup
   */
  destroy() {
    this.isDestroyed = true;
    this.shouldReconnect = false;
    
    this.disconnect();
    this.clearReconnectTimer();
    this.stopHeartbeat();
    
    // Remove event listeners
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    }
    
    // Clear all listeners
    Object.values(this.listeners).forEach(set => set.clear());
  }
}

export { WebSocketClient };