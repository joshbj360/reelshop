<template>
  <HomeLayout :narrow-feed="false" :hide-right-sidebar="false">
    <div class="max-w-full pb-20 md:pb-6">
        
      <!-- ─── LOADING SKELETON ────────────────────────────────────────── -->
      <div v-if="pageLoading" class="animate-pulse space-y-4">
        <div class="h-40 md:h-48 bg-gray-200 dark:bg-neutral-800 -mx-2 sm:-mx-6" />
        <div class="flex gap-3 px-2 sm:px-4">
          <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl border-4 border-white dark:border-neutral-950 bg-gray-200 dark:bg-neutral-800 -mt-10 sm:-mt-12 shrink-0" />
          <div class="flex-1 space-y-2 pt-2">
            <div class="h-6 bg-gray-200 dark:bg-neutral-800 rounded w-1/3" />
            <div class="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-1/4" />
          </div>
        </div>
      </div>

      <!-- ─── ERROR STATE ─────────────────────────────────────────────── -->
      <div v-else-if="loadError || !seller" class="text-center py-20 px-4">
        <Icon name="mdi:store-off-outline" size="64" class="mx-auto text-gray-400 dark:text-neutral-600 mb-4" />
        <h2 class="text-2xl font-bold text-gray-900 dark:text-neutral-100">Store Not Found</h2>
        <p class="text-gray-600 dark:text-neutral-400 mt-2">The store you are looking for does not exist or may have been moved.</p>
        <NuxtLink to="/" class="mt-6 inline-block bg-brand text-white px-6 py-2.5 rounded-xl hover:bg-brand/90 transition-colors font-semibold shadow-sm">
          Browse All Products
        </NuxtLink>
      </div>

      <!-- ─── STORE PROFILE CONTENT ───────────────────────────────────── -->
      <div v-else class="text-gray-900 dark:text-neutral-100">
        
        <!-- Cover Image with Gradient Overlay -->
        <div class="relative h-40 md:h-48 bg-gradient-to-br from-[#f02c56] to-purple-600 -mx-2 sm:-mx-6 overflow-hidden">
          <img 
            v-if="seller.store_banner"
            :src="seller.store_banner" 
            :alt="`${seller.store_name} cover`" 
            class="w-full h-full object-cover" 
          />
          <div class="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-neutral-950/90 via-transparent to-transparent" />
        </div>

        <div class="px-2 sm:px-4">
          <!-- Profile Header -->
          <div class="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 -mt-12 sm:-mt-14 relative z-10">
            
            <!-- Store Logo -->
            <div class="relative shrink-0 group">
              <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl border-4 border-white dark:border-neutral-950 bg-white dark:bg-neutral-900 shadow-md overflow-hidden transition-transform group-hover:scale-105">
                <img v-if="seller.store_logo" :src="seller.store_logo" :alt="seller.store_name" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f02c56] to-purple-600">
                  <Icon name="mdi:storefront" size="36" class="text-white" />
                </div>
              </div>
              <div v-if="seller.is_verified" class="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border-2 border-white dark:border-neutral-950 shadow-sm" title="Verified Store">
                <Icon name="mdi:check" size="12" class="text-white" />
              </div>
            </div>

            <!-- Store Info -->
            <div class="flex-1 pb-1 sm:pb-2">
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-neutral-100 flex items-center gap-2">
                    {{ seller.store_name }}
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400 align-middle">
                      {{ (seller as any).default_currency ?? 'NGN' }}
                    </span>
                  </h1>
                  <p class="text-sm text-gray-500 dark:text-neutral-400 mt-0.5 font-medium">@{{ seller.store_slug }}</p>
                  
                  <div class="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-600 dark:text-neutral-400 mt-2">
                    <div v-if="seller.store_location" class="flex items-center gap-1">
                      <Icon name="mdi:map-marker" size="16" class="text-brand" />
                      <span>{{ seller.store_location }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <Icon name="mdi:clock-outline" size="16" class="text-brand" />
                      <span>Joined {{ formatDate(seller.created_at) }}</span>
                    </div>
                    <a v-if="seller.store_website" :href="seller.store_website" target="_blank" rel="noopener" class="flex items-center gap-1 text-brand hover:text-[#d81b36] transition-colors">
                      <Icon name="mdi:web" size="16" />
                      <span>Website</span>
                    </a>
                  </div>
                </div>

                <!-- Action Buttons (Desktop) -->
                <div class="hidden sm:flex items-center gap-2 mt-2 sm:mt-0">
                  <button 
                    v-if="profileStore.isLoggedIn"
                    @click="toggleFollow" 
                    :disabled="followLoading"
                    class="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-1.5 min-w-[120px] justify-center" 
                    :class="isFollowing 
                      ? 'bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-neutral-200 hover:bg-gray-200 dark:hover:bg-neutral-700' 
                      : 'bg-brand text-white hover:bg-[#d81b36] shadow-sm shadow-brand/20'"
                  >
                    <Icon v-if="followLoading" name="eos-icons:loading" size="16" class="animate-spin" />
                    <template v-else>
                      <Icon :name="isFollowing ? 'mdi:check' : 'mdi:plus'" size="16" />
                      <span>{{ isFollowing ? 'Following' : 'Follow' }}</span>
                    </template>
                  </button>
                  <button class="p-2.5 rounded-xl font-semibold border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-gray-600 dark:text-neutral-300">
                    <Icon name="mdi:message-text-outline" size="18" />
                  </button>
                  <button class="p-2.5 rounded-xl font-semibold border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-gray-600 dark:text-neutral-300">
                    <Icon name="mdi:share-variant-outline" size="18" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Stats Bar -->
          <div class="grid grid-cols-3 gap-2 sm:gap-3 py-4 sm:py-5">
            <div class="bg-white dark:bg-neutral-900 rounded-xl p-3 sm:p-4 text-center border border-gray-100 dark:border-neutral-800 shadow-sm">
              <Icon name="mdi:package-variant" size="22" class="mx-auto mb-1 text-brand" />
              <div class="font-bold text-lg sm:text-xl text-gray-900 dark:text-neutral-100">{{ total.toLocaleString() }}</div>
              <div class="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-neutral-400 mt-0.5">Products</div>
            </div>
            <div class="bg-white dark:bg-neutral-900 rounded-xl p-3 sm:p-4 text-center border border-gray-100 dark:border-neutral-800 shadow-sm">
              <Icon name="mdi:account-group" size="22" class="mx-auto mb-1 text-brand" />
              <div class="font-bold text-lg sm:text-xl text-gray-900 dark:text-neutral-100">{{ formatNumber(seller.followers_count || 0) }}</div>
              <div class="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-neutral-400 mt-0.5">Followers</div>
            </div>
            <div class="bg-white dark:bg-neutral-900 rounded-xl p-3 sm:p-4 text-center border border-gray-100 dark:border-neutral-800 shadow-sm">
              <Icon name="mdi:star" size="22" class="mx-auto mb-1 text-yellow-500" />
              <div class="font-bold text-lg sm:text-xl text-gray-900 dark:text-neutral-100">4.8</div>
              <div class="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-neutral-400 mt-0.5">Rating</div>
            </div>
          </div>

          <!-- Action Buttons (Mobile) -->
          <div class="flex sm:hidden gap-2 pb-5">
            <button 
              v-if="profileStore.isLoggedIn"
              @click="toggleFollow" 
              :disabled="followLoading"
              class="flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm" 
              :class="isFollowing 
                ? 'bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-neutral-200' 
                : 'bg-brand text-white shadow-brand/20'"
            >
              <Icon v-if="followLoading" name="eos-icons:loading" size="16" class="animate-spin" />
              <template v-else>
                <Icon :name="isFollowing ? 'mdi:check' : 'mdi:plus'" size="16" />
                <span>{{ isFollowing ? 'Following' : 'Follow' }}</span>
              </template>
            </button>
            <button class="px-4 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 transition-all flex items-center justify-center text-gray-700 dark:text-neutral-300">
              <Icon name="mdi:message-text-outline" size="18" />
            </button>
          </div>

          <!-- Tabs Navigation -->
          <div class="flex gap-1 bg-gray-100 dark:bg-neutral-800/60 p-1.5 rounded-xl mb-5">
            <button 
              @click="activeTab = 'products'" 
              class="tab-button" :class="{ 'active': activeTab === 'products' }"
            >
              <Icon name="mdi:grid" size="18" />
              <span>Products</span>
            </button>
            <button 
              @click="activeTab = 'about'" 
              class="tab-button" :class="{ 'active': activeTab === 'about' }"
            >
              <Icon name="mdi:information-outline" size="18" />
              <span>About</span>
            </button>
            <button 
              @click="activeTab = 'reviews'" 
              class="tab-button" :class="{ 'active': activeTab === 'reviews' }"
            >
              <Icon name="mdi:star-outline" size="18" />
              <span>Reviews</span>
            </button>
          </div>
        </div>

        <!-- ─── TAB CONTENT ─────────────────────────────────────────────── -->
        <div class="px-2 sm:px-4 pb-4">
          
          <!-- PRODUCTS TAB -->
          <div v-show="activeTab === 'products'">
            
            <!-- Skeleton for Products -->
            <div v-if="productsLoading && !products.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              <div v-for="i in 8" :key="i" class="animate-pulse bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl p-2">
                <div class="aspect-[4/5] rounded-xl bg-gray-100 dark:bg-neutral-800 mb-2" />
                <div class="space-y-2 px-1">
                  <div class="h-3.5 bg-gray-100 dark:bg-neutral-800 rounded w-3/4" />
                  <div class="h-3.5 bg-gray-100 dark:bg-neutral-800 rounded w-1/2" />
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="!productsLoading && !products.length" class="flex flex-col items-center justify-center py-16 gap-3 bg-gray-50/50 dark:bg-neutral-900/30 rounded-2xl border border-gray-100 dark:border-neutral-800/50">
              <div class="w-16 h-16 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-sm mb-2">
                <Icon name="mdi:package-variant-closed" size="32" class="text-gray-300 dark:text-neutral-600" />
              </div>
              <p class="text-[15px] font-semibold text-gray-600 dark:text-neutral-400">No products listed yet</p>
            </div>

            <!-- Grid -->
            <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              <ProductCardMini
                v-for="product in products"
                :key="product.id"
                :product="product"
                @open-detail="selectedProduct = product"
                @quick-add="quickAdd"
                @market="marketProduct = $event"
              />
            </div>

            <!-- Infinite Scroll Sentinel -->
            <div ref="trigger" class="h-10 mt-4" />

            <!-- Loading More -->
            <div v-if="productsLoading && products.length > 0" class="flex items-center justify-center gap-2 py-6">
              <Icon name="eos-icons:loading" size="24" class="text-brand animate-spin" />
              <span class="text-sm font-medium text-gray-500 dark:text-neutral-400">Loading more...</span>
            </div>
          </div>

          <!-- ABOUT TAB -->
          <div v-show="activeTab === 'about'" class="bg-white dark:bg-neutral-900 rounded-2xl p-5 sm:p-6 border border-gray-100 dark:border-neutral-800 shadow-sm">
            <h3 class="text-lg font-bold mb-3 text-gray-900 dark:text-neutral-100">About {{ seller.store_name }}</h3>
            <p class="text-sm sm:text-[15px] text-gray-600 dark:text-neutral-400 leading-relaxed whitespace-pre-line">
              {{ seller.store_description || 'No description provided yet. This store will update their information soon!' }}
            </p>
            
            <!-- Contact Info -->
            <div class="mt-6 pt-5 border-t border-gray-100 dark:border-neutral-800 space-y-4">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
                  <Icon name="mdi:email-outline" size="16" />
                </div>
                <div class="min-w-0 pt-0.5">
                  <div class="text-[11px] font-bold tracking-wider uppercase text-gray-500 dark:text-neutral-500">Contact Email</div>
                  <div class="text-sm font-medium text-gray-900 dark:text-neutral-200 truncate">
                    <!-- Assuming email is stored in socials or profile, placeholder for now -->
                    contact@{{ seller.store_slug }}.com 
                  </div>
                </div>
              </div>
              <div v-if="seller.store_phone" class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
                  <Icon name="mdi:phone-outline" size="16" />
                </div>
                <div class="min-w-0 pt-0.5">
                  <div class="text-[11px] font-bold tracking-wider uppercase text-gray-500 dark:text-neutral-500">Phone Number</div>
                  <div class="text-sm font-medium text-gray-900 dark:text-neutral-200">{{ seller.store_phone }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- REVIEWS TAB -->
          <div v-show="activeTab === 'reviews'" class="space-y-4">
            <!-- Review Summary -->
            <div class="bg-white dark:bg-neutral-900 rounded-2xl p-5 sm:p-6 border border-gray-100 dark:border-neutral-800 shadow-sm flex items-center gap-5">
              <div class="text-center">
                <div class="text-4xl font-extrabold text-gray-900 dark:text-neutral-100">4.8</div>
                <div class="flex items-center justify-center gap-0.5 mt-1">
                  <Icon v-for="i in 5" :key="i" name="mdi:star" size="16" class="text-yellow-500" />
                </div>
                <div class="text-xs text-gray-500 dark:text-neutral-400 mt-1 font-medium">1,234 reviews</div>
              </div>
              <div class="h-16 w-px bg-gray-200 dark:bg-neutral-800" />
              <div class="flex-1">
                <p class="text-sm text-gray-600 dark:text-neutral-400 italic">"Consistently highly rated by buyers across the platform."</p>
              </div>
            </div>

            <!-- Empty Reviews List -->
            <div class="bg-gray-50/50 dark:bg-neutral-900/30 rounded-2xl p-10 border border-gray-100 dark:border-neutral-800/50 text-center">
              <Icon name="mdi:comment-quote-outline" size="40" class="text-gray-300 dark:text-neutral-600 mb-3" />
              <p class="text-[15px] font-medium text-gray-600 dark:text-neutral-400">Detailed reviews coming soon!</p>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- ─── MODALS ──────────────────────────────────────────────────── -->
    <ProductDetailModal :product="selectedProduct" @close="selectedProduct = null" />
    <ProductMarketModal :is-open="!!marketProduct" :product="marketProduct" @close="marketProduct = null" />

  </HomeLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import HomeLayout from '~/layouts/HomeLayout.vue'
import ProductCardMini from '~/components/shop/ProductCardMini.vue'
import ProductDetailModal from '~/components/modals/ProductDetailModal.vue'
import ProductMarketModal from '~/components/modals/ProductMarketModal.vue'

// Composables & Stores
import { useSellerManagement } from '~~/layers/seller/app/composables/useSellerManagement'
import { useProduct } from '~~/layers/commerce/app/composables/useProduct'
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store'
import { useCart } from '~~/layers/commerce/app/composables/useCart'
import { notify } from '@kyvg/vue3-notification'
import type { IProduct } from '~~/layers/commerce/app/types/commerce.types'

const route = useRoute()
const storeSlug = route.params.storeSlug as string || route.params.store_slug as string

const { loadPublicSeller, currentSeller, sellerCount, getFollowStatus, followSeller, unfollowSeller } = useSellerManagement()
const { fetchSellerProducts, isLoading: productsLoading } = useProduct()
const profileStore = useProfileStore()
const { addToCart } = useCart()

// Page State
const pageLoading = ref(true)
const loadError = ref(false)
const activeTab = ref('products')
const seller = computed(() => currentSeller.value)

// Follow State
const isFollowing = ref(false)
const followLoading = ref(false)

// Product State
const products = ref<IProduct[]>([])
const total = ref(0)
const offset = ref(0)
const LIMIT = 24
const hasMore = computed(() => products.value.length < total.value)

const selectedProduct = ref<IProduct | null>(null)
const marketProduct = ref<IProduct | null>(null)

// Infinite Scroll
const trigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

// ─── METHODS ──────────────────────────────────────────────────────────

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
    // silently fail for infinite scroll, or add error handling
  }
}

