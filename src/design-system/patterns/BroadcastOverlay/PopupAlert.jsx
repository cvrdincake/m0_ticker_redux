import { useState, useEffect } from 'react';

// patterns/BroadcastOverlay/PopupAlert.jsx
export function PopupAlert({ 
  title, 
  message, 
  icon, 
  active = false, 
  duration = 5000,
  onDismiss 
}) {
  const [isVisible, setIsVisible] = useState(active);
  
  useEffect(() => {
    if (active) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [active, duration, onDismiss]);
  
  if (!isVisible) return null;
  
  return (
    <div className="popup-alert">
      {icon && <div className="popup-icon">{icon}</div>}
      <h2 className="popup-title">{title}</h2>
      <p className="popup-message">{message}</p>
    </div>
  );
}