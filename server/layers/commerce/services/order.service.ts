import { orderRepository } from '../repositories/order.repository'
import { cartRepository } from '../repositories/cart.repository'
import { auditService } from '../../shared/audit/audit.service'
import { UserError } from '../../profile/types/user.types'
import { prisma } from '../../../utils/db'

export const orderService = {
  async placeOrder(userId: string, data: any, ipAddress: string, userAgent: string) {
    const { items, name, address, zipcode, county, country, paymentMethod } = data

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new UserError('INVALID_ORDER', 'Order must have at least one item', 400)
    }

    // Validate stock for all items
    let totalAmount = 0
    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: { select: { price: true, discount: true } } }
      })
      if (!variant) throw new UserError('VARIANT_NOT_FOUND', `Variant ${item.variantId} not found`, 404)
      if (variant.stock < item.quantity) {
        throw new UserError('INSUFFICIENT_STOCK', `Not enough stock for variant ${item.variantId}`, 400)
      }
      const price = variant.price ?? variant.product.price
      const discount = variant.product.discount ?? 0
      totalAmount += Math.round(price * (1 - discount / 100) * item.quantity * 100) // in cents
    }

    // Create order
    const order = await orderRepository.createOrder(userId, {
      name, address, zipcode, county: county || '', country,
      totalAmount,
      paymentMethod: paymentMethod || 'card',
      items
    })

    // Decrement stock
    for (const item of items) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } }
      })
    }

    // Clear cart after order
    await cartRepository.clearCart(userId)

    await auditService.logUserAction({
      userId,
      action: 'ORDER_PLACED',
      resource: 'Orders',
      resourceId: String(order.id),
      reason: 'Placed new order',
      changes: { totalAmount, itemCount: items.length },
      ipAddress,
      userAgent
    })

    return order
  },

  async getUserOrders(userId: string, limit = 20, offset = 0) {
    const [orders, total] = await Promise.all([
      orderRepository.getUserOrders(userId, limit, offset),
      orderRepository.countUserOrders(userId)
    ])
    return { orders, total, limit, offset }
  },

  async getOrderById(id: number, userId: string) {
    const order = await orderRepository.getOrderById(id)
    if (!order) throw new UserError('ORDER_NOT_FOUND', 'Order not found', 404)
    if (order.userId !== userId) throw new UserError('FORBIDDEN', 'Access denied', 403)
    return order
  },

  async cancelOrder(id: number, userId: string, ipAddress: string, userAgent: string) {
    const order = await orderRepository.getOrderById(id)
    if (!order) throw new UserError('ORDER_NOT_FOUND', 'Order not found', 404)
    if (order.userId !== userId) throw new UserError('FORBIDDEN', 'Access denied', 403)
    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      throw new UserError('CANNOT_CANCEL', 'Order cannot be cancelled at this stage', 400)
    }

    const updated = await orderRepository.updateOrderStatus(id, 'CANCELLED')

    // Restore stock
    for (const item of order.orderItem) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { increment: item.quantity } }
      })
    }

    await auditService.logUserAction({
      userId,
      action: 'ORDER_CANCELLED',
      resource: 'Orders',
      resourceId: String(id),
      reason: 'Order cancelled by user',
      ipAddress,
      userAgent
    })

    return updated
  }
}
