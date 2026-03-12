<template>
    <HomeLayout :narrow-feed="true" :hide-right-sidebar="true">
        <div class="max-w-2xl mx-auto py-6 px-2 sm:px-0">

            <!-- Header -->
            <div class="flex items-center gap-3 mb-6">
                <NuxtLink to="/" class="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                    <Icon name="mdi:arrow-left" size="22" />
                </NuxtLink>
                <h1 class="text-xl font-bold text-gray-900 dark:text-neutral-100">My Orders</h1>
            </div>

            <!-- Payment success banner -->
            <div v-if="paymentSuccess" class="mb-5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 flex items-center gap-3">
                <Icon name="mdi:check-circle" size="24" class="text-green-500 shrink-0" />
                <div>
                    <p class="font-semibold text-green-800 dark:text-green-300 text-sm">Payment successful!</p>
                    <p class="text-xs text-green-600 dark:text-green-400">Your order has been placed and is being processed.</p>
                </div>
            </div>

            <!-- Status filter tabs -->
            <div class="flex gap-2 overflow-x-auto scrollbar-hide mb-5 -mx-2 px-2">
                <button
                    v-for="tab in STATUS_TABS"
                    :key="tab.value"
                    @click="activeStatus = tab.value"
                    class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0"
                    :class="activeStatus === tab.value
                        ? 'bg-gray-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                        : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400'"
                >
                    {{ tab.label }}
                </button>
            </div>

            <!-- Loading -->
            <div v-if="isLoading && !filteredOrders.length" class="space-y-4">
                <div v-for="i in 3" :key="i" class="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-gray-100 dark:border-neutral-800 animate-pulse">
                    <div class="flex gap-3">
                        <div class="w-16 h-16 rounded-xl bg-gray-200 dark:bg-neutral-800" />
                        <div class="flex-1 space-y-2">
                            <div class="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-3/4" />
                            <div class="h-3 bg-gray-200 dark:bg-neutral-800 rounded w-1/2" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Orders list -->
            <div v-else-if="filteredOrders.length" class="space-y-4">
                <NuxtLink
                    v-for="order in filteredOrders"
                    :key="order.id"
                    :to="`/buyer/orders/${order.id}`"
                    class="block bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-gray-100 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700 transition-colors"
                >
                    <!-- Order header -->
                    <div class="flex items-start justify-between mb-3">
                        <div>
                            <p class="text-xs text-gray-400 dark:text-neutral-500">Order #{{ order.id }}</p>
                            <p class="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">{{ formatDate(order.created_at) }}</p>
                        </div>
                        <span class="px-2.5 py-1 rounded-full text-[11px] font-semibold" :class="statusColor(order.status)">
                            {{ order.status }}
                        </span>
                    </div>

                    <!-- Items preview -->
                    <div class="flex gap-2 mb-3">
                        <img
                            v-for="(item, i) in order.orderItem.slice(0, 3)"
                            :key="i"
                            :src="item.variant?.product?.media?.[0]?.url || ''"
                            class="w-14 h-14 rounded-xl object-cover bg-gray-100 dark:bg-neutral-800"
                        />
                        <div v-if="order.orderItem.length > 3" class="w-14 h-14 rounded-xl bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-sm font-semibold text-gray-500">
                            +{{ order.orderItem.length - 3 }}
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="flex items-center justify-between">
                        <p class="text-xs text-gray-500 dark:text-neutral-400">
                            {{ order.orderItem.length }} item{{ order.orderItem.length !== 1 ? 's' : '' }}
                            <span v-if="order.shippingZone"> · {{ order.shippingZone }}</span>
                        </p>
                        <p class="text-sm font-bold text-gray-900 dark:text-neutral-100">
                            {{ formatPrice(order.totalAmount + (order.shippingCost || 0)) }}
                        </p>
                    </div>

                    <!-- Tracking -->
                    <div v-if="order.trackingNumber" class="mt-2 pt-2 border-t border-gray-100 dark:border-neutral-800 flex items-center gap-1.5 text-xs text-brand">
                        <Icon name="mdi:truck-outline" size="14" />
                        {{ order.shipper || 'Courier' }} · {{ order.trackingNumber }}
                    </div>
                </NuxtLink>
            </div>

            <!-- Empty -->
            <div v-else class="flex flex-col items-center justify-center py-24 text-center">
                <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                    <Icon name="mdi:package-variant-closed-outline" size="32" class="text-gray-400 dark:text-neutral-500" />
                </div>
                <p class="font-medium text-gray-900 dark:text-neutral-100">No {{ activeStatus !== 'ALL' ? activeStatus.toLowerCase() : '' }} orders yet</p>
                <NuxtLink to="/discover" class="mt-3 text-sm text-brand font-semibold hover:underline">Start shopping</NuxtLink>
            </div>
        </div>
    </HomeLayout>
</template>

<script setup lang="ts">
import HomeLayout from '~/layouts/HomeLayout.vue'
import { useOrder } from '~~/layers/commerce/app/composables/useOrder'
import { useOrderApi } from '~~/layers/commerce/app/services/order.api'
import { notify } from '@kyvg/vue3-notification'

definePageMeta({ middleware: 'auth' })
const { setOrdersPage } = useSeo()
setOrdersPage()

const route = useRoute()
const { isLoading } = useOrder()
const orderApi = useOrderApi()

const orders = ref<any[]>([])
const activeStatus = ref('ALL')
const paymentSuccess = ref(route.query.payment === 'success')

// Verify payment if redirected from Paystack
onMounted(async () => {
    const ref = route.query.reference as string
    if (ref) {
        try {
            await orderApi.verifyPayment(ref)
        } catch { /* silent */ }
    }
    await loadOrders()

    if (paymentSuccess.value) {
        setTimeout(() => { paymentSuccess.value = false }, 6000)
    }
})

const loadOrders = async () => {
    try {
        const res: any = await orderApi.getOrders({ limit: 50 })
        orders.value = res?.data?.orders || []
    } catch (e: any) {
        notify({ type: 'error', text: e.message || 'Failed to load orders' })
    }
}

const filteredOrders = computed(() => {
    if (activeStatus.value === 'ALL') return orders.value
    return orders.value.filter(o => o.status === activeStatus.value)
})

const STATUS_TABS = [
    { value: 'ALL', label: 'All' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' },
]

const statusColor = (status: string) => ({
    PENDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    CONFIRMED: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    SHIPPED: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    DELIVERED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    CANCELLED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    CANCELED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
}[status] || 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400')

const formatPrice = (cents: number) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(cents / 100)

const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
</script>

<style scoped>
.scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
</style>
