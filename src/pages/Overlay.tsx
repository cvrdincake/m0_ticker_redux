import { useEffect } from 'react';
import { OverlayStage } from '@/widgets/render';

export default function Overlay() {
  useEffect(() => {
    document.documentElement.style.backgroundColor = '#000';
    document.body.style.margin = '0';
  }, []);

  return <OverlayStage />;
}
