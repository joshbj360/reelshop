import {
  type SupportedCurrency,
  DEFAULT_RATES_TO_NGN,
  getCurrencyForCountry,
  formatInCurrency,
  formatProductPrice,
} from '~~/app/utils/currency'

export { getCurrencyForCountry }
export type { SupportedCurrency }

/**
 * Reactive currency composable.
 *
 * Two price conventions exist in this codebase:
 *   - Product prices / cart totals: stored as **major NGN units** (e.g. 5000 = ₦5,000)
 *   - Shipping costs / order totalAmount: stored as **NGN kobo** (e.g. 150000 = ₦1,500)
 *
 * Use `formatProduct(majorNGN, currency)` for product prices and cart totals.
 * Use `format(kobo, currency)` for shipping costs and Paystack amounts.
 */
export const useCurrency = () => {
  const rates = useState<Record<SupportedCurrency, number>>(
    'exchange_rates',
    () => ({ ...DEFAULT_RATES_TO_NGN }),
  )

  /** Format a product price (major NGN units) in the given display currency. */
  const formatProduct = (
    majorNGN: number,
    currency: SupportedCurrency,
  ): string => formatProductPrice(majorNGN, currency, rates.value)

  /** Format a kobo amount (shipping, order total) in the given display currency. */
  const format = (kobo: number, currency: SupportedCurrency): string =>
    formatInCurrency(kobo, currency, rates.value)

  /** Format a kobo amount as NGN (always). */
  const formatNGN = (kobo: number): string => formatInCurrency(kobo, 'NGN')

  /** Format a product price as NGN (always). */
  const formatProductNGN = (majorNGN: number): string =>
    formatProductPrice(majorNGN, 'NGN')

  return {
    rates,
    getCurrencyForCountry,
    formatProduct,
    format,
    formatNGN,
    formatProductNGN,
  }
}
