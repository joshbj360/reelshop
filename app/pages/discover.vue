<template>
  <HomeLayout :narrow-feed="false" :hide-right-sidebar="true">
    <div class="relative w-full pb-20 md:pb-0">
      <!-- ─── STICKY HEADER ──────────────────────────────────────────────── -->
      <div
        class="sticky top-0 z-20 -mx-4 border-b border-gray-100 bg-white/90 px-4 pb-3 pt-4 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/90"
      >
        <div class="mb-3 flex items-center justify-between gap-3">
          <h1
            class="text-xl font-extrabold tracking-tight text-gray-900 dark:text-neutral-100"
          >
            Discover
          </h1>
          <!-- Search -->
          <div class="relative flex-1 sm:max-w-sm">
            <Icon
              name="mdi:magnify"
              size="18"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500"
            />
            <input
              v-model="searchInput"
              type="text"
              :placeholder="searchPlaceholder"
              class="w-full rounded-full border border-transparent bg-gray-100/80 py-2 pl-9 pr-8 text-[13px] text-gray-900 placeholder-gray-400 transition-all focus:border-brand/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/10 dark:bg-neutral-800/80 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:bg-neutral-800"
            />
            <button
              v-if="searchInput"
              @click="searchInput = ''"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 hover:text-gray-700 dark:hover:text-neutral-200"
            >
              <Icon name="mdi:close" size="13" />
            </button>
          </div>
        </div>

        <!-- Tab Bar -->
        <div
          class="scrollbar-hide -mx-1 flex gap-1 overflow-x-auto px-1 pb-0.5"
        >
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            class="flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-all"
            :class="
              activeTab === tab.key
                ? 'bg-brand text-white shadow-sm shadow-brand/30'
                : 'text-gray-600 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
            "
          >
            <Icon :name="tab.icon" size="15" />
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- ────────────────────────────────────────────────────────────────── -->
      <!-- TAB: TRENDING                                                       -->
      <!-- ────────────────────────────────────────────────────────────────── -->
      <div v-if="activeTab === 'trending'" class="mt-5 space-y-8">
        <!-- Loading -->
        <div v-if="trendingLoading" class="space-y-8">
          <div class="flex gap-2 overflow-x-auto pb-1">
            <div
              v-for="n in 10"
              :key="n"
              class="h-8 w-20 shrink-0 animate-pulse rounded-full bg-gray-100 dark:bg-neutral-800"
            />
          </div>
          <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <div
              v-for="n in 8"
              :key="n"
              class="aspect-[4/5] animate-pulse rounded-2xl bg-gray-100 dark:bg-neutral-800"
            />
          </div>
        </div>

        <template v-else>
          <!-- Trending Tags Chips -->
          <section v-if="trendingTags.length">
            <div class="mb-3 flex items-center gap-2">
              <Icon name="mdi:fire" size="18" class="text-orange-500" />
              <h2
                class="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-neutral-300"
              >
                Trending Tags
              </h2>
            </div>
            <div class="scrollbar-hide flex flex-wrap gap-2">
              <button
                v-for="tag in trendingTags"
                :key="tag.id"
                @click="openTagView(tag)"
                class="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-gray-700 transition-all hover:border-brand/40 hover:bg-brand/5 hover:text-brand dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-brand/50 dark:hover:text-brand"
              >
                <span class="text-gray-400 dark:text-neutral-500">#</span>
                {{ tag.name }}
                <span
                  class="rounded-full bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-500 dark:bg-neutral-800 dark:text-neutral-400"
                  >{{ tag._count.products }}</span
                >
              </button>
            </div>
          </section>

          <!-- Trending Products -->
          <section v-if="trendingProducts.length">
            <div class="mb-3 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Icon name="mdi:trending-up" size="18" class="text-brand" />
                <h2
                  class="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-neutral-300"
                >
                  Hot Right Now
                </h2>
              </div>
              <button
                @click="activeTab = 'products'"
                class="text-xs font-semibold text-brand hover:underline"
              >
                See all →
              </button>
            </div>
            <div
              class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            >
              <ProductCardMini
                v-for="product in trendingProducts"
                :key="product.id"
                :product="product"
                @open-detail="openDetail"
              />
            </div>
          </section>

          <!-- Featured Sellers -->
          <section v-if="featuredSellers.length">
            <div class="mb-3 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Icon
                  name="mdi:store-check-outline"
                  size="18"
                  class="text-brand"
                />
                <h2
                  class="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-neutral-300"
                >
                  Top Stores
                </h2>
              </div>
              <button
                @click="activeTab = 'sellers'"
                class="text-xs font-semibold text-brand hover:underline"
              >
                See all →
              </button>
            </div>
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <NuxtLink
                v-for="seller in featuredSellers"
                :key="seller.id"
                :to="`/sellers/profile/${seller.store_slug}`"
                class="group flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 text-center transition-all hover:border-brand/20 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div
                  class="h-14 w-14 overflow-hidden rounded-full border-2 border-gray-100 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <img
                    v-if="seller.store_logo"
                    :src="seller.store_logo"
                    :alt="seller.store_name"
                    class="h-full w-full object-cover"
                  />
                  <div
                    v-else
                    class="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand to-purple-600"
                  >
                    <Icon name="mdi:storefront" size="22" class="text-white" />
                  </div>
                </div>
                <div class="w-full min-w-0">
                  <p
                    class="truncate text-xs font-bold text-gray-900 transition-colors group-hover:text-brand dark:text-neutral-100"
                  >
                    {{ seller.store_name }}
                  </p>
                  <p class="text-[11px] text-gray-400 dark:text-neutral-500">
                    {{ formatNum(seller.followers_count || 0) }} followers
                  </p>
                </div>
              </NuxtLink>
            </div>
          </section>

          <!-- Empty trending -->
          <div
            v-if="
              !trendingProducts.length &&
              !trendingTags.length &&
              !featuredSellers.length
            "
            class="py-24 text-center"
          >
            <Icon
              name="mdi:fire-off"
              size="48"
              class="mx-auto mb-3 text-gray-300 dark:text-neutral-600"
            />
            <p class="text-sm text-gray-500 dark:text-neutral-400">
              Nothing trending yet
            </p>
          </div>
        </template>
      </div>

      <!-- ────────────────────────────────────────────────────────────────── -->
      <!-- TAB: PRODUCTS                                                       -->
      <!-- ────────────────────────────────────────────────────────────────── -->
      <div v-else-if="activeTab === 'products'" class="mt-5">
        <!-- Filter pills -->
        <div class="scrollbar-hide mb-4 flex gap-2 overflow-x-auto pb-1">
          <button
            v-for="f in productFilters"
            :key="f.key"
            @click="productFilter = f.key"
            class="shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-all"
            :class="
              productFilter === f.key
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'border border-gray-200 text-gray-600 hover:border-gray-400 dark:border-neutral-700 dark:text-neutral-400'
            "
          >
            {{ f.label }}
          </button>
        </div>

        <!-- Skeleton -->
        <div
          v-if="productsLoading && !products.length"
          class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          <div
            v-for="n in 10"
            :key="n"
            class="aspect-[4/5] animate-pulse rounded-2xl bg-gray-100 dark:bg-neutral-800"
          />
        </div>

        <!-- No results -->
        <div
          v-else-if="!productsLoading && !products.length"
          class="py-24 text-center"
        >
          <Icon
            name="mdi:text-search"
            size="48"
            class="mx-auto mb-3 text-gray-300 dark:text-neutral-600"
          />
          <p class="text-sm text-gray-500 dark:text-neutral-400">
            No products found{{ searchInput ? ` for "${searchInput}"` : '' }}
          </p>
          <button
            v-if="searchInput"
            @click="searchInput = ''"
            class="mt-3 rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Clear search
          </button>
        </div>

        <!-- Grid -->
        <div
          v-else
          class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          <ProductCardMini
            v-for="product in products"
            :key="product.id"
            :product="product"
            @open-detail="openDetail"
          />
        </div>

        <!-- Infinite scroll trigger -->
        <div ref="productTrigger" class="mt-6 h-10" />
        <div
          v-if="productsLoading && products.length"
          class="flex justify-center py-8"
        >
          <Icon name="eos-icons:loading" size="24" class="text-brand" />
        </div>
      </div>

      <!-- ────────────────────────────────────────────────────────────────── -->
      <!-- TAB: SELLERS                                                        -->
      <!-- ────────────────────────────────────────────────────────────────── -->
      <div v-else-if="activeTab === 'sellers'" class="mt-5">
        <!-- Skeleton -->
        <div
          v-if="sellersLoading && !sellers.length"
          class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        >
          <div
            v-for="n in 8"
            :key="n"
            class="h-48 animate-pulse rounded-2xl bg-gray-100 dark:bg-neutral-800"
          />
        </div>

        <!-- Empty -->
        <div
          v-else-if="!sellersLoading && !sellers.length"
          class="py-24 text-center"
        >
          <Icon
            name="mdi:store-search-outline"
            size="48"
            class="mx-auto mb-3 text-gray-300 dark:text-neutral-600"
          />
          <p class="text-sm text-gray-500 dark:text-neutral-400">
            No stores found{{ searchInput ? ` for "${searchInput}"` : '' }}
          </p>
        </div>

        <!-- Grid -->
        <div
          v-else
          class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        >
          <NuxtLink
            v-for="seller in sellers"
            :key="seller.id"
            :to="`/sellers/profile/${seller.store_slug}`"
            class="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:border-brand/20 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div
              class="relative h-20 overflow-hidden bg-gradient-to-br from-brand to-purple-600"
            >
              <img
                v-if="seller.store_banner"
                :src="seller.store_banner"
                :alt="seller.store_name"
                class="h-full w-full object-cover opacity-80"
              />
            </div>
            <div class="relative -mt-6 px-3 pb-4">
              <div
                class="mb-2 h-12 w-12 overflow-hidden rounded-xl border-2 border-white bg-white shadow-sm dark:border-neutral-900 dark:bg-neutral-900"
              >
                <img
                  v-if="seller.store_logo"
                  :src="seller.store_logo"
                  :alt="seller.store_name"
                  class="h-full w-full object-cover"
                />
                <div
                  v-else
                  class="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand to-purple-600"
                >
                  <Icon name="mdi:storefront" size="18" class="text-white" />
                </div>
              </div>
              <div class="flex items-start justify-between gap-1">
                <div class="min-w-0">
                  <div class="flex items-center gap-1">
                    <p
                      class="truncate text-sm font-bold text-gray-900 transition-colors group-hover:text-brand dark:text-neutral-100"
                    >
                      {{ seller.store_name }}
                    </p>
                    <Icon
                      v-if="seller.is_verified"
                      name="mdi:check-decagram"
                      size="13"
                      class="shrink-0 text-blue-500"
                    />
                  </div>
                  <p
                    class="mt-0.5 text-[11px] text-gray-500 dark:text-neutral-400"
                  >
                    {{ formatNum(seller.followers_count || 0) }} followers ·
                    {{ seller._count?.products || 0 }} items
                  </p>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Infinite scroll trigger -->
        <div ref="sellerTrigger" class="mt-6 h-10" />
        <div
          v-if="sellersLoading && sellers.length"
          class="flex justify-center py-8"
        >
          <Icon name="eos-icons:loading" size="24" class="text-brand" />
        </div>
      </div>

      <!-- ────────────────────────────────────────────────────────────────── -->
      <!-- TAB: PEOPLE                                                         -->
      <!-- ────────────────────────────────────────────────────────────────── -->
      <div v-else-if="activeTab === 'people'" class="mt-5">
        <!-- Hint when no search -->
        <div v-if="!searchInput" class="py-16 text-center">
          <Icon
            name="mdi:account-search-outline"
            size="56"
            class="mx-auto mb-3 text-gray-300 dark:text-neutral-600"
          />
          <p class="text-sm font-medium text-gray-500 dark:text-neutral-400">
            Search by username or name
          </p>
          <p class="mt-1 text-xs text-gray-400 dark:text-neutral-500">
            Type something in the search bar above
          </p>
        </div>

        <!-- Searching -->
        <div v-else-if="peopleLoading" class="space-y-3 pt-2">
          <div
            v-for="n in 5"
            :key="n"
            class="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-neutral-900"
          >
            <div
              class="h-11 w-11 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-neutral-700"
            />
            <div class="flex-1 space-y-1.5">
              <div
                class="h-3.5 w-32 animate-pulse rounded-md bg-gray-200 dark:bg-neutral-700"
              />
              <div
                class="h-3 w-20 animate-pulse rounded-md bg-gray-100 dark:bg-neutral-800"
              />
            </div>
          </div>
        </div>

        <!-- No results -->
        <div
          v-else-if="searchInput && !people.length"
          class="py-16 text-center"
        >
          <p class="text-sm text-gray-500 dark:text-neutral-400">
            No users found for "{{ searchInput }}"
          </p>
        </div>

        <!-- People list -->
        <div v-else-if="people.length" class="space-y-1 pt-1">
          <NuxtLink
            v-for="user in people"
            :key="user.id"
            :to="`/profile/${user.username}`"
            class="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-neutral-900"
          >
            <div
              class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-800"
            >
              <img
                v-if="user.avatar"
                :src="user.avatar"
                :alt="user.username"
                class="h-full w-full object-cover"
              />
              <Icon
                v-else
                name="mdi:account"
                size="22"
                class="text-gray-400 dark:text-neutral-500"
              />
            </div>
            <div class="min-w-0 flex-1">
              <p
                class="truncate text-sm font-semibold text-gray-900 dark:text-neutral-100"
              >
                {{ user.full_name || user.username }}
              </p>
              <p class="truncate text-xs text-gray-500 dark:text-neutral-400">
                @{{ user.username }}
              </p>
            </div>
            <Icon
              name="mdi:chevron-right"
              size="18"
              class="shrink-0 text-gray-300 dark:text-neutral-600"
            />
          </NuxtLink>
        </div>
      </div>

      <!-- ────────────────────────────────────────────────────────────────── -->
      <!-- TAB: TAGS                                                           -->
      <!-- ────────────────────────────────────────────────────────────────── -->
      <div v-else-if="activeTab === 'tags'" class="mt-5">
        <!-- Tag detail view: products for a selected tag -->
        <div v-if="selectedTag">
          <div class="mb-4 flex items-center gap-3">
            <button
              @click="
                selectedTag = null
                tagProducts = []
                tagTotal = 0
              "
              class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
            >
              <Icon name="mdi:arrow-left" size="18" />
            </button>
            <div>
              <h2
                class="text-base font-bold text-gray-900 dark:text-neutral-100"
              >
                #{{ selectedTag.name }}
              </h2>
              <p class="text-xs text-gray-500 dark:text-neutral-400">
                {{ tagTotal }} product{{ tagTotal !== 1 ? 's' : '' }}
              </p>
            </div>
          </div>

          <!-- Tag products loading -->
          <div
            v-if="tagProductsLoading && !tagProducts.length"
            class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4"
          >
            <div
              v-for="n in 8"
              :key="n"
              class="aspect-[4/5] animate-pulse rounded-2xl bg-gray-100 dark:bg-neutral-800"
            />
          </div>

          <!-- Tag products empty -->
          <div
            v-else-if="!tagProductsLoading && !tagProducts.length"
            class="py-20 text-center"
          >
            <p class="text-sm text-gray-500 dark:text-neutral-400">
              No products for this tag
            </p>
          </div>

          <!-- Tag products grid -->
          <div
            v-else
            class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4"
          >
            <ProductCardMini
              v-for="product in tagProducts"
              :key="product.id"
              :product="product"
              @open-detail="openDetail"
            />
          </div>
        </div>

        <!-- Tag browser -->
        <div v-else>
          <!-- Loading -->
          <div v-if="tagsLoading" class="flex flex-wrap gap-2">
            <div
              v-for="n in 20"
              :key="n"
              class="h-9 animate-pulse rounded-full bg-gray-100 dark:bg-neutral-800"
              :style="{ width: `${60 + Math.random() * 60}px` }"
            />
          </div>

          <!-- Empty tags -->
          <div v-else-if="!allTags.length" class="py-24 text-center">
            <Icon
              name="mdi:tag-outline"
              size="48"
              class="mx-auto mb-3 text-gray-300 dark:text-neutral-600"
            />
            <p class="text-sm text-gray-500 dark:text-neutral-400">
              No tags yet
            </p>
          </div>

          <!-- Tag cloud -->
          <div v-else class="flex flex-wrap gap-2.5">
            <button
              v-for="tag in allTags"
              :key="tag.id"
              @click="openTagView(tag)"
              class="group flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-brand/30 hover:bg-brand/5 hover:text-brand dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-brand/50 dark:hover:text-brand"
            >
              <span
                class="font-bold text-brand opacity-60 group-hover:opacity-100"
                >#</span
              >
              {{ tag.name }}
              <span
                class="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500 group-hover:bg-brand/10 group-hover:text-brand dark:bg-neutral-800 dark:text-neutral-400"
              >
                {{ tag._count.products }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── MODALS ──────────────────────────────────────────────────────── -->
    <ProductDetailModal
      :product="selectedProduct"
      @close="selectedProduct = null"
    />
  </HomeLayout>
</template>

<script setup lang="ts">
import type { IProduct } from '~~/layers/commerce/app/types/commerce.types'
import HomeLayout from '~/layouts/HomeLayout.vue'
import ProductCardMini from '~/components/shop/ProductCardMini.vue'
import ProductDetailModal from '~~/layers/commerce/app/components/modals/ProductDetailModal.vue'

const { setDiscoverPage } = useSeo()
setDiscoverPage()

// ── Tabs ────────────────────────────────────────────────────────────────────
const tabs = [
  { key: 'trending', label: 'Trending', icon: 'mdi:fire' },
  { key: 'products', label: 'Products', icon: 'mdi:shopping-outline' },
  { key: 'sellers', label: 'Sellers', icon: 'mdi:storefront-outline' },
  { key: 'people', label: 'People', icon: 'mdi:account-group-outline' },
  { key: 'tags', label: 'Tags', icon: 'mdi:tag-outline' },
] as const

type TabKey = (typeof tabs)[number]['key']
const activeTab = ref<TabKey>('trending')

const searchInput = ref('')

const searchPlaceholder = computed(() => {
  const map: Record<TabKey, string> = {
    trending: 'Search trending…',
    products: 'Search products…',
    sellers: 'Search stores…',
    people: 'Search people by name or @username',
    tags: 'Search tags…',
  }
  return map[activeTab.value]
})

// Reset search when switching tabs
watch(activeTab, () => {
  searchInput.value = ''
  selectedTag.value = null
})

const selectedProduct = ref<IProduct | null>(null)
const openDetail = (product: IProduct) => {
  selectedProduct.value = product
}
const formatNum = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

// ── TRENDING ─────────────────────────────────────────────────────────────────
const trendingLoading = ref(false)
const trendingProducts = ref<IProduct[]>([])
const trendingTags = ref<any[]>([])
const featuredSellers = ref<any[]>([])

const loadTrending = async () => {
  trendingLoading.value = true
  try {
    const res = await $fetch<any>('/api/feed/trending')
    if (res?.data) {
      trendingProducts.value = res.data.trendingProducts ?? []
      trendingTags.value = res.data.trendingTags ?? []
      featuredSellers.value = res.data.featuredSellers ?? []
    }
  } catch {
    //
  } finally {
    trendingLoading.value = false
  }
}

// ── PRODUCTS ─────────────────────────────────────────────────────────────────
const productFilters = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New Arrivals' },
  { key: 'thrift', label: 'Thrift' },
  { key: 'deals', label: 'On Sale' },
]
const productFilter = ref('all')
const products = ref<IProduct[]>([])
const productsTotal = ref(0)
const productsLoading = ref(false)
const productTrigger = ref<HTMLElement | null>(null)
const PROD_LIMIT = 24

