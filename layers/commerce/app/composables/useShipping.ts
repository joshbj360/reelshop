export interface ShippingZone {
  id: string
  name: string
  countries: string[]
  baseRate: number
  perKgRate: number
  estimatedDays: string
}

export interface ShippingCalculation {
  cost: number
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

  const formatShippingCost = (cents: number, currency = 'NGN') => {
    if (cents === 0) return 'Free'
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
    }).format(cents / 100)
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
