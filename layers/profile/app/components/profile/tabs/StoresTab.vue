<template>
    <div class="p-4">
        <!-- Skeleton -->
        <div v-if="isLoading && !sellers.length" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div v-for="i in 2" :key="i" class="animate-pulse bg-gray-50 dark:bg-neutral-800 rounded-2xl overflow-hidden">
                <div class="h-20 bg-gray-100 dark:bg-neutral-700" />
                <div class="p-3 space-y-2">
                    <div class="h-4 bg-gray-100 dark:bg-neutral-700 rounded w-1/2" />
                    <div class="h-3 bg-gray-100 dark:bg-neutral-700 rounded w-1/3" />
                    <div class="h-8 bg-gray-100 dark:bg-neutral-700 rounded-xl" />
                </div>
            </div>
        </div>

        <!-- Empty -->
        <div v-else-if="!isLoading && !sellers.length" class="flex flex-col items-center justify-center py-16 gap-3">
            <Icon name="mdi:store-outline" size="48" class="text-gray-300 dark:text-neutral-600" />
            <p class="text-[14px] text-gray-500 dark:text-neutral-400">No stores yet</p>
            <NuxtLink
                to="/sellers/create"
                class="px-5 py-2 bg-gradient-to-r from-[#f02c56] to-purple-600 text-white text-[13px] font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
                Create a Store
            </NuxtLink>
        </div>

        <!-- Store cards -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
                v-for="seller in sellers"
                :key="seller.id"
                class="bg-gray-50 dark:bg-neutral-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-neutral-700 hover:shadow-md transition-shadow"
            >
                <!-- Banner -->
                <div
                    class="h-20 bg-gradient-to-r from-[#f02c56] to-purple-600 relative"
                    :style="seller.store_banner
                        ? { backgroundImage: `url(${seller.store_banner})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                        : {}"
                >
                    <!-- Status badge -->
                    <div class="absolute top-2 right-2 flex gap-1">
                        <span
                            class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            :class="seller.is_active ? 'bg-emerald-500 text-white' : 'bg-gray-500/80 text-white'"
                        >
                            {{ seller.is_active ? 'Active' : 'Inactive' }}
                        </span>
                        <span v-if="seller.is_verified" class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white flex items-center gap-0.5">
                            <Icon name="mdi:check-circle" size="10" />
                            Verified
                        </span>
                    </div>
                </div>

                <!-- Logo + Info -->
                <div class="px-3 pt-0 pb-3">
                    <div class="flex items-end gap-2 -mt-6 mb-2">
                        <div class="w-12 h-12 rounded-xl border-2 border-white dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-700 shrink-0 shadow-sm">
                            <img v-if="seller.store_logo" :src="seller.store_logo" :alt="seller.store_name" class="w-full h-full object-cover" />
                            <div v-else class="w-full h-full flex items-center justify-center">
                                <Icon name="mdi:store" size="20" class="text-gray-400 dark:text-neutral-400" />
                            </div>
                        </div>
                        <div class="pb-0.5 min-w-0">
                            <h3 class="text-[13px] font-bold text-gray-900 dark:text-neutral-100 truncate leading-tight">
                                {{ seller.store_name || 'Unnamed Store' }}
                            </h3>
                            <div class="flex items-center gap-1 mt-0.5">
                                <p class="text-[11px] text-gray-400 dark:text-neutral-500 truncate">@{{ seller.store_slug }}</p>
                                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gray-200 dark:bg-neutral-700 text-gray-500 dark:text-neutral-400">
                                    {{ seller.default_currency ?? 'NGN' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Stats -->
                    <div class="flex items-center gap-3 text-[11px] text-gray-400 dark:text-neutral-500 mb-2.5">
                        <span><strong class="text-gray-700 dark:text-neutral-300">{{ seller.followers_count }}</strong> Followers</span>
                    </div>

                    <!-- Actions -->
                    <div class="flex gap-2">
                        <NuxtLink
                            :to="`/sellers/profile/${seller.store_slug}`"
                            class="flex-1 py-1.5 text-center text-[12px] font-semibold text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-600 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                        >
                            View
                        </NuxtLink>
                        <NuxtLink
                            :to="`/seller/${seller.store_slug}/dashboard`"
                            class="flex-1 py-1.5 text-center text-[12px] font-semibold text-white bg-gradient-to-r from-[#f02c56] to-purple-600 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Manage
                        </NuxtLink>
                    </div>
                </div>
            </div>

            <!-- Create new store card (if under limit) -->
            <NuxtLink
                v-if="sellers.length < MAX_STORES"
                to="/sellers/create"
                class="flex flex-col items-center justify-center gap-2 h-full min-h-[140px] bg-gray-50 dark:bg-neutral-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-neutral-700 hover:border-brand dark:hover:border-brand transition-colors group"
            >
                <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-700 flex items-center justify-center group-hover:bg-brand/10 transition-colors">
                    <Icon name="mdi:plus" size="22" class="text-gray-400 dark:text-neutral-500 group-hover:text-brand transition-colors" />
                </div>
                <p class="text-[12px] font-semibold text-gray-400 dark:text-neutral-500 group-hover:text-brand transition-colors">Create Store</p>
                <p class="text-[10px] text-gray-300 dark:text-neutral-600">{{ sellers.length }}/{{ MAX_STORES }} stores</p>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useSellerManagement } from '~~/layers/seller/app/composables/useSellerManagement'

const MAX_STORES = 5

const { sellers, isLoading, loadUserSellers } = useSellerManagement()

onMounted(async () => {
    if (!sellers.value.length) {
        await loadUserSellers()
    }
})
</script>
