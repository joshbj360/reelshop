<template>
    <HomeLayout :narrow-feed="false" :hide-right-sidebar="true">
        <div class="w-full pb-20 md:pb-0">

            <!-- Page header -->
            <div class="mb-5">
                <h1 class="text-[22px] font-bold text-gray-900 dark:text-neutral-100 leading-tight">Discover</h1>
                <p v-if="total > 0" class="text-[13px] text-gray-400 dark:text-neutral-500 mt-0.5">{{ total.toLocaleString() }} products</p>
            </div>

            <!-- Search bar -->
            <div class="relative mb-5">
                <Icon name="mdi:magnify" size="18" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
                <input
                    v-model="searchInput"
                    type="text"
                    placeholder="Search products…"
                    class="w-full pl-9 pr-4 py-2.5 bg-gray-100 dark:bg-neutral-800 rounded-xl text-[14px] text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand/40 transition-shadow"
                />
                <button v-if="searchInput" @click="searchInput = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300">
                    <Icon name="mdi:close" size="16" />
                </button>
            </div>

            <!-- Skeleton -->
            <div v-if="isLoading && !products.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                <div v-for="i in 10" :key="i" class="animate-pulse">
                    <div class="aspect-square rounded-2xl bg-gray-100 dark:bg-neutral-800 mb-2" />
                    <div class="h-3 bg-gray-100 dark:bg-neutral-800 rounded w-3/4 mb-1.5" />
                    <div class="h-3 bg-gray-100 dark:bg-neutral-800 rounded w-1/2" />
                </div>
            </div>

            <!-- Error state -->
            <div v-else-if="error && !products.length" class="flex flex-col items-center justify-center py-24 gap-4">
                <Icon name="mdi:wifi-off" size="48" class="text-gray-300 dark:text-neutral-600" />
                <p class="text-sm font-medium text-gray-500 dark:text-neutral-400">{{ $t('feed.loadError') }}</p>
                <button @click="load(true)" class="px-5 py-2 bg-brand text-white text-sm font-semibold rounded-full hover:bg-[#d81b36] transition-colors">
                    {{ $t('common.tryAgain') }}
                </button>
            </div>

            <!-- Empty search result -->
            <div v-else-if="!isLoading && !products.length && searchInput" class="flex flex-col items-center justify-center py-24 gap-3">
                <Icon name="mdi:text-search" size="48" class="text-gray-300 dark:text-neutral-600" />
                <p class="text-[15px] font-semibold text-gray-600 dark:text-neutral-400">No results for "{{ searchInput }}"</p>
                <button @click="searchInput = ''" class="text-sm font-semibold text-brand hover:text-[#d81b36] transition-colors">Clear search</button>
            </div>

            <!-- Product grid -->
            <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                <ShopProductCard
                    v-for="product in products"
                    :key="product.id"
                    :product="product"
                    @open-detail="openDetail"
                    @quick-add="quickAdd"
                />
            </div>

            <!-- Infinite scroll trigger -->
            <div ref="trigger" class="h-10 mt-4" />

            <!-- Loading more -->
            <div v-if="isLoading && products.length > 0" class="flex items-center justify-center gap-2 py-6">
                <Icon name="eos-icons:loading" size="20" class="text-brand" />
                <span class="text-xs text-gray-400 dark:text-neutral-500">{{ $t('common.loadingMore') }}</span>
            </div>
        </div>

        <!-- Product detail modal -->
        <ProductDetailModal
            :product="selectedProduct"
            @close="selectedProduct = null"
        />

        <!-- Cart sidebar -->
        <CartSidebar :is-open="showCart" @close="showCart = false" />
    </HomeLayout>
</template>

<script setup lang="ts">
import type { IProduct } from '~~/layers/commerce/types/commerce.types'
import HomeLayout from '~/layouts/HomeLayout.vue'
import ShopProductCard from '~/components/shop/ShopProductCard.vue'
import CartSidebar from '~/components/shop/CartSidebar.vue'
import ProductDetailModal from '~/components/modals/ProductDetailModal.vue'
import { notify } from '@kyvg/vue3-notification'

const { fetchProducts, isLoading } = useProduct()
const { addToCart } = useCart()

const products = ref<IProduct[]>([])
const total = ref(0)
const offset = ref(0)
const error = ref(false)
const searchInput = ref('')
const selectedProduct = ref<IProduct | null>(null)
const showCart = ref(false)
const trigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const LIMIT = 24
const hasMore = computed(() => products.value.length < total.value)

const load = async (reset = false) => {
    if (reset) { products.value = []; offset.value = 0; error.value = false }
    if (isLoading.value) return
    try {
        const result = await fetchProducts({
            status: 'PUBLISHED',
            search: searchInput.value.trim() || undefined,
            limit: LIMIT,
            offset: offset.value,
        })
        const incoming = result?.products ?? []
        products.value.push(...incoming)
        total.value = result?.total ?? 0
        offset.value += incoming.length
    } catch {
        error.value = true
    }
}

// Debounced search
let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(searchInput, () => {
    if (searchTimer) clearTimeout(searchTimer)
    searchTimer = setTimeout(() => load(true), 400)
})

const openDetail = (product: IProduct) => {
    selectedProduct.value = product
}

const quickAdd = async (product: IProduct) => {
    const variant = product.variants?.[0]
    if (!variant) { openDetail(product); return }
    try {
        await addToCart(variant.id, 1)
        notify({ type: 'success', text: `${product.title} added to cart` })
        showCart.value = true
    } catch (e: any) {
        notify({ type: 'error', text: e.message || 'Failed to add to cart' })
    }
}

onMounted(() => {
    load()
    observer = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasMore.value && !isLoading.value) {
            load()
        }
    }, { rootMargin: '200px' })
    if (trigger.value) observer.observe(trigger.value)
})

onUnmounted(() => {
    observer?.disconnect()
    if (searchTimer) clearTimeout(searchTimer)
})
</script>
