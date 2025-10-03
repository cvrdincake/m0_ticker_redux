#!/usr/bin/env node

// Health check script for Codespaces connectivity
import http from 'http';

const checkServer = (port, path = '') => {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://127.0.0.1:${port}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data.slice(0, 200) // First 200 chars
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(5000, () => reject(new Error('Timeout')));
  });
};

console.log('🔍 Checking server connectivity...\n');

// Check Vite server
try {
  const viteResult = await checkServer(5173);
  console.log('✅ Vite Server (5173)');
  console.log(`   Status: ${viteResult.status}`);
  console.log(`   Content-Type: ${viteResult.headers['content-type']}`);
  console.log(`   Body preview: ${viteResult.body.replace(/\n/g, ' ').slice(0, 50)}...`);
} catch (err) {
  console.log('❌ Vite Server (5173)');
  console.log(`   Error: ${err.message}`);
}

console.log('');

// Check Broadcast server
try {
  const broadcastResult = await checkServer(8080, '/health');
  console.log('✅ Broadcast Server (8080)');
  console.log(`   Status: ${broadcastResult.status}`);
  console.log(`   Health: ${broadcastResult.body}`);
} catch (err) {
  console.log('❌ Broadcast Server (8080)');
  console.log(`   Error: ${err.message}`);
}

console.log('\n📋 Configuration Summary:');
console.log('   Vite: host: true (binds 0.0.0.0:5173)');
console.log('   Broadcast: binds 0.0.0.0:8080');
console.log('   Both servers configured for Codespaces port forwarding');

console.log('\n🌐 Access URLs:');
console.log('   Local Vite: http://localhost:5173');
console.log('   Local Broadcast: http://localhost:8080');
console.log('   Codespaces: Use forwarded URLs from Ports panel');
console.log('   Protocol: Use wss:// for WebSocket over HTTPS forwarded URLs');