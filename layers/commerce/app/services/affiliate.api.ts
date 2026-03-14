import { BaseApiClient } from '../../../base/app/services/base.api'

export class AffiliateApiClient extends BaseApiClient {
  async getAffiliateStatus() {
    return this.request('/api/commerce/affiliate', { method: 'GET' })
  }
  async enroll() {
    return this.request('/api/commerce/affiliate/enroll', { method: 'POST' })
  }
  async getReferrals(params?: { limit?: number; offset?: number }) {
    const query = params
      ? '?' +
        new URLSearchParams(
          Object.entries(params)
            .filter(([, v]) => v != null)
            .map(([k, v]) => [k, String(v)]),
        ).toString()
      : ''
    return this.request(`/api/commerce/affiliate/referrals${query}`, {
      method: 'GET',
    })
  }
}

let instance: AffiliateApiClient | null = null
export const useAffiliateApi = () => {
  if (!instance) instance = new AffiliateApiClient()
  return instance
}
