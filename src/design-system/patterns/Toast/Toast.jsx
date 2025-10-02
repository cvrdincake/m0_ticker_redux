// patterns/Toast/ToastManager.jsx
import { createContext, useContext, useState, useCallback } from 'react';
import { gsap } from '@/lib/motionGuard';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  
  const addToast = useCallback((message, duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, duration }]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);
  
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);
  
  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ id, message, onDismiss }) {
  const ref = useRef(null);
  
  useEffect(() => {
    gsap.fromTo(ref.current,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.2, ease: 'power2.out' }
    );
  }, []);
  
  const handleDismiss = () => {
    gsap.to(ref.current, {
      x: 100,
      opacity: 0,
      duration: 0.18,
      onComplete: () => onDismiss(id)
    });
  };
  
  return (
    <div ref={ref} className="toast" onClick={handleDismiss}>
      <span className="toast-message">{message}</span>
      <button className="toast-close" aria-label="Dismiss">×</button>
    </div>
  );
}

// Usage
export const useToast = () => useContext(ToastContext);