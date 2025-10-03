import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * usePopupQueue - Lightweight queue helper for serialised popup alerts
 * Manages alert queue with max length and drop-oldest policy
 * 
 * @param {number} maxLength - Maximum queue length (default: 3)
 * @returns {object} - { push, clear, current, queue }
 */
export const usePopupQueue = (maxLength = 3) => {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const currentIdRef = useRef(0);

  // Generate unique ID for each alert
  const generateId = useCallback(() => {
    currentIdRef.current += 1;
    return currentIdRef.current;
  }, []);

  // Add alert to queue with drop-oldest policy
  const push = useCallback((alertProps) => {
    const newAlert = {
      id: generateId(),
      ...alertProps,
      timestamp: Date.now()
    };

    setQueue(prevQueue => {
      const updatedQueue = [...prevQueue, newAlert];
      
      // Drop oldest if exceeding max length
      if (updatedQueue.length > maxLength) {
        return updatedQueue.slice(-maxLength);
      }
      
      return updatedQueue;
    });
  }, [generateId, maxLength]);

  // Clear all alerts in queue and current
  const clear = useCallback(() => {
    setQueue([]);
    setCurrent(null);
    setIsActive(false);
  }, []);

  // Process queue - show next alert when current finishes
  useEffect(() => {
    if (!isActive && queue.length > 0) {
      const nextAlert = queue[0];
      setQueue(prevQueue => prevQueue.slice(1));
      setCurrent(nextAlert);
      setIsActive(true);
    }
  }, [queue, isActive]);

  // Handle current alert dismiss
  const handleCurrentDismiss = useCallback(() => {
    setCurrent(null);
    setIsActive(false);
  }, []);

  // Enhanced current alert with dismiss handler
  const currentAlert = current ? {
    ...current,
    active: isActive,
    onDismiss: handleCurrentDismiss
  } : null;

  return {
    push,
    clear,
    current: currentAlert,
    queue: queue.map(item => ({ ...item, active: false })),
    queueLength: queue.length,
    hasActive: isActive
  };
};