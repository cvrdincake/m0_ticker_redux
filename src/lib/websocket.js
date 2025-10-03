// WebSocket Connection Helper for Codespaces/HTTPS compatibility
export const createWebSocketConnection = (path = '') => {
  // Protocol-relative WebSocket URL for mixed content compatibility
  const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  const host = location.host;
  
  // For local development, use specific ports
  // For Codespaces, use the forwarded URL
  const wsUrl = location.hostname === 'localhost' 
    ? `${protocol}://localhost:8080${path}`
    : `${protocol}://${host}${path}`;
  
  console.log(`Connecting to WebSocket: ${wsUrl}`);
  
  return new WebSocket(wsUrl);
};

// Usage examples:
// const overlaySocket = createWebSocketConnection('');
// const controlSocket = createWebSocketConnection('/control');

export default createWebSocketConnection;