/**
 * useCurrency — single source of truth for all price display
 *
 * Usage in any component:
 *   const { formatPrice, formatKobo, displayCurrency } = useCurrency()
 *   // In template: {{ formatPrice(product.price) }}
 *
 * - Reads the user's preferred currency from useSettings()
 * - Fetches live exchange rates once per session (cached 1hr server-side)
 * - Re-converts all prices instantly when the user changes currency in Settings
 * - Falls back to built-in static rates if the API is unreachable
 */

import {
  formatProductPrice,
  formatInCurrency,
  type SupportedCurrency,
} from '~/utils/currency'

// ── Module-level singletons ───────────────────────────────────────────────────
// Shared across ALL components — rates are fetched once, not per component
const rates = ref<Record<string, number>>({})
const isFetchingRates = ref(false)
let ratesFetchedAt = 0
const REFETCH_INTERVAL = 60 * 60 * 1000 // 1 hour

const fetchRates = async () => {
  if (isFetchingRates.value) return
  if (
    rates.value &&
    Object.keys(rates.value).length > 0 &&
    Date.now() - ratesFetchedAt < REFETCH_INTERVAL
  )
    return

  isFetchingRates.value = true
  try {
    const res = await $fetch<{
      success: boolean
      data: Record<string, number>
    }>('/api/exchange-rates')
    if (res?.data) {
      rates.value = res.data
      ratesFetchedAt = Date.now()
    }
  } catch {
    // Server fallback rates will be used via DEFAULT_RATES_TO_NGN in currency.ts
  } finally {
    isFetchingRates.value = false
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export const useCurrency = () => {
  const { settings } = useSettings()

  // The currency the user wants to see prices in
  const displayCurrency = computed(
    () => settings.value.currency as SupportedCurrency,
  )

  // Fetch rates on first use, and whenever currency changes
  if (import.meta.client) {
    fetchRates()
    watch(displayCurrency, () => fetchRates())
  }

  /**
   * Format a product price stored in major NGN units (e.g. product.price = 5000 → ₦5,000 or $3.13)
   * This is the main function to use for product cards, modals, cart items
   */
  const formatPrice = (
    amountNGN: number | undefined | null,
    baseCurrency: string = 'NGN',
  ): string => {
    if (amountNGN == null || isNaN(amountNGN)) return '—'

    const to = displayCurrency.value

    // If product is already priced in the display currency, just format it
    if (baseCurrency === to) {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: to,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(amountNGN)
    }

    // Build a rates map relative to NGN for formatProductPrice
    // open.er-api returns NGN-based rates (1 NGN = X), but formatProductPrice
    // expects rates as (1 USD = X NGN), so we invert
    const ratesForFormatter: Partial<Record<SupportedCurrency, number>> = {}
    for (const [cur, rate] of Object.entries(rates.value)) {
      if (rate > 0) ratesForFormatter[cur as SupportedCurrency] = 1 / rate
    }

    return formatProductPrice(amountNGN, to, ratesForFormatter)
  }

  /**
   * Format a shipping/order amount stored in NGN kobo (smallest unit)
   * e.g. 50000 kobo = ₦500
   */
  const formatKobo = (koboNGN: number | undefined | null): string => {
    if (koboNGN == null || isNaN(koboNGN)) return '—'

    const to = displayCurrency.value
    const ratesForFormatter: Partial<Record<SupportedCurrency, number>> = {}
    for (const [cur, rate] of Object.entries(rates.value)) {
      if (rate > 0) ratesForFormatter[cur as SupportedCurrency] = 1 / rate
    }

    return formatInCurrency(koboNGN, to, ratesForFormatter)
  }

  /**
   * Just the currency symbol for the current display currency
   */
  const currencySymbol = computed(() => {
    const symbols: Record<string, string> = {
      NGN: '₦',
      USD: '$',
      GBP: '£',
      EUR: '€',
      GHS: '₵',
      KES: 'KSh',
      ZAR: 'R',
      CAD: 'C$',
    }
    return symbols[displayCurrency.value] ?? displayCurrency.value
  })

  return {
    displayCurrency,
    currencySymbol,
    formatPrice,
    formatKobo,
    isFetchingRates: readonly(isFetchingRates),
  }
}
