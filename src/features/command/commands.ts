import useDashboard from '@/store/useDashboard';

export type Command = {
  id: string;
  title: string;
  hint?: string;
  run: () => void;
};

export function getCoreCommands(): Command[] {
  const {
    toggleHighContrast,
    toggleSafeMode,
    toggleScreenReaderMode,
  } = useDashboard.getState();

  return [
    {
      id: 'ui.toggleHighContrast',
      title: 'Toggle High Contrast',
      hint: 'Accessibility',
      run: () => toggleHighContrast(),
    },
    {
      id: 'ui.toggleSafeMode',
      title: 'Toggle Safe Mode (Reduce Motion)',
      hint: 'Accessibility',
      run: () => toggleSafeMode(),
    },
    {
      id: 'ui.toggleScreenReaderMode',
      title: 'Toggle Screen-Reader Mode',
      hint: 'Accessibility',
      run: () => toggleScreenReaderMode(),
    },
  ];
}

export function getLayoutCommands(layouts: string[], onSwitch: (name: string) => void): Command[] {
  return layouts.map((name) => ({
    id: `layout.switch.${name}`,
    title: `Switch Layout → ${name}`,
    hint: 'Layout',
    run: () => onSwitch(name),
  }));
}

export function getBroadcastCommands({
  triggerToast,
  triggerPopup,
}: {
  triggerToast: (cfg: { message: string; type?: 'info'|'success'|'warning'|'error'; duration?: number }) => void;
  triggerPopup: (cfg: { message: string; type?: 'info'|'warning'|'error'; actions?: any[] }) => void;
}): Command[] {
  return [
    {
      id: 'broadcast.toast.info',
      title: 'Show Toast: Info',
      hint: 'Broadcast',
      run: () => triggerToast({ message: 'Heads up!', type: 'info', duration: 3000 }),
    },
    {
      id: 'broadcast.toast.success',
      title: 'Show Toast: Success',
      hint: 'Broadcast',
      run: () => triggerToast({ message: 'All set ✅', type: 'success', duration: 3000 }),
    },
    {
      id: 'broadcast.toast.warning',
      title: 'Show Toast: Warning',
      hint: 'Broadcast',
      run: () => triggerToast({ message: 'Careful…', type: 'warning', duration: 4000 }),
    },
    {
      id: 'broadcast.toast.error',
      title: 'Show Toast: Error',
      hint: 'Broadcast',
      run: () => triggerToast({ message: 'Something went wrong', type: 'error', duration: 4000 }),
    },
    {
      id: 'broadcast.popup.confirm',
      title: 'Trigger Popup: Confirm',
      hint: 'Broadcast',
      run: () =>
        triggerPopup({
          message: 'Proceed with scene change?',
          type: 'info',
          actions: [
            { label: 'Cancel', action: 'dismiss' },
            { label: 'Confirm', action: 'confirm' },
          ],
        }),
    },
  ];
}
