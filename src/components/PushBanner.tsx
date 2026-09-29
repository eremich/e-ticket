import { EticketLogo } from './EticketCard';

export interface PushBannerProps {
  app: string;
  title: string;
  body?: string;
  time: string;
  onClick?: () => void;
}

/** An iOS notification sliding in at the top of the screen: the get-off alert, arrival alerts */
export const PushBanner = ({ app, title, body, time, onClick }: PushBannerProps) => (
  <button
    type="button"
    role="alert"
    onClick={onClick}
    className="push-in flex w-full items-start gap-3 rounded-[22px] bg-surface/90 p-3 text-left shadow-toast backdrop-blur-xl"
  >
    <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-[9px] bg-card-face text-white">
      <EticketLogo className="text-[9px]" />
    </span>
    <span className="min-w-0 flex-1">
      <span className="flex items-baseline justify-between gap-2">
        <span className="section-title px-0">{app}</span>
        <span className="text-footnote text-muted">{time}</span>
      </span>
      <span className="block text-headline text-ink">{title}</span>
      {body && <span className="block text-subheadline text-ink">{body}</span>}
    </span>
  </button>
);
