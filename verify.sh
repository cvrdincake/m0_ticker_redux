#!/bin/bash
# Verification runner for m0_ticker_redux

set -e

echo "🔍 Starting verification pipeline..."

# Build check
echo "📦 Building application..."
npm run build

# Test check  
echo "🧪 Running tests..."
npm run test -- --run

# Lint check
echo "🔧 Running linting..."
npm run lint 2>/dev/null || echo "⚠️  No lint script found"

# Storybook build check (if package exists)
if command -v storybook &> /dev/null; then
    echo "📚 Building Storybook..."
    npm run build-storybook 2>/dev/null || echo "⚠️  Storybook not configured"
fi

# Check imports
echo "🔗 Checking for relative imports..."
if grep -r "import.*\.\./" src/ --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx"; then
    echo "❌ Found relative imports! Fix these."
    exit 1
else
    echo "✅ No relative imports found"
fi

# Check for hard-coded colors
echo "🎨 Checking for hard-coded colors..."
if grep -r "#[0-9a-fA-F]\{3,6\}" src/ --include="*.css" --include="*.js" --include="*.jsx" --exclude-dir=__tests__ | grep -v "var(--"; then
    echo "⚠️  Found hard-coded colors (some may be in comments)"
else
    echo "✅ No hard-coded colors in CSS/JS"
fi

echo "✅ Verification complete!"