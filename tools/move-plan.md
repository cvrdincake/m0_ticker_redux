# Move Plan

## FILES TO MOVE/RENAME

### Design System Patterns
- MOVE /workspaces/m0_ticker_redux/LowerThird.jsx → src/design-system/patterns/BroadcastOverlay/LowerThird.jsx
- MOVE /workspaces/m0_ticker_redux/PopupAlert.jsx → src/design-system/patterns/BroadcastOverlay/PopupAlert.jsx
- MOVE /workspaces/m0_ticker_redux/BroadcastOverlay.module.css → src/design-system/patterns/BroadcastOverlay/BroadcastOverlay.module.css
- MOVE /workspaces/m0_ticker_redux/PopupAlert.module.css → src/design-system/patterns/BroadcastOverlay/PopupAlert.module.css
- MOVE /workspaces/m0_ticker_redux/toastmanager.jsx → src/design-system/patterns/Toast/ToastManager.jsx

### Design System Components (consolidate)
- MOVE src/components/Portal/* → src/design-system/components/Portal/*
- MOVE src/components/ErrorBoundary/* → src/design-system/components/ErrorBoundary/*
- MOVE src/components/ConfigPanel/* → src/design-system/components/ConfigPanel/*

### Widgets
- MOVE /workspaces/m0_ticker_redux/AnimatedPath.jsx → src/widgets/AnimatedPath.jsx
- MOVE /workspaces/m0_ticker_redux/MonochromeLineChart.jsx → src/widgets/MonochromeLineChart.jsx

### Hooks
- MOVE /workspaces/m0_ticker_redux/focustraphook.js → src/hooks/useFocusTrap.js

### Lib Utilities
- MOVE /workspaces/m0_ticker_redux/charts.js → src/lib/charts.js
- MOVE /workspaces/m0_ticker_redux/particlefield.js → src/lib/particles.js
- MOVE /workspaces/m0_ticker_redux/particletiers.js → src/lib/particleTiers.js
- MOVE /workspaces/m0_ticker_redux/mousefollow.js → src/lib/mouseFollow.js
- MOVE /workspaces/m0_ticker_redux/performanceguards.js → src/lib/performanceGuards.js
- MOVE /workspaces/m0_ticker_redux/toggleflags.js → src/lib/toggleFlags.js
- MOVE /workspaces/m0_ticker_redux/globalgsap.js → src/lib/globalGsap.js
- MOVE src/utils/WebSocketClient.js → src/lib/websocket.js
- MOVE src/utils/animations.js → src/lib/animations.js
- MOVE src/utils/ticker.js → src/lib/ticker.js
- MOVE src/utils/cn.js → src/lib/utils.js (rename and consolidate)

### Styles (global CSS only)
- MOVE /workspaces/m0_ticker_redux/background.css → src/styles/background.css
- MOVE /workspaces/m0_ticker_redux/cards.css → src/styles/cards.css
- MOVE /workspaces/m0_ticker_redux/forms.css → src/styles/forms.css
- MOVE /workspaces/m0_ticker_redux/modals.css → src/styles/modals.css
- MOVE /workspaces/m0_ticker_redux/tables.css → src/styles/tables.css
- MOVE /workspaces/m0_ticker_redux/reducedmotion.css → src/styles/reducedmotion.css
- MOVE src/pages/status.css → src/styles/status.css

### Missing Primitives
- CREATE src/design-system/primitives/Box.jsx
- CREATE src/design-system/primitives/Stack.jsx 
- CREATE src/design-system/primitives/Grid.jsx

### Store
- RENAME src/store/dashboard.js → src/store/useDashboard.js

### Test Files
- MOVE src/utils/WebSocketClient.test.js → src/lib/websocket.test.js

## FILES TO DELETE

### Duplicates
- DELETE /workspaces/m0_ticker_redux/tokens.css (duplicate of design-system/tokens)
- DELETE /workspaces/m0_ticker_redux/designtokens.css (duplicate)
- DELETE src/utils/cn.ts (duplicate of cn.js)
- DELETE src/hooks/useDebounce.js (keep .ts version)
- DELETE src/hooks/useReducedMotion.js (keep .ts version)

### Root-level cleanup
- DELETE /workspaces/m0_ticker_redux/background.html
- DELETE /workspaces/m0_ticker_redux/server/index.cjs
- DELETE /workspaces/m0_ticker_redux/broadcast-server.cjs

### Test artifacts
- DELETE /workspaces/m0_ticker_redux/components.spec.js
- DELETE /workspaces/m0_ticker_redux/metrics.spec.js

## BARRELS TO CREATE/UPDATE

- CREATE src/design-system/patterns/index.js
- UPDATE src/design-system/components/index.js
- CREATE src/widgets/index.ts
- CREATE src/widgets/registry.ts
- UPDATE src/design-system/primitives/index.js