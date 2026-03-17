/**
 * Brand config — SINGLE SOURCE OF TRUTH.
 * To rename the app, change the values here and update NUXT_PUBLIC_SITE_NAME in .env.
 *
 * Usage in composables/script setup:
 *   const brand = useBrand()
 *   brand.name        // "Indix"
 *
 * Usage in templates:
 *   {{ $brand.name }}  — if you inject it
 *   OR just use:  {{ $config.public.siteName }}
 *
 * Usage in server-side code:
 *   import { BRAND } from '~/utils/brand'
 *   BRAND.name   // "Indix"
 */

/** Static brand constants — use in server-side code or where composables can't run */
export const BRAND = {
  name: 'styleX',
  domain: 'styleX.app',
  storagePrefix: 'styleX',
  twitterHandle: '@stylexapp',
  supportEmail: 'support@stylex.app',
  privacyEmail: 'privacy@stylex.app',
  legalEmail: 'legal@stylex.app',
  tagline:
    'Discover fashion, thrift, and lifestyle products from African creators.',

  shortTagline: 'Your fashion AI stylist & shopping assistant.',
} as const

/** Reactive brand config composable — reads site name from runtime config so .env overrides work */
export const useBrand = () => {
  if (import.meta.server || typeof useRuntimeConfig === 'undefined')
    return BRAND
  const config = useRuntimeConfig()
  return {
    ...BRAND,
    name: (config.public.siteName as string) || BRAND.name,
    domain: (config.public.brandDomain as string) || BRAND.domain,
    supportEmail: (config.public.supportEmail as string) || BRAND.supportEmail,
    privacyEmail: (config.public.supportEmail as string) || BRAND.privacyEmail,
    legalEmail: (config.public.supportEmail as string) || BRAND.legalEmail,
  }
}
