import createMiddleware from 'next-intl/middleware';
import { ALL_LANGUAGES, DEFAULT_LANGUAGE } from '@/tolgee/shared';

export default createMiddleware({
  locales: ALL_LANGUAGES,
  defaultLocale: DEFAULT_LANGUAGE,
  localePrefix: 'as-needed',
});

export const config = {
  matcher: ['/((?!api|_next|.*\..*).*)'],
};
