// POST /api/commerce/products/[id]/comments
import { prisma } from '../../../../../utils/db'
import { requireAuth } from '../../../../../layers/shared/middleware/requireAuth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid product ID' })

  const body = await readBody(event)
  if (!body?.text?.trim()) throw createError({ statusCode: 400, statusMessage: 'Comment text is required' })

  const product = await prisma.products.findUnique({ where: { id }, select: { id: true } })
  if (!product) throw createError({ statusCode: 404, statusMessage: 'Product not found' })

  const comment = await prisma.comment.create({
    data: {
      id: crypto.randomUUID(),
      text: body.text.trim(),
      authorId: user.id,
      productId: id,
      parentId: body.parentId || null,
    },
    include: {
      author: { select: { id: true, username: true, avatar: true } },
      _count: { select: { likes: true, replies: true } },
    },
  })

  return { success: true, data: comment }
})
