// Broadcast WebSocket Server
const WebSocket = require('ws');
const http = require('http');
const crypto = require('crypto');

const PORT = 8080;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || crypto.randomBytes(32).toString('hex');

console.log(`Admin Token: ${ADMIN_TOKEN}`);
console.log('Save this token securely - required for control dashboard auth');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Store active widgets state
const state = {
  ticker: {
    active: false,
    message: '',
    speed: 20,
    fontSize: 14,
    fontWeight: 300,
    color: '#ffffff'
  },
  popup: {
    active: false,
    title: '',
    message: '',
    icon: null,
    duration: 5000
  },
  brb: {
    active: false,
    message: 'Be Right Back',
    subtitle: 'Stream will resume shortly',
    estimatedTime: null
  },
  countdown: {
    active: false,
    label: 'Starting In',
    targetTime: null
  },
  stats: {
    active: false,
    metrics: []
  }
};

// Track connected clients
const clients = {
  overlays: new Set(),
  controllers: new Set()
};

wss.on('connection', (ws, req) => {
  const clientType = req.url.includes('control') ? 'controllers' : 'overlays';
  
  console.log(`New ${clientType} connection from ${req.socket.remoteAddress}`);
  clients[clientType].add(ws);
  
  // Send current state to new overlay clients
  if (clientType === 'overlays') {
    ws.send(JSON.stringify({ type: 'STATE_SYNC', payload: state }));
  }
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      handleMessage(ws, message, clientType);
    } catch (err) {
      console.error('Invalid message:', err);
      ws.send(JSON.stringify({ type: 'ERROR', message: 'Invalid JSON' }));
    }
  });
  
  ws.on('close', () => {
    console.log(`${clientType} disconnected`);
    clients[clientType].delete(ws);
  });
  
  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});

function handleMessage(ws, message, clientType) {
  const { type, payload, token } = message;
  
  // Auth check for control commands
  if (clientType === 'controllers' && type !== 'PING') {
    if (token !== ADMIN_TOKEN) {
      ws.send(JSON.stringify({ type: 'ERROR', message: 'Unauthorized' }));
      return;
    }
  }
  
  switch (type) {
    case 'PING':
      ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
      break;
      
    case 'UPDATE_TICKER':
      state.ticker = { ...state.ticker, ...payload };
      broadcast('overlays', { type: 'TICKER_UPDATE', payload: state.ticker });
      ws.send(JSON.stringify({ type: 'ACK', widget: 'ticker' }));
      break;
      
    case 'UPDATE_POPUP':
      state.popup = { ...state.popup, ...payload };
      broadcast('overlays', { type: 'POPUP_UPDATE', payload: state.popup });
      ws.send(JSON.stringify({ type: 'ACK', widget: 'popup' }));
      break;
      
    case 'UPDATE_BRB':
      state.brb = { ...state.brb, ...payload };
      broadcast('overlays', { type: 'BRB_UPDATE', payload: state.brb });
      ws.send(JSON.stringify({ type: 'ACK', widget: 'brb' }));
      break;
      
    case 'UPDATE_COUNTDOWN':
      state.countdown = { ...state.countdown, ...payload };
      broadcast('overlays', { type: 'COUNTDOWN_UPDATE', payload: state.countdown });
      ws.send(JSON.stringify({ type: 'ACK', widget: 'countdown' }));
      break;
      
    case 'UPDATE_STATS':
      state.stats = { ...state.stats, ...payload };
      broadcast('overlays', { type: 'STATS_UPDATE', payload: state.stats });
      ws.send(JSON.stringify({ type: 'ACK', widget: 'stats' }));
      break;
      
    case 'TRIGGER_POPUP':
      broadcast('overlays', { type: 'POPUP_TRIGGER', payload });
      ws.send(JSON.stringify({ type: 'ACK', widget: 'popup' }));
      break;
      
    case 'GET_STATE':
      ws.send(JSON.stringify({ type: 'STATE_SYNC', payload: state }));
      break;
      
    default:
      ws.send(JSON.stringify({ type: 'ERROR', message: 'Unknown message type' }));
  }
}

function broadcast(clientType, message) {
  const data = JSON.stringify(message);
  clients[clientType].forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// Health check endpoint
server.on('request', (req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      overlays: clients.overlays.size,
      controllers: clients.controllers.size,
      uptime: process.uptime()
    }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

// Central error logging (no silent 500s)
server.on('error', (err) => {
  console.error('[ERR] Server error:', err.stack || err);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Broadcast server running on port ${PORT}`);
  console.log(`Listening on http://0.0.0.0:${PORT}`);
  console.log(`Overlay: ws://localhost:${PORT}`);
  console.log(`Control: ws://localhost:${PORT}/control`);
  console.log(`Health:  http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  wss.clients.forEach(client => client.close());
  server.close(() => process.exit(0));
});