const toggleFollow = async () => {
  if (followLoading.value) return
  followLoading.value = true
  
  try {
    if (isFollowing.value) {
      await unfollowSeller(storeSlug)
      isFollowing.value = false
      if (currentSeller.value) {
        (currentSeller.value as any).followers_count = Math.max(0, ((currentSeller.value as any).followers_count ?? 0) - 1)
      }
    } else {
      await followSeller(storeSlug)
      isFollowing.value = true
      if (currentSeller.value) {
        (currentSeller.value as any).followers_count = ((currentSeller.value as any).followers_count ?? 0) + 1
      }
    }
  } catch (e: any) {
    notify({ type: 'error', text: e.message || 'Failed to update follow status' })
  } finally {
    followLoading.value = false
  }
}

const quickAdd = async (product: IProduct) => {
  const variant = product.variants?.[0]
  if (!variant) { 
    selectedProduct.value = product 
    return 
  }
  try {
    await addToCart(variant.id, 1)
    notify({ type: 'success', text: `${product.title} added to cart` })
  } catch { 
    /* useCart handles error notification natively */ 
  }
}

// ─── UTILS ────────────────────────────────────────────────────────────

const formatDate = (dateString?: string | Date) => {
  if (!dateString) return 'Recently'
  const d = new Date(dateString)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(num)
}

// ─── LIFECYCLE ────────────────────────────────────────────────────────

onMounted(async () => {
  try {
    await loadPublicSeller(storeSlug)
  } catch {
    loadError.value = true
  } finally {
    pageLoading.value = false
  }

  if (!loadError.value) {
    // Load follow status in parallel with products (non-blocking)
    if (profileStore.isLoggedIn) {
      getFollowStatus(storeSlug).then(status => { isFollowing.value = status })
    }

    await loadProducts()
    
    observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && hasMore.value && !productsLoading.value) {
        loadProducts()
      }
    }, { rootMargin: '400px' }) // 400px ensures smooth preload before hitting bottom
    
    if (trigger.value) observer.observe(trigger.value)
  }
})

onUnmounted(() => { 
  observer?.disconnect() 
})
</script>

<style scoped>
.tab-button {
  @apply flex-1 py-2.5 px-3 text-center font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2 text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-100 hover:bg-gray-200/50 dark:hover:bg-neutral-700/50;
}

.tab-button.active {
  @apply bg-white dark:bg-neutral-900 text-brand shadow-sm border border-gray-200 dark:border-neutral-700;
}
</style>