import React, { useState, useEffect } from 'react';
import type { InputConfig } from '@/widgets/registry';

interface InputWidgetProps {
  config: InputConfig;
  onConfigChange?: (config: InputConfig) => void;
}

/**
 * Accessible form input widget with validation and multi-line support.
 */
export default function InputWidget({ config, onConfigChange }: InputWidgetProps) {
  const {
    id,
    label = 'Input',
    placeholder = 'Enter text...',
    type = 'text',
    required = false,
    ariaLabel,
    multiLine = false,
    pattern,
    minLength,
    maxLength,
  } = config as any;

  const [value, setValue] = useState<string>((config as any).value || '');
  const [error, setError] = useState<string>('');

  const validate = (val: string) => {
    if (required && !val.trim()) return 'This field is required.';
    if (type === 'email' && val) {
      const re = /\S+@\S+\.\S+/;
      if (!re.test(val)) return 'Please enter a valid email address.';
    }
    if (type === 'number' && val) {
      if (Number.isNaN(Number(val))) return 'Please enter a valid number.';
    }
    if (pattern && val) {
      let re: RegExp | null = null;
      try {
        re = new RegExp(pattern);
      } catch { /* ignore invalid patterns */ }
      if (re && !re.test(val)) return 'Value does not match the required format.';
    }
    if (minLength != null && val.length < minLength) {
      return `Please enter at least ${minLength} characters.`;
    }
    if (maxLength != null && val.length > maxLength) {
      return `Please enter no more than ${maxLength} characters.`;
    }
    return '';
  };

  useEffect(() => {
    const msg = validate(value);
    setError(msg);
    if (onConfigChange) {
      onConfigChange({ ...config, value } as InputConfig);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const commonProps = {
    id: `input-${id || label.replace(/\s+/g, '-').toLowerCase()}`,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(e.target.value),
    placeholder,
    'aria-label': ariaLabel || label,
    'aria-required': required || undefined,
    'aria-invalid': !!error || undefined,
    style: {
      padding: '0.5rem',
      border: `1px solid ${error ? 'var(--error)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-base)',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink)',
      backgroundColor: 'var(--surface)',
      outline: 'none'
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label
        htmlFor={commonProps.id}
        style={{ marginBottom: '0.25rem', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}
      >
        {label}
        {required && <span aria-hidden="true" style={{ marginLeft: '0.25rem', color: 'var(--error)' }}>*</span>}
      </label>

      {multiLine ? (
        <textarea
          {...(commonProps as any)}
          rows={Math.max(3, Math.min(12, Math.floor((value?.length || 0) / 80) + 3))}
        />
      ) : (
        <input
          {...(commonProps as any)}
          type={type}
          minLength={minLength}
          maxLength={maxLength}
          required={required}
        />
      )}

      {error && (
        <div
          role="alert"
          style={{ marginTop: '0.25rem', color: 'var(--error)', fontSize: 'var(--text-xs)' }}
          id={`${commonProps.id}-error`}
        >
          {error}
        </div>
      )}
    </div>
  );
}
