import type { TripRowProps } from '../../components/TripRow';
import { TAP_PLACES } from '../../data/cards';
import { stationById, STATIONS } from '../../data/metro';
import { STOP_NAMES } from '../../data/surface';
import { useName, useT } from '../../i18n';
import { SAVED_CARD_LAST } from '../../data/cards';
import type { Activity } from '../../store/useStore';

/** Maps a stored activity to TripRow props, with names in the current language */
export const useActivityRow = () => {
  const t = useT();
  const name = useName();
  const placeName = (id?: string) => {
    if (!id) return undefined;
    const tap = TAP_PLACES.find((p) => p.id === id);
    if (tap) return name(tap.name);
    if (STATIONS.some((s) => s.id === id)) return name(stationById(id).name);
    return STOP_NAMES[id] ? name(STOP_NAMES[id]) : undefined;
  };
  return (a: Activity): TripRowProps => ({
    kind: a.kind,
    transport: a.place?.transport,
    number: a.place?.number,
    place: placeName(a.place?.placeId),
    time: a.time,
    amount: a.amount,
    method: a.method ? (a.method === 'card' ? t('method.card', { last: SAVED_CARD_LAST }) : t(`method.${a.method}`)) : undefined,
  });
};
