import { BaseApiClient } from './base.api'

export class SearchApiClient extends BaseApiClient {
  async search(query: string, type: 'all' | 'users' | 'products' | 'posts' = 'all', limit = 10, offset = 0) {
    const params = new URLSearchParams({ q: query, type, limit: String(limit), offset: String(offset) })
    return this.request(`/api/search?${params.toString()}`, { method: 'GET' })
  }
}

let instance: SearchApiClient | null = null
export const useSearchApi = () => {
  if (!instance) instance = new SearchApiClient()
  return instance
}