const { fetchProducts } = useProduct()

const loadProducts = async (reset = false) => {
  if (reset) {
    products.value = []
    productsTotal.value = 0
  }
  if (productsLoading.value) return
  productsLoading.value = true
  try {
    const filters: any = { status: 'PUBLISHED' }
    if (searchInput.value.trim()) filters.search = searchInput.value.trim()
    if (productFilter.value === 'thrift') filters.isThrift = true
    if (productFilter.value === 'deals') filters.minDiscount = 1
    const result = await fetchProducts({
      ...filters,
      limit: PROD_LIMIT,
      offset: products.value.length,
    })
    products.value.push(...(result?.products ?? []))
    productsTotal.value = result?.total ?? 0
  } catch {
    //
  } finally {
    productsLoading.value = false
  }
}

// ── SELLERS ───────────────────────────────────────────────────────────────────
const sellers = ref<any[]>([])
const sellersTotal = ref(0)
const sellersLoading = ref(false)
const sellerTrigger = ref<HTMLElement | null>(null)

const loadSellers = async (reset = false) => {
  if (reset) {
    sellers.value = []
    sellersTotal.value = 0
  }
  if (sellersLoading.value) return
  sellersLoading.value = true
  try {
    const res = await $fetch<any>('/api/seller/featured', {
      params: {
        limit: 20,
        offset: sellers.value.length,
        search: searchInput.value.trim() || undefined,
      },
    })
    if (res?.data) {
      sellers.value.push(...res.data)
      sellersTotal.value = res.meta?.total ?? res.data.length
    }
  } catch {
    //
  } finally {
    sellersLoading.value = false
  }
}

