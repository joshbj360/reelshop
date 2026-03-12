<template>
    <HomeLayout :narrow-feed="false" :hide-right-sidebar="false">

        <!-- Loading skeleton -->
        <div v-if="pageLoading" class="animate-pulse space-y-4 pb-20 md:pb-0">
            <div class="h-44 bg-gray-100 dark:bg-neutral-800 rounded-2xl" />
            <div class="flex gap-3 px-4">
                <div class="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-neutral-800 -mt-10 shrink-0" />
                <div class="flex-1 space-y-2 pt-2">
                    <div class="h-5 bg-gray-100 dark:bg-neutral-800 rounded w-1/3" />
                    <div class="h-3 bg-gray-100 dark:bg-neutral-800 rounded w-1/4" />
                </div>
            </div>
        </div>

        <!-- Error -->
        <div v-else-if="loadError" class="flex flex-col items-center justify-center py-24 gap-4 pb-20 md:pb-0">
            <Icon name="mdi:store-off-outline" size="48" class="text-gray-300 dark:text-neutral-600" />
            <p class="text-[15px] font-semibold text-gray-600 dark:text-neutral-400">Store not found</p>
            <NuxtLink to="/" class="text-[13px] font-semibold text-brand hover:text-[#d81b36] transition-colors">Go home →</NuxtLink>
        </div>

        <div v-else-if="seller" class="pb-20 md:pb-6">

            <!-- Banner -->
            <div
                class="h-44 sm:h-52 rounded-2xl bg-gradient-to-br from-[#f02c56] to-purple-600 mb-0 overflow-hidden"
                :style="seller.store_banner ? { backgroundImage: `url(${seller.store_banner})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}"
            />

            <!-- Profile row -->
            <div class="flex items-end gap-4 px-1 -mt-10 mb-4">
                <!-- Logo -->
                <div class="w-20 h-20 rounded-2xl border-4 border-white dark:border-neutral-950 bg-white dark:bg-neutral-900 overflow-hidden shadow-md shrink-0">
                    <img v-if="seller.store_logo" :src="seller.store_logo" :alt="seller.store_name" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f02c56] to-purple-600">
                        <Icon name="mdi:store" size="32" class="text-white" />
                    </div>
                </div>

                <!-- Follow button (push right) -->
                <div class="flex-1" />
                <button
                    v-if="profileStore.isLoggedIn"
                    @click="toggleFollow"
                    :disabled="followLoading"
                    class="mb-2 px-5 py-2 text-[13px] font-bold rounded-xl transition-all active:scale-[0.97]"
                    :class="isFollowing
                        ? 'border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800'
                        : 'bg-gradient-to-r from-[#f02c56] to-purple-600 text-white hover:opacity-90'"
                >
                    <span v-if="followLoading"><Icon name="eos-icons:loading" size="14" class="animate-spin" /></span>
                    <span v-else>{{ isFollowing ? 'Following' : 'Follow' }}</span>
                </button>
            </div>

            <!-- Store info -->
            <div class="px-1 mb-4">
                <div class="flex items-center gap-2 flex-wrap">
                    <h1 class="text-[20px] font-bold text-gray-900 dark:text-neutral-100">{{ seller.store_name }}</h1>
                    <span v-if="seller.is_verified" class="flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300">
                        <Icon name="mdi:check-decagram" size="12" />
                        Verified
                    </span>
                    <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400">
                        {{ (seller as any).default_currency ?? 'NGN' }}
                    </span>
                </div>
                <p class="text-[13px] text-gray-400 dark:text-neutral-500 mt-0.5">@{{ seller.store_slug }}</p>

                <p v-if="seller.store_description" class="text-[13px] text-gray-600 dark:text-neutral-400 mt-2 leading-relaxed">
                    {{ seller.store_description }}
                </p>

                <!-- Meta pills -->
                <div class="flex flex-wrap gap-2 mt-3">
                    <span v-if="seller.store_location" class="flex items-center gap-1 text-[12px] text-gray-500 dark:text-neutral-400">
                        <Icon name="mdi:map-marker-outline" size="14" />
                        {{ seller.store_location }}
                    </span>
                    <a
                        v-if="seller.store_website"
                        :href="seller.store_website"
                        target="_blank"
                        rel="noopener"
                        class="flex items-center gap-1 text-[12px] text-brand hover:text-[#d81b36] transition-colors"
                    >
                        <Icon name="mdi:web" size="14" />
                        Website
                    </a>
                </div>

                <!-- Stats row -->
                <div class="flex items-center gap-4 mt-3 text-[13px] text-gray-500 dark:text-neutral-400">
                    <span><strong class="text-gray-900 dark:text-neutral-100">{{ total }}</strong> Products</span>
                    <span>·</span>
                    <span><strong class="text-gray-900 dark:text-neutral-100">{{ seller.followers_count }}</strong> Followers</span>
                </div>
            </div>

            <!-- Products skeleton -->
            <div v-if="productsLoading && !products.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                <div v-for="i in 8" :key="i" class="animate-pulse">
                    <div class="aspect-square rounded-2xl bg-gray-100 dark:bg-neutral-800 mb-2" />
                    <div class="h-3 bg-gray-100 dark:bg-neutral-800 rounded w-3/4 mb-1.5" />
                    <div class="h-3 bg-gray-100 dark:bg-neutral-800 rounded w-1/2" />
                </div>
            </div>

            <!-- Empty products -->
            <div v-else-if="!productsLoading && !products.length" class="flex flex-col items-center justify-center py-16 gap-3">
                <Icon name="mdi:hanger" size="48" class="text-gray-300 dark:text-neutral-600" />
                <p class="text-[14px] font-semibold text-gray-500 dark:text-neutral-400">No products listed yet</p>
            </div>

            <!-- Product grid -->
            <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                <ShopProductCard
                    v-for="product in products"
                    :key="product.id"
                    :product="product"
                    @open-detail="selectedProduct = product"
                    @quick-add="quickAdd"
                    @market="marketProduct = $event"
                />
            </div>

            <!-- Infinite scroll sentinel -->
            <div ref="trigger" class="h-10 mt-4" />

            <!-- Loading more -->
            <div v-if="productsLoading && products.length > 0" class="flex items-center justify-center gap-2 py-6">
                <Icon name="eos-icons:loading" size="20" class="text-brand" />
                <span class="text-xs text-gray-400 dark:text-neutral-500">Loading more…</span>
            </div>
        </div>

        <!-- Product detail modal -->
        <ProductDetailModal :product="selectedProduct" @close="selectedProduct = null" />

        <!-- Affiliate market modal -->
        <ProductMarketModal
            :is-open="!!marketProduct"
            :product="marketProduct"
            @close="marketProduct = null"
        />

    </HomeLayout>
