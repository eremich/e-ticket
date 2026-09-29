import { useNavigate } from 'react-router-dom';
import { NavBar } from '../../components/NavBar';
import { CardRow } from '../../components/CardRow';
import { useName, useT } from '../../i18n';
import { useStore } from '../../store/useStore';

/** All cards on this account, compact */
export const Cards = () => {
  const t = useT();
  const name = useName();
  const navigate = useNavigate();
  const cards = useStore((s) => s.cards);
  return (
    <div className="screen-enter flex flex-1 flex-col gap-6 pb-8">
      <NavBar large title={t('cards.title')} onBack={() => navigate('/profile')} backLabel={t('tab.profile')} />
      <section className="px-4">
        <div className="divide-y divide-line overflow-hidden rounded-group bg-surface">
          {cards.map((c) => (
            <CardRow key={c.id} name={name(c.name)} number={c.number} balance={c.balance} kind={c.kind} blocked={c.blocked} onClick={() => navigate(`/profile/cards/${c.id}`)} />
          ))}
        </div>
      </section>
    </div>
  );
};
