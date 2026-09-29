import { useEffect, useId, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from '@phosphor-icons/react';
import { cx } from '../lib/cx';

export type Detent = 'medium' | 'large' | 'fit';

export interface SheetProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  /** Heights the sheet can rest at. Drag the grabber to move between them; drag below the lowest to close. */
  detents?: Detent[];
  /** Hides the title row (full-bleed content such as a map) but keeps it for screen readers */
  hideTitle?: boolean;
  /** Element the sheet renders into. Defaults to the phone screen overlay slot. */
  container?: HTMLElement | null;
}

const EXIT_MS = 200;
const DRAG_PX = 60;
const HEIGHT: Record<Detent, string> = { fit: 'max-h-[calc(100%-56px)]', medium: 'h-[52%]', large: 'h-[calc(100%-56px)]' };

/** Bottom sheet with grabber and detents. Slides up on the drawer curve, closes faster than it opens. */
export const Sheet = ({ open, title, description, onClose, children, footer, detents = ['fit'], hideTitle = false, container }: SheetProps) => {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  const [detent, setDetent] = useState<Detent>(detents[0]);
  const [drag, setDrag] = useState(0);
  const start = useRef<number | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (open) {
      setMounted(true);
      setDetent(detents[0]);
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(raf);
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), EXIT_MS);
    return () => clearTimeout(t);
    // detents is a static prop per sheet
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!shown) return;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shown, onClose]);

  const onDown = (e: PointerEvent) => {
    start.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    if (start.current === null) return;
    const dy = e.clientY - start.current;
    // Resist upward drag: rubber band
    setDrag(dy < 0 ? dy / 3 : dy);
  };
  const onUp = () => {
    if (start.current === null) return;
    start.current = null;
    const i = detents.indexOf(detent);
    if (drag < -DRAG_PX / 3 && i < detents.length - 1) setDetent(detents[i + 1]);
    else if (drag > DRAG_PX) {
      if (i > 0) setDetent(detents[i - 1]);
      else onClose();
    }
    setDrag(0);
  };

  const target = container ?? (typeof document !== 'undefined' ? document.getElementById('sheet-root') : null);
  if (!mounted || !target) return null;

  return createPortal(
    <div className="pointer-events-auto absolute inset-0 z-sheet flex flex-col justify-end">
      <div
        aria-hidden
        onClick={onClose}
        className={cx('absolute inset-0 bg-scrim/40 transition-opacity', shown ? 'opacity-100 duration-300' : 'opacity-0 duration-200')}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={drag ? { transform: `translateY(${drag}px)`, transition: 'none' } : undefined}
        className={cx(
          'relative flex flex-col rounded-t-sheet bg-surface shadow-sheet outline-none transition-[transform,height] ease-drawer',
          HEIGHT[detent],
          shown ? 'translate-y-0 duration-300' : 'translate-y-full duration-200',
        )}
      >
        {/* Grabber: the whole strip is draggable, 44 px tall for touch */}
        <div
          aria-hidden
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className="absolute inset-x-0 top-0 z-10 flex h-6 cursor-grab touch-none justify-center pt-1.5"
        >
          <span className="h-[5px] w-9 rounded-chip bg-line" />
        </div>
        <div className={cx('flex items-start gap-3 px-4 pb-2 pt-5', hideTitle && 'sr-only')}>
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-title2 text-ink">
              {title}
            </h2>
            {description && <p className="mt-1 text-subheadline text-muted">{description}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="press -mr-1.5 flex size-11 items-center justify-center">
            <span className="flex size-[30px] items-center justify-center rounded-chip bg-raised text-muted">
              <X aria-hidden className="size-3.5" weight="bold" />
            </span>
          </button>
        </div>
        <div className={cx('scroll-area min-h-0 flex-1', !hideTitle && 'px-4 pb-4')}>{children}</div>
        {footer && <div className="px-4 pb-8 pt-3">{footer}</div>}
      </div>
    </div>,
    target,
  );
};
