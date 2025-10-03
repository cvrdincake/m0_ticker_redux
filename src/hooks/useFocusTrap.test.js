import { renderHook, act } from '@testing-library/react';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import { useFocusTrap } from './useFocusTrap';

// Mock DOM methods
const mockQuerySelectorAll = vi.fn();
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();
const mockDispatchEvent = vi.fn();
const mockFocus = vi.fn();
const mockDisconnect = vi.fn();
const mockObserve = vi.fn();

// Mock MutationObserver
global.MutationObserver = vi.fn().mockImplementation(() => ({
  observe: mockObserve,
  disconnect: mockDisconnect
}));

// Create mock elements
const createMockElement = (tagName = 'button') => ({
  tagName,
  focus: mockFocus,
  offsetWidth: 100,
  offsetHeight: 20,
  addEventListener: mockAddEventListener,
  removeEventListener: mockRemoveEventListener,
  dispatchEvent: mockDispatchEvent,
  querySelector: mockQuerySelectorAll,
  querySelectorAll: mockQuerySelectorAll
});

describe('useFocusTrap', () => {
  let mockContainer;
  let mockElements;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockElements = [
      createMockElement('button'),
      createMockElement('input'),
      createMockElement('a')
    ];
    
    mockContainer = {
      ...createMockElement('div'),
      querySelectorAll: vi.fn(() => mockElements),
      querySelector: vi.fn()
    };
    
    // Mock getComputedStyle
    global.getComputedStyle = vi.fn(() => ({
      visibility: 'visible',
      display: 'block'
    }));
    
    // Mock document
    Object.defineProperty(document, 'activeElement', {
      writable: true,
      value: mockElements[0]
    });
    
    Object.defineProperty(document, 'contains', {
      writable: true,
      value: vi.fn(() => true)
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns container ref and control methods', () => {
    const { result } = renderHook(() => useFocusTrap());
    
    expect(result.current).toHaveProperty('ref');
    expect(result.current).toHaveProperty('focusFirst');
    expect(result.current).toHaveProperty('focusLast');
    expect(result.current).toHaveProperty('updateFocusableElements');
    expect(result.current).toHaveProperty('getFocusableElements');
  });

  it('focuses first element when activated', () => {
    const { result } = renderHook(() => useFocusTrap(true));
    
    // Simulate container being set
    act(() => {
      result.current.ref.current = mockContainer;
    });
    
    expect(mockElements[0].focus).toHaveBeenCalled();
  });

  it('handles custom initialFocus selector', () => {
    const customElement = createMockElement('input');
    mockContainer.querySelector.mockReturnValue(customElement);
    mockElements.push(customElement);
    
    const { result } = renderHook(() => 
      useFocusTrap(true, { initialFocus: 'input[type="text"]' })
    );
    
    act(() => {
      result.current.ref.current = mockContainer;
    });
    
    expect(customElement.focus).toHaveBeenCalled();
  });

  it('handles initialFocus as HTMLElement', () => {
    const customElement = createMockElement('input');
    mockElements.push(customElement);
    
    const { result } = renderHook(() => 
      useFocusTrap(true, { initialFocus: customElement })
    );
    
    act(() => {
      result.current.ref.current = mockContainer;
    });
    
    expect(customElement.focus).toHaveBeenCalled();
  });

  it('traps Tab navigation within container', () => {
    const { result } = renderHook(() => useFocusTrap(true));
    
    act(() => {
      result.current.ref.current = mockContainer;
    });
    
    // Simulate Tab on last element
    const tabEvent = new KeyboardEvent('keydown', { 
      key: 'Tab', 
      shiftKey: false 
    });
    
    Object.defineProperty(document, 'activeElement', {
      value: mockElements[2] // Last element
    });
    
    const keydownHandler = mockAddEventListener.mock.calls
      .find(call => call[0] === 'keydown')[1];
    
    keydownHandler(tabEvent);
    
    expect(mockElements[0].focus).toHaveBeenCalled(); // Should focus first
  });

  it('handles Shift+Tab on first element', () => {
    const { result } = renderHook(() => useFocusTrap(true));
    
    act(() => {
      result.current.ref.current = mockContainer;
    });
    
    const shiftTabEvent = new KeyboardEvent('keydown', { 
      key: 'Tab', 
      shiftKey: true 
    });
    
    Object.defineProperty(document, 'activeElement', {
      value: mockElements[0] // First element
    });
    
    const keydownHandler = mockAddEventListener.mock.calls
      .find(call => call[0] === 'keydown')[1];
    
    keydownHandler(shiftTabEvent);
    
    expect(mockElements[2].focus).toHaveBeenCalled(); // Should focus last
  });

  it('calls onEscape callback when Escape is pressed', () => {
    const onEscape = vi.fn();
    const { result } = renderHook(() => useFocusTrap(true, { onEscape }));
    
    act(() => {
      result.current.ref.current = mockContainer;
    });
    
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    
    const keydownHandler = mockAddEventListener.mock.calls
      .find(call => call[0] === 'keydown')[1];
    
    keydownHandler(escapeEvent);
    
    expect(onEscape).toHaveBeenCalledWith(escapeEvent);
  });

  it('dispatches custom event when no onEscape provided', () => {
    const { result } = renderHook(() => useFocusTrap(true));
    
    act(() => {
      result.current.ref.current = mockContainer;
    });
    
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    
    const keydownHandler = mockAddEventListener.mock.calls
      .find(call => call[0] === 'keydown')[1];
    
    keydownHandler(escapeEvent);
    
    expect(mockDispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'escapepressed'
      })
    );
  });

  it('sets up MutationObserver for dynamic content', () => {
    const { result } = renderHook(() => useFocusTrap(true));
    
    act(() => {
      result.current.ref.current = mockContainer;
    });
    
    expect(global.MutationObserver).toHaveBeenCalled();
    expect(mockObserve).toHaveBeenCalledWith(
      mockContainer,
      expect.objectContaining({
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['disabled', 'tabindex', 'aria-hidden']
      })
    );
  });

  it('restores focus to previously focused element', () => {
    const previousElement = createMockElement('button');
    Object.defineProperty(document, 'activeElement', {
      value: previousElement
    });
    
    const { result, unmount } = renderHook(() => 
      useFocusTrap(true, { restoreFocus: true })
    );
    
    act(() => {
      result.current.ref.current = mockContainer;
    });
    
    unmount();
    
    expect(previousElement.focus).toHaveBeenCalled();
  });

  it('does not restore focus when restoreFocus is false', () => {
    const previousElement = createMockElement('button');
    Object.defineProperty(document, 'activeElement', {
      value: previousElement
    });
    
    const { result, unmount } = renderHook(() => 
      useFocusTrap(true, { restoreFocus: false })
    );
    
    act(() => {
      result.current.ref.current = mockContainer;
    });
    
    // Clear previous calls from activation
    mockFocus.mockClear();
    
    unmount();
    
    expect(previousElement.focus).not.toHaveBeenCalled();
  });

  it('provides manual focus control methods', () => {
    const { result } = renderHook(() => useFocusTrap(true));
    
    act(() => {
      result.current.ref.current = mockContainer;
      result.current.focusFirst();
    });
    
    expect(mockElements[0].focus).toHaveBeenCalled();
    
    act(() => {
      result.current.focusLast();
    });
    
    expect(mockElements[2].focus).toHaveBeenCalled();
  });

  it('filters out hidden and disabled elements', () => {
    const hiddenElement = createMockElement('button');
    hiddenElement.offsetWidth = 0; // Hidden
    
    const disabledElement = createMockElement('button');
    disabledElement.disabled = true;
    
    mockElements.push(hiddenElement, disabledElement);
    
    global.getComputedStyle = vi.fn((element) => {
      if (element === hiddenElement) {
        return { visibility: 'hidden', display: 'block' };
      }
      return { visibility: 'visible', display: 'block' };
    });
    
    const { result } = renderHook(() => useFocusTrap(true));
    
    act(() => {
      result.current.ref.current = mockContainer;
      result.current.updateFocusableElements();
    });
    
    const focusable = result.current.getFocusableElements();
    expect(focusable).not.toContain(hiddenElement);
    expect(focusable).not.toContain(disabledElement);
  });

  it('is inactive when isActive is false', () => {
    const { result } = renderHook(() => useFocusTrap(false));
    
    act(() => {
      result.current.ref.current = mockContainer;
    });
    
    expect(mockElements[0].focus).not.toHaveBeenCalled();
    expect(mockAddEventListener).not.toHaveBeenCalled();
  });

  describe('SSR Safety', () => {
    it('handles SSR environment gracefully', () => {
      const originalWindow = global.window;
      delete global.window;
      
      const { result } = renderHook(() => useFocusTrap(true));
      
      expect(result.current.ref).toBeDefined();
      expect(result.current.focusFirst).toBeDefined();
      
      global.window = originalWindow;
    });
  });
});