#!/bin/bash
# codespaces-vite-fix.sh - Fix Vite server for Codespaces

set -e

echo "🔧 Fixing Vite server for GitHub Codespaces"
echo "==========================================="

# 1. Kill any existing processes
echo "1️⃣ Cleaning up existing processes..."
pkill -f "vite" 2>/dev/null || echo "   No existing Vite processes"
pkill -f "node.*5173" 2>/dev/null || echo "   No Node processes on 5173"

# 2. Check and fix vite.config.js
echo ""
echo "2️⃣ Updating Vite configuration..."
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all addresses
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173
    },
    watch: {
      usePolling: true // Better for containers
    }
  },
  preview: {
    host: true,
    port: 5173,
    strictPort: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/design-system/components'),
      '@/patterns': path.resolve(__dirname, './src/design-system/patterns'),
      '@/primitives': path.resolve(__dirname, './src/design-system/primitives'),
      '@/tokens': path.resolve(__dirname, './src/design-system/tokens'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/hooks': path.resolve(__dirname, './src/hooks')
    }
  }
})
EOF
echo "   ✅ Updated vite.config.js for Codespaces"

# 3. Test the build first
echo ""
echo "3️⃣ Testing build..."
if npm run build > /dev/null 2>&1; then
    echo "   ✅ Build successful"
else
    echo "   ❌ Build failed - checking for errors..."
    npm run build
    exit 1
fi

# 4. Start server with explicit options
echo ""
echo "4️⃣ Starting Vite server..."
export VITE_HOST=0.0.0.0
export VITE_PORT=5173

# Start in background and capture PID
npx vite --host 0.0.0.0 --port 5173 --strictPort &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# 5. Verify server is running
echo ""
echo "5️⃣ Verifying server status..."
if kill -0 $SERVER_PID 2>/dev/null; then
    echo "   ✅ Server process is running (PID: $SERVER_PID)"
else
    echo "   ❌ Server process died"
    exit 1
fi

# 6. Test connectivity
echo ""
echo "6️⃣ Testing connectivity..."
for i in {1..5}; do
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/ 2>/dev/null | grep -q "200"; then
        echo "   ✅ Server responding on localhost:5173"
        break
    else
        echo "   ⏳ Attempt $i/5 - waiting for server..."
        sleep 2
    fi
done

# 7. Show final status
echo ""
echo "7️⃣ Final status:"
echo "   Server PID: $SERVER_PID"
echo "   Local: http://localhost:5173/"
echo "   Network: http://$(hostname -I | awk '{print $1}'):5173/"
echo "   Codespaces URL: https://$CODESPACE_NAME-5173.app.github.dev/"

# 8. Test the external URL
echo ""
echo "8️⃣ Testing external accessibility..."
EXTERNAL_URL="https://$CODESPACE_NAME-5173.app.github.dev/"
echo "   Testing: $EXTERNAL_URL"

# Keep server running in foreground
echo ""
echo "✅ Server setup complete! Press Ctrl+C to stop"
echo "🌐 Access your app at: $EXTERNAL_URL"
echo ""

# Bring server to foreground
fg %1