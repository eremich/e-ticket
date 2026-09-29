import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle } from '@phosphor-icons/react';
import { NavBar } from '../../components/NavBar';
import { Button } from '../../components/Button';
import { ProblemReport, type ReportReasonKey } from '../../components/ProblemReport';
import { StatusTimeline } from '../../components/StatusTimeline';
import { useT } from '../../i18n';
import { clock, money } from '../../lib/format';
import { NOW } from '../../lib/time';
import { useStore } from '../../store/useStore';
import { findDuplicate } from './data';
import { Footer } from './parts';
import { useTimelines } from './timelines';

type Result = { kind: 'refund'; amount: number; balance: number } | { kind: 'request' };

/**
 * Report a problem with a ride. A double charge on the same card within a minute is refunded on the spot;
 * everything else becomes a request that gets an answer within 3 days.
 */
export const Report = () => {
  const t = useT();
  const navigate = useNavigate();
  const { id } = useParams();
  const ride = useStore((s) => s.activity.find((a) => a.id === id));
  const [reason, setReason] = useState<ReportReasonKey | null>(null);
  const [note, setNote] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const { request } = useTimelines();
  const done = () => navigate('/profile');

  const submit = () => {
    const s = useStore.getState();
    if (!ride || !reason) return;
    if (reason === 'double' && findDuplicate(s.activity, ride)) {
      s.refundRide(ride.id);
      const balance = useStore.getState().cards.find((c) => c.id === ride.cardId)?.balance ?? 0;
      setResult({ kind: 'refund', amount: -ride.amount, balance });
      return;
    }
    s.addRequest(ride.id, reason);
    setResult({ kind: 'request' });
  };

  if (result) {
    return (
      <div className="screen-enter flex flex-1 flex-col">
        <NavBar title={t('report.title')} />
        <div className="flex flex-1 flex-col items-center gap-3 px-6 pt-10 text-center">
          <CheckCircle aria-hidden weight="fill" className="pop-in size-20 text-ok" />
          {result.kind === 'refund' ? (
            <>
              <h1 className="tnum text-large-title text-ink">{t('report.refunded', { amount: money(t.lang, result.amount) })}</h1>
              <p className="tnum text-body text-muted">{t('report.refundedBody', { balance: money(t.lang, result.balance) })}</p>
            </>
          ) : (
            <>
              <h1 className="text-title2 text-ink">{t('report.sentTitle')}</h1>
              <p className="text-body text-muted">{t('report.sentBody')}</p>
              <div className="mt-4 w-full rounded-group bg-surface p-4 text-left">
                <StatusTimeline label={t('request.title')} steps={request('sent', `${t('trip.today')}, ${clock(NOW)}`)} />
              </div>
            </>
          )}
        </div>
        <Footer>
          <Button block onClick={done}>
            {t('report.done')}
          </Button>
        </Footer>
      </div>
    );
  }

  return (
    <div className="screen-enter flex flex-1 flex-col">
      <NavBar large title={t('report.title')} onBack={() => navigate(-1)} backLabel={t('common.back')} />
      <ProblemReport reason={reason} onReasonChange={setReason} note={note} onNoteChange={setNote} onSubmit={submit} />
    </div>
  );
};
