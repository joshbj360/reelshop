const LOCALE_MAP: Record<string, string> = {
  NGN: 'en-NG',
  USD: 'en-US',
  GBP: 'en-GB',
  EUR: 'de-DE',
  GHS: 'en-GH',
  KES: 'sw-KE',
  ZAR: 'en-ZA',
}

export const SUPPORTED_CURRENCIES = ['NGN', 'USD', 'GBP', 'EUR', 'GHS', 'KES', 'ZAR'] as const
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number]

export function formatPrice(cents: number, currency: string = 'NGN'): string {
  const locale = LOCALE_MAP[currency] ?? 'en-NG'
  const cur = SUPPORTED_CURRENCIES.includes(currency as SupportedCurrency) ? currency : 'NGN'
  return new Intl.NumberFormat(locale, { style: 'currency', currency: cur }).format(cents / 100)
}