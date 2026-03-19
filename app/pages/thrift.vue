<template>
  <HomeLayout :narrow-feed="false" :hide-right-sidebar="true">
    <div class="w-full pb-20 md:pb-0">
      <!-- Page header -->
      <div class="mb-5">
        <div class="mb-1 flex items-center gap-2">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950"
          >
            <Icon
              name="mdi:tshirt-crew-outline"
              size="18"
              class="text-emerald-600 dark:text-emerald-400"
            />
          </div>
          <h1 class="text-[22px] font-bold text-gray-900 dark:text-neutral-100">
            Thrift Store
          </h1>
        </div>
        <p class="text-[13px] text-gray-400 dark:text-neutral-500">
          Pre-loved fashion at unbeatable prices
          <span v-if="total > 0"> · {{ total.toLocaleString() }} items</span>
        </p>
      </div>

      <!-- Search bar -->
      <div class="relative mb-5">
        <Icon
          name="mdi:magnify"
          size="18"
          class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500"
        />
        <input
          v-model="searchInput"
          type="text"
          placeholder="Search thrift items…"
          class="w-full rounded-xl bg-gray-100 py-2.5 pl-9 pr-4 text-[14px] text-gray-900 placeholder-gray-400 transition-shadow focus:outline-none focus:ring-2 focus:ring-emerald-400/40 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
        />
        <button
          v-if="searchInput"
          @click="searchInput = ''"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300"
        >
          <Icon name="mdi:close" size="16" />
        </button>
      </div>

      <!-- Skeleton -->
      <div
        v-if="isLoading && !products.length"
        class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5"
      >
        <div v-for="i in 10" :key="i" class="animate-pulse">
          <div
            class="mb-2 aspect-square rounded-2xl bg-gray-100 dark:bg-neutral-800"
          />
          <div
            class="mb-1.5 h-3 w-3/4 rounded bg-gray-100 dark:bg-neutral-800"
          />
          <div class="h-3 w-1/2 rounded bg-gray-100 dark:bg-neutral-800" />
        </div>
      </div>

      <!-- Error -->
      <div
        v-else-if="error && !products.length"
        class="flex flex-col items-center justify-center gap-4 py-24"
      >
        <Icon
          name="mdi:wifi-off"
          size="48"
          class="text-gray-300 dark:text-neutral-600"
        />
        <p class="text-sm font-medium text-gray-500 dark:text-neutral-400">
          {{ $t('feed.loadError') }}
        </p>
        <button
          @click="load(true)"
          class="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
        >
          {{ $t('common.tryAgain') }}
        </button>
      </div>

      <!-- Empty search -->
      <div
        v-else-if="!isLoading && !products.length && searchInput"
        class="flex flex-col items-center justify-center gap-3 py-24"
      >
        <Icon
          name="mdi:text-search"
          size="48"
          class="text-gray-300 dark:text-neutral-600"
        />
        <p
          class="text-[15px] font-semibold text-gray-600 dark:text-neutral-400"
        >
          No results for "{{ searchInput }}"
        </p>
        <button
          @click="searchInput = ''"
          class="text-sm font-semibold text-emerald-500 transition-colors hover:text-emerald-600"
        >
          Clear search
        </button>
      </div>

      <!-- Empty thrift store -->
      <div
        v-else-if="!isLoading && !products.length"
        class="flex flex-col items-center justify-center gap-4 py-24"
      >
        <Icon
          name="mdi:hanger"
          size="56"
          class="text-gray-300 dark:text-neutral-600"
        />
        <p
          class="text-[16px] font-semibold text-gray-600 dark:text-neutral-400"
        >
          No thrift items yet
        </p>
        <p class="text-[13px] text-gray-400 dark:text-neutral-500">
          Check back soon for pre-loved fashion
        </p>
      </div>

      <!-- Product grid -->
      <div
        v-else
        class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5"
      >
        <ProductCardMini
          v-for="product in products"
          :key="product.id"
          :product="product"
          @open-detail="openDetail"
          @quick-add="quickAdd"
        />
      </div>

      <!-- Infinite scroll trigger -->
      <div ref="trigger" class="mt-4 h-10" />

      <!-- Loading more -->
      <div
        v-if="isLoading && products.length > 0"
        class="flex items-center justify-center gap-2 py-6"
      >
        <Icon name="eos-icons:loading" size="20" class="text-emerald-500" />
        <span class="text-xs text-gray-400 dark:text-neutral-500">{{
          $t('common.loadingMore')
        }}</span>
      </div>
    </div>

    <!-- Product detail modal -->
    <ProductDetailModal
      :product="selectedProduct"
      @close="selectedProduct = null"
    />

    <!-- Affiliate market modal -->
    <ProductMarketModal
      :is-open="!!marketProduct"
      :product="marketProduct"
      @close="marketProduct = null"
    />

    <!-- Cart sidebar -->
    <CartSidebar :is-open="showCart" @close="showCart = false" />
  </HomeLayout>
</template>

<script setup lang="ts">
import type { IProduct } from '~~/layers/commerce/app/types/commerce.types'
import HomeLayout from '~/layouts/HomeLayout.vue'
import ProductCardMini from '~/components/shop/ProductCardMini.vue'
import CartSidebar from '~/components/shop/CartSidebar.vue'
import ProductDetailModal from '~~/layers/commerce/app/components/modals/ProductDetailModal.vue'
import ProductMarketModal from '~~/layers/commerce/app/components/modals/ProductMarketModal.vue'
import { notify } from '@kyvg/vue3-notification'

const { setThriftPage } = useSeo()
setThriftPage()

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
      isThrift: true,
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
  if (!variant) {
    openDetail(product)
    return
  }
  try {
    await addToCart(variant.id, 1)
    notify({ type: 'success', text: `${product.title} added to cart` })
    showCart.value = true
  } catch {
    /* useCart handles error notification */
  }
}

onMounted(() => {
  load()
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting && hasMore.value && !isLoading.value) {
        load()
      }
    },
    { rootMargin: '200px' },
  )
  if (trigger.value) observer.observe(trigger.value)
})

onUnmounted(() => {
  observer?.disconnect()
  if (searchTimer) clearTimeout(searchTimer)
})
</script>