</template>

<script setup lang="ts">
import HomeLayout from '~/layouts/HomeLayout.vue'
import ShopProductCard from '~/components/shop/ShopProductCard.vue'
import ProductDetailModal from '~/components/modals/ProductDetailModal.vue'
import ProductMarketModal from '~/components/modals/ProductMarketModal.vue'
import { useSellerManagement } from '~~/layers/seller/app/composables/useSellerManagement'
import { useProduct } from '~~/layers/commerce/app/composables/useProduct'
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store'
import type { IProduct } from '~~/layers/commerce/types/commerce.types'
import { notify } from '@kyvg/vue3-notification'
import { useCart } from '~~/layers/commerce/app/composables/useCart'

const route = useRoute()
const storeSlug = route.params.storeSlug as string

const { loadPublicSeller, currentSeller, followSeller, unfollowSeller } = useSellerManagement()
const { fetchSellerProducts, isLoading: productsLoading } = useProduct()
const profileStore = useProfileStore()
const { addToCart } = useCart()

const seller = computed(() => currentSeller.value)
const pageLoading = ref(true)
const loadError = ref(false)

// Products
const products = ref<IProduct[]>([])
const total = ref(0)
const offset = ref(0)
const LIMIT = 24
const hasMore = computed(() => products.value.length < total.value)
const selectedProduct = ref<IProduct | null>(null)
const marketProduct = ref<IProduct | null>(null)

// Follow state
const isFollowing = ref(false)
const followLoading = ref(false)

// Infinite scroll
const trigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const loadProducts = async (reset = false) => {
    if (reset) { products.value = []; offset.value = 0 }
    if (productsLoading.value) return
    try {
        const result = await fetchSellerProducts(storeSlug, {
            status: 'PUBLISHED',
            limit: LIMIT,
            offset: offset.value,
        }) as any
        const incoming = result?.products ?? result?.data ?? []
        products.value.push(...incoming)
        total.value = result?.total ?? result?.meta?.total ?? 0
        offset.value += incoming.length
    } catch {
        // silent
    }
}

onMounted(async () => {
    try {
        await loadPublicSeller(storeSlug)
    } catch {
        loadError.value = true
    } finally {
        pageLoading.value = false
    }

    if (!loadError.value) {
        await loadProducts()
        observer = new IntersectionObserver((entries) => {
            if (entries[0]?.isIntersecting && hasMore.value && !productsLoading.value) {
                loadProducts()
            }
        }, { rootMargin: '200px' })
        if (trigger.value) observer.observe(trigger.value)
    }
})

onUnmounted(() => { observer?.disconnect() })

const toggleFollow = async () => {
    if (followLoading.value) return
    followLoading.value = true
    try {
        if (isFollowing.value) {
            await unfollowSeller(storeSlug)
            isFollowing.value = false
            if (currentSeller.value) (currentSeller.value as any).followers_count = Math.max(0, ((currentSeller.value as any).followers_count ?? 0) - 1)
        } else {
            await followSeller(storeSlug)
            isFollowing.value = true
            if (currentSeller.value) (currentSeller.value as any).followers_count = ((currentSeller.value as any).followers_count ?? 0) + 1
        }
    } catch (e: any) {
        notify({ type: 'error', text: e.message || 'Failed to update follow status' })
    } finally {
        followLoading.value = false
    }
}

const quickAdd = async (product: IProduct) => {
    const variant = product.variants?.[0]
    if (!variant) { selectedProduct.value = product; return }
    try {
        await addToCart(variant.id, 1)
        notify({ type: 'success', text: `${product.title} added to cart` })
    } catch { /* useCart handles error notification */ }
}
</script>
