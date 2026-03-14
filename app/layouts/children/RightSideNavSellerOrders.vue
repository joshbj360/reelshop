<template>
  <div
    class="flex h-full flex-col border-l border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
  >
    <!-- ─── HEADER ────────────────────────────────────────────────────────── -->
    <div
      class="flex shrink-0 items-center justify-between border-b border-gray-100 p-4 dark:border-neutral-800"
    >
      <div>
        <h2
          class="flex items-center gap-2 font-bold text-gray-900 dark:text-neutral-100"
        >
          <Icon
            name="mdi:chart-timeline-variant"
            size="20"
            class="text-brand"
          />
          Store Analytics
        </h2>
        <p class="mt-0.5 text-[11px] text-gray-500 dark:text-neutral-400">
          Real-time performance overview
        </p>
      </div>
      <!-- Quick Date Filter -->
      <button
        class="rounded-lg bg-gray-50 p-1.5 text-gray-500 transition-colors hover:text-gray-900 dark:bg-neutral-800 dark:hover:text-white"
      >
        <Icon name="mdi:calendar-month-outline" size="18" />
      </button>
    </div>

    <!-- ─── SCROLLABLE CONTENT AREA ───────────────────────────────────────── -->
    <div class="custom-scrollbar flex-1 space-y-6 overflow-y-auto p-4">
      <!-- 1. Revenue Summary Card -->
      <div
        class="group relative overflow-hidden rounded-2xl border border-brand/10 bg-gradient-to-br from-brand/5 to-purple-500/5 p-5 shadow-sm dark:from-brand/10 dark:to-purple-500/10"
      >
        <!-- Decorative background elements -->
        <div
          class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-brand/10 blur-2xl transition-colors group-hover:bg-brand/20"
        ></div>

        <p
          class="relative z-10 mb-1 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400"
        >
          Revenue (This Week)
        </p>
        <h3
          class="relative z-10 text-3xl font-black tracking-tight text-gray-900 dark:text-white"
        >
          ₦145,500
        </h3>

        <div
          class="relative z-10 mt-3 flex w-max items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
        >
          <Icon name="mdi:trending-up" size="14" />
          <span>+12.5% vs last week</span>
        </div>
      </div>

      <!-- 2. Order Status Breakdown -->
      <div>
        <h4 class="mb-4 text-sm font-bold text-gray-900 dark:text-neutral-100">
          Fulfillment Status
        </h4>
        <div class="space-y-4">
          <!-- Pending -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-sm">
              <span
                class="flex items-center gap-1.5 font-medium text-gray-600 dark:text-neutral-400"
              >
                <span class="h-2 w-2 rounded-full bg-amber-500"></span> Pending
              </span>
              <span class="font-bold text-gray-900 dark:text-white">12</span>
            </div>
            <div
              class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-800"
            >
              <div
                class="h-1.5 rounded-full bg-amber-500"
                style="width: 35%"
              ></div>
            </div>
          </div>

          <!-- Shipped -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-sm">
              <span
                class="flex items-center gap-1.5 font-medium text-gray-600 dark:text-neutral-400"
              >
                <span class="h-2 w-2 rounded-full bg-blue-500"></span> Shipped
              </span>
              <span class="font-bold text-gray-900 dark:text-white">8</span>
            </div>
            <div
              class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-800"
            >
              <div
                class="h-1.5 rounded-full bg-blue-500"
                style="width: 25%"
              ></div>
            </div>
          </div>

          <!-- Completed -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-sm">
              <span
                class="flex items-center gap-1.5 font-medium text-gray-600 dark:text-neutral-400"
              >
                <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
                Completed
              </span>
              <span class="font-bold text-gray-900 dark:text-white">45</span>
            </div>
            <div
              class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-800"
            >
              <div
                class="h-1.5 rounded-full bg-emerald-500"
                style="width: 80%"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Recent Orders Feed -->
      <div>
        <div
          class="mb-3 flex items-center justify-between border-t border-gray-100 pt-2 dark:border-neutral-800"
        >
          <h4 class="text-sm font-bold text-gray-900 dark:text-neutral-100">
            Recent Orders
          </h4>
          <NuxtLink
            to="/seller/orders"
            class="text-[11px] font-bold text-brand transition-colors hover:text-[#d81b36]"
            >View All →</NuxtLink
          >
        </div>
        <div class="space-y-1">
          <!-- Loop through mock recent orders -->
          <div
            v-for="order in recentOrders"
            :key="order.id"
            class="group -mx-2 flex cursor-pointer items-center gap-3 rounded-xl border border-transparent p-2 transition-colors hover:border-gray-200 hover:bg-gray-50 dark:hover:border-neutral-700 dark:hover:bg-neutral-800"
          >
            <!-- Order Icon based on Status -->
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 transition-transform group-hover:scale-105 dark:bg-neutral-800"
              :class="order.bgClass"
            >
              <Icon :name="order.icon" size="18" :class="order.iconClass" />
            </div>

            <div class="min-w-0 flex-1">
              <p
                class="truncate text-[13px] font-bold text-gray-900 dark:text-neutral-100"
              >
                {{ order.customer }}
              </p>
              <p
                class="truncate text-[11px] text-gray-500 dark:text-neutral-400"
              >
                {{ order.item }}
              </p>
            </div>

            <div class="shrink-0 text-right">
              <p class="text-[13px] font-bold text-gray-900 dark:text-white">
                ₦{{ order.amount.toLocaleString() }}
              </p>
              <p
                class="mt-0.5 text-[10px] font-bold uppercase tracking-wider"
                :class="order.iconClass"
              >
                {{ order.status }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── STICKY BOTTOM EXPORT CTA ──────────────────────────────────────── -->
    <div
      class="sticky bottom-0 flex-shrink-0 border-t border-gray-100 bg-white px-4 pb-5 pt-3 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <button
        class="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-[13px] font-bold text-white transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] dark:bg-white dark:text-gray-900"
      >
        <Icon name="mdi:file-download-outline" size="18" />
        Export Sales Report
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Dummy Data - Wire this up to your Pinia store or API later!
const recentOrders = ref([
  {
    id: 'ORD-001',
    customer: 'Sarah Jenkins',
    item: 'Vintage Denim Jacket',
    amount: 15500,
    status: 'Pending',
    icon: 'mdi:package-variant',
    iconClass: 'text-amber-600 dark:text-amber-500',
    bgClass: 'bg-amber-50 dark:bg-amber-500/10',
  },
  {
    id: 'ORD-002',
    customer: 'Michael T.',
    item: 'Air Max Y2K Sneakers',
    amount: 45000,
    status: 'Shipped',
    icon: 'mdi:truck-fast-outline',
    iconClass: 'text-blue-600 dark:text-blue-500',
    bgClass: 'bg-blue-50 dark:bg-blue-500/10',
  },
  {
    id: 'ORD-003',
    customer: 'Aisha Bello',
    item: 'Graphic Print Oversized Tee',
    amount: 8500,
    status: 'Completed',
    icon: 'mdi:check-decagram-outline',
    iconClass: 'text-emerald-600 dark:text-emerald-500',
    bgClass: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
  {
    id: 'ORD-004',
    customer: 'David O.',
    item: 'Retro Leather Satchel',
    amount: 22000,
    status: 'Completed',
    icon: 'mdi:check-decagram-outline',
    iconClass: 'text-emerald-600 dark:text-emerald-500',
    bgClass: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
])
</script>

<style scoped>
/* Custom Scrollbar Styling */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}

/* Dark mode scrollbar */
:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #404040;
}

:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #525252;
}

/* Firefox scrollbar */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb transparent;
}

:global(.dark) .custom-scrollbar {
  scrollbar-color: #404040 transparent;
}
</style>
