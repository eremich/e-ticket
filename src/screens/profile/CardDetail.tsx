import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { DeviceMobile, PencilSimple, Prohibit } from '@phosphor-icons/react';
import { NavBar } from '../../components/NavBar';
import { Button } from '../../components/Button';
import { EticketCard } from '../../components/EticketCard';
import { ListGroup, ListRow, RowIcon } from '../../components/ListRow';
import { Sheet } from '../../components/Sheet';
import { useName, useT } from '../../i18n';
import { useStore } from '../../store/useStore';
import { AlertPortal } from './parts';

const MAX_NAME = 24;

/** One card: see it, rename it, move it to this phone, report it lost, or remove it */
export const CardDetail = () => {
  const t = useT();
  const name = useName();
  const navigate = useNavigate();
  const { id } = useParams();
  const cards = useStore((s) => s.cards);
  const fare = useStore((s) => s.fare);
  const rename = useStore((s) => s.renameCard);
  const remove = useStore((s) => s.removeCard);
  const toast = useStore((s) => s.toast);
  const card = cards.find((c) => c.id === id);
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState('');
  const [confirmRemove, setConfirmRemove] = useState(false);

  if (!card) return <Navigate to="/profile/cards" replace />;
  const isLast = cards.length < 2;
  const base = `/profile/cards/${card.id}`;

  const openRename = () => {
    setDraft(name(card.name));
    setRenaming(true);
  };
  const save = () => {
    const v = draft.trim();
    if (!v) return;
    rename(card.id, v);
    setRenaming(false);
    toast(t('cards.renamed'));
  };

  return (
    <div className="screen-enter flex flex-1 flex-col gap-6 pb-8">
      <NavBar title={name(card.name)} onBack={() => navigate('/profile/cards')} backLabel={t('cards.title')} />
      <div className="px-4">
        <EticketCard name={name(card.name)} number={card.number} balance={card.balance} fare={fare} kind={card.kind} reduced={card.reduced} blocked={card.blocked} express={card.express} />
      </div>

      <ListGroup inset="icon">
        <ListRow leading={<RowIcon><PencilSimple weight="bold" /></RowIcon>} title={t('cards.rename')} onClick={openRename} />
        {card.kind === 'plastic' && !card.blocked && <ListRow leading={<RowIcon><DeviceMobile weight="bold" /></RowIcon>} title={t('cards.toPhone')} onClick={() => navigate(`${base}/to-phone`)} />}
        {!card.blocked && <ListRow leading={<RowIcon tone="error"><Prohibit weight="bold" /></RowIcon>} title={t('cards.lost')} onClick={() => navigate(`${base}/lost`)} />}
      </ListGroup>

      <ListGroup footer={isLast ? t('cards.removeLast') : undefined}>
        <ListRow destructive chevron={false} title={t('cards.remove')} onClick={isLast ? undefined : () => setConfirmRemove(true)} />
      </ListGroup>

      <Sheet
        open={renaming}
        title={t('cards.renameTitle')}
        onClose={() => setRenaming(false)}
        footer={
          <Button block disabled={!draft.trim()} onClick={save}>
            {t('cards.save')}
          </Button>
        }
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <label className="sr-only" htmlFor="card-name">
            {t('cards.renameField')}
          </label>
          <input
            id="card-name"
            value={draft}
            maxLength={MAX_NAME}
            onChange={(e) => setDraft(e.target.value)}
            className="h-13 w-full rounded-control bg-canvas px-4 text-headline text-ink outline-none ring-1 ring-inset ring-line focus:ring-2 focus:ring-action"
          />
        </form>
      </Sheet>

      {confirmRemove && (
        <AlertPortal
          title={t('cards.removeTitle')}
          body={t('cards.removeBody')}
          actions={[
            { label: t('common.cancel'), onPress: () => setConfirmRemove(false) },
            {
              label: t('cards.removeConfirm'),
              primary: true,
              onPress: () => {
                setConfirmRemove(false);
                remove(card.id);
                toast(t('cards.removed'));
                navigate('/profile/cards', { replace: true });
              },
            },
          ]}
        />
      )}
    </div>
  );
};
