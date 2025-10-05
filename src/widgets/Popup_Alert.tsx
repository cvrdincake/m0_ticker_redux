import React, { useEffect, useState, useRef } from 'react';
import { useWidgetMotion } from '@/hooks/useWidgetMotion';
import type { PopupAlertConfig } from '@/widgets/registry';
import { useFocusTrap } from '@/utils/accessibility';

// … component definition …

  // Ref for the modal container to trap focus
  const containerRef = useRef<HTMLDivElement>(null);
  // Activate focus trap when the popup is visible
  useFocusTrap(containerRef, isVisible);

// … render function …

      <div
        className="widget-popup-alert"
        // Attach both the animation element and the focus trap ref
        ref={(el) => {
          containerRef.current = el as HTMLDivElement | null;
          if (el && 'element' in motion) {
            (motion as any).element = el;
            motion.enter();
          }
        }}
        style={{ background: 'var(--ink)', color: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-md)', minWidth: '320px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
      >
// …
