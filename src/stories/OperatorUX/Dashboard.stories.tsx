import type { Meta, StoryObj } from '@storybook/react';
import Dashboard from '@/pages/Dashboard';

// Mock the dashboard store for Storybook
const mockDashboardStore = {
  widgets: {
    'widget-1': {
      id: 'widget-1',
      kind: 'card',
      title: 'Sample Card',
      x: 0,
      y: 0,
      width: 4,
      height: 3,
      zIndex: 0,
      config: {
        dataSource: 'api/cards',
        motionPreset: 'card',
        density: 'comfortable',
        ariaLabel: 'Sample card widget'
      }
    },
    'widget-2': {
      id: 'widget-2',
      kind: 'chart',
      title: 'Performance Chart',
      x: 5,
      y: 0,
      width: 6,
      height: 4,
      zIndex: 1,
      config: {
        dataSource: 'api/metrics',
        motionPreset: 'chart',
        density: 'comfortable',
        ariaLabel: 'Performance metrics chart'
      }
    },
    'widget-3': {
      id: 'widget-3',
      kind: 'kpi',
      title: 'Key Metric',
      x: 0,
      y: 4,
      width: 3,
      height: 2,
      zIndex: 2,
      config: {
        dataSource: 'api/kpis',
        motionPreset: 'kpi',
        density: 'compact',
        ariaLabel: 'Key performance indicator'
      }
    }
  },
  selectedWidgetId: 'widget-1',
  activeDashboardId: 'dashboard-1',
  dashboards: {
    'dashboard-1': {
      id: 'dashboard-1',
      name: 'Sample Dashboard',
      widgets: ['widget-1', 'widget-2', 'widget-3'],
    },
  },
  layouts: ['dashboard-1'],
  globalData: {},
  toasts: [],
  popup: null,
  safeMode: false,
  highContrast: false,
  screenReaderMode: false,
  config: {
    autoRefresh: false,
    refreshInterval: 10000,
    showGrid: true,
    gridSize: 12,
    enableAnimations: true,
    animationSpeed: 1,
    enableParallax: false,
    defaultChartHeight: 320,
    showDataPoints: true,
    lineWidth: 2,
  },
  setGlobalData: () => {},
  getActiveDashboard: () => ({
    id: 'dashboard-1',
    name: 'Sample Dashboard',
    widgets: ['widget-1', 'widget-2', 'widget-3']
  }),
  addWidget: () => {},
  updateWidget: () => {},
  deleteWidget: () => {},
  selectWidget: () => {},
  nudgeWidget: () => {},
  resizeWidget: () => {},
  duplicateWidget: () => {},
  alignWidgets: () => {},
  distributeWidgets: () => {},
  bringToFront: () => {},
  sendToBack: () => {},
  raiseWidget: () => {},
  lowerWidget: () => {},
  exportDashboard: () => null,
  importDashboard: () => {},
  addWidgetToActive: () => {},
  updateWidgetConfig: () => {},
  switchLayout: () => {},
  getSelectedWidget: () => null,
  triggerToast: () => {},
  dismissToast: () => {},
  triggerPopup: () => {},
  dismissPopup: () => {},
  toggleSafeMode: () => {},
  toggleHighContrast: () => {},
  toggleScreenReaderMode: () => {},
  updateConfig: () => {},
  resetConfig: () => {},
  setAccent: () => {},
  accentH: 210,
  accentS: 50,
  accentL: 45,
};

// Mock the store hook
vi.mock('@/store/useDashboard', () => ({
  useDashboardStore: () => mockDashboardStore
}));

