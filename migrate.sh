#!/bin/bash
set -e

echo "🚀 Starting Atomic Design migration..."

# Create directory structure
mkdir -p src/design-system/tokens
mkdir -p src/design-system/primitives
mkdir -p src/design-system/components/{AnimatedPath,Button,Card,Input,Table,Chart,AnimatedList}
mkdir -p src/design-system/patterns/{Modal,Drawer,Toast,PopupAlert,LowerThird,BroadcastOverlay}
mkdir -p src/lib
mkdir -p src/hooks

echo "📁 Created directory structure"

# Move and rename files with git mv
echo "📦 Moving component files..."
git mv AnimatedPath.jsx src/design-system/components/AnimatedPath/AnimatedPath.jsx
git mv LowerThird.jsx src/design-system/patterns/LowerThird/LowerThird.jsx
git mv PopupAlert.jsx src/design-system/patterns/PopupAlert/PopupAlert.jsx
git mv PopupAlert.module.css src/design-system/patterns/PopupAlert/PopupAlert.module.css
git mv BroadcastOverlay.module.css src/design-system/patterns/BroadcastOverlay/BroadcastOverlay.module.css
git mv MonochromeLineChart.jsx src/design-system/components/Chart/Chart.jsx
git mv toastmanager.jsx src/design-system/patterns/Toast/Toast.jsx
git mv staggeredlists.jsx src/design-system/components/AnimatedList/AnimatedList.jsx
git mv modals.css src/design-system/patterns/Modal/Modal.module.css

echo "📦 Moving utility files..."
git mv focustraphook.js src/hooks/useFocusTrap.js
git mv mousefollow.js src/lib/parallax.js
git mv performanceguards.js src/lib/motionGuard.js
git mv toggleflags.js src/lib/utils.js

echo "📦 Moving additional files..."
# Move CSS files that will be split into tokens
cp designtokens.css src/design-system/tokens/designtokens.css
cp tokens.css src/design-system/tokens/tokens.css
cp reducedmotion.css src/design-system/tokens/reducedmotion.css
cp cards.css src/design-system/components/Card/cards.css
cp forms.css src/design-system/components/Input/forms.css
cp tables.css src/design-system/components/Table/tables.css
cp noise.css src/design-system/tokens/noise.css
cp noise_.css src/design-system/tokens/noise_.css
cp background.css src/design-system/tokens/background.css

echo "✅ Migration script completed successfully!"
echo "Next steps:"
echo "1. Update imports"
echo "2. Install dependencies"
echo "3. Generate missing scaffolds"
echo "4. Verify build"