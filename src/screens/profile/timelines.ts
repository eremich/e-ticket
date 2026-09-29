import type { TimelineStep } from '../../components/StatusTimeline';
import { useT } from '../../i18n';
import { date, numericDate } from '../../lib/format';
import { minusDays, plusYear } from './data';

export type RenewalPhase = 'reminder' | 'expiring' | 'uploaded' | 'approved' | 'declined';
export type RequestStatus = 'sent' | 'review' | 'answered';

const step = (state: TimelineStep['state'], title: string, when?: string, body?: string): TimelineStep => ({ state, title, when, body });

/** Steps for the timelines on request and reduced-fare screens, in the current language */
export const useTimelines = () => {
  const t = useT();
  const short = (d: Date) => date(t.lang, d, { day: 'numeric', month: 'short' });
  const full = (d: Date) => numericDate(t.lang, d);

  const request = (status: RequestStatus, sent: string): TimelineStep[] => {
    const at = { sent: 0, review: 1, answered: 2 }[status];
    const state = (i: number): TimelineStep['state'] => (i < at ? 'done' : i === at ? 'current' : 'upcoming');
    return [
      step(state(0), t('timeline.reqSent'), sent),
      step(state(1), t('timeline.reqReview'), undefined, status === 'review' ? t('timeline.reqReviewBody') : undefined),
      step(state(2), status === 'answered' ? t('timeline.reqAnswered') : t('timeline.reqAnswer'), undefined, status === 'answered' ? t('timeline.reqAnsweredBody') : t('timeline.reqAnswerBody')),
    ].map((s, i) => (i === 2 && status === 'answered' ? { ...s, state: 'done' as const } : s));
  };

  const renewal = (phase: RenewalPhase, until: Date, uploaded: string): TimelineStep[] => {
    const reminder = short(minusDays(until, 14));
    const renewed = t('timeline.renewApproved', { date: full(plusYear(until)) });
    if (phase === 'reminder') return [step('current', t('timeline.renewReminder'), reminder, t('timeline.renewReminderBody')), step('upcoming', t('timeline.renewUploaded')), step('upcoming', t('timeline.renewChecked')), step('upcoming', renewed)];
    if (phase === 'expiring') return [step('done', t('timeline.renewReminder'), reminder), step('current', t('timeline.renewUploaded')), step('upcoming', t('timeline.renewChecked')), step('upcoming', renewed)];
    if (phase === 'uploaded') return [step('done', t('timeline.renewReminder'), reminder), step('done', t('timeline.renewUploaded'), uploaded), step('current', t('timeline.renewChecked'), undefined, t('timeline.renewCheckedBody')), step('upcoming', renewed)];
    if (phase === 'declined') return [step('done', t('timeline.renewReminder'), reminder), step('done', t('timeline.renewUploaded'), uploaded), step('error', t('timeline.renewDeclined'), uploaded, t('timeline.renewDeclinedBody')), step('upcoming', renewed)];
    return [step('done', t('timeline.renewReminder'), reminder), step('done', t('timeline.renewUploaded'), uploaded), step('done', t('timeline.renewChecked'), uploaded), step('done', renewed)];
  };

  return { request, renewal };
};
