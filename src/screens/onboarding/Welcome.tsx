import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Segmented } from '../../components/Segmented';
import { WelcomeArt } from '../../components/WelcomeArt';
import { EticketLogo } from '../../components/EticketCard';
import { LANGS, useLang, useT, type Lang } from '../../i18n';

const LANG_NAME: Record<Lang, string> = { en: 'English', uk: 'Українська' };

/** First screen: the logotype over the Kharkiv metro, one promise, language, then sign in or buy a ticket without an account */
export const Welcome = () => {
  const t = useT();
  const navigate = useNavigate();
  const { lang, setLang } = useLang();
  return (
    <div className="screen-enter flex flex-1 flex-col gap-4 px-4 pb-4">
      <section className="relative isolate flex flex-1 flex-col justify-end gap-3 overflow-hidden rounded-eticket bg-card-face p-6 text-white">
        <WelcomeArt className="-mx-6 -mt-6 flex-1" />
        <EticketLogo className="self-start text-[56px]" />
        <h1 className="text-large-title">{t('welcome.title')}</h1>
        <p className="text-body text-white/85">{t('welcome.body')}</p>
      </section>
      <Segmented label={t('welcome.language')} value={lang} onChange={setLang} options={LANGS.map((l) => ({ key: l, label: LANG_NAME[l] }))} />
      <div className="flex flex-col gap-1">
        <Button block onClick={() => navigate('/onboarding/sign-in')}>
          {t('welcome.signIn')}
        </Button>
        <Button variant="plain" block onClick={() => navigate('/visitor')}>
          {t('welcome.visit')}
        </Button>
      </div>
    </div>
  );
};
