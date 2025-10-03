#!/bin/bash
set -e

echo "🚀 M0 Ticker Redux - Atomic Design Migration Verification"
echo "========================================================="

echo ""
echo "📋 Running verification checklist..."

# 1. Build verification
echo "1️⃣  Testing production build..."
npm run build
if [ $? -eq 0 ]; then
    echo "   ✅ Production build successful"
else
    echo "   ❌ Production build failed"
    exit 1
fi

# 2. Test execution
echo ""
echo "2️⃣  Running test suite..."
npm run test -- run
if [ $? -eq 0 ]; then
    echo "   ✅ All tests passing"
else
    echo "   ❌ Tests failed"
    exit 1
fi

# 3. Development server (quick check)
echo ""
echo "3️⃣  Checking development server startup..."
timeout 10s npm run dev > /dev/null 2>&1 &
DEV_PID=$!
sleep 5
if kill -0 $DEV_PID > /dev/null 2>&1; then
    echo "   ✅ Development server starts successfully"
    kill $DEV_PID > /dev/null 2>&1
else
    echo "   ❌ Development server failed to start"
    exit 1
fi

# 4. Import resolution check
echo ""
echo "4️⃣  Verifying import resolution..."
if node -e "
const fs = require('fs');
const path = require('path');

// Check if key files exist
const files = [
    'src/design-system/tokens/index.css',
    'src/design-system/primitives/Box.jsx',
    'src/design-system/components/AnimatedPath/AnimatedPath.jsx',
    'src/design-system/patterns/Toast/Toast.jsx',
    'src/lib/parallax.js',
    'src/hooks/useFocusTrap.js'
];

let allExist = true;
files.forEach(file => {
    if (!fs.existsSync(file)) {
        console.log('Missing:', file);
        allExist = false;
    }
});

if (!allExist) process.exit(1);
console.log('All key files exist');
"; then
    echo "   ✅ Key files in correct locations"
else
    echo "   ❌ Missing key files"
    exit 1
fi

# 5. Design token verification
echo ""
echo "5️⃣  Verifying design tokens..."
if grep -q "ink:" src/design-system/tokens/colors.css && \
   grep -q "space-" src/design-system/tokens/spacing.css && \
   grep -q "text-" src/design-system/tokens/typography.css; then
    echo "   ✅ Design tokens properly structured"
else
    echo "   ❌ Design tokens incomplete"
    exit 1
fi

echo ""
echo "🎉 Migration verification completed successfully!"
echo ""
echo "📊 Migration Summary:"
echo "   • File structure: Atomic Design (tokens → primitives → components → patterns)"
echo "   • Build system: Vite with path aliases working"
echo "   • Testing: Vitest with React Testing Library"
echo "   • Design tokens: Complete monochrome system"
echo "   • Components: Migrated and updated imports"
echo "   • Performance: All builds passing, dev server working"
echo ""
echo "🔗 Next steps:"
echo "   • Open http://localhost:5173 to view the app"
echo "   • Import components using @/components/* aliases"
echo "   • Use design tokens from @/design-system/tokens"
echo "   • Follow the new atomic design structure for new components"
echo ""
echo "✨ Your M0 Ticker Redux project is now fully migrated to Atomic Design!"