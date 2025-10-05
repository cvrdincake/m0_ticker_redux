import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import { z } from 'zod';

/** Base schema shared by all widgets. */
export const BaseWidgetConfigSchema = z.object({
  title: z.string().default(''),
  dataSource: z.string().default(''),
  motionPreset: z.enum(['card', 'kpi', 'chart', 'table', 'toast', 'modal']).default('card'),
  density: z.enum(['comfortable', 'compact', 'relaxed']).default('comfortable'),
  ariaLabel: z.string().default(''),
});

export const CardConfigSchema = BaseWidgetConfigSchema.extend({
  body: z.string().default('This is a card'),
});

export const ButtonConfigSchema = BaseWidgetConfigSchema.extend({
  label: z.string().default('Click me'),
});

export const InputConfigSchema = BaseWidgetConfigSchema.extend({
  label: z.string().default('Input'),
  placeholder: z.string().default('Enter text...'),
  type: z.enum(['text', 'email', 'password', 'number']).default('text'),
  required: z.boolean().default(false),
  multiLine: z.boolean().default(false),
  pattern: z.string().optional(),
  minLength: z.number().int().nonnegative().optional(),
  maxLength: z.number().int().positive().optional(),
});

export const TableConfigSchema = BaseWidgetConfigSchema.extend({
  columns: z
    .array(
      z.union([
        z.string(),
        z.object({
          key: z.string(),
          label: z.string().optional(),
          sortable: z.boolean().optional(),
        }),
      ])
    )
    .default([]),
  dataSource: z.string().default(''),
  pageSize: z.number().int().positive().default(10),
  pagination: z.boolean().default(false),
  filter: z.string().optional(),
  columnOrder: z.array(z.string()).default([]),
  columnTypes: z.record(z.enum(['string', 'number'])).default({}),
});

export const KPIConfigSchema = BaseWidgetConfigSchema.extend({
  value: z.string().default('0'),
  trend: z.enum(['up', 'down', 'flat']).default('flat'),
});

export const AnimatedListConfigSchema = BaseWidgetConfigSchema.extend({
  items: z.array(z.string()).default([]),
  maxStagger: z.number().int().min(0).max(12).default(6),
  staggerDelay: z.number().int().min(0).max(1200).default(120),
});

export const ChartConfigSchema = BaseWidgetConfigSchema.extend({
  series: z.array(z.any()).default([]),
});

export const ToastConfigSchema = BaseWidgetConfigSchema.extend({
  message: z.string().default('Hello'),
  type: z.enum(['info', 'success', 'warning', 'error']).default('info'),
  duration: z.number().int().positive().default(3000),
});

export const PopupAlertConfigSchema = BaseWidgetConfigSchema.extend({
  message: z.string().default('Are you sure?'),
  type: z.enum(['info', 'warning', 'error']).default('info'),
  actions: z
    .array(
      z.object({
        label: z.string(),
        action: z.enum(['dismiss', 'confirm', 'custom']).default('dismiss'),
        event: z.string().optional(),
      })
    )
    .default([]),
});

export const LowerThirdConfigSchema = BaseWidgetConfigSchema.extend({
  primaryText: z.string().default('Primary Text'),
  secondaryText: z.string().default('Secondary Text'),
  tickerText: z.string().optional(),
  speed: z.number().min(10).max(500).default(60),
  showTicker: z.boolean().default(false),
  direction: z.enum(['left', 'right']).default('left'),
  pauseOnHover: z.boolean().default(true),
});

export const BrbScreenConfigSchema = BaseWidgetConfigSchema.extend({
  message: z.string().default('Be Right Back'),
  subMessage: z.string().default('We will return shortly'),
  countdown: z.number().optional(),
  image: z.string().optional(),
  motionPreset: z.enum(['modal', 'drawer', 'card']).default('modal'),
});

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
export type BrbScreenConfig = z.infer<typeof BrbScreenConfigSchema>;

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
  | LowerThirdConfig
  | BrbScreenConfig;

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
  | 'lower-third'
  | 'brb-screen';

export type WidgetCategory = 'basic' | 'form' | 'data' | 'overlay' | 'feedback';

export interface WidgetSpec {
  kind: WidgetKind;
  name: string;
  description: string;
  category: WidgetCategory;
  schema: z.ZodTypeAny;
  defaults: WidgetConfig;
  component: LazyExoticComponent<ComponentType<any>>;
  role?: 'region' | 'banner' | 'dialog' | 'alert';
  parallaxMax?: number;
  overlaySupported?: boolean;
}

