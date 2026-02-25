import { BaseApiClient } from '../../../base/app/services/base.api'

export class OrderApiClient extends BaseApiClient {
  async getOrders(params?: { limit?: number; offset?: number }) {
    const query = params ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])).toString() : ''
    return this.request(`/api/commerce/orders${query}`, { method: 'GET' })
  }
  async getOrderById(id: number) {
    return this.request(`/api/commerce/orders/${id}`, { method: 'GET' })
  }
  async placeOrder(data: any) {
    return this.request('/api/commerce/orders', { method: 'POST', body: data })
  }
  async cancelOrder(id: number) {
    return this.request(`/api/commerce/orders/${id}/cancel`, { method: 'POST' })
  }
}

let instance: OrderApiClient | null = null
export const useOrderApi = () => {
  if (!instance) instance = new OrderApiClient()
  return instance
}
