import { BaseApiClient } from './base.api'

export class SearchApiClient extends BaseApiClient {
  // FIXED: Added 'stores' to the acceptable types
  async search(query: string, type: 'all' | 'users' | 'products' | 'posts' | 'stores' = 'all', limit = 10, offset = 0): Promise<{success: boolean, data: { users: any[], products: any[], posts: any[], stores: any[] }}> {
    const params = new URLSearchParams({ q: query, type, limit: String(limit), offset: String(offset) })
    return this.request(`/api/search?${params.toString()}`, { method: 'GET' })
  }
}

let instance: SearchApiClient | null = null
export const useSearchApi = () => {
  if (!instance) instance = new SearchApiClient()
  return instance
}