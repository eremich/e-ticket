import { Check, X } from '@phosphor-icons/react';
import { cx } from '../lib/cx';

export interface TimelineStep {
  title: string;
  /** Time or date the step happened, or is expected */
  when?: string;
  body?: string;
  /** done = filled check, current = ring, upcoming = empty, error = red cross */
  state: 'done' | 'current' | 'upcoming' | 'error';
}

export interface StatusTimelineProps {
  steps: TimelineStep[];
  /** Names the list for screen readers: "Request status" */
  label: string;
}

const DOT: Record<TimelineStep['state'], string> = {
  done: 'bg-ok text-on-action',
  current: 'bg-surface text-action ring-[3px] ring-inset ring-action',
  upcoming: 'bg-surface ring-2 ring-inset ring-line',
  error: 'bg-error text-on-action',
};

/** Vertical progress of a request or renewal: what happened, what is happening, what comes next */
export const StatusTimeline = ({ steps, label }: StatusTimelineProps) => (
  <ol aria-label={label} className="flex flex-col">
    {steps.map((s, i) => {
      const last = i === steps.length - 1;
      const next = steps[i + 1];
      return (
        <li key={s.title} aria-current={s.state === 'current' ? 'step' : undefined} className="relative flex gap-3 pb-5 last:pb-0">
          {!last && (
            <span aria-hidden className={cx('absolute bottom-0 left-[11px] top-7 w-0.5', s.state === 'done' && next?.state !== 'upcoming' ? 'bg-ok' : 'bg-line')} />
          )}
          <span aria-hidden className={cx('relative z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-chip', DOT[s.state])}>
            {s.state === 'done' && <Check weight="bold" className="size-3.5" />}
            {s.state === 'error' && <X weight="bold" className="size-3.5" />}
            {s.state === 'current' && <span className="size-2 rounded-chip bg-action" />}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3">
              <p className={cx('text-body', s.state === 'upcoming' ? 'text-muted' : 'text-ink', s.state === 'current' && 'font-semibold', s.state === 'error' && 'text-error')}>{s.title}</p>
              {s.when && <p className="tnum shrink-0 text-footnote text-muted">{s.when}</p>}
            </div>
            {s.body && <p className={cx('text-subheadline', s.state === 'error' ? 'text-error' : 'text-muted')}>{s.body}</p>}
          </div>
        </li>
      );
    })}
  </ol>
);
