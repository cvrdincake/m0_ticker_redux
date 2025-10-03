import { useState, useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { getWidgetSpec, listWidgets, type WidgetKind } from './registry';
import { WidgetRenderer, createWidgetConfig } from './render';
import { Button, Input } from '@/design-system/components';
import { Modal } from '@/design-system/patterns';
import styles from './config.module.css';

interface WidgetConfigUIProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
  initialConfig?: any;
  availableWidgets?: WidgetKind[];
}

// Form field component for different input types
function FormField({ 
  name, 
  label, 
  type, 
  control, 
  errors, 
  options 
}: {
  name: string;
  label: string;
  type: string;
  control: any;
  errors: any;
  options?: { value: any; label: string }[];
}) {
  const hasError = !!errors[name];
  const errorMessage = errors[name]?.message;

  return (
    <div className={styles.formField}>
      <label className={styles.fieldLabel}>{label}</label>
      
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          if (type === 'select') {
            return (
              <select 
                {...field} 
                className={`${styles.fieldInput} ${hasError ? styles.fieldError : ''}`}
              >
                {options?.map(option => (
                  <option key={String(option.value)} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            );
          }
          
          if (type === 'boolean') {
            return (
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className={styles.checkbox}
                />
                <span>Enabled</span>
              </label>
            );
          }
          
          if (type === 'number') {
            return (
              <Input
                {...field}
                type="number"
                className={hasError ? styles.fieldError : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
              />
            );
          }
          
          if (type === 'textarea') {
            return (
              <textarea
                {...field}
                className={`${styles.fieldTextarea} ${hasError ? styles.fieldError : ''}`}
                rows={3}
              />
            );
          }
          
          // Default to text input
          return (
            <Input
              {...field}
              type="text"
              className={hasError ? styles.fieldError : ''}
            />
          );
        }}
      />
      
      {hasError && (
        <div className={styles.fieldErrorMessage}>{errorMessage}</div>
      )}
    </div>
  );
}

// Generate form fields based on widget kind (simplified approach)
function generateFormFields(kind: WidgetKind, control: any, errors: any): JSX.Element[] {
  const commonFields = [];
  
  // Generate fields based on widget type rather than complex schema introspection
  switch (kind) {
    case 'card':
      commonFields.push(
        <FormField key="title" name="title" label="Title" type="text" control={control} errors={errors} />,
        <FormField key="text" name="text" label="Text" type="textarea" control={control} errors={errors} />,
        <FormField 
          key="density" 
          name="density" 
          label="Density" 
          type="select" 
          control={control} 
          errors={errors}
          options={[
            { value: 'compact', label: 'Compact' },
            { value: 'comfortable', label: 'Comfortable' },
            { value: 'relaxed', label: 'Relaxed' }
          ]}
        />
      );
      break;
      
    case 'kpi':
      commonFields.push(
        <FormField key="label" name="label" label="Label" type="text" control={control} errors={errors} />,
        <FormField key="value" name="value" label="Value" type="text" control={control} errors={errors} />,
        <FormField key="unit" name="unit" label="Unit" type="text" control={control} errors={errors} />
      );
      break;
      
    case 'chart':
      commonFields.push(
        <FormField key="animate" name="animate" label="Animate" type="boolean" control={control} errors={errors} />
      );
      break;
      
    case 'table':
      commonFields.push(
        <FormField key="dense" name="dense" label="Dense Layout" type="boolean" control={control} errors={errors} />,
        <FormField key="maxRows" name="maxRows" label="Max Rows" type="number" control={control} errors={errors} />
      );
      break;
      
    case 'list':
      commonFields.push(
        <FormField key="animate" name="animate" label="Animate" type="boolean" control={control} errors={errors} />
      );
      break;
      
    case 'lower-third':
      commonFields.push(
        <FormField key="message" name="message" label="Message" type="text" control={control} errors={errors} />,
        <FormField key="active" name="active" label="Active" type="boolean" control={control} errors={errors} />
      );
      break;
      
    case 'popup-alert':
      commonFields.push(
        <FormField key="title" name="title" label="Title" type="text" control={control} errors={errors} />,
        <FormField key="message" name="message" label="Message" type="textarea" control={control} errors={errors} />,
        <FormField key="active" name="active" label="Active" type="boolean" control={control} errors={errors} />
      );
      break;
  }
  
  return commonFields;
}

export function WidgetConfigUI({ 
  isOpen, 
  onClose, 
  onSave, 
  initialConfig,
  availableWidgets 
}: WidgetConfigUIProps) {
  const [selectedKind, setSelectedKind] = useState<WidgetKind>(
    initialConfig?.kind || 'card'
  );
  
  const widgets = useMemo(() => {
    const allWidgets = listWidgets('dashboard');
    return availableWidgets 
      ? allWidgets.filter(w => availableWidgets.includes(w.kind))
      : allWidgets;
  }, [availableWidgets]);
  
  const spec = useMemo(() => getWidgetSpec(selectedKind), [selectedKind]);
  
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm({
    defaultValues: initialConfig?.props || spec.defaults,
    mode: 'onChange'
  });
  
  // Watch form values for live preview
  const formValues = watch();
  
  // Preview config
  const previewConfig = useMemo(() => 
    createWidgetConfig(selectedKind, 'preview', { props: formValues }),
    [selectedKind, formValues]
  );
  
  // Handle widget kind change
  const handleKindChange = useCallback((newKind: WidgetKind) => {
    setSelectedKind(newKind);
    const newSpec = getWidgetSpec(newKind);
    reset(newSpec.defaults);
  }, [reset]);
  
  // Handle form submission
  const onSubmit = useCallback((data: any) => {
    const config = createWidgetConfig(selectedKind, initialConfig?.id || `widget-${Date.now()}`, {
      props: data,
      ...(initialConfig && { 
        x: initialConfig.x, 
        y: initialConfig.y, 
        w: initialConfig.w, 
        h: initialConfig.h 
      })
    });
    onSave(config);
    onClose();
  }, [selectedKind, initialConfig, onSave, onClose]);
  
  const formFields = useMemo(() => 
    generateFormFields(selectedKind, control, errors),
    [selectedKind, control, errors]
  );
  
  if (!isOpen) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configure Widget">
      <div className={styles.configContainer}>
        
        {/* Widget Kind Selector */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Widget Type</h3>
          <div className={styles.widgetGrid}>
            {widgets.map(widget => (
              <button
                key={widget.kind}
                onClick={() => handleKindChange(widget.kind)}
                className={`${styles.widgetOption} ${
                  selectedKind === widget.kind ? styles.widgetOptionActive : ''
                }`}
              >
                <div className={styles.widgetOptionTitle}>{widget.title}</div>
                <div className={styles.widgetOptionSize}>
                  {widget.defaultSize.w}×{widget.defaultSize.h}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className={styles.configContent}>
          
          {/* Configuration Form */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Configuration</h3>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              
              {formFields.length > 0 ? (
                <div className={styles.formFields}>
                  {formFields}
                </div>
              ) : (
                <div className={styles.noConfig}>
                  This widget has no configurable properties.
                </div>
              )}
              
              <div className={styles.formActions}>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={!isValid}
                >
                  {initialConfig ? 'Update' : 'Add'} Widget
                </Button>
              </div>
              
            </form>
          </div>
          
          {/* Live Preview */}
          <div className={styles.previewSection}>
            <h3 className={styles.sectionTitle}>Preview</h3>
            <div className={styles.previewContainer}>
              <div 
                className={styles.previewWrapper}
                style={{
                  aspectRatio: `${spec.defaultSize.w} / ${spec.defaultSize.h}`,
                  maxWidth: '300px',
                  maxHeight: '200px'
                }}
              >
                <WidgetRenderer 
                  config={previewConfig}
                  isPreview={true}
                  className={styles.previewWidget}
                />
              </div>
            </div>
            
            {/* Widget Info */}
            <div className={styles.widgetInfo}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Size:</span>
                <span>{spec.defaultSize.w}×{spec.defaultSize.h} (min: {spec.minSize.w}×{spec.minSize.h})</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Contexts:</span>
                <span>{spec.contexts.join(', ')}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Animation Role:</span>
                <span>{spec.roles.join(', ')}</span>
              </div>
            </div>
          </div>
          
        </div>
        
      </div>
    </Modal>
  );
}

// Quick configuration preset buttons
export function QuickConfigButtons({ 
  onAddWidget 
}: { 
  onAddWidget: (config: any) => void 
}) {
  const popularWidgets: WidgetKind[] = ['kpi', 'chart', 'table', 'card'];
  
  return (
    <div className={styles.quickConfig}>
      <h4 className={styles.quickConfigTitle}>Quick Add</h4>
      <div className={styles.quickConfigButtons}>
        {popularWidgets.map(kind => {
          const spec = getWidgetSpec(kind);
          return (
            <Button
              key={kind}
              variant="secondary"
              size="small"
              onClick={() => {
                const config = createWidgetConfig(kind, `widget-${Date.now()}`);
                onAddWidget(config);
              }}
            >
              {spec.title}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default WidgetConfigUI;