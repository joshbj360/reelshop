import { BaseApiClient } from '../../../base/app/services/base.api'

export class ProductApiClient extends BaseApiClient {
  async getProducts(params?: { status?: string; search?: string; sellerId?: string; limit?: number; offset?: number }) {
    const query = params ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])).toString() : ''
    return this.request(`/api/commerce/products${query}`, { method: 'GET' })
  }

  async getProductById(id: number) {
    return this.request(`/api/commerce/products/${id}`, { method: 'GET' })
  }

  async createProduct(data: any) {
    return this.request('/api/commerce/products', { method: 'POST', body: data })
  }

  async updateProduct(id: number, data: any) {
    return this.request(`/api/commerce/products/${id}`, { method: 'PATCH', body: data })
  }

  async deleteProduct(id: number) {
    return this.request(`/api/commerce/products/${id}`, { method: 'DELETE' })
  }

  async getSellerProducts(storeSlug: string, params?: { status?: string; limit?: number; offset?: number }) {
    const query = params ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])).toString() : ''
    return this.request(`/api/seller/${storeSlug}/products${query}`, { method: 'GET' })
  }
}

let instance: ProductApiClient | null = null
export const useProductApi = () => {
  if (!instance) instance = new ProductApiClient()
  return instance
}
