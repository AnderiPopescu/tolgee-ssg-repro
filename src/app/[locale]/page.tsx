import { setRequestLocale } from 'next-intl/server';
import { getTranslate } from '@/tolgee/server';

export const dynamic = 'error';

type Props = { params: Promise<{ locale: string }> };

export default async function Home({ params }: Props) {
  if (process.env.VARIANT === 'set-request-locale' && !process.env.LAYOUT_ONLY) {
    // next-intl: layouts and pages render independently, so each calls it.
    setRequestLocale((await params).locale);
  }
  const t = await getTranslate();
  return <h1>{t('hello_world')}</h1>;
}
