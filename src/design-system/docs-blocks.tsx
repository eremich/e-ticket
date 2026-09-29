import type { ReactNode } from 'react';
import { Check, X } from '@phosphor-icons/react';

/** Small building blocks for MDX pages, styled with the Eticket tokens themselves. */

export const Lead = ({ children }: { children: ReactNode }) => <div className="docs-lead max-w-3xl">{children}</div>;

export const DoDont = ({ tone, title, children }: { tone: 'do' | 'dont'; title: string; children: ReactNode }) => {
  const isDo = tone === 'do';
  return (
    <div className={`flex flex-1 flex-col gap-3 rounded-group border p-4 ${isDo ? 'border-ok/40 bg-ok/5' : 'border-error/40 bg-error/5'}`}>
      <div className={`flex items-center gap-2 ${isDo ? 'text-ok-ink' : 'text-error'}`}>
        {isDo ? <Check aria-hidden className="size-4" weight="bold" /> : <X aria-hidden className="size-4" weight="bold" />}
        <strong className="text-headline">{isDo ? 'Do' : "Don't"}</strong>
      </div>
      <div className="flex min-h-16 items-center justify-center rounded-control border border-line bg-surface p-4">{children}</div>
      <p className="text-subheadline text-ink">{title}</p>
    </div>
  );
};

export const DoDontRow = ({ children }: { children: ReactNode }) => <div className="docs-row flex flex-col gap-4 sm:flex-row">{children}</div>;

export const DocCard = ({ title, children, href }: { title: string; children: ReactNode; href?: string }) => {
  const body = (
    <div className="flex h-full flex-col gap-1.5 rounded-group border border-line bg-surface p-4 transition-colors hover:bg-canvas">
      <strong className="text-headline text-ink">{title}</strong>
      <span className="text-subheadline text-muted">{children}</span>
    </div>
  );
  return href ? (
    <a href={href} target="_top" className="docs-card">
      {body}
    </a>
  ) : (
    body
  );
};

export const CardGrid = ({ children }: { children: ReactNode }) => <div className="my-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;

/** A phone-width frame for showing components in context */
export const PhoneWidth = ({ children }: { children: ReactNode }) => <div className="w-[390px] max-w-full bg-canvas p-4">{children}</div>;
