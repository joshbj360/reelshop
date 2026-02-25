import { z } from 'zod'

export const productVariantSchema = z.object({
  size: z.string().min(1),
  stock: z.number().int().min(0),
  price: z.number().positive().optional()
})

export const createProductSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().min(10).max(2000),
  price: z.number().positive(),
  discount: z.number().min(0).max(100).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  isFeatured: z.boolean().default(false),
  isAccessory: z.boolean().default(false),
  isThrift: z.boolean().default(false),
  SKU: z.string().optional(),
  bannerImageUrl: z.string().url().optional(),
  mediaId: z.string().uuid().optional(),
  variants: z.array(productVariantSchema).optional()
})

export const updateProductSchema = z.object({
  title: z.string().min(2).max(100).optional(),
  description: z.string().min(10).max(2000).optional(),
  price: z.number().positive().optional(),
  discount: z.number().min(0).max(100).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  isFeatured: z.boolean().optional(),
  isAccessory: z.boolean().optional(),
  isThrift: z.boolean().optional(),
  SKU: z.string().optional(),
  bannerImageUrl: z.string().url().optional(),
  mediaId: z.string().uuid().optional(),
  variants: z.array(productVariantSchema).optional()
})

export const listProductsSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  search: z.string().optional(),
  sellerId: z.string().uuid().optional()
})

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type ListProductsInput = z.infer<typeof listProductsSchema>
export type ProductVariantInput = z.infer<typeof productVariantSchema>
