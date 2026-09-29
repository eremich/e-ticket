import { useId } from 'react';
import { Button } from './Button';
import { useT } from '../i18n';
import { cx } from '../lib/cx';

export type ReportReasonKey = 'double' | 'gate' | 'fare';
export const REPORT_REASONS: ReportReasonKey[] = ['double', 'gate', 'fare'];

export interface ProblemReportProps {
  reason: ReportReasonKey | null;
  onReasonChange: (r: ReportReasonKey) => void;
  note: string;
  onNoteChange: (v: string) => void;
  onSubmit: () => void;
}

/** What went wrong with a trip: pick one reason, add a note if useful, send. The button stays off until a reason is picked. */
export const ProblemReport = ({ reason, onReasonChange, note, onNoteChange, onSubmit }: ProblemReportProps) => {
  const t = useT();
  const noteId = useId();
  return (
    <form
      className="flex flex-1 flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        if (reason) onSubmit();
      }}
    >
      <div className="flex flex-col gap-6 px-4 pb-6 pt-2">
        <section>
          <h2 className="section-title pb-2">{t('report.reason')}</h2>
          <div role="radiogroup" aria-label={t('report.reason')} className="overflow-hidden rounded-group bg-surface">
            {REPORT_REASONS.map((r, i) => {
              const on = reason === r;
              return (
                <button
                  key={r}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => onReasonChange(r)}
                  className={cx('flex min-h-13 w-full items-center gap-3 px-4 text-left transition-colors duration-100 active:bg-raised', i > 0 && 'border-t border-line')}
                >
                  <span aria-hidden className={cx('flex size-6 shrink-0 items-center justify-center rounded-chip ring-2 ring-inset', on ? 'ring-action' : 'ring-line')}>
                    {on && <span className="pop-in size-3 rounded-chip bg-accent" />}
                  </span>
                  <span className="text-body text-ink">{t(`report.${r}`)}</span>
                </button>
              );
            })}
          </div>
        </section>
        <section className="flex flex-col gap-1.5">
          <label htmlFor={noteId} className="section-title">
            {t('report.note')}
          </label>
          <textarea
            id={noteId}
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            rows={4}
            placeholder={t('report.notePlaceholder')}
            className="w-full resize-none rounded-group bg-surface p-4 text-body text-ink outline-none ring-1 ring-inset ring-line placeholder:text-muted/70 focus:ring-2 focus:ring-action"
          />
        </section>
      </div>
      <div className="sticky bottom-0 z-10 mt-auto border-t border-line bg-canvas/95 px-4 pb-4 pt-3 backdrop-blur">
        <Button type="submit" block disabled={!reason}>
          {t('report.send')}
        </Button>
      </div>
    </form>
  );
};