// ── PEOPLE ─────────────────────────────────────────────────────────────────
const people = ref<any[]>([])
const peopleLoading = ref(false)

const searchPeople = async (q: string) => {
  if (!q || q.trim().length < 1) {
    people.value = []
    return
  }
  peopleLoading.value = true
  try {
    const res = await $fetch<any>('/api/search', {
      params: { q: q.replace(/^@/, '').trim(), type: 'users', limit: 20 },
    })
    people.value = res?.data?.users ?? []
  } catch {
    people.value = []
  } finally {
    peopleLoading.value = false
  }
}

// ── TAGS ──────────────────────────────────────────────────────────────────
const allTags = ref<any[]>([])
const tagsLoading = ref(false)
const selectedTag = ref<any | null>(null)
const tagProducts = ref<IProduct[]>([])
const tagTotal = ref(0)
const tagProductsLoading = ref(false)

const loadTags = async (search?: string) => {
  tagsLoading.value = true
  try {
    const res = await $fetch<any>('/api/tags', {
      params: { limit: 100, search: search || undefined },
    })
    allTags.value = res?.data ?? []
  } catch {
    //
  } finally {
    tagsLoading.value = false
  }
}

const openTagView = async (tag: any) => {
  selectedTag.value = tag
  tagProducts.value = []
  tagTotal.value = 0
  tagProductsLoading.value = true
  try {
    const res = await $fetch<any>(`/api/tags/${tag.id}/products`)
    tagProducts.value = res?.data?.products ?? []
    tagTotal.value = res?.data?.total ?? 0
  } catch {
    //
  } finally {
    tagProductsLoading.value = false
  }
  // Switch to tags tab if not already there
  activeTab.value = 'tags'
}

