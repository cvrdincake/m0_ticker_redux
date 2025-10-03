import { z } from 'zod';
import { ComponentType, LazyExoticComponent, lazy } from 'react';

// Widget Configuration Schemas
export const BaseWidgetConfigSchema = z.object({
  id: z.string(),
  title: z.string().default('Untitled Widget'),
  ariaLabel: z.string().optional(),
});

export const CardConfigSchema = BaseWidgetConfigSchema.extend({
  content: z.string().default('Card content'),
  variant: z.enum(['default', 'outlined', 'elevated']).default('default'),
});

export const ButtonConfigSchema = BaseWidgetConfigSchema.extend({
  label: z.string().default('Button'),
  variant: z.enum(['primary', 'secondary', 'ghost']).default('primary'),
  size: z.enum(['sm', 'md', 'lg']).default('md'),
  disabled: z.boolean().default(false),
});

export const InputConfigSchema = BaseWidgetConfigSchema.extend({
  label: z.string().default('Input'),
  placeholder: z.string().default('Enter text...'),
  type: z.enum(['text', 'email', 'password', 'number']).default('text'),
  required: z.boolean().default(false),
});

export const TableConfigSchema = BaseWidgetConfigSchema.extend({
  columns: z.array(z.object({
    key: z.string(),
    label: z.string(),
    sortable: z.boolean().default(false),
  })).default([]),
  data: z.array(z.record(z.unknown())).default([]),
  density: z.enum(['default', 'dense']).default('default'),
  pagination: z.boolean().default(false),
});

export const KPIConfigSchema = BaseWidgetConfigSchema.extend({
  value: z.string().default('0'),
  label: z.string().default('Metric'),
  trend: z.enum(['up', 'down', 'neutral']).optional(),
  trendValue: z.string().optional(),
  format: z.enum(['number', 'currency', 'percentage']).default('number'),
});

export const AnimatedListConfigSchema = BaseWidgetConfigSchema.extend({
  items: z.array(z.string()).default([]),
  staggerDelay: z.number().min(0).max(100).default(50),
  maxStagger: z.number().min(1).max(10).default(5),
});

export const ChartConfigSchema = BaseWidgetConfigSchema.extend({
  data: z.array(z.object({
    x: z.union([z.string(), z.number()]),
    y: z.number(),
  })).default([]),
  xLabel: z.string().default('X Axis'),
  yLabel: z.string().default('Y Axis'),
  showGrid: z.boolean().default(true),
  showDots: z.boolean().default(false),
});

export const ToastConfigSchema = BaseWidgetConfigSchema.extend({
  message: z.string().default('Toast message'),
  type: z.enum(['info', 'success', 'warning', 'error']).default('info'),
  duration: z.number().min(1000).max(10000).default(4000),
  closable: z.boolean().default(true),
});

export const PopupAlertConfigSchema = BaseWidgetConfigSchema.extend({
  message: z.string().default('Alert message'),
  type: z.enum(['info', 'success', 'warning', 'error']).default('info'),
  actions: z.array(z.object({
    label: z.string(),
    action: z.string(),
    variant: z.enum(['primary', 'secondary']).default('secondary'),
  })).default([]),
});

export const LowerThirdConfigSchema = BaseWidgetConfigSchema.extend({
  primaryText: z.string().default('Primary Text'),
  secondaryText: z.string().default('Secondary Text'),
  tickerText: z.string().optional(),
  speed: z.number().min(10).max(200).default(60),
  showTicker: z.boolean().default(false),
});

// Widget Configuration Types
export type BaseWidgetConfig = z.infer<typeof BaseWidgetConfigSchema>;
export type CardConfig = z.infer<typeof CardConfigSchema>;
export type ButtonConfig = z.infer<typeof ButtonConfigSchema>;
export type InputConfig = z.infer<typeof InputConfigSchema>;
export type TableConfig = z.infer<typeof TableConfigSchema>;
export type KPIConfig = z.infer<typeof KPIConfigSchema>;
export type AnimatedListConfig = z.infer<typeof AnimatedListConfigSchema>;
export type ChartConfig = z.infer<typeof ChartConfigSchema>;
export type ToastConfig = z.infer<typeof ToastConfigSchema>;
export type PopupAlertConfig = z.infer<typeof PopupAlertConfigSchema>;
export type LowerThirdConfig = z.infer<typeof LowerThirdConfigSchema>;

export type WidgetConfig = 
  | CardConfig 
  | ButtonConfig 
  | InputConfig 
  | TableConfig 
  | KPIConfig 
  | AnimatedListConfig 
  | ChartConfig 
  | ToastConfig 
  | PopupAlertConfig 
  | LowerThirdConfig;

// Widget Kinds
export type WidgetKind = 
  | 'card' 
  | 'button' 
  | 'input' 
  | 'table' 
  | 'kpi' 
  | 'animated-list' 
  | 'chart' 
  | 'toast' 
  | 'popup-alert' 
  | 'lower-third';

// Motion Roles for useWidgetMotion hook
export type MotionRole = 
  | 'card' 
  | 'table' 
  | 'chart' 
  | 'toast' 
  | 'modal' 
  | 'drawer' 
  | 'loader' 
  | 'skeleton' 
  | 'progress' 
  | 'tabs' 
  | 'accordion' 
  | 'banner' 
  | 'kpi';

