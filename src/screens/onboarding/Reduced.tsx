import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, CircleNotch, GraduationCap, IdentificationCard, ImageSquare, UserCircle } from '@phosphor-icons/react';
import { NavBar } from '../../components/NavBar';
import { Button } from '../../components/Button';
import { useT } from '../../i18n';
import { money, numericDate } from '../../lib/format';
import { useActiveCard, useStore } from '../../store/useStore';
import { ChoiceCard, Lead, StickyFooter } from './parts';

type Kind = 'student' | 'pensioner';
type Step = 'choose' | 'upload' | 'checking' | 'approved';

const CHECK_MS = 1500;
/** Reduced fare is confirmed once a year; the prototype always approves until this day */
const UNTIL = new Date(2027, 5, 30);
const REDUCED_DIVISOR = 2;

/** Reduced fare: pick a status, upload a document, get approved (simulated) */
export const Reduced = () => {
  const t = useT();
  const navigate = useNavigate();
  const card = useActiveCard();
  const setReduced = useStore((s) => s.setReduced);
  const fare = useStore((s) => s.fare);
  const [kind, setKind] = useState<Kind>('student');
  const [step, setStep] = useState<Step>('choose');
  const fromProfile = useSearchParams()[0].get('from') === 'profile';
  const next = () => (fromProfile ? navigate('/profile/reduced', { replace: true }) : navigate('/onboarding/wallet'));

  useEffect(() => {
    if (step !== 'checking') return;
    const id = setTimeout(() => {
      setReduced(card.id, { kind, until: UNTIL });
      setStep('approved');
    }, CHECK_MS);
    return () => clearTimeout(id);
  }, [step, kind, card.id, setReduced]);

  const pick = (k: Kind) => {
    setKind(k);
    setStep('upload');
  };
  const doc = t(kind === 'student' ? 'reduced.studentDoc' : 'reduced.pensionerDoc');
  const back = () => (step === 'upload' ? setStep('choose') : navigate(-1));

  if (step === 'choose') {
    return (
      <div className="screen-enter flex flex-1 flex-col">
        <NavBar large title={t('reduced.title')} onBack={back} backLabel={t('common.back')} />
        <div className="flex flex-col gap-3 px-4 pb-6 pt-2">
          <Lead>{t('reduced.body')}</Lead>
          <div className="mt-2 flex flex-col gap-3">
            <ChoiceCard icon={GraduationCap} title={t('reduced.student')} onClick={() => pick('student')} />
            <ChoiceCard icon={IdentificationCard} title={t('reduced.pensioner')} onClick={() => pick('pensioner')} />
            <ChoiceCard icon={UserCircle} title={t('reduced.none')} onClick={next} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-enter flex flex-1 flex-col">
      <NavBar title={t(`reduced.${kind}`)} onBack={step === 'upload' ? back : undefined} backLabel={t('common.back')} />
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 pb-10 text-center">
        {step === 'approved' ? (
          <>
            <CheckCircle aria-hidden weight="fill" className="pop-in size-20 text-ok" />
            <h1 className="tnum text-title2 text-ink">{t('reduced.approved', { date: numericDate(t.lang, UNTIL) })}</h1>
            <p className="tnum text-body text-muted">{t('reduced.approvedBody', { fare: money(t.lang, fare / REDUCED_DIVISOR) })}</p>
          </>
        ) : step === 'checking' ? (
          <div role="status" className="flex flex-col items-center gap-3">
            <CircleNotch aria-hidden weight="bold" className="size-12 animate-spin text-action" />
            <p className="text-headline text-ink">{t('reduced.checking')}</p>
          </div>
        ) : (
          <>
            <span aria-hidden className="flex size-24 items-center justify-center rounded-eticket bg-action-soft text-action">
              <ImageSquare weight="regular" className="size-12" />
            </span>
            <h1 className="text-title2 text-ink">{t('reduced.upload', { doc })}</h1>
            <p className="text-body text-muted">{t('reduced.uploadHint')}</p>
          </>
        )}
      </div>
      {step !== 'checking' && (
        <StickyFooter>
          {step === 'approved' ? (
            <Button block onClick={next}>
              {t('onboarding.continue')}
            </Button>
          ) : (
            <Button block icon={<ImageSquare aria-hidden weight="bold" className="size-5" />} onClick={() => setStep('checking')}>
              {t('reduced.choosePhoto')}
            </Button>
          )}
        </StickyFooter>
      )}
    </div>
  );
};
