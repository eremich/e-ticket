import { useNavigate } from 'react-router-dom';
import { NavBar } from '../../components/NavBar';
import { Button } from '../../components/Button';
import { EticketCard } from '../../components/EticketCard';
import { useName, useT } from '../../i18n';
import { useStore } from '../../store/useStore';
import { Lead, StickyFooter } from './parts';
import { buildCard, VIRTUAL_NUMBER } from './newCard';

/** No plastic card: make a virtual one that lives in the phone */
export const Virtual = () => {
  const t = useT();
  const name = useName();
  const navigate = useNavigate();
  const cards = useStore((s) => s.cards);
  const addCard = useStore((s) => s.addCard);
  const fare = useStore((s) => s.fare);
  const card = buildCard(cards, VIRTUAL_NUMBER, 0, 'virtual');
  return (
    <div className="screen-enter flex flex-1 flex-col">
      <NavBar large title={t('virtual.title')} onBack={() => navigate(-1)} backLabel={t('common.back')} />
      <div className="flex flex-1 flex-col gap-6 px-4 pb-6 pt-2">
        <Lead>{t('virtual.body')}</Lead>
        <div className="mx-auto w-full max-w-72">
          <EticketCard name={name(card.name)} number={card.number} balance={0} fare={fare} kind="virtual" />
        </div>
      </div>
      <StickyFooter>
        <Button
          block
          onClick={() => {
            addCard(card);
            navigate('/onboarding/reduced');
          }}
        >
          {t('virtual.create')}
        </Button>
      </StickyFooter>
    </div>
  );
};
