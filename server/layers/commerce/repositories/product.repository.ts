import { prisma } from '../../../utils/db'

const productInclude = {
  seller: {
    select: {
      store_slug: true,
      store_logo: true,
      store_name: true,
      default_currency: true
    }
  },
  media: {
    select: { id: true, url: true, type: true, isBgMusic: true },
    orderBy: { created_at: 'asc' as const }
  },
  variants: true,
  _count: {
    select: { likes: true, comments: true, shares: true }
  }
}

export const productRepository = {
  async createProduct(sellerId: string, storeSlug: string, data: any, authorId?: string) {
    const productData: any = {
      title: data.title,
      slug: data.slug,
      description: data.description,
      price: data.price,
      status: data.status || 'DRAFT',
      sellerId,
      store_slug: storeSlug,
      isFeatured: data.isFeatured ?? false,
      isAccessory: data.isAccessory ?? false,
      isThrift: data.isThrift ?? false
    }

    if (data.discount !== undefined) productData.discount = data.discount
    if (data.SKU) productData.SKU = data.SKU
    if (data.bannerImageUrl) productData.bannerImageUrl = data.bannerImageUrl
    if (data.affiliateCommission !== undefined) productData.affiliateCommission = data.affiliateCommission

    if (data.mediaId) {
      productData.media = { connect: [{ id: data.mediaId }] }
    }

    if (data.variants && data.variants.length > 0) {
      productData.variants = {
        create: data.variants.map((v: any) => ({
          size: v.size,
          stock: v.stock,
          price: v.price
        }))
      }
    }

    // Inline media creation (images + background music)
    const mediaToCreate: any[] = []
    if (authorId && data.mediaItems?.length) {
      for (const m of data.mediaItems) {
        mediaToCreate.push({ url: m.url, public_id: m.public_id, type: m.type || 'IMAGE', isBgMusic: false, authorId })
      }
    }
    if (authorId && data.bgMusic?.url) {
      mediaToCreate.push({ url: data.bgMusic.url, public_id: data.bgMusic.public_id || '', type: 'AUDIO', isBgMusic: true, authorId })
    }
    if (mediaToCreate.length) {
      productData.media = { create: mediaToCreate }
    }

    // Set first image as bannerImageUrl if none provided
    if (!productData.bannerImageUrl && data.mediaItems?.[0]?.url) {
      productData.bannerImageUrl = data.mediaItems[0].url
    }

    return prisma.products.create({ data: productData, include: productInclude })
  },

  async getProducts(
    filters: { status?: string; sellerId?: string; search?: string; storeSlug?: string; isThrift?: boolean },
    pagination: { limit: number; offset: number }
  ) {
    const where: any = {}
    if (filters.status) where.status = filters.status
    if (filters.sellerId) where.sellerId = filters.sellerId
    if (filters.storeSlug) where.store_slug = filters.storeSlug
    if (filters.isThrift !== undefined) where.isThrift = filters.isThrift
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ]
    }
    return prisma.products.findMany({
      where,
      include: productInclude,
      take: pagination.limit,
      skip: pagination.offset,
      orderBy: { created_at: 'desc' }
    })
  },

  async getProductById(id: number) {
    return prisma.products.findUnique({ where: { id }, include: productInclude })
  },

  async getProductBySlug(slug: string) {
    return prisma.products.findUnique({ where: { slug }, select: { id: true, slug: true } })
  },

  async getProductsBySellerSlug(
    storeSlug: string,
    pagination: { limit: number; offset: number },
    status?: string
  ) {
    const where: any = { store_slug: storeSlug }
    if (status) where.status = status
    return prisma.products.findMany({
      where,
      include: productInclude,
      take: pagination.limit,
      skip: pagination.offset,
      orderBy: { created_at: 'desc' }
    })
  },

  async updateProduct(id: number, data: any) {
    const updateData: any = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.price !== undefined) updateData.price = data.price
    if (data.discount !== undefined) updateData.discount = data.discount
    if (data.status !== undefined) updateData.status = data.status
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured
    if (data.isAccessory !== undefined) updateData.isAccessory = data.isAccessory
    if (data.isThrift !== undefined) updateData.isThrift = data.isThrift
    if (data.SKU !== undefined) updateData.SKU = data.SKU
    if (data.bannerImageUrl !== undefined) updateData.bannerImageUrl = data.bannerImageUrl
    if (data.affiliateCommission !== undefined) updateData.affiliateCommission = data.affiliateCommission
    if (data.mediaId) {
      updateData.media = { connect: [{ id: data.mediaId }] }
    }
    return prisma.products.update({ where: { id }, data: updateData, include: productInclude })
  },

  async archiveProduct(id: number) {
    return prisma.products.update({ where: { id }, data: { status: 'ARCHIVED' }, include: productInclude })
  },

  async countProducts(filters: { status?: string; sellerId?: string; search?: string; storeSlug?: string; isThrift?: boolean }) {
    const where: any = {}
    if (filters.status) where.status = filters.status
    if (filters.sellerId) where.sellerId = filters.sellerId
    if (filters.storeSlug) where.store_slug = filters.storeSlug
    if (filters.isThrift !== undefined) where.isThrift = filters.isThrift
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ]
    }
    return prisma.products.count({ where })
  },

  async checkOwnership(id: number, sellerId: string): Promise<boolean> {
    const product = await prisma.products.findFirst({ where: { id, sellerId }, select: { id: true } })
    return !!product
  }
}
