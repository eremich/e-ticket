import { useNavigate } from 'react-router-dom';
import { Keyboard, WifiHigh } from '@phosphor-icons/react';
import { Sheet } from '../../components/Sheet';
import { ListGroup, ListRow, RowIcon } from '../../components/ListRow';
import { useT } from '../../i18n';

/** Two ways in: read the plastic card over NFC, or type its number */
export const AddCardSheet = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const t = useT();
  const navigate = useNavigate();
  const go = (mode: 'hold' | 'number') => {
    onClose();
    navigate(`/onboarding/add-card?mode=${mode}&from=card`);
  };
  return (
    <Sheet open={open} title={t('addCard.title')} onClose={onClose}>
      <div className="-mx-4">
        <ListGroup inset="icon">
          <ListRow leading={<RowIcon><WifiHigh weight="bold" className="rotate-90" /></RowIcon>} title={t('addCard.hold')} onClick={() => go('hold')} />
          <ListRow leading={<RowIcon tone="muted"><Keyboard weight="bold" /></RowIcon>} title={t('addCard.enter')} onClick={() => go('number')} />
        </ListGroup>
      </div>
    </Sheet>
  );
};
