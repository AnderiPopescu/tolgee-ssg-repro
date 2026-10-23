import { getRequestConfig } from 'next-intl/server';
import { DEFAULT_LANGUAGE } from '@/tolgee/shared';

// The Tolgee guide returns `{ messages: { locale } }`, which does not type-check
// with next-intl 4 (RequestConfig requires `locale`). Minimal fix:
export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? DEFAULT_LANGUAGE;
  return { locale, messages: {} };
});
