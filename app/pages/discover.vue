<template>
    <HomeLayout :narrow-feed="false" :hide-right-sidebar="true">
        <div class="w-full pb-20 md:pb-0 relative">

            <!-- ─── HEADER & SEARCH (Sticky for better UX) ───────────────────── -->
            <div class="sticky top-0 z-20 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-neutral-900 pt-4 pb-4 px-4 sm:px-0 -mx-4 sm:mx-0 mb-6 shadow-sm shadow-gray-100/50 dark:shadow-none transition-all duration-300">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <!-- Title -->
                    <div>
                        <h1 class="text-2xl font-extrabold text-gray-900 dark:text-neutral-100 tracking-tight">Discover</h1>
                        <p v-if="total > 0" class="text-[13px] font-medium text-gray-500 dark:text-neutral-400 mt-1">
                            Explore <span class="text-brand">{{ total.toLocaleString() }}</span> products
                        </p>
                    </div>

                    <!-- Search bar -->
                    <div class="relative w-full sm:max-w-md">
                        <Icon name="mdi:magnify" size="20" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
                        <input
                            v-model="searchInput"
                            type="text"
                            placeholder="Search for fashion, tech, thrift..."
                            class="w-full pl-10 pr-10 py-2.5 bg-gray-100/80 dark:bg-neutral-900/80 rounded-full text-[14px] text-gray-900 dark:text-neutral-100 placeholder-gray-500 dark:placeholder-neutral-500 border border-transparent focus:border-brand/30 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none focus:ring-4 focus:ring-brand/10 transition-all duration-300"
                        />
                        <!-- Clear Search Button -->
                        <button 
                            v-if="searchInput" 
                            @click="searchInput = ''" 
                            class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-gray-200 dark:bg-neutral-700 rounded-full p-0.5"
                        >
                            <Icon name="mdi:close" size="14" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- ─── SKELETON LOADER ─────────────────────────────────────────── -->
            <div v-if="isLoading && !products.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 px-4 sm:px-0">
                <div v-for="i in 10" :key="i" class="animate-pulse bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 p-2">
                    <div class="aspect-[4/5] rounded-xl bg-gray-100 dark:bg-neutral-800 mb-3" />
                    <div class="px-2 space-y-2">
                        <div class="h-3.5 bg-gray-100 dark:bg-neutral-800 rounded-md w-3/4" />
                        <div class="h-3 bg-gray-100 dark:bg-neutral-800 rounded-md w-1/2" />
                        <div class="h-4 bg-gray-200 dark:bg-neutral-700 rounded-md w-1/3 mt-4" />
                    </div>
                </div>
            </div>

            <!-- ─── ERROR STATE ─────────────────────────────────────────────── -->
            <div v-else-if="error && !products.length" class="flex flex-col items-center justify-center py-32 px-4 text-center">
                <div class="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                    <Icon name="mdi:wifi-off" size="32" class="text-red-500 dark:text-red-400" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-1">Connection Error</h3>
                <p class="text-sm text-gray-500 dark:text-neutral-400 mb-6 max-w-sm">{{ $t('feed.loadError') || 'We couldn\'t load the products. Please check your internet connection.' }}</p>
                <button @click="load(true)" class="px-6 py-2.5 bg-brand text-white text-sm font-semibold rounded-full hover:bg-[#d81b36] hover:shadow-lg hover:shadow-brand/20 transition-all active:scale-95">
                    {{ $t('common.tryAgain') || 'Try Again' }}
                </button>
            </div>

            <!-- ─── EMPTY SEARCH RESULTS ────────────────────────────────────── -->
            <div v-else-if="!isLoading && !products.length && searchInput" class="flex flex-col items-center justify-center py-32 px-4 text-center">
                <div class="w-20 h-20 bg-gray-50 dark:bg-neutral-900 rounded-full flex items-center justify-center mb-5">
                    <Icon name="mdi:text-search" size="40" class="text-gray-400 dark:text-neutral-600" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-1">No products found</h3>
                <p class="text-[15px] text-gray-500 dark:text-neutral-400 mb-6">We couldn't find anything matching "<span class="font-medium text-gray-900 dark:text-white">{{ searchInput }}</span>"</p>
                <button @click="searchInput = ''" class="text-sm font-semibold px-5 py-2 rounded-full border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                    Clear search
                </button>
            </div>

            <!-- ─── PRODUCT GRID ────────────────────────────────────────────── -->
            <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 px-4 sm:px-0">
                <ProductCardMini
                    v-for="product in products"
                    :key="product.id"
                    :product="product"
                    @open-detail="openDetail"
                    @quick-add="quickAdd"
                />
            </div>

            <!-- ─── INFINITE SCROLL TRIGGER ─────────────────────────────────── -->
            <div ref="trigger" class="h-10 mt-8" />

            <!-- ─── LOADING MORE INDICATOR ──────────────────────────────────── -->
            <div v-if="isLoading && products.length > 0" class="flex flex-col items-center justify-center gap-3 py-10">
                <Icon name="eos-icons:loading" size="28" class="text-brand animate-spin" />
                <span class="text-xs font-medium text-gray-400 dark:text-neutral-500 uppercase tracking-widest">{{ $t('common.loadingMore') || 'Loading more...' }}</span>
            </div>
        </div>

        <!-- ─── MODALS & SIDEBARS ───────────────────────────────────────── -->
        <ProductDetailModal
            :product="selectedProduct"
            @close="selectedProduct = null"
        />

        <ProductMarketModal
            :is-open="!!marketProduct"
            :product="marketProduct"
            @close="marketProduct = null"
        />

        <CartSidebar :is-open="showCart" @close="showCart = false" />
    </HomeLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { IProduct } from '~~/layers/commerce/app/types/commerce.types'
import HomeLayout from '~/layouts/HomeLayout.vue'
import CartSidebar from '~/components/shop/CartSidebar.vue'
import ProductCardMini from '~/components/shop/ProductCardMini.vue'
import ProductDetailModal from '~/components/modals/ProductDetailModal.vue'
import ProductMarketModal from '~/components/modals/ProductMarketModal.vue'
import { notify } from '@kyvg/vue3-notification'

const { setDiscoverPage } = useSeo()
setDiscoverPage()

const { fetchProducts, isLoading } = useProduct()
const { addToCart } = useCart()

const products = ref<IProduct[]>([])
const total = ref(0)
const offset = ref(0)
const error = ref(false)
const searchInput = ref('')
const selectedProduct = ref<IProduct | null>(null)
const marketProduct = ref<IProduct | null>(null)
const showCart = ref(false)
const trigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const LIMIT = 24
const hasMore = computed(() => products.value.length < total.value)

const load = async (reset = false) => {
    if (reset) { 
        products.value = []
        offset.value = 0
        error.value = false 
    }
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
    // Note: The ShopProductCard already checks if it should open details vs adding directly.
    // If this event is emitted, it means the card successfully initiated a cart addition,
    // so we just need to show the cart sidebar and notify.
    notify({ type: 'success', text: `${product.title} added to cart` })
    showCart.value = true
}

onMounted(() => {
    load()
    observer = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasMore.value && !isLoading.value) {
            load()
        }
    }, { rootMargin: '400px' }) // Increased rootMargin to load earlier for a smoother infinite scroll
    
    if (trigger.value) observer.observe(trigger.value)
})

onUnmounted(() => {
    observer?.disconnect()
    if (searchTimer) clearTimeout(searchTimer)
})
</script>