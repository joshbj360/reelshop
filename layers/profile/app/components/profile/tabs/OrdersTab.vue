<template>
  <div class="space-y-6 p-6">
    <!-- Filter Tabs -->
    <div class="scrollbar-hide flex gap-2 overflow-x-auto">
      <button
        v-for="filter in orderFilters"
        :key="filter.id"
        @click="activeFilter = filter.id"
        class="whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        :class="
          activeFilter === filter.id
            ? 'bg-brand text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
        "
      >
        {{ filter.label }}
        <span v-if="filter.count > 0" class="ml-1">({{ filter.count }})</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="py-12 text-center">
      <Icon
        name="eos-icons:loading"
        size="32"
        class="animate-spin text-brand"
      />
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredOrders.length === 0" class="py-12 text-center">
      <Icon
        name="mdi:package-variant-closed"
        size="64"
        class="mx-auto mb-4 text-gray-300 dark:text-neutral-700"
      />
      <p class="mb-4 text-gray-500 dark:text-neutral-400">No orders found</p>
      <button
        @click="goToShop"
        class="rounded-lg bg-brand px-6 py-2 font-semibold text-white transition-colors hover:bg-[#d81b36]"
      >
        Start Shopping
      </button>
    </div>

    <!-- Orders List -->
    <div v-else class="space-y-4">
      <OrderCard
        v-for="order in filteredOrders"
        :key="order.id"
        :order="order"
        @track="trackOrder"
        @review="reviewOrder"
        @reorder="reorderItems"
        @cancel="handleCancelOrder"
      />

      <!-- Load More -->
      <button
        v-if="hasMore"
        @click="loadMore"
        :disabled="isLoading"
        class="w-full rounded-lg py-3 font-semibold text-brand transition-colors hover:bg-gray-50 disabled:opacity-50 dark:hover:bg-neutral-800"
      >
        Load More Orders
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import OrderCard from '../cards/OrderCard.vue'
import { useOrder } from '~~/layers/commerce/app/composables/useOrder'

const router = useRouter()
const {
  orders: storeOrders,
  isLoading,
  total,
  fetchMyOrders,
  cancelOrder: cancelOrderApi,
} = useOrder()

const activeFilter = ref('all')
const limit = 20
const offset = ref(0)

const orders = storeOrders
const hasMore = computed(() => orders.value.length < total.value)

const orderFilters = computed(() => [
  { id: 'all', label: 'All Orders', count: orders.value.length },
  {
    id: 'pending',
    label: 'Pending',
    count: orders.value.filter((o) => o.status === 'PENDING').length,
  },
  {
    id: 'confirmed',
    label: 'Confirmed',
    count: orders.value.filter((o) => o.status === 'CONFIRMED').length,
  },
  {
    id: 'shipped',
    label: 'Shipped',
    count: orders.value.filter((o) => o.status === 'SHIPPED').length,
  },
  {
    id: 'delivered',
    label: 'Delivered',
    count: orders.value.filter((o) => o.status === 'DELIVERED').length,
  },
  {
    id: 'cancelled',
    label: 'Cancelled',
    count: orders.value.filter((o) => o.status === 'CANCELLED').length,
  },
])

const filteredOrders = computed(() => {
  if (activeFilter.value === 'all') return orders.value
  return orders.value.filter(
    (o) => o.status.toLowerCase() === activeFilter.value,
  )
})

onMounted(async () => {
  await fetchMyOrders(limit, 0)
})

const goToShop = () => router.push('/discover')

const trackOrder = (orderId: number) => router.push(`/orders/${orderId}/track`)
const reviewOrder = (orderId: number) =>
  router.push(`/orders/${orderId}/review`)
const reorderItems = async (orderId: number) => {
  // Future: add order items back to cart
  console.log('Reorder:', orderId)
}

const handleCancelOrder = async (orderId: number) => {
  if (confirm('Are you sure you want to cancel this order?')) {
    try {
      await cancelOrderApi(orderId)
    } catch (e: any) {
      alert(e.message || 'Failed to cancel order')
    }
  }
}

const loadMore = async () => {
  offset.value += limit
  await fetchMyOrders(limit, offset.value)
}
</script>
