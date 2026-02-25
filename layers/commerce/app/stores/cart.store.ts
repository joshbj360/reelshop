export const useCartStore = defineStore('cart', () => {
  const items = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const cartCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const cartTotal = computed(() =>
    items.value.reduce((sum, item) => {
      const price = item.variant?.price ?? item.variant?.product?.price ?? 0
      return sum + price * item.quantity
    }, 0)
  )

  const setItems = (newItems: any[]) => { items.value = newItems }

  const updateItem = (variantId: number, quantity: number) => {
    const item = items.value.find(i => i.variantId === variantId)
    if (item) item.quantity = quantity
  }

  const removeItem = (variantId: number) => {
    items.value = items.value.filter(i => i.variantId !== variantId)
  }

  const addItem = (item: any) => {
    const existing = items.value.find(i => i.variantId === item.variantId)
    if (existing) {
      existing.quantity += item.quantity
    } else {
      items.value.push(item)
    }
  }

  return {
    items,
    isLoading,
    error,
    cartCount,
    cartTotal,
    setItems,
    updateItem,
    removeItem,
    addItem,
    setLoading: (val: boolean) => { isLoading.value = val },
    setError: (val: string | null) => { error.value = val }
  }
}, { persist: true })
