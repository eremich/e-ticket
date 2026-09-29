import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CaretLeft } from '@phosphor-icons/react';
import { cx } from '../lib/cx';

export interface NavBarProps {
  title: string;
  /** Large title for tab roots; it collapses into the compact bar on scroll */
  large?: boolean;
  onBack?: () => void;
  backLabel?: string;
  trailing?: ReactNode;
  /** Content under the large title that scrolls with it (a search field, a segmented control) */
  children?: ReactNode;
}

const BAR_PX = 44;

/** Nearest ancestor that scrolls vertically, so the bar works in the app and in Storybook */
const scrollParent = (el: HTMLElement | null): HTMLElement | null => {
  for (let n = el?.parentElement; n; n = n.parentElement) {
    const oy = getComputedStyle(n).overflowY;
    if (oy === 'auto' || oy === 'scroll') return n;
  }
  return null;
};

const BackButton = ({ onBack, label }: { onBack: () => void; label: string }) => (
  <button type="button" onClick={onBack} aria-label={label} className="press -ml-1.5 flex size-11 items-center justify-center">
    <span className="flex size-10 items-center justify-center rounded-chip bg-surface text-ink shadow-[0_1px_2px_rgb(0_0_0/0.06)]">
      <CaretLeft aria-hidden className="size-5" weight="bold" />
    </span>
  </button>
);

/** iOS navigation bar: large title that collapses on scroll, or a compact bar with back */
export const NavBar = ({ title, large = false, onBack, backLabel = 'Back', trailing, children }: NavBarProps) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [collapsed, setCollapsed] = useState(!large);

  useEffect(() => {
    const el = titleRef.current;
    if (!large || !el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setCollapsed(!e.isIntersecting), {
      root: scrollParent(el),
      rootMargin: `-${BAR_PX}px 0px 0px 0px`,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [large]);

  return (
    <>
      <div className="sticky top-0 z-sticky">
        <div
          className={cx(
            'grid h-11 grid-cols-[1fr_auto_1fr] items-center gap-2 border-b px-4 transition-[background-color,border-color] duration-150',
            collapsed ? 'border-line bg-canvas/90 backdrop-blur-md' : 'border-transparent',
          )}
        >
          <div className="flex min-w-0">{onBack && <BackButton onBack={onBack} label={backLabel} />}</div>
          <span
            aria-hidden={large || undefined}
            className={cx('max-w-52 truncate text-headline text-ink transition-opacity duration-150', collapsed ? 'opacity-100' : 'opacity-0')}
          >
            {large ? title : <h1>{title}</h1>}
          </span>
          <div className="flex justify-end">{trailing}</div>
        </div>
      </div>
      {large && (
        <header className="px-4 pb-2">
          <h1 ref={titleRef} className="text-large-title text-ink">
            {title}
          </h1>
          {children && <div className="mt-2">{children}</div>}
        </header>
      )}
    </>
  );
};
