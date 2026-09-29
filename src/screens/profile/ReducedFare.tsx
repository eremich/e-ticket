import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleNotch, GraduationCap, IdentificationCard, ImageSquare } from '@phosphor-icons/react';
import { NavBar } from '../../components/NavBar';
import { Banner } from '../../components/Banner';
import { Button } from '../../components/Button';
import { StatusTimeline } from '../../components/StatusTimeline';
import { useT } from '../../i18n';
import { clock, money, numericDate } from '../../lib/format';
import { NOW } from '../../lib/time';
import { useActiveCard, useStore } from '../../store/useStore';
import { plusYear, reducedState } from './data';
import { Footer } from './parts';
import { useTimelines, type RenewalPhase } from './timelines';

const CHECK_MS = 1500;
const REDUCED_DIVISOR = 2;

type Step = 'idle' | 'upload' | 'checking';
type Outcome = 'approved' | 'declined' | null;

/** Reduced fare: apply, see status and renewal progress, renew before it ends */
export const ReducedFare = () => {
  const t = useT();
  const navigate = useNavigate();
  const card = useActiveCard();
  const fare = useStore((s) => s.fare);
  const declines = useStore((s) => s.renewalDeclines);
  const setReduced = useStore((s) => s.setReduced);
  const toast = useStore((s) => s.toast);
  const { renewal } = useTimelines();
  const [step, setStep] = useState<Step>('idle');
  const [outcome, setOutcome] = useState<Outcome>(null);
  const status = reducedState(card.reduced);
  const shortDate = (d: Date) => numericDate(t.lang, d);
  const m = (n: number) => money(t.lang, n);
  const back = () => navigate('/profile');

  useEffect(() => {
    if (step !== 'checking' || !card.reduced) return;
    const id = setTimeout(() => {
      if (declines) {
        setOutcome('declined');
      } else {
        setReduced(card.id, { ...card.reduced!, until: plusYear(card.reduced!.until) });
        setOutcome('approved');
        toast(t('reducedScreen.approvedTitle', { date: shortDate(plusYear(card.reduced!.until)) }));
      }
      setStep('idle');
    }, CHECK_MS);
    return () => clearTimeout(id);
    // Runs once per upload
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  if (status.state === 'none') {
    return (
      <div className="screen-enter flex flex-1 flex-col">
        <NavBar title={t('reducedScreen.title')} onBack={back} backLabel={t('tab.profile')} />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 pb-10 text-center">
          <span aria-hidden className="flex size-24 items-center justify-center rounded-eticket bg-raised text-ink">
            <IdentificationCard weight="regular" className="size-12" />
          </span>
          <h1 className="text-title2 text-ink">{t('reducedScreen.noneTitle')}</h1>
          <p className="text-body text-muted">{t('reducedScreen.noneBody')}</p>
        </div>
        <Footer>
          <Button block onClick={() => navigate('/onboarding/reduced?from=profile')}>
            {t('reducedScreen.apply')}
          </Button>
        </Footer>
      </div>
    );
  }

  const kind = card.reduced!.kind;
  const doc = t(kind === 'student' ? 'reduced.studentDoc' : 'reduced.pensionerDoc');

  if (step !== 'idle') {
    return (
      <div className="screen-enter flex flex-1 flex-col">
        <NavBar title={t(`reduced.${kind}`)} onBack={step === 'upload' ? () => setStep('idle') : undefined} backLabel={t('common.back')} />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 pb-10 text-center">
          {step === 'checking' ? (
            <div role="status" className="flex flex-col items-center gap-3">
              <CircleNotch aria-hidden weight="bold" className="size-12 animate-spin text-action" />
              <p className="text-headline text-ink">{t('reduced.checking')}</p>
            </div>
          ) : (
            <>
              <span aria-hidden className="flex size-24 items-center justify-center rounded-eticket bg-raised text-ink">
                <ImageSquare weight="regular" className="size-12" />
              </span>
              <h1 className="text-title2 text-ink">{t('reduced.upload', { doc })}</h1>
              <p className="text-body text-muted">{t('reduced.uploadHint')}</p>
            </>
          )}
        </div>
        {step === 'upload' && (
          <Footer>
            <Button block icon={<ImageSquare aria-hidden weight="bold" className="size-5" />} onClick={() => setStep('checking')}>
              {t('reduced.choosePhoto')}
            </Button>
          </Footer>
        )}
      </div>
    );
  }

  const phase: RenewalPhase = outcome === 'declined' ? 'declined' : outcome === 'approved' ? 'approved' : status.state === 'expiring' ? 'expiring' : 'reminder';
  const uploaded = `${t('trip.today')}, ${clock(NOW)}`;
  const reducedFare = m(fare / REDUCED_DIVISOR);
  const expiring = status.state === 'expiring' && outcome === null;
  const declined = outcome === 'declined';
  // After approval the store holds the new date; the timeline is built from the one it replaced
  const until = card.reduced!.until;
  const renewedFrom = phase === 'approved' ? new Date(until.getFullYear() - 1, until.getMonth(), until.getDate()) : until;

  return (
    <div className="screen-enter flex flex-1 flex-col gap-6 pb-8">
      <NavBar large title={t('reducedScreen.title')} onBack={back} backLabel={t('tab.profile')} />
      <section className="px-4">
        <div className="flex items-center gap-4 rounded-group bg-surface p-4">
          <span aria-hidden className="flex size-12 shrink-0 items-center justify-center rounded-control bg-raised text-ink">
            <GraduationCap weight="regular" className="size-6" />
          </span>
          <div className="min-w-0">
            <p className="tnum text-headline text-ink">{t('reducedScreen.status', { who: t(`reduced.${kind}`), date: shortDate(card.reduced!.until) })}</p>
            <p className="tnum text-subheadline text-muted">{t('reducedScreen.pays', { fare: declined ? m(fare) : reducedFare })}</p>
          </div>
        </div>
      </section>

      {expiring && (
        <section className="px-4">
          <Banner tone="warn" title={t('reducedScreen.expiring', { date: shortDate(card.reduced!.until) })} action={<Button size="md" onClick={() => setStep('upload')}>{t('reducedScreen.renew')}</Button>}>
            {t('reducedScreen.expiringBody', { fare: reducedFare })}
          </Banner>
        </section>
      )}
      {declined && (
        <section className="px-4">
          <Banner tone="error" title={t('reducedScreen.declinedTitle')} action={<Button size="md" onClick={() => setStep('upload')}>{t('reducedScreen.uploadAgain')}</Button>}>
            {t('reducedScreen.declinedBody', { fare: m(fare) })}
          </Banner>
        </section>
      )}

      <section className="px-4">
        <h2 className="section-title pb-2">{t('reducedScreen.renewal')}</h2>
        <div className="rounded-group bg-surface p-4">
          <StatusTimeline label={t('reducedScreen.renewal')} steps={renewal(phase, renewedFrom, uploaded)} />
        </div>
      </section>
    </div>
  );
};
