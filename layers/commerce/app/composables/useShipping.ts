import { formatInCurrency, type SupportedCurrency } from '~~/app/utils/currency'

export interface ShippingZone {
  id: string
  name: string
  countries: string[]
  baseRate: number
  perKgRate: number
  estimatedDays: string
}

export interface ShippingCalculation {
  cost: number       // NGN kobo
  zoneId: string
  zoneName: string
  estimatedDays: string
}

export const useShipping = () => {
  const zones = ref<ShippingZone[]>([])
  const isLoading = ref(false)
  const calculation = ref<ShippingCalculation | null>(null)

  const fetchZones = async () => {
    if (zones.value.length) return
    isLoading.value = true
    try {
      const res = await $fetch<{ success: boolean; data: ShippingZone[] }>(
        '/api/commerce/shipping/zones',
      )
      zones.value = res.data || []
    } catch {
      /* non-fatal */
    } finally {
      isLoading.value = false
    }
  }

  const calculateShipping = async (countryCode: string, weightKg = 0.5) => {
    if (!countryCode) {
      calculation.value = null
      return
    }
    isLoading.value = true
    try {
      const res = await $fetch<{ success: boolean; data: ShippingCalculation }>(
        '/api/commerce/shipping/calculate',
        { method: 'POST', body: { countryCode, weightKg } },
      )
      calculation.value = res.data
      return res.data
    } catch {
      calculation.value = null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Format a shipping cost (NGN kobo) in the customer's display currency.
   * Falls back to NGN if currency not provided.
   */
  const formatShippingCost = (
    kobo: number,
    currency: SupportedCurrency = 'NGN',
    rates?: Record<SupportedCurrency, number>,
  ): string => {
    if (kobo === 0) return 'Free'
    return formatInCurrency(kobo, currency, rates)
  }

  return {
    zones,
    calculation,
    isLoading,
    fetchZones,
    calculateShipping,
    formatShippingCost,
  }
}
