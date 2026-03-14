import { useAffiliateApi } from '../services/affiliate.api'
import { useAffiliateStore } from '../stores/affiliate.store'

export const useAffiliate = () => {
  const api = useAffiliateApi()
  const store = useAffiliateStore()

  const isLoading = computed(() => store.isLoading)
  const error = computed(() => store.error)
  const isEnrolled = computed(() => store.isEnrolled)
  const affiliateCode = computed(() => store.affiliateCode)
  const stats = computed(() => store.stats)
  const referrals = computed(() => store.referrals)

  const fetchAffiliateStatus = async () => {
    store.setLoading(true)
    store.setError(null)
    try {
      const result: any = await api.getAffiliateStatus()
      store.setStatus(
        result.data?.isEnrolled,
        result.data?.affiliateCode,
        result.data?.stats || {},
      )
      return result.data
    } catch (e: any) {
      store.setError(e.message || 'Failed to fetch affiliate status')
      throw e
    } finally {
      store.setLoading(false)
    }
  }

  const enroll = async () => {
    store.setLoading(true)
    store.setError(null)
    try {
      const result: any = await api.enroll()
      await fetchAffiliateStatus()
      return result.data
    } catch (e: any) {
      store.setError(e.message || 'Failed to enroll in affiliate program')
      throw e
    } finally {
      store.setLoading(false)
    }
  }

  const fetchReferrals = async (limit = 20, offset = 0) => {
    store.setLoading(true)
    store.setError(null)
    try {
      const result: any = await api.getReferrals({ limit, offset })
      store.setReferrals(result.data?.referrals || [])
      return result.data
    } catch (e: any) {
      store.setError(e.message || 'Failed to fetch referrals')
      throw e
    } finally {
      store.setLoading(false)
    }
  }

  return {
    isLoading,
    error,
    isEnrolled,
    affiliateCode,
    stats,
    referrals,
    fetchAffiliateStatus,
    enroll,
    fetchReferrals,
  }
}