// Widget Specification
export interface WidgetSpec<T extends WidgetConfig = WidgetConfig> {
  kind: WidgetKind;
  name: string;
  description: string;
  category: 'data' | 'input' | 'layout' | 'overlay' | 'chart';
  schema: z.ZodType<T>;
  defaults: T;
  component: LazyExoticComponent<ComponentType<{ config: T; onConfigChange?: (config: T) => void }>>;
  role: MotionRole;
  parallaxMax: number;
  overlaySupported: boolean;
}

// Widget Registry
export const widgetRegistry: Record<WidgetKind, WidgetSpec> = {
  'card': {
    kind: 'card',
    name: 'Card',
    description: 'Basic content card with variants',
    category: 'layout',
    schema: CardConfigSchema as z.ZodType<CardConfig>,
    defaults: CardConfigSchema.parse({}),
    component: lazy(() => import('@/widgets/Card')),
    role: 'card',
    parallaxMax: 20,
    overlaySupported: true,
  },
  
  'button': {
    kind: 'button',
    name: 'Button',
    description: 'Interactive button with variants',
    category: 'input',
    schema: ButtonConfigSchema as z.ZodType<ButtonConfig>,
    defaults: ButtonConfigSchema.parse({}),
    component: lazy(() => import('@/widgets/Button')),
    role: 'card',
    parallaxMax: 10,
    overlaySupported: true,
  },
  
  'input': {
    kind: 'input',
    name: 'Input',
    description: 'Form input field',
    category: 'input',
    schema: InputConfigSchema as z.ZodType<InputConfig>,
    defaults: InputConfigSchema.parse({}),
    component: lazy(() => import('@/widgets/Input')),
    role: 'card',
    parallaxMax: 5,
    overlaySupported: false,
  },
  
  'table': {
    kind: 'table',
    name: 'Table',
    description: 'Data table with sorting and density options',
    category: 'data',
    schema: TableConfigSchema as z.ZodType<TableConfig>,
    defaults: TableConfigSchema.parse({}),
    component: lazy(() => import('@/widgets/Table')),
    role: 'table',
    parallaxMax: 15,
    overlaySupported: true,
  },
  
  'kpi': {
    kind: 'kpi',
    name: 'KPI Tile',
    description: 'Key performance indicator display',
    category: 'data',
    schema: KPIConfigSchema as z.ZodType<KPIConfig>,
    defaults: KPIConfigSchema.parse({}),
    component: lazy(() => import('@/widgets/KPITile')),
    role: 'kpi',
    parallaxMax: 25,
    overlaySupported: true,
  },
  
  'animated-list': {
    kind: 'animated-list',
    name: 'Animated List',
    description: 'List with staggered entrance animations',
    category: 'layout',
    schema: AnimatedListConfigSchema as z.ZodType<AnimatedListConfig>,
    defaults: AnimatedListConfigSchema.parse({}),
    component: lazy(() => import('@/widgets/AnimatedList')),
    role: 'card',
    parallaxMax: 30,
    overlaySupported: true,
  },
  
  'chart': {
    kind: 'chart',
    name: 'Monochrome Chart',
    description: 'Simple line chart with monochrome styling',
    category: 'chart',
    schema: ChartConfigSchema as z.ZodType<ChartConfig>,
    defaults: ChartConfigSchema.parse({}),
    component: lazy(() => import('@/widgets/MonochromeLineChart')),
    role: 'chart',
    parallaxMax: 20,
    overlaySupported: true,
  },
  
  'toast': {
    kind: 'toast',
    name: 'Toast Manager',
    description: 'Toast notification system',
    category: 'overlay',
    schema: ToastConfigSchema as z.ZodType<ToastConfig>,
    defaults: ToastConfigSchema.parse({}),
    component: lazy(() => import('@/widgets/ToastManager')),
    role: 'toast',
    parallaxMax: 0,
    overlaySupported: false,
  },
  
  'popup-alert': {
    kind: 'popup-alert',
    name: 'Popup Alert',
    description: 'Modal alert with actions',
    category: 'overlay',
    schema: PopupAlertConfigSchema as z.ZodType<PopupAlertConfig>,
    defaults: PopupAlertConfigSchema.parse({}),
    component: lazy(() => import('@/widgets/PopupAlert')),
    role: 'modal',
    parallaxMax: 0,
    overlaySupported: true,
  },
  
  'lower-third': {
    kind: 'lower-third',
    name: 'Lower Third',
    description: 'Broadcast-style lower third overlay',
    category: 'overlay',
    schema: LowerThirdConfigSchema as z.ZodType<LowerThirdConfig>,
    defaults: LowerThirdConfigSchema.parse({}),
    component: lazy(() => import('@/widgets/LowerThird')),
    role: 'banner',
    parallaxMax: 0,
    overlaySupported: true,
  },
};

// Utility Functions
export function getWidget(kind: WidgetKind): WidgetSpec | undefined {
  return widgetRegistry[kind];
}

export function getWidgetKinds(): WidgetKind[] {
  return Object.keys(widgetRegistry) as WidgetKind[];
}

export function getWidgetsByCategory(category: WidgetSpec['category']): WidgetSpec[] {
  return Object.values(widgetRegistry).filter(spec => spec.category === category);
}

export function validateWidgetConfig<T extends WidgetConfig>(
  kind: WidgetKind, 
  config: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const spec = getWidget(kind);
  if (!spec) {
    throw new Error(`Unknown widget kind: ${kind}`);
  }
  
  const result = spec.schema.safeParse(config);
  if (result.success) {
    return { success: true, data: result.data as T };
  } else {
    return { success: false, error: result.error };
  }
}