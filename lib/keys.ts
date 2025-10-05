import { useEffect } from 'react';

interface KeyBinding {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description?: string;
}

interface UseKeyboardShortcutsProps {
  bindings: KeyBinding[];
  enabled?: boolean;
}

/**
 * Global keyboard shortcuts hook
 */
export function useKeyboardShortcuts({ 
  bindings, 
  enabled = true 
}: UseKeyboardShortcutsProps): void {
  useEffect(() => {
    if (!enabled) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when user is typing in form elements
      if (isTextInput(event.target as HTMLElement)) {
        return;
      }
      
      const binding = bindings.find(binding => {
        return (
          binding.key.toLowerCase() === event.key.toLowerCase() &&
          !!binding.metaKey === event.metaKey &&
          !!binding.ctrlKey === event.ctrlKey &&
          !!binding.shiftKey === event.shiftKey &&
          !!binding.altKey === event.altKey
        );
      });
      
      if (binding) {
        event.preventDefault();
        binding.action();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [bindings, enabled]);
}

/**
 * Check if the target element is a text input where we shouldn't intercept keys
 */
function isTextInput(element: HTMLElement): boolean {
  if (!element) return false;
  
  const tagName = element.tagName.toLowerCase();
  const inputTypes = ['text', 'password', 'email', 'search', 'url', 'tel'];
  
  return (
    tagName === 'textarea' ||
    tagName === 'select' ||
    (tagName === 'input' && inputTypes.includes((element as HTMLInputElement).type)) ||
    element.isContentEditable ||
    element.getAttribute('role') === 'textbox'
  );
}

/**
 * Format shortcut for display
 */
export function formatShortcut(binding: KeyBinding): string {
  const parts: string[] = [];
  
  if (binding.metaKey) parts.push('⌘');
  if (binding.ctrlKey) parts.push('Ctrl');
  if (binding.shiftKey) parts.push('⇧');
  if (binding.altKey) parts.push('⌥');
  
  // Format key name
  let keyName = binding.key;
  switch (binding.key.toLowerCase()) {
    case 'arrowup':
      keyName = '↑';
      break;
    case 'arrowdown':
      keyName = '↓';
      break;
    case 'arrowleft':
      keyName = '←';
      break;
    case 'arrowright':
      keyName = '→';
      break;
    case 'enter':
      keyName = '↵';
      break;
    case 'escape':
      keyName = 'Esc';
      break;
    case 'delete':
      keyName = 'Del';
      break;
    case 'backspace':
      keyName = '⌫';
      break;
    case ' ':
      keyName = 'Space';
      break;
    default:
      keyName = binding.key.toUpperCase();
  }
  
  parts.push(keyName);
  
  return parts.join('+');
}