const meta = {
  title: 'Operator UX/Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Operator Dashboard

The operator dashboard provides a comprehensive interface for managing widgets with full keyboard and mouse accessibility.

## Features

### Inspector Panel (Right Rail)
- **Toggle**: Press \`I\` to toggle, \`Shift+I\` to open and focus
- **Widget Properties**: Title, data source, motion preset, density, ARIA label
- **Real-time Updates**: Debounced updates (200ms) for live preview
- **Accessibility**: Proper form labels, focus management

### Keyboard Operations
- **Arrow Keys**: Move widget by 1 grid unit
- **Shift + Arrows**: Resize widget by 1 unit
- **⌘/Ctrl + D**: Duplicate selected widget
- **Delete/Backspace**: Remove selected widget
- **Enter/Space**: Select widget
- **Tab**: Navigate between widgets

### Command Palette
- **Trigger**: \`⌘/Ctrl + K\` to open
- **Search**: Type to filter commands
- **Navigation**: ↑/↓ to navigate, ↵ to execute
- **Categories**: Add Widget, Align, Distribute, Layout, Mode

### Alignment & Snapping
- **Visual Guides**: Shows snap lines during drag operations
- **Tolerance**: 6px snap tolerance for precise alignment
- **Snap on Release**: Automatically snaps to nearest guide
- **Multi-select**: Support for aligning multiple widgets

### Z-Order Management
- **Layering**: Visual stacking with z-index control
- **Toolbar**: Bring to front, send to back, raise, lower
- **Context Menu**: Right-click for quick actions
- **Persistence**: Z-order saved with layout

### Accessibility Features
- **Focus Rings**: Tokenised focus indicators
- **Screen Reader**: ARIA labels, live regions for announcements
- **High Contrast**: Toggle mode for enhanced visibility
- **Keyboard Only**: Complete functionality without mouse
- **Role Attributes**: Proper semantic markup

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| \`⌘/Ctrl + K\` | Open command palette |
| \`I\` | Toggle inspector panel |
| \`Shift + I\` | Open and focus inspector |
| \`Arrow Keys\` | Move selected widget |
| \`Shift + Arrows\` | Resize selected widget |
| \`⌘/Ctrl + D\` | Duplicate widget |
| \`Delete\` | Remove widget |
| \`⌘/Ctrl + E\` | Export layout |
| \`⌘/Ctrl + I\` | Import layout |
| \`Esc\` | Close dialogs |
        `
      }
    },
    // Accessibility testing with axe
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            options: { noScroll: true }
          }
        ]
      }
    }
  },
  argTypes: {
    className: { control: 'text' }
  }
} satisfies Meta<typeof Dashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Dashboard (Operator Mode)',
  args: {},
  play: async ({ canvasElement, step }) => {
    // This would typically contain interaction tests
    // For now, we'll just document the interactions available
    await step('Widget Selection', async () => {
      console.log('Click on any widget to select it');
    });
    
    await step('Inspector Panel', async () => {
      console.log('Press I to toggle the inspector panel');
    });
    
    await step('Command Palette', async () => {
      console.log('Press Cmd/Ctrl+K to open the command palette');
    });
    
    await step('Keyboard Navigation', async () => {
      console.log('Use arrow keys to move widgets, Shift+arrows to resize');
    });
  }
};

export const WithInspectorOpen: Story = {
  name: 'Dashboard with Inspector',
  args: {},
  decorators: [
    (Story) => {
      // This would set the inspector to open by default
      return <Story />;
    }
  ]
};

export const HighContrastMode: Story = {
  name: 'High Contrast Mode',
  args: {},
  decorators: [
    (Story) => {
      return (
        <div className="hc">
          <Story />
        </div>
      );
    }
  ],
  parameters: {
    docs: {
      description: {
        story: 'Dashboard in high contrast mode for enhanced accessibility.'
      }
    }
  }
};

export const KeyboardOnlyDemo: Story = {
  name: 'Keyboard-Only Operation',
  args: {},
  parameters: {
    docs: {
      description: {
        story: `
## Keyboard-Only Workflow Demo

This story demonstrates a complete keyboard-only workflow:

1. **Tab** to navigate to first widget
2. **Arrow keys** to move widget position
3. **Shift + arrows** to resize widget
4. **⌘/Ctrl + D** to duplicate
5. **I** to open inspector
6. **Tab** to inspector fields, edit properties
7. **⌘/Ctrl + K** to open command palette
8. **Type** to search for "Export layout"
9. **Enter** to execute export
10. **Esc** to close dialogs

All functionality is accessible via keyboard navigation.
        `
      }
    }
  }
};