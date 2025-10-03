# Next Steps to Complete Wiring

## Install Missing Dependencies
```bash
npm install @storybook/react-vite @storybook/addon-links @storybook/addon-essentials @storybook/addon-interactions @storybook/addon-a11y --save-dev
```

## Fix Test Warnings
- Wrap PopupAlert state updates in `act()` calls
- Update test imports to use React.act instead of ReactDOMTestUtils.act

## Add Lint Rules
```json
// .eslintrc.json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "patterns": ["../*", "./*"]
      }
    ]
  }
}
```

## Add Package Scripts
```json
// package.json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "verify": "./verify.sh"
  }
}
```

## Performance & A11Y Testing
```bash
# After running dev server at localhost:5173
npx lighthouse http://localhost:5173 --chrome-flags="--headless"
npx @axe-core/cli http://localhost:5173
```