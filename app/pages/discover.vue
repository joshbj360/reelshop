<template>
  <HomeLayout :narrow-feed="false" :hide-right-sidebar="true">
    <div class="relative w-full pb-20 md:pb-0">
      <!-- ─── HEADER & SEARCH (Sticky for better UX) ───────────────────── -->
      <div
        class="sticky top-0 z-20 -mx-4 mb-6 border-b border-gray-100 bg-white/80 px-4 pb-4 pt-4 shadow-sm shadow-gray-100/50 backdrop-blur-xl transition-all duration-300 sm:mx-0 sm:px-0 dark:border-neutral-900 dark:bg-neutral-950/80 dark:shadow-none"
      >
        <div
          class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
        >
          <!-- Title -->
          <div>
            <h1
              class="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-neutral-100"
            >
              Discover
            </h1>
            <p
              v-if="total > 0"
              class="mt-1 text-[13px] font-medium text-gray-500 dark:text-neutral-400"
            >
              Explore
              <span class="text-brand">{{ total.toLocaleString() }}</span>
              products
            </p>
          </div>

          <!-- Search bar -->
          <div class="relative w-full sm:max-w-md">
            <Icon
              name="mdi:magnify"
              size="20"
              class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500"
            />
            <input
              v-model="searchInput"
              type="text"
              placeholder="Search for fashion, tech, thrift..."
              class="w-full rounded-full border border-transparent bg-gray-100/80 py-2.5 pl-10 pr-10 text-[14px] text-gray-900 placeholder-gray-500 transition-all duration-300 focus:border-brand/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand/10 dark:bg-neutral-900/80 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:bg-neutral-900"
            />
            <!-- Clear Search Button -->
            <button
              v-if="searchInput"
              @click="searchInput = ''"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full bg-gray-200 p-0.5 text-gray-400 transition-colors hover:text-gray-900 dark:bg-neutral-700 dark:hover:text-white"
            >
              <Icon name="mdi:close" size="14" />
            </button>
          </div>
        </div>
      </div>

      <!-- ─── SKELETON LOADER ─────────────────────────────────────────── -->
      <div
        v-if="isLoading && !products.length"
        class="grid grid-cols-2 gap-4 px-4 sm:px-0 md:grid-cols-3 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5"
      >
        <div
          v-for="i in 10"
          :key="i"
          class="animate-pulse rounded-2xl border border-gray-100 bg-white p-2 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div
            class="mb-3 aspect-[4/5] rounded-xl bg-gray-100 dark:bg-neutral-800"
          />
          <div class="space-y-2 px-2">
            <div
              class="h-3.5 w-3/4 rounded-md bg-gray-100 dark:bg-neutral-800"
            />
            <div class="h-3 w-1/2 rounded-md bg-gray-100 dark:bg-neutral-800" />
            <div
              class="mt-4 h-4 w-1/3 rounded-md bg-gray-200 dark:bg-neutral-700"
            />
          </div>
        </div>
      </div>

      <!-- ─── ERROR STATE ─────────────────────────────────────────────── -->
      <div
        v-else-if="error && !products.length"
        class="flex flex-col items-center justify-center px-4 py-32 text-center"
      >
        <div
          class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20"
        >
          <Icon
            name="mdi:wifi-off"
            size="32"
            class="text-red-500 dark:text-red-400"
          />
        </div>
        <h3
          class="mb-1 text-lg font-semibold text-gray-900 dark:text-neutral-100"
        >
          Connection Error
        </h3>
        <p class="mb-6 max-w-sm text-sm text-gray-500 dark:text-neutral-400">
          {{
            $t('feed.loadError') ||
            "We couldn't load the products. Please check your internet connection."
          }}
        </p>
        <button
          @click="load(true)"
          class="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#d81b36] hover:shadow-lg hover:shadow-brand/20 active:scale-95"
        >
          {{ $t('common.tryAgain') || 'Try Again' }}
        </button>
      </div>

      <!-- ─── EMPTY SEARCH RESULTS ────────────────────────────────────── -->
      <div
        v-else-if="!isLoading && !products.length && searchInput"
        class="flex flex-col items-center justify-center px-4 py-32 text-center"
      >
        <div
          class="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-900"
        >
          <Icon
            name="mdi:text-search"
            size="40"
            class="text-gray-400 dark:text-neutral-600"
          />
        </div>
        <h3
          class="mb-1 text-lg font-semibold text-gray-900 dark:text-neutral-100"
        >
          No products found
        </h3>
        <p class="mb-6 text-[15px] text-gray-500 dark:text-neutral-400">
          We couldn't find anything matching "<span
            class="font-medium text-gray-900 dark:text-white"
            >{{ searchInput }}</span
          >"
        </p>
        <button
          @click="searchInput = ''"
          class="rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Clear search
        </button>
      </div>

      <!-- ─── PRODUCT GRID ────────────────────────────────────────────── -->
      <div
        v-else
        class="grid grid-cols-2 gap-4 px-4 sm:px-0 md:grid-cols-3 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5"
      >
        <ProductCardMini
          v-for="product in products"
          :key="product.id"
          :product="product"
          @open-detail="openDetail"
          @quick-add="quickAdd"
        />
      </div>

      <!-- ─── INFINITE SCROLL TRIGGER ─────────────────────────────────── -->
      <div ref="trigger" class="mt-8 h-10" />

      <!-- ─── LOADING MORE INDICATOR ──────────────────────────────────── -->
      <div
        v-if="isLoading && products.length > 0"
        class="flex flex-col items-center justify-center gap-3 py-10"
      >
        <Icon
          name="eos-icons:loading"
          size="28"
          class="animate-spin text-brand"
        />
        <span
          class="text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-neutral-500"
          >{{ $t('common.loadingMore') || 'Loading more...' }}</span
        >
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
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting && hasMore.value && !isLoading.value) {
        load()
      }
    },
    { rootMargin: '400px' },
  ) // Increased rootMargin to load earlier for a smoother infinite scroll

  if (trigger.value) observer.observe(trigger.value)
})

onUnmounted(() => {
  observer?.disconnect()
  if (searchTimer) clearTimeout(searchTimer)
})
</script>
