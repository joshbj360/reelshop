<template>
    <HomeLayout :narrow-feed="true" :hide-right-sidebar="true">
        <div class="max-w-2xl mx-auto py-6 px-2 sm:px-0">

            <!-- Header -->
            <div class="flex items-center gap-3 mb-6">
                <NuxtLink to="/buyer/orders" class="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                    <Icon name="mdi:arrow-left" size="22" />
                </NuxtLink>
                <div>
                    <h1 class="text-xl font-bold text-gray-900 dark:text-neutral-100">Order #{{ orderId }}</h1>
                    <p v-if="order" class="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">{{ formatDate(order.created_at) }}</p>
                </div>
            </div>

            <!-- Loading -->
            <div v-if="isLoading" class="space-y-4">
                <div v-for="i in 4" :key="i" class="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-gray-100 dark:border-neutral-800 animate-pulse h-28" />
            </div>

            <!-- Error -->
            <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-5 text-sm text-red-600 dark:text-red-400">
                {{ error }}
            </div>

            <div v-else-if="order" class="space-y-5">
                <!-- Status Card -->
                <div class="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-gray-100 dark:border-neutral-800">
                    <div class="flex items-center justify-between mb-4">
                        <p class="text-sm font-semibold text-gray-700 dark:text-neutral-300">Status</p>
                        <span class="px-3 py-1 rounded-full text-sm font-semibold" :class="statusColor(order.status)">
                            {{ order.status }}
                        </span>
                    </div>

                    <!-- Progress bar -->
                    <div class="flex items-center gap-0">
                        <div
                            v-for="(step, i) in ORDER_STEPS"
                            :key="step"
                            class="flex-1 flex flex-col items-center"
                        >
                            <div
                                class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                                :class="stepIndex >= i
                                    ? 'bg-brand text-white'
                                    : 'bg-gray-100 dark:bg-neutral-800 text-gray-400'"
                            >
                                <Icon v-if="stepIndex > i" name="mdi:check" size="14" />
                                <span v-else>{{ i + 1 }}</span>
                            </div>
                            <p class="text-[9px] text-gray-400 mt-1 text-center">{{ step }}</p>
                            <div v-if="i < ORDER_STEPS.length - 1" class="hidden" />
                        </div>
                    </div>
                </div>

                <!-- Items -->
                <div class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 overflow-hidden">
                    <div class="px-5 py-4 border-b border-gray-100 dark:border-neutral-800">
                        <h2 class="text-sm font-semibold text-gray-700 dark:text-neutral-300">Items ({{ order.orderItem.length }})</h2>
                    </div>
                    <div class="divide-y divide-gray-100 dark:divide-neutral-800">
                        <div v-for="item in order.orderItem" :key="item.id" class="flex gap-3 items-start p-4">
                            <img
                                :src="item.variant?.product?.media?.[0]?.url || ''"
                                class="w-16 h-16 rounded-xl object-cover bg-gray-100 dark:bg-neutral-800 shrink-0"
                            />
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 dark:text-neutral-100 truncate">
                                    {{ item.variant?.product?.title }}
                                </p>
                                <p class="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">
                                    {{ item.variant?.size || item.variant?.label }} · Qty {{ item.quantity }}
                                </p>
                                <p class="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
                                    Sold by {{ item.variant?.product?.seller?.store_name || item.variant?.product?.seller?.store_slug }}
                                </p>
                            </div>
                            <p class="text-sm font-semibold text-gray-900 dark:text-neutral-100 shrink-0">
                                {{ formatPrice((item.variant?.price ?? item.variant?.product?.price ?? 0) * item.quantity) }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Delivery info -->
                <div class="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-gray-100 dark:border-neutral-800">
                    <h2 class="text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-3">Delivery</h2>
                    <div class="space-y-1.5 text-sm text-gray-600 dark:text-neutral-400">
                        <p class="font-medium text-gray-900 dark:text-neutral-100">{{ order.name }}</p>
                        <p>{{ order.address }}, {{ order.county }}</p>
                        <p>{{ order.zipcode }}, {{ order.country }}</p>
                        <div v-if="order.shippingZone" class="flex items-center gap-1.5 text-xs text-brand mt-2">
                            <Icon name="mdi:truck-outline" size="14" />
                            {{ order.shippingZone }}
                            <span v-if="order.estimatedDays" class="text-gray-400 dark:text-neutral-500">· Est. {{ order.estimatedDays }}</span>
                        </div>
                        <div v-if="order.trackingNumber" class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-neutral-400 mt-1">
                            <Icon name="mdi:barcode" size="14" />
                            <span>{{ order.shipper }} · {{ order.trackingNumber }}</span>
                        </div>
                    </div>
                </div>

                <!-- Price breakdown -->
                <div class="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-gray-100 dark:border-neutral-800 space-y-2">
                    <div class="flex justify-between text-sm text-gray-500 dark:text-neutral-400">
                        <span>Subtotal</span>
                        <span>{{ formatPrice(order.totalAmount) }}</span>
                    </div>
                    <div v-if="order.shippingCost" class="flex justify-between text-sm text-gray-500 dark:text-neutral-400">
                        <span>Shipping</span>
                        <span>{{ formatPrice(order.shippingCost) }}</span>
                    </div>
                    <div class="flex justify-between text-base font-bold text-gray-900 dark:text-neutral-100 pt-2 border-t border-gray-100 dark:border-neutral-800">
                        <span>Total</span>
                        <span>{{ formatPrice(order.totalAmount + (order.shippingCost || 0)) }}</span>
                    </div>
                    <p class="text-xs text-gray-400 dark:text-neutral-500">Paid via {{ order.paymentMethod }}</p>
                </div>

                <!-- Cancel button (only if PENDING) -->
                <button
                    v-if="order.status === 'PENDING'"
                    @click="handleCancel"
                    :disabled="cancelling"
                    class="w-full border border-red-200 dark:border-red-800 text-red-500 font-semibold py-3.5 rounded-2xl text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                >
                    {{ cancelling ? 'Cancelling…' : 'Cancel Order' }}
                </button>
            </div>
        </div>
    </HomeLayout>
</template>

<script setup lang="ts">
import HomeLayout from '~/layouts/HomeLayout.vue'
import { useOrderApi } from '~~/layers/commerce/app/services/order.api'
import { notify } from '@kyvg/vue3-notification'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const orderApi = useOrderApi()

const orderId = computed(() => Number(route.params.id))
const order = ref<any>(null)
const isLoading = ref(true)
const error = ref('')
const cancelling = ref(false)

const ORDER_STEPS = ['Pending', 'Confirmed', 'Shipped', 'Delivered']
const STEP_MAP: Record<string, number> = {
    PENDING: 0, CONFIRMED: 1, SHIPPED: 2, DELIVERED: 3
}
const stepIndex = computed(() => STEP_MAP[order.value?.status] ?? 0)

onMounted(async () => {
    try {
        const res: any = await orderApi.getOrderById(orderId.value)
        order.value = res?.data
    } catch (e: any) {
        error.value = e.message || 'Order not found'
    } finally {
        isLoading.value = false
    }
})

const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return
    cancelling.value = true
    try {
        const res: any = await orderApi.cancelOrder(orderId.value)
        order.value = res?.data
        notify({ type: 'success', text: 'Order cancelled' })
    } catch (e: any) {
        notify({ type: 'error', text: e.message || 'Could not cancel order' })
    } finally {
        cancelling.value = false
    }
}

const statusColor = (status: string) => ({
    PENDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    CONFIRMED: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    SHIPPED: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    DELIVERED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    CANCELLED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
}[status] || 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400')

const formatPrice = (cents: number) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(cents / 100)

const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
</script>
