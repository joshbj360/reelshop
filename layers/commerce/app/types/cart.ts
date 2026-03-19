import type { Product, ProductVariant } from '~/app/types/product'

export interface CartItem {
  id: string
  quantity: number
  variant: ProductVariant & {
    product: Product
  }
}
