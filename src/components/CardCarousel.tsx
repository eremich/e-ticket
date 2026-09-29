import { useEffect, useRef, type UIEvent } from 'react';
import { cx } from '../lib/cx';
import { EticketCard, type EticketCardProps } from './EticketCard';

export interface CardCarouselProps {
  cards: (EticketCardProps & { id: string })[];
  active: string;
  onChange: (id: string) => void;
}

/** Several cards: swipe horizontally, the next card peeks in. Dots show position and switch cards. */
export const CardCarousel = ({ cards, active, onChange }: CardCarouselProps) => {
  const track = useRef<HTMLDivElement>(null);
  const index = Math.max(0, cards.findIndex((c) => c.id === active));

  // Keep the track in sync when the active card changes from outside (dots, store)
  useEffect(() => {
    const el = track.current;
    const slide = el?.children[index] as HTMLElement | undefined;
    if (el && slide && Math.abs(el.scrollLeft - slide.offsetLeft + 16) > 4) el.scrollTo({ left: slide.offsetLeft - 16, behavior: 'smooth' });
  }, [index]);

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const w = (el.children[0] as HTMLElement | undefined)?.offsetWidth ?? 1;
    const i = Math.round(el.scrollLeft / (w + 12));
    if (cards[i] && cards[i].id !== active) onChange(cards[i].id);
  };

  return (
    <div>
      <div ref={track} onScroll={onScroll} className="scroll-x flex snap-x snap-mandatory gap-3 px-4 pb-4 pt-1" aria-roledescription="carousel">
        {cards.map(({ id, ...card }, i) => (
          <div
            key={id}
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${cards.length}`}
            className={cx('w-[calc(100%-24px)] shrink-0 snap-center transition-[opacity,transform] duration-300 ease-out', i !== index && 'scale-[0.96] opacity-70')}
          >
            <EticketCard {...card} />
          </div>
        ))}
      </div>
      {cards.length > 1 && (
        <div role="tablist" className="flex justify-center gap-1.5">
          {cards.map((c, i) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={c.name}
              onClick={() => onChange(c.id)}
              className="flex h-6 items-center px-0.5"
            >
              <span className={cx('h-1.5 rounded-chip transition-all duration-200', i === index ? 'w-4 bg-ink' : 'w-1.5 bg-muted/40')} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
