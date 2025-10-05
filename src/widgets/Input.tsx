import React, { useState, useEffect } from 'react';
import type { InputConfig } from '@/widgets/registry';

interface InputWidgetProps {
  config: InputConfig;
  onConfigChange?: (config: InputConfig) => void;
}

/**
 * Accessible form input widget.
 *
 * This component renders a labelled input field based on the provided
 * configuration. It supports different input types (text, email,
 * password, number) and marks the input as required when specified.
 * The component maintains its own value state and invokes
 * `onConfigChange` when the value changes so that external state can
 * persist user input if desired. Appropriate ARIA attributes are
 * applied to ensure screen readers announce the input correctly.
 */
export default function InputWidget({ config, onConfigChange }: InputWidgetProps) {
  const { label = 'Input', placeholder = 'Enter text...', type = 'text', required = false, ariaLabel } = config;
  const [value, setValue] = useState<string>('');

  // Notify parent of value changes by merging into config.  We include
  // value in the config object so dashboards can persist form state.
  useEffect(() => {
    if (onConfigChange) {
      onConfigChange({ ...config, value } as InputConfig);
    }
  }, [value]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label htmlFor={`input-${config.id}`} style={{ marginBottom: '0.25rem', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>
        {label}
        {required && <span aria-hidden="true" style={{ marginLeft: '0.25rem', color: 'var(--error)' }}>*</span>}
      </label>
      <input
        id={`input-${config.id}`}
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        required={required}
        aria-label={ariaLabel || label}
        aria-required={required}
        style={{
          padding: '0.5rem',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-base)',
          fontSize: 'var(--text-sm)',
          color: 'var(--ink)',
          backgroundColor: 'var(--surface)'
        }}
      />
    </div>
  );
}
