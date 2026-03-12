// POST /api/commerce/payments/webhook
// Paystack sends this after a transaction completes (even if user closes the tab).
// Set this URL in the Paystack dashboard: https://yourdomain.com/api/commerce/payments/webhook
import crypto from 'crypto'
import { prisma } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) throw createError({ statusCode: 500, statusMessage: 'Server misconfigured' })

  // 1. Validate Paystack signature
  const signature = getHeader(event, 'x-paystack-signature')
  const rawBody = await readRawBody(event)
  if (!rawBody || !signature) throw createError({ statusCode: 400, statusMessage: 'Bad request' })

  const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex')
  if (hash !== signature) throw createError({ statusCode: 401, statusMessage: 'Invalid signature' })

  // 2. Parse event
  const payload = JSON.parse(rawBody)
  const { event: eventType, data } = payload

  if (eventType === 'charge.success') {
    const reference: string = data?.reference
    if (!reference) return { success: true }

    const order = await prisma.orders.findUnique({ where: { paymentRef: reference } })
    if (order && order.paymentStatus !== 'PAID') {
      await prisma.orders.update({
        where: { id: order.id },
        data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
      })
    }
  }

  // Always return 200 to Paystack
  return { success: true }
})
