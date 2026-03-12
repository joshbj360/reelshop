<template>
    <div class="p-4 sm:p-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-neutral-100">Orders</h1>
                <p class="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">{{ total }} total orders</p>
            </div>
        </div>

        <!-- Status tabs -->
        <div class="flex gap-2 overflow-x-auto scrollbar-hide mb-5 -mx-4 sm:-mx-6 px-4 sm:px-6">
            <button
                v-for="tab in STATUS_TABS"
                :key="tab.value"
                @click="activeStatus = tab.value; loadOrders()"
                class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0"
                :class="activeStatus === tab.value
                    ? 'bg-gray-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                    : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400'"
            >
                {{ tab.label }}
            </button>
        </div>

        <!-- Loading -->
        <div v-if="isLoading && !orders.length" class="space-y-4">
            <div v-for="i in 4" :key="i" class="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-gray-200 dark:border-neutral-800 animate-pulse h-24" />
        </div>

        <!-- Orders table -->
        <div v-else-if="orders.length" class="space-y-4">
            <div
                v-for="order in orders"
                :key="order.id"
                class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden"
            >
                <!-- Order header -->
                <div class="flex flex-wrap items-start justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-neutral-800">
                    <div>
                        <p class="text-sm font-semibold text-gray-900 dark:text-neutral-100">Order #{{ order.id }}</p>
                        <p class="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">{{ formatDate(order.created_at) }}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="px-2.5 py-1 rounded-full text-[11px] font-semibold" :class="statusColor(order.status)">
                            {{ order.status }}
                        </span>
                        <!-- Update status -->
                        <select
                            v-if="['CONFIRMED', 'PENDING'].includes(order.status)"
                            @change="(e) => updateStatus(order.id, (e.target as HTMLSelectElement).value)"
                            class="text-xs border border-gray-200 dark:border-neutral-700 rounded-lg px-2 py-1 bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 focus:outline-none"
                        >
                            <option value="" disabled selected>Update status</option>
                            <option value="CONFIRMED">Confirm</option>
                            <option value="SHIPPED">Mark Shipped</option>
                            <option value="DELIVERED">Mark Delivered</option>
                            <option value="CANCELLED">Cancel</option>
                        </select>
                    </div>
                </div>

                <!-- Customer info -->
                <div class="flex gap-3 items-center px-5 py-3 border-b border-gray-100 dark:border-neutral-800">
                    <img
                        :src="order.user?.avatar || ''"
                        class="w-8 h-8 rounded-full object-cover bg-gray-100 dark:bg-neutral-800 shrink-0"
                    />
                    <div class="min-w-0">
                        <p class="text-sm font-medium text-gray-900 dark:text-neutral-100 truncate">{{ order.name }}</p>
                        <p class="text-xs text-gray-400 dark:text-neutral-500">{{ order.country }}
                            <span v-if="order.shippingZone"> · {{ order.shippingZone }}</span>
                        </p>
                    </div>
                </div>

                <!-- Items -->
                <div class="flex gap-2 p-4 overflow-x-auto">
                    <div v-for="item in order.orderItem" :key="item.id" class="flex gap-2 items-start shrink-0">
                        <img
                            :src="item.variant?.product?.media?.[0]?.url || ''"
                            class="w-12 h-12 rounded-lg object-cover bg-gray-100 dark:bg-neutral-800"
                        />
                        <div class="min-w-0">
                            <p class="text-xs font-medium text-gray-800 dark:text-neutral-200 w-28 truncate">{{ item.variant?.product?.title }}</p>
                            <p class="text-[10px] text-gray-400">{{ item.variant?.size || item.variant?.label }} × {{ item.quantity }}</p>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="flex items-center justify-between px-5 py-3 bg-gray-50 dark:bg-neutral-800/50">
                    <div v-if="order.trackingNumber" class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-neutral-400">
                        <Icon name="mdi:truck-outline" size="14" />
                        {{ order.shipper }} · {{ order.trackingNumber }}
                    </div>
                    <button
                        v-else-if="order.status === 'SHIPPED'"
                        @click="addTracking(order)"
                        class="text-xs text-brand font-medium hover:underline"
                    >
                        + Add tracking
                    </button>
                    <div v-else />
                    <p class="text-sm font-bold text-gray-900 dark:text-neutral-100">
                        {{ formatPrice(order.totalAmount + (order.shippingCost || 0)) }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Empty -->
        <div v-else class="flex flex-col items-center justify-center py-24 text-center">
            <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                <Icon name="mdi:package-variant-closed-outline" size="32" class="text-gray-400 dark:text-neutral-500" />
            </div>
            <p class="font-medium text-gray-900 dark:text-neutral-100">No orders yet</p>
            <p class="text-sm text-gray-500 dark:text-neutral-400 mt-1">Orders for your store will appear here</p>
        </div>

        <!-- Tracking modal -->
        <div v-if="trackingModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div class="bg-white dark:bg-neutral-900 rounded-2xl p-6 w-full max-w-sm space-y-4">
                <h3 class="text-base font-semibold text-gray-900 dark:text-neutral-100">Add Tracking Info</h3>
                <div>
                    <label class="text-xs font-medium text-gray-500 mb-1 block">Courier / Shipper</label>
                    <input v-model="trackingForm.shipper" placeholder="DHL, FedEx, etc." class="input-field" />
                </div>
                <div>
                    <label class="text-xs font-medium text-gray-500 mb-1 block">Tracking Number</label>
                    <input v-model="trackingForm.trackingNumber" placeholder="1Z999AA10123456784" class="input-field" />
                </div>
                <div class="flex gap-3">
                    <button @click="trackingModal = null" class="flex-1 border border-gray-200 dark:border-neutral-700 rounded-xl py-3 text-sm font-medium">Cancel</button>
                    <button @click="saveTracking" class="flex-1 bg-brand text-white rounded-xl py-3 text-sm font-semibold">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useOrderApi } from '~~/layers/commerce/app/services/order.api'
