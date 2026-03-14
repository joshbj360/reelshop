<template>
    <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-neutral-100">My Stores</h1>
                <p class="text-[13px] text-gray-400 dark:text-neutral-500 mt-0.5">Manage and monitor your seller profiles</p>
            </div>
            <NuxtLink
                to="/sellers/create"
                class="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#f02c56] to-purple-600 text-white text-[13px] font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
            >
                <Icon name="mdi:plus" size="16" />
                Create Store
            </NuxtLink>
        </div>

        <!-- Error / Message -->
        <div v-if="message" class="mb-4 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[13px] text-emerald-700 dark:text-emerald-300 font-medium">
            {{ message }}
        </div>
        <div v-if="error" class="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-[13px] text-red-600 dark:text-red-400 font-medium">
            {{ error }}
        </div>

        <!-- Loading skeleton -->
        <div v-if="isLoading && !hasSellers" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="i in 3" :key="i" class="animate-pulse bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-neutral-800">
                <div class="h-28 bg-gray-100 dark:bg-neutral-800" />
                <div class="p-4 space-y-3">
                    <div class="h-4 bg-gray-100 dark:bg-neutral-800 rounded w-2/3" />
                    <div class="h-3 bg-gray-100 dark:bg-neutral-800 rounded w-1/2" />
                    <div class="h-8 bg-gray-100 dark:bg-neutral-800 rounded-xl" />
                </div>
            </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="!isLoading && !hasSellers" class="flex flex-col items-center justify-center py-24 gap-4">
            <div class="w-20 h-20 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
                <Icon name="mdi:store-outline" size="40" class="text-gray-300 dark:text-neutral-600" />
            </div>
            <div class="text-center">
                <p class="text-[17px] font-bold text-gray-700 dark:text-neutral-300">No stores yet</p>
                <p class="text-[13px] text-gray-400 dark:text-neutral-500 mt-1">Create your first seller profile to start selling</p>
            </div>
            <NuxtLink
                to="/sellers/create"
                class="px-6 py-2.5 bg-gradient-to-r from-[#f02c56] to-purple-600 text-white text-[13px] font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
                Create Your First Store
            </NuxtLink>
        </div>

        <!-- Store cards grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
                v-for="seller in sellers"
                :key="seller.id"
                class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                @click="router.push(`/seller/${seller.store_slug}/dashboard`)"
            >
                <!-- Banner -->
                <div
                    class="h-28 bg-gradient-to-r from-[#f02c56] to-purple-600 relative"
                    :style="seller.store_banner ? { backgroundImage: `url(${seller.store_banner})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}"
                >
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
                <div class="px-4 pt-0 pb-4">
                    <div class="flex items-end gap-3 -mt-7 mb-3">
                        <div class="w-14 h-14 rounded-xl border-2 border-white dark:border-neutral-900 overflow-hidden bg-white dark:bg-neutral-800 shrink-0 shadow-sm">
                            <img v-if="seller.store_logo" :src="seller.store_logo" :alt="seller.store_name" class="w-full h-full object-cover" />
                            <div v-else class="w-full h-full flex items-center justify-center">
                                <Icon name="mdi:store" size="24" class="text-gray-400 dark:text-neutral-500" />
                            </div>
                        </div>
                        <div class="pb-1 min-w-0">
                            <h3 class="text-[14px] font-bold text-gray-900 dark:text-neutral-100 truncate leading-tight">
                                {{ seller.store_name || 'Unnamed Store' }}
                            </h3>
                            <div class="flex items-center gap-1.5 mt-0.5">
                                <p class="text-[12px] text-gray-400 dark:text-neutral-500 truncate">@{{ seller.store_slug }}</p>
                                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400">
                                    {{ (seller as any).default_currency ?? 'NGN' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Stats -->
                    <div class="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-100 dark:border-neutral-800 mb-3">
                        <div class="text-center">
                            <p class="text-[18px] font-bold text-gray-900 dark:text-neutral-100">{{ productCounts[seller.store_slug] ?? '–' }}</p>
                            <p class="text-[10px] text-gray-400 dark:text-neutral-500">Products</p>
                        </div>
                        <div class="text-center">
                            <p class="text-[18px] font-bold text-gray-900 dark:text-neutral-100">{{ seller.followers_count }}</p>
                            <p class="text-[10px] text-gray-400 dark:text-neutral-500">Followers</p>
                        </div>
                        <div class="text-center">
                            <p class="text-[18px] font-bold text-gray-900 dark:text-neutral-100">0</p>
                            <p class="text-[10px] text-gray-400 dark:text-neutral-500">Orders</p>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex flex-wrap gap-2" @click.stop>
                        <NuxtLink
                            :to="`/seller/${seller.store_slug}/dashboard`"
                            class="flex-1 py-2 text-center text-[12px] font-semibold text-white bg-gradient-to-r from-[#f02c56] to-purple-600 rounded-xl hover:opacity-90 transition-opacity"
                        >
                            Manage
                        </NuxtLink>
                        <NuxtLink
                            :to="`/sellers/profile/${seller.store_slug}`"
                            class="flex-1 py-2 text-center text-[12px] font-semibold text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-700 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                        >
                            View
                        </NuxtLink>
                        <button
                            @click="toggleStatus(seller)"
                            :disabled="isLoading"
                            class="flex-1 py-2 text-center text-[12px] font-semibold rounded-xl border transition-colors"
                            :class="seller.is_active
                                ? 'border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30'
                                : 'border-emerald-200 dark:border-emerald-900 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'"
                        >
                            {{ seller.is_active ? 'Deactivate' : 'Activate' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSellerManagement } from '~~/layers/seller/app/composables/useSellerManagement';
import { useProduct } from '~~/layers/commerce/app/composables/useProduct';

definePageMeta({ middleware: 'auth', layout: 'store-layout' });

const router = useRouter();
const { sellers, isLoading, error, message, hasSellers, loadUserSellers, activateSeller, deactivateSeller } = useSellerManagement();
const { fetchSellerProducts } = useProduct();

const productCounts = ref<Record<string, number>>({});

onMounted(async () => {
    await loadUserSellers();
    for (const seller of sellers.value) {
        try {
            const res = await fetchSellerProducts(seller.store_slug, { limit: 1 }) as any;
            productCounts.value[seller.store_slug] = res?.total ?? res?.meta?.total ?? 0;
        } catch {
            productCounts.value[seller.store_slug] = 0;
        }
    }
});

const toggleStatus = async (seller: any) => {
    if (seller.is_active) {
        await deactivateSeller(seller.id);
    } else {
        await activateSeller(seller.id);
    }
};
</script>