export const widgetRegistry: Record<WidgetKind, WidgetSpec> = {
  'card': {
    kind: 'card',
    name: 'Card',
    description: 'Basic card with title and body',
    category: 'basic',
    schema: CardConfigSchema,
    defaults: CardConfigSchema.parse({}),
    component: lazy(() => import('@/widgets/Card')),
  },
  'button': {
    kind: 'button',
    name: 'Button',
    description: 'Pressable button',
    category: 'form',
    schema: ButtonConfigSchema,
    defaults: ButtonConfigSchema.parse({}),
    component: lazy(() => import('@/widgets/Button')),
  },
  'input': {
    kind: 'input',
    name: 'Input',
    description: 'Accessible text input with validation',
    category: 'form',
    schema: InputConfigSchema,
    defaults: InputConfigSchema.parse({}),
    component: lazy(() => import('@/widgets/Input')),
  },
  'table': {
    kind: 'table',
    name: 'Table',
    description: 'Data table with sorting and pagination',
    category: 'data',
    schema: TableConfigSchema,
    defaults: TableConfigSchema.parse({}),
    component: lazy(() => import('@/widgets/Table')),
  },
  'kpi': {
    kind: 'kpi',
    name: 'KPI',
    description: 'Key performance indicator',
    category: 'data',
    schema: KPIConfigSchema,
    defaults: KPIConfigSchema.parse({}),
    component: lazy(() => import('@/widgets/KPITile')),
  },
  'animated-list': {
    kind: 'animated-list',
    name: 'Animated List',
    description: 'Animated list for incoming events',
    category: 'data',
    schema: AnimatedListConfigSchema,
    defaults: AnimatedListConfigSchema.parse({}),
    component: lazy(() => import('@/widgets/AnimatedList')),
  },
  'chart': {
    kind: 'chart',
    name: 'Chart',
    description: 'Line chart with auto theming',
    category: 'data',
    schema: ChartConfigSchema,
    defaults: ChartConfigSchema.parse({}),
    component: lazy(() => import('@/widgets/Chart')),
  },
  'toast': {
    kind: 'toast',
    name: 'Toast',
    description: 'Transient notification (aria-live)',
    category: 'feedback',
    schema: ToastConfigSchema,
    defaults: ToastConfigSchema.parse({}),
    component: lazy(() => import('@/widgets/ToastManager')),
    role: 'alert',
    overlaySupported: true,
  },
  'popup-alert': {
    kind: 'popup-alert',
    name: 'Popup Alert',
    description: 'Modal popup/alert with actions',
    category: 'feedback',
    schema: PopupAlertConfigSchema,
    defaults: PopupAlertConfigSchema.parse({}),
    component: lazy(() => import('@/widgets/PopupAlert')),
    role: 'alert',
    parallaxMax: 0,
    overlaySupported: true,
  },
  'lower-third': {
    kind: 'lower-third',
    name: 'Lower Third',
    description: 'Broadcast-style lower third overlay',
    category: 'overlay',
    schema: LowerThirdConfigSchema,
    defaults: LowerThirdConfigSchema.parse({}),
    component: lazy(() => import('@/widgets/LowerThird')),
    role: 'banner',
    parallaxMax: 0,
    overlaySupported: true,
  },
  'brb-screen': {
    kind: 'brb-screen',
    name: 'BRB Screen',
    description: 'Full-screen break overlay',
    category: 'overlay',
    schema: BrbScreenConfigSchema,
    defaults: BrbScreenConfigSchema.parse({}),
    component: lazy(() => import('@/widgets/BrbScreen')),
    role: 'dialog',
    parallaxMax: 0,
    overlaySupported: true,
  },
};

export function getWidget(kind: WidgetKind): WidgetSpec | undefined {
  return widgetRegistry[kind];
}

export function getAllWidgets(): WidgetSpec[] {
  return Object.values(widgetRegistry);
}

export function validateWidgetConfig(kind: WidgetKind, config: unknown) {
  const spec = widgetRegistry[kind];
  if (!spec) {
    return { success: false as const, error: new Error(`Unknown widget kind: ${kind}`) };
  }
  return spec.schema.safeParse(config ?? {});
}
