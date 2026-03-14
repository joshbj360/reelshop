<template>
  <div
    class="overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
  >
    <!-- Header -->
    <div
      class="flex items-center justify-between border-b border-gray-200 p-4 dark:border-neutral-800"
    >
      <div>
        <p class="text-sm text-gray-500 dark:text-neutral-400">
          Order {{ order.orderNumber }}
        </p>
        <p class="text-xs text-gray-400 dark:text-neutral-500">
          {{ formatDate(order.placedAt) }}
        </p>
      </div>
      <div>
        <span
          class="rounded-full px-3 py-1 text-xs font-semibold"
          :class="statusClasses[order.status]"
        >
          {{ order.status }}
        </span>
      </div>
    </div>

    <!-- Items -->
    <div class="space-y-3 p-4">
      <div v-for="item in order.items" :key="item.id" class="flex gap-3">
        <img
          :src="item.image"
          :alt="item.name"
          class="h-16 w-16 rounded-lg object-cover"
        />
        <div class="min-w-0 flex-1">
          <p
            class="truncate text-sm font-medium text-gray-900 dark:text-neutral-100"
          >
            {{ item.name }}
          </p>
          <p class="text-xs text-gray-500 dark:text-neutral-400">
            Qty: {{ item.quantity }} × ${{ item.price }}
          </p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div
      class="flex items-center justify-between bg-gray-50 p-4 dark:bg-neutral-800"
    >
      <div class="text-sm">
        <span class="text-gray-500 dark:text-neutral-400">Total:</span>
        <span class="ml-2 font-bold text-gray-900 dark:text-neutral-100">
          ${{ order.total.toFixed(2) }}
        </span>
      </div>

      <div class="flex gap-2">
        <!-- Track Button (if shipped) -->
        <button
          v-if="['SHIPPED', 'PROCESSING'].includes(order.status)"
          @click="$emit('track', order.id)"
          class="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#d81b36]"
        >
          Track Order
        </button>

        <!-- Review Button (if delivered) -->
        <button
          v-if="order.status === 'DELIVERED'"
          @click="$emit('review', order.id)"
          class="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-300 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
        >
          Write Review
        </button>

        <!-- Reorder Button -->
        <button
          @click="$emit('reorder', order.id)"
          class="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-300 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
        >
          Reorder
        </button>

        <!-- Cancel Button (if pending) -->
        <button
          v-if="order.status === 'PENDING'"
          @click="$emit('cancel', order.id)"
          class="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  order: any
}>()

defineEmits(['track', 'review', 'reorder', 'cancel'])

const statusClasses = {
  PENDING:
    'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
  PROCESSING:
    'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
  SHIPPED:
    'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
  DELIVERED:
    'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  CANCELLED: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>