// ── Watchers & search debouncing ──────────────────────────────────────────
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const debouncedSearchAction = (val: string) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    if (activeTab.value === 'products') loadProducts(true)
    else if (activeTab.value === 'sellers') loadSellers(true)
    else if (activeTab.value === 'people') searchPeople(val)
    else if (activeTab.value === 'tags') loadTags(val)
  }, 350)
}

watch(searchInput, (val) => debouncedSearchAction(val))
watch(productFilter, () => loadProducts(true))

// Load data when tab changes
watch(activeTab, (tab) => {
  if (tab === 'trending' && !trendingProducts.value.length) loadTrending()
  else if (tab === 'products' && !products.value.length) loadProducts()
  else if (tab === 'sellers' && !sellers.value.length) loadSellers()
  else if (tab === 'tags' && !allTags.value.length) loadTags()
})

// ── Infinite scroll ───────────────────────────────────────────────────────
const productHasMore = computed(
  () => products.value.length < productsTotal.value,
)
const sellerHasMore = computed(() => sellers.value.length < sellersTotal.value)

onMounted(async () => {
  // Handle deep-link from search overlay (?tab=tags&tagId=N)
  const route = useRoute()
  if (route.query.tab === 'tags') {
    activeTab.value = 'tags'
    await loadTags()
    const tagId = Number(route.query.tagId)
    if (tagId) {
      const tag = allTags.value.find((t) => t.id === tagId)
      if (tag) openTagView(tag)
    }
    return
  }

  // Initial load for the trending tab
  loadTrending()

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0]?.isIntersecting) return
      if (activeTab.value === 'products' && productHasMore.value) loadProducts()
      else if (activeTab.value === 'sellers' && sellerHasMore.value)
        loadSellers()
    },
    { rootMargin: '400px' },
  )

  watchEffect(() => {
    if (productTrigger.value) observer.observe(productTrigger.value)
    if (sellerTrigger.value) observer.observe(sellerTrigger.value)
  })

  onUnmounted(() => observer.disconnect())
})
</script>

<style scoped>
.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
