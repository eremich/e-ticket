import type { Icon } from '@phosphor-icons/react';
import { CaretRight } from '@phosphor-icons/react';
import type { ReactNode } from 'react';

/** Sticky bottom action area shared by onboarding and visitor screens */
export const StickyFooter = ({ children }: { children: ReactNode }) => (
  <div className="sticky bottom-0 mt-auto flex flex-col gap-2 border-t border-line bg-canvas/95 px-4 pb-4 pt-3 backdrop-blur">{children}</div>
);

/** Screen intro under a large title: one calm line of context */
export const Lead = ({ children }: { children: ReactNode }) => <p className="text-body text-muted">{children}</p>;

export interface ChoiceCardProps {
  icon: Icon;
  title: string;
  body?: string;
  onClick: () => void;
}

/** Large tappable choice: used when one answer leads to a different path */
export const ChoiceCard = ({ icon: Icon, title, body, onClick }: ChoiceCardProps) => (
  <button type="button" onClick={onClick} className="press flex min-h-20 w-full items-center gap-4 rounded-group bg-surface p-4 text-left">
    <span className="flex size-12 shrink-0 items-center justify-center rounded-control bg-action-soft text-action">
      <Icon aria-hidden weight="regular" className="size-6" />
    </span>
    <span className="flex min-w-0 flex-1 flex-col">
      <span className="text-headline text-ink">{title}</span>
      {body && <span className="text-subheadline text-muted">{body}</span>}
    </span>
    <CaretRight aria-hidden weight="bold" className="size-4 shrink-0 text-muted/70" />
  </button>
);
