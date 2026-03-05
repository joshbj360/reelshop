<template>
    <div class="px-3 py-4 sm:px-6 sm:py-6 max-w-5xl">

        <!-- Loading skeleton -->
        <div v-if="isPageLoading" class="animate-pulse space-y-6">
            <div class="h-8 bg-gray-200 dark:bg-neutral-800 rounded w-1/3" />
            <div class="grid grid-cols-3 gap-4">
                <div v-for="i in 3" :key="i" class="h-24 bg-gray-200 dark:bg-neutral-800 rounded-xl" />
            </div>
            <div class="h-64 bg-gray-200 dark:bg-neutral-800 rounded-xl" />
        </div>

        <template v-else>
            <!-- Header -->
            <div class="flex items-start justify-between mb-6">
                <div>
                    <div class="flex items-center gap-2 mb-1 flex-wrap">
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-neutral-100">
                            {{ seller?.store_name ?? storeSlug }}
                        </h1>
                        <span
                            v-if="seller?.is_verified"
                            class="flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white"
                        >
                            <Icon name="mdi:check-circle" size="11" /> Verified
                        </span>
                        <span
                            class="text-[11px] font-bold px-2 py-0.5 rounded-full"
                            :class="seller?.is_active ? 'bg-emerald-500 text-white' : 'bg-gray-400 text-white'"
                        >
                            {{ seller?.is_active ? 'Active' : 'Inactive' }}
                        </span>
                    </div>
                    <p class="text-[13px] text-gray-400 dark:text-neutral-500">@{{ storeSlug }}</p>
                </div>

                <div class="flex gap-2 shrink-0">
                    <NuxtLink
                        :to="`/sellers/profile/${storeSlug}`"
                        target="_blank"
                        class="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-700 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                        <Icon name="mdi:open-in-new" size="16" />
                        <span class="hidden sm:inline">View Profile</span>
                    </NuxtLink>
                    <NuxtLink
                        :to="`/seller/${storeSlug}/products/create`"
                        class="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#f02c56] to-purple-600 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        <Icon name="mdi:plus" size="16" />
                        <span class="hidden sm:inline">Add Product</span>
                    </NuxtLink>
                </div>
            </div>

            <!-- Stats row -->
            <div class="grid grid-cols-3 gap-4 mb-6">
                <div class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-4 text-center">
                    <p class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-neutral-100">{{ productCount }}</p>
                    <p class="text-[12px] text-gray-500 dark:text-neutral-400 mt-0.5">Products</p>
                </div>
                <div class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-4 text-center">
                    <p class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-neutral-100">{{ seller?.followers_count ?? 0 }}</p>
                    <p class="text-[12px] text-gray-500 dark:text-neutral-400 mt-0.5">Followers</p>
                </div>
                <div class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-4 text-center">
                    <p class="text-xl sm:text-2xl font-bold text-gray-500 dark:text-neutral-500">0</p>
                    <p class="text-[12px] text-gray-500 dark:text-neutral-400 mt-0.5">Orders</p>
                </div>
            </div>

            <!-- Recent Products -->
            <div class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-5">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="font-semibold text-gray-900 dark:text-neutral-100">Recent Products</h2>
                    <NuxtLink
                        :to="`/seller/${storeSlug}/products`"
                        class="text-[13px] text-brand hover:underline font-medium"
                    >
                        View all
                    </NuxtLink>
                </div>

                <!-- Loading -->
                <div v-if="productsLoading" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div v-for="i in 4" :key="i" class="aspect-square bg-gray-100 dark:bg-neutral-800 rounded-xl animate-pulse" />
                </div>

                <!-- Empty -->
                <div v-else-if="!recentProducts.length" class="text-center py-10">
                    <Icon name="mdi:package-variant-closed-remove" size="40" class="text-gray-300 dark:text-neutral-600 mb-2" />
                    <p class="text-[13px] text-gray-500 dark:text-neutral-400">No products yet</p>
                    <NuxtLink
                        :to="`/seller/${storeSlug}/products/create`"
                        class="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand hover:underline"
                    >
                        <Icon name="mdi:plus" size="14" /> Add your first product
                    </NuxtLink>
                </div>

                <!-- Grid -->
                <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <NuxtLink
                        v-for="product in recentProducts"
                        :key="product.id"
                        :to="`/seller/${storeSlug}/products/${product.id}/edit`"
                        class="group rounded-xl overflow-hidden border border-gray-100 dark:border-neutral-700 hover:shadow-md transition-shadow"
                    >
                        <div class="aspect-square bg-gray-100 dark:bg-neutral-800 relative">
                            <img
                                v-if="product.media?.[0]?.url"
                                :src="product.media[0].url"
                                :alt="product.title"
                                class="w-full h-full object-cover"
                            />
                            <div v-else class="w-full h-full flex items-center justify-center">
                                <Icon name="mdi:image-off-outline" size="28" class="text-gray-300 dark:text-neutral-600" />
                            </div>
                            <span
                                :class="[
                                    'absolute top-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                    product.status === 'PUBLISHED' ? 'bg-emerald-500 text-white' :
                                    product.status === 'DRAFT' ? 'bg-yellow-500 text-white' :
                                    'bg-gray-400 text-white'
                                ]"
                            >{{ product.status }}</span>
                        </div>
                        <div class="p-2">
                            <p class="text-[12px] font-semibold text-gray-900 dark:text-neutral-100 truncate">{{ product.title }}</p>
                            <p class="text-[11px] text-brand font-bold">₦{{ Number(product.price).toLocaleString() }}</p>
                        </div>
                    </NuxtLink>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { useSellerManagement } from '~~/layers/seller/app/composables/useSellerManagement';
import { useProduct } from '~~/layers/commerce/app/composables/useProduct';

definePageMeta({ middleware: 'auth', layout: 'seller' });

const route = useRoute();
const storeSlug = computed(() => route.params.storeSlug as string);

const { loadPublicSeller, currentSeller: seller } = useSellerManagement();
const { fetchSellerProducts } = useProduct();

const isPageLoading = ref(true);
const productsLoading = ref(false);
const recentProducts = ref<any[]>([]);
const productCount = ref(0);

const loadData = async (slug: string) => {
    try {
        await loadPublicSeller(slug);
    } catch {}
    productsLoading.value = true;
    try {
        const res: any = await fetchSellerProducts(slug, { limit: 4 });
        recentProducts.value = res?.products ?? [];
        productCount.value = res?.meta?.total ?? 0;
    } catch {
        recentProducts.value = [];
    } finally {
        productsLoading.value = false;
    }
};

onMounted(async () => {
    await loadData(storeSlug.value);
    isPageLoading.value = false;
});

watch(storeSlug, (slug) => {
    isPageLoading.value = true;
    loadData(slug).finally(() => { isPageLoading.value = false; });
});
</script>
