#!/bin/bash
# codespaces-500-diagnosis.sh - Comprehensive Codespaces port 5173 HTTP 500 diagnosis

set -e

echo "🔍 GitHub Codespaces HTTP 500 Diagnosis for Port 5173"
echo "======================================================"

# 1. Check what's binding to port 5173
echo ""
echo "1️⃣ Checking port 5173 bindings:"
echo "--------------------------------"
netstat -tlnp 2>/dev/null | grep :5173 || echo "❌ No processes on port 5173"
ss -tlnp 2>/dev/null | grep :5173 || echo "❌ No processes on port 5173 (ss)"
lsof -i :5173 2>/dev/null || echo "❌ No processes on port 5173 (lsof)"

# 2. Check Vite/Node processes
echo ""
echo "2️⃣ Running Vite/Node processes:"
echo "-------------------------------"
ps aux | grep -E "(vite|node.*5173)" | grep -v grep || echo "❌ No Vite processes found"

# 3. Check Codespaces environment
echo ""
echo "3️⃣ Codespaces Environment:"
echo "--------------------------"
echo "CODESPACES: ${CODESPACES:-not_set}"
echo "CODESPACE_NAME: ${CODESPACE_NAME:-not_set}"
echo "PORT: ${PORT:-not_set}"
echo "PWD: $(pwd)"

# 4. Check if port is exposed/forwarded
echo ""
echo "4️⃣ Port forwarding status:"
echo "-------------------------"
if command -v gh >/dev/null 2>&1; then
    gh codespace ports list 2>/dev/null || echo "❓ Could not list ports via gh cli"
else
    echo "❓ gh cli not available"
fi

# 5. Test local connectivity
echo ""
echo "5️⃣ Local connectivity test:"
echo "---------------------------"
curl -s -I http://localhost:5173/ 2>/dev/null || echo "❌ localhost:5173 not responding"
curl -s -I http://127.0.0.1:5173/ 2>/dev/null || echo "❌ 127.0.0.1:5173 not responding"
curl -s -I http://0.0.0.0:5173/ 2>/dev/null || echo "❌ 0.0.0.0:5173 not responding"

# 6. Check for common server files
echo ""
echo "6️⃣ Server configuration:"
echo "------------------------"
[ -f package.json ] && echo "✅ package.json exists" || echo "❌ No package.json"
[ -f vite.config.js ] && echo "✅ vite.config.js exists" || echo "❌ No vite.config.js"
[ -f src/main.jsx ] && echo "✅ src/main.jsx exists" || echo "❌ No src/main.jsx"
[ -f index.html ] && echo "✅ index.html exists" || echo "❌ No index.html"

# 7. Check recent logs
echo ""
echo "7️⃣ Recent npm/node logs:"
echo "------------------------"
if [ -f ~/.npm/_logs/*debug*.log ]; then
    echo "Latest npm debug log:"
    tail -20 ~/.npm/_logs/*debug*.log 2>/dev/null | head -10
else
    echo "❓ No npm debug logs found"
fi

# 8. Test different server starts
echo ""
echo "8️⃣ Testing server configurations:"
echo "---------------------------------"
echo "Available npm scripts:"
npm run 2>/dev/null | grep -E "(dev|start|serve)" || echo "❓ No dev scripts found"

echo ""
echo "✅ Diagnosis complete. See recommendations below."