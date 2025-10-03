#!/bin/bash
# Cleanup deprecated files and scripts

echo "🧹 Cleaning up deprecated files..."

# Remove .bak files
git rm -r $(git ls-files '*.bak' | tr '\n' ' ') 2>/dev/null || true

# Remove deprecated scripts
git rm -r scripts/*deprecated* 2>/dev/null || true
git rm -f migrate.sh 2>/dev/null || true
git rm -f codespaces-*.sh 2>/dev/null || true
git rm -f test-servers.sh 2>/dev/null || true

# Remove dead examples
git rm -f background.html 2>/dev/null || true
git rm -f broadcast_overlay.html 2>/dev/null || true

echo "✅ Cleanup complete"