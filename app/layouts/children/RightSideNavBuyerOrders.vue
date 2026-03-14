<template>
    <div class="flex flex-col h-full bg-white dark:bg-neutral-900 border-l border-gray-200 dark:border-neutral-800">

        <!-- ─── HEADER ────────────────────────────────────────────────────────── -->
        <div class="p-4 border-b border-gray-100 dark:border-neutral-800 shrink-0 flex items-center justify-between">
            <div>
                <h2 class="font-bold text-gray-900 dark:text-neutral-100 flex items-center gap-2">
                    <Icon name="mdi:shopping-outline" size="20" class="text-brand" />
                    Shopping Activity
                </h2>
                <p class="text-[11px] text-gray-500 dark:text-neutral-400 mt-0.5">Your personal order overview</p>
            </div>
            <!-- Quick Date Filter -->
            <button class="p-1.5 rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Icon name="mdi:calendar-month-outline" size="18" />
            </button>
        </div>

        <!-- ─── SCROLLABLE CONTENT AREA ───────────────────────────────────────── -->
        <div class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">

            <!-- 1. Spending Summary Card -->
            <div class="bg-gradient-to-br from-brand/5 to-purple-500/5 dark:from-brand/10 dark:to-purple-500/10 rounded-2xl p-5 border border-brand/10 shadow-sm relative overflow-hidden group">
                <!-- Decorative background elements -->
                <div class="absolute -right-4 -top-4 w-24 h-24 bg-brand/10 rounded-full blur-2xl group-hover:bg-brand/20 transition-colors"></div>
                
                <p class="text-[11px] font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider mb-1 relative z-10">Total Spent (This Month)</p>
                <h3 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight relative z-10">₦69,000</h3>
                
                <div class="flex items-center gap-1.5 mt-3 text-xs font-bold text-gray-600 dark:text-gray-400 relative z-10 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm w-max px-2 py-1 rounded-md border border-gray-200/50 dark:border-neutral-700/50">
                    <Icon name="mdi:wallet-outline" size="14" />
                    <span>3 items purchased</span>
                </div>
            </div>

            <!-- 2. Order Status Breakdown -->
            <div>
                <h4 class="text-sm font-bold text-gray-900 dark:text-neutral-100 mb-4">My Incoming Orders</h4>
                <div class="space-y-4">
                    
                    <!-- Processing -->
                    <div class="space-y-1.5">
                        <div class="flex items-center justify-between text-sm">
                            <span class="font-medium text-gray-600 dark:text-neutral-400 flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-amber-500"></span> Processing
                            </span>
                            <span class="font-bold text-gray-900 dark:text-white">2</span>
                        </div>
                        <div class="w-full bg-gray-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                            <div class="bg-amber-500 h-1.5 rounded-full" style="width: 40%"></div>
                        </div>
                    </div>

                    <!-- Shipped -->
                    <div class="space-y-1.5">
                        <div class="flex items-center justify-between text-sm">
                            <span class="font-medium text-gray-600 dark:text-neutral-400 flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-blue-500"></span> On the way
                            </span>
                            <span class="font-bold text-gray-900 dark:text-white">1</span>
                        </div>
                        <div class="w-full bg-gray-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                            <div class="bg-blue-500 h-1.5 rounded-full" style="width: 20%"></div>
                        </div>
                    </div>

                    <!-- Delivered -->
                    <div class="space-y-1.5">
                        <div class="flex items-center justify-between text-sm">
                            <span class="font-medium text-gray-600 dark:text-neutral-400 flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Delivered
                            </span>
                            <span class="font-bold text-gray-900 dark:text-white">14</span>
                        </div>
                        <div class="w-full bg-gray-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                            <div class="bg-emerald-500 h-1.5 rounded-full" style="width: 85%"></div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- 3. Recent Purchases Feed -->
            <div>
                <div class="flex items-center justify-between mb-3 pt-2 border-t border-gray-100 dark:border-neutral-800">
                    <h4 class="text-sm font-bold text-gray-900 dark:text-neutral-100">Recent Purchases</h4>
                    <NuxtLink to="/buyer/orders" class="text-[11px] font-bold text-brand hover:text-[#d81b36] transition-colors">View All →</NuxtLink>
                </div>
                <div class="space-y-1">
                    <!-- Loop through mock recent purchases -->
                    <div v-for="order in recentOrders" :key="order.id" class="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-neutral-700 group">
                        
                        <!-- Order Icon based on Status -->
                        <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform" :class="order.bgClass">
                            <Icon :name="order.icon" size="18" :class="order.iconClass" />
                        </div>
                        
                        <div class="flex-1 min-w-0">
                            <p class="text-[13px] font-bold text-gray-900 dark:text-neutral-100 truncate">{{ order.store }}</p>
                            <p class="text-[11px] text-gray-500 dark:text-neutral-400 truncate">{{ order.item }}</p>
                        </div>
                        
                        <div class="text-right shrink-0">
                            <p class="text-[13px] font-bold text-gray-900 dark:text-white">₦{{ order.amount.toLocaleString() }}</p>
                            <p class="text-[10px] font-bold uppercase tracking-wider mt-0.5" :class="order.iconClass">{{ order.status }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ─── STICKY BOTTOM ORDER HISTORY CTA ────────────────────────────────── -->
        <div class="flex-shrink-0 pt-3 pb-5 px-4 sticky bottom-0 bg-white dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-800">
            <NuxtLink to="/buyer/orders" class="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-[13px] font-bold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <Icon name="mdi:history" size="18" />
                Full Order History
            </NuxtLink>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Dummy Data - Wire this up to your Pinia store or API later!
const recentOrders = ref([
    { 
        id: 'ORD-001', 
        store: 'Vintage Vault', 
        item: 'Vintage Denim Jacket', 
        amount: 15500, 
        status: 'Processing', 
        icon: 'mdi:package-variant', 
        iconClass: 'text-amber-600 dark:text-amber-500',
        bgClass: 'bg-amber-50 dark:bg-amber-500/10'
    },
    { 
        id: 'ORD-002', 
        store: 'Kicks NG', 
        item: 'Air Max Y2K Sneakers', 
        amount: 45000, 
        status: 'Shipped', 
        icon: 'mdi:truck-fast-outline', 
        iconClass: 'text-blue-600 dark:text-blue-500',
        bgClass: 'bg-blue-50 dark:bg-blue-500/10'
    },
    { 
        id: 'ORD-003', 
        store: 'Streetwear Co.', 
        item: 'Graphic Print Oversized Tee', 
        amount: 8500, 
        status: 'Delivered', 
        icon: 'mdi:check-decagram-outline', 
        iconClass: 'text-emerald-600 dark:text-emerald-500',
        bgClass: 'bg-emerald-50 dark:bg-emerald-500/10'
    }
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