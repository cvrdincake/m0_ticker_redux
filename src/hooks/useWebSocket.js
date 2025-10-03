import { useEffect, useRef, useState } from 'react';
import { WebSocketClient } from '@/lib/websocket';

/**
 * React hook for WebSocket connection with automatic reconnection
 */
export function useWebSocket(url, options = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [connectionStats, setConnectionStats] = useState(null);
  const clientRef = useRef(null);
  
  useEffect(() => {
    if (!url) return;
    
    const client = new WebSocketClient(url, options);
    clientRef.current = client;
    
    client.on('open', () => {
      setIsConnected(true);
      setConnectionStats(client.getStats());
    });
    
    client.on('message', (data) => {
      setLastMessage({ data, timestamp: Date.now() });
    });
    
    client.on('close', () => {
      setIsConnected(false);
      setConnectionStats(client.getStats());
    });
    
    client.on('error', (error) => {
      console.error('WebSocket error:', error);
      setConnectionStats(client.getStats());
    });
    
    client.on('reconnect', (info) => {
      console.log(`WebSocket reconnecting (attempt ${info.attempt})`);
      setConnectionStats(client.getStats());
    });
    
    client.connect();
    
    return () => {
      client.destroy();
    };
  }, [url]);
  
  const sendMessage = (data) => {
    if (clientRef.current && isConnected) {
      clientRef.current.send(data);
    }
  };
  
  const disconnect = () => {
    if (clientRef.current) {
      clientRef.current.disconnect();
    }
  };
  
  const reconnect = () => {
    if (clientRef.current) {
      clientRef.current.connect();
    }
  };
  
  return {
    isConnected,
    lastMessage,
    connectionStats,
    sendMessage,
    disconnect,
    reconnect
  };
}