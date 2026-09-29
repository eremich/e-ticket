import { useNavigate } from 'react-router-dom';
import { CreditCard, DeviceMobile } from '@phosphor-icons/react';
import { NavBar } from '../../components/NavBar';
import { useT } from '../../i18n';
import { ChoiceCard } from './parts';

/** Two paths: link a plastic card you already own, or get a virtual one right now */
export const HasCard = () => {
  const t = useT();
  const navigate = useNavigate();
  return (
    <div className="screen-enter flex flex-1 flex-col">
      <NavBar large title={t('hasCard.title')} onBack={() => navigate(-1)} backLabel={t('common.back')} />
      <div className="flex flex-col gap-3 px-4 pb-6 pt-4">
        <ChoiceCard icon={CreditCard} title={t('hasCard.yes')} body={t('hasCard.yesBody')} onClick={() => navigate('/onboarding/add-card')} />
        <ChoiceCard icon={DeviceMobile} title={t('hasCard.no')} body={t('hasCard.noBody')} onClick={() => navigate('/onboarding/virtual')} />
      </div>
    </div>
  );
};
