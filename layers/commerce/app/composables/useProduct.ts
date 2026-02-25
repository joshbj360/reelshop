import { useProductApi } from '../services/product.api'
import { useProductStore } from '../stores/product.store'

export const useProduct = () => {
  const api = useProductApi()
  const store = useProductStore()

  const isLoading = computed(() => store.isLoading)
  const error = computed(() => store.error)

  const fetchProducts = async (params?: { status?: string; search?: string; sellerId?: string; limit?: number; offset?: number }) => {
    store.setLoading(true)
    store.setError(null)
    try {
      const result: any = await api.getProducts(params)
      store.addProducts(result.data?.products || [])
      return result.data
    } catch (e: any) {
      store.setError(e.message || 'Failed to fetch products')
      throw e
    } finally {
      store.setLoading(false)
    }
  }

  const fetchSellerProducts = async (storeSlug: string, params?: { status?: string; limit?: number; offset?: number }) => {
    store.setLoading(true)
    store.setError(null)
    try {
      const result: any = await api.getSellerProducts(storeSlug, params)
      store.addProducts(result.data?.products || [], storeSlug)
      return result.data
    } catch (e: any) {
      store.setError(e.message || 'Failed to fetch seller products')
      throw e
    } finally {
      store.setLoading(false)
    }
  }

  const getProductById = async (id: number) => {
    const cached = store.getProductById(id)
    if (cached) return cached
    store.setLoading(true)
    try {
      const result: any = await api.getProductById(id)
      store.setProduct(result.data)
      return result.data
    } catch (e: any) {
      store.setError(e.message || 'Product not found')
      throw e
    } finally {
      store.setLoading(false)
    }
  }

  const createProduct = async (data: any) => {
    store.setLoading(true)
    store.setError(null)
    try {
      const result: any = await api.createProduct(data)
      store.setProduct(result.data)
      return result.data
    } catch (e: any) {
      store.setError(e.message || 'Failed to create product')
      throw e
    } finally {
      store.setLoading(false)
    }
  }

  const updateProduct = async (id: number, data: any) => {
    store.setLoading(true)
    store.setError(null)
    try {
      const result: any = await api.updateProduct(id, data)
      store.setProduct(result.data)
      return result.data
    } catch (e: any) {
      store.setError(e.message || 'Failed to update product')
      throw e
    } finally {
      store.setLoading(false)
    }
  }

  const deleteProduct = async (id: number) => {
    try {
      await api.deleteProduct(id)
      store.removeProduct(id)
    } catch (e: any) {
      store.setError(e.message || 'Failed to delete product')
      throw e
    }
  }

  return {
    isLoading,
    error,
    fetchProducts,
    fetchSellerProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    store
  }
}
