import { useNavigate } from 'react-router-dom';
import { Check } from '@phosphor-icons/react';
import { NavBar } from '../../components/NavBar';
import { ListGroup, ListRow } from '../../components/ListRow';
import { LANGS, useLang, useT, type Lang } from '../../i18n';
import type { ThemeChoice } from '../../lib/theme';
import { useStore } from '../../store/useStore';

export const LANG_NAME: Record<Lang, string> = { en: 'English', uk: 'Українська' };
const THEMES: ThemeChoice[] = ['system', 'light', 'dark'];

/** iOS selection list: one checkmark, the choice applies at once */
const Choice = <K extends string>({ title, options, value, onChange }: { title: string; options: { key: K; label: string }[]; value: K; onChange: (k: K) => void }) => {
  const t = useT();
  const navigate = useNavigate();
  return (
    <div className="screen-enter flex flex-1 flex-col gap-4 pb-8">
      <NavBar title={title} onBack={() => navigate(-1)} backLabel={t('common.back')} />
      <ListGroup>
        {options.map((o) => (
          <ListRow
            key={o.key}
            title={o.label}
            chevron={false}
            trailing={o.key === value ? <Check aria-label="Selected" weight="bold" className="size-5 text-action" /> : undefined}
            onClick={() => onChange(o.key)}
          />
        ))}
      </ListGroup>
    </div>
  );
};

export const LanguageChoice = () => {
  const t = useT();
  const { lang, setLang } = useLang();
  return <Choice title={t('profile.language')} value={lang} onChange={setLang} options={LANGS.map((l) => ({ key: l, label: LANG_NAME[l] }))} />;
};

export const AppearanceChoice = () => {
  const t = useT();
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  return <Choice<ThemeChoice> title={t('profile.appearance')} value={theme} onChange={setTheme} options={THEMES.map((k) => ({ key: k, label: t(`theme.${k}`) }))} />;
};
