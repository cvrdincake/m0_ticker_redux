import { useEffect, useRef } from 'react';

/**
 * Portal component for rendering elements outside normal DOM hierarchy
 * Used for modals, tooltips, toasts, etc.
 */
export function Portal({ children, container }) {
  const portalRef = useRef(null);
  
  if (!portalRef.current) {
    portalRef.current = document.createElement('div');
  }
  
  useEffect(() => {
    const portalRoot = container || document.body;
    const portalEl = portalRef.current;
    
    portalRoot.appendChild(portalEl);
    
    return () => {
      portalRoot.removeChild(portalEl);
    };
  }, [container]);
  
  return portalRef.current ? createPortal(children, portalRef.current) : null;
}

// Simple createPortal implementation if not using React 18
function createPortal(children, container) {
  const portalNode = container;
  portalNode.innerHTML = '';
  
  // For React elements, we need ReactDOM
  if (typeof children === 'object' && children.type) {
    import('react-dom').then(({ createPortal }) => {
      return createPortal(children, container);
    });
  }
  
  return children;
}