import { notify } from '@kyvg/vue3-notification'

definePageMeta({ middleware: 'auth', layout: 'seller' })

const route = useRoute()
const orderApi = useOrderApi()

const storeSlug = computed(() => route.params.storeSlug as string)
const orders = ref<any[]>([])
const total = ref(0)
const isLoading = ref(true)
const activeStatus = ref('')
const trackingModal = ref<any>(null)
const trackingForm = reactive({ shipper: '', trackingNumber: '' })

const STATUS_TABS = [
    { value: '', label: 'All' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'DELIVERED', label: 'Delivered' },
]

const loadOrders = async () => {
    isLoading.value = true
    try {
        const params: any = { storeSlug: storeSlug.value, limit: 50 }
        if (activeStatus.value) params.status = activeStatus.value
        const res: any = await orderApi.getSellerOrders(storeSlug.value, params)
        orders.value = res?.data?.orders || []
        total.value = res?.data?.total || 0
    } catch (e: any) {
        notify({ type: 'error', text: e.message || 'Failed to load orders' })
    } finally {
        isLoading.value = false
    }
}

const updateStatus = async (orderId: number, status: string) => {
    if (!status) return
    try {
        await orderApi.updateOrderStatus(orderId, { status })
        const o = orders.value.find(o => o.id === orderId)
        if (o) o.status = status
        notify({ type: 'success', text: `Order #${orderId} marked as ${status}` })
    } catch (e: any) {
        notify({ type: 'error', text: e.message || 'Failed to update status' })
    }
}

const addTracking = (order: any) => {
    trackingModal.value = order
    trackingForm.shipper = ''
    trackingForm.trackingNumber = ''
}

const saveTracking = async () => {
    if (!trackingModal.value || !trackingForm.trackingNumber) return
    try {
        await orderApi.updateOrderStatus(trackingModal.value.id, { status: 'SHIPPED', ...trackingForm })
        const o = orders.value.find(o => o.id === trackingModal.value.id)
        if (o) Object.assign(o, { ...trackingForm, status: 'SHIPPED' })
        trackingModal.value = null
        notify({ type: 'success', text: 'Tracking info saved' })
    } catch (e: any) {
        notify({ type: 'error', text: e.message || 'Failed to save tracking' })
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
    new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })

onMounted(loadOrders)
</script>

<style scoped>
.input-field {
    @apply w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-neutral-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors;
}
.scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
</style>
