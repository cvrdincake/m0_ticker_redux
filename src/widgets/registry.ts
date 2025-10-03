import { z } from 'zod';
import { 
  Card, 
  Table, 
  MonochromeLineChart, 
  AnimatedList, 
  KPITile 
} from '@/design-system/components';
import { 
  PopupAlert, 
  LowerThird, 
  ToastManager 
} from '@/design-system/patterns';

export type WidgetKind = 
  | 'card' 
  | 'kpi' 
  | 'table' 
  | 'chart' 
  | 'list' 
  | 'toast-panel' 
  | 'lower-third' 
  | 'popup-alert';

export interface WidgetSpec {
  kind: WidgetKind;
  title: string;
  component: React.ComponentType<any>;
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
  schema: z.ZodSchema;
  defaults: Record<string, any>;
  roles: string[];
  parallaxMax: number;
  contexts: ('dashboard' | 'overlay')[];
}

const cardSchema = z.object({
  title: z.string().optional(),
  text: z.string().optional(),
  icon: z.string().optional(),
  density: z.enum(['compact', 'comfortable', 'relaxed']).default('comfortable'),
});

const kpiSchema = z.object({
  label: z.string(),
  value: z.union([z.number(), z.string()]),
  unit: z.string().optional(),
  trend: z.enum(['up', 'down']).nullable().optional(),
});

const tableSchema = z.object({
  columns: z.array(z.object({
    key: z.string(),
    label: z.string(),
    align: z.enum(['left', 'center', 'right']).default('left'),
  })),
  rows: z.array(z.record(z.string(), z.any())),
  dense: z.boolean().default(false),
  maxRows: z.number().default(10),
});

const chartSchema = z.object({
  series: z.array(z.object({
    key: z.string(),
    label: z.string(),
  })),
  data: z.array(z.record(z.string(), z.any())),
  yDomain: z.tuple([z.number(), z.number()]).optional(),
  xFormat: z.string().optional(),
  yFormat: z.string().optional(),
  animate: z.boolean().default(true),
});

const listSchema = z.object({
  items: z.array(z.object({
    id: z.union([z.string(), z.number()]),
    content: z.string(),
  })),
  animate: z.boolean().default(true),
});

const toastPanelSchema = z.object({
  info: z.string().default('Toast demo controls'),
});

const lowerThirdSchema = z.object({
  message: z.string(),
  active: z.boolean().default(false),
  speedPxPerSec: z.number().default(60),
  safeAreaBottom: z.boolean().default(true),
});

const popupAlertSchema = z.object({
  title: z.string(),
  message: z.string(),
  active: z.boolean().default(false),
  duration: z.number().default(5000),
});

const WIDGET_SPECS: Record<WidgetKind, WidgetSpec> = {
  card: {
    kind: 'card',
    title: 'Card',
    component: Card,
    defaultSize: { w: 2, h: 2 },
    minSize: { w: 1, h: 1 },
    schema: cardSchema,
    defaults: {
      title: 'Card Title',
      text: 'Card content goes here',
      density: 'comfortable',
    },
    roles: ['content'],
    parallaxMax: 0.2,
    contexts: ['dashboard'],
  },
  kpi: {
    kind: 'kpi',
    title: 'KPI Tile',
    component: KPITile,
    defaultSize: { w: 1, h: 1 },
    minSize: { w: 1, h: 1 },
    schema: kpiSchema,
    defaults: {
      label: 'Metric',
      value: 42,
      unit: '%',
      trend: null,
    },
    roles: ['banner'],
    parallaxMax: 0.1,
    contexts: ['dashboard'],
  },
  table: {
    kind: 'table',
    title: 'Data Table',
    component: Table,
    defaultSize: { w: 4, h: 3 },
    minSize: { w: 2, h: 2 },
    schema: tableSchema,
    defaults: {
      columns: [
        { key: 'symbol', label: 'Symbol', align: 'left' },
        { key: 'price', label: 'Price', align: 'right' },
        { key: 'change', label: 'Change', align: 'right' },
      ],
      rows: [
        { symbol: 'AAPL', price: '$150.00', change: '+1.2%' },
        { symbol: 'GOOGL', price: '$2800.00', change: '-0.5%' },
        { symbol: 'MSFT', price: '$305.00', change: '+0.8%' },
      ],
      dense: false,
      maxRows: 10,
    },
    roles: ['content'],
    parallaxMax: 0.15,
    contexts: ['dashboard'],
  },
  chart: {
    kind: 'chart',
    title: 'Chart',
    component: MonochromeLineChart,
    defaultSize: { w: 4, h: 3 },
    minSize: { w: 2, h: 2 },
    schema: chartSchema,
    defaults: {
      series: [
        { key: 'value', label: 'Value' },
      ],
      data: [
        { x: '1', value: 100 },
        { x: '2', value: 120 },
        { x: '3', value: 110 },
        { x: '4', value: 140 },
        { x: '5', value: 130 },
      ],
      animate: true,
    },
    roles: ['progress'],
    parallaxMax: 0.3,
    contexts: ['dashboard'],
  },
  list: {
    kind: 'list',
    title: 'Animated List',
    component: AnimatedList,
    defaultSize: { w: 2, h: 3 },
    minSize: { w: 1, h: 2 },
    schema: listSchema,
    defaults: {
      items: [
        { id: 1, content: 'Market data active' },
        { id: 2, content: 'Portfolio sync complete' },
        { id: 3, content: 'Risk monitoring online' },
      ],
      animate: true,
    },
    roles: ['content'],
    parallaxMax: 0.2,
    contexts: ['dashboard'],
  },
  'toast-panel': {
    kind: 'toast-panel',
    title: 'Toast Controls',
    component: ToastManager,
    defaultSize: { w: 2, h: 2 },
    minSize: { w: 2, h: 1 },
    schema: toastPanelSchema,
    defaults: {
      info: 'Toast demo controls',
    },
    roles: ['skeleton'],
    parallaxMax: 0,
    contexts: ['dashboard'],
  },
  'lower-third': {
    kind: 'lower-third',
    title: 'Lower Third',
    component: LowerThird,
    defaultSize: { w: 6, h: 1 },
    minSize: { w: 4, h: 1 },
    schema: lowerThirdSchema,
    defaults: {
      message: 'Breaking: Market update',
      active: false,
      speedPxPerSec: 60,
      safeAreaBottom: true,
    },
    roles: ['banner'],
    parallaxMax: 0,
    contexts: ['overlay'],
  },
  'popup-alert': {
    kind: 'popup-alert',
    title: 'Popup Alert',
    component: PopupAlert,
    defaultSize: { w: 3, h: 2 },
    minSize: { w: 2, h: 1 },
    schema: popupAlertSchema,
    defaults: {
      title: 'Alert',
      message: 'This is an alert message',
      active: false,
      duration: 5000,
    },
    roles: ['modal'],
    parallaxMax: 0,
    contexts: ['overlay'],
  },
};

export function getWidgetSpec(kind: WidgetKind): WidgetSpec {
  const spec = WIDGET_SPECS[kind];
  if (!spec) {
    throw new Error(`Unknown widget kind: ${kind}`);
  }
  return spec;
}

export function listWidgets(context?: 'dashboard' | 'overlay'): WidgetSpec[] {
  const specs = Object.values(WIDGET_SPECS);
  if (!context) return specs;
  return specs.filter(spec => spec.contexts.includes(context));
}
