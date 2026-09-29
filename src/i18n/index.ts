import { create } from 'zustand';
import { en, type StringKey } from './en';
import { uk } from './uk';
import type { Name } from '../data/types';

export type Lang = 'en' | 'uk';
export const LANGS: Lang[] = ['en', 'uk'];
export const LOCALE: Record<Lang, string> = { en: 'en-GB', uk: 'uk-UA' };

const DICTS: Record<Lang, Record<string, string>> = { en, uk };

type Vars = Record<string, string | number>;

/** Fills {name} placeholders */
const fill = (s: string, vars?: Vars) => (vars ? s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`)) : s);

export const translate = (lang: Lang, key: StringKey, vars?: Vars) => fill(DICTS[lang][key] ?? en[key], vars);

/** Language lives in its own tiny store so presentational components can read it without the app store */
export const useLang = create<{ lang: Lang; setLang: (l: Lang) => void }>((set) => ({
  lang: 'en',
  setLang: (lang) => {
    document.documentElement.lang = lang;
    set({ lang });
  },
}));

/** Keys that have plural forms: 'card.trips' for 'card.trips.one' / '.other' (and '.few' / '.many' in Ukrainian) */
export type PluralBase = { [K in StringKey]: K extends `${infer B}.other` ? B : never }[StringKey];

/** Picks the plural form for n and fills {n} */
export const translatePlural = (lang: Lang, base: PluralBase, n: number, vars?: Vars) => {
  const rule = new Intl.PluralRules(LOCALE[lang]).select(n);
  const dict = DICTS[lang];
  return fill(dict[`${base}.${rule}`] ?? dict[`${base}.other`] ?? en[`${base}.other` as StringKey], { n, ...vars });
};

/** t(key, vars) for strings, t.n(base, count) for plurals, t.lang for formatting */
export const useT = () => {
  const lang = useLang((s) => s.lang);
  return Object.assign((key: StringKey, vars?: Vars) => translate(lang, key, vars), {
    n: (base: PluralBase, n: number, vars?: Vars) => translatePlural(lang, base, n, vars),
    lang,
  });
};

/** Picks the current language from a bilingual proper name */
export const useName = () => {
  const lang = useLang((s) => s.lang);
  return (n: Name) => n[lang];
};

export const initialLang = (search: string): Lang => {
  const q = new URLSearchParams(search).get('lang');
  return q === 'uk' ? 'uk' : 'en';
};

export type { StringKey };
