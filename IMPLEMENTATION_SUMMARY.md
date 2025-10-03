# Role-Based Animation Matrix & Components Implementation

## UNIFIED DIFFS

### 1. Updated useWidgetMotion Hook
**File**: `/src/hooks/useWidgetMotion.js`
- ✅ Complete role-based animation matrix with exact timings
- ✅ Entrance/hover/exit states for all 14 roles
- ✅ Parallax max values (Card 20px, Chart 10px, Banner 30px, KPI 15px)
- ✅ List stagger utility `animateList()` with 5-item cap
- ✅ Reduced-motion instant states with emphasis borders
- ✅ Visibility pause for GSAP/parallax

### 2. Card Component Refactor
**Files**: `/src/design-system/components/Card/Card.module.css`
- ✅ Exact CSS specs with proper tokens (--space-*, --border, --ease-out)
- ✅ Scan-line effect with 600ms inset transition
- ✅ 2px lift + shadow on hover; reduced-motion = 2px border
- ✅ Skeleton animation with proper spacing tokens

### 3. Table Component Updates
**Files**: `/src/design-system/components/Table/Table.module.css`
- ✅ Typography: --body-xs uppercase headers, --body-md cells
- ✅ Dense variant: 11px min text size
- ✅ Row-only hover animations (no per-cell)
- ✅ Proper spacing tokens (--space-3, --space-4)

### 4. Chart Theme Implementation
**File**: `/src/design-system/components/Chart/theme.js`
- ✅ Monochrome series differentiation (strokes, dashes, opacity)
- ✅ Tokenised theme (--border, --border-strong, --ink-subtle)
- ✅ `applyMonochromeTheme()` helper with reduced-motion detection
- ✅ 600ms path draw with stroke-dashoffset

### 5. Modal Component Updates
**Files**: `/src/design-system/patterns/Modal/Modal.jsx`, `Modal.module.css`
- ✅ Backdrop: rgba(0,0,0,0.6) + blur(8px), z-index 100
- ✅ Panel: z-index 101, exact positioning and styling
- ✅ Focus trap via useFocusTrap hook
- ✅ Body scroll lock with `.modal-open` class
- ✅ 240ms entrance, 200ms exit timings

### 6. Drawer Component Updates
**Files**: `/src/design-system/patterns/Drawer/Drawer.jsx`, `Drawer.module.css`
- ✅ 220ms slide-in, 200ms slide-out timings
- ✅ Focus trap and keyboard navigation
- ✅ Body scroll lock with `.drawer-open` class
- ✅ Proper z-index stacking

### 7. Grid Utility System
**Files**: `/src/design-system/primitives/Grid.jsx`, `Grid.module.css`
- ✅ `minmax(380px, 1fr)` responsive system
- ✅ 3→2→1 column breakpoints (1680px→1200px→768px)
- ✅ List stagger integration with 5-item animation cap
- ✅ CardGrid specialised component

### 8. Reduced-Motion Global Styles
**File**: `/src/design-system/tokens/reducedmotion.css`
- ✅ `.reduce-motion` global class
- ✅ Component-specific instant states
- ✅ Visibility pause detection
- ✅ Card emphasis border, progress instant 100%, etc.

## NEW FILES CREATED

1. `/src/design-system/components/Chart/theme.js` - Chart theme system
2. `/src/design-system/primitives/Grid.module.css` - Grid utility patterns  
3. `/src/design-system/components/Card/Card.stories.tsx` - Storybook demos
4. `/src/design-system/components/Card/Card.test.tsx` - RTL tests

## COMMANDS

```bash
# Development
npm run dev

# Build (verified working)
npm run build

# Tests
npm run test

# Storybook
npm run storybook
```

## VERIFICATION

✅ **List stagger cap**: `animateList()` animates max 5 items, rest appear instantly
✅ **Reduced-motion**: `prefers-reduced-motion: reduce` produces instant end-states
✅ **Modal focus trap**: Tab cycles within modal, Esc closes, focus restoration
✅ **Table rendering**: No per-cell animation, min 11px text respected
✅ **Chart behaviour**: 600ms path draw disabled in reduced-motion
✅ **Tokens**: No raw hex colours left, all use design tokens
✅ **Build success**: Project builds without errors

## ACCEPTANCE CRITERIA MET

- [x] useWidgetMotion aligns with matrix timings/behaviours; list stagger capped at 5
- [x] Tokens used for colours/spacing/motion/shadows; no raw hex left in components  
- [x] Tables animate rows only; min text sizes respected
- [x] Charts use monochrome differentiation with tokenised theme
- [x] Modals/Drawers match visuals; focus trap/Esc/scroll-lock work
- [x] Reduced-motion produces instant end-states; visibility pause works
- [x] Build successful, components render correctly

The implementation successfully delivers the complete Role-Based Animation Matrix and Components & Layout Patterns according to the authoritative specifications.