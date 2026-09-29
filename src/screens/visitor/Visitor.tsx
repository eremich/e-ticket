import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../../components/NavBar';
import { ApplePayButton } from '../../components/ApplePayButton';
import { PaySheet } from '../../components/PaySheet';
import { Segmented } from '../../components/Segmented';
import { TicketOption } from '../../components/TicketOption';
import { LANGS, useLang, useT } from '../../i18n';
import { money } from '../../lib/format';
import { NOW } from '../../lib/time';
import { useStore, type VisitorKind } from '../../store/useStore';
import { Lead, StickyFooter } from '../onboarding/parts';

/** Tickets a visitor can buy without an account: price in hryvnias and how long it lasts in minutes */
export const TICKETS: { kind: VisitorKind; price: number; minutes: number }[] = [
  { kind: 'single', price: 8, minutes: 60 },
  { kind: 'day', price: 60, minutes: 1440 },
  { kind: 'days3', price: 150, minutes: 4320 },
];

const LANG_SHORT = { en: 'EN', uk: 'УК' } as const;

/** Visitor flow: choose a ticket, pay with Apple Pay, get it in Wallet. No account, no card. */
export const Visitor = () => {
  const t = useT();
  const navigate = useNavigate();
  const { lang, setLang } = useLang();
  const setTicket = useStore((s) => s.setVisitorTicket);
  const [kind, setKind] = useState<VisitorKind>('day');
  const [paying, setPaying] = useState(false);
  const option = TICKETS.find((o) => o.kind === kind)!;

  const finish = () => {
    setPaying(false);
    setTicket({ kind, boughtAt: NOW, validUntil: NOW + option.minutes, rides: 0 });
    navigate('/visitor/ticket');
  };

  return (
    <div className="screen-enter flex flex-1 flex-col">
      <NavBar
        large
        title={t('visitor.title')}
        onBack={() => navigate('/onboarding')}
        backLabel={t('common.back')}
        trailing={
          <div className="w-24">
            <Segmented label={t('visitor.language')} value={lang} onChange={setLang} options={LANGS.map((l) => ({ key: l, label: LANG_SHORT[l] }))} />
          </div>
        }
      >
        <Lead>{t('visitor.subtitle')}</Lead>
      </NavBar>
      <div role="radiogroup" aria-label={t('visitor.title')} className="flex flex-1 flex-col gap-3 px-4 pb-6 pt-4">
        {TICKETS.map((o) => (
          <TicketOption key={o.kind} name={t(`visitor.${o.kind}`)} body={t(`visitor.${o.kind}Body` as 'visitor.singleBody')} price={money(t.lang, o.price)} selected={kind === o.kind} onSelect={() => setKind(o.kind)} />
        ))}
      </div>
      <StickyFooter>
        <ApplePayButton label={t('visitor.buy', { name: t(`visitor.${kind}`), price: money(t.lang, option.price) })} onClick={() => setPaying(true)} />
      </StickyFooter>
      <PaySheet open={paying} amount={option.price} merchant={t('pay.merchant')} onDone={finish} onCancel={() => setPaying(false)} />
    </div>
  );
};
