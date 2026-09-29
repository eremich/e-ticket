import { useNavigate } from 'react-router-dom';
import { NavBar } from '../../components/NavBar';
import { ListGroup, ListRow } from '../../components/ListRow';
import { Toggle } from '../../components/Toggle';
import { Chip } from '../../components/Chip';
import { SAVED_CARD_LAST } from '../../data/cards';
import { useT } from '../../i18n';
import { money } from '../../lib/format';
import { useStore } from '../../store/useStore';

const THRESHOLDS = [20, 50];
const AMOUNTS = [50, 100, 200];

/** "When balance is below ₴20, add ₴100": one switch, two choices, one sentence that says what will happen */
export const AutoTopUp = () => {
  const t = useT();
  const navigate = useNavigate();
  const auto = useStore((s) => s.autoTopUp);
  const set = useStore((s) => s.setAutoTopUp);
  const method = useStore((s) => s.method);
  const toast = useStore((s) => s.toast);
  const m = (n: number) => money(t.lang, n);
  const methodLabel = method === 'card' ? t('method.card', { last: SAVED_CARD_LAST }) : t(`method.${method}`);

  return (
    <div className="flex flex-1 flex-col gap-6 pb-8">
      <NavBar title={t('auto.title')} onBack={() => navigate(-1)} backLabel={t('tab.card')} />
      <ListGroup footer={auto.on ? t('auto.summary', { below: m(auto.below), amount: m(auto.amount), method: methodLabel }) : undefined}>
        <ListRow
          title={t('auto.toggle')}
          trailing={
            <Toggle
              label={t('auto.toggle')}
              checked={auto.on}
              onChange={(on) => {
                set({ on });
                toast(on ? t('auto.saved') : t('auto.off'));
              }}
            />
          }
        />
      </ListGroup>
      {auto.on && (
        <div className="rise flex flex-col gap-6 px-4">
          <section className="flex flex-col gap-2">
            <h2 className="px-4 text-footnote uppercase text-muted">{t('auto.below')}</h2>
            <div className="flex gap-2">
              {THRESHOLDS.map((v) => (
                <Chip key={v} label={m(v)} selected={auto.below === v} onClick={() => set({ below: v })} />
              ))}
            </div>
          </section>
          <section className="flex flex-col gap-2">
            <h2 className="px-4 text-footnote uppercase text-muted">{t('auto.add')}</h2>
            <div className="flex gap-2">
              {AMOUNTS.map((v) => (
                <Chip key={v} label={m(v)} selected={auto.amount === v} onClick={() => set({ amount: v })} />
              ))}
            </div>
          </section>
        </div>
      )}
      {auto.on && (
        <ListGroup header={t('topup.method')}>
          <ListRow title={methodLabel} onClick={() => navigate('/card/top-up')} />
        </ListGroup>
      )}
    </div>
  );
};
