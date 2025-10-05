// Example: src/features/settings/SettingsDialog.tsx
import React, { useRef } from 'react';
import { useFocusTrap } from '@/utils/accessibility';

export default function SettingsDialog({ open, onClose }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open);

  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label="Settings" ref={ref}>
      {/* dialog content... */}
      <button onClick={onClose} aria-label="Close settings">Close</button>
    </div>
  );
}
