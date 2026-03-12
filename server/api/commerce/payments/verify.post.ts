// POST /api/commerce/payments/verify
// Called by the client after Paystack redirect to confirm payment.
import { z } from 'zod'
import { requireAuth } from '../../../layers/shared/middleware/requireAuth'
import { paystack } from '../../../utils/paystack'
import { prisma } from '../../../utils/db'
import { UserError } from '../../../layers/profile/types/user.types'

const schema = z.object({ reference: z.string().min(1) })

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const { reference } = schema.parse(await readBody(event))

    // 1. Find the order by payment reference
    const order = await prisma.orders.findUnique({ where: { paymentRef: reference } })
    if (!order) throw new UserError('NOT_FOUND', 'Order not found for this reference', 404)
    if (order.userId !== user.id) throw new UserError('FORBIDDEN', 'Access denied', 403)

    // 2. Already confirmed — idempotent
    if (order.paymentStatus === 'PAID') {
      return { success: true, data: { status: 'already_paid', orderId: order.id } }
    }

    // 3. Verify with Paystack
    const result = await paystack.verifyTransaction(reference)

    if (result.data.status === 'success') {
      await prisma.orders.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
        },
      })
      return { success: true, data: { status: 'paid', orderId: order.id } }
    }

    // Payment failed or abandoned
    await prisma.orders.update({
      where: { id: order.id },
      data: { paymentStatus: 'FAILED' },
    })
    return { success: true, data: { status: result.data.status, orderId: order.id } }
  } catch (error: any) {
    if (error instanceof UserError) throw createError({ statusCode: error.status, statusMessage: error.message })
    throw createError({ statusCode: 500, statusMessage: error.message || 'Payment verification failed' })
  }
})
