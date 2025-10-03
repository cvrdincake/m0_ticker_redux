// Widget registry for the dashboard system
export const widgetRegistry = {
  'animated-path': {
    name: 'Animated Path',
    component: () => import('./AnimatedPath'),
    category: 'charts',
    description: 'Animated SVG path widget'
  },
  'monochrome-line-chart': {
    name: 'Monochrome Line Chart', 
    component: () => import('./MonochromeLineChart'),
    category: 'charts',
    description: 'Simple line chart widget'
  }
};

export function getWidget(type: keyof typeof widgetRegistry) {
  return widgetRegistry[type];
}

export function getWidgetTypes() {
  return Object.keys(widgetRegistry);
}