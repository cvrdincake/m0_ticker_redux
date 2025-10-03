import { useState } from 'react';
import Input from './Input';

export default {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Form input component with validation states and accessibility features.'
      }
    }
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'Input type'
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Input size'
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'filled'],
      description: 'Input style variant'
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state'
    },
    invalid: {
      control: 'boolean',
      description: 'Invalid/error state'
    }
  }
};

export const Default = {
  args: {
    placeholder: 'Enter text...'
  }
};

export const WithLabel = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    id: 'username'
  }
};

export const Sizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '300px' }}>
    <Input size="sm" placeholder="Small input" label="Small" />
    <Input size="md" placeholder="Medium input" label="Medium" />
    <Input size="lg" placeholder="Large input" label="Large" />
  </div>
);

export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '300px' }}>
    <Input variant="default" placeholder="Default variant" label="Default" />
    <Input variant="filled" placeholder="Filled variant" label="Filled" />
  </div>
);

export const WithHelperText = () => (
  <div style={{ maxWidth: '300px' }}>
    <Input
      label="Email"
      type="email"
      placeholder="your@email.com"
      hint="We'll never share your email address"
      id="email"
    />
  </div>
);

export const ErrorState = () => (
  <div style={{ maxWidth: '300px' }}>
    <Input
      label="Password"
      type="password"
      placeholder="Enter password"
      error="Password must be at least 8 characters"
      id="password"
    />
  </div>
);

export const ControlledInput = () => {
  const [value, setValue] = useState('');
  
  return (
    <div style={{ maxWidth: '300px' }}>
      <Input
        label="Controlled Input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type something..."
        hint={`Character count: ${value.length}`}
        id="controlled"
      />
    </div>
  );
};

export const FormExample = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert('Form submitted successfully!');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Input
        label="Full Name"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        error={errors.name}
        id="name"
      />
      
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        error={errors.email}
        id="email"
      />
      
      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
        error={errors.password}
        id="password"
      />
      
      <Input
        label="Confirm Password"
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
        error={errors.confirmPassword}
        id="confirmPassword"
      />
      
      <button
        type="submit"
        style={{
          background: 'var(--ink)',
          color: 'var(--surface)',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '8px'
        }}
      >
        Submit
      </button>
    </form>
  );
};

// Dark theme variant
export const DarkTheme = {
  args: {
    label: 'Dark Theme Input',
    placeholder: 'Enter text...'
  },
  parameters: {
    backgrounds: { default: 'dark' }
  }
};