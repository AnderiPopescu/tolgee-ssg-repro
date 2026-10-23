import React, { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { TolgeeNextProvider } from '@/tolgee/client';
import { ALL_LANGUAGES, TolgeeBase } from '@/tolgee/shared';
import { getTolgee } from '@/tolgee/server';

// VARIANT (set at build time):
//   docs               - layout exactly as in the Tolgee next-intl guide
//   no-provider        - same, but children are rendered without <TolgeeNextProvider>
//   provider-only      - provider kept; static data loaded without getTolgee()/getLocale()
//   set-request-locale - docs layout + next-intl's setRequestLocale(locale)
const VARIANT = process.env.VARIANT ?? 'docs';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return ALL_LANGUAGES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!ALL_LANGUAGES.includes(locale)) {
    notFound();
  }

  if (VARIANT === 'set-request-locale') {
    setRequestLocale(locale);
  }

  const records =
    VARIANT === 'provider-only'
      ? await TolgeeBase().init({ language: locale }).loadRequired()
      : await (await getTolgee()).loadRequired();

  return (
    <html lang={locale}>
      <body>
        {VARIANT === 'no-provider' ? (
          children
        ) : (
          <TolgeeNextProvider language={locale} staticData={records}>
            {children}
          </TolgeeNextProvider>
        )}
      </body>
    </html>
  );
}
