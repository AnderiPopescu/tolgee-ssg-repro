# Tolgee + next-intl static rendering repro

Minimal reproduction for [tolgee/tolgee-js#3526](https://github.com/tolgee/tolgee-js/issues/3526).

Versions: `@tolgee/react` / `@tolgee/web` 7.3.0, `next` 16.2.12, `next-intl` 4.13.7, React 19.

The Tolgee files (`src/tolgee/*`, `src/middleware.ts`, `next.config.js`) are copied from the
[App Router with next-intl guide](https://tolgee.io/js-sdk/integrations/react/next/app_router_next_intl).
`src/app/[locale]/probe/page.tsx` renders no translations and sets `dynamic = 'error'`, so the build
fails if anything in its tree is dynamic.

## Run

The [Variants workflow](../../actions/workflows/variants.yml) builds each variant in CI and checks the
result matches the table below. To run it locally:

```sh
npm install
VARIANT=docs npx next build                # fails: used `headers()`
VARIANT=no-provider npx next build         # fails: used `headers()`
VARIANT=provider-only npx next build       # static
VARIANT=set-request-locale npx next build  # static, correct translations per locale
```

| `VARIANT` | Layout | Result |
|---|---|---|
| `docs` | Guide's layout as written | ❌ `used headers()` |
| `no-provider` | `<TolgeeNextProvider>` removed, `getTolgee()` kept | ❌ `used headers()` |
| `provider-only` | Provider kept, static data loaded without `getTolgee()` | ✅ `/[locale]/probe` is SSG; ❌ `/[locale]` still fails because its page calls `getTranslate()`, which also calls `getLocale()` |
| `set-request-locale` | Guide's layout + `setRequestLocale(locale)` in layout and pages | ✅ SSG, `/en` → "Hello world!", `/cs` → "Ahoj světe!" |

## Cause

`getTolgee()` calls the `getLocale` passed to `createServerInstance`, which in the guide is
next-intl's `getLocale()`. Without `setRequestLocale(locale)`, next-intl resolves the locale by
reading request headers, which opts the route into dynamic rendering. `TolgeeProvider` itself does
not force dynamic rendering.

Calling `setRequestLocale(locale)` in the layout **and** in every page that uses `getTranslate()`
(layouts and pages render independently) makes the routes statically renderable. This is
[next-intl's documented requirement for static rendering](https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing#static-rendering).

## Also found

The guide's `src/i18n/request.ts` returns `{ messages: { locale } }`, which fails type-checking
with next-intl 4 because `RequestConfig` requires `locale`. This repo returns `{ locale, messages: {} }`.
