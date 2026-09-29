import type { Card } from '../../data/cards';

/** Simulated lookup: the card the phone "finds", and the balance it carries */
export const FOUND_NUMBER = '0124 0431 7788 9016';
export const FOUND_BALANCE = 72;
export const VIRTUAL_NUMBER = '0124 0777 3301 5210';

/** The first card is simply "Eticket"; later ones are told apart by their last digits */
export const buildCard = (existing: Card[], number: string, balance: number, kind: Card['kind']): Card => {
  const last = number.slice(-4);
  const first = existing.length === 0;
  return {
    id: `card-${last}`,
    name: first ? { en: 'Eticket', uk: 'Eticket' } : { en: `Card •••• ${last}`, uk: `Картка •••• ${last}` },
    number,
    balance,
    kind,
  };
};
