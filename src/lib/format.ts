import { LOCALE, type Lang } from '../i18n';

/** UAH with ₴. Whole hryvnias without decimals: ₴8, ₴100 (en) · 8 ₴ (uk) */
export const money = (lang: Lang, uah: number, signed = false) => {
  const s = new Intl.NumberFormat(LOCALE[lang], {
    style: 'currency',
    currency: 'UAH',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: Number.isInteger(uah) ? 0 : 2,
    signDisplay: signed ? 'exceptZero' : 'auto',
  }).format(uah);
  // Typographic minus for charges
  return s.replace('-', '−');
};

/** Minutes since midnight → "08:14" (24-hour in both languages) */
export const clock = (min: number) => {
  const m = ((min % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

/** 30.06.2027, with dots in both languages */
export const numericDate = (lang: Lang, d: Date) =>
  new Intl.DateTimeFormat(LOCALE[lang], { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d).split('/').join('.');

export const date = (lang: Lang, d: Date, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  new Intl.DateTimeFormat(LOCALE[lang], opts).format(d);
