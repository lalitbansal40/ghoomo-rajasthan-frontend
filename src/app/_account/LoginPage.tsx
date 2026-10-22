import { SignInForm } from '@/components/account/SignInForm';
import { Footer, Header } from '@/components/ui';
import { dict, localePath, type Locale } from '@/i18n';
import { safeNext } from '@/lib/account';

/** /login — sign in to (or create) a Ghoomo Rajasthan account with a code. Private. */
export function LoginPage({ locale, next }: { locale: Locale; next: unknown }) {
  const t = dict(locale).account;
  return (
    <div className="flex min-h-dvh flex-col">
      <Header locale={locale} path="/login" />
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-10">
        <h1 className="text-h1 text-link">{t.title}</h1>
        <p className="mb-6 mt-3 text-content/80">{t.intro}</p>
        <SignInForm locale={locale} next={safeNext(next, localePath('/my-bookings', locale))} />
      </main>
      <Footer locale={locale} />
    </div>
  );
}
