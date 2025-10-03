import { describe, it, expect } from 'vitest';
import { nearestGuides, snapToGuides } from '../AlignmentGuides';

describe('AlignmentGuides utilities', () => {
  describe('nearestGuides', () => {
    const subject = { x: 100, y: 100, width: 50, height: 50 };
    const peers = [
      { x: 200, y: 100, width: 50, height: 50 }, // Aligned top
      { x: 100, y: 200, width: 50, height: 50 }, // Aligned left
      { x: 125, y: 125, width: 50, height: 50 }  // Center aligned
    ];

    it('detects left edge alignment', () => {
      const guides = nearestGuides(subject, peers, 10);
      
      const leftGuide = guides.find(g => g.type === 'vertical' && g.position === 100);
      expect(leftGuide).toBeDefined();
    });

    it('detects top edge alignment', () => {
      const guides = nearestGuides(subject, peers, 10);
      
      const topGuide = guides.find(g => g.type === 'horizontal' && g.position === 100);
      expect(topGuide).toBeDefined();
    });

    it('detects center alignment', () => {
      const guides = nearestGuides(subject, peers, 10);
      
      // Subject center X: 100 + 50/2 = 125
      // Peer center X: 125 + 50/2 = 150 (delta = 25, outside tolerance)
      // Subject center Y: 100 + 50/2 = 125
      // Peer center Y: 125 + 50/2 = 150 (delta = 25, outside tolerance)
      
      // Should not detect center alignment due to tolerance
      const centerXGuide = guides.find(g => g.type === 'vertical' && g.position === 150);
      expect(centerXGuide).toBeUndefined();
    });

    it('respects tolerance setting', () => {
      const guidesStrict = nearestGuides(subject, peers, 1);
      const guidesTolerant = nearestGuides(subject, peers, 50);
      
      expect(guidesTolerant.length).toBeGreaterThan(guidesStrict.length);
    });

    it('returns empty array when no peers within tolerance', () => {
      const farPeers = [
        { x: 1000, y: 1000, width: 50, height: 50 }
      ];
      
      const guides = nearestGuides(subject, farPeers, 10);
      expect(guides).toHaveLength(0);
    });
  });

  describe('snapToGuides', () => {
    const position = { x: 103, y: 103 };
    const size = { width: 50, height: 50 };
    
    it('snaps to vertical guide (left edge)', () => {
      const guides = [
        { type: 'vertical' as const, position: 100, start: 0, end: 200 }
      ];
      
      const snapped = snapToGuides(position, size, guides, 10);
      expect(snapped.x).toBe(100);
      expect(snapped.y).toBe(103); // Y unchanged
    });

    it('snaps to horizontal guide (top edge)', () => {
      const guides = [
        { type: 'horizontal' as const, position: 100, start: 0, end: 200 }
      ];
      
      const snapped = snapToGuides(position, size, guides, 10);
      expect(snapped.x).toBe(103); // X unchanged
      expect(snapped.y).toBe(100);
    });

    it('snaps to right edge', () => {
      const guides = [
        { type: 'vertical' as const, position: 150, start: 0, end: 200 }
      ];
      
      // Position where right edge (103 + 50 = 153) is close to guide (150)
      const snapped = snapToGuides({ x: 147, y: 103 }, size, guides, 10);
      expect(snapped.x).toBe(100); // 150 - 50 = 100
    });

    it('snaps to center', () => {
      const guides = [
        { type: 'vertical' as const, position: 125, start: 0, end: 200 }
      ];
      
      // Position where center (100 + 50/2 = 125) aligns with guide
      const snapped = snapToGuides({ x: 100, y: 103 }, size, guides, 10);
      expect(snapped.x).toBe(100); // 125 - 50/2 = 100
    });

    it('respects tolerance', () => {
      const guides = [
        { type: 'vertical' as const, position: 100, start: 0, end: 200 }
      ];
      
      // Outside tolerance
      const snappedOutside = snapToGuides({ x: 120, y: 103 }, size, guides, 10);
      expect(snappedOutside.x).toBe(120); // No snap
      
      // Within tolerance
      const snappedInside = snapToGuides({ x: 105, y: 103 }, size, guides, 10);
      expect(snappedInside.x).toBe(100); // Snapped
    });

    it('handles multiple guides', () => {
      const guides = [
        { type: 'vertical' as const, position: 100, start: 0, end: 200 },
        { type: 'horizontal' as const, position: 200, start: 0, end: 200 }
      ];
      
      const snapped = snapToGuides({ x: 103, y: 197 }, size, guides, 10);
      expect(snapped.x).toBe(100);
      expect(snapped.y).toBe(200);
    });
  });
});