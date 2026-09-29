import { useRef, useState, type PointerEvent, type ReactNode, type WheelEvent } from 'react';
import { Minus, Plus } from '@phosphor-icons/react';

export interface ZoomPanProps {
  children: ReactNode;
  /** Scale limits */
  min?: number;
  max?: number;
  initial?: { scale: number; x: number; y: number };
  zoomInLabel?: string;
  zoomOutLabel?: string;
}

type View = { scale: number; x: number; y: number };

/** Pinch, wheel or buttons to zoom; drag to pan. Enough for a schematic map, no library needed. */
export const ZoomPan = ({ children, min = 1, max = 3, initial = { scale: 1, x: 0, y: 0 }, zoomInLabel = 'Zoom in', zoomOutLabel = 'Zoom out' }: ZoomPanProps) => {
  const [view, setView] = useState<View>(initial);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ d: number; scale: number } | null>(null);
  const moved = useRef(0);

  const clamp = (v: View): View => ({ ...v, scale: Math.min(max, Math.max(min, v.scale)) });
  const zoomBy = (k: number) => setView((v) => clamp({ ...v, scale: v.scale * k }));

  const onDown = (e: PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved.current = 0;
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y), scale: view.scale };
    }
  };
  const onMove = (e: PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const next = { x: e.clientX, y: e.clientY };
    pointers.current.set(e.pointerId, next);
    if (pinch.current && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const scale = pinch.current.scale * (Math.hypot(a.x - b.x, a.y - b.y) / pinch.current.d);
      setView((v) => clamp({ ...v, scale }));
      return;
    }
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    moved.current += Math.abs(dx) + Math.abs(dy);
    // Capture only once it is a real drag, so taps on stations still reach them
    if (moved.current > 6) (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setView((v) => ({ ...v, x: v.x + dx, y: v.y + dy }));
  };
  const onUp = (e: PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };
  const onWheel = (e: WheelEvent) => zoomBy(e.deltaY < 0 ? 1.1 : 1 / 1.1);

  return (
    <div className="relative h-full w-full touch-none overflow-hidden" onWheel={onWheel}>
      <div
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onClickCapture={(e) => moved.current > 6 && e.stopPropagation()}
        className="h-full w-full cursor-grab active:cursor-grabbing"
      >
        <div className="h-full w-full origin-center transition-transform duration-75" style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}>
          {children}
        </div>
      </div>
      <div className="absolute bottom-4 right-4 flex flex-col overflow-hidden rounded-group bg-surface shadow-toast">
        <button type="button" aria-label={zoomInLabel} onClick={() => zoomBy(1.4)} className="flex size-11 items-center justify-center text-ink active:bg-raised">
          <Plus aria-hidden weight="bold" className="size-5" />
        </button>
        <span aria-hidden className="mx-2 h-px bg-line" />
        <button type="button" aria-label={zoomOutLabel} onClick={() => zoomBy(1 / 1.4)} className="flex size-11 items-center justify-center text-ink active:bg-raised">
          <Minus aria-hidden weight="bold" className="size-5" />
        </button>
      </div>
    </div>
  );
};
