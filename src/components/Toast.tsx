import { CheckCircle, Warning } from '@phosphor-icons/react';

export interface ToastProps {
  message: string;
  tone?: 'ok' | 'error';
}

/** Short confirmation that repeats what happened: "₴100 added", "Card blocked" */
export const Toast = ({ message, tone = 'ok' }: ToastProps) => {
  const Icon = tone === 'ok' ? CheckCircle : Warning;
  return (
    <div role="status" className="toast-enter flex items-center gap-2.5 rounded-chip bg-ink py-2.5 pl-3 pr-4 text-subheadline font-semibold text-canvas shadow-toast">
      <Icon aria-hidden className={tone === 'ok' ? 'size-5 text-ok' : 'size-5 text-error'} weight="fill" />
      {message}
    </div>
  );
};
