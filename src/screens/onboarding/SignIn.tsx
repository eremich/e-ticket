import { useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppleLogo, GoogleLogo } from '@phosphor-icons/react';
import { NavBar } from '../../components/NavBar';
import { Button } from '../../components/Button';
import { useT } from '../../i18n';
import { cx } from '../../lib/cx';

const PHONE_DIGITS = 9;
const CODE_DIGITS = 6;
const COUNTRY = '+380';

const onlyDigits = (v: string, max: number) => v.replace(/\D/g, '').slice(0, max);
/** 67 123 45 67 */
const groupPhone = (d: string) => [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(' ');

const fieldCls = 'flex h-13 items-center rounded-control bg-surface px-4 ring-1 ring-inset focus-within:ring-2';

/** Phone sign-in with a code; Apple and Google skip straight on */
export const SignIn = () => {
  const t = useT();
  const navigate = useNavigate();
  const phoneId = useId();
  const codeId = useId();
  const [phone, setPhone] = useState('');
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState('');
  const phoneOk = phone.length === PHONE_DIGITS;
  const phoneInvalid = touched && !phoneOk;
  const next = () => navigate('/onboarding/card');

  const submit = () => {
    if (!sent) {
      setTouched(true);
      if (phoneOk) setSent(true);
      return;
    }
    if (code.length === CODE_DIGITS) next();
  };

  return (
    <div className="screen-enter flex flex-1 flex-col">
      <NavBar large title={t('signIn.title')} onBack={() => navigate(-1)} backLabel={t('common.back')} />
      <div className="flex flex-col gap-6 px-4 pb-6 pt-2">
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div className="flex flex-col gap-1">
            <label htmlFor={phoneId} className="px-1 text-footnote uppercase text-muted">
              {t('signIn.phone')}
            </label>
            <div className={cx(fieldCls, phoneInvalid ? 'ring-error' : 'ring-line focus-within:ring-action')}>
              <span aria-hidden className="tnum pr-2 text-headline text-muted">
                {COUNTRY}
              </span>
              <input
                id={phoneId}
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="67 123 45 67"
                value={groupPhone(phone)}
                readOnly={sent}
                onChange={(e) => setPhone(onlyDigits(e.target.value, PHONE_DIGITS))}
                onBlur={() => phone && setTouched(true)}
                aria-label={`${t('signIn.phone')} ${COUNTRY}`}
                aria-invalid={phoneInvalid || undefined}
                aria-describedby={phoneInvalid ? `${phoneId}-err` : undefined}
                className="tnum h-full min-w-0 flex-1 bg-transparent text-headline text-ink outline-none placeholder:text-muted/60"
              />
            </div>
            {phoneInvalid && (
              <p id={`${phoneId}-err`} role="alert" className="px-1 text-footnote text-error">
                {t('signIn.phoneInvalid')}
              </p>
            )}
          </div>
          {sent && (
            <div className="rise flex flex-col gap-1">
              <label htmlFor={codeId} className="px-1 text-footnote uppercase text-muted">
                {t('signIn.code')}
              </label>
              <input
                id={codeId}
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(onlyDigits(e.target.value, CODE_DIGITS))}
                aria-describedby={`${codeId}-hint`}
                className="tnum h-13 rounded-control bg-surface px-4 text-headline tracking-widest text-ink outline-none ring-1 ring-inset ring-line placeholder:text-muted/60 focus:ring-2 focus:ring-action"
              />
              <p id={`${codeId}-hint`} className="tnum px-1 text-footnote text-muted">
                {t('signIn.codeSent', { phone: `${COUNTRY} ${groupPhone(phone)}` })}
              </p>
            </div>
          )}
          <Button type="submit" block disabled={sent && code.length < CODE_DIGITS}>
            {sent ? t('signIn.continue') : t('signIn.sendCode')}
          </Button>
        </form>

        <div className="flex items-center gap-3 text-footnote text-muted">
          <span aria-hidden className="h-px flex-1 bg-line" />
          {t('signIn.or')}
          <span aria-hidden className="h-px flex-1 bg-line" />
        </div>

        <div className="flex flex-col gap-3">
          <button type="button" onClick={next} className="press flex min-h-13 w-full items-center justify-center gap-2 rounded-control bg-ink text-headline text-canvas">
            <AppleLogo aria-hidden weight="fill" className="size-5" />
            {t('signIn.apple')}
          </button>
          <Button variant="gray" block icon={<GoogleLogo aria-hidden weight="bold" className="size-5" />} onClick={next}>
            {t('signIn.google')}
          </Button>
        </div>
      </div>
    </div>
  );
};
