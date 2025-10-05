import React, { useEffect, useRef, useState } from 'react';
import { useFocusTrap } from '@/utils/accessibility';
import { getCoreCommands, getLayoutCommands, getBroadcastCommands, Command } from './commands';
import useDashboard from '@/store/useDashboard';
import { useDashboardStore } from '@/store/useDashboard';

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open);
  const [q, setQ] = useState('');
  const { switchLayout, triggerToast, triggerPopup } = useDashboardStore(); // ensure store exports these actions

  const { layouts = ['Default'] } = useDashboardStore();
  const commands: Command[] = [
    ...getCoreCommands(),
    ...getLayoutCommands(layouts, (name) => switchLayout?.(name)),
    ...getBroadcastCommands({ triggerToast, triggerPopup }),
  ];

  const filtered = q.trim()
    ? commands.filter(c => c.title.toLowerCase().includes(q.toLowerCase()))
    : commands;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      ref={ref}
      style={{
        position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,.4)', zIndex: 10000,
      }}
    >
      <div style={{ width: 520, background: 'var(--surface)', color: 'var(--ink)', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,.3)' }}>
        <input
          type="text"
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Type a command…"
          aria-label="Search commands"
          style={{ width: '100%', padding: '12px 14px', border: 'none', borderBottom: '1px solid var(--border)', borderRadius: '12px 12px 0 0', outline: 'none' }}
        />
        <ul role="listbox" aria-label="Commands" style={{ maxHeight: 320, overflow: 'auto', padding: 8, margin: 0 }}>
          {filtered.map((cmd) => (
            <li key={cmd.id} role="option" aria-selected="false" style={{ padding: 8, cursor: 'pointer' }}
                onClick={() => { cmd.run(); onClose(); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { cmd.run(); onClose(); } }}>
              <div style={{ fontWeight: 600 }}>{cmd.title}</div>
              {cmd.hint && <div style={{ fontSize: 12, opacity: .7 }}>{cmd.hint}</div>}
            </li>
          ))}
          {filtered.length === 0 && <li style={{ padding: 8, opacity: .7 }}>No matches</li>}
        </ul>
      </div>
    </div>
  );